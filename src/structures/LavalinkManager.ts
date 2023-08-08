import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { DefaultQueueStore, QueueSaverOptions, StoreManager } from "./Queue";
import { PlayerManager } from "./PlayerManager";
import { GuildShardPayload, ManagerUitls, SearchPlatform, VoicePacket, VoiceServer, VoiceState } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
import { DEFAULT_SOURCES, REGEXES } from "./LavalinkManagerStatics";
import { Player } from "./Player";

export interface LavalinkManager {
  playerManager: PlayerManager;
  nodeManager: NodeManager;
  utilManager: ManagerUitls;
}

export interface BotClientOptions {
  shards?: number | "auto";
  id: string;
  username?: string;
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
  "create": (manager:LavalinkManager) => void; 
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
  constructor(options: ManagerOptions) {
    super();
    this.options = {
      autoSkip: true,
      ...options
    };
    if(!this.options.playerOptions.defaultSearchPlatform) this.options.playerOptions.defaultSearchPlatform = "ytsearch";
    if(!this.options.queueOptions.maxPreviousTracks || this.options.queueOptions.maxPreviousTracks <= 0) this.options.queueOptions.maxPreviousTracks = 25;

    if(options.queueStore) {
      const keys = Object.keys(options.queueStore);
      const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
      if(!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options.queueStore[v] === "function")) throw new SyntaxError(`The provided QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
    } else this.options.queueStore = new DefaultQueueStore();

    this.playerManager = new PlayerManager(this);
    this.nodeManager = new NodeManager(this);
    this.utilManager = new ManagerUitls(this);
  }
  /**
   * Initiates the Manager.
   * @param clientData 
   */
  public init(clientData: { id?: string, username?: string, shards?: "auto" | number } = {}): this {
    const { id, username, shards } = clientData;
    if (this.initiated) return this;
    if(!this.options.client) this.options.client = { id, username, shards };
    
    if (!this.options.client.id) throw new Error('"client.id" is not set. Pass it in Manager#init() or as a option in the constructor.');
    
    if (typeof this.options.client.id !== "string") throw new Error('"client.id" set is not type of "string"');

    let success = 0;
    for (const node of [...this.nodeManager.nodes.values()]) {
        try {
            node.connect();
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
    if ("t" in data && !["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t)) return;

    const update: VoiceServer | VoiceState = "d" in data ? data.d : data;
    if (!update || !("token" in update) && !("session_id" in update)) return;

    const player = this.playerManager.getPlayer(update.guild_id) as Player;
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
      if (player.voiceChannelId !== update.channel_id) this.playerManager.emit("move", player, player.voiceChannelId, update.channel_id);
      player.voice.sessionId = update.session_id;
      player.voiceChannelId = update.channel_id;
    } else {
      this.playerManager.emit("disconnect", player, player.voiceChannelId);
      player.voiceChannelId = null;
      player.voice = Object.assign({});
      await player.pause();
    }
    return 
  }
}
