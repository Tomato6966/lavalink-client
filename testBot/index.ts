import { Client, GatewayIntentBits } from "discord.js";
import { createClient, RedisClientType } from 'redis';
import { DefaultQueueStore, LavalinkManager, StoredQueue } from "../src";
import { BotClient } from "./types/Client";
import { envConfig } from "./config";
import { loadCommands } from "./handler/commandLoader";
import { loadEvents } from "./handler/eventsLoader";
import { loadLavalinkEvents } from "./lavalinkEvents";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
}) as BotClient;

class myCustomStore extends DefaultQueueStore {
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

client.redis = createClient({ url: envConfig.redis.url, password: envConfig.redis.password });
client.redis.connect();
client.redis.on("error", (err) => console.log('Redis Client Error', err));

client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "milrato_pass_2333",
            host: "localhost",
            port: 2333,
            id: "testnode",
            requestTimeout: 10000,
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId,
        username: "TESTBOT",
        shards: "auto"
    },
    playerOptions: {
        applyVolumeAsFilter: false,
        clientBasedUpdateInterval: 50,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.7
    },
    queueOptions: {
        maxPreviousTracks: 0
    },
    queueStore: new myCustomStore(client.redis)
});

loadCommands(client);
loadEvents(client);
loadLavalinkEvents(client); 

client.login(envConfig.token);