"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.DefaultQueueStore = exports.QueueSaver = void 0;
class QueueSaver {
    constructor(storeManager, options) {
        this._ = storeManager;
        this.options = options;
    }
    async get(key) {
        return new Queue(await this._.parse(await this._.get(key)), key, this);
    }
    async delete(key) {
        return await this._.delete(key);
    }
    async set(key, value) {
        return await this._.set(key, await this._.stringify(value));
    }
}
exports.QueueSaver = QueueSaver;
class DefaultQueueStore {
    data = new Map();
    constructor() {
    }
    get(key) {
        return this.data.get(key);
    }
    set(key, value) {
        return this.data.set(key, value);
    }
    delete(key) {
        return this.data.delete(key);
    }
    stringify(value) {
        return value;
    }
    parse(value) {
        return value;
    }
}
exports.DefaultQueueStore = DefaultQueueStore;
class Queue {
    _nextTracks = [];
    _previousTracks = [];
    _currentTrack = null;
    _guildId = "";
    _QueueSaver = null;
    constructor(data = {}, guildId, QueueSaver) {
        this._guildId = guildId;
        this._QueueSaver = QueueSaver;
        this._currentTrack = this.isTrack(data.currentTrack) ? data.currentTrack : null;
        this._previousTracks = Array.isArray(data.previousTracks) && data.previousTracks.some(track => this.isTrack(track)) ? data.previousTracks.filter(track => this.isTrack(track)) : [];
        this._nextTracks = Array.isArray(data.nextTracks) && data.nextTracks.some(track => this.isTrack(track)) ? data.nextTracks.filter(track => this.isTrack(track)) : [];
        // TODO bind event Function for trackEnd
    }
    isTrack(data) {
        return typeof data.encodedTrack === "string" && typeof data.info === "object";
    }
    /** The Current Playing Track */
    get currentTrack() {
        return this._currentTrack || null;
    }
    /** All Previous Track(s) [with the limited amount] */
    get previousTracks() {
        return this._previousTracks || [];
    }
    /** All Upcoming Track(s) */
    get nextTracks() {
        return this._nextTracks || [];
    }
    /** The Size of the upcoming Track(s) */
    get size() {
        return this.nextTracks.length;
    }
    /** The Size of the previous Track(s) */
    get previousSize() {
        return this.previousTracks.length;
    }
    /**
     * @returns The Queue, but in a raw State, which allows easier handling for the storeManager
     */
    getRaw() {
        return {
            currentTrack: this.currentTrack,
            previousTracks: this.previousTracks,
            nextTracks: this.nextTracks,
        };
    }
    /**
     * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
     * @param Track
     * @param index At what position to add the Track
     * @returns Queue-Size (for the next Tracks)
     */
    async add(TrackOrTracks, index) {
        if (typeof index === "number")
            return await this.splice(index, 0, TrackOrTracks);
        // add the track(s)
        this._nextTracks.push(...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.isTrack(v)));
        // save the queue
        await this._QueueSaver.set(this._guildId, this.getRaw());
        return this.size;
    }
    /**
     *
     * @param index Where to remove the Track
     * @param amount How many Tracks to remove?
     * @param TrackOrTracks Want to Add more Tracks?
     */
    async splice(index, amount, TrackOrTracks) {
        if (!this.size)
            return null;
        let spliced = TrackOrTracks ? this._nextTracks.splice(index, amount, ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.isTrack(v))) : this._nextTracks.splice(index, amount);
        // save the queue
        await this._QueueSaver.set(this._guildId, this.getRaw());
        spliced = (Array.isArray(spliced) ? spliced : [spliced]);
        return spliced.length === 1 ? spliced[0] : spliced;
    }
    /**
     * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
     * @param Track
     * @returns PreviousTracksSize
     */
    async addPrevious(Track) {
        if (!this.isTrack(Track))
            return;
        this._previousTracks.unshift(Track);
        if (this.previousSize > this._QueueSaver.options.maxPreviousTracks)
            this._previousTracks.pop();
        await this._QueueSaver.set(this._guildId, this.getRaw());
        return this.previousSize;
    }
    /**
     * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
     * @param Track
     * @returns PreviousTracksSize
     */
    async setCurrent(Track) {
        this._currentTrack = Track;
        await this._QueueSaver.set(this._guildId, this.getRaw());
        return this.currentTrack;
    }
    /** @private @hidden */
    async _trackEnd(addBackToQueue = false) {
        if (this.currentTrack) { // if there was a current Track -> Add it
            this._previousTracks.unshift(this.currentTrack);
            if (this.previousSize > this._QueueSaver.options.maxPreviousTracks)
                this._previousTracks.pop();
        }
        // change the current Track to the next upcoming one
        this._currentTrack = this._nextTracks.shift() || null;
        // and if repeatMode == queue, add it back to the queue!
        if (addBackToQueue && this.currentTrack)
            this._nextTracks.push(this.currentTrack);
        // save it in the DB
        await this._QueueSaver.set(this._guildId, this.getRaw());
        // return the new current Track
        return this.currentTrack;
    }
}
exports.Queue = Queue;
