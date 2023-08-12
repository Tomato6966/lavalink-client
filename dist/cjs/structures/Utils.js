"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueTrackEnd = exports.MiniMap = exports.ManagerUitls = exports.NodeSymbol = exports.QueueSymbol = exports.UnresolvedTrackSymbol = exports.TrackSymbol = void 0;
const LavalinkManagerStatics_1 = require("./LavalinkManagerStatics");
exports.TrackSymbol = Symbol("LC-Track");
exports.UnresolvedTrackSymbol = Symbol("LC-Track-Unresolved");
exports.QueueSymbol = Symbol("LC-Queue");
exports.NodeSymbol = Symbol("LC-Node");
class ManagerUitls {
    constructor(LavalinkManager) {
        this.manager = LavalinkManager;
    }
    buildTrack(data, requester) {
        const encoded = data.encoded || data.encoded;
        if (!encoded)
            throw new RangeError("Argument 'data.encoded' / 'data.encoded' / 'data.track' must be present.");
        if (!data.info)
            data.info = {};
        try {
            const r = {
                encoded,
                info: {
                    identifier: data.info?.identifier,
                    title: data.info?.title,
                    author: data.info?.author,
                    duration: data.info?.length,
                    artworkUrl: data.info?.artworkUrl || ["youtube.", "youtu.be"].some(d => data.info?.uri?.includes?.(d)) ? `https://img.youtube.com/vi/${data.info?.identifier}/mqdefault.jpg` : undefined,
                    uri: data.info?.uri,
                    sourceName: data.info?.sourceName,
                    isSeekable: data.info?.isSeekable,
                    isStream: data.info?.isStream,
                    isrc: data.info?.isrc,
                },
                pluginInfo: data.pluginInfo || data.plugin || {},
                requester: data.info?.requester || requester,
            };
            Object.defineProperty(r, exports.TrackSymbol, { configurable: true, value: true });
            return r;
        }
        catch (error) {
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }
    /**
     * Validate if a data is euqal to a track
     * @param {Track|any} data the Track to validate
     * @returns {boolean}
     */
    isTrack(data) {
        return typeof data?.encoded === "string" && typeof data?.info === "object";
    }
    validatedQuery(queryString, node) {
        if (!node.info)
            throw new Error("No Lavalink Node was provided");
        if (!node.info.sourceManagers?.length)
            throw new Error("Lavalink Node, has no sourceManagers enabled");
        // missing links: beam.pro local getyarn.io clypit pornhub reddit ocreamix soundgasm
        if ((LavalinkManagerStatics_1.SourceLinksRegexes.YoutubeMusicRegex.test(queryString) || LavalinkManagerStatics_1.SourceLinksRegexes.YoutubeRegex.test(queryString)) && !node.info.sourceManagers.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled");
        }
        if ((LavalinkManagerStatics_1.SourceLinksRegexes.SoundCloudMobileRegex.test(queryString) || LavalinkManagerStatics_1.SourceLinksRegexes.SoundCloudRegex.test(queryString)) && !node.info.sourceManagers.includes("soundcloud")) {
            throw new Error("Lavalink Node has not 'soundcloud' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.bandcamp.test(queryString) && !node.info.sourceManagers.includes("bandcamp")) {
            throw new Error("Lavalink Node has not 'bandcamp' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.TwitchTv.test(queryString) && !node.info.sourceManagers.includes("twitch")) {
            throw new Error("Lavalink Node has not 'twitch' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.vimeo.test(queryString) && !node.info.sourceManagers.includes("vimeo")) {
            throw new Error("Lavalink Node has not 'vimeo' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.tiktok.test(queryString) && !node.info.sourceManagers.includes("tiktok")) {
            throw new Error("Lavalink Node has not 'tiktok' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.mixcloud.test(queryString) && !node.info.sourceManagers.includes("mixcloud")) {
            throw new Error("Lavalink Node has not 'mixcloud' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.AllSpotifyRegex.test(queryString) && !node.info.sourceManagers.includes("spotify")) {
            throw new Error("Lavalink Node has not 'spotify' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.appleMusic.test(queryString) && !node.info.sourceManagers.includes("applemusic")) {
            throw new Error("Lavalink Node has not 'applemusic' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.AllDeezerRegex.test(queryString) && !node.info.sourceManagers.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.AllDeezerRegex.test(queryString) && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'deezer' to work");
        }
        if (LavalinkManagerStatics_1.SourceLinksRegexes.musicYandex.test(queryString) && !node.info.sourceManagers.includes("yandexmusic")) {
            throw new Error("Lavalink Node has not 'yandexmusic' enabled");
        }
        const hasSource = queryString.split(":")[0];
        if (queryString.split(" ").length <= 1 || !queryString.split(" ")[0].includes(":"))
            return;
        const source = LavalinkManagerStatics_1.DefaultSources[hasSource];
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
exports.ManagerUitls = ManagerUitls;
class MiniMap extends Map {
    constructor(data = []) {
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
    map(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return fn(value, key, this);
        });
    }
}
exports.MiniMap = MiniMap;
async function queueTrackEnd(queue, addBackToQueue = false) {
    if (queue.current) { // if there was a current Track -> Add it
        queue.previous.unshift(queue.current);
        if (queue.previous.length > queue.options.maxPreviousTracks)
            queue.previous.splice(queue.options.maxPreviousTracks, queue.previous.length);
    }
    // change the current Track to the next upcoming one
    queue.current = queue.tracks.shift() || null;
    // and if repeatMode == queue, add it back to the queue!
    if (addBackToQueue && queue.current)
        queue.tracks.push(queue.current);
    // save it in the DB
    await queue.utils.save();
    // return the new current Track
    return queue.current;
}
exports.queueTrackEnd = queueTrackEnd;
