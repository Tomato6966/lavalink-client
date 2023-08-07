import { EventEmitter } from "stream";
import { LavalinkManager } from "./LavalinkManager";
import { Queue } from "./Queue";
import { Track } from "./Track";


interface QueueManagerEvents {
    /**
     * Emitted when a Queue is created.
     * @event Manager.playerManager#create
     */
    "create": (queue:Queue) => void;
    
}
export interface QueueManager {
    on<U extends keyof QueueManagerEvents>(event: U, listener: QueueManagerEvents[U]): this;

    emit<U extends keyof QueueManagerEvents>(event: U, ...args: Parameters<QueueManagerEvents[U]>): boolean;
    /** @private */
    queues: QueueSaver;
    /** @private */
    LavalinkManager: LavalinkManager;
}

export interface StoreManager extends Record<any,any> {
    /** @async get a Value */
    get: (key:unknown) => any;
    /** @async Set a value inside a key */
    set: (key:unknown, value:unknown) => any;
    /** @async Delete a Database Value based of it's key */ 
    delete: (key: unknown) => any;
    /** @async Transform the value(s) inside of the StoreManager */
    stringify: (value:unknown) => any;
    /** @async Parse the saved value back to the Queue */
    parse: (value:unknown) => Queue;
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
export class QueueSaver {
    constructor(storeManager: StoreManager, options: QueueSaverOptions) {
        this._ = storeManager;
        this.options = options;
    }
    async get(key:string) {
        return new Queue(await this._.parse(await this._.get(key)), key, this);
    }
    async delete(key:string) {
        return await this._.delete(key);
    }
    async set(key:string, value:any) {
        return await this._.set(key, await this._.stringify(value));
    }
}

export class DefaultQueueStore {
    private data = new Map();
    constructor() {
    }
    get(key) {
        return this.data.get(key);
    }
    set(key, value) {
        return this.data.set(key, value)
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

export class QueueManager extends EventEmitter {
    constructor(LavalinkManager:LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager; 
        this.queues = new QueueSaver(this.LavalinkManager.options.queueStore || new DefaultQueueStore(), this.LavalinkManager.options.queueOptions);
    }

    /**
     * Generate a base Empty Queue, for easier use
     * @param guildId 
     * @returns 
     */
    private generateEmptyQueue(guildId:string) {
        return new Queue({}, guildId, this.queues);
    }

    /**
     * Get a Queue of a Guild
     * @param guildId 
     * @returns 
     */
    async getQueue(guildId:string) {
        return await this.queues.get(guildId) || this.generateEmptyQueue(guildId);
    }

    /**
     * Delete a Queue
     * @param guildId 
     * @returns 
     */
    private async deleteQueue(guildId:string) {
        return await this.queues.delete(guildId);
    }
}