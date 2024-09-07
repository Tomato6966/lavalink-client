import { Client, GatewayIntentBits } from "discord.js";
import { createClient } from "redis";

import { LavalinkManager, MiniMap, parseLavalinkConnUrl } from "../src";
import { envConfig } from "./config";
import { loadCommands } from "./handler/commandLoader";
import { loadEvents } from "./handler/eventsLoader";
import { loadLavalinkEvents } from "./lavalinkEvents";
import { BotClient } from "./types/Client";
import { JSONStore, myCustomStore, myCustomWatcher, PlayerSaver } from "./Utils/CustomClasses";
import { handleResuming } from "./Utils/handleResuming";
import { autoPlayFunction, requesterTransformer } from "./Utils/OptionalFunctions";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
}) as BotClient;

if(envConfig.redis.url && 1 < 0) { // little invalid if statement so the redis doesn't happen for testing purposes
    client.redis = createClient({ url: envConfig.redis.url, password: envConfig.redis.password });
    client.redis.connect(); // @ts-ignore
    client.redis.on("error", (err) => console.log('Redis Client Error', err));
} else if(envConfig.useJSONStore) {
    client.redis = new JSONStore();
} else client.redis = new MiniMap<string, string>();

client.defaultVolume = 100;

/**
 * ? In case you wanna provide node data via env, you can use the provided util for url parsing:
 * * Example for multiple Nodes Secure in ENV.
 * * URL-Pattern: lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>
 * !   Important PW + ID must be encoded.
 * !   "verySpecialPassword#1" -> "verySpecialPassword%231"
 *       (   do it in nodejs via: encodeURIComponent("verySpecialPassword#1")   )
 *          you can also use this website to encode your password: https://www.url-encode-decode.com/
*/
const LavalinkNodesOfEnv = process.env.LAVALINKNODES?.split(" ").filter(v => v.length).map(url => parseLavalinkConnUrl(url));
console.log(LavalinkNodesOfEnv); // you can then provide the result of here in LavalinkManagerOptions#nodes, or transform the result for further data.


(async () => {
    // Player saver util class for saving the player data
    const playerSaver = new PlayerSaver();
    const nodeSessions = await playerSaver.getAllLastNodeSessions();

    client.lavalink = new LavalinkManager({
        nodes: [
            {
                authorization: "chrissy_localhost",
                host: "localhost",
                port: 2333,
                id: "testnode",
                sessionId: nodeSessions.get("testnode"),
                // or add it manually like this:
                // sessionId: "lsvunq8h8bxx0m9w", // add the sessionId in order to resume the session for the node, and then to recover the players listen to nodeManager#resumed.
                requestSignalTimeoutMS: 3000,
                closeOnError: true,
                heartBeatInterval: 30_000,
                enablePingOnStatsCheck: true,
                retryDelay: 10e3,
                secure: false,
                retryAmount: 5,
            }
        ],
        sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
        autoSkip: true,
        client: { // client: client.user
            id: envConfig.clientId, // REQUIRED! (at least after the .init)
            username: "TESTBOT"
        },
        playerOptions: {
            applyVolumeAsFilter: false,
            clientBasedPositionUpdateInterval: 50, // in ms to up-calc player.position
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
        linksBlacklist: [],
        linksWhitelist: [],
        advancedOptions: {
            maxFilterFixDuration: 600_000, // only allow instafixfilterupdate for tracks sub 10mins
            debugOptions: {
                noAudio: true,
                playerDestroy: {
                    dontThrowError: true,
                    debugLog: true
                }
            }
        }
    });

    // all what you need to do to enable resuming
    handleResuming(client, playerSaver);

    loadCommands(client);
    loadEvents(client);
    loadLavalinkEvents(client);

    client.login(envConfig.token);

})();
