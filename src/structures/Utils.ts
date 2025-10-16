import { URL } from "node:url";
import { isRegExp } from "node:util/types";

import { DebugEvents } from "./Constants";
import { DefaultSources, LavalinkPlugins, SourceLinksRegexes } from "./LavalinkManagerStatics";

import type { LavalinkNodeOptions } from "./Types/Node";

import type {
    LavalinkSearchPlatform, LavaSearchQuery, MiniMapConstructor, SearchPlatform, SearchQuery, SearchResult
} from "./Types/Utils";

import type { LavalinkManager } from "./LavalinkManager";
import type { LavalinkNode } from "./Node";
import type { Player } from "./Player";
import type { LavalinkTrack, Track, UnresolvedQuery, UnresolvedTrack } from "./Types/Track";
export const TrackSymbol = Symbol("LC-Track");
export const UnresolvedTrackSymbol = Symbol("LC-Track-Unresolved");
export const QueueSymbol = Symbol("LC-Queue");
export const NodeSymbol = Symbol("LC-Node");


/** @hidden */
const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Parses Node Connection Url: "lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>"
 * @param connectionUrl
 * @returns
 */
export function parseLavalinkConnUrl(connectionUrl: string) {
    if (!connectionUrl.startsWith("lavalink://")) throw new Error(`ConnectionUrl (${connectionUrl}) must start with 'lavalink://'`);
    const parsed = new URL(connectionUrl);
    return {
        authorization: parsed.password,
        id: parsed.username,
        host: parsed.hostname,
        port: Number(parsed.port),
    }
}

export class ManagerUtils {
    public LavalinkManager: LavalinkManager | undefined = undefined;
    constructor(LavalinkManager?: LavalinkManager) {
        this.LavalinkManager = LavalinkManager;
    }

    buildPluginInfo(data: any, clientData: any = {}) {
        return {
            clientData: clientData,
            ...(data.pluginInfo || (data as any).plugin),
        }
    }

    buildTrack(data: LavalinkTrack | Track, requester: unknown) {
        if (!data?.encoded || typeof data.encoded !== "string") throw new RangeError("Argument 'data.encoded' must be present.");
        if (!data.info) throw new RangeError("Argument 'data.info' must be present.");
        try {
            let transformedRequester = typeof requester === "object"
                ? this.getTransformedRequester(requester)
                : undefined;

            if (!transformedRequester && typeof data?.userData?.requester === "object" && data.userData.requester !== null) {
                transformedRequester = this.getTransformedRequester(data.userData.requester);
            }


            const r = {
                encoded: data.encoded,
                info: {
                    identifier: data.info.identifier,
                    title: data.info.title,
                    author: data.info.author,
                    duration: (data as Track).info?.duration || (data as LavalinkTrack).info?.length,
                    artworkUrl: data.info.artworkUrl || data.pluginInfo?.artworkUrl || (data as any).plugin?.artworkUrl,
                    uri: data.info.uri,
                    sourceName: data.info.sourceName,
                    isSeekable: data.info.isSeekable,
                    isStream: data.info.isStream,
                    isrc: data.info.isrc,
                },
                userData: {
                    ...data.userData,
                    requester: transformedRequester
                },
                pluginInfo: this.buildPluginInfo(data, "clientData" in data ? data.clientData : {}),
                requester: transformedRequester || this.getTransformedRequester(this.LavalinkManager?.options?.client),
            } as Track;
            Object.defineProperty(r, TrackSymbol, { configurable: true, value: true });
            return r;
        } catch (error) {
            if (this.LavalinkManager?.options?.advancedOptions?.enableDebugEvents) {
                this.LavalinkManager?.emit("debug", DebugEvents.BuildTrackError, {
                    error: error,
                    functionLayer: "ManagerUtils > buildTrack()",
                    message: "Error while building track",
                    state: "error",
                });
            }
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }

    /**
     * Builds a UnresolvedTrack to be resolved before being played  .
     * @param query
     * @param requester
     */
    buildUnresolvedTrack(query: UnresolvedQuery | UnresolvedTrack, requester: unknown) {
        if (typeof query === "undefined")
            throw new RangeError('Argument "query" must be present.');

        const unresolvedTrack: UnresolvedTrack = {
            encoded: query.encoded || undefined,
            info: (query as UnresolvedTrack).info ? (query as UnresolvedTrack).info : (query as UnresolvedQuery).title ? query as UnresolvedQuery : undefined,
            pluginInfo: this.buildPluginInfo(query),
            requester: this.getTransformedRequester(requester),
            async resolve(player: Player) {
                const closest = await getClosestTrack(this, player);
                if (!closest) throw new SyntaxError("No closest Track found");

                for (const prop of Object.getOwnPropertyNames(this)) delete this[prop]
                // delete symbol
                delete this[UnresolvedTrackSymbol];
                // assign new symbol
                Object.defineProperty(this, TrackSymbol, { configurable: true, value: true });

                return Object.assign(this, closest);
            }
        }

        if (!this.isUnresolvedTrack(unresolvedTrack)) throw SyntaxError("Could not build Unresolved Track");

        Object.defineProperty(unresolvedTrack, UnresolvedTrackSymbol, { configurable: true, value: true });
        return unresolvedTrack as UnresolvedTrack;
    }

    /**
     * Validate if a data is equal to a node
     * @param data
     */
    isNode(data: LavalinkNode) {
        if (!data) return false;
        const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(data));
        if (!keys.includes("constructor")) return false;
        if (!keys.length) return false;
        // all required functions
        if (!["connect", "destroy", "destroyPlayer", "fetchAllPlayers", "fetchInfo", "fetchPlayer", "fetchStats", "fetchVersion", "request", "updatePlayer", "updateSession"].every(v => keys.includes(v))) return false;
        return true;
    }

    getTransformedRequester(requester: unknown) {
        try {
            return typeof this.LavalinkManager?.options?.playerOptions?.requesterTransformer === "function"
                ? this.LavalinkManager?.options?.playerOptions?.requesterTransformer(requester)
                : requester;
        } catch (e) {
            if (this.LavalinkManager?.options?.advancedOptions?.enableDebugEvents) {
                this.LavalinkManager?.emit("debug", DebugEvents.TransformRequesterFunctionFailed, {
                    error: e,
                    functionLayer: "ManagerUtils > getTransformedRequester()",
                    message: "Your custom transformRequesterFunction failed to execute, please check your function for errors.",
                    state: "error",
                });
            }
            return requester;
        }
    }
    /**
     * Validate if a data is equal to node options
     * @param data
     */
    isNodeOptions(data: LavalinkNodeOptions) {
        if (!data || typeof data !== "object" || Array.isArray(data)) return false;
        if (typeof data.host !== "string" || !data.host.length) return false;
        if (typeof data.port !== "number" || isNaN(data.port) || data.port < 0 || data.port > 65535) return false;
        if (typeof data.authorization !== "string" || !data.authorization.length) return false;
        if ("secure" in data && typeof data.secure !== "boolean" && data.secure !== undefined) return false;
        if ("sessionId" in data && typeof data.sessionId !== "string" && data.sessionId !== undefined) return false;
        if ("id" in data && typeof data.id !== "string" && data.id !== undefined) return false;
        if ("regions" in data && (!Array.isArray(data.regions) || !data.regions.every(v => typeof v === "string") && data.regions !== undefined)) return false;
        if ("poolOptions" in data && typeof data.poolOptions !== "object" && data.poolOptions !== undefined) return false;
        if ("retryAmount" in data && (typeof data.retryAmount !== "number" || isNaN(data.retryAmount) || data.retryAmount <= 0 && data.retryAmount !== undefined)) return false;
        if ("retryDelay" in data && (typeof data.retryDelay !== "number" || isNaN(data.retryDelay) || data.retryDelay <= 0 && data.retryDelay !== undefined)) return false;
        if ("requestTimeout" in data && (typeof data.requestTimeout !== "number" || isNaN(data.requestTimeout) || data.requestTimeout <= 0 && data.requestTimeout !== undefined)) return false;
        return true;
    }
    /**
     * Validate if a data is equal to a track
     * @param data the Track to validate
     * @returns
     */
    isTrack(data: Track | UnresolvedTrack): data is Track {
        if (!data) return false;
        if (data[TrackSymbol] === true) return true;
        return typeof data?.encoded === "string" && typeof data?.info === "object" && !("resolve" in data);
    }

    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrack(data: UnresolvedTrack | Track): data is UnresolvedTrack {
        if (!data) return false;
        if (data[UnresolvedTrackSymbol] === true) return true;
        return typeof data === "object" && (("info" in data && typeof data.info.title === "string") || typeof data.encoded === "string") && "resolve" in data && typeof data.resolve === "function";
    }

    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrackQuery(data: UnresolvedQuery): boolean {
        return typeof data === "object" && !("info" in data) && typeof data.title === "string";
    }

    async getClosestTrack(data: UnresolvedTrack, player: Player): Promise<Track | undefined> {
        try {
            return getClosestTrack(data, player);
        } catch (e) {
            if (this.LavalinkManager?.options?.advancedOptions?.enableDebugEvents) {
                this.LavalinkManager?.emit("debug", DebugEvents.GetClosestTrackFailed, {
                    error: e,
                    functionLayer: "ManagerUtils > getClosestTrack()",
                    message: "Failed to resolve track because the getClosestTrack function failed.",
                    state: "error",
                });
            }
            throw e;
        }
    }


    validateQueryString(node: LavalinkNode, queryString: string, sourceString?: LavalinkSearchPlatform): void {
        if (!node.info) throw new Error("No Lavalink Node was provided");
        if (!node.info.sourceManagers?.length) throw new Error("Lavalink Node, has no sourceManagers enabled");

        if (!queryString.trim().length) throw new Error(`Query string is empty, please provide a valid query string.`)

        if (sourceString === "speak" && queryString.length > 100) throw new Error(`Query is speak, which is limited to 100 characters.`)

        // checks for blacklisted links / domains / queries
        if (this.LavalinkManager.options?.linksBlacklist?.length > 0) {
            if (this.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.LavalinkManager.emit("debug", DebugEvents.ValidatingBlacklistLinks, {
                    state: "log",
                    message: `Validating Query against LavalinkManager.options.linksBlacklist, query: "${queryString}"`,
                    functionLayer: "(LavalinkNode > node | player) > search() > validateQueryString()",
                });
            }
            if (this.LavalinkManager.options?.linksBlacklist.some(v => (typeof v === "string" && (queryString.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(queryString.toLowerCase()))) || isRegExp(v) && v.test(queryString))) {
                throw new Error(`Query string contains a link / word which is blacklisted.`)
            }
        }

        if (!/^https?:\/\//.test(queryString)) return;
        else if (this.LavalinkManager.options?.linksAllowed === false) throw new Error("Using links to make a request is not allowed.")

        // checks for if the query is whitelisted (should only work for links, so it skips the check for no link queries)
        if (this.LavalinkManager.options?.linksWhitelist?.length > 0) {
            if (this.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.LavalinkManager.emit("debug", DebugEvents.ValidatingWhitelistLinks, {
                    state: "log",
                    message: `Link was provided to the Query, validating against LavalinkManager.options.linksWhitelist, query: "${queryString}"`,
                    functionLayer: "(LavalinkNode > node | player) > search() > validateQueryString()",
                });
            }
            if (!this.LavalinkManager.options?.linksWhitelist.some(v => (typeof v === "string" && (queryString.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(queryString.toLowerCase()))) || isRegExp(v) && v.test(queryString))) {
                throw new Error(`Query string contains a link / word which isn't whitelisted.`)
            }
        }

        // missing links: beam.pro local getyarn.io clypit pornhub reddit ocreamix soundgasm
        if ((SourceLinksRegexes.YoutubeMusicRegex.test(queryString) || SourceLinksRegexes.YoutubeRegex.test(queryString)) && !node.info?.sourceManagers?.includes("youtube")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'youtube' enabled");
        }
        if ((SourceLinksRegexes.SoundCloudMobileRegex.test(queryString) || SourceLinksRegexes.SoundCloudRegex.test(queryString)) && !node.info?.sourceManagers?.includes("soundcloud")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'soundcloud' enabled");
        }
        if (SourceLinksRegexes.bandcamp.test(queryString) && !node.info?.sourceManagers?.includes("bandcamp")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'bandcamp' enabled (introduced with lavaplayer 2.2.0 or lavalink 4.0.6)");
        }
        if (SourceLinksRegexes.TwitchTv.test(queryString) && !node.info?.sourceManagers?.includes("twitch")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'twitch' enabled");
        }
        if (SourceLinksRegexes.vimeo.test(queryString) && !node.info?.sourceManagers?.includes("vimeo")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'vimeo' enabled");
        }
        if (SourceLinksRegexes.tiktok.test(queryString) && !node.info?.sourceManagers?.includes("tiktok")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'tiktok' enabled");
        }
        if (SourceLinksRegexes.mixcloud.test(queryString) && !node.info?.sourceManagers?.includes("mixcloud")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'mixcloud' enabled");
        }
        if (SourceLinksRegexes.AllSpotifyRegex.test(queryString) && !node.info?.sourceManagers?.includes("spotify")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'spotify' enabled");
        }
        if (SourceLinksRegexes.appleMusic.test(queryString) && !node.info?.sourceManagers?.includes("applemusic")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'applemusic' enabled");
        }
        if (SourceLinksRegexes.AllDeezerRegex.test(queryString) && !node.info?.sourceManagers?.includes("deezer")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'deezer' enabled");
        }
        if (SourceLinksRegexes.musicYandex.test(queryString) && !node.info?.sourceManagers?.includes("yandexmusic")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'yandexmusic' enabled");
        }
        if (SourceLinksRegexes.jiosaavn.test(queryString) && !node.info?.sourceManagers?.includes("jiosaavn")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'jiosaavn' (via jiosaavn-plugin) enabled");
        }
        if (SourceLinksRegexes.tidal.test(queryString) && !node.info?.sourceManagers?.includes("tidal")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'tidal' enabled");
        }
        if (SourceLinksRegexes.AllPandoraRegex.test(queryString) && !node.info?.sourceManagers?.includes("pandora")) {
            throw new Error("Query / Link Provided for this Source but Lavalink Node has not 'pandora' enabled");
        }
        return;
    }

    transformQuery(query: SearchQuery) {
        const sourceOfQuery = typeof query === "string" ? undefined : (DefaultSources[(query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()] ?? (query.source?.trim?.()?.toLowerCase?.()));
        const Query = {
            query: typeof query === "string" ? query : query.query,
            extraQueryUrlParams: typeof query !== "string" ? query.extraQueryUrlParams : undefined,
            source: sourceOfQuery ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()
        }
        const foundSource = Object.keys(DefaultSources).find(source => Query.query?.toLowerCase?.()?.startsWith(`${source}:`.toLowerCase()))?.trim?.()?.toLowerCase?.() as SearchPlatform | undefined;
        // ignore links...
        if (foundSource && !["https", "http"].includes(foundSource) && DefaultSources[foundSource]) {
            Query.source = DefaultSources[foundSource]; // set the source to ytsearch:
            Query.query = Query.query.slice(`${foundSource}:`.length, Query.query.length); // remove ytsearch: from the query
        }
        return Query;
    }

    transformLavaSearchQuery(query: LavaSearchQuery) {
        // transform the query object
        const sourceOfQuery = typeof query === "string" ? undefined : (DefaultSources[(query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()] ?? (query.source?.trim?.()?.toLowerCase?.()));
        const Query = {
            query: typeof query === "string" ? query : query.query,
            types: query.types ? ["track", "playlist", "artist", "album", "text"].filter(v => query.types?.find(x => x.toLowerCase().startsWith(v))) : ["track", "playlist", "artist", "album", /*"text"*/],
            source: sourceOfQuery ?? this.LavalinkManager?.options?.playerOptions?.defaultSearchPlatform?.toLowerCase?.()
        }

        const foundSource = Object.keys(DefaultSources).find(source => Query.query.toLowerCase().startsWith(`${source}:`.toLowerCase()))?.trim?.()?.toLowerCase?.() as SearchPlatform | undefined;
        if (foundSource && DefaultSources[foundSource]) {
            Query.source = DefaultSources[foundSource]; // set the source to ytsearch:
            Query.query = Query.query.slice(`${foundSource}:`.length, Query.query.length); // remove ytsearch: from the query
        }
        return Query;
    }

    validateSourceString(node: LavalinkNode, sourceString: SearchPlatform) {
        if (!sourceString) throw new Error(`No SourceString was provided`);
        const source = DefaultSources[sourceString.toLowerCase().trim()] as LavalinkSearchPlatform;
        if (!source) throw new Error(`Lavalink Node SearchQuerySource: '${sourceString}' is not available`);

        if (!node.info) throw new Error("Lavalink Node does not have any info cached yet, not ready yet!")

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
        if (source === "jsrec" && !node.info?.sourceManagers?.includes("jiosaavn")) {
            throw new Error("Lavalink Node has not 'jiosaavn' (via jiosaavn-plugin) enabled, which is required to have 'jsrec' to work");
        }
        if (source === "jssearch" && !node.info?.sourceManagers?.includes("jiosaavn")) {
            throw new Error("Lavalink Node has not 'jiosaavn' (via jiosaavn-plugin) enabled, which is required to have 'jssearch' to work");
        }
        if (source === "scsearch" && !node.info?.sourceManagers?.includes("soundcloud")) {
            throw new Error("Lavalink Node has not 'soundcloud' enabled, which is required to have 'scsearch' work");
        }
        if (source === "speak" && !node.info?.plugins?.find(c => c.name.toLowerCase().includes(LavalinkPlugins.DuncteBot_Plugin.toLowerCase()))) {
            throw new Error("Lavalink Node has not 'speak' enabled, which is required to have 'speak' work");
        }
        if (source === "tdsearch" && !node.info?.sourceManagers?.includes("tidal")) {
            throw new Error("Lavalink Node has not 'tidal' enabled, which is required to have 'tdsearch' work");
        }
        if (source === "tdrec" && !node.info?.sourceManagers?.includes("tidal")) {
            throw new Error("Lavalink Node has not 'tidal' enabled, which is required to have 'tdrec' work");
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
        if (source === "vksearch" && !node.info?.sourceManagers?.includes("vkmusic")) {
            throw new Error("Lavalink Node has not 'vkmusic' enabled, which is required to have 'vksearch' work");
        }
        if (source === "vkrec" && !node.info?.sourceManagers?.includes("vkmusic")) {
            throw new Error("Lavalink Node has not 'vkmusic' enabled, which is required to have 'vkrec' work");
        }
        if (source === "qbsearch" && !node.info?.sourceManagers?.includes("qobuz")) {
            throw new Error("Lavalink Node has not 'qobuz' enabled, which is required to have 'qbsearch' work");
        }
        if (source === "qbisrc" && !node.info?.sourceManagers?.includes("qobuz")) {
            throw new Error("Lavalink Node has not 'qobuz' enabled, which is required to have 'qbisrc' work");
        }
        if (source === "qbrec" && !node.info?.sourceManagers?.includes("qobuz")) {
            throw new Error("Lavalink Node has not 'qobuz' enabled, which is required to have 'qbrec' work");
        }
        if (source === "pdsearch" && !node.info?.sourceManagers?.includes("pandora")) {
            throw new Error("Lavalink Node has not 'pandora' enabled, which is required to have 'pdsearch' work");
        }
        if (source === "pdisrc" && !node.info?.sourceManagers?.includes("pandora")) {
            throw new Error("Lavalink Node has not 'pandora' enabled, which is required to have 'pdisrc' work");
        }
        if (source === "pdrec" && !node.info?.sourceManagers?.includes("pandora")) {
            throw new Error("Lavalink Node has not 'pandora' enabled, which is required to have 'pdrec' work");
        }

        return;
    }
}

/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
export interface MiniMap<K, V> extends Map<K, V> {
    constructor: MiniMapConstructor;
}

export class MiniMap<K, V> extends Map<K, V> {
    constructor(data: [K, V][] = []) {
        super(data);
    }

    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a MiniMap instead of an Array.
     *
     * @param fn The function to test with (should return boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * miniMap.filter(user => user.username === 'Bob');
     */
    public filter<K2 extends K>(fn: (value: V, key: K, miniMap: this) => key is K2): MiniMap<K2, V>;
    public filter<V2 extends V>(fn: (value: V, key: K, miniMap: this) => value is V2): MiniMap<K, V2>;
    public filter(fn: (value: V, key: K, miniMap: this) => boolean): MiniMap<K, V>;
    public filter<This, K2 extends K>(
        fn: (this: This, value: V, key: K, miniMap: this) => key is K2,
        thisArg: This,
    ): MiniMap<K2, V>;
    public filter<This, V2 extends V>(
        fn: (this: This, value: V, key: K, miniMap: this) => value is V2,
        thisArg: This,
    ): MiniMap<K, V2>;
    public filter<This>(fn: (this: This, value: V, key: K, miniMap: this) => boolean, thisArg: This): MiniMap<K, V>;
    public filter(fn: (value: V, key: K, miniMap: this) => boolean, thisArg?: unknown): MiniMap<K, V> {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]<K, V>();
        for (const [key, val] of this) {
            if (fn(val, key, this)) results.set(key, val);
        }
        return results;
    }

    public toJSON() {
        return [...this.entries()];
    }

    /**
     * Maps each item to another value into an array. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     *
     * @param fn Function that produces an element of the new array, taking three arguments
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * miniMap.map(user => user.tag);
     */
    public map<T>(fn: (value: V, key: K, miniMap: this) => T): T[];
    public map<This, T>(fn: (this: This, value: V, key: K, miniMap: this) => T, thisArg: This): T[];
    public map<T>(fn: (value: V, key: K, miniMap: this) => T, thisArg?: unknown): T[] {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, (): T => {
            const [key, value] = iter.next().value;

            return fn(value, key, this);
        });
    }
}

export async function queueTrackEnd(player: Player, dontShiftQueue: boolean = false) {
    if (player.queue.current && !player.queue.current?.pluginInfo?.clientData?.previousTrack) { // If there was a current Track already and repeatmode === true, add it to the queue.
        player.queue.previous.unshift(player.queue.current);
        if (player.queue.previous.length > player.queue.options.maxPreviousTracks) player.queue.previous.splice(player.queue.options.maxPreviousTracks, player.queue.previous.length);
        await player.queue.utils.save();
    }

    // and if repeatMode == queue, add it back to the queue!
    if (player.repeatMode === "queue" && player.queue.current) player.queue.tracks.push(player.queue.current)
    // change the current Track to the next upcoming one
    const nextSong = dontShiftQueue ? null : player.queue.tracks.shift() as Track;

    try {
        if (nextSong && player.LavalinkManager.utils.isUnresolvedTrack(nextSong)) await (nextSong as UnresolvedTrack).resolve(player);

        player.queue.current = nextSong || null;
        // save it in the DB
        await player.queue.utils.save()
    } catch (error) {
        if (player.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
            player.LavalinkManager.emit("debug", DebugEvents.PlayerPlayUnresolvedTrackFailed, {
                state: "error",
                error: error,
                message: `queueTrackEnd Util was called, tried to resolve the next track, but failed to find the closest matching song`,
                functionLayer: "Player > play() > resolve currentTrack",
            });
        }

        player.LavalinkManager.emit("trackError", player, player.queue.current, error);

        // try to play the next track if possible
        if (!dontShiftQueue && player.LavalinkManager.options?.autoSkipOnResolveError === true && player.queue.tracks[0]) return queueTrackEnd(player);
    }

    // return the new current Track
    return player.queue.current;
}

async function applyUnresolvedData(resTrack: Track, data: UnresolvedTrack, utils: ManagerUtils) {
    if (!resTrack?.info || !data?.info) return;
    if (data.info.uri) resTrack.info.uri = data.info.uri;
    if (utils?.LavalinkManager?.options?.playerOptions?.useUnresolvedData === true) { // overwrite values
        if (data.info.artworkUrl?.length) resTrack.info.artworkUrl = data.info.artworkUrl;
        if (data.info.title?.length) resTrack.info.title = data.info.title;
        if (data.info.author?.length) resTrack.info.author = data.info.author;
    } else { // only overwrite if undefined / invalid
        if ((resTrack.info.title === 'Unknown title' || resTrack.info.title === "Unspecified description") && resTrack.info.title != data.info.title) resTrack.info.title = data.info.title;
        if (resTrack.info.author !== data.info.author) resTrack.info.author = data.info.author;
        if (resTrack.info.artworkUrl !== data.info.artworkUrl) resTrack.info.artworkUrl = data.info.artworkUrl;
    }
    for (const key of Object.keys(data.info)) if (typeof resTrack.info[key] === "undefined" && key !== "resolve" && data.info[key]) resTrack.info[key] = data.info[key]; // add non-existing values
    return resTrack;
}

async function getClosestTrack(data: UnresolvedTrack, player: Player): Promise<Track | undefined> {
    if (!player || !player.node) throw new RangeError("No player with a lavalink node was provided");
    if (player.LavalinkManager.utils.isTrack(data)) return player.LavalinkManager.utils.buildTrack(data, data.requester);
    if (!player.LavalinkManager.utils.isUnresolvedTrack(data)) throw new RangeError("Track is not an unresolved Track");
    if (!data?.info?.title && typeof data.encoded !== "string" && !data.info.uri) throw new SyntaxError("the track uri / title / encoded Base64 string is required for unresolved tracks")
    if (!data.requester) throw new SyntaxError("The requester is required");
    // try to decode the track, if possible
    if (typeof data.encoded === "string") {
        const r = await player.node.decode.singleTrack(data.encoded, data.requester);
        if (r) return applyUnresolvedData(r, data, player.LavalinkManager.utils);
    }
    // try to fetch the track via a uri if possible
    if (typeof data.info.uri === "string") {
        const r = await player.search({ query: data?.info?.uri }, data.requester).then(v => v.tracks?.[0] as Track | undefined);
        if (r) return applyUnresolvedData(r, data, player.LavalinkManager.utils);
    }
    // search the track as closely as possible
    const query = [data.info?.title, data.info?.author].filter(str => !!str).join(" by ");
    const sourceName = data.info?.sourceName;

    return await player.search({
        query, source: sourceName !== "twitch" && sourceName !== "flowery-tts" ? sourceName : player.LavalinkManager.options?.playerOptions?.defaultSearchPlatform,
    }, data.requester).then((res: SearchResult) => {
        let trackToUse = null;
        // try to find via author name
        if (data.info.author && !trackToUse) trackToUse = res.tracks.find(track => [data.info?.author || "", `${data.info?.author} - Topic`].some(name => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info?.author)) || new RegExp(`^${escapeRegExp(data.info?.title)}$`, "i").test(track.info?.title));
        // try to find via duration
        if (data.info.duration && !trackToUse) trackToUse = res.tracks.find(track => (track.info?.duration >= (data.info?.duration - 1500)) && (track?.info.duration <= (data.info?.duration + 1500)));
        // try to find via isrc
        if (data.info.isrc && !trackToUse) trackToUse = res.tracks.find(track => track.info?.isrc === data.info?.isrc);
        // apply unresolved data and return the track
        return applyUnresolvedData(trackToUse || res.tracks[0], data, player.LavalinkManager.utils);
    });
}


export function safeStringify(obj: any, padding = 0) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "function") return undefined; // Funktion skippen
        if (typeof value === "symbol") return undefined;   // Symbol skippen
        if (typeof value === "bigint") return value.toString(); // BigInt to String
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    }, padding);
}
