import type { ManagerQueueOptions, QueueChangesWatcher, QueueStoreManager, StoredQueue } from "./Types/Queue";
import type { Track, UnresolvedTrack } from "./Types/Track";
import { ManagerUtils, MiniMap, QueueSymbol } from "./Utils";

export class QueueSaver {
    /**
     * The queue store manager
     */
    private _: QueueStoreManager;
    /**
     * The options for the queue saver
     */
    public options: {
        maxPreviousTracks: number;
    };
    constructor(options: ManagerQueueOptions) {
        this._ = options?.queueStore || new DefaultQueueStore();
        this.options = {
            maxPreviousTracks: options?.maxPreviousTracks || 25,
        };
    }

    /**
     * Get the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    async get(guildId: string) {
        return this._.parse(await this._.get(guildId));
    }

    /**
     * Delete the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    async delete(guildId: string) {
        return this._.delete(guildId);
    }

    /**
     * Set the queue for a guild
     * @param guildId The guild ID
     * @param valueToStringify The queue to set
     * @returns The queue for the guild
     */
    async set(guildId: string, valueToStringify: StoredQueue) {
        return this._.set(guildId, await this._.stringify(valueToStringify));
    }

    /**
     * Sync the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    async sync(guildId: string) {
        return this.get(guildId);
    }
}

export class DefaultQueueStore implements QueueStoreManager {
    private data = new MiniMap<string, StoredQueue>();
    constructor() { }

    /**
     * Get the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    get(guildId: string): StoredQueue | undefined {
        return this.data.get(guildId);
    }

    /**
     * Set the queue for a guild
     * @param guildId The guild ID
     * @param valueToStringify The queue to set
     * @returns The queue for the guild
     */
    set(guildId: string, valueToStringify): boolean {
        return this.data.set(guildId, valueToStringify) ? true : false;
    }

    /**
     * Delete the queue for a guild
     * @param guildId The guild ID
     * @returns The queue for the guild
     */
    delete(guildId: string) {
        return this.data.delete(guildId);
    }

    /**
     * Stringify the queue for a guild
     * @param value The queue to stringify
     * @returns The stringified queue
     */
    stringify(value: StoredQueue | string): StoredQueue | string {
        return value; // JSON.stringify(value);
    }

    /**
     * Parse the queue for a guild
     * @param value The queue to parse
     * @returns The parsed queue
     */
    parse(value: StoredQueue | string): Partial<StoredQueue> {
        return value as Partial<StoredQueue>; // JSON.parse(value)
    }
    /*
        // the base now has an Awaitable util type, so it allows both ASYNC as well as SYNC examples for all functions!
        // here are all functions as async, typed, if you want to copy-paste it
        async get(guildId: string): Promise<StoredQueue> {
            return this.data.get(guildId);
        }
        async set(guildId: string, valueToStringify): Promise<boolean> {
            return this.data.set(guildId, valueToStringify) ? true : false;
        }
        async delete(guildId: string) {
            return this.data.delete(guildId);
        }
        async stringify(value: StoredQueue | string): Promise<StoredQueue | string> {
            return value; // JSON.stringify(value);
        }
        async parse(value: StoredQueue | string): Promise<Partial<StoredQueue>> {
            return value as Partial<StoredQueue>; // JSON.parse(value)
        }
    */
}

export class Queue {
    public readonly tracks: (Track | UnresolvedTrack)[] = [];
    public readonly previous: Track[] = [];
    public current: Track | null = null;
    public options = { maxPreviousTracks: 25 };
    private readonly guildId: string = "";
    private readonly QueueSaver: QueueSaver | null = null;
    private managerUtils = new ManagerUtils();
    private queueChanges: QueueChangesWatcher | null;

    /**
     * Create a new Queue
     * @param guildId The guild ID
     * @param data The data to initialize the queue with
     * @param QueueSaver The queue saver to use
     * @param queueOptions
     */
    constructor(
        guildId: string,
        data: Partial<StoredQueue> = {},
        QueueSaver?: QueueSaver,
        queueOptions?: ManagerQueueOptions,
    ) {
        this.queueChanges = queueOptions?.queueChangesWatcher || null;
        this.guildId = guildId;
        this.QueueSaver = QueueSaver;
        this.options.maxPreviousTracks = this.QueueSaver?.options?.maxPreviousTracks ?? this.options.maxPreviousTracks;

        this.current = this.managerUtils.isTrack(data.current) ? data.current : null;
        this.previous =
            Array.isArray(data.previous) &&
                data.previous.some(
                    (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                )
                ? data.previous.filter(
                    (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                )
                : [];
        this.tracks =
            Array.isArray(data.tracks) &&
                data.tracks.some((track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track))
                ? data.tracks.filter(
                    (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                )
                : [];

        Object.defineProperty(this, QueueSymbol, { configurable: true, value: true });
    }

    /**
     * Utils for a Queue
     */
    public utils = {
        /**
         * Save the current cached Queue on the database/server (overides the server)
         */
        save: async () => {
            if (this.previous.length > this.options.maxPreviousTracks)
                this.previous.splice(this.options.maxPreviousTracks, this.previous.length);
            return await this.QueueSaver.set(this.guildId, this.utils.toJSON());
        },

        /**
         * Sync the current queue database/server with the cached one
         * @returns {void}
         */
        sync: async (override = true, dontSyncCurrent = true) => {
            const data = await this.QueueSaver.get(this.guildId);
            if (!data) throw new Error(`No data found to sync for guildId: ${this.guildId}`);
            if (!dontSyncCurrent && !this.current && this.managerUtils.isTrack(data.current))
                this.current = data.current;
            if (
                Array.isArray(data.tracks) &&
                data?.tracks.length &&
                data.tracks.some(
                    (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                )
            )
                this.tracks.splice(
                    override ? 0 : this.tracks.length,
                    override ? this.tracks.length : 0,
                    ...data.tracks.filter(
                        (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                    ),
                );
            if (
                Array.isArray(data.previous) &&
                data?.previous.length &&
                data.previous.some(
                    (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                )
            )
                this.previous.splice(
                    0,
                    override ? this.previous.length : 0,
                    ...data.previous.filter(
                        (track) => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track),
                    ),
                );

            await this.utils.save();

            return;
        },

        destroy: async () => {
            return await this.QueueSaver.delete(this.guildId);
        },

        /**
         * @returns {{current:Track|null, previous:Track[], tracks:Track[]}}The Queue, but in a raw State, which allows easier handling for the QueueStoreManager
         */
        toJSON: (): StoredQueue => {
            if (this.previous?.length > this.options?.maxPreviousTracks)
                this.previous?.splice(this.options?.maxPreviousTracks, this.previous.length);
            return {
                current: this.current ? { ...this.current } : null,
                previous: this.previous ? [...this.previous] : [],
                tracks: this.tracks ? [...this.tracks] : [],
            };
        },

        /**
         * Get the Total Duration of the Queue-Songs summed up
         * @returns {number}
         */
        totalDuration: () => {
            return this.tracks.reduce(
                (acc: number, cur) => acc + (cur.info.duration || 0),
                this.current?.info.duration || 0,
            );
        },

        /**
         * Find tracks in the queue matching specific criteria.
         * **This method DOES NOT MUTATE the queue** - it returns a new array without modifying the original queue.
         * @param predicate Function to test each track, or an object with criteria to match
         * @returns Array of matching tracks with their indexes
         *
         * @example
         * ```ts
         * // Find by author
         * const artistTracks = player.queue.utils.filterTracks({ author: "Artist Name" });
         *
         * // Find by duration range (5-10 minutes)
         * const longTracks = player.queue.utils.filterTracks({ duration: { min: 300000, max: 600000 } });
         *
         * // Find by title (partial match)
         * const titleMatches = player.queue.utils.filterTracks({ title: "Never Gonna" });
         *
         * // Custom predicate
         * const customFilter = player.queue.utils.filterTracks(track => track.info.isStream);
         * ```
         */
        filterTracks: (
            predicate:
                | ((track: Track | UnresolvedTrack, index: number) => boolean)
                | {
                    title?: string;
                    author?: string;
                    duration?: number | { min?: number; max?: number };
                    uri?: string;
                    identifier?: string;
                    sourceName?: string;
                    isStream?: boolean;
                    isSeekable?: boolean;
                },
        ): Array<{ track: Track | UnresolvedTrack; index: number }> => {
            if (typeof predicate === "function") {
                return this.tracks
                    .map((track, index) => ({ track, index }))
                    .filter(({ track, index }) => predicate(track, index));
            }

            return this.tracks
                .map((track, index) => ({ track, index }))
                .filter(({ track }) => {
                    if (predicate.title && !track.info?.title?.toLowerCase().includes(predicate.title.toLowerCase())) {
                        return false;
                    }

                    if (
                        predicate.author &&
                        !track.info?.author?.toLowerCase().includes(predicate.author.toLowerCase())
                    ) {
                        return false;
                    }

                    if (predicate.duration !== undefined) {
                        const duration = track.info?.duration || 0;
                        if (typeof predicate.duration === "number") {
                            if (duration !== predicate.duration) return false;
                        } else {
                            if (predicate.duration.min !== undefined && duration < predicate.duration.min) return false;
                            if (predicate.duration.max !== undefined && duration > predicate.duration.max) return false;
                        }
                    }

                    if (predicate.uri && track.info?.uri !== predicate.uri) {
                        return false;
                    }

                    if (predicate.identifier && track.info?.identifier !== predicate.identifier) {
                        return false;
                    }

                    if (
                        predicate.sourceName &&
                        track.info?.sourceName?.toLowerCase() !== predicate.sourceName.toLowerCase()
                    ) {
                        return false;
                    }

                    if (predicate.isStream !== undefined && track.info?.isStream !== predicate.isStream) {
                        return false;
                    }

                    if (predicate.isSeekable !== undefined && track.info?.isSeekable !== predicate.isSeekable) {
                        return false;
                    }

                    return true;
                });
        },

        /**
         * Find a single track in the queue matching specific criteria.
         * **This method DOES NOT MUTATE the queue** - it searches without modifying the original queue.
         * @param predicate Function to test each track, or an object with criteria to match
         * @returns First matching track with its index, or null if not found
         *
         * @example
         * ```ts
         * // Find first track by author
         * const track = player.queue.utils.findTrack({ author: "Artist Name" });
         * if (track) {
         *   console.log(`Found at index ${track.index}: ${track.track.info.title}`);
         * }
         *
         * // Find with custom predicate
         * const liveStream = player.queue.utils.findTrack(track => track.info.isStream);
         * ```
         */
        findTrack: (
            predicate:
                | ((track: Track | UnresolvedTrack, index: number) => boolean)
                | {
                    title?: string;
                    author?: string;
                    duration?: number | { min?: number; max?: number };
                    uri?: string;
                    identifier?: string;
                    sourceName?: string;
                    isStream?: boolean;
                    isSeekable?: boolean;
                },
        ): { track: Track | UnresolvedTrack; index: number } | null => {
            const results = this.utils.filterTracks(predicate);
            return results.length > 0 ? results[0] : null;
        },
    };

    /**
     * Shuffles the current Queue, then saves it
     * @returns Amount of Tracks in the Queue
     */
    public async shuffle() {
        const oldStored = typeof this.queueChanges?.shuffled === "function" ? this.utils.toJSON() : null;

        if (this.tracks.length <= 1) return this.tracks.length;
        // swap #1 and #2 if only 2 tracks.
        if (this.tracks.length === 2) {
            [this.tracks[0], this.tracks[1]] = [this.tracks[1], this.tracks[0]];
        } else {
            // randomly swap places.
            for (let i = this.tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
            }
        }

        // LOG
        if (typeof this.queueChanges?.shuffled === "function")
            this.queueChanges.shuffled(this.guildId, oldStored, this.utils.toJSON());

        await this.utils.save();
        return this.tracks.length;
    }

    /**
     * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
     * @param {Track | Track[]} TrackOrTracks
     * @param {number} index At what position to add the Track
     * @returns {number} Queue-Size (for the next Tracks)
     */
    public async add(TrackOrTracks: Track | UnresolvedTrack | (Track | UnresolvedTrack)[], index?: number) {
        if (typeof index === "number" && index >= 0 && index < this.tracks.length) {
            return await this.splice(
                index,
                0,
                (Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks])
                    .flat(2)
                    .filter((v) => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)),
            );
        }

        const oldStored = typeof this.queueChanges?.tracksAdd === "function" ? this.utils.toJSON() : null;
        // add the track(s)
        this.tracks.push(
            ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks])
                .flat(2)
                .filter((v) => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)),
        );
        // log if available
        if (typeof this.queueChanges?.tracksAdd === "function")
            try {
                this.queueChanges.tracksAdd(
                    this.guildId,
                    (Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks])
                        .flat(2)
                        .filter((v) => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)),
                    this.tracks.length,
                    oldStored,
                    this.utils.toJSON(),
                );
            } catch {
                /*  */
            }

        // save the queue
        await this.utils.save();
        // return the amount of the tracks
        return this.tracks.length;
    }

    /**
     * Splice the tracks in the Queue
     * @param {number} index Where to remove the Track
     * @param {number} amount How many Tracks to remove?
     * @param {Track | Track[]} TrackOrTracks Want to Add more Tracks?
     * @returns {Track} Spliced Track
     */
    public async splice(
        index: number,
        amount: number,
        TrackOrTracks?: Track | UnresolvedTrack | (Track | UnresolvedTrack)[],
    ) {
        const oldStored =
            typeof this.queueChanges?.tracksAdd === "function" || typeof this.queueChanges?.tracksRemoved === "function"
                ? this.utils.toJSON()
                : null;
        // if no tracks to splice, add the tracks
        if (!this.tracks.length) {
            if (TrackOrTracks) return await this.add(TrackOrTracks);
            return null;
        }
        // Log if available
        if (TrackOrTracks && typeof this.queueChanges?.tracksAdd === "function")
            try {
                this.queueChanges.tracksAdd(
                    this.guildId,
                    (Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks])
                        .flat(2)
                        .filter((v) => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)),
                    index,
                    oldStored,
                    this.utils.toJSON(),
                );
            } catch {
                /*  */
            }
        // remove the tracks (and add the new ones)
        const spliced = TrackOrTracks
            ? this.tracks.splice(
                index,
                amount,
                ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks])
                    .flat(2)
                    .filter((v) => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)),
            )
            : this.tracks.splice(index, amount);
        // Log if available
        if (typeof this.queueChanges?.tracksRemoved === "function")
            try {
                this.queueChanges.tracksRemoved(this.guildId, spliced, index, oldStored, this.utils.toJSON());
            } catch {
                /* */
            }
        // save the queue
        await this.utils.save();
        // return the things
        return spliced.length === 1 ? spliced[0] : spliced;
    }

    /**
     * Remove stuff from the queue.tracks array
     *  - single Track | UnresolvedTrack
     *  - multiple Track | UnresovedTrack
     *  - at the index or multiple indexes
     *  - Since v2.7 the removed tracks get unshifted into the previous queue state instead of pushed (indexed at the start instead of end - as it should)
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
    public async remove<
        T extends
        | Track
        | UnresolvedTrack
        | number
        | Track[]
        | UnresolvedTrack[]
        | number[]
        | (number | Track | UnresolvedTrack)[],
    >(removeQueryTrack: T): Promise<{ removed: (Track | UnresolvedTrack)[] } | null> {
        if (
            removeQueryTrack === null ||
            removeQueryTrack === undefined ||
            (Array.isArray(removeQueryTrack) && removeQueryTrack.length === 0)
        ) {
            return null;
        }

        const oldStored = typeof this.queueChanges?.tracksRemoved === "function" ? this.utils.toJSON() : null;
        if (typeof removeQueryTrack === "number") {
            const toRemove = this.tracks[removeQueryTrack];
            if (!toRemove) return null;

            const removed = this.tracks.splice(removeQueryTrack, 1);
            // Log if available
            if (typeof this.queueChanges?.tracksRemoved === "function")
                try {
                    this.queueChanges.tracksRemoved(
                        this.guildId,
                        removed,
                        removeQueryTrack,
                        oldStored,
                        this.utils.toJSON(),
                    );
                } catch {
                    /* */
                }

            await this.utils.save();

            return { removed };
        }

        if (Array.isArray(removeQueryTrack)) {
            if (removeQueryTrack.every((v) => typeof v === "number")) {
                const removed = [];
                const sortedIndexes = (removeQueryTrack as number[]).sort((a, b) => b - a);
                for (const i of sortedIndexes) {
                    if (this.tracks[i]) {
                        removed.unshift(...this.tracks.splice(i, 1));
                    }
                }
                if (!removed.length) return null;

                // Log if available
                if (typeof this.queueChanges?.tracksRemoved === "function")
                    try {
                        this.queueChanges.tracksRemoved(
                            this.guildId,
                            removed,
                            removeQueryTrack as number[],
                            oldStored,
                            this.utils.toJSON(),
                        );
                    } catch {
                        /* */
                    }

                await this.utils.save();

                return { removed };
            }

            const tracksToRemove = this.tracks
                .map((v, i) => ({ v, i }))
                .filter(({ v, i }) =>
                    removeQueryTrack.find(
                        (t) =>
                            (typeof t === "number" && t === i) ||
                            (typeof t === "object" &&
                                ((t.encoded && t.encoded === v.encoded) ||
                                    (t.info?.identifier && t.info.identifier === v.info?.identifier) ||
                                    (t.info?.uri && t.info.uri === v.info?.uri) ||
                                    (t.info?.title && t.info.title === v.info?.title) ||
                                    (t.info?.isrc && t.info.isrc === v.info?.isrc) ||
                                    (t.info?.artworkUrl && t.info.artworkUrl === v.info?.artworkUrl))),
                    ),
                );

            if (!tracksToRemove.length) return null;

            const removed = [];

            tracksToRemove.sort((a, b) => b.i - a.i);
            for (const { i } of tracksToRemove) {
                if (this.tracks[i]) {
                    removed.unshift(...this.tracks.splice(i, 1));
                }
            }
            // Log if available
            if (typeof this.queueChanges?.tracksRemoved === "function")
                try {
                    this.queueChanges.tracksRemoved(
                        this.guildId,
                        removed,
                        tracksToRemove.map((v) => v.i),
                        oldStored,
                        this.utils.toJSON(),
                    );
                } catch {
                    /* */
                }

            await this.utils.save();

            return { removed };
        }
        const toRemove = this.tracks.findIndex(
            (v) =>
                (removeQueryTrack.encoded && removeQueryTrack.encoded === v.encoded) ||
                (removeQueryTrack.info?.identifier && removeQueryTrack.info.identifier === v.info?.identifier) ||
                (removeQueryTrack.info?.uri && removeQueryTrack.info.uri === v.info?.uri) ||
                (removeQueryTrack.info?.title && removeQueryTrack.info.title === v.info?.title) ||
                (removeQueryTrack.info?.isrc && removeQueryTrack.info.isrc === v.info?.isrc) ||
                (removeQueryTrack.info?.artworkUrl && removeQueryTrack.info.artworkUrl === v.info?.artworkUrl),
        );

        if (toRemove < 0) return null;

        const removed = this.tracks.splice(toRemove, 1);
        // Log if available
        if (typeof this.queueChanges?.tracksRemoved === "function")
            try {
                this.queueChanges.tracksRemoved(this.guildId, removed, toRemove, oldStored, this.utils.toJSON());
            } catch {
                /* */
            }

        await this.utils.save();

        return { removed };
    }

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
    public async shiftPrevious() {
        const removed = this.previous.shift();
        if (removed) await this.utils.save();
        return removed ?? null;
    }

    /**
     * Find tracks in the queue matching specific criteria.
     * **This method DOES NOT MUTATE the queue** - it returns a new array without modifying the original queue.
     * @deprecated Use `player.queue.utils.filterTracks()` instead.
     * @param predicate Function to test each track, or an object with criteria to match
     * @returns Array of matching tracks with their indexes
     *
     * @example
     * ```ts
     * // Use the new method instead:
     * const artistTracks = player.queue.utils.filterTracks({ author: "Artist Name" });
     * ```
     */
    public filter(
        predicate:
            | ((track: Track | UnresolvedTrack, index: number) => boolean)
            | {
                title?: string;
                author?: string;
                duration?: number | { min?: number; max?: number };
                uri?: string;
                identifier?: string;
                sourceName?: string;
                isStream?: boolean;
                isSeekable?: boolean;
            },
    ): Array<{ track: Track | UnresolvedTrack; index: number }> {
        return this.utils.filterTracks(predicate);
    }

    /**
     * Find a single track in the queue matching specific criteria.
     * **This method DOES NOT MUTATE the queue** - it searches without modifying the original queue.
     * @deprecated Use `player.queue.utils.findTrack()` instead.
     * @param predicate Function to test each track, or an object with criteria to match
     * @returns First matching track with its index, or null if not found
     *
     * @example
     * ```ts
     * // Use the new method instead:
     * const track = player.queue.utils.findTrack({ author: "Artist Name" });
     * ```
     */
    public find(
        predicate:
            | ((track: Track | UnresolvedTrack, index: number) => boolean)
            | {
                title?: string;
                author?: string;
                duration?: number | { min?: number; max?: number };
                uri?: string;
                identifier?: string;
                sourceName?: string;
                isStream?: boolean;
                isSeekable?: boolean;
            },
    ): { track: Track | UnresolvedTrack; index: number } | null {
        return this.utils.findTrack(predicate);
    }

    /**
     * Sort the queue tracks by a specific property.
     * **⚠️ This method MUTATES the queue** - it modifies the original queue in place.
     * @param sortBy Property to sort by or custom comparator function
     * @param order Sort order: 'asc' or 'desc' (default: 'asc')
     * @returns The queue instance for chaining
     *
     * @example
     * ```ts
     * // Sort by duration (shortest first)
     * await player.queue.sortBy("duration", "asc");
     *
     * // Sort by title alphabetically (Z-A)
     * await player.queue.sortBy("title", "desc");
     *
     * // Custom sorting
     * await player.queue.sortBy((a, b) => {
     *   return a.info.title.localeCompare(b.info.title);
     * });
     * ```
     */
    public async sortBy(
        sortBy: "duration" | "title" | "author" | ((a: Track | UnresolvedTrack, b: Track | UnresolvedTrack) => number),
        order: "asc" | "desc" = "asc",
    ): Promise<this> {
        if (typeof sortBy === "function") {
            this.tracks.sort(sortBy);
        } else {
            this.tracks.sort((a, b) => {
                let comparison = 0;

                switch (sortBy) {
                    case "duration":
                        comparison = (a.info?.duration || 0) - (b.info?.duration || 0);
                        break;
                    case "title":
                        comparison = (a.info?.title || "").localeCompare(b.info?.title || "");
                        break;
                    case "author":
                        comparison = (a.info?.author || "").localeCompare(b.info?.author || "");
                        break;
                    default:
                        return 0;
                }

                return order === "desc" ? -comparison : comparison;
            });
        }

        await this.utils.save();
        return this;
    }

    /**
     * Get a sorted copy of the queue tracks without modifying the original queue.
     * **This method DOES NOT MUTATE the queue** - it returns a new sorted array, similar to `Array.toSorted()`.
     * @param sortBy Property to sort by or custom comparator function
     * @param order Sort order: 'asc' or 'desc' (default: 'asc')
     * @returns A new sorted array of tracks (does not modify the queue)
     *
     * @example
     * ```ts
     * // Get sorted copy by duration (shortest first)
     * const sortedTracks = player.queue.toSortedBy("duration", "asc");
     * // Original queue remains unchanged
     *
     * // Get sorted copy by title alphabetically (Z-A)
     * const sortedByTitle = player.queue.toSortedBy("title", "desc");
     *
     * // Custom sorting
     * const customSorted = player.queue.toSortedBy((a, b) => {
     *   return a.info.title.localeCompare(b.info.title);
     * });
     * ```
     */
    public toSortedBy(
        sortBy: "duration" | "title" | "author" | ((a: Track | UnresolvedTrack, b: Track | UnresolvedTrack) => number),
        order: "asc" | "desc" = "asc",
    ): (Track | UnresolvedTrack)[] {
        const tracksCopy = [...this.tracks];

        if (typeof sortBy === "function") {
            return tracksCopy.sort(sortBy);
        }

        return tracksCopy.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "duration":
                    comparison = (a.info?.duration || 0) - (b.info?.duration || 0);
                    break;
                case "title":
                    comparison = (a.info?.title || "").localeCompare(b.info?.title || "");
                    break;
                case "author":
                    comparison = (a.info?.author || "").localeCompare(b.info?.author || "");
                    break;
                default:
                    return 0;
            }

            return order === "desc" ? -comparison : comparison;
        });
    }

    /**
     * Get a range of tracks from the queue.
     * **This method DOES NOT MUTATE the queue** - it returns a new array slice, similar to `Array.slice()`.
     * @param start Start index (inclusive)
     * @param end End index (exclusive)
     * @returns Array of tracks in the specified range
     *
     * @example
     * ```ts
     * // Get tracks 5-15
     * const tracks = player.queue.getTracks(5, 15);
     *
     * // Get first 10 tracks
     * const firstTen = player.queue.getTracks(0, 10);
     * ```
     */
    public getTracks(start: number, end?: number): (Track | UnresolvedTrack)[] {
        return this.tracks.slice(start, end);
    }
}
