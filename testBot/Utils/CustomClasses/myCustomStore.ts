import { MiniMap, QueueStoreManager, StoredQueue } from "lavalink-client";
import { RedisClientType } from "redis";

import type { JSONStore } from "./JSONStore";

export class myCustomStore implements QueueStoreManager {
    private redis: RedisClientType | MiniMap<string, string> | JSONStore;
    constructor(redisClient: RedisClientType | MiniMap<string, string> | JSONStore) {
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
        // fallback for the JSONSTORe and the MINIMAP
        if ("delete" in this.redis) return await this.redis.delete(this.id(guildId));
        return await this.redis.del(this.id(guildId));
    }
    async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
        return typeof stringifiedQueueData === "string"
            ? JSON.parse(stringifiedQueueData)
            : stringifiedQueueData;
    }
    async stringify(parsedQueueData): Promise<any> {
        return typeof parsedQueueData === "object"
            ? JSON.stringify(parsedQueueData)
            : parsedQueueData;
    }
    // you can add more utils if you need to...
    private id(guildId) {
        return `lavalinkqueue_${guildId}`; // transform the id
    }
}
