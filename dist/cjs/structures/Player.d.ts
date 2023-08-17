import { EQBand, FilterData, FilterManager, LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { LavalinkNode } from "./Node";
import { Queue } from "./Queue";
import { Track, UnresolvedTrack } from "./Track";
import { LavalinkPlayerVoiceOptions, SearchPlatform, SearchResult, LavaSearchType, LavaSearchResponse, LavaSrcSearchPlatformBase } from "./Utils";
type PlayerDestroyReasons = "QueueEmpty" | "NodeDestroy" | "NodeDeleted" | "LavalinkNoVoice" | "NodeReconnectFail" | "PlayerReconnectFail" | "Disconnected" | "ChannelDeleted";
export type DestroyReasonsType = PlayerDestroyReasons | string;
export declare const DestroyReasons: Record<PlayerDestroyReasons, PlayerDestroyReasons>;
export interface PlayerJson {
    guildId: string;
    options: PlayerOptions;
    voiceChannelId: string;
    textChannelId?: string;
    position: number;
    lastPosition: number;
    volume: number;
    lavalinkVolume: number;
    repeatMode: RepeatMode;
    paused: boolean;
    playing: boolean;
    createdTimeStamp?: number;
    filters: FilterData;
    ping: {
        ws: number;
        lavalink: number;
    };
    equalizer: EQBand[];
    nodeId?: string;
}
export type RepeatMode = "queue" | "track" | "off";
export interface PlayerOptions {
    guildId: string;
    voiceChannelId: string;
    volume?: number;
    vcRegion?: string;
    selfDeaf?: boolean;
    selfMute?: boolean;
    textChannelId?: string;
    node?: LavalinkNode | string;
    instaUpdateFiltersFix?: boolean;
    applyVolumeAsFilter?: boolean;
}
export interface PlayOptions {
    /** Which Track to play | don't provide, if it should pick from the Queue */
    track?: Track | UnresolvedTrack;
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
    LavalinkManager: LavalinkManager;
    options: PlayerOptions;
    node: LavalinkNode;
    queue: Queue;
}
export declare class Player {
    /** The Guild Id of the Player */
    guildId: string;
    /** The Voice Channel Id of the Player */
    voiceChannelId: string | null;
    /** The Text Channel Id of the Player */
    textChannelId: string | null;
    /** States if the Bot is supposed to be outputting audio */
    playing: boolean;
    /** States if the Bot is paused or not */
    paused: boolean;
    /** Repeat Mode of the Player */
    repeatMode: RepeatMode;
    /** Player's ping */
    ping: {
        lavalink: number;
        ws: number;
    };
    /** The Display Volume */
    volume: number;
    /** The Volume Lavalink actually is outputting */
    lavalinkVolume: number;
    /** The current Positin of the player (Calculated) */
    position: number;
    /** The current Positin of the player (from Lavalink) */
    lastPosition: number;
    /** When the player was created [Timestamp in Ms] (from lavalink) */
    createdTimeStamp: number;
    /** The Player Connection's State (from Lavalink) */
    connected: boolean | undefined;
    /** Voice Server Data (from Lavalink) */
    voice: LavalinkPlayerVoiceOptions;
    private readonly data;
    /**
     * Create a new Player
     * @param options
     * @param LavalinkManager
     */
    constructor(options: PlayerOptions, LavalinkManager: LavalinkManager);
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
    /**
     * CLears all the custom data.
     */
    clearData(): void;
    /**
     * Get all custom Data
     */
    getAllData(): Record<string, unknown>;
    /**
     * Play the next track from the queue / a specific track, with playoptions for Lavalink
     * @param options
     */
    play(options?: Partial<PlayOptions>): any;
    /**
     * Set the Volume for the Player
     * @param volume The Volume in percent
     * @param ignoreVolumeDecrementer If it should ignore the volumedecrementer option
     */
    setVolume(volume: number, ignoreVolumeDecrementer?: boolean): Promise<void>;
    lavaSearch(query: {
        query: string;
        source: LavaSrcSearchPlatformBase;
        types?: LavaSearchType[];
    }, requestUser: unknown): Promise<SearchResult | LavaSearchResponse>;
    /**
     *
     * @param query Query for your data
     * @param requestUser
     */
    search(query: {
        query: string;
        source?: SearchPlatform;
    } | string, requestUser: unknown): Promise<SearchResult>;
    /**
     * Pause the player
     */
    pause(): Promise<void>;
    /**
     * Resume the Player
     */
    resume(): Promise<void>;
    /**
     * Seek to a specific Position
     * @param position
     */
    seek(position: number): Promise<any>;
    /**
     * Set the Repeatmode of the Player
     * @param repeatMode
     */
    setRepeatMode(repeatMode: RepeatMode): Promise<RepeatMode>;
    /**
     * Skip the current song, or a specific amount of songs
     * @param amount provide the index of the next track to skip to
     */
    skip(skipTo?: number): Promise<any>;
    /**
     * Connects the Player to the Voice Channel
     * @returns
     */
    connect(): Promise<void>;
    /**
     * Disconnects the Player from the Voice Channel, but keeps the player in the cache
     * @param force If false it throws an error, if player thinks it's already disconnected
     * @returns
     */
    disconnect(force?: boolean): Promise<void>;
    /**
     * Destroy the player and disconnect from the voice channel
     */
    destroy(reason?: string): Promise<void>;
    /**
     * Move the player on a different Audio-Node
     * @param newNode New Node / New Node Id
     */
    changeNode(newNode: LavalinkNode | string): Promise<string>;
    /** Converts the Player including Queue to a Json state */
    toJSON(): PlayerJson;
}
export {};
