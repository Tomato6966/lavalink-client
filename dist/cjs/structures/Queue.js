"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.DefaultQueueStore = exports.QueueSaver = void 0;
const Utils_1 = require("./Utils");
class QueueSaver {
    constructor(storeManager, options) {
        this._ = storeManager;
        this.options = options;
    }
    async get(guildId) {
        return await this._.parse(await this._.get(guildId));
    }
    async delete(guildId) {
        return await this._.delete(guildId);
    }
    async set(guildId, value) {
        return await this._.set(guildId, await this._.stringify(value));
    }
    async sync(guildId) {
        return await this.get(guildId);
    }
}
exports.QueueSaver = QueueSaver;
class DefaultQueueStore {
    data = new Map();
    constructor() {
    }
    async get(guildId) {
        return await this.data.get(guildId);
    }
    async set(guildId, stringifiedValue) {
        return await this.data.set(guildId, stringifiedValue);
    }
    async delete(guildId) {
        return await this.data.delete(guildId);
    }
    async stringify(value) {
        return value; // JSON.stringify(value);
    }
    async parse(value) {
        return value; // JSON.parse(value)
    }
}
exports.DefaultQueueStore = DefaultQueueStore;
class Queue {
    tracks = [];
    previous = [];
    current = null;
    options = { maxPreviousTracks: 25 };
    guildId = "";
    QueueSaver = null;
    static StaticSymbol = Utils_1.QueueSymbol;
    managerUtils = new Utils_1.ManagerUitls();
    constructor(guildId, data = {}, QueueSaver) {
        this.guildId = guildId;
        this.QueueSaver = QueueSaver;
        this.options.maxPreviousTracks = this.QueueSaver?.options?.maxPreviousTracks ?? this.options.maxPreviousTracks;
        this.current = this.managerUtils.isTrack(data.currentTrack) ? data.currentTrack : null;
        this.previous = Array.isArray(data.previousTracks) && data.previousTracks.some(track => this.managerUtils.isTrack(track)) ? data.previousTracks.filter(track => this.managerUtils.isTrack(track)) : [];
        this.tracks = Array.isArray(data.nextTracks) && data.nextTracks.some(track => this.managerUtils.isTrack(track)) ? data.nextTracks.filter(track => this.managerUtils.isTrack(track)) : [];
        this.utils.sync(false, true);
    }
    /**
     * Utils for a Queue
     */
    utils = {
        /**
         * Save the current cached Queue on the database/server (overides the server)
         */
        save: async () => {
            if (this.previous.length > this.options.maxPreviousTracks)
                this.previous.splice(this.options.maxPreviousTracks, this.previous.length);
            return await this.QueueSaver.set(this.guildId, this.utils.getRaw());
        },
        /**
         * Sync the current queue database/server with the cached one
         * @returns {void}
         */
        sync: async (override = true, dontSyncCurrent = true) => {
            const data = await this.QueueSaver.get(this.guildId);
            if (!data)
                return console.log("No data found to sync for guildId: ", this.guildId);
            if (!dontSyncCurrent && !this.current && this.managerUtils.isTrack(data.currentTrack))
                this.current = data.currentTrack;
            if (Array.isArray(data.nextTracks) && data?.nextTracks.length && data.nextTracks.some(track => this.managerUtils.isTrack(track)))
                this.tracks.splice(override ? 0 : this.tracks.length, override ? this.tracks.length : 0, ...data.nextTracks.filter(track => this.managerUtils.isTrack(track)));
            if (Array.isArray(data.previousTracks) && data?.previousTracks.length && data.previousTracks.some(track => this.managerUtils.isTrack(track)))
                this.previous.splice(0, override ? this.tracks.length : 0, ...data.previousTracks.filter(track => this.managerUtils.isTrack(track)));
            await this.utils.save();
            return;
        },
        destroy: async () => {
            return await this.QueueSaver.delete(this.guildId);
        },
        /**
         * @returns {{currentTrack:Track|null, previousTracks:Track[], nextTracks:Track[]}}The Queue, but in a raw State, which allows easier handling for the storeManager
         */
        getRaw: () => {
            if (this.previous.length > this.options.maxPreviousTracks)
                this.previous.splice(this.options.maxPreviousTracks, this.previous.length);
            return {
                currentTrack: this.current,
                previousTracks: this.previous,
                nextTracks: this.tracks,
            };
        },
        /**
         * Get the Total Duration of the Queue-Songs summed up
         * @returns {number}
         */
        totalDuration: () => {
            return this.tracks.reduce((acc, cur) => acc + (cur.info.duration || 0), this.current?.info.duration || 0);
        },
        /**
         * Shuffles the current Queue, then saves it
         * @returns Amount of Tracks in the Queue
         */
        shuffle: async () => {
            if (this.tracks.length <= 1)
                return this.tracks.length;
            // swap #1 and #2 if only 2 tracks.
            if (this.tracks.length == 2)
                [this[0], this[1]] = [this[1], this[0]];
            else { // randomly swap places.
                for (let i = this.tracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this[i], this[j]] = [this[j], this[i]];
                }
            }
            await this.utils.save();
            return this.tracks.length;
        }
    };
    /**
     * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
     * @param {Track | Track[]} TrackOrTracks
     * @param {number} index At what position to add the Track
     * @returns {number} Queue-Size (for the next Tracks)
     */
    async add(TrackOrTracks, index) {
        if (typeof index === "number" && index >= 0 && index < this.tracks.length)
            return await this.splice(index, 0, ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v)));
        // add the track(s)
        this.tracks.push(...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v)));
        // save the queue
        await this.utils.save();
        // return the amount of the tracks
        return this.tracks.length;
    }
    /**
     * Splice the nextTracks in the Queue
     * @param {number} index Where to remove the Track
     * @param {number} amount How many Tracks to remove?
     * @param {Track | Track[]} TrackOrTracks Want to Add more Tracks?
     * @returns {Track} Spliced Track
     */
    async splice(index, amount, TrackOrTracks) {
        if (!this.tracks.length) {
            if (TrackOrTracks)
                return await this.add(TrackOrTracks);
            return null;
        }
        let spliced = TrackOrTracks ? this.tracks.splice(index, amount, ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v))) : this.tracks.splice(index, amount);
        // save the queue
        await this.utils.save();
        spliced = (Array.isArray(spliced) ? spliced : [spliced]);
        return spliced.length === 1 ? spliced[0] : spliced;
    }
}
exports.Queue = Queue;
