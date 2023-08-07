/// <reference types="node" />
/// <reference types="node" />
import WebSocket from "ws";
import { Dispatcher, Pool } from "undici";
import { NodeManager } from "./NodeManager";
import internal from "node:stream";
import { InvalidLavalinkRestRequest, LavalinkPlayer, PlayerUpdateInfo, RoutePlanner } from "./Utils";
import { Session } from "node:inspector";
/** Modifies any outgoing REST requests. */
export type ModifyRequest = (options: Dispatcher.RequestOptions) => void;
export interface LavalinkNodeOptions {
    /** The Lavalink Server-Ip / Domain-URL */
    host: string;
    /** The Lavalink Connection Port */
    port: number;
    /** The Lavalink Password / Authorization-Key */
    authorization: string;
    /** Does the Server use ssl (https) */
    secure?: boolean;
    /** Add a Custom ID to the node, for later use */
    id?: string;
    /** Voice Regions of this Node */
    regions?: string[];
    /** Options for the undici http pool used for http requests */
    poolOptions?: Pool.Options;
    /** The retryAmount for the node. */
    retryAmount?: number;
    /** The retryDelay for the node. */
    retryDelay?: number;
    /** Pool Undici Options - requestTimeout */
    requestTimeout?: number;
}
export interface MemoryStats {
    /** The free memory of the allocated amount. */
    free: number;
    /** The used memory of the allocated amount. */
    used: number;
    /** The total allocated memory. */
    allocated: number;
    /** The reservable memory. */
    reservable: number;
}
export interface CPUStats {
    /** The core amount the host machine has. */
    cores: number;
    /** The system load. */
    systemLoad: number;
    /** The lavalink load. */
    lavalinkLoad: number;
}
export interface FrameStats {
    /** The amount of sent frames. */
    sent?: number;
    /** The amount of nulled frames. */
    nulled?: number;
    /** The amount of deficit frames. */
    deficit?: number;
}
export interface NodeStats {
    /** The amount of players on the node. */
    players: number;
    /** The amount of playing players on the node. */
    playingPlayers: number;
    /** The uptime for the node. */
    uptime: number;
    /** The memory stats for the node. */
    memory: MemoryStats;
    /** The cpu stats for the node. */
    cpu: CPUStats;
    /** The frame stats for the node. */
    frameStats: FrameStats;
}
export interface LavalinkInfo {
    version: VersionObject;
    buildTime: number;
    git: GitObject;
    jvm: string;
    lavaplayer: string;
    sourceManagers: string[];
    filters: string[];
    plugins: PluginObject[];
}
export interface VersionObject {
    semver: string;
    major: number;
    minor: number;
    patch: internal;
    preRelease?: string;
}
export interface GitObject {
    branch: string;
    commit: string;
    commitTime: string;
}
export interface PluginObject {
    name: string;
    version: string;
}
export declare class LavalinkNode {
    socket: WebSocket | null;
    rest: Pool;
    options: LavalinkNodeOptions;
    /** The amount of rest calls the node has made. */
    calls: number;
    stats: NodeStats;
    private NodeManager;
    private reconnectTimeout?;
    private reconnectAttempts;
    sessionId?: string | null;
    info: LavalinkInfo | null;
    version: "v4";
    constructor(options: LavalinkNodeOptions, manager: NodeManager);
    /**
     * Makes an API call to the Node
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     */
    makeRequest(endpoint: string, modify?: ModifyRequest, parseAsText?: boolean): Promise<unknown>;
    updatePlayer(data: PlayerUpdateInfo): Promise<LavalinkPlayer>;
    private syncPlayerData;
    destroyPlayer(guildId: any): Promise<unknown>;
    connect(): void;
    get id(): string;
    destroy(): void;
    /** Returns if connected to the Node. */
    get connected(): boolean;
    get poolAddress(): string;
    private fetchInfo;
    private fetchVersion;
    /**
     * Gets all Players of a Node
     */
    getPlayers(): Promise<LavalinkPlayer[]>;
    /**
     * Gets specific Player Information
     */
    getPlayer(guildId: string): Promise<LavalinkPlayer | InvalidLavalinkRestRequest>;
    /**
     * Updates the session with a resuming key and timeout
     * @param resumingKey
     * @param timeout
     */
    updateSession(resumingKey?: string, timeout?: number): Promise<Session | Record<string, string>>;
    /**
     * Get routplanner Info from Lavalink
     */
    getRoutePlannerStatus(): Promise<RoutePlanner>;
    /**
     * Release blacklisted IP address into pool of IPs
     * @param address IP address
     */
    unmarkFailedAddress(address: string): Promise<void>;
    /**
     * Release blacklisted IP address into pool of IPs
     * @param address IP address
     */
    unmarkAllFailedAddresses(): Promise<void>;
    private reconnect;
    private open;
    private close;
    private error;
    private message;
    private handleEvent;
    private trackStart;
    private trackEnd;
    private queueEnd;
    private trackStuck;
    private trackError;
    private socketClosed;
}
