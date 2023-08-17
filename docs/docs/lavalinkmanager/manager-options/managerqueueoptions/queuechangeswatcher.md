# QueueChangesWatcher

**Type:** [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class) / [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Object)

Queue Changes Watcher can be used, to log whenever a change in the QUEUE (client sided) is made.

> You can use also use it to sync dashboard actions, if your database does NOT "allow" listeners for database entry changes.

<table><thead><tr><th width="141">Parameter</th><th width="96">Type</th><th width="102" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td></td><td></td><td align="center">✓</td><td></td></tr><tr><td></td><td></td><td align="center">X</td><td></td></tr></tbody></table>

### Interface

```typescript
export interface QueueChangesWatcher {
    /** get a Value (MUST RETURN UNPARSED!) */
    tracksAdd: (guildId:string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue:StoredQueue, newStoredQueue: StoredQueue) => any;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    tracksRemoved: (guildId:string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue:StoredQueue, newStoredQueue: StoredQueue) => any;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    shuffled: (guildId:string, oldStoredQueue:StoredQueue, newStoredQueue: StoredQueue) => any;
}
```

### Example

```typescript
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
```
