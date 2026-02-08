import { QueueChangesWatcher } from "lavalink-client";

import type { BotClient } from "../../types/Client";

// you can make a custom queue watcher for queue logs!
export class myCustomWatcher implements QueueChangesWatcher {
    private client: BotClient;
    constructor(client: BotClient) {
        this.client = client;
    }
    shuffled(guildId, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: Queue got shuffled`);
        console.debug({ oldStoredQueue, newStoredQueue })
    }
    tracksAdd(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
        console.log(
            `${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got added into the Queue at position #${position}`,
        );
        console.debug({ oldStoredQueue, newStoredQueue })
    }
    tracksRemoved(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
        console.log(
            `${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got removed from the Queue at position #${position}`,
        );
        console.debug({ oldStoredQueue, newStoredQueue })
    }
}
