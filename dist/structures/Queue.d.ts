import { Track } from "./Track";
export interface StoredQueue {
    currentTrack: Track | null;
    previousTracks: Track[];
    nextTracks: Track[];
}
export interface QueueStoreManager extends Record<any, any> {
    /** @async get a Value */
    get: (key: unknown) => any;
    /** @async Set a value inside a key */
    set: (key: unknown, value: unknown) => any;
    /** @async Delete a Database Value based of it's key */
    delete: (key: unknown) => any;
    /** @async Transform the value(s) inside of the QueueStoreManager */
    stringify: (value: unknown) => any;
    /** @async Parse the saved value back to the Queue */
    parse: (value: unknown) => Queue;
}
export interface ManagerQueueOptions {
    maxPreviousTracks: number;
}
export interface QueueSaver {
    /** @private */
    _: QueueStoreManager;
    /** @private */
    options: ManagerQueueOptions;
}
export declare class QueueSaver {
    constructor(QueueStoreManager: QueueStoreManager, options: ManagerQueueOptions);
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
    isTrack(data: Track): boolean;
    /** The Current Playing Track */
    get currentTrack(): Track;
    /** All Previous Track(s) [with the limited amount] */
    get previousTracks(): Track[];
    /** All Upcoming Track(s) */
    get nextTracks(): Track[];
    /** The Size of the upcoming Track(s) */
    get size(): number;
    /** The Size of the previous Track(s) */
    get previousSize(): number;
    /**
     * @returns The Queue, but in a raw State, which allows easier handling for the QueueStoreManager
     */
    getStored(): StoredQueue;
    /**
     * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
     * @param Track
     * @param index At what position to add the Track
     * @returns Queue-Size (for the next Tracks)
     */
    add(TrackOrTracks: Track | Track[], index?: number): Promise<number | Track | Track[]>;
    /**
     *
     * @param index Where to remove the Track
     * @param amount How many Tracks to remove?
     * @param TrackOrTracks Want to Add more Tracks?
     */
    splice(index: number, amount: number, TrackOrTracks?: Track | Track[]): Promise<Track | Track[]>;
    /**
     * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
     * @param Track
     * @returns PreviousTracksSize
     */
    addPrevious(Track: Track): Promise<number>;
    /**
     * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
     * @param Track
     * @returns PreviousTracksSize
     */
    setCurrent(Track: Track | null): Promise<Track>;
    /** @private @hidden */
    _trackEnd(addBackToQueue?: boolean): Promise<Track>;
}
