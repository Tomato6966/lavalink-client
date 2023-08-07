"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = exports.DefaultQueueStore = exports.QueueSaver = void 0;
const stream_1 = require("stream");
const Queue_1 = require("./Queue");
class QueueSaver {
    constructor(storeManager, options) {
        this._ = storeManager;
        this.options = options;
    }
    async get(key) {
        return new Queue_1.Queue(await this._.parse(await this._.get(key)), key, this);
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
class QueueManager extends stream_1.EventEmitter {
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
        this.queues = new QueueSaver(this.LavalinkManager.options.queueStore || new DefaultQueueStore(), this.LavalinkManager.options.queueOptions);
    }
    /**
     * Generate a base Empty Queue, for easier use
     * @param guildId
     * @returns
     */
    generateEmptyQueue(guildId) {
        return new Queue_1.Queue({}, guildId, this.queues);
    }
    /**
     * Get a Queue of a Guild
     * @param guildId
     * @returns
     */
    async getQueue(guildId) {
        return await this.queues.get(guildId) || this.generateEmptyQueue(guildId);
    }
    /**
     * Delete a Queue
     * @param guildId
     * @returns
     */
    async deleteQueue(guildId) {
        return await this.queues.delete(guildId);
    }
}
exports.QueueManager = QueueManager;
