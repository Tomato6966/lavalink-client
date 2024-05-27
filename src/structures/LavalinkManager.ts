import { EventEmitter } from "events";

import { LavalinkNodeOptions } from "./Node";
import { NodeManager } from "./NodeManager";
import { DestroyReasons, DestroyReasonsType, Player, PlayerJson, PlayerOptions } from "./Player";
import { DefaultQueueStore, ManagerQueueOptions } from "./Queue";
import { Track, UnresolvedTrack } from "./Track";
import {
	ChannelDeletePacket, GuildShardPayload, ManagerUtils, MiniMap, SearchPlatform,
	SponsorBlockChaptersLoaded, SponsorBlockChapterStarted, SponsorBlockSegmentSkipped,
	SponsorBlockSegmentsLoaded, TrackEndEvent, TrackExceptionEvent, TrackStartEvent,
	TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent
} from "./Utils";

export interface BotClientOptions {
  /** Bot Client Id */
  id: string;
  /** Bot Client Username */
  username?: string;
  /** So users can pass entire objects / classes */
  [x: string | number | symbol]: unknown;
}

export interface ManagerPlayerOptions {
  /** If the Lavalink Volume should be decremented by x number */
  volumeDecrementer?: number;
  /** How often it should update the the player Position */
  clientBasedPositionUpdateInterval?: number;
  /** What should be used as a searchPlatform, if no source was provided during the query */
  defaultSearchPlatform?: SearchPlatform;
  /** Applies the volume via a filter, not via the lavalink volume transformer */
  applyVolumeAsFilter?: boolean;
  /** Transforms the saved data of a requested user */
  requesterTransformer?: (requester: unknown) => unknown;
  /** What lavalink-client should do when the player reconnects */
  onDisconnect?: {
    /** Try to reconnect? -> If fails -> Destroy */
    autoReconnect?: boolean;
    /** Instantly destroy player (overrides autoReconnect) | Don't provide == disable feature*/
    destroyPlayer?: boolean;
  };
  /* What the Player should do, when the queue gets empty */
  onEmptyQueue?: {
    /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
    autoPlayFunction?: (player: Player, lastPlayedTrack: Track) => Promise<void>;
    /* aut. destroy the player after x ms, if 0 it instantly destroys, don't provide to not destroy the player */
    destroyAfterMs?: number;
  };
  /* If to override the data from the Unresolved Track. for unresolved tracks */
  useUnresolvedData?: boolean;
}

export interface ManagerOptions {
  /** The Node Options, for all Nodes! (on init) */
  nodes: LavalinkNodeOptions[];
  /** @async The Function to send the voice connection changes from Lavalink to Discord */
  sendToShard: (guildId: string, payload: GuildShardPayload) => void;
  /** The Bot Client's Data for Authorization */
  client?: BotClientOptions;
  /** QueueOptions for all Queues */
  queueOptions?: ManagerQueueOptions;
  /** PlayerOptions for all Players */
  playerOptions?: ManagerPlayerOptions;
  /** If it should skip to the next Track on TrackEnd / TrackError etc. events */
  autoSkip?: boolean;
  /** If it should skip to the next Track if track.resolve errors while trying to play a track. */
  autoSkipOnResolveError?: boolean;
  /** If it should emit only new (unique) songs and not when a looping track (or similar) is plaid, default false */
  emitNewSongsOnly?: boolean;
  /** Only allow link requests with links either matching some of that regExp or including some of that string */
  linksWhitelist?: (RegExp|string)[];
  /** Never allow link requests with links either matching some of that regExp or including some of that string (doesn't even allow if it's whitelisted) */
  linksBlacklist?: (RegExp|string)[];
  /** If links should be allowed or not. If set to false, it will throw an error if a link was provided. */
  linksAllowed?: boolean;
  /** Advanced Options for the Library, which may or may not be "library breaking" */
  advancedOptions?: {
    /** optional */
    debugOptions?: {
      /** logs for debugging the "no-Audio" playing error */
      noAudio?: boolean;
      /** For Logging the Destroy function */
      playerDestroy?: {
        /** To show the debug reason at all times. */
        debugLog?: boolean;
        /** If you get 'Error: Use Player#destroy("reason") not LavalinkManager#deletePlayer() to stop the Player' put it on true */
        dontThrowError?: boolean;
      }
    }
  }
}

interface LavalinkManagerEvents {
  /**
   * Emitted when a Track started playing.
   * @event Manager#trackStart
   */
  "trackStart": (player: Player, track: Track, payload: TrackStartEvent) => void;
  /**
   * Emitted when a Track finished.
   * @event Manager#trackEnd
   */
  "trackEnd": (player: Player, track: Track, payload: TrackEndEvent) => void;
  /**
   * Emitted when a Track got stuck while playing.
   * @event Manager#trackStuck
   */
  "trackStuck": (player: Player, track: Track, payload: TrackStuckEvent) => void;
  /**
   * Emitted when a Track errored.
   * @event Manager#trackError
   */
  "trackError": (player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent) => void;
  /**
   * Emitted when the Playing finished and no more tracks in the queue.
   * @event Manager#queueEnd
   */
  "queueEnd": (player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
  /**
   * Emitted when a Player is created.
   * @event Manager#playerCreate
   */
  "playerCreate": (player: Player) => void;
  /**
   * Emitted when a Player is moved within the channel.
   * @event Manager#playerMove
   */
  "playerMove": (player: Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
  /**
   * Emitted when a Player is disconnected from a channel.
   * @event Manager#playerDisconnect
   */
  "playerDisconnect": (player: Player, voiceChannelId: string) => void;
  /**
   * Emitted when a Node-Socket got closed for a specific Player.
   * @event Manager#playerSocketClosed
   */
  "playerSocketClosed": (player: Player, payload: WebSocketClosedEvent) => void;
  /**
   * Emitted when a Player get's destroyed
   * @event Manager#playerDestroy
   */
  "playerDestroy": (player: Player, destroyReason?: DestroyReasonsType) => void;

  /**
   * Always emits when the player (on lavalink side) got updated
   * @event Manager#playerUpdate
   */
  "playerUpdate": (oldPlayerJson: PlayerJson, newPlayer: Player) => void;


  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when Segments are loaded
   * @link https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
   * @event Manager#trackError
   */
  "SegmentsLoaded": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentsLoaded) => void;

  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when a specific Segment was skipped
   * @link https://github.com/topi314/Sponsorblock-Plugin#segmentskipped
   * @event Manager#trackError
   */
  "SegmentSkipped": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentSkipped) => void;

  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when a specific Chapter starts playing
   * @link https://github.com/topi314/Sponsorblock-Plugin#chapterstarted
   * @event Manager#trackError
   */
  "ChapterStarted": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChapterStarted) => void;

  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when Chapters are loaded
   * @link https://github.com/topi314/Sponsorblock-Plugin#chaptersloaded
   * @event Manager#trackError
   */
  "ChaptersLoaded": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChaptersLoaded) => void;
}

export interface LavalinkManager {
  /** @private */
  on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;
  /** @private */
  emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
}

export class LavalinkManager extends EventEmitter {
  /** The Options of LavalinkManager (changeable) */
  public options: ManagerOptions;
  /** LavalinkManager's NodeManager to manage all Nodes */
  public nodeManager: NodeManager;
  /** LavalinkManager's Utils Class */
  public utils: ManagerUtils;
  /** Wether the manager was initiated or not */
  public initiated: boolean = false;
  /** All Players stored in a MiniMap */
  public readonly players: MiniMap<string, Player> = new MiniMap();

  /**
   * Applies the options provided by the User
   * @param options 
   * @returns 
   */
  private applyOptions(options: ManagerOptions) {
    this.options = {
      client: {
        ...(options?.client || {}),
        id: options?.client?.id,
        username: options?.client?.username ?? "lavalink-client"
      },
      sendToShard: options?.sendToShard,
      nodes: options?.nodes,
      playerOptions: {
        applyVolumeAsFilter: options?.playerOptions?.applyVolumeAsFilter ?? false,
        clientBasedPositionUpdateInterval: options?.playerOptions?.clientBasedPositionUpdateInterval ?? 100,
        defaultSearchPlatform: options?.playerOptions?.defaultSearchPlatform ?? "ytsearch",
        onDisconnect: {
          destroyPlayer: options?.playerOptions?.onDisconnect?.destroyPlayer ?? true,
          autoReconnect: options?.playerOptions?.onDisconnect?.autoReconnect ?? false
        },
        onEmptyQueue: {
          autoPlayFunction: options?.playerOptions?.onEmptyQueue?.autoPlayFunction ?? null,
          destroyAfterMs: options?.playerOptions?.onEmptyQueue?.destroyAfterMs ?? undefined
        },
        volumeDecrementer: options?.playerOptions?.volumeDecrementer ?? 1,
        requesterTransformer: options?.playerOptions?.requesterTransformer ?? null,
        useUnresolvedData: options?.playerOptions?.useUnresolvedData ?? false,
      },
      linksWhitelist: options?.linksWhitelist ?? [],
      linksBlacklist: options?.linksBlacklist ?? [],
      autoSkip: options?.autoSkip ?? true,
      autoSkipOnResolveError: options?.autoSkipOnResolveError ?? true,
      emitNewSongsOnly: options?.emitNewSongsOnly ?? false,
      queueOptions: {
        maxPreviousTracks: options?.queueOptions?.maxPreviousTracks ?? 25,
        queueChangesWatcher: options?.queueOptions?.queueChangesWatcher ?? null,
        queueStore: options?.queueOptions?.queueStore ?? new DefaultQueueStore(),
      },
      advancedOptions: {
        debugOptions: {
          noAudio: options?.advancedOptions?.debugOptions?.noAudio ?? false,
          playerDestroy: {
            dontThrowError: options?.advancedOptions?.debugOptions?.playerDestroy?.dontThrowError ?? false,
            debugLog: options?.advancedOptions?.debugOptions?.playerDestroy?.debugLog ?? false,
          }
        }
      }
    }
    return;
  }

  /**
   * Validates the current manager's options
   * @param options 
   */
  private validateOptions(options: ManagerOptions) {
    if (typeof options?.sendToShard !== "function") throw new SyntaxError("ManagerOption.sendToShard was not provided, which is required!");
    // only check in .init()
    // if(typeof options?.client !== "object" || typeof options?.client.id !== "string") throw new SyntaxError("ManagerOption.client = { id: string, username?:string } was not provided, which is required");

    if (options?.autoSkip && typeof options?.autoSkip !== "boolean") throw new SyntaxError("ManagerOption.autoSkip must be either false | true aka boolean");

    if (options?.autoSkipOnResolveError && typeof options?.autoSkipOnResolveError !== "boolean") throw new SyntaxError("ManagerOption.autoSkipOnResolveError must be either false | true aka boolean");

    if (options?.emitNewSongsOnly && typeof options?.emitNewSongsOnly !== "boolean") throw new SyntaxError("ManagerOption.emitNewSongsOnly must be either false | true aka boolean");

    if (!options?.nodes || !Array.isArray(options?.nodes) || !options?.nodes.every(node => this.utils.isNodeOptions(node))) throw new SyntaxError("ManagerOption.nodes must be an Array of NodeOptions and is required of at least 1 Node");

    /* QUEUE STORE */
    if (options?.queueOptions?.queueStore) {
      const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(options?.queueOptions?.queueStore));
      const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
      if (!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options?.queueOptions?.queueStore[v] === "function")) throw new SyntaxError(`The provided ManagerOption.QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
    }

    /* QUEUE WATCHER */
    if (options?.queueOptions?.queueChangesWatcher) {
      const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(options?.queueOptions?.queueChangesWatcher));
      const requiredKeys = ["tracksAdd", "tracksRemoved", "shuffled"];
      if (!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options?.queueOptions?.queueChangesWatcher[v] === "function")) throw new SyntaxError(`The provided ManagerOption.DefaultQueueChangesWatcher, does not have all required functions: ${requiredKeys.join(", ")}`);
    }

    if (typeof options?.queueOptions?.maxPreviousTracks !== "number" || options?.queueOptions?.maxPreviousTracks < 0) options.queueOptions.maxPreviousTracks = 25;


  }

  /**
   * Create the Lavalink Manager
   * @param options 
   * 
   * @example
   * ```ts
   * //const client = new Client({...}); // create your BOT Client (e.g. via discord.js)
   * client.lavalink = new LavalinkManager({
   *   nodes: [
   *     {
   *       authorization: "yourverystrongpassword",
   *       host: "localhost",
   *       port: 2333,
   *       id: "testnode"
   *     },
   *     sendToShard(guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
   *     client: {
   *       id: process.env.CLIENT_ID,
   *       username: "TESTBOT"
   *     },
   *     // optional Options:
   *     autoSkip: true,
   *     playerOptions: {
   *       applyVolumeAsFilter: false,
   *       clientBasedPositionUpdateInterval: 150,
   *       defaultSearchPlatform: "ytmsearch",
   *       volumeDecrementer: 0.75,
   *       //requesterTransformer: YourRequesterTransformerFunction,
   *       onDisconnect: {
   *         autoReconnect: true,
   *         destroyPlayer: false
   *       },
   *       onEmptyQueue: {
   *         destroyAfterMs: 30_000,
   *         //autoPlayFunction: YourAutoplayFunction,
   *       },
   *       useUnresolvedData: true
   *     },
   *     queueOptions: {
   *       maxPreviousTracks: 25,
   *       //queueStore: yourCustomQueueStoreManagerClass,
   *       //queueChangesWatcher: yourCustomQueueChangesWatcherClass
   *     },
   *     linksBlacklist: [],
   *     linksWhitelist: [],
   *     advancedOptions: {
   *       debugOptions: {
   *         noAudio: false,
   *         playerDestroy: {
   *           dontThrowError: false,
   *           debugLogs: false
   *         }
   *       }
   *     }
   *   ]
   * })
   * ```
   */
  constructor(options: ManagerOptions) {
    super();

    if (!options) throw new SyntaxError("No Manager Options Provided")
    this.utils = new ManagerUtils(this);

    // use the validators
    this.applyOptions(options);
    this.validateOptions(this.options);

    // create classes
    this.nodeManager = new NodeManager(this);

  }

  /**
   * Get a Player from Lava
   * @param guildId The guildId of the player
   * 
   * @example
   * ```ts
   * const player = client.lavalink.getPlayer(interaction.guildId);
   * ```
   * A quicker and easier way than doing:
   * ```ts
   * const player = client.lavalink.players.get(interaction.guildId);
   * ```
   * @returns
   */
  public getPlayer(guildId: string) {
    return this.players.get(guildId);
  }

  /**
   * Create a Music-Player. If a player exists, then it returns it before creating a new one
   * @param options 
   * @returns 
   * 
   * @example
   * ```ts
   * const player = client.lavalink.createPlayer({
   *   guildId: interaction.guildId,
   *   voiceChannelId: interaction.member.voice.channelId,
   *   // everything below is optional
   *   textChannelId: interaction.channelId,
   *   volume: 100,
   *   selfDeaf: true,
   *   selfMute: false,
   *   instaUpdateFiltersFix: true,
   *   applyVolumeAsFilter: false
   *   //only needed if you want to autopick node by region (configured by you)
   *   // vcRegion: interaction.member.voice.rtcRegion,
   *   // provide a specific node
   *   // node: client.lavalink.nodeManager.leastUsedNodes("memory")[0] 
   * });
   * ```
   */
  public createPlayer(options: PlayerOptions) {
    const oldPlayer = this.getPlayer(options?.guildId)
    if (oldPlayer) return oldPlayer;

    const newPlayer = new Player(options, this);
    this.players.set(newPlayer.guildId, newPlayer);
    return newPlayer;
  }


  /**
   * Destroy a player with optional destroy reason and disconnect it from the voice channel
   * @param guildId 
   * @param destroyReason 
   * @returns 
   * 
   * @example
   * ```ts
   * client.lavalink.destroyPlayer(interaction.guildId, "forcefully destroyed the player");
   * // recommend to do it on the player tho: player.destroy("forcefully destroyed the player");
   * ```
   */
  public destroyPlayer(guildId: string, destroyReason?: string) {
    const oldPlayer = this.getPlayer(guildId);
    if(!oldPlayer) return;
    return oldPlayer.destroy(destroyReason);
  }

  /**
   * Delete's a player from the cache without destroying it on lavalink (only works when it's disconnected)
   * @param guildId 
   * @returns 
   */
  public deletePlayer(guildId: string) {
    const oldPlayer = this.getPlayer(guildId);
    if(!oldPlayer) return;
    // oldPlayer.connected is operational. you could also do oldPlayer.voice?.token 
    if (oldPlayer.voiceChannelId === "string" && oldPlayer.connected && !oldPlayer.get("internal_destroywithoutdisconnect")) {
      if(!this.options?.advancedOptions?.debugOptions?.playerDestroy?.dontThrowError) throw new Error(`Use Player#destroy() not LavalinkManager#deletePlayer() to stop the Player ${JSON.stringify(oldPlayer.toJSON?.())}`)
      else console.error("Use Player#destroy() not LavalinkManager#deletePlayer() to stop the Player", oldPlayer.toJSON?.())
    }
    return this.players.delete(guildId);
  }

  /**
   * Checks wether the the lib is useable based on if any node is connected
   */
  public get useable() {
    return this.nodeManager.nodes.filter(v => v.connected).size > 0;
  }

  /**
   * Initiates the Manager, creates all nodes and connects all of them
   * @param clientData 
   * 
   * @example
   * 
   * ```ts
   * // on the bot ready event
   * client.on("ready", () => {
   *   client.lavalink.init({
   *     id: client.user.id,
   *     username: client.user.username
   *   });
   * });
   * ```
   */
  public async init(clientData: BotClientOptions) {
    if (this.initiated) return this;
    clientData = clientData ?? {} as BotClientOptions;
    this.options.client = { ...(this.options?.client || {}), ...clientData };
    if (!this.options?.client.id) throw new Error('"client.id" is not set. Pass it in Manager#init() or as a option in the constructor.');

    if (typeof this.options?.client.id !== "string") throw new Error('"client.id" set is not type of "string"');

    let success = 0;
    for (const node of [...this.nodeManager.nodes.values()]) {
      try {
        await node.connect();
        success++;
      }
      catch (err) {
        console.error(err);
        this.nodeManager.emit("error", node, err);
      }
    }
    if (success > 0) this.initiated = true;
    else console.error("Could not connect to at least 1 Node");
    return this;
  }

  /**
   * Sends voice data to the Lavalink server.
   * ! Without this the library won't work
   * @param data
   * 
   * @example
   * 
   * ```ts
   * // on the bot "raw" event
   * client.on("raw", (d) => {
   *   // required in order to send audio updates and register channel deletion etc.
   *   client.lavalink.sendRawData(d)
   * })
   * ```
   */
  public async sendRawData(data: VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket): Promise<void> {
    if (!this.initiated) {
      if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, manager is not initated yet");
      return;
    }

    if (!("t" in data)) {
      if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no 't' in payload-data of the raw event:", data);
      return;
    }

    // for channel Delete
    if ("CHANNEL_DELETE" === data.t) {
      const update = "d" in data ? data.d : data;
      if (!update.guild_id) return;
      const player = this.getPlayer(update.guild_id);
      if (player && player.voiceChannelId === update.id) return void player.destroy(DestroyReasons.ChannelDeleted);
    }

    // for voice updates
    if (["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t)) {
      const update = ("d" in data ? data.d : data) as VoiceServer | VoiceState;
      if (!update) {
        if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no update data found in payload:", data);
        return;
      }
      if (!("token" in update) && !("session_id" in update)) {
        if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no 'token' nor 'session_id' found in payload:", data);
        return;
      }

      const player = this.getPlayer(update.guild_id) as Player;
      if (!player) {
        if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, No Lavalink Player found via key: 'guild_id' of update-data:", update);
        return;
      }
      if(player.get("internal_destroystatus") === true) {
        if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Player is in a destroying state. can't signal the voice states")
        return;
      }

      if ("token" in update) {
        player.voice.token = update.token;
        player.voice.endpoint = update.endpoint;
        if (!player.node?.sessionId) throw new Error("Lavalink Node is either not ready or not up to date");
        await player.node.updatePlayer({
          guildId: player.guildId,
          playerOptions: {
            voice: {
              token: update.token,
              endpoint: update.endpoint,
              sessionId: player.voice?.sessionId,
            }
          }
        });
        if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Sent updatePlayer for voice token session", { voice: { token: update.token, endpoint: update.endpoint, sessionId: player.voice?.sessionId, } });
        return
      }

      /* voice state update */
      if (update.user_id !== this.options?.client.id) {
        if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, voice update user is not equal to provided client id of the manageroptions#client#id", "user:", update.user_id, "manager client id:", this.options?.client.id);
        return;
      }

      if (update.channel_id) {
        if (player.voiceChannelId !== update.channel_id) this.emit("playerMove", player, player.voiceChannelId, update.channel_id);
        player.voice.sessionId = update.session_id;
        player.voiceChannelId = update.channel_id;
      } else {
        if (this.options?.playerOptions?.onDisconnect?.destroyPlayer === true) {
          return void await player.destroy(DestroyReasons.Disconnected);
        }

        this.emit("playerDisconnect", player, player.voiceChannelId);

        if (!player.paused) await player.pause();

        if (this.options?.playerOptions?.onDisconnect?.autoReconnect === true) {
          try {
            await player.connect();
          } catch {
            return void await player.destroy(DestroyReasons.PlayerReconnectFail);
          }
          return void player.paused && await player.resume();
        }

        player.voiceChannelId = null;
        player.voice = Object.assign({});
        return
      }
      return
    }
  }
}