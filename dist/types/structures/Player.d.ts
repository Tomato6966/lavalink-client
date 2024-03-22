import { EQBand, FilterData, FilterManager, LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { LavalinkNode, SponsorBlockSegment } from "./Node";
import { Queue } from "./Queue";
import { Track, UnresolvedTrack } from "./Track";
import { Base64, LavalinkPlayerVoiceOptions, LavaSearchQuery, SearchQuery } from "./Utils";
type PlayerDestroyReasons = "QueueEmpty" | "NodeDestroy" | "NodeDeleted" | "LavalinkNoVoice" | "NodeReconnectFail" | "PlayerReconnectFail" | "Disconnected" | "ChannelDeleted" | "ReconnectAllNodes" | "DisconnectAllNodes";
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
    /** Guild id of the player */
    guildId: string;
    /** The Voice Channel Id */
    voiceChannelId: string;
    /** The Text Channel Id of the Player */
    textChannelId?: string;
    /** instantly change volume with the one play request */
    volume?: number;
    /** VC Region for node selections */
    vcRegion?: string;
    /** if it should join deafened */
    selfDeaf?: boolean;
    /** If it should join muted */
    selfMute?: boolean;
    /** If it should use a specific lavalink node */
    node?: LavalinkNode | string;
    /** If when applying filters, it should use the insta apply filters fix  */
    instaUpdateFiltersFix?: boolean;
    /** If a volume should be applied via filters instead of lavalink-volume */
    applyVolumeAsFilter?: boolean;
}
export type anyObject = {
    [key: string | number]: string | number | null | anyObject;
};
export interface BasePlayOptions {
    /** The position to start the track. */
    position?: number;
    /** The position to end the track. */
    endTime?: number;
    /** If to start "paused" */
    paused?: boolean;
    /** The Volume to start with */
    volume?: number;
    /** The Lavalink Filters to use | only with the new REST API */
    filters?: Partial<LavalinkFilterData>;
    /** Voice Update for Lavalink */
    voice?: LavalinkPlayerVoiceOptions;
}
export interface LavalinkPlayOptions extends BasePlayOptions {
    /** Which Track to play | don't provide, if it should pick from the Queue */
    track?: {
        /** The track encoded base64 string to use instead of the one from the queue system */
        encoded?: Base64 | null;
        /** The identifier of the track to use */
        identifier?: string;
        /** Custom User Data for the track to provide, will then be on the userData object from the track */
        userData?: anyObject;
        /** The Track requester for when u provide encodedTrack / identifer */
        requester?: unknown;
    };
}
export interface PlayOptions extends LavalinkPlayOptions {
    /** Whether to not replace the track if a play payload is sent. */
    noReplace?: boolean;
    /** Adds track on queue and skips to it */
    clientTrack?: Track | UnresolvedTrack;
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
    set(key: string, value: unknown): this;
    /**
     * Get custom data.
     * @param key
     */
    get<T>(key: string): T;
    /**
     * CLears all the custom data.
     */
    clearData(): this;
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
    setVolume(volume: number, ignoreVolumeDecrementer?: boolean): Promise<this>;
    lavaSearch(query: LavaSearchQuery, requestUser: unknown): Promise<import("./Utils").SearchResult | import("./Utils").LavaSearchResponse>;
    setSponsorBlock(segments?: SponsorBlockSegment[]): Promise<void>;
    getSponsorBlock(): Promise<SponsorBlockSegment[]>;
    deleteSponsorBlock(): Promise<void>;
    /**
     *
     * @param query Query for your data
     * @param requestUser
     */
    search(query: SearchQuery, requestUser: unknown): Promise<import("./Utils").SearchResult | import("./Utils").UnresolvedSearchResult>;
    /**
     * Pause the player
     */
    pause(): Promise<this>;
    /**
     * Resume the Player
     */
    resume(): Promise<this>;
    /**
     * Seek to a specific Position
     * @param position
     */
    seek(position: number): Promise<this>;
    /**
     * Set the Repeatmode of the Player
     * @param repeatMode
     */
    setRepeatMode(repeatMode: RepeatMode): Promise<this>;
    /**
     * Skip the current song, or a specific amount of songs
     * @param amount provide the index of the next track to skip to
     */
    skip(skipTo?: number, throwError?: boolean): any;
    /**
     * Clears the queue and stops playing. Does not destroy the Player and not leave the channel
     * @returns
     */
    stopPlaying(clearQueue?: boolean, executeAutoplay?: boolean): Promise<this>;
    /**
     * Connects the Player to the Voice Channel
     * @returns
     */
    connect(): Promise<this>;
    changeVoiceState(data: {
        voiceChannelId?: string;
        selfDeaf?: boolean;
        selfMute?: boolean;
    }): Promise<this>;
    /**
     * Disconnects the Player from the Voice Channel, but keeps the player in the cache
     * @param force If false it throws an error, if player thinks it's already disconnected
     * @returns
     */
    disconnect(force?: boolean): Promise<this>;
    /**
     * Destroy the player and disconnect from the voice channel
     */
    destroy(reason?: string, disconnect?: boolean): Promise<this>;
    /**
     * Move the player on a different Audio-Node
     * @param newNode New Node / New Node Id
     */
    changeNode(newNode: LavalinkNode | string): Promise<string>;
    /** Converts the Player including Queue to a Json state */
    toJSON(): PlayerJson;
}
export {};
