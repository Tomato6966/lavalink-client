/// <reference types="node" />
import { EventEmitter } from "node:events";
import { NodeManager } from "./NodeManager";
import { ManagerQueueOptions, QueueStoreManager } from "./Queue";
import { PlayerManager } from "./PlayerManager";
import { GuildShardPayload, ManagerUtils, SearchPlatform } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
export interface LavalinkManager {
    playerManager: PlayerManager;
    nodeManager: NodeManager;
    utilManager: ManagerUtils;
}
export interface BotClientOptions {
    shards?: number | "auto";
    id: string;
    username: string;
}
export interface ManagerPlayerOptions {
    volumeDecrementer?: number;
    clientBasedPositionUpdateInterval?: number;
    defaultSearchPlatform?: SearchPlatform;
    applyVolumeAsFilter?: boolean;
}
export interface ManagerOptions {
    nodes: LavalinkNodeOptions[];
    queueStore?: QueueStoreManager;
    queueOptions?: ManagerQueueOptions;
    client?: BotClientOptions;
    playerOptions?: ManagerPlayerOptions;
    autoSkip?: boolean;
    /** @async */
    sendToShard: (guildId: string, payload: GuildShardPayload) => void;
}
interface LavalinkManagerEvents {
    "create": (manager: LavalinkManager) => void;
}
export interface LavalinkManager {
    options: ManagerOptions;
    on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;
    emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
}
export declare class LavalinkManager extends EventEmitter {
    static DEFAULT_SOURCES: Record<SearchPlatform, import("./Utils").LavalinkSearchPlatform>;
    static REGEXES: Record<import("./Utils").SourcesRegex, RegExp>;
    constructor(options: ManagerOptions);
}
export {};
