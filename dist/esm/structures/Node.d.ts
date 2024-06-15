/// <reference types="node" />
import internal from "stream";
import { NodeManager } from "./NodeManager";
import { DestroyReasonsType, Player } from "./Player";
import { Track } from "./Track";
import { Base64, InvalidLavalinkRestRequest, LavalinkPlayer, LavaSearchQuery, LavaSearchResponse, PlayerUpdateInfo, RoutePlanner, SearchQuery, SearchResult, Session } from "./Utils";
/** Ability to manipulate fetch requests */
export type ModifyRequest = (options: RequestInit & {
    path: string;
}) => void;
export declare const validSponsorBlocks: string[];
export type SponsorBlockSegment = "sponsor" | "selfpromo" | "interaction" | "intro" | "outro" | "preview" | "music_offtopic" | "filler";
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
    /** The retryAmount for the node. */
    retryAmount?: number;
    /** The retryDelay for the node. */
    retryDelay?: number;
    /** signal for cancelling requests - default: AbortSignal.timeout(options.requestSignalTimeoutMS || 10000) - put <= 0 to disable */
    requestSignalTimeoutMS?: number;
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
    /** The version of this Lavalink server */
    version: VersionObject;
    /** The millisecond unix timestamp when this Lavalink jar was built */
    buildTime: number;
    /** The git information of this Lavalink server */
    git: GitObject;
    /** The JVM version this Lavalink server runs on */
    jvm: string;
    /** The Lavaplayer version being used by this server */
    lavaplayer: string;
    /** The enabled source managers for this server */
    sourceManagers: string[];
    /** The enabled filters for this server */
    filters: string[];
    /** The enabled plugins for this server */
    plugins: PluginObject[];
}
export interface VersionObject {
    /** The full version string of this Lavalink server */
    semver: string;
    /** The major version of this Lavalink server */
    major: number;
    /** The minor version of this Lavalink server */
    minor: number;
    /** The patch version of this Lavalink server */
    patch: internal;
    /** The pre-release version according to semver as a . separated list of identifiers */
    preRelease?: string;
    /** The build metadata according to semver as a . separated list of identifiers */
    build?: string;
}
export interface GitObject {
    /** The branch this Lavalink server was built on */
    branch: string;
    /** The commit this Lavalink server was built on */
    commit: string;
    /** The millisecond unix timestamp for when the commit was created */
    commitTime: string;
}
export interface PluginObject {
    /** The name of the plugin */
    name: string;
    /** The version of the plugin */
    version: string;
}
export declare class LavalinkNode {
    /** The provided Options of the Node */
    options: LavalinkNodeOptions;
    /** The amount of rest calls the node has made. */
    calls: number;
    stats: NodeStats;
    sessionId?: string | null;
    /** Wether the node resuming is enabled or not */
    resuming: {
        enabled: boolean;
        timeout: number | null;
    };
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
    /** Version of what the Lavalink Server should be */
    private version;
    /**
     * Create a new Node
     * @param options Lavalink Node Options
     * @param manager Node Manager
     */
    constructor(options: LavalinkNodeOptions, manager: NodeManager);
    /**
     * Raw Request util function
     * @param endpoint endpoint string
     * @param modify modify the request
     * @returns
     */
    private rawRequest;
    /**
     * Makes an API call to the Node
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     */
    request(endpoint: string, modify?: ModifyRequest, parseAsText?: boolean): Promise<any>;
    /**
     * Search something raw on the node, please note only add tracks to players of that node
     * @param query SearchQuery Object
     * @param requestUser Request User for creating the player(s)
     * @returns Searchresult
     */
    search(query: SearchQuery, requestUser: unknown): Promise<SearchResult>;
    lavaSearch(query: LavaSearchQuery, requestUser: unknown, throwOnEmpty?: boolean): Promise<SearchResult | LavaSearchResponse>;
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
    destroyPlayer(guildId: any): Promise<any>;
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
    destroy(destroyReason?: DestroyReasonsType, deleteNode?: boolean): void;
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
    updateSession(resuming?: boolean, timeout?: number): Promise<InvalidLavalinkRestRequest | Session>;
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
        unmarkAllFailedAddresses: () => Promise<any>;
    };
    /** Private Utils */
    private validate;
    private syncPlayerData;
    private get restAddress();
    private reconnect;
    private open;
    private close;
    private error;
    private message;
    private handleEvent;
    private trackStart;
    private trackEnd;
    private trackStuck;
    private trackError;
    private socketClosed;
    private SponsorBlockSegmentLoaded;
    private SponsorBlockSegmentkipped;
    private SponsorBlockChaptersLoaded;
    private SponsorBlockChapterStarted;
    getSponsorBlock(player: Player): Promise<SponsorBlockSegment[]>;
    setSponsorBlock(player: Player, segments?: SponsorBlockSegment[]): Promise<void>;
    deleteSponsorBlock(player: Player): Promise<void>;
    private queueEnd;
}
