# QueueStoreManager

**Type:** [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class) / [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Object)

Please Note, the Queue is always "cached" on the client side, which means it's still quite fast, however, the speed of "saving and syncing" depends on the StoreManager.

Here is a List of External Stores I'd recommend:

* [DragonflyDB ](https://www.dragonflydb.io)(Redis Remake, but for bigger scale and it's quite faster than redis)
* [Redis ](https://redis.io)(Good old Key-Value Database)
* [Memcached](https://memcached.org) (old alternative to Redis)
* [PostgresQL ](https://www.postgresql.org)via [citus-data clusters](https://www.citusdata.com/product/community) (SQL Database for high work-flow)
* [SingleStore](https://www.singlestore.com) (New SQL Database)

## Overview

<table><thead><tr><th width="141">Parameter</th><th width="96">Type</th><th width="100" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td>get</td><td></td><td align="center">✓</td><td></td></tr><tr><td>set</td><td></td><td align="center">✓</td><td></td></tr><tr><td>delete</td><td></td><td align="center">✓</td><td></td></tr><tr><td>stringify</td><td></td><td align="center">✓</td><td></td></tr><tr><td>parse</td><td></td><td align="center">✓</td><td></td></tr></tbody></table>

The interface \`<mark style="color:red;">QueueStoreManager</mark>\` declares, what methods your custom <mark style="color:red;">QueueStore requires</mark>!

```typescript
export interface QueueStoreManager extends Record<string, any>{
  /** @async get a Value (MUST RETURN UNPARSED!) */
  get: (guildId: unknown) => Promise<any>;
  /** @async Set a value inside a guildId (MUST BE UNPARSED) */
  set: (guildId: unknown, value: unknown) => Promise<any>;
  /** @async Delete a Database Value based of it's guildId */
  delete: (guildId: unknown) => Promise<any>;
  /** @async Transform the value(s) inside of the QueueStoreManager (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
  stringify: (value: unknown) => Promise<any>;
  /** @async Parse the saved value back to the Queue (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
  parse: (value: unknown) => Promise<Partial<StoredQueue>>;
}
```

## Examples:

* [Default one (MiniMap)](queuestoremanager.md#example-queue-store-manager)
* [External one (Redis)](queuestoremanager.md#example-for-redis)

### Example Queue Store Manager:

> This is also the Default Queue Store, which you can import from lavalink-client!

```typescript
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

```

### Example for Redis:

```typescript
export class myCustomStore implements QueueStoreManager {
    private redis:RedisClientType;
    constructor(redisClient:RedisClientType) {
        this.redis = redisClient;
    }
    async get(guildId): Promise<any> {
        return await this.redis.get(guildId);
    }
    async set(guildId, stringifiedQueueData): Promise<any> {
        // await this.delete(guildId); // some redis versions (especially on hset) requires you to delete it first;
        return await this.redis.set(guildId, stringifiedQueueData);
    }
    async delete(guildId): Promise<any> {
        return await this.redis.del(guildId);
    }
    async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
        return JSON.parse(stringifiedQueueData);
    }
    async stringify(parsedQueueData): Promise<any> {
        return JSON.stringify(parsedQueueData);
    }
}
```
