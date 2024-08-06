import { URL } from "node:url";
import { isRegExp } from "node:util/types";
import { DefaultSources, LavalinkPlugins, SourceLinksRegexes } from "./LavalinkManagerStatics";
export const TrackSymbol = Symbol("LC-Track");
export const UnresolvedTrackSymbol = Symbol("LC-Track-Unresolved");
export const QueueSymbol = Symbol("LC-Queue");
export const NodeSymbol = Symbol("LC-Node");
/** @hidden */
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/**
 * Parses Node Connection Url: "lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>"
 * @param connectionUrl
 * @returns
 */
export function parseLavalinkConnUrl(connectionUrl) {
    if (!connectionUrl.startsWith("lavalink://"))
        throw new Error(`ConnectionUrl (${connectionUrl}) must start with 'lavalink://'`);
    const parsed = new URL(connectionUrl);
    return {
        authorization: parsed.password,
        id: parsed.username,
        host: parsed.hostname,
        port: Number(parsed.port),
    };
}
export class ManagerUtils {
    LavalinkManager = null;
    constructor(LavalinkManager) {
        this.LavalinkManager = LavalinkManager;
    }
    buildPluginInfo(data, clientData = {}) {
        return {
            clientData: clientData,
            ...(data.pluginInfo || data.plugin || {})
        };
    }
    buildTrack(data, requester) {
        if (!data?.encoded || typeof data.encoded !== "string")
            throw new RangeError("Argument 'data.encoded' must be present.");
        if (!data.info)
            throw new RangeError("Argument 'data.info' must be present.");
        try {
            const r = {
                encoded: data.encoded,
                info: {
                    identifier: data.info.identifier,
                    title: data.info.title,
                    author: data.info.author,
                    duration: data.info.duration || data.info.length,
                    artworkUrl: data.info.artworkUrl || data.pluginInfo?.artworkUrl || data.plugin?.artworkUrl,
                    uri: data.info.uri,
                    sourceName: data.info.sourceName,
                    isSeekable: data.info.isSeekable,
                    isStream: data.info.isStream,
                    isrc: data.info.isrc,
                },
                pluginInfo: this.buildPluginInfo(data),
                requester: typeof this.LavalinkManager?.options?.playerOptions?.requesterTransformer === "function" ? this.LavalinkManager?.options?.playerOptions?.requesterTransformer(data?.requester || requester) : requester,
            };
            Object.defineProperty(r, TrackSymbol, { configurable: true, value: true });
            return r;
        }
        catch (error) {
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }
    /**
     * Builds a UnresolvedTrack to be resolved before being played  .
     * @param query
     * @param requester
     */
    buildUnresolvedTrack(query, requester) {
        if (typeof query === "undefined")
            throw new RangeError('Argument "query" must be present.');
        const unresolvedTrack = {
            encoded: query.encoded || undefined,
            info: query.info ? query.info : query.title ? query : undefined,
            pluginInfo: this.buildPluginInfo(query),
            requester: typeof this.LavalinkManager?.options?.playerOptions?.requesterTransformer === "function" ? this.LavalinkManager?.options?.playerOptions?.requesterTransformer((query?.requester || requester)) : requester,
            async resolve(player) {
                const closest = await getClosestTrack(this, player);
                if (!closest)
                    throw new SyntaxError("No closest Track found");
                for (const prop of Object.getOwnPropertyNames(this))
                    delete this[prop];
                // delete symbol
                delete this[UnresolvedTrackSymbol];
                // assign new symbol
                Object.defineProperty(this, TrackSymbol, { configurable: true, value: true });
                return Object.assign(this, closest);
            }
        };
        if (!this.isUnresolvedTrack(unresolvedTrack))
            throw SyntaxError("Could not build Unresolved Track");
        Object.defineProperty(unresolvedTrack, UnresolvedTrackSymbol, { configurable: true, value: true });
        return unresolvedTrack;
    }
    /**
     * Validate if a data is equal to a node
     * @param data
     */
    isNode(data) {
        if (!data)
            return false;
        const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(data));
        if (!keys.includes("constructor"))
            return false;
        if (!keys.length)
            return false;
        // all required functions
        if (!["connect", "destroy", "destroyPlayer", "fetchAllPlayers", "fetchInfo", "fetchPlayer", "fetchStats", "fetchVersion", "request", "updatePlayer", "updateSession"].every(v => keys.includes(v)))
            return false;
        return true;
    }
    /**
     * Validate if a data is equal to node options
     * @param data
     */
    isNodeOptions(data) {
        if (!data || typeof data !== "object" || Array.isArray(data))
            return false;
        if (typeof data.host !== "string" || !data.host.length)
            return false;
        if (typeof data.port !== "number" || isNaN(data.port) || data.port < 0 || data.port > 65535)
            return false;
        if (typeof data.authorization !== "string" || !data.authorization.length)
            return false;
        if ("secure" in data && typeof data.secure !== "boolean")
            return false;
        if ("sessionId" in data && typeof data.sessionId !== "string")
            return false;
        if ("id" in data && typeof data.id !== "string")
            return false;
        if ("regions" in data && (!Array.isArray(data.regions) || !data.regions.every(v => typeof v === "string")))
            return false;
        if ("poolOptions" in data && typeof data.poolOptions !== "object")
            return false;
        if ("retryAmount" in data && (typeof data.retryAmount !== "number" || isNaN(data.retryAmount) || data.retryAmount <= 0))
            return false;
        if ("retryDelay" in data && (typeof data.retryDelay !== "number" || isNaN(data.retryDelay) || data.retryDelay <= 0))
            return false;
        if ("requestTimeout" in data && (typeof data.requestTimeout !== "number" || isNaN(data.requestTimeout) || data.requestTimeout <= 0))
            return false;
        return true;
    }
    /**
     * Validate if a data is euqal to a track
     * @param data the Track to validate
     * @returns
     */
    isTrack(data) {
        if (!data)
            return false;
        if (data[TrackSymbol] === true)
            return true;
        return typeof data?.encoded === "string" && typeof data?.info === "object" && !("resolve" in data);
    }
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrack(data) {
        if (!data)
            return false;
        if (data[UnresolvedTrackSymbol] === true)
            return true;
        return typeof data === "object" && (("info" in data && typeof data.info.title === "string") || typeof data.encoded === "string") && typeof data.resolve === "function";
    }
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrackQuery(data) {
        return typeof data === "object" && !("info" in data) && typeof data.title === "string";
    }
    async getClosestTrack(data, player) {
        return getClosestTrack(data, player);
    }
    validateQueryString(node, queryString, sourceString) {
        if (!node.info)
            throw new Error("No Lavalink Node was provided");
        if (!node.info.sourceManagers?.length)
            throw new Error("Lavalink Node, has no sourceManagers enabled");
        if (sourceString === "speak" && queryString.length > 100)
            // checks for blacklisted links / domains / queries
            if (this.LavalinkManager.options?.linksBlacklist?.length > 0 && this.LavalinkManager.options?.linksBlacklist.some(v => (typeof v === "string" && (queryString.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(queryString.toLowerCase()))) || isRegExp(v) && v.test(queryString))) {
                throw new Error(`Query string contains a link / word which is blacklisted.`);
            }
        if (!/^https?:\/\//.test(queryString))
            return;
        else if (this.LavalinkManager.options?.linksAllowed === false)
            throw new Error("Using links to make a request is not allowed.");
        // checks for if the query is whitelisted (should only work for links, so it skips the check for no link queries)
        if (this.LavalinkManager.options?.linksWhitelist?.length > 0 && !this.LavalinkManager.options?.linksWhitelist.some(v => (typeof v === "string" && (queryString.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(queryString.toLowerCase()))) || isRegExp(v) && v.test(queryString))) {
            throw new Error(`Query string contains a link / word which isn't whitelisted.`);
        }
        // missing links: beam.pro local getyarn.io clypit pornhub reddit ocreamix soundgasm
        if ((SourceLinksRegexes.YoutubeMusicRegex.test(queryString) || SourceLinksRegexes.YoutubeRegex.test(queryString)) && !node.info?.sourceManagers?.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled");
        }
        if ((SourceLinksRegexes.SoundCloudMobileRegex.test(queryString) || SourceLinksRegexes.SoundCloudRegex.test(queryString)) && !node.info?.sourceManagers?.includes("soundcloud")) {
            throw new Error("Lavalink Node has not 'soundcloud' enabled");
        }
        if (SourceLinksRegexes.bandcamp.test(queryString) && !node.info?.sourceManagers?.includes("bandcamp")) {
            throw new Error("Lavalink Node has not 'bandcamp' enabled (introduced with lavaplayer 2.2.0 or lavalink 4.0.6)");
        }
        if (SourceLinksRegexes.TwitchTv.test(queryString) && !node.info?.sourceManagers?.includes("twitch")) {
            throw new Error("Lavalink Node has not 'twitch' enabled");
        }
        if (SourceLinksRegexes.vimeo.test(queryString) && !node.info?.sourceManagers?.includes("vimeo")) {
            throw new Error("Lavalink Node has not 'vimeo' enabled");
        }
        if (SourceLinksRegexes.tiktok.test(queryString) && !node.info?.sourceManagers?.includes("tiktok")) {
            throw new Error("Lavalink Node has not 'tiktok' enabled");
        }
        if (SourceLinksRegexes.mixcloud.test(queryString) && !node.info?.sourceManagers?.includes("mixcloud")) {
            throw new Error("Lavalink Node has not 'mixcloud' enabled");
        }
        if (SourceLinksRegexes.AllSpotifyRegex.test(queryString) && !node.info?.sourceManagers?.includes("spotify")) {
            throw new Error("Lavalink Node has not 'spotify' enabled");
        }
        if (SourceLinksRegexes.appleMusic.test(queryString) && !node.info?.sourceManagers?.includes("applemusic")) {
            throw new Error("Lavalink Node has not 'applemusic' enabled");
        }
        if (SourceLinksRegexes.AllDeezerRegex.test(queryString) && !node.info?.sourceManagers?.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled");
        }
        if (SourceLinksRegexes.AllDeezerRegex.test(queryString) && node.info?.sourceManagers?.includes("deezer") && !node.info?.sourceManagers?.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'deezer' to work");
        }
        if (SourceLinksRegexes.musicYandex.test(queryString) && !node.info?.sourceManagers?.includes("yandexmusic")) {
            throw new Error("Lavalink Node has not 'yandexmusic' enabled");
        }
        return;
    }
    transformQuery(query) {
        const sourceOfQuery = typeof query === "string" ? undefined : (DefaultSources[(query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()] ?? (query.source?.trim?.()?.toLowerCase?.()));
        const Query = {
            query: typeof query === "string" ? query : query.query,
            extraQueryUrlParams: typeof query !== "string" ? query.extraQueryUrlParams : undefined,
            source: sourceOfQuery ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()
        };
        const foundSource = Object.keys(DefaultSources).find(source => Query.query?.toLowerCase?.()?.startsWith(`${source}:`.toLowerCase()))?.trim?.()?.toLowerCase?.();
        // ignore links...
        if (foundSource && !["https", "http"].includes(foundSource) && DefaultSources[foundSource]) {
            Query.source = DefaultSources[foundSource]; // set the source to ytsearch:
            Query.query = Query.query.slice(`${foundSource}:`.length, Query.query.length); // remove ytsearch: from the query
        }
        return Query;
    }
    transformLavaSearchQuery(query) {
        // transform the query object
        const sourceOfQuery = typeof query === "string" ? undefined : (DefaultSources[(query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()] ?? (query.source?.trim?.()?.toLowerCase?.()));
        const Query = {
            query: typeof query === "string" ? query : query.query,
            types: query.types ? ["track", "playlist", "artist", "album", "text"].filter(v => query.types?.find(x => x.toLowerCase().startsWith(v))) : ["track", "playlist", "artist", "album", /*"text"*/],
            source: sourceOfQuery ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()
        };
        const foundSource = Object.keys(DefaultSources).find(source => Query.query.toLowerCase().startsWith(`${source}:`.toLowerCase()))?.trim?.()?.toLowerCase?.();
        if (foundSource && DefaultSources[foundSource]) {
            Query.source = DefaultSources[foundSource]; // set the source to ytsearch:
            Query.query = Query.query.slice(`${foundSource}:`.length, Query.query.length); // remove ytsearch: from the query
        }
        return Query;
    }
    validateSourceString(node, sourceString) {
        if (!sourceString)
            throw new Error(`No SourceString was provided`);
        const source = DefaultSources[sourceString.toLowerCase().trim()];
        if (!source)
            throw new Error(`Lavalink Node SearchQuerySource: '${sourceString}' is not available`);
        if (!node.info)
            throw new Error("Lavalink Node does not have any info cached yet, not ready yet!");
        if (source === "amsearch" && !node.info?.sourceManagers?.includes("applemusic")) {
            throw new Error("Lavalink Node has not 'applemusic' enabled, which is required to have 'amsearch' work");
        }
        if (source === "dzisrc" && !node.info?.sourceManagers?.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled, which is required to have 'dzisrc' work");
        }
        if (source === "dzsearch" && !node.info?.sourceManagers?.includes("deezer")) {
            throw new Error("Lavalink Node has not 'deezer' enabled, which is required to have 'dzsearch' work");
        }
        if (source === "dzisrc" && node.info?.sourceManagers?.includes("deezer") && !node.info?.sourceManagers?.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'dzisrc' to work");
        }
        if (source === "dzsearch" && node.info?.sourceManagers?.includes("deezer") && !node.info?.sourceManagers?.includes("http")) {
            throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'dzsearch' to work");
        }
        if (source === "scsearch" && !node.info?.sourceManagers?.includes("soundcloud")) {
            throw new Error("Lavalink Node has not 'soundcloud' enabled, which is required to have 'scsearch' work");
        }
        if (source === "speak" && !node.info?.plugins?.find(c => c.name.toLowerCase().includes(LavalinkPlugins.DuncteBot_Plugin.toLowerCase()))) {
            throw new Error("Lavalink Node has not 'speak' enabled, which is required to have 'speak' work");
        }
        if (source === "tts" && !node.info?.plugins?.find(c => c.name.toLowerCase().includes(LavalinkPlugins.GoogleCloudTTS.toLowerCase()))) {
            throw new Error("Lavalink Node has not 'tts' enabled, which is required to have 'tts' work");
        }
        if (source === "ftts" && !(node.info?.sourceManagers?.includes("ftts") || node.info?.sourceManagers?.includes("flowery-tts") || node.info?.sourceManagers?.includes("flowerytts"))) {
            throw new Error("Lavalink Node has not 'flowery-tts' enabled, which is required to have 'ftts' work");
        }
        if (source === "ymsearch" && !node.info?.sourceManagers?.includes("yandexmusic")) {
            throw new Error("Lavalink Node has not 'yandexmusic' enabled, which is required to have 'ymsearch' work");
        }
        if (source === "ytmsearch" && !node.info.sourceManagers?.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled, which is required to have 'ytmsearch' work");
        }
        if (source === "ytsearch" && !node.info?.sourceManagers?.includes("youtube")) {
            throw new Error("Lavalink Node has not 'youtube' enabled, which is required to have 'ytsearch' work");
        }
        return;
    }
}
export class MiniMap extends Map {
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
    toJSON() {
        return [...this.entries()];
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
export async function queueTrackEnd(player) {
    if (player.queue.current && !player.queue.current?.pluginInfo?.clientData?.previousTrack) { // If there was a current Track already and repeatmode === true, add it to the queue.
        player.queue.previous.unshift(player.queue.current);
        if (player.queue.previous.length > player.queue.options.maxPreviousTracks)
            player.queue.previous.splice(player.queue.options.maxPreviousTracks, player.queue.previous.length);
        await player.queue.utils.save();
    }
    // and if repeatMode == queue, add it back to the queue!
    if (player.repeatMode === "queue" && player.queue.current)
        player.queue.tracks.push(player.queue.current);
    // change the current Track to the next upcoming one
    const nextSong = player.queue.tracks.shift();
    if (player.LavalinkManager.utils.isUnresolvedTrack(nextSong))
        await nextSong.resolve(player);
    player.queue.current = nextSong || null;
    // save it in the DB
    await player.queue.utils.save();
    // return the new current Track
    return player.queue.current;
}
async function applyUnresolvedData(resTrack, data, utils) {
    if (!resTrack?.info || !data?.info)
        return;
    if (data.info.uri)
        resTrack.info.uri = data.info.uri;
    if (utils?.LavalinkManager?.options?.playerOptions?.useUnresolvedData === true) { // overwrite values
        if (data.info.artworkUrl?.length)
            resTrack.info.artworkUrl = data.info.artworkUrl;
        if (data.info.title?.length)
            resTrack.info.title = data.info.title;
        if (data.info.author?.length)
            resTrack.info.author = data.info.author;
    }
    else { // only overwrite if undefined / invalid
        if ((resTrack.info.title === 'Unknown title' || resTrack.info.title === "Unspecified description") && resTrack.info.title != data.info.title)
            resTrack.info.title = data.info.title;
        if (resTrack.info.author !== data.info.author)
            resTrack.info.author = data.info.author;
        if (resTrack.info.artworkUrl !== data.info.artworkUrl)
            resTrack.info.artworkUrl = data.info.artworkUrl;
    }
    for (const key of Object.keys(data.info))
        if (typeof resTrack.info[key] === "undefined" && key !== "resolve" && data.info[key])
            resTrack.info[key] = data.info[key]; // add non-existing values
    return resTrack;
}
async function getClosestTrack(data, player) {
    if (!player || !player.node)
        throw new RangeError("No player with a lavalink node was provided");
    if (player.LavalinkManager.utils.isTrack(data))
        return player.LavalinkManager.utils.buildTrack(data, data.requester);
    if (!player.LavalinkManager.utils.isUnresolvedTrack(data))
        throw new RangeError("Track is not an unresolved Track");
    if (!data?.info?.title && typeof data.encoded !== "string" && !data.info.uri)
        throw new SyntaxError("the track uri / title / encoded Base64 string is required for unresolved tracks");
    if (!data.requester)
        throw new SyntaxError("The requester is required");
    // try to decode the track, if possible
    if (typeof data.encoded === "string") {
        const r = await player.node.decode.singleTrack(data.encoded, data.requester);
        if (r)
            return applyUnresolvedData(r, data, player.LavalinkManager.utils);
    }
    // try to fetch the track via a uri if possible
    if (typeof data.info.uri === "string") {
        const r = await player.search({ query: data?.info?.uri }, data.requester).then(v => v.tracks?.[0]);
        if (r)
            return applyUnresolvedData(r, data, player.LavalinkManager.utils);
    }
    // search the track as closely as possible
    const query = [data.info?.title, data.info?.author].filter(str => !!str).join(" by ");
    const sourceName = data.info?.sourceName;
    return await player.search({
        query, source: sourceName !== "twitch" && sourceName !== "flowery-tts" ? sourceName : player.LavalinkManager.options?.playerOptions?.defaultSearchPlatform,
    }, data.requester).then((res) => {
        let trackToUse = null;
        // try to find via author name
        if (data.info.author && !trackToUse)
            trackToUse = res.tracks.find(track => [data.info?.author || "", `${data.info?.author} - Topic`].some(name => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info?.author)) || new RegExp(`^${escapeRegExp(data.info?.title)}$`, "i").test(track.info?.title));
        // try to find via duration
        if (data.info.duration && !trackToUse)
            trackToUse = res.tracks.find(track => (track.info?.duration >= (data.info?.duration - 1500)) && (track?.info.duration <= (data.info?.duration + 1500)));
        // try to find via isrc
        if (data.info.isrc && !trackToUse)
            trackToUse = res.tracks.find(track => track.info?.isrc === data.info?.isrc);
        // apply unresolved data and return the track
        return applyUnresolvedData(trackToUse || res.tracks[0], data, player.LavalinkManager.utils);
    });
}
