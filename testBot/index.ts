import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { LavalinkManager } from "./src";
import { BotClient } from "./types/Client";
import { envConfig } from "./config";
import { loadCommands } from "./handler/commandLoader";
import { loadEvents } from "./handler/eventsLoader";
import { loadLavalinkEvents } from "./lavalinkEvents";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
}) as BotClient;

client.musicManager = new LavalinkManager({
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
        maxPreviousTracks: 5
    }
});

loadCommands(client);
loadEvents(client);
loadLavalinkEvents(client); 

client.login(process.env.DISCORD_TOKEN);