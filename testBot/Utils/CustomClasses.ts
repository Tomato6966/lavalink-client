import { RedisClientType } from "redis";
import { DefaultQueueStore, QueueChangesWatcher, StoredQueue, Track } from "../../src";
import { BotClient } from "../types/Client";

export class myCustomStore extends DefaultQueueStore {
    private redis:RedisClientType;
    constructor(redisClient:RedisClientType) {
        super();
        this.redis = redisClient;
    }
    async get(guildId: any): Promise<any> {
        return await this.redis.get(guildId);
    }
    async set(guildId: any, stringifiedQueueData: any): Promise<any> {
        // await this.delete(guildId); // redis requires you to delete it first;
        return await this.redis.set(guildId, stringifiedQueueData);
    }
    async delete(guildId: any): Promise<any> {
        return await this.redis.del(guildId);
    }
    async parse(stringifiedQueueData: any): Promise<Partial<StoredQueue>> {
        return JSON.parse(stringifiedQueueData);
    }
    async stringify(parsedQueueData: any): Promise<any> {
        return JSON.stringify(parsedQueueData);
    }
}

// you can make a custom queue watcher for queue logs!
export class myCustomWatcher extends QueueChangesWatcher {
    private client:BotClient;
    constructor(client:BotClient) {
        super();
        this.client = client;
    }
    shuffled(guildId: string, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue): void {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: Queue got shuffled`)    
    }
    tracksAdd(guildId: string, tracks: Track[], position: number, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue): void {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got added into the Queue at position #${position}`);    
    }
    tracksRemoved(guildId: string, tracks: Track[], position: number, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue): void {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got removed from the Queue at position #${position}`);
    }
}