import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { DefaultQueueStore, QueueSaverOptions, StoreManager } from "./Queue";
import { GuildShardPayload, LavalinkSearchPlatform, ManagerUitls, MiniMap, SearchPlatform, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
import { DEFAULT_SOURCES, REGEXES } from "./LavalinkManagerStatics";
import { Player, PlayerOptions } from "./Player";
import { Track } from "./Track";

export interface LavalinkManager {
  nodeManager: NodeManager;
  utilManager: ManagerUitls;
}

export interface BotClientOptions {
  shards?: number | number[] | "auto";
  id: string;
  username?: string;
  /** So users can pass entire objects / classes */
  [x: string | number | symbol | undefined]: any;
}

export interface LavalinkPlayerOptions {
  volumeDecrementer?: number;
  clientBasedUpdateInterval?: number;
  defaultSearchPlatform?: SearchPlatform;
  applyVolumeAsFilter?:boolean;
}

export interface ManagerOptions {
  nodes: LavalinkNodeOptions[];
  queueStore?: StoreManager;
  queueOptions?: QueueSaverOptions;
  client?: BotClientOptions;
  playerOptions?: LavalinkPlayerOptions;
  autoSkip?: boolean;
  /** @async */
  sendToShard: (guildId:string, payload:GuildShardPayload) => void;
}

interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager.playerManager#trackStart
     */
    "trackStart": (player:Player, track: Track, payload:TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager.playerManager#trackEnd
     */
    "trackEnd": (player:Player, track: Track, payload:TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager.playerManager#trackStuck
     */
    "trackStuck": (player:Player, track: Track, payload:TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager.playerManager#trackError
     */
    "trackError": (player:Player, track: Track, payload:TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager.playerManager#queueEnd
     */
    "queueEnd": (player:Player, track: Track, payload:TrackEndEvent|TrackStuckEvent) => void;
    /**
     * Emitted when a Player is created.
     * @event Manager.playerManager#create
     */
    "playerCreate": (player:Player) => void;
    /**
     * Emitted when a Player is moved within the channel.
     * @event Manager.playerManager#move
     */
    "playerMove": (player:Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
    /**
     * Emitted when a Player is disconnected from a channel.
     * @event Manager.playerManager#disconnect
     */
    "playerDisconnect": (player:Player, voiceChannelId: string) => void;
    /**
     * Emitted when a Node-Socket got closed for a specific Player.
     * @event Manager.playerManager#socketClosed
     */
    "playerSocketClosed": (player:Player, payload: WebSocketClosedEvent) => void;
    /**
     * Emitted when a Player get's destroyed
     * @event Manager.playerManager#destroy
     */
    "playerDestroy": (player:Player) => void;
}

export interface LavalinkManager {
  options: ManagerOptions;

  on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;

  emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
  
}

export class LavalinkManager extends EventEmitter {
  public static DEFAULT_SOURCES = DEFAULT_SOURCES;
  public static REGEXES = REGEXES;

  public initiated:boolean = false;
  
  public players: MiniMap<string, Player> = new MiniMap();
    
  constructor(options: ManagerOptions) {
    super();
    this.options = {
      autoSkip: true,
      ...options
    };
    this.initiated = false;
    if(!this.options.playerOptions.defaultSearchPlatform) this.options.playerOptions.defaultSearchPlatform = "ytsearch";
    if(!this.options.queueOptions.maxPreviousTracks || this.options.queueOptions.maxPreviousTracks <= 0) this.options.queueOptions.maxPreviousTracks = 25;

    if(options.queueStore) {
      const keys = Object.keys(options.queueStore);
      const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
      if(!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options.queueStore[v] === "function")) throw new SyntaxError(`The provided QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
    } else this.options.queueStore = new DefaultQueueStore();

    this.nodeManager = new NodeManager(this);
    this.utilManager = new ManagerUitls(this);
  }
  
  public createPlayer(options: PlayerOptions) {
    if(this.players.has(options.guildId)) return this.players.get(options.guildId)!;
    const newPlayer = new Player(options, this);
    this.players.set(newPlayer.guildId, newPlayer);
    return newPlayer;
  }
  public getPlayer(guildId:string) {
      return this.players.get(guildId);
  }
  public deletePlayer(guildId:string) {
      if(this.players.get(guildId).connected) throw new Error("Use Player#destroy() not PlayerManager#deletePlayer() to stop the Player")
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
    this.options.client = { ...(this.options.client||{}), ...clientData };
    if (!this.options.client.id) throw new Error('"client.id" is not set. Pass it in Manager#init() or as a option in the constructor.');
    
    if (typeof this.options.client.id !== "string") throw new Error('"client.id" set is not type of "string"');

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
  public async updateVoiceState(data: VoicePacket | VoiceServer | VoiceState): Promise<void> {
    if(!this.initiated) return; 
    if ("t" in data && !["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t)) return;

    const update: VoiceServer | VoiceState = "d" in data ? data.d : data;
    if (!update || !("token" in update) && !("session_id" in update)) return;

    const player = this.getPlayer(update.guild_id) as Player;
    if (!player) return;
    
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
      return 
    }

    /* voice state update */
    if (update.user_id !== this.options.client.id) return;      
    
    if (update.channel_id) {
      if (player.voiceChannelId !== update.channel_id) this.emit("playerMove", player, player.voiceChannelId, update.channel_id);
      player.voice.sessionId = update.session_id;
      player.voiceChannelId = update.channel_id;
    } else {
      this.emit("playerDisconnect", player, player.voiceChannelId);
      player.voiceChannelId = null;
      player.voice = Object.assign({});
      await player.pause();
    }
    return 
  }
}
