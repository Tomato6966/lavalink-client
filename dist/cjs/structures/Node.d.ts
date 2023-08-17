/// <reference types="node" />
import { Dispatcher, Pool } from "undici";
import { NodeManager } from "./NodeManager";
import internal from "stream";
import { InvalidLavalinkRestRequest, LavalinkPlayer, PlayerUpdateInfo, RoutePlanner, Session, Base64 } from "./Utils";
import { DestroyReasonsType } from "./Player";
import { Track } from "./Track";
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
    /** RESUME THE PLAYER? by providing a sessionid on the node-creation */
    sessionId?: string;
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
export interface BaseNodeStats {
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
export interface NodeStats extends BaseNodeStats {
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
    /** The provided Options of the Node */
    options: LavalinkNodeOptions;
    /** The amount of rest calls the node has made. */
    calls: number;
    stats: NodeStats;
    sessionId?: string | null;
    /** Actual Lavalink Information of the Node */
    info: LavalinkInfo | null;
    /** The Node Manager of this Node */
    private NodeManager;
    /** The Reconnection Timeout */
    private reconnectTimeout?;
    /** The Reconnection Attempt counter */
    private reconnectAttempts;
    /** The Socket of the Lavalink */
    private socket;
    /** The Rest Server for this Lavalink */
    private rest;
    /** Version of what the Lavalink Server should be */
    private version;
    /**
     * Create a new Node
     * @param options
     * @param manager
     */
    constructor(options: LavalinkNodeOptions, manager: NodeManager);
    /**
     * Makes an API call to the Node
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     */
    request(endpoint: string, modify?: ModifyRequest, parseAsText?: boolean): Promise<unknown>;
    /**
     * Update the Player State on the Lavalink Server
     * @param data
     * @returns
     */
    updatePlayer(data: PlayerUpdateInfo): Promise<LavalinkPlayer>;
    /**
     * Destroys the Player on the Lavalink Server
     * @param guildId
     * @returns
     */
    destroyPlayer(guildId: any): Promise<unknown>;
    /**
     * Connect to the Lavalink Node
     * @param sessionId Provide the Session Id of the previous connection, to resume the node and it's player(s)
     * @returns
     */
    connect(sessionId?: string): void;
    /** Get the id of the node */
    get id(): string;
    /**
     * Destroys the Node-Connection (Websocket) and all player's of the node
     * @returns
     */
    destroy(destroyReason?: DestroyReasonsType): void;
    /** Returns if connected to the Node. */
    get connected(): boolean;
    /**
     * Gets all Players of a Node
     */
    fetchAllPlayers(): Promise<LavalinkPlayer[]>;
    /**
     * Gets specific Player Information
     */
    fetchPlayer(guildId: string): Promise<LavalinkPlayer | InvalidLavalinkRestRequest>;
    /**
     * Updates the session with and enables/disables resuming and timeout
     * @param resuming Whether resuming is enabled for this session or not
     * @param timeout The timeout in seconds (default is 60s)
     */
    updateSession(resuming?: boolean, timeout?: number): Promise<Session>;
    /**
     * Decode Track or Tracks
     */
    decode: {
        /**
         * Decode a single track into its info, where BASE64 is the encoded base64 data.
         * @param encoded
         * @returns
         */
        singleTrack: (encoded: Base64, requester: unknown) => Promise<Track>;
        /**
         *
         * @param encodeds Decodes multiple tracks into their info
         * @returns
         */
        multipleTracks: (encodeds: Base64[], requester: unknown) => Promise<Track[]>;
    };
    /**
     * Request Lavalink statistics.
     * @returns
     */
    fetchStats(): Promise<BaseNodeStats>;
    /**
     * Request Lavalink version.
     * @returns
     */
    fetchVersion(): Promise<string>;
    /**
     * Request Lavalink information.
     * @returns
     */
    fetchInfo(): Promise<LavalinkInfo>;
    /**
     * Lavalink's Route Planner Api
     */
    routePlannerApi: {
        /**
         * Get routplanner Info from Lavalink
         */
        getStatus: () => Promise<RoutePlanner>;
        /**
         * Release blacklisted IP address into pool of IPs
         * @param address IP address
         */
        unmarkFailedAddress: (address: string) => Promise<void>;
        /**
         * Release all blacklisted IP addresses into pool of IPs
         */
        unmarkAllFailedAddresses: () => Promise<unknown>;
    };
    /** Private Utils */
    private validate;
    private syncPlayerData;
    private get poolAddress();
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
