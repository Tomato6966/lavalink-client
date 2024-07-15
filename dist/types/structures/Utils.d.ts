import { LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { LavalinkNode, LavalinkNodeOptions, NodeStats } from "./Node";
import { LavalinkPlayOptions, Player } from "./Player";
import { LavalinkTrack, PluginInfo, Track, UnresolvedQuery, UnresolvedTrack } from "./Track";
export declare const TrackSymbol: unique symbol;
export declare const UnresolvedTrackSymbol: unique symbol;
export declare const QueueSymbol: unique symbol;
export declare const NodeSymbol: unique symbol;
type Opaque<T, K> = T & {
    __opaque__: K;
};
export type IntegerNumber = Opaque<number, 'Int'>;
export type FloatNumber = Opaque<number, 'Float'>;
export type LavaSrcSearchPlatformBase = "spsearch" | "sprec" | "amsearch" | "dzsearch" | "dzisrc" | "ymsearch";
export type LavaSrcSearchPlatform = LavaSrcSearchPlatformBase | "ftts";
export type DuncteSearchPlatform = "speak" | "phsearch" | "pornhub" | "porn" | "tts";
export type LavalinkClientSearchPlatform = "bcsearch";
export type LavalinkClientSearchPlatformResolve = "bandcamp" | "bc";
export type LavalinkSearchPlatform = "ytsearch" | "ytmsearch" | "scsearch" | "bcsearch" | LavaSrcSearchPlatform | DuncteSearchPlatform | LavalinkClientSearchPlatform;
export type ClientCustomSearchPlatformUtils = "local" | "http" | "https" | "link" | "uri";
export type ClientSearchPlatform = ClientCustomSearchPlatformUtils | // for file/link requests
"youtube" | "yt" | "youtube music" | "youtubemusic" | "ytm" | "musicyoutube" | "music youtube" | "soundcloud" | "sc" | "am" | "apple music" | "applemusic" | "apple" | "musicapple" | "music apple" | "sp" | "spsuggestion" | "spotify" | "spotify.com" | "spotifycom" | "dz" | "deezer" | "yandex" | "yandex music" | "yandexmusic" | "flowerytts" | "flowery" | "flowery.tts" | LavalinkClientSearchPlatformResolve | LavalinkClientSearchPlatform;
export type SearchPlatform = LavalinkSearchPlatform | ClientSearchPlatform;
export type SourcesRegex = "YoutubeRegex" | "YoutubeMusicRegex" | "SoundCloudRegex" | "SoundCloudMobileRegex" | "DeezerTrackRegex" | "DeezerArtistRegex" | "DeezerEpisodeRegex" | "DeezerMixesRegex" | "DeezerPageLinkRegex" | "DeezerPlaylistRegex" | "DeezerAlbumRegex" | "AllDeezerRegex" | "AllDeezerRegexWithoutPageLink" | "SpotifySongRegex" | "SpotifyPlaylistRegex" | "SpotifyArtistRegex" | "SpotifyEpisodeRegex" | "SpotifyShowRegex" | "SpotifyAlbumRegex" | "AllSpotifyRegex" | "mp3Url" | "m3uUrl" | "m3u8Url" | "mp4Url" | "m4aUrl" | "wavUrl" | "aacpUrl" | "tiktok" | "mixcloud" | "musicYandex" | "radiohost" | "bandcamp" | "appleMusic" | "TwitchTv" | "vimeo";
export interface PlaylistInfo {
    /** The playlist name */
    name: string;
    /** The playlist title (same as name) */
    title: string;
    /** The playlist Author */
    author?: string;
    /** The playlist Thumbnail */
    thumbnail?: string;
    /** A Uri to the playlist */
    uri?: string;
    /** The playlist selected track. */
    selectedTrack: Track | null;
    /** The duration of the entire playlist. (calcualted) */
    duration: number;
}
export interface SearchResult {
    loadType: LoadTypes;
    exception: Exception | null;
    pluginInfo: PluginInfo;
    playlist: PlaylistInfo | null;
    tracks: Track[];
}
export interface UnresolvedSearchResult {
    loadType: LoadTypes;
    exception: Exception | null;
    pluginInfo: PluginInfo;
    playlist: PlaylistInfo | null;
    tracks: UnresolvedTrack[];
}
/**
 * Parses Node Connection Url: "lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>"
 * @param connectionUrl
 * @returns
 */
export declare function parseLavalinkConnUrl(connectionUrl: string): {
    authorization: string;
    id: string;
    host: string;
    port: number;
};
export declare class ManagerUtils {
    LavalinkManager: LavalinkManager | null;
    constructor(LavalinkManager?: LavalinkManager);
    buildPluginInfo(data: any, clientData?: any): any;
    buildTrack(data: LavalinkTrack | Track, requester: unknown): Track;
    /**
     * Builds a UnresolvedTrack to be resolved before being played  .
     * @param query
     * @param requester
     */
    buildUnresolvedTrack(query: UnresolvedQuery | UnresolvedTrack, requester: unknown): UnresolvedTrack;
    /**
     * Validate if a data is equal to a node
     * @param data
     */
    isNode(data: LavalinkNode): boolean;
    /**
     * Validate if a data is equal to node options
     * @param data
     */
    isNodeOptions(data: LavalinkNodeOptions | any): boolean;
    /**
     * Validate if a data is euqal to a track
     * @param data the Track to validate
     * @returns
     */
    isTrack(data: Track | any): boolean;
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrack(data: UnresolvedTrack | any): boolean;
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrackQuery(data: UnresolvedQuery | any): boolean;
    getClosestTrack(data: UnresolvedTrack, player: Player): Promise<Track | undefined>;
    validateQueryString(node: LavalinkNode, queryString: string, sourceString?: LavalinkSearchPlatform): void;
    transformQuery(query: SearchQuery): {
        query: string;
        extraQueryUrlParams: URLSearchParams;
        source: any;
    };
    transformLavaSearchQuery(query: LavaSearchQuery): {
        query: string;
        types: string[];
        source: any;
    };
    validateSourceString(node: LavalinkNode, sourceString: SearchPlatform): void;
}
/**
 * @internal
 */
export interface MiniMapConstructor {
    new (): MiniMap<unknown, unknown>;
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): MiniMap<K, V>;
    new <K, V>(iterable: Iterable<readonly [K, V]>): MiniMap<K, V>;
    readonly prototype: MiniMap<unknown, unknown>;
    readonly [Symbol.species]: MiniMapConstructor;
}
/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
export interface MiniMap<K, V> extends Map<K, V> {
    constructor: MiniMapConstructor;
}
export declare class MiniMap<K, V> extends Map<K, V> {
    constructor(data?: any[]);
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
    filter<K2 extends K>(fn: (value: V, key: K, miniMap: this) => key is K2): MiniMap<K2, V>;
    filter<V2 extends V>(fn: (value: V, key: K, miniMap: this) => value is V2): MiniMap<K, V2>;
    filter(fn: (value: V, key: K, miniMap: this) => boolean): MiniMap<K, V>;
    filter<This, K2 extends K>(fn: (this: This, value: V, key: K, miniMap: this) => key is K2, thisArg: This): MiniMap<K2, V>;
    filter<This, V2 extends V>(fn: (this: This, value: V, key: K, miniMap: this) => value is V2, thisArg: This): MiniMap<K, V2>;
    filter<This>(fn: (this: This, value: V, key: K, miniMap: this) => boolean, thisArg: This): MiniMap<K, V>;
    toJSON(): [K, V][];
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
    map<T>(fn: (value: V, key: K, miniMap: this) => T): T[];
    map<This, T>(fn: (this: This, value: V, key: K, miniMap: this) => T, thisArg: This): T[];
}
export type PlayerEvents = TrackStartEvent | TrackEndEvent | TrackStuckEvent | TrackExceptionEvent | WebSocketClosedEvent | SponsorBlockSegmentEvents;
export type Severity = "COMMON" | "SUSPICIOUS" | "FAULT";
export interface Exception {
    /** Severity of the error */
    severity: Severity;
    /** Nodejs Error */
    error?: Error;
    /** Message by lavalink */
    message: string;
    /** Cause by lavalink */
    cause: string;
}
export interface PlayerEvent {
    op: "event";
    type: PlayerEventType;
    guildId: string;
}
export interface TrackStartEvent extends PlayerEvent {
    type: "TrackStartEvent";
    track: string;
}
export interface TrackEndEvent extends PlayerEvent {
    type: "TrackEndEvent";
    track: string;
    reason: TrackEndReason;
}
export interface TrackExceptionEvent extends PlayerEvent {
    type: "TrackExceptionEvent";
    exception?: Exception;
    error: string;
}
export interface TrackStuckEvent extends PlayerEvent {
    type: "TrackStuckEvent";
    thresholdMs: number;
}
export interface WebSocketClosedEvent extends PlayerEvent {
    type: "WebSocketClosedEvent";
    code: number;
    byRemote: boolean;
    reason: string;
}
/**
 * Types & Events for Sponsorblock-plugin from Lavalink: https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
 */
export type SponsorBlockSegmentEvents = SponsorBlockSegmentSkipped | SponsorBlockSegmentsLoaded | SponsorBlockChapterStarted | SponsorBlockChaptersLoaded;
export type SponsorBlockSegmentEventType = "SegmentSkipped" | "SegmentsLoaded" | "ChaptersLoaded" | "ChapterStarted";
export interface SponsorBlockSegmentsLoaded extends PlayerEvent {
    type: "SegmentsLoaded";
    segments: {
        category: string;
        start: number;
        end: number;
    }[];
}
export interface SponsorBlockSegmentSkipped extends PlayerEvent {
    type: "SegmentSkipped";
    segment: {
        category: string;
        start: number;
        end: number;
    };
}
export interface SponsorBlockChapterStarted extends PlayerEvent {
    type: "ChapterStarted";
    /** The Chapter which started */
    chapter: {
        /** The Name of the Chapter */
        name: string;
        start: number;
        end: number;
        duration: number;
    };
}
export interface SponsorBlockChaptersLoaded extends PlayerEvent {
    type: "ChaptersLoaded";
    /** All Chapters loaded */
    chapters: {
        /** The Name of the Chapter */
        name: string;
        start: number;
        end: number;
        duration: number;
    }[];
}
export type LoadTypes = "track" | "playlist" | "search" | "error" | "empty";
export type State = "CONNECTED" | "CONNECTING" | "DISCONNECTED" | "DISCONNECTING" | "DESTROYING";
export type PlayerEventType = "TrackStartEvent" | "TrackEndEvent" | "TrackExceptionEvent" | "TrackStuckEvent" | "WebSocketClosedEvent" | SponsorBlockSegmentEventType;
export type TrackEndReason = "finished" | "loadFailed" | "stopped" | "replaced" | "cleanup";
export interface InvalidLavalinkRestRequest {
    /** Rest Request Data for when it was made */
    timestamp: number;
    /** Status of the request */
    status: number;
    /** Specific Errro which was sent */
    error: string;
    /** Specific Message which was created */
    message?: string;
    /** The specific error trace from the request */
    trace?: unknown;
    /** Path of where it's from */
    path: string;
}
export interface LavalinkPlayerVoice {
    /** The Voice Token */
    token: string;
    /** The Voice Server Endpoint  */
    endpoint: string;
    /** The Voice SessionId */
    sessionId: string;
    /** Wether or not the player is connected */
    connected?: boolean;
    /** The Ping to the voice server */
    ping?: number;
}
export interface LavalinkPlayerVoiceOptions extends Omit<LavalinkPlayerVoice, 'connected' | 'ping'> {
}
export interface FailingAddress {
    /** The failing address */
    failingAddress: string;
    /** The timestamp when the address failed */
    failingTimestamp: number;
    /** The timestamp when the address failed as a pretty string */
    failingTime: string;
}
type RoutePlannerTypes = "RotatingIpRoutePlanner" | "NanoIpRoutePlanner" | "RotatingNanoIpRoutePlanner" | "BalancingIpRoutePlanner";
export interface RoutePlanner {
    class?: RoutePlannerTypes;
    details?: {
        /** The ip block being used */
        ipBlock: {
            /** The type of the ip block */
            type: "Inet4Address" | "Inet6Address";
            /** 	The size of the ip block */
            size: string;
        };
        /** The failing addresses */
        failingAddresses: FailingAddress[];
        /** The number of rotations */
        rotateIndex?: string;
        /** The current offset in the block	 */
        ipIndex?: string;
        /** The current address being used	 */
        currentAddress?: string;
        /** The current offset in the ip block */
        currentAddressIndex?: string;
        /** The information in which /64 block ips are chosen. This number increases on each ban. */
        blockIndex?: string;
    };
}
export interface Session {
    /** Wether or not session is resuming or not */
    resuming: boolean;
    /** For how long a session is lasting while not connected */
    timeout: number;
}
export interface GuildShardPayload {
    /** The OP code */
    op: number;
    /** Data to send  */
    d: {
        /** Guild id to apply voice settings */
        guild_id: string;
        /** channel to move/connect to, or null to leave it */
        channel_id: string | null;
        /** wether or not mute yourself */
        self_mute: boolean;
        /** wether or not deafen yourself */
        self_deaf: boolean;
    };
}
export interface PlayerUpdateInfo {
    /** guild id of the player */
    guildId: string;
    /** Player options to provide to lavalink */
    playerOptions: LavalinkPlayOptions;
    /** Whether or not replace the current track with the new one (true is recommended) */
    noReplace?: boolean;
}
export interface LavalinkPlayer {
    /** Guild Id of the player */
    guildId: string;
    /** IF playing a track, all of the track information */
    track?: LavalinkTrack;
    /** Lavalink volume (mind volumedecrementer) */
    volume: number;
    /** Wether it's paused or not */
    paused: boolean;
    /** Voice Endpoint data */
    voice: LavalinkPlayerVoice;
    /** All Audio Filters */
    filters: Partial<LavalinkFilterData>;
    /** Lavalink-Voice-State Variables */
    state: {
        /** Time since connection established */
        time: number;
        /** Position of the track */
        position: number;
        /** COnnected or not */
        connected: boolean;
        /** Ping to voice server */
        ping: number;
    };
}
export interface ChannelDeletePacket {
    /** Packet key for channel delete */
    t: "CHANNEL_DELETE";
    /** data which is sent and relevant */
    d: {
        /** guild id */
        guild_id: string;
        /** Channel id */
        id: string;
    };
}
export interface VoiceState {
    /** OP key from lavalink */
    op: "voiceUpdate";
    /** GuildId provided by lavalink */
    guildId: string;
    /** Event data */
    event: VoiceServer;
    /** Session Id of the voice connection */
    sessionId?: string;
    /** guild id of the voice channel */
    guild_id: string;
    /** user id from the voice connection */
    user_id: string;
    /** Session Id of the voice connection */
    session_id: string;
    /** Voice Channel Id */
    channel_id: string;
}
/** The Base64 decodes tring by lavalink */
export type Base64 = string;
export interface VoiceServer {
    /** Voice Token */
    token: string;
    /** Guild Id of the voice server connection */
    guild_id: string;
    /** Server Endpoint */
    endpoint: string;
}
export interface VoicePacket {
    /** Voice Packet Keys to send */
    t?: "VOICE_SERVER_UPDATE" | "VOICE_STATE_UPDATE";
    /** Voice Packets to send */
    d: VoiceState | VoiceServer;
}
export interface NodeMessage extends NodeStats {
    /** The type of the event */
    type: PlayerEventType;
    /** what ops are applying to that event */
    op: "stats" | "playerUpdate" | "event";
    /** The specific guild id for that message */
    guildId: string;
}
export declare function queueTrackEnd(player: Player): Promise<Track>;
/** Specific types to filter for lavasearch, will be filtered to correct types */
export type LavaSearchType = "track" | "album" | "artist" | "playlist" | "text" | "tracks" | "albums" | "artists" | "playlists" | "texts";
export interface LavaSearchFilteredResponse {
    /** The Information of a playlist provided by lavasearch */
    info: PlaylistInfo;
    /** additional plugin information */
    pluginInfo: PluginInfo;
    /** List of tracks  */
    tracks: Track[];
}
export interface LavaSearchResponse {
    /** An array of tracks, only present if track is in types */
    tracks: Track[];
    /** An array of albums, only present if album is in types */
    albums: LavaSearchFilteredResponse[];
    /** 	An array of artists, only present if artist is in types */
    artists: LavaSearchFilteredResponse[];
    /** 	An array of playlists, only present if playlist is in types */
    playlists: LavaSearchFilteredResponse[];
    /** An array of text results, only present if text is in types */
    texts: {
        text: string;
        pluginInfo: PluginInfo;
    }[];
    /** Addition result data provided by plugins */
    pluginInfo: PluginInfo;
}
/** SearchQuery Object for raw lavalink requests */
export type SearchQuery = {
    /** lavalink search Query / identifier string */
    query: string;
    /** Extra url query params to use, e.g. for flowertts */
    extraQueryUrlParams?: URLSearchParams;
    /** Source to append to the search query string */
    source?: SearchPlatform;
} | /** Our just the search query / identifier string */ string;
/** SearchQuery Object for Lavalink LavaSearch Plugin requests */
export type LavaSearchQuery = {
    /** lavalink search Query / identifier string */
    query: string;
    /** Source to append to the search query string */
    source: LavaSrcSearchPlatformBase;
    /** The Types to filter the search to */
    types?: LavaSearchType[];
};
export {};
