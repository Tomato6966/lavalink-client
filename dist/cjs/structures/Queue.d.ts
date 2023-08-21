import { Track, UnresolvedTrack } from "./Track";
import { MiniMap } from "./Utils";
export interface StoredQueue {
    current: Track | null;
    previous: Track[];
    tracks: Track[];
}
export interface QueueStoreManager extends Record<string, any> {
    /** @async get a Value (MUST RETURN UNPARSED!) */
    get: (guildId: unknown) => Promise<unknown>;
    /** @async Set a value inside a guildId (MUST BE UNPARSED) */
    set: (guildId: unknown, value: unknown) => Promise<unknown>;
    /** @async Delete a Database Value based of it's guildId */
    delete: (guildId: unknown) => Promise<unknown>;
    /** @async Transform the value(s) inside of the QueueStoreManager (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
    stringify: (value: unknown) => Promise<unknown>;
    /** @async Parse the saved value back to the Queue (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
    parse: (value: unknown) => Promise<Partial<StoredQueue>>;
}
export interface ManagerQueueOptions {
    /** Maximum Amount of tracks for the queue.previous array */
    maxPreviousTracks?: number;
    /** Custom Queue Store option */
    queueStore?: QueueStoreManager;
    /** Custom Queue Watcher class */
    queueChangesWatcher?: QueueChangesWatcher;
}
export interface QueueSaver {
    /** @private */
    _: QueueStoreManager;
    /** @private */
    options: {
        maxPreviousTracks: number;
    };
}
export declare class QueueSaver {
    constructor(options: ManagerQueueOptions);
    get(guildId: string): Promise<Partial<StoredQueue>>;
    delete(guildId: string): Promise<unknown>;
    set(guildId: string, value: any): Promise<unknown>;
    sync(guildId: string): Promise<Partial<StoredQueue>>;
}
export declare class DefaultQueueStore implements QueueStoreManager {
    private data;
    constructor();
    get(guildId: any): Promise<unknown>;
    set(guildId: any, stringifiedValue: any): Promise<MiniMap<unknown, unknown>>;
    delete(guildId: any): Promise<boolean>;
    stringify(value: any): Promise<any>;
    parse(value: any): Promise<Partial<StoredQueue>>;
}
export interface QueueChangesWatcher {
    /** get a Value (MUST RETURN UNPARSED!) */
    tracksAdd: (guildId: string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue) => any;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    tracksRemoved: (guildId: string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue) => any;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    shuffled: (guildId: string, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue) => any;
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
}
