import { FilterManager, LavalinkFilterData } from "./Filters";
import { LavalinkNode } from "./Node";
import { PlayerManager } from "./PlayerManager";
import { Queue } from "./Queue";
import { Track } from "./Track";
import { LavalinkPlayerVoiceOptions, SearchPlatform, SearchResult } from "./Utils";
export type RepeatMode = "queue" | "track" | "off";
export interface PlayerOptions {
    guildId: string;
    voiceChannelId: string;
    volume?: number;
    vcRegion?: string;
    selfDeaf?: boolean;
    selfMute?: boolean;
    textChannelId?: string;
    node?: Node | string;
    instaUpdateFiltersFix?: boolean;
    applyVolumeAsFilter?: boolean;
}
export interface PlayOptions {
    /** Which Track to play | don't provide, if it should pick from the Queue */
    track?: Track;
    /** Encoded Track to use, instead of the queue system... */
    encodedTrack?: string | null;
    /** Encoded Track to use&search, instead of the queue system (yt only)... */
    identifier?: string;
    /** The position to start the track. */
    position?: number;
    /** The position to end the track. */
    endTime?: number;
    /** Whether to not replace the track if a play payload is sent. */
    noReplace?: boolean;
    /** If to start "paused" */
    paused?: boolean;
    /** The Volume to start with */
    volume?: number;
    /** The Lavalink Filters to use | only with the new REST API */
    filters?: Partial<LavalinkFilterData>;
    voice?: LavalinkPlayerVoiceOptions;
}
export interface Player {
    filterManager: FilterManager;
    playerManager: PlayerManager;
    options: PlayerOptions;
    node: LavalinkNode;
    queue: Queue;
}
export declare class Player {
    guildId: string;
    voiceChannelId: string | null;
    textChannelId: string | null;
    playing: boolean;
    paused: boolean;
    repeatMode: RepeatMode;
    ping: number;
    wsPing: number;
    volume: number;
    lavalinkVolume: number;
    position: number;
    /** When the player was created [Timestamp] (from lavalink) */
    createdTimeStamp: number;
    /** If lavalink says it's connected or not */
    connected: boolean | undefined;
    voice: LavalinkPlayerVoiceOptions;
    private readonly data;
    /**
     * Set custom data.
     * @param key
     * @param value
     */
    set(key: string, value: unknown): void;
    /**
     * Get custom data.
     * @param key
     */
    get<T>(key: string): T;
    clearData(): void;
    getAllData(): Record<string, unknown>;
    constructor(options: PlayerOptions, playerManager: PlayerManager);
    play(options?: Partial<PlayOptions>): Promise<void>;
    setVolume(volume: number, ignoreVolumeDecrementer?: boolean): Promise<void>;
    search(query: {
        query: string;
        source: SearchPlatform;
    }, requestUser: unknown): Promise<SearchResult>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seek(position: number): Promise<any>;
    setRepeatMode(repeatMode: RepeatMode): Promise<void>;
    /**
     * Skip a Song (on Lavalink it's called "STOP")
     * @param amount provide the index of the next track to skip to
     */
    skip(skipTo?: number): Promise<boolean>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    /**
     * Destroy the player
     */
    destroy(disconnect?: boolean): Promise<void>;
}
