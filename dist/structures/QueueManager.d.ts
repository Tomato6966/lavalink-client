/// <reference types="node" />
import { EventEmitter } from "stream";
import { LavalinkManager } from "./LavalinkManager";
import { Queue } from "./Queue";
interface QueueManagerEvents {
    /**
     * Emitted when a Queue is created.
     * @event Manager.playerManager#create
     */
    "create": (queue: Queue) => void;
}
export interface QueueManager {
    on<U extends keyof QueueManagerEvents>(event: U, listener: QueueManagerEvents[U]): this;
    emit<U extends keyof QueueManagerEvents>(event: U, ...args: Parameters<QueueManagerEvents[U]>): boolean;
    /** @private */
    queues: QueueSaver;
    /** @private */
    LavalinkManager: LavalinkManager;
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
export declare class QueueManager extends EventEmitter {
    constructor(LavalinkManager: LavalinkManager);
    /**
     * Generate a base Empty Queue, for easier use
     * @param guildId
     * @returns
     */
    private generateEmptyQueue;
    /**
     * Get a Queue of a Guild
     * @param guildId
     * @returns
     */
    getQueue(guildId: string): Promise<Queue>;
    /**
     * Delete a Queue
     * @param guildId
     * @returns
     */
    private deleteQueue;
}
export {};
