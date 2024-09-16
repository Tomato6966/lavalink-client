import { MiniMap } from "./Utils.js";
import type { Track, UnresolvedTrack } from "./Types/Track.js";
import type { ManagerQueueOptions, QueueStoreManager, StoredQueue } from "./Types/Queue.js";
export declare class QueueSaver {
    /**
     * The queue store manager
     */
    private _;
    /**
     * The options for the queue saver
     */
    options: {
        maxPreviousTracks: number;
    };
    constructor(options: ManagerQueueOptions);
    /**
     * Get the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    get(guildId: string): Promise<Partial<StoredQueue>>;
    /**
     * Delete the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    delete(guildId: string): Promise<unknown>;
    /**
     * Set the queue for a guild
     * @param guildId The guild ID
     * @param valueToStringify The queue to set
     * @returns The queue for the guild
     */
    set(guildId: string, valueToStringify: StoredQueue): Promise<unknown>;
    /**
     * Sync the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    sync(guildId: string): Promise<Partial<StoredQueue>>;
}
export declare class DefaultQueueStore implements QueueStoreManager {
    private data;
    constructor();
    /**
     * Get the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    get(guildId: any): Promise<unknown>;
    /**
     * Set the queue for a guild
     * @param guildId The guild ID
     * @param valueToStringify The queue to set
     * @returns The queue for the guild
     */
    set(guildId: any, valueToStringify: any): Promise<MiniMap<unknown, unknown>>;
    /**
     * Delete the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    delete(guildId: any): Promise<boolean>;
    /**
     * Stringify the queue for a guild
     * @param value The queue to stringify
     * @returns The stringified queue
     */
    stringify(value: any): Promise<any>;
    /**
     * Parse the queue for a guild
     * @param value The queue to parse
     * @returns The parsed queue
     */
    parse(value: any): Promise<Partial<StoredQueue>>;
}
export declare class Queue {
    readonly tracks: (Track | UnresolvedTrack)[];
    readonly previous: Track[];
    current: Track | null;
    options: {
        maxPreviousTracks: number;
    };
    private readonly guildId;
    private readonly QueueSaver;
    private managerUtils;
    private queueChanges;
    /**
     * Create a new Queue
     * @param guildId The guild ID
     * @param data The data to initialize the queue with
     * @param QueueSaver The queue saver to use
     * @param queueOptions
     */
    constructor(guildId: string, data?: Partial<StoredQueue>, QueueSaver?: QueueSaver, queueOptions?: ManagerQueueOptions);
    /**
     * Utils for a Queue
     */
    utils: {
        /**
         * Save the current cached Queue on the database/server (overides the server)
         */
        save: () => Promise<unknown>;
        /**
         * Sync the current queue database/server with the cached one
         * @returns {void}
         */
        sync: (override?: boolean, dontSyncCurrent?: boolean) => Promise<void>;
        destroy: () => Promise<unknown>;
        /**
         * @returns {{current:Track|null, previous:Track[], tracks:Track[]}}The Queue, but in a raw State, which allows easier handling for the QueueStoreManager
         */
        toJSON: () => StoredQueue;
        /**
         * Get the Total Duration of the Queue-Songs summed up
         * @returns {number}
         */
        totalDuration: () => number;
    };
    /**
     * Shuffles the current Queue, then saves it
     * @returns Amount of Tracks in the Queue
     */
    shuffle(): Promise<number>;
    /**
     * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
     * @param {Track | Track[]} TrackOrTracks
     * @param {number} index At what position to add the Track
     * @returns {number} Queue-Size (for the next Tracks)
     */
    add(TrackOrTracks: Track | UnresolvedTrack | (Track | UnresolvedTrack)[], index?: number): any;
    /**
     * Splice the tracks in the Queue
     * @param {number} index Where to remove the Track
     * @param {number} amount How many Tracks to remove?
     * @param {Track | Track[]} TrackOrTracks Want to Add more Tracks?
     * @returns {Track} Spliced Track
     */
    splice(index: number, amount: number, TrackOrTracks?: Track | UnresolvedTrack | (Track | UnresolvedTrack)[]): any;
    /**
     * Remove stuff from the queue.tracks array
     *  - single Track | UnresolvedTrack
     *  - multiple Track | UnresovedTrack
     *  - at the index or multiple indexes
     * @param removeQueryTrack
     * @returns null (if nothing was removed) / { removed } where removed is an array with all removed elements
     *
     * @example
     * ```js
     * // remove single track
     *
     * const track = player.queue.tracks[4];
     * await player.queue.remove(track);
     *
     * // if you already have the index you can straight up pass it too
     * await player.queue.remove(4);
     *
     *
     * // if you want to remove multiple tracks, e.g. from position 4 to position 10 you can do smt like this
     * await player.queue.remove(player.queue.tracks.slice(4, 10)) // get's the tracks from 4 - 10, which then get's found in the remove function to be removed
     *
     * // I still highly suggest to use .splice!
     *
     * await player.queue.splice(4, 10); // removes at index 4, 10 tracks
     *
     * await player.queue.splice(1, 1); // removes at index 1, 1 track
     *
     * await player.queue.splice(4, 0, ...tracks) // removes 0 tracks at position 4, and then inserts all tracks after position 4.
     * ```
     */
    remove<T extends Track | UnresolvedTrack | number | Track[] | UnresolvedTrack[] | number[] | (number | Track | UnresolvedTrack)[]>(removeQueryTrack: T): Promise<{
        removed: (Track | UnresolvedTrack)[];
    } | null>;
    /**
     * Shifts the previous array, to return the last previous track & thus remove it from the previous queue
     * @returns
     *
     * @example
     * ```js
     * // example on how to play the previous track again
     * const previous = await player.queue.shiftPrevious(); // get the previous track and remove it from the previous queue array!!
     * if(!previous) return console.error("No previous track found");
     * await player.play({ clientTrack: previous }); // play it again
     * ```
     */
    shiftPrevious(): Promise<Track>;
}
