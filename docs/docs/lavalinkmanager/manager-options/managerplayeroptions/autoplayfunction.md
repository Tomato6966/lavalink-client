# AutoplayFunction

This Function get's execute when the queue ends (before [queueEnd ](../../#queueend)event fires). If this Function adds a Track to the Queue, it get's played and the event doesn't fire _(but_ [_trackEnd_](../../#trackend) _does)_

```typescript
export const autoPlayFunction = async (player, lastPlayedTrack) => {
    if(lastPlayedTrack.info.sourceName === "spotify") {
        const filtered = player.queue.previous.filter(v => v.info.sourceName === "spotify").slice(0, 5);
        const ids = filtered.map(v => v.info.identifier || v.info.uri.split("/")?.reverse()?.[0] || v.info.uri.split("/")?.reverse()?.[1]);
        if(ids.length >= 2) {
            const res = await player.search({
                query: `seed_tracks=${ids.join(",")}`, //`seed_artists=${artistIds.join(",")}&seed_genres=${genre.join(",")}&seed_tracks=${trackIds.join(",")}`;
                source: "sprec"
            }, lastPlayedTrack.requester).then(response => {
                response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
                return response;
            }).catch(console.warn);
            if(res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => { 
                // transform the track plugininfo so you can figure out if the track is from autoplay or not. 
                track.pluginInfo.clientData = { ...(track.pluginInfo.clientData||{}), fromAutoplay: true }; 
                return track;
            })); 
        }
        return;
    }
    if(lastPlayedTrack.info.sourceName === "youtube" || lastPlayedTrack.info.sourceName === "youtubemusic") {
        const res = await player.search({
            query:`https://www.youtube.com/watch?v=${lastPlayedTrack.info.identifier}&list=RD${lastPlayedTrack.info.identifier}`,
            source: "youtube"
        }, lastPlayedTrack.requester).then(response => {
            response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
            return response;
        }).catch(console.warn);
        if(res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => { 
            // transform the track plugininfo so you can figure out if the track is from autoplay or not. 
            track.pluginInfo.clientData = { ...(track.pluginInfo.clientData||{}), fromAutoplay: true }; 
            return track;
        }));
        return;
    }
    return
};
```
