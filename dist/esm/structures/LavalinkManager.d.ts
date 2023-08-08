/// <reference types="node" />
import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { QueueSaverOptions, StoreManager } from "./Queue";
import { PlayerManager } from "./PlayerManager";
import { GuildShardPayload, ManagerUitls, SearchPlatform, VoicePacket, VoiceServer, VoiceState } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
export interface LavalinkManager {
    playerManager: PlayerManager;
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
    applyVolumeAsFilter?: boolean;
}
export interface ManagerOptions {
    nodes: LavalinkNodeOptions[];
    queueStore?: StoreManager;
    queueOptions?: QueueSaverOptions;
    client?: BotClientOptions;
    playerOptions?: LavalinkPlayerOptions;
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
    initiated: boolean;
    constructor(options: ManagerOptions);
    get useable(): boolean;
    /**
     * Initiates the Manager.
     * @param clientData
     */
    init(clientData: BotClientOptions): Promise<this>;
    /**
     * Sends voice data to the Lavalink server.
     * @param data
     */
    updateVoiceState(data: VoicePacket | VoiceServer | VoiceState): Promise<void>;
}
export {};
