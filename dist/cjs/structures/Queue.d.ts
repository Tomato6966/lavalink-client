import { Track } from "./Track";
export interface StoredQueue {
    currentTrack: Track | null;
    previousTracks: Track[];
    nextTracks: Track[];
}
export interface StoreManager extends Record<any, any> {
    /** @async get a Value */
    get: (key: unknown) => any;
    /** @async Set a value inside a key */
    set: (key: unknown, value: unknown) => any;
    /** @async Delete a Database Value based of it's key */
    delete: (key: unknown) => any;
    /** @async Transform the value(s) inside of the StoreManager */
    stringify: (value: unknown) => any;
    /** @async Parse the saved value back to the Queue */
    parse: (value: unknown) => Queue;
}
export interface QueueSaverOptions {
    maxPreviousTracks: number;
}
export interface QueueSaver {
    /** @private */
    _: StoreManager;
    /** @private */
    options: QueueSaverOptions;
}
export declare class QueueSaver {
    constructor(storeManager: StoreManager, options: QueueSaverOptions);
    get(key: string): Promise<Queue>;
    delete(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
}
export declare class DefaultQueueStore {
    private data;
    constructor();
    get(key: any): any;
    set(key: any, value: any): Map<any, any>;
    delete(key: any): boolean;
    stringify(value: any): any;
    parse(value: any): any;
}
export declare class Queue {
    private readonly _nextTracks;
    private readonly _previousTracks;
    private _currentTrack;
    private readonly _guildId;
    private readonly _QueueSaver;
    constructor(data?: Partial<StoredQueue>, guildId?: string, QueueSaver?: QueueSaver);
    /**
     * Validate if a data is euqal to a track
     * @param {Track|any} data the Track to validate
     * @returns {boolean}
     */
    isTrack(data: Track | any): boolean;
    /**
     * Get the current Playing Track
     * @returns {Track}
     */
    get currentTrack(): Track;
    /**
     * Get all previously plaid Tracks
     * @returns {Track[]}
     */
    get previousTracks(): Track[];
    /**
     * Get all Upcoming Tracks
     * @returns {Track[]}
     */
    get nextTracks(): Track[];
    /**
     * Get the amount of the upcoming Tracks
     * @returns {number}
     */
    get size(): number;
    /**
     * Get the amount of the previous Tracks
     * @returns {number}
     */
    get previousSize(): number;
    /**
     * @returns {{currentTrack:Track|null, previousTracks:Track[], nextTracks:Track[]}}The Queue, but in a raw State, which allows easier handling for the storeManager
     */
    getRaw(): StoredQueue;
    /**
     * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
     * @param {Track | Track[]} TrackOrTracks
     * @param {number} index At what position to add the Track
     * @returns {number} Queue-Size (for the next Tracks)
     */
    add(TrackOrTracks: Track | Track[], index?: number): Promise<number | Track | Track[]>;
    /**
     * Splice the nextTracks in the Queue
     * @param {number} index Where to remove the Track
     * @param {number} amount How many Tracks to remove?
     * @param {Track | Track[]} TrackOrTracks Want to Add more Tracks?
     * @returns {Track} Spliced Track
     */
    splice(index: number, amount: number, TrackOrTracks?: Track | Track[]): Promise<Track | Track[]>;
    /**
     * Shuffles the current Queue, then saves it
     * @returns Amount of Tracks in the Queue
     */
    shuffle(): Promise<number>;
    /**
     * Get the Total Duration of the Queue-Songs summed up
     * @returns {number}
     */
    get duration(): number;
    /**
     * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
     * @param Track
     * @returns {number} Previous Queue Size
     */
    addPrevious(Track: Track): Promise<number>;
    /**
     * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
     * @param Track
     * @returns {Track|null} new Current Track
     */
    setCurrent(Track: Track | null): Promise<Track>;
    /** @private @hidden */
    _trackEnd(addBackToQueue?: boolean): Promise<Track>;
}
