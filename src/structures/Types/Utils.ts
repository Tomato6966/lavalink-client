import type { MiniMap } from "../Utils";

import type { LavalinkFilterData } from "./Filters";
import type { LyricsLine, LyricsResult, NodeStats } from "./Node";
import type { LavalinkPlayOptions } from "./Player";
import type { LavalinkTrack, PluginInfo, Track, UnresolvedTrack } from "./Track";

/** Helper for generating Opaque types. */
export type Opaque<T, K> = T & { __opaque__: K };

/** Opqaue tyep for integernumber */
export type IntegerNumber = Opaque<number, 'Int'>;

/** Opqaue tyep for floatnumber */
export type FloatNumber = Opaque<number, 'Float'>;

export type LavaSrcSearchPlatformBase =
    "spsearch" |
    "sprec" |
    "amsearch" |
    "dzsearch" |
    "dzisrc" |
    "dzrec" |
    "ymsearch" |
    "ymrec" |
    "vksearch" |
    "vkrec" |
    "tdsearch" |
    "tdrec" |
    "qbsearch" |
    "qbisrc" |
    "qbrec" |
    "pdsearch" |
    "pdisrc" |
    "pdrec";
export type LavaSrcSearchPlatform = LavaSrcSearchPlatformBase | "ftts";

export type JioSaavnSearchPlatform = "jssearch" | "jsrec";

export type DuncteSearchPlatform =
    "speak" |
    "phsearch" |
    "pornhub" |
    "porn" |
    "tts";

export type LavalinkClientSearchPlatform = "bcsearch";
export type LavalinkClientSearchPlatformResolve = "bandcamp" | "bc";

export type LavalinkSearchPlatform = "ytsearch" |
    "ytmsearch" |
    "scsearch" |
    "bcsearch" |
    LavaSrcSearchPlatform |
    DuncteSearchPlatform |
    JioSaavnSearchPlatform |
    LavalinkClientSearchPlatform;

export type ClientCustomSearchPlatformUtils = "local" | "http" | "https" | "link" | "uri";

export type ClientSearchPlatform =
    ClientCustomSearchPlatformUtils | // for file/link requests
    "youtube" | "yt" |
    "youtube music" | "youtubemusic" | "ytm" | "musicyoutube" | "music youtube" |
    "soundcloud" | "sc" |
    "am" | "apple music" | "applemusic" | "apple" | "musicapple" | "music apple" |
    "sp" | "spsuggestion" | "spotify" | "spotify.com" | "spotifycom" |
    "dz" | "deezer" |
    "yandex" | "yandex music" | "yandexmusic" | "vk" | "vk music" | "vkmusic" | "tidal" | "tidal music" | "qobuz" |
    "pandora" | "pd" | "pandora music" | "pandoramusic" |
    "flowerytts" | "flowery" | "flowery.tts" | LavalinkClientSearchPlatformResolve | LavalinkClientSearchPlatform | "js" | "jiosaavn" | "td" | "tidal" | "tdrec";

export type SearchPlatform = LavalinkSearchPlatform | ClientSearchPlatform;

export type SourcesRegex = "YoutubeRegex" |
    "YoutubeMusicRegex" |
    "SoundCloudRegex" |
    "SoundCloudMobileRegex" |
    "DeezerTrackRegex" |
    "DeezerArtistRegex" |
    "DeezerEpisodeRegex" |
    "DeezerMixesRegex" |
    "DeezerPageLinkRegex" |
    "DeezerPlaylistRegex" |
    "DeezerAlbumRegex" |
    "AllDeezerRegex" |
    "AllDeezerRegexWithoutPageLink" |
    "SpotifySongRegex" |
    "SpotifyPlaylistRegex" |
    "SpotifyArtistRegex" |
    "SpotifyEpisodeRegex" |
    "SpotifyShowRegex" |
    "SpotifyAlbumRegex" |
    "AllSpotifyRegex" |
    "mp3Url" |
    "m3uUrl" |
    "m3u8Url" |
    "mp4Url" |
    "m4aUrl" |
    "wavUrl" |
    "aacpUrl" |
    "tiktok" |
    "mixcloud" |
    "musicYandex" |
    "radiohost" |
    "bandcamp" |
    "jiosaavn" |
    "appleMusic" |
    "tidal" |
    "PandoraTrackRegex" |
    "PandoraAlbumRegex" |
    "PandoraArtistRegex" |
    "PandoraPlaylistRegex" |
    "AllPandoraRegex" |
    "TwitchTv" |
    "vimeo";

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
    loadType: LoadTypes,
    exception: Exception | null,
    pluginInfo: PluginInfo,
    playlist: PlaylistInfo | null,
    tracks: Track[]
}

export interface UnresolvedSearchResult {
    loadType: LoadTypes,
    exception: Exception | null,
    pluginInfo: PluginInfo,
    playlist: PlaylistInfo | null,
    tracks: UnresolvedTrack[]
}

/**
 * @internal
 */
export interface MiniMapConstructor {
    new(): MiniMap<unknown, unknown>;
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): MiniMap<K, V>;
    new <K, V>(iterable: Iterable<readonly [K, V]>): MiniMap<K, V>;
    readonly prototype: MiniMap<unknown, unknown>;
    readonly [Symbol.species]: MiniMapConstructor;
}

export type PlayerEvents =
    | TrackStartEvent
    | TrackEndEvent
    | TrackStuckEvent
    | TrackExceptionEvent
    | WebSocketClosedEvent | SponsorBlockSegmentEvents | LyricsEvent;

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
    /** causeStackTrace by lavalink */
    causeStackTrace: string;
}

export interface PlayerEvent {
    op: "event";
    type: PlayerEventType;
    guildId: string;
}
export interface TrackStartEvent extends PlayerEvent {
    type: "TrackStartEvent";
    track: LavalinkTrack;
}

export interface TrackEndEvent extends PlayerEvent {
    type: "TrackEndEvent";
    track: LavalinkTrack;
    reason: TrackEndReason;
}

export interface TrackExceptionEvent extends PlayerEvent {
    type: "TrackExceptionEvent";
    exception?: Exception;
    track: LavalinkTrack;
    error: string;
}

export interface TrackStuckEvent extends PlayerEvent {
    type: "TrackStuckEvent";
    thresholdMs: number;
    track: LavalinkTrack;
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
    /* The loaded segment(s) */
    segments: {
        /* The Category name */
        category: string;
        /* In Milliseconds */
        start: number;
        /* In Milliseconds */
        end: number;
    }[]
}
export interface SponsorBlockSegmentSkipped extends PlayerEvent {
    type: "SegmentSkipped";
    /* The skipped segment*/
    segment: {
        /* The Category name */
        category: string;
        /* In Milliseconds */
        start: number;
        /* In Milliseconds */
        end: number;
    }
}

export interface SponsorBlockChapterStarted extends PlayerEvent {
    type: "ChapterStarted";
    /** The Chapter which started */
    chapter: {
        /** The Name of the Chapter */
        name: string;
        /* In Milliseconds */
        start: number;
        /* In Milliseconds */
        end: number;
        /* In Milliseconds */
        duration: number;
    }
}


export interface SponsorBlockChaptersLoaded extends PlayerEvent {
    type: "ChaptersLoaded";
    /** All Chapters loaded */
    chapters: {
        /** The Name of the Chapter */
        name: string;
        /* In Milliseconds */
        start: number;
        /* In Milliseconds */
        end: number;
        /* In Milliseconds */
        duration: number;
    }[]
}

/**
 * Types & Events for Lyrics plugin from Lavalink: https://github.com/topi314/LavaLyrics
 */
export type LyricsEvent = LyricsFoundEvent | LyricsNotFoundEvent | LyricsLineEvent;

export type LyricsEventType = "LyricsFoundEvent" | "LyricsNotFoundEvent" | "LyricsLineEvent";

export interface LyricsFoundEvent extends PlayerEvent {
    /** The lyricsfound event */
    type: "LyricsFoundEvent";
    /** The guildId */
    guildId: string;
    /** The lyrics */
    lyrics: LyricsResult;
}

export interface LyricsNotFoundEvent extends PlayerEvent {
    /**The lyricsnotfound event*/
    type: "LyricsNotFoundEvent";
    /**The guildId*/
    guildId: string;
}

export interface LyricsLineEvent extends PlayerEvent {
    /**The lyricsline event*/
    type: "LyricsLineEvent";
    /** The guildId */
    guildId: string;
    /** The line number */
    lineIndex: number;
    /** The line */
    line: LyricsLine;
    /**skipped is true if the line was skipped */
    skipped: boolean;
}

export interface LyricsFoundEvent extends PlayerEvent {
    /** The lyricsfound event */
    type: "LyricsFoundEvent";
    /** The guildId */
    guildId: string;
    /** The lyrics */
    lyrics: LyricsResult;
}

export interface LyricsNotFoundEvent extends PlayerEvent {
    /**The lyricsnotfound event*/
    type: "LyricsNotFoundEvent";
    /**The guildId*/
    guildId: string;
}

export interface LyricsLineEvent extends PlayerEvent {
    /**The lyricsline event*/
    type: "LyricsLineEvent";
    /** The guildId */
    guildId: string;
    /** The line number */
    lineIndex: number;
    /** The line */
    line: LyricsLine;
    /**skipped is true if the line was skipped */
    skipped: boolean;
}
export type LoadTypes =
    | "track"
    | "playlist"
    | "search"
    | "error"
    | "empty";

export type State =
    | "CONNECTED"
    | "CONNECTING"
    | "DISCONNECTED"
    | "DISCONNECTING"
    | "DESTROYING";

export type PlayerEventType =
    | "TrackStartEvent"
    | "TrackEndEvent"
    | "TrackExceptionEvent"
    | "TrackStuckEvent"
    | "WebSocketClosedEvent" | SponsorBlockSegmentEventType | LyricsEventType;

export type TrackEndReason =
    | "finished"
    | "loadFailed"
    | "stopped"
    | "replaced"
    | "cleanup";

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
    ping?: number
}

export type LavalinkPlayerVoiceOptions = Omit<LavalinkPlayerVoice, 'connected' | 'ping'>;

export interface FailingAddress {
    /** The failing address */
    failingAddress: string;
    /** The timestamp when the address failed */
    failingTimestamp: number;
    /** The timestamp when the address failed as a pretty string */
    failingTime: string;
}

export type RoutePlannerTypes = "RotatingIpRoutePlanner" | "NanoIpRoutePlanner" | "RotatingNanoIpRoutePlanner" | "BalancingIpRoutePlanner";

export interface RoutePlanner {
    class?: RoutePlannerTypes;
    details?: {
        /** The ip block being used */
        ipBlock: {
            /** The type of the ip block */
            type: "Inet4Address" | "Inet6Address";
            /** 	The size of the ip block */
            size: string;
        },
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
    }
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
    }
}


export interface ChannelDeletePacket {
    /** Packet key for channel delete */
    t: "CHANNEL_DELETE",
    /** data which is sent and relevant */
    d: {
        /** guild id */
        guild_id: string;
        /** Channel id */
        id: string;
    }
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
    /** Server Mute status */
    mute: boolean;
    /** Server Deaf status */
    deaf: boolean;
    /** Self Deaf status */
    self_deaf: boolean;
    /** Self Mute status */
    self_mute: boolean;
    /** Self Video (Camera) status */
    self_video: boolean;
    /** Self Stream status */
    self_stream: boolean;
    /** Wether the user requests to speak (stage channel) */
    request_to_speak_timestamp: boolean;
    /** Self suppressed status (stage channel) */
    suppress: boolean;
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



/** Specific types to filter for lavasearch, will be filtered to correct types */
export type LavaSearchType = "track" | "album" | "artist" | "playlist" | "text" | "tracks" | "albums" | "artists" | "playlists" | "texts";

export interface LavaSearchFilteredResponse {
    /** The Information of a playlist provided by lavasearch */
    info: PlaylistInfo,
    /** additional plugin information */
    pluginInfo: PluginInfo,
    /** List of tracks  */
    tracks: Track[]
}

export interface LavaSearchResponse {
    /** An array of tracks, only present if track is in types */
    tracks: Track[],
    /** An array of albums, only present if album is in types */
    albums: LavaSearchFilteredResponse[],
    /** 	An array of artists, only present if artist is in types */
    artists: LavaSearchFilteredResponse[],
    /** 	An array of playlists, only present if playlist is in types */
    playlists: LavaSearchFilteredResponse[],
    /** An array of text results, only present if text is in types */
    texts: {
        text: string,
        pluginInfo: PluginInfo
    }[],
    /** Addition result data provided by plugins */
    pluginInfo: PluginInfo
}

/** SearchQuery Object for raw lavalink requests */
export type SearchQuery = {
    /** lavalink search Query / identifier string */
    query: string,
    /** Extra url query params to use, e.g. for flowertts */
    extraQueryUrlParams?: URLSearchParams;
    /** Source to append to the search query string */
    source?: SearchPlatform
} | /** Our just the search query / identifier string */ string;
/** SearchQuery Object for Lavalink LavaSearch Plugin requests */
export type LavaSearchQuery = {
    /** lavalink search Query / identifier string */
    query: string,
    /** Source to append to the search query string */
    source: LavaSrcSearchPlatformBase,
    /** The Types to filter the search to */
    types?: LavaSearchType[]
};

export type Awaitable<T> = Promise<T> | T
