// the autoplay function should have added at least 1 song to the queue once the promise is resolved
export const autoPlayFunction = async (player, lastPlayedTrack) => {
    // just do player.set("autoplay_disabled", true) if you want to "disable" autoplay
    // and do player.set("autoplay_disabled", false) if you want to "enable" it again (it's enabled on default)
    const isAutoPlayDisabled = player.get("autoplay_disabled") === true;
    console.log("AUTOPLAY is triggerd", isAutoPlayDisabled ? "and isn't disabled" : "but is disabled");
    if (isAutoPlayDisabled) return;
    if (!lastPlayedTrack) return console.log("Autoplay doesn't have a lastPlayedTrack to use for references");


    // if the last track was from spotify, you can use sprec
    if (lastPlayedTrack.info.sourceName === "spotify") {
        const filtered = player.queue.previous.filter(v => v.info.sourceName === "spotify").slice(0, 5);
        const ids = filtered.map(v => v.info.identifier || v.info.uri.split("/")?.reverse()?.[0] || v.info.uri.split("/")?.reverse()?.[1]);
        if (ids.length >= 2) {
            const res = await player.search({
                query: `seed_tracks=${ids.join(",")}`, //`seed_artists=${artistIds.join(",")}&seed_genres=${genre.join(",")}&seed_tracks=${trackIds.join(",")}`;
                source: "sprec"
            }, lastPlayedTrack.requester).then(response => {
                response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
                return response;
            }).catch(console.warn);
            if (res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => {
                // transform the track plugininfo so you can figure out if the track is from autoplay or not.
                track.pluginInfo.clientData = { ...(track.pluginInfo.clientData || {}), fromAutoplay: true };
                return track;
            }));
        }
        return;
    }

    // if it was from youtube you can use youtube's recommended lists generation
    if (lastPlayedTrack.info.sourceName === "youtube" || lastPlayedTrack.info.sourceName === "youtubemusic") {
        const res = await player.search({
            query: `https://www.youtube.com/watch?v=${lastPlayedTrack.info.identifier}&list=RD${lastPlayedTrack.info.identifier}`,
            source: "youtube"
        }, lastPlayedTrack.requester).then(response => {
            response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
            return response;
        }).catch(console.warn);
        if (res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => {
            // transform the track plugininfo so you can figure out if the track is from autoplay or not.
            track.pluginInfo.clientData = { ...(track.pluginInfo.clientData || {}), fromAutoplay: true };
            return track;
        }));
        return;
    }
    return
};
