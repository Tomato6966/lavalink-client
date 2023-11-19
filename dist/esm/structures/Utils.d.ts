import { LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { LavalinkNode, LavalinkNodeOptions, NodeStats } from "./Node";
import { Player, PlayOptions } from "./Player";
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
export type DuncteSearchPlatform = "speak" | "tts";
export type LavalinkClientSearchPlatform = "bcsearch";
export type LavalinkClientSearchPlatformResolve = "bandcamp" | "bc";
export type LavalinkSearchPlatform = "ytsearch" | "ytmsearch" | "scsearch" | LavaSrcSearchPlatform | DuncteSearchPlatform | LavalinkClientSearchPlatform;
export type ClientSearchPlatform = "youtube" | "yt" | "youtube music" | "youtubemusic" | "ytm" | "musicyoutube" | "music youtube" | "soundcloud" | "sc" | "am" | "apple music" | "applemusic" | "apple" | "musicapple" | "music apple" | "sp" | "spsuggestion" | "spotify" | "spotify.com" | "spotifycom" | "dz" | "deezer" | "yandex" | "yandex music" | "yandexmusic" | LavalinkClientSearchPlatformResolve | LavalinkClientSearchPlatform;
export type SearchPlatform = LavalinkSearchPlatform | ClientSearchPlatform;
export type SourcesRegex = "YoutubeRegex" | "YoutubeMusicRegex" | "SoundCloudRegex" | "SoundCloudMobileRegex" | "DeezerTrackRegex" | "DeezerArtistRegex" | "DeezerEpisodeRegex" | "DeezerMixesRegex" | "DeezerPageLinkRegex" | "DeezerPlaylistRegex" | "DeezerAlbumRegex" | "AllDeezerRegex" | "AllDeezerRegexWithoutPageLink" | "SpotifySongRegex" | "SpotifyPlaylistRegex" | "SpotifyArtistRegex" | "SpotifyEpisodeRegex" | "SpotifyShowRegex" | "SpotifyAlbumRegex" | "AllSpotifyRegex" | "mp3Url" | "m3uUrl" | "m3u8Url" | "mp4Url" | "m4aUrl" | "wavUrl" | "aacpUrl" | "tiktok" | "mixcloud" | "musicYandex" | "radiohost" | "bandcamp" | "appleMusic" | "TwitchTv" | "vimeo";
export interface PlaylistInfo {
    /** The playlist title. */
    title: string;
    /** The playlist name (if provided instead of title) */
    name: string;
    /** The Playlist Author */
    author?: string;
    /** The Playlist Thumbnail */
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
    severity: Severity;
    message: string;
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
    timestamp: number;
    status: number;
    error: string;
    message?: string;
    path: string;
}
export interface LavalinkPlayerVoice {
    token: string;
    endpoint: string;
    sessionId: string;
    connected?: boolean;
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
    resuming: boolean;
    timeout: number;
}
export interface GuildShardPayload {
    /** The OP code */
    op: number;
    d: {
        guild_id: string;
        channel_id: string | null;
        self_mute: boolean;
        self_deaf: boolean;
    };
}
export interface PlayerUpdateInfo {
    guildId: string;
    playerOptions: PlayOptions;
    noReplace?: boolean;
}
export interface LavalinkPlayer {
    guildId: string;
    track?: {
        encoded?: string;
        info: {
            identifier: string;
            title: string;
            author: string;
            length: number;
            artworkUrl: string | null;
            uri: string;
            sourceName: string;
            isSeekable: boolean;
            isStream: boolean;
            isrc: string | null;
            position?: number;
        };
    };
    volume: number;
    paused: boolean;
    voice: LavalinkPlayerVoice;
    filters: Partial<LavalinkFilterData>;
}
export interface ChannelDeletePacket {
    t: "CHANNEL_DELETE";
    d: {
        guild_id: string;
        id: string;
    };
}
export interface VoiceState {
    op: "voiceUpdate";
    guildId: string;
    event: VoiceServer;
    sessionId?: string;
    guild_id: string;
    user_id: string;
    session_id: string;
    channel_id: string;
}
export type Base64 = string;
export interface VoiceServer {
    token: string;
    guild_id: string;
    endpoint: string;
}
export interface VoicePacket {
    t?: "VOICE_SERVER_UPDATE" | "VOICE_STATE_UPDATE";
    d: VoiceState | VoiceServer;
}
export interface NodeMessage extends NodeStats {
    type: PlayerEventType;
    op: "stats" | "playerUpdate" | "event";
    guildId: string;
}
export declare function queueTrackEnd(player: Player): Promise<Track>;
export type LavaSearchType = "track" | "album" | "artist" | "playlist" | "text" | "tracks" | "albums" | "artists" | "playlists" | "texts";
export interface LavaSearchFilteredResponse {
    info: PlaylistInfo;
    pluginInfo: PluginInfo;
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
export type SearchQuery = {
    query: string;
    source?: SearchPlatform;
} | string;
export type LavaSearchQuery = {
    query: string;
    source: LavaSrcSearchPlatformBase;
    types?: LavaSearchType[];
};
export {};
