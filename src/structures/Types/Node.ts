import type internal from "stream";
import type { LavalinkNode } from "../Node";
import type { DestroyReasonsType } from "./Player";
import type { InvalidLavalinkRestRequest, LavalinkPlayer } from "./Utils";
import type { PluginInfo } from "./Track";

/** Ability to manipulate fetch requests */
export type ModifyRequest = (options: RequestInit & { path: string, extraQueryUrlParams?: URLSearchParams }) => void;

export type SponsorBlockSegment = "sponsor" | "selfpromo" | "interaction" | "intro" | "outro" | "preview" | "music_offtopic" | "filler";

/**
 * Node Options for creating a lavalink node
 */
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
    /** Close on error */
    closeOnError?: boolean;
    /** Heartbeat interval , set to <= 0 to disable heartbeat system */
    heartBeatInterval?: 30000;
    /** Recommended, to check wether the client is still connected or not on the stats endpoint */
    enablePingOnStatsCheck?: boolean;
}

/**
 * Memory Stats object from lavalink
 */
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

/**
 * CPU Stats object from lavalink
 */
export interface CPUStats {
    /** The core amount the host machine has. */
    cores: number;
    /** The system load. */
    systemLoad: number;
    /** The lavalink load. */
    lavalinkLoad: number;
}

/**
 * FrameStats Object from lavalink
 */
export interface FrameStats {
    /** The amount of sent frames. */
    sent?: number;
    /** The amount of nulled frames. */
    nulled?: number;
    /** The amount of deficit frames. */
    deficit?: number;
}

/**
 * BaseNodeStats object from Lavalink
 */
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

/**
 * Interface for nodeStats from lavalink
 */
export interface NodeStats extends BaseNodeStats {
    /** The frame stats for the node. */
    frameStats: FrameStats;
}

/**
 * Entire lavalink information object from lavalink
 */
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

/**
 * Lavalink's version object from lavalink
 */
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

/**
 * Git information object from lavalink
 */
export interface GitObject {
    /** The branch this Lavalink server was built on */
    branch: string;
    /** The commit this Lavalink server was built on */
    commit: string;
    /** The millisecond unix timestamp for when the commit was created */
    commitTime: string;
}

/**
 * Lavalink's plugins object from lavalink's plugin
 */
export interface PluginObject {
    /** The name of the plugin */
    name: string;
    /** The version of the plugin */
    version: string;
}

export interface LyricsResult {
    /**The name of the source */
    sourceName: string;
    /**The name of the provider */
    provider: string;
    /**The result text */
    text: string | null;
    /**The lyrics lines */
    lines: LyricsLine[];
    /**Information about the plugin */
    plugin: PluginInfo;
}

export interface LyricsLine {
    /**The millisecond timestamp */
    timestamp: number;
    /**The line duration in milliseconds */
    duration: number | null;
    /**The line text */
    line: string;
    /**Information about the plugin */
    plugin: PluginInfo;
}
export type LavalinkNodeIdentifier = string;

export interface NodeManagerEvents {
    /**
     * Emitted when a Node is created.
     * @event Manager.nodeManager#create
     */
    "create": (node: LavalinkNode) => void;

    /**
     * Emitted when a Node is destroyed.
     * @event Manager.nodeManager#destroy
     */
    "destroy": (node: LavalinkNode, destroyReason?: DestroyReasonsType) => void;

    /**
     * Emitted when a Node is connected.
     * @event Manager.nodeManager#connect
     */
    "connect": (node: LavalinkNode) => void;

    /**
     * Emitted when a Node is reconnecting.
     * @event Manager.nodeManager#reconnecting
    */
    "reconnecting": (node: LavalinkNode) => void;

    /**
     * Emitted When a node starts to reconnect (if you have a reconnection delay, the reconnecting event will be emitted after the retryDelay.)
     * Useful to check wether the internal node reconnect system works or not
     * @event Manager.nodeManager#reconnectinprogress
     */
    "reconnectinprogress": (node: LavalinkNode) => void;

    /**
     * Emitted when a Node is disconnects.
     * @event Manager.nodeManager#disconnect
    */
    "disconnect": (node: LavalinkNode, reason: { code?: number, reason?: string }) => void;

    /**
     * Emitted when a Node is error.
     * @event Manager.nodeManager#error
    */
    "error": (node: LavalinkNode, error: Error, payload?: unknown) => void;

    /**
     * Emits every single Node event.
     * @event Manager.nodeManager#raw
    */
    "raw": (node: LavalinkNode, payload: unknown) => void;

    /**
     * Emits when the node connects resumed. You then need to create all players within this event for your usecase.
     * Aka for that you need to be able to save player data like vc channel + text channel in a db and then sync it again
     * @event Manager.nodeManager#nodeResumed
     */
    "resumed": (node: LavalinkNode, payload: { resumed: true, sessionId: string, op: "ready" }, players: LavalinkPlayer[] | InvalidLavalinkRestRequest) => void;
}
