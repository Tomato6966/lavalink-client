import { DEFAULT_SOURCES, REGEXES } from "./LavalinkManagerStatics";
export const TrackSymbol = Symbol("LC-Track");
export const QueueSymbol = Symbol("LC-Queue");
export const NodeSymbol = Symbol("LC-Node");
export class ManagerUitls {
    constructor(LavalinkManager) {
        this.manager = LavalinkManager;
    }
    buildTrack(data, requester) {
        const encodedTrack = data.encoded || data.encodedTrack || typeof data.track === "string" ? data.track : undefined;
        if (!encodedTrack)
            throw new RangeError("Argument 'data.encoded' / 'data.encodedTrack' / 'data.track' must be present.");
        if (!data.info)
            data.info = {};
        try {
            const r = {
                info: {
                    identifier: data.info?.identifier,
                    title: data.info?.title,
                    author: data.info?.author,
                    duration: data.info?.duration,
                    artworkUrl: data.info?.artworkUrl || ["youtube.", "youtu.be"].some(d => data.info?.uri?.includes?.(d)) ? `https://img.youtube.com/vi/${data.info?.identifier}/mqdefault.jpg` : undefined,
                    uri: data.info?.uri,
                    sourceName: data.info?.sourceName,
                    isSeekable: data.info?.isSeekable,
                    isStream: data.info?.isStream,
                    isrc: data.info?.isrc,
                    requester: data.info?.requester || requester,
                },
                pluginInfo: data.pluginInfo || data.plugin || {},
                encodedTrack
            };
            Object.defineProperty(r, TrackSymbol, { configurable: true, value: true });
            return r;
        }
        catch (error) {
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }
    validatedQuery(queryString, node) {
        if (!node.info)
            throw new Error("No Lavalink Node was provided");
        if (!node.info.sourceManagers?.length)
            throw new Error("Lavalink Node, has no sourceManagers enabled");
        // missing links: beam.pro local getyarn.io clypit pornhub reddit ocreamix soundgasm
        if ((REGEXES.YoutubeMusicRegex.test(queryString) || REGEXES.YoutubeRegex.test(queryString)) && !node.info.sourceManagers.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled");
        }
        if ((REGEXES.SoundCloudMobileRegex.test(queryString) || REGEXES.SoundCloudRegex.test(queryString)) && !node.info.sourceManagers.includes("soundcloud")) {
            throw new Error("Lavalink Node has not 'soundcloud' enabled");
        }
        if (REGEXES.bandcamp.test(queryString) && !node.info.sourceManagers.includes("bandcamp")) {
            throw new Error("Lavalink Node has not 'bandcamp' enabled");
        }
        if (REGEXES.TwitchTv.test(queryString) && !node.info.sourceManagers.includes("twitch")) {
            throw new Error("Lavalink Node has not 'twitch' enabled");
        }
        if (REGEXES.vimeo.test(queryString) && !node.info.sourceManagers.includes("vimeo")) {
            throw new Error("Lavalink Node has not 'vimeo' enabled");
        }
        if (REGEXES.tiktok.test(queryString) && !node.info.sourceManagers.includes("tiktok")) {
            throw new Error("Lavalink Node has not 'tiktok' enabled");
        }
        if (REGEXES.mixcloud.test(queryString) && !node.info.sourceManagers.includes("mixcloud")) {
            throw new Error("Lavalink Node has not 'mixcloud' enabled");
        }
        if (REGEXES.AllSpotifyRegex.test(queryString) && !node.info.sourceManagers.includes("spotify")) {
            throw new Error("Lavalink Node has not 'spotify' enabled");
        }
        if (REGEXES.appleMusic.test(queryString) && !node.info.sourceManagers.includes("applemusic")) {
            throw new Error("Lavalink Node has not 'applemusic' enabled");
        }
        if (REGEXES.AllDeezerRegex.test(queryString) && !node.info.sourceManagers.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled");
        }
        if (REGEXES.AllDeezerRegex.test(queryString) && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'deezer' to work");
        }
        if (REGEXES.musicYandex.test(queryString) && !node.info.sourceManagers.includes("yandexmusic")) {
            throw new Error("Lavalink Node has not 'yandexmusic' enabled");
        }
        const hasSource = queryString.split(":")[0];
        if (queryString.split(" ").length <= 1 || !queryString.split(" ")[0].includes(":"))
            return;
        const source = DEFAULT_SOURCES[hasSource];
        if (!source)
            throw new Error(`Lavalink Node SearchQuerySource: '${hasSource}' is not available`);
        if (source === "amsearch" && !node.info.sourceManagers.includes("applemusic")) {
            throw new Error("Lavalink Node has not 'applemusic' enabled, which is required to have 'amsearch' work");
        }
        if (source === "dzisrc" && !node.info.sourceManagers.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled, which is required to have 'dzisrc' work");
        }
        if (source === "dzsearch" && !node.info.sourceManagers.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled, which is required to have 'dzsearch' work");
        }
        if (source === "dzisrc" && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'dzisrc' to work");
        }
        if (source === "dzsearch" && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'dzsearch' to work");
        }
        if (source === "scsearch" && !node.info.sourceManagers.includes("soundcloud")) {
            throw new Error("Lavalink Node has not 'soundcloud' enabled, which is required to have 'scsearch' work");
        }
        if (source === "speak" && !node.info.sourceManagers.includes("speak")) {
            throw new Error("Lavalink Node has not 'speak' enabled, which is required to have 'speak' work");
        }
        if (source === "tts" && !node.info.sourceManagers.includes("tts")) {
            throw new Error("Lavalink Node has not 'tts' enabled, which is required to have 'tts' work");
        }
        if (source === "ymsearch" && !node.info.sourceManagers.includes("yandexmusic")) {
            throw new Error("Lavalink Node has not 'yandexmusic' enabled, which is required to have 'ymsearch' work");
        }
        if (source === "ytmsearch" && !node.info.sourceManagers.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled, which is required to have 'ytmsearch' work");
        }
        if (source === "ytsearch" && !node.info.sourceManagers.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled, which is required to have 'ytsearch' work");
        }
        return;
    }
}
export class MiniMap extends Map {
    constructor(data) {
        super(data);
    }
    filter(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
}
