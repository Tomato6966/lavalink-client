import { QueueSaver } from "./QueueManager";
import { Track } from "./Track";
export interface StoredQueue {
    currentTrack: Track | null;
    previousTracks: Track[];
    nextTracks: Track[];
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
     * @returns The Queue, but in a raw State, which allows easier handling for the storeManager
     */
    getRaw(): StoredQueue;
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
