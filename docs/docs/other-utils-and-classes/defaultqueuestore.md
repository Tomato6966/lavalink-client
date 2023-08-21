# DefaultQueueStore

The Default Queue Store, stores the queue in-process using [MiniMap](minimap.md), which extends [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Map)\
That's the fastest Store possibility, but not the most flexible one.

Please Note, the Queue is always "cached" on the client side, which means it's still quite fast, however, the speed of "saving and syncing" depends on the StoreManager.

Here is a List of External Stores I'd recommend:

* [DragonflyDB ](https://www.dragonflydb.io)(Redis Remake, but for bigger scale and it's quite faster than redis)
* [Redis ](https://redis.io)(Good old Key-Value Database)
* [Memcached](https://memcached.org) (old alternative to Redis)
* [PostgresQL ](https://www.postgresql.org)via [citus-data clusters](https://www.citusdata.com/product/community) (SQL Database for high work-flow)
* [SingleStore](https://www.singlestore.com) (New SQL Database)

```typescript
import { DefaultQueueStore } from "lavalink-client";
```

```typescript
export class DefaultQueueStore implements QueueStoreManager {
  private data = new MiniMap();
  constructor() {

  }
  async get(guildId) {
    return await this.data.get(guildId);
  }
  async set(guildId, stringifiedValue) {
    return await this.data.set(guildId, stringifiedValue)
  }
  async delete(guildId) {
    return await this.data.delete(guildId);
  }
  async stringify(value) {
    return value; // JSON.stringify(value);
  }
  async parse(value) {
    return value as Partial<StoredQueue>; // JSON.parse(value)
  }
}
```
