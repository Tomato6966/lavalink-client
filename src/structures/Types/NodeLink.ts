import { LavalinkTrack } from "./Track";
import { LavalinkFilterData } from "./Filters";

export type NodeLinkEventTypes =
    | "PlayerCreatedEvent"
    | "PlayerDestroyedEvent"
    | "PlayerConnectedEvent"
    | "PlayerReconnectingEvent"
    | "VolumeChangedEvent"
    | "FiltersChangedEvent"
    | "SeekEvent"
    | "PauseEvent"
    | "ConnectionStatusEvent"
    | "MixStartedEvent"
    | "MixEndedEvent";

export interface NodeLinkBaseEvent {
    op: "event";
    type: NodeLinkEventTypes;
    guildId: string;
}

export interface PlayerCreatedEvent extends NodeLinkBaseEvent {
    type: "PlayerCreatedEvent";
}

export interface PlayerDestroyedEvent extends NodeLinkBaseEvent {
    type: "PlayerDestroyedEvent";
}

export interface PlayerConnectedEvent extends NodeLinkBaseEvent {
    type: "PlayerConnectedEvent";
}

export interface PlayerReconnectingEvent extends NodeLinkBaseEvent {
    type: "PlayerReconnectingEvent";
}

export interface VolumeChangedEvent extends NodeLinkBaseEvent {
    type: "VolumeChangedEvent";
    /** New volume level (0-1000) */
    volume: number;
}

export interface FiltersChangedEvent extends NodeLinkBaseEvent {
    type: "FiltersChangedEvent";
    filters: LavalinkFilterData;
}

export interface SeekEvent extends NodeLinkBaseEvent {
    type: "SeekEvent";
    /** New position in milliseconds */
    position: number;
}

export interface PauseEvent extends NodeLinkBaseEvent {
    type: "PauseEvent";
    /** Whether playback is now paused (true) or resumed (false) */
    paused: boolean;
}

export interface ConnectionStatusEvent extends NodeLinkBaseEvent {
    type: "ConnectionStatusEvent";
    /** Current connection status */
    connected: boolean;
}

export interface MixStartedEvent extends NodeLinkBaseEvent {
    type: "MixStartedEvent";
    /** Unique identifier for the mix layer */
    mixId: string;
    /** Full track information of the mixed layer */
    track: LavalinkTrack;
    /** Volume of the mixed layer (0.0 to 1.0) */
    volume: number;
}

export interface MixEndedEvent extends NodeLinkBaseEvent {
    type: "MixEndedEvent";
    /** Unique identifier for the mix layer */
    mixId: string;
    /** Reason the mix layer ended (FINISHED, REMOVED, ERROR, MAIN_ENDED) */
    reason: "FINISHED" | "REMOVED" | "ERROR" | "MAIN_ENDED" | string;
}

export type NodeLinkEventPayload<T extends NodeLinkEventTypes> =
    T extends "PlayerCreatedEvent" ? PlayerCreatedEvent :
    T extends "PlayerDestroyedEvent" ? PlayerDestroyedEvent :
    T extends "PlayerConnectedEvent" ? PlayerConnectedEvent :
    T extends "PlayerReconnectingEvent" ? PlayerReconnectingEvent :
    T extends "VolumeChangedEvent" ? VolumeChangedEvent :
    T extends "FiltersChangedEvent" ? FiltersChangedEvent :
    T extends "SeekEvent" ? SeekEvent :
    T extends "PauseEvent" ? PauseEvent :
    T extends "ConnectionStatusEvent" ? ConnectionStatusEvent :
    T extends "MixStartedEvent" ? MixStartedEvent :
    T extends "MixEndedEvent" ? MixEndedEvent :
    never;

export type HealthStatusThreshold = { excellent: number, good: number, fair: number, poor: number }
export type NodeMetricSummary = {
    cpuLoad: number;
    systemLoad: number;
    memoryUsage: number;
    players: number;
    playingPlayers: number;
    uptime: number;
    ping: number;
    frameDeficit: number;
}

export type HealthPerformanceKeys = "excellent" | "good" | "fair" | "poor";
export type HealthStatusKeys = "healthy" | "degraded" | "critical" | "offline";