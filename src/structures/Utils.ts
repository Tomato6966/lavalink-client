import { LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { DEFAULT_SOURCES, REGEXES } from "./LavalinkManagerStatics";
import { LavalinkNode, NodeStats } from "./Node";
import { PlayOptions } from "./Player";
import { LavalinkTrackDataInfoExtended, PluginDataInfo, Track } from "./Track";

export const TrackSymbol = Symbol("LC-Track");
export const QueueSymbol = Symbol("LC-Queue");
export const NodeSymbol = Symbol("LC-Node");

export type LavalinkSearchPlatform = "ytsearch" | "ytmsearch" | "scsearch" | "spsearch" | "sprec" | "amsearch" | "dzsearch" | "dzisrc" | "sprec" | "ymsearch" | "speak" | "tts";
export type ClientSearchPlatform = "youtube" | "youtube music" | "soundcloud" | "ytm" | "yt" | "sc" | "am" | "sp" | "sprec" | "spsuggestion" | "ds" | "dz" | "deezer" | "yandex" | "yandexmusic";
export type SearchPlatform = LavalinkSearchPlatform | ClientSearchPlatform;

export type SourcesRegex = "YoutubeRegex" | "YoutubeMusicRegex" | "SoundCloudRegex" | "SoundCloudMobileRegex" | "DeezerTrackRegex" | "DeezerArtistRegex" | "DeezerEpisodeRegex" | "DeezerMixesRegex" | "DeezerPageLinkRegex" | "DeezerPlaylistRegex" | "DeezerAlbumRegex" | "AllDeezerRegex" | "AllDeezerRegexWithoutPageLink" | "SpotifySongRegex" | "SpotifyPlaylistRegex" | "SpotifyArtistRegex" | "SpotifyEpisodeRegex" | "SpotifyShowRegex" | "SpotifyAlbumRegex" | "AllSpotifyRegex" | "mp3Url" | "m3uUrl" | "m3u8Url" | "mp4Url" | "m4aUrl" | "wavUrl" | "aacpUrl" | "tiktok" | "mixcloud" | "musicYandex" | "radiohost" | "bandcamp" | "appleMusic" | "TwitchTv" | "vimeo"

export interface PlaylistInfo {
    /** The playlist name. */
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
    loadType: LoadTypes,
    exception: Exception | null,
    pluginInfo: PluginDataInfo,
    playlist: PlaylistInfo | null,
    tracks: Track[]
}

export interface ManagerUitls {
    /** @private */
    manager: LavalinkManager;
}

export class ManagerUitls {
    constructor(LavalinkManager: LavalinkManager) {
        this.manager = LavalinkManager;
    }

    buildTrack(data, requester) {
        const encodedTrack = data.encoded || data.encodedTrack;
        if (!encodedTrack) throw new RangeError("Argument 'data.encoded' / 'data.encodedTrack' / 'data.track' must be present.");
        if (!data.info) data.info = {} as Partial<LavalinkTrackDataInfoExtended>;
        try {
            const r = {
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
                    requester: data.info?.requester || requester,
                },
                pluginInfo: data.pluginInfo || data.plugin || {},
                encodedTrack
            } as Track;
            Object.defineProperty(r, TrackSymbol, { configurable: true, value: true });
            return r;
        } catch (error) {
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }
    validatedQuery(queryString:string, node:LavalinkNode):void {
        if(!node.info) throw new Error("No Lavalink Node was provided");
        if(!node.info.sourceManagers?.length) throw new Error("Lavalink Node, has no sourceManagers enabled");
        
        // missing links: beam.pro local getyarn.io clypit pornhub reddit ocreamix soundgasm
        if((REGEXES.YoutubeMusicRegex.test(queryString) || REGEXES.YoutubeRegex.test(queryString)) && !node.info.sourceManagers.includes("youtube")) {
          throw new Error("Lavalink Node has not 'youtube' enabled");
        }
        if((REGEXES.SoundCloudMobileRegex.test(queryString) || REGEXES.SoundCloudRegex.test(queryString)) && !node.info.sourceManagers.includes("soundcloud")) {
          throw new Error("Lavalink Node has not 'soundcloud' enabled");
        }
        if(REGEXES.bandcamp.test(queryString) && !node.info.sourceManagers.includes("bandcamp")) {
          throw new Error("Lavalink Node has not 'bandcamp' enabled");
        }
        if(REGEXES.TwitchTv.test(queryString) && !node.info.sourceManagers.includes("twitch")) {
          throw new Error("Lavalink Node has not 'twitch' enabled");
        }
        if(REGEXES.vimeo.test(queryString) && !node.info.sourceManagers.includes("vimeo")) {
          throw new Error("Lavalink Node has not 'vimeo' enabled");
        }
        if(REGEXES.tiktok.test(queryString) && !node.info.sourceManagers.includes("tiktok")) {
          throw new Error("Lavalink Node has not 'tiktok' enabled");
        }
        if(REGEXES.mixcloud.test(queryString) && !node.info.sourceManagers.includes("mixcloud")) {
          throw new Error("Lavalink Node has not 'mixcloud' enabled");
        }
        if(REGEXES.AllSpotifyRegex.test(queryString) && !node.info.sourceManagers.includes("spotify")) {
          throw new Error("Lavalink Node has not 'spotify' enabled");
        }
        if(REGEXES.appleMusic.test(queryString) && !node.info.sourceManagers.includes("applemusic")) {
          throw new Error("Lavalink Node has not 'applemusic' enabled");
        }
        if(REGEXES.AllDeezerRegex.test(queryString) && !node.info.sourceManagers.includes("deezer")) {
          throw new Error("Lavalink Node has not 'deezer' enabled");
        }
        if(REGEXES.AllDeezerRegex.test(queryString) && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http")) {
          throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'deezer' to work");
        }
        if(REGEXES.musicYandex.test(queryString) && !node.info.sourceManagers.includes("yandexmusic")) {
          throw new Error("Lavalink Node has not 'yandexmusic' enabled");
        }

        const hasSource = queryString.split(":")[0];
        if(queryString.split(" ").length <= 1 || !queryString.split(" ")[0].includes(":")) return;
        const source = DEFAULT_SOURCES[hasSource] as LavalinkSearchPlatform;
        
        if(!source) throw new Error(`Lavalink Node SearchQuerySource: '${hasSource}' is not available`);
    
        if(source === "amsearch" && !node.info.sourceManagers.includes("applemusic"))  {
          throw new Error("Lavalink Node has not 'applemusic' enabled, which is required to have 'amsearch' work");
        }
        if(source === "dzisrc" && !node.info.sourceManagers.includes("deezer"))  {
          throw new Error("Lavalink Node has not 'deezer' enabled, which is required to have 'dzisrc' work");
        }
        if(source === "dzsearch" && !node.info.sourceManagers.includes("deezer"))  {
          throw new Error("Lavalink Node has not 'deezer' enabled, which is required to have 'dzsearch' work");
        }
        if(source === "dzisrc" && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http"))  {
          throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'dzisrc' to work");
        }
        if(source === "dzsearch" && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http"))  {
          throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'dzsearch' to work");
        }
        if(source === "scsearch" && !node.info.sourceManagers.includes("soundcloud"))  {
          throw new Error("Lavalink Node has not 'soundcloud' enabled, which is required to have 'scsearch' work");
        }
        if(source === "speak" && !node.info.sourceManagers.includes("speak"))  {
          throw new Error("Lavalink Node has not 'speak' enabled, which is required to have 'speak' work");
        }
        if(source === "tts" && !node.info.sourceManagers.includes("tts"))  {
          throw new Error("Lavalink Node has not 'tts' enabled, which is required to have 'tts' work");
        }
        if(source === "ymsearch" && !node.info.sourceManagers.includes("yandexmusic"))  {
          throw new Error("Lavalink Node has not 'yandexmusic' enabled, which is required to have 'ymsearch' work");
        }
        if(source === "ytmsearch" && !node.info.sourceManagers.includes("youtube"))  {
          throw new Error("Lavalink Node has not 'youtube' enabled, which is required to have 'ytmsearch' work");
        }
        if(source === "ytsearch" && !node.info.sourceManagers.includes("youtube"))  {
          throw new Error("Lavalink Node has not 'youtube' enabled, which is required to have 'ytsearch' work");
        }
        return;
      }
}

export class MiniMap<K, V> extends Map<K, V> {
    constructor(data = []) {
        super(data);
    }
    public filter<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): MiniMap<K2, V>;
	public filter<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): MiniMap<K, V2>;
	public filter(fn: (value: V, key: K, collection: this) => boolean): MiniMap<K, V>;
	public filter<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This,
	): MiniMap<K2, V>;
	public filter<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This,
	): MiniMap<K, V2>;
	public filter<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): MiniMap<K, V>;
	public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): MiniMap<K, V> {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = new this.constructor[Symbol.species]<K, V>();
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}
		return results;
	}
}

export type PlayerEvents =
    | TrackStartEvent
    | TrackEndEvent
    | TrackStuckEvent
    | TrackExceptionEvent
    | WebSocketClosedEvent;

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
    | "WebSocketClosedEvent";

export type TrackEndReason =
    | "FINISHED"
    | "LOAD_FAILED"
    | "STOPPED"
    | "REPLACED"
    | "CLEANUP";

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
    ping?: number
}
export interface LavalinkPlayerVoiceOptions extends Omit<LavalinkPlayerVoice, 'connected' | 'ping'> { }

export interface Address {
    address: string;
    failingTimestamp: number;
    failingTime: string;
}

export interface RoutePlanner {
    class?: string;
    details?: {
        ipBlock: {
            type: string;
            size: string;
        },
        failingAddresses: Address[]
    }
    rotateIndex?: string;
    ipIndex?: string;
    currentAddress?: string;
    blockIndex?: string;
    currentAddressIndex?: string;
}

export interface Session {
    resumingKey?: string;
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