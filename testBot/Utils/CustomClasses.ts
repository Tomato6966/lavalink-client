import { RedisClientType } from "redis";
import { QueueChangesWatcher, QueueStoreManager, StoredQueue } from "../../src";
import { BotClient } from "../types/Client";

export class myCustomStore implements QueueStoreManager {
    private redis:RedisClientType;
    constructor(redisClient:RedisClientType) {
        this.redis = redisClient;
    }
    async get(guildId): Promise<any> {
        return await this.redis.get(this.id(guildId));
    }
    async set(guildId, stringifiedQueueData): Promise<any> {
        // await this.delete(guildId); // redis requires you to delete it first;
        return await this.redis.set(this.id(guildId), stringifiedQueueData);
    }
    async delete(guildId): Promise<any> {
        return await this.redis.del(this.id(guildId));
    }
    async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
        return JSON.parse(stringifiedQueueData);
    }
    async stringify(parsedQueueData): Promise<any> {
        return JSON.stringify(parsedQueueData);
    }
    // you can add more utils if you need to...
    private id(guildId) {
        return `lavalinkqueue_${guildId}`; // transform the id
    }
}

// you can make a custom queue watcher for queue logs!
export class myCustomWatcher implements QueueChangesWatcher {
    private client:BotClient;
    constructor(client:BotClient) {
        this.client = client;
    }
    shuffled(guildId, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: Queue got shuffled`)    
    }
    tracksAdd(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got added into the Queue at position #${position}`);    
    }
    tracksRemoved(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got removed from the Queue at position #${position}`);
    }
}