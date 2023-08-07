import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { DefaultQueueStore, QueueSaverOptions, StoreManager } from "./Queue";
import { PlayerManager } from "./PlayerManager";
import { GuildShardPayload, ManagerUitls, SearchPlatform } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
import { DEFAULT_SOURCES, REGEXES } from "./LavalinkManagerStatics";

export interface LavalinkManager {
  playerManager: PlayerManager;
  nodeManager: NodeManager;
  utilManager: ManagerUitls;
}

export interface BotClientOptions {
  shards?: number | "auto";
  id: string;
  username: string;
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
}
