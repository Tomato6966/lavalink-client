import { Client, GatewayIntentBits } from "discord.js";
import { createClient } from 'redis';
import { LavalinkManager } from "../src";
import { BotClient } from "./types/Client";
import { envConfig } from "./config";
import { loadCommands } from "./handler/commandLoader";
import { loadEvents } from "./handler/eventsLoader";
import { loadLavalinkEvents } from "./lavalinkEvents";
import { myCustomStore, myCustomWatcher } from "./Utils/CustomClasses";
import { autoPlayFunction, requesterTransformer } from "./Utils/OptionalFunctions";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
}) as BotClient;


client.redis = createClient({ url: envConfig.redis.url, password: envConfig.redis.password });
client.redis.connect();
client.redis.on("error", (err) => console.log('Redis Client Error', err));

client.defaultVolume = 100;

client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "yourverystrongpassword",
            host: "localhost",
            port: 2333,
            id: "testnode",
            requestTimeout: 10000,
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId, // REQUIRED! (at least after the .init)
        username: "TESTBOT"
    },
    playerOptions: {
        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 50,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
        requesterTransformer: requesterTransformer,
        onDisconnect: {
            autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
            destroyPlayer: false // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, // 0 === instantly destroy | don't provide the option, to don't destroy the player
            autoPlayFunction: autoPlayFunction,
        },
        useUnresolvedData: true
    },
    queueOptions: {
        maxPreviousTracks: 10,
        queueStore: new myCustomStore(client.redis),
        queueChangesWatcher: new myCustomWatcher(client)
    },
});

loadCommands(client);
loadEvents(client);
loadLavalinkEvents(client); 

client.login(envConfig.token);
