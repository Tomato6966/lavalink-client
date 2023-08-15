import { LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { DefaultSources, SourceLinksRegexes } from "./LavalinkManagerStatics";
import { LavalinkNode, LavalinkNodeOptions, NodeStats } from "./Node";
import { PlayOptions } from "./Player";
import { Queue } from "./Queue";
import { TrackInfo, PluginInfo, Track } from "./Track";

export const TrackSymbol = Symbol("LC-Track");
export const UnresolvedTrackSymbol = Symbol("LC-Track-Unresolved");
export const QueueSymbol = Symbol("LC-Queue");
export const NodeSymbol = Symbol("LC-Node");

export type LavalinkSearchPlatform = "ytsearch" | "ytmsearch" | "scsearch" | "spsearch" | "sprec" | "amsearch" | "dzsearch" | "dzisrc" | "sprec" | "ymsearch" | "speak" | "tts" | "ftts";

export type ClientSearchPlatform =
  "youtube" | "yt" | "yt" |
  "youtube music" | "youtubemusic" | "ytm" |
  "soundcloud" | "sc" |
  "am" | "apple music" | "applemusic" | "apple" | "yandex music" |
  "sp" | "sprec" | "spsuggestion" | "spotify" |
  "dz" | "deezer" |
  "yandex" | "yandexmusic";

export type SearchPlatform = LavalinkSearchPlatform | ClientSearchPlatform;

export type SourcesRegex = "YoutubeRegex" | "YoutubeMusicRegex" | "SoundCloudRegex" | "SoundCloudMobileRegex" | "DeezerTrackRegex" | "DeezerArtistRegex" | "DeezerEpisodeRegex" | "DeezerMixesRegex" | "DeezerPageLinkRegex" | "DeezerPlaylistRegex" | "DeezerAlbumRegex" | "AllDeezerRegex" | "AllDeezerRegexWithoutPageLink" | "SpotifySongRegex" | "SpotifyPlaylistRegex" | "SpotifyArtistRegex" | "SpotifyEpisodeRegex" | "SpotifyShowRegex" | "SpotifyAlbumRegex" | "AllSpotifyRegex" | "mp3Url" | "m3uUrl" | "m3u8Url" | "mp4Url" | "m4aUrl" | "wavUrl" | "aacpUrl" | "tiktok" | "mixcloud" | "musicYandex" | "radiohost" | "bandcamp" | "appleMusic" | "TwitchTv" | "vimeo"

export interface PlaylistInfo {
  /** The playlist title. */
  title: string;
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
  pluginInfo: PluginInfo,
  playlist: PlaylistInfo | null,
  tracks: Track[]
}

export interface ManagerUitls {
  /** @private */
  manager: LavalinkManager;
}

export class ManagerUitls {
  constructor(LavalinkManager?: LavalinkManager) {
    this.manager = LavalinkManager;
  }



  buildTrack(data, requester) {
    const encoded = data.encoded || data.encoded;
    if (!encoded) throw new RangeError("Argument 'data.encoded' / 'data.encoded' / 'data.track' must be present.");
    if (!data.info) data.info = {} as Partial<TrackInfo>;
    try {
      const r = {
        encoded,
        info: {
          identifier: data.info?.identifier,
          title: data.info?.title,
          author: data.info?.author,
          duration: data.info?.length,
          artworkUrl: data.info?.artworkUrl || data.pluginInfo?.artworkUrl || data.plugin?.artworkUrl,
          uri: data.info?.uri,
          sourceName: data.info?.sourceName,
          isSeekable: data.info?.isSeekable,
          isStream: data.info?.isStream,
          isrc: data.info?.isrc,
        },
        pluginInfo: data.pluginInfo || data.plugin || {},
        requester: typeof this.manager.options?.playerOptions?.requesterTransformer === "function" ? this.manager.options?.playerOptions?.requesterTransformer(data?.requester || requester) : requester,
      } as Track;

      Object.defineProperty(r, TrackSymbol, { configurable: true, value: true });
      return r;
    } catch (error) {
      throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
    }
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
  /**
   * Validate if a data is equal to node options
   * @param data 
   */
  isNodeOptions(data: LavalinkNodeOptions | any) {
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;
    if (typeof data.host !== "string" || !data.host.length) return false;
    if (typeof data.port !== "number" || isNaN(data.port) || data.port < 0 || data.port > 65535) return false;
    if (typeof data.authorization !== "string" || !data.authorization.length) return false;
    if ("secure" in data && typeof data.secure !== "boolean") return false;
    if ("sessionId" in data && typeof data.sessionId !== "string") return false;
    if ("id" in data && typeof data.id !== "string") return false;
    if ("regions" in data && (!Array.isArray(data.regions) || !data.regions.every(v => typeof v === "string"))) return false;
    if ("poolOptions" in data && typeof data.poolOptions !== "object") return false;
    if ("retryAmount" in data && (typeof data.retryAmount !== "number" || isNaN(data.retryAmount) || data.retryAmount <= 0)) return false;
    if ("retryDelay" in data && (typeof data.retryDelay !== "number" || isNaN(data.retryDelay) || data.retryDelay <= 0)) return false;
    if ("requestTimeout" in data && (typeof data.requestTimeout !== "number" || isNaN(data.requestTimeout) || data.requestTimeout <= 0)) return false;
    return true;
  }
  /**
   * Validate if a data is euqal to a track
   * @param data the Track to validate 
   * @returns
   */
  isTrack(data: Track | any) {
    return typeof data?.encoded === "string" && typeof data?.info === "object";
  }

  validatedQuery(queryString: string, node: LavalinkNode): void {
    if (!node.info) throw new Error("No Lavalink Node was provided");
    if (!node.info.sourceManagers?.length) throw new Error("Lavalink Node, has no sourceManagers enabled");

    // missing links: beam.pro local getyarn.io clypit pornhub reddit ocreamix soundgasm
    if ((SourceLinksRegexes.YoutubeMusicRegex.test(queryString) || SourceLinksRegexes.YoutubeRegex.test(queryString)) && !node.info.sourceManagers.includes("youtube")) {
      throw new Error("Lavalink Node has not 'youtube' enabled");
    }
    if ((SourceLinksRegexes.SoundCloudMobileRegex.test(queryString) || SourceLinksRegexes.SoundCloudRegex.test(queryString)) && !node.info.sourceManagers.includes("soundcloud")) {
      throw new Error("Lavalink Node has not 'soundcloud' enabled");
    }
    if (SourceLinksRegexes.bandcamp.test(queryString) && !node.info.sourceManagers.includes("bandcamp")) {
      throw new Error("Lavalink Node has not 'bandcamp' enabled");
    }
    if (SourceLinksRegexes.TwitchTv.test(queryString) && !node.info.sourceManagers.includes("twitch")) {
      throw new Error("Lavalink Node has not 'twitch' enabled");
    }
    if (SourceLinksRegexes.vimeo.test(queryString) && !node.info.sourceManagers.includes("vimeo")) {
      throw new Error("Lavalink Node has not 'vimeo' enabled");
    }
    if (SourceLinksRegexes.tiktok.test(queryString) && !node.info.sourceManagers.includes("tiktok")) {
      throw new Error("Lavalink Node has not 'tiktok' enabled");
    }
    if (SourceLinksRegexes.mixcloud.test(queryString) && !node.info.sourceManagers.includes("mixcloud")) {
      throw new Error("Lavalink Node has not 'mixcloud' enabled");
    }
    if (SourceLinksRegexes.AllSpotifyRegex.test(queryString) && !node.info.sourceManagers.includes("spotify")) {
      throw new Error("Lavalink Node has not 'spotify' enabled");
    }
    if (SourceLinksRegexes.appleMusic.test(queryString) && !node.info.sourceManagers.includes("applemusic")) {
      throw new Error("Lavalink Node has not 'applemusic' enabled");
    }
    if (SourceLinksRegexes.AllDeezerRegex.test(queryString) && !node.info.sourceManagers.includes("deezer")) {
      throw new Error("Lavalink Node has not 'deezer' enabled");
    }
    if (SourceLinksRegexes.AllDeezerRegex.test(queryString) && node.info.sourceManagers.includes("deezer") && !node.info.sourceManagers.includes("http")) {
      throw new Error("Lavalink Node has not 'http' enabled, which is required to have 'deezer' to work");
    }
    if (SourceLinksRegexes.musicYandex.test(queryString) && !node.info.sourceManagers.includes("yandexmusic")) {
      throw new Error("Lavalink Node has not 'yandexmusic' enabled");
    }

    const hasSource = queryString.split(":")[0];
    if (queryString.split(" ").length <= 1 || !queryString.split(" ")[0].includes(":")) return;
    const source = DefaultSources[hasSource] as LavalinkSearchPlatform;

    if (!source) throw new Error(`Lavalink Node SearchQuerySource: '${hasSource}' is not available`);

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
    if (source === "ftts" && !node.info.sourceManagers.includes("ftts")) {
      console.log(node.info.sourceManagers);
      throw new Error("Lavalink Node has not 'ftts' enabled, which is required to have 'ftts' work");
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

/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
export interface MiniMap<K, V> extends Map<K, V> {
  constructor: MiniMapConstructor;
}

export class MiniMap<K, V> extends Map<K, V> {
  constructor(data = []) {
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
    // toJSON is called recursively by JSON.stringify.
    return [...this.values()];
  }

  private static defaultSort<V>(firstValue: V, secondValue: V): number {
    return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return fn(value, key, this);
    });
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
  | "finished"
  | "loadFailed"
  | "stopped"
  | "replaced"
  | "cleanup";

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


export async function queueTrackEnd(queue: Queue, addBackToQueue: boolean = false) {
  if (queue.current) { // if there was a current Track -> Add it
    queue.previous.unshift(queue.current);
    if (queue.previous.length > queue.options.maxPreviousTracks) queue.previous.splice(queue.options.maxPreviousTracks, queue.previous.length);
  }
  // and if repeatMode == queue, add it back to the queue!
  if (addBackToQueue && queue.current) queue.tracks.push(queue.current)
  // change the current Track to the next upcoming one
  queue.current = queue.tracks.shift() || null;
  // save it in the DB
  await queue.utils.save()

  // return the new current Track
  return queue.current;
}