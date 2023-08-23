import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { DefaultQueueStore, ManagerQueueOptions } from "./Queue";
import { GuildShardPayload, ManagerUtils, MiniMap, SearchPlatform, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
import { DefaultSources, SourceLinksRegexes } from "./LavalinkManagerStatics";
import { DestroyReasons, DestroyReasonsType, Player, PlayerJson, PlayerOptions } from "./Player";
import { Track, UnresolvedTrack } from "./Track";

export interface LavalinkManager {
  nodeManager: NodeManager;
  utils: ManagerUtils;
}

export interface BotClientOptions {
  /** Bot Client Id */
  id: string;
  /** Bot Client Username */
  username?: string;
  /** So users can pass entire objects / classes */
  [x: string | number | symbol | undefined]: unknown;
}

export interface ManagerPlayerOptions {
  /** If the Lavalink Volume should be decremented by x number */
  volumeDecrementer?: number;
  /** How often it should update the the player Position */
  clientBasedPositionUpdateInterval?: number;
  /** What should be used as a searchPlatform, if no source was provided during the query */
  defaultSearchPlatform?: SearchPlatform;
  /** Applies the volume via a filter, not via the lavalink volume transformer */
  applyVolumeAsFilter?:boolean;
  /** Transforms the saved data of a requested user */
  requesterTransformer?: (requester:unknown) => unknown;
  /** What lavalink-client should do when the player reconnects */
  onDisconnect?: {
    /** Try to reconnect? -> If fails -> Destroy */
    autoReconnect?: boolean;
    /** Instantly destroy player (overrides autoReconnect) */
    destroyPlayer?: boolean;
  };
  /* What the Player should do, when the queue gets empty */
  onEmptyQueue?: {
    /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
    autoPlayFunction?: (player:Player, lastPlayedTrack:Track) => Promise<void>;
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
  sendToShard: (guildId:string, payload:GuildShardPayload) => void;
  /** The Bot Client's Data for Authorization */
  client?: BotClientOptions;
  /** QueueOptions for all Queues */
  queueOptions?: ManagerQueueOptions;
  /** PlayerOptions for all Players */
  playerOptions?: ManagerPlayerOptions;
  /** If it should skip to the next Track on TrackEnd / TrackError etc. events */
  autoSkip?: boolean;
  /** optional */
  debugOptions?: {
    /** logs for debugging the "no-Audio" playing error */
    noAudio: boolean;
  }
}

interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager#trackStart
     */
    "trackStart": (player:Player, track: Track, payload:TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager#trackEnd
     */
    "trackEnd": (player:Player, track: Track, payload:TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager#trackStuck
     */
    "trackStuck": (player:Player, track: Track, payload:TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager#trackError
     */
    "trackError": (player:Player, track: Track | UnresolvedTrack, payload:TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager#queueEnd
     */
    "queueEnd": (player:Player, track: Track, payload:TrackEndEvent|TrackStuckEvent|TrackExceptionEvent) => void;
    /**
     * Emitted when a Player is created.
     * @event Manager#playerCreate
     */
    "playerCreate": (player:Player) => void;
    /**
     * Emitted when a Player is moved within the channel.
     * @event Manager.playerManager#move
     */
    "playerMove": (player:Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
    /**
     * Emitted when a Player is disconnected from a channel.
     * @event Manager#playerDisconnect
     */
    "playerDisconnect": (player:Player, voiceChannelId: string) => void;
    /**
     * Emitted when a Node-Socket got closed for a specific Player.
     * @event Manager#playerSocketClosed
     */
    "playerSocketClosed": (player:Player, payload: WebSocketClosedEvent) => void;
    /**
     * Emitted when a Player get's destroyed
     * @event Manager#playerDestroy
     */
    "playerDestroy": (player:Player, destroyReason?:DestroyReasonsType) => void;

    /**
     * Always emits when the player (on lavalink side) got updated
     * @event Manager#playerUpdate
     */
    "playerUpdate": (oldPlayerJson: PlayerJson, newPlayer:Player) => void;
}

export interface LavalinkManager {
  options: ManagerOptions;

  on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;

  emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
  
}

export class LavalinkManager extends EventEmitter {
  public static DefaultSources = DefaultSources;
  public static SourceLinksRegexes = SourceLinksRegexes;

  public initiated:boolean = false;
  
  public readonly players: MiniMap<string, Player> = new MiniMap();
    
  private applyOptions(options:ManagerOptions) {
    this.options = {
      client: {
        ...(options?.client||{}),
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
      autoSkip: options?.autoSkip ?? true,
      queueOptions: {
        maxPreviousTracks: options?.queueOptions?.maxPreviousTracks ?? 25,
        queueChangesWatcher: options?.queueOptions?.queueChangesWatcher ?? null,
        queueStore: options?.queueOptions?.queueStore ?? new DefaultQueueStore(),
      },
      debugOptions: {
        noAudio: options?.debugOptions?.noAudio ?? false
      }
    }
    return;
  }
  private validateOptions(options: ManagerOptions) {
    if(typeof options?.sendToShard !== "function") throw new SyntaxError("ManagerOption.sendToShard was not provided, which is required!");
    // only check in .init()
    // if(typeof options?.client !== "object" || typeof options?.client.id !== "string") throw new SyntaxError("ManagerOption.client = { id: string, username?:string } was not provided, which is required");

    if(options?.autoSkip && typeof options?.autoSkip !== "boolean") throw new SyntaxError("ManagerOption.autoSkip must be either false | true aka boolean");

    if(!options?.nodes || !Array.isArray(options?.nodes) || !options?.nodes.every(node => this.utils.isNodeOptions(node))) throw new SyntaxError("ManagerOption.nodes must be an Array of NodeOptions and is required of at least 1 Node");
    
    /* QUEUE STORE */
    if(options?.queueOptions?.queueStore) {
      const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(options?.queueOptions?.queueStore));
      const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
      if(!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options?.queueOptions?.queueStore[v] === "function")) throw new SyntaxError(`The provided ManagerOption.QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
    } 

    /* QUEUE WATCHER */
    if(options?.queueOptions?.queueChangesWatcher) {
      const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(options?.queueOptions?.queueChangesWatcher));
      const requiredKeys = ["tracksAdd", "tracksRemoved", "shuffled"];
      if(!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options?.queueOptions?.queueChangesWatcher[v] === "function")) throw new SyntaxError(`The provided ManagerOption.DefaultQueueChangesWatcher, does not have all required functions: ${requiredKeys.join(", ")}`);
    }
    
    if(typeof options?.queueOptions?.maxPreviousTracks !== "number" || options?.queueOptions?.maxPreviousTracks < 0) options.queueOptions.maxPreviousTracks = 25;
  

  }

  constructor(options: ManagerOptions) {
    super();
    
    if(!options) throw new SyntaxError("No Manager Options Provided")
    this.utils = new ManagerUtils(this);
    
    // use the validators
    this.applyOptions(options);
    this.validateOptions(options);

    // create classes
    this.nodeManager = new NodeManager(this);

  }
  
  public createPlayer(options: PlayerOptions) {
    if(this.players.has(options?.guildId)) return this.players.get(options?.guildId)!;
    const newPlayer = new Player(options, this);
    this.players.set(newPlayer.guildId, newPlayer);
    return newPlayer;
  }

  public getPlayer(guildId:string) {
      return this.players.get(guildId);
  }

  public deletePlayer(guildId:string) {
      if(typeof this.players.get(guildId)?.voiceChannelId === "string") throw new Error("Use Player#destroy(true) not PlayerManager#deletePlayer() to stop the Player")
      return this.players.delete(guildId);
  }

  public get useable() {
    return this.nodeManager.nodes.filter(v => v.connected).size > 0;
  }
  /**
   * Initiates the Manager.
   * @param clientData 
   */
  public async init(clientData: BotClientOptions) {
    if (this.initiated) return this; 
    clientData = clientData ?? {} as BotClientOptions;
    this.options.client = { ...(this.options?.client||{}), ...clientData };
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
    if(success > 0) this.initiated = true;
    else console.error("Could not connect to at least 1 Node");
    return this;
  }

  /**
   * Sends voice data to the Lavalink server.
   * @param data
   */
  public async sendRawData(data: VoicePacket | VoiceServer | VoiceState | any): Promise<void> {
    if(!this.initiated) {
      if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, manager is not initated yet");
      return;
    }

    if(!("t" in data)) {
      if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no 't' in payload-data of the raw event:", data);
      return;
    }
    
    // for channel Delete
    if("CHANNEL_DELETE" === data.t) {
      const update = "d" in data ? data.d : data;
      if(!update.guild_id) return;
      const player = this.getPlayer(update.guild_id);
      if(player && player.voiceChannelId === update.id) return player.destroy(DestroyReasons.ChannelDeleted);
    }

    // for voice updates
    if (["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t)) {
      const update: VoiceServer | VoiceState = "d" in data ? data.d : data;
      if (!update) {
        if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no update data found in payload:", data);
        return;
      }
      if(!("token" in update) && !("session_id" in update)) {
        if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no 'token' nor 'session_id' found in payload:", data);
        return;
      }

      const player = this.getPlayer(update.guild_id) as Player;
      if (!player) {
        if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, No Lavalink Player found via key: 'guild_id' of update-data:", update);
        return;
      }
      
      if ("token" in update) {
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
        if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Sent updatePlayer for voice token session", { voice: { token: update.token, endpoint: update.endpoint, sessionId: player.voice?.sessionId, } });
        return 
      }

      /* voice state update */
      if (update.user_id !== this.options?.client.id) {
        if(this.options?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, voice update user is not equal to provided client id of the manageroptions#client#id", "user:", update.user_id, "manager client id:", this.options?.client.id);
        return;
      }  
      
      if (update.channel_id) {
        if (player.voiceChannelId !== update.channel_id) this.emit("playerMove", player, player.voiceChannelId, update.channel_id);
        player.voice.sessionId = update.session_id;
        player.voiceChannelId = update.channel_id;
      } else {
        if(this.options?.playerOptions?.onDisconnect?.destroyPlayer === true) {
          return await player.destroy(DestroyReasons.Disconnected);
        }
        this.emit("playerDisconnect", player, player.voiceChannelId);

        await player.pause();

        if(this.options?.playerOptions?.onDisconnect?.autoReconnect === true) {
          try {
            await player.connect();
          } catch {
            return await player.destroy(DestroyReasons.PlayerReconnectFail);
          }
          return await player.resume();
        }

        player.voiceChannelId = null;
        player.voice = Object.assign({});
        return 
      }
      return 
    }
  }
}