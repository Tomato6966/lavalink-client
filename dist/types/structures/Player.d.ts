import { FilterManager } from "./Filters";
import { Queue } from "./Queue";
import type { DestroyReasons } from "./Constants";
import type { Track } from "./Types/Track";
import type { LavalinkNode } from "./Node";
import type { SponsorBlockSegment } from "./Types/Node";
import type { PlayerJson, PlayerOptions, PlayOptions, RepeatMode } from "./Types/Player";
import type { LavalinkManager } from "./LavalinkManager";
import type { LavalinkPlayerVoiceOptions, LavaSearchQuery, SearchQuery } from "./Types/Utils";
export declare class Player {
    /** Filter Manager per player */
    filterManager: FilterManager;
    /** circular reference to the lavalink Manager from the Player for easier use */
    LavalinkManager: LavalinkManager;
    /** Player options currently used, mutation doesn't affect player's state */
    options: PlayerOptions;
    /** The lavalink node assigned the the player, don't change it manually */
    node: LavalinkNode;
    /** The queue from the player */
    queue: Queue;
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
    get position(): number;
    /** The timestamp when the last position change update happened */
    lastPositionChange: number;
    /** The current Positin of the player (from Lavalink) */
    lastPosition: number;
    lastSavedPosition: number;
    /** When the player was created [Timestamp in Ms] (from lavalink) */
    createdTimeStamp: number;
    /** The Player Connection's State (from Lavalink) */
    connected: boolean | undefined;
    /** Voice Server Data (from Lavalink) */
    voice: LavalinkPlayerVoiceOptions;
    /** Custom data for the player */
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
    /**
     * Search for a track
     * @param query The query to search for
     * @param requestUser The user that requested the track
     * @param throwOnEmpty If an error should be thrown if no track is found
     * @returns The search result
     */
    lavaSearch(query: LavaSearchQuery, requestUser: unknown, throwOnEmpty?: boolean): Promise<import("./Types/Utils").SearchResult | import("./Types/Utils").LavaSearchResponse>;
    /**
     * Set the SponsorBlock
     * @param segments The segments to set
     */
    setSponsorBlock(segments?: SponsorBlockSegment[]): Promise<void>;
    /**
     * Get the SponsorBlock
     */
    getSponsorBlock(): Promise<SponsorBlockSegment[]>;
    /**
     * Delete the SponsorBlock
     */
    deleteSponsorBlock(): Promise<void>;
    /**
     *
     * @param query Query for your data
     * @param requestUser
     */
    search(query: SearchQuery, requestUser: unknown, throwOnEmpty?: boolean): Promise<import("./Types/Utils").UnresolvedSearchResult | import("./Types/Utils").SearchResult>;
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
    skip(skipTo?: number, throwError?: boolean): Promise<this>;
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
    destroy(reason?: DestroyReasons | string, disconnect?: boolean): Promise<this>;
    /**
     * Get the current lyrics of the track currently playing on the guild
     * @param guildId The guild id to get the current lyrics for
     * @param skipTrackSource If true, it will not try to get the lyrics from the track source
     * @returns The current lyrics
     * @example
     * ```ts
     * const lyrics = await player.getCurrentLyrics();
     * ```
     */
    getCurrentLyrics(skipTrackSource?: boolean): Promise<import("./Types/Node").LyricsResult>;
    /**
     * Get the lyrics of a specific track
     * @param track The track to get the lyrics for
     * @param skipTrackSource If true, it will not try to get the lyrics from the track source
     * @returns The lyrics of the track
     * @example
     * ```ts
     * const lyrics = await player.getLyrics(player.queue.tracks[0], true);
     * ```
     */
    getLyrics(track: Track, skipTrackSource?: boolean): Promise<import("./Types/Node").LyricsResult>;
    /**
     * Subscribe to the lyrics event on a specific guild to active live lyrics events
     * @param guildId The guild id to subscribe to
     * @returns The unsubscribe function
     * @example
     * ```ts
     * const lyrics = await player.subscribeLyrics();
     * ```
     */
    subscribeLyrics(): Promise<any>;
    /**
     * Unsubscribe from the lyrics event on a specific guild to disable live lyrics events
     * @param guildId The guild id to unsubscribe from
     * @returns The unsubscribe function
     * @example
     * ```ts
     * const lyrics = await player.unsubscribeLyrics();
     * ```
     */
    unsubscribeLyrics(guildId: string): Promise<any>;
    /**
     * Move the player on a different Audio-Node
     * @param newNode New Node / New Node Id
     */
    changeNode(newNode: LavalinkNode | string): Promise<string>;
    /** Converts the Player including Queue to a Json state */
    toJSON(): PlayerJson;
}
