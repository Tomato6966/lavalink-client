import { Client, GatewayIntentBits } from "discord.js";
import { createClient } from 'redis';
import { LavalinkManager } from "../src";
import { BotClient, CustomRequester } from "./types/Client";
import { envConfig } from "./config";
import { loadCommands } from "./handler/commandLoader";
import { loadEvents } from "./handler/eventsLoader";
import { loadLavalinkEvents } from "./lavalinkEvents";
import { myCustomStore, myCustomWatcher } from "./Utils/CustomClasses";

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
        clientBasedPositionUpdateInterval: 50,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.75,
        requesterTransformer: (requester:any):CustomRequester => {
            // if it's already the transformed requester
            if(typeof requester === "object" && "avatar" in requester && Object.keys(requester).length === 3) return requester as CustomRequester; 
            // if it's still a discord.js User
            if(typeof requester === "object" && "displayAvatarURL" in requester) { // it's a user
                return {
                    id: requester.id,
                    username: requester.username,
                    avatar: requester.displayAvatarURL(),
                }
            }
            // if it's non of the above
            return { id: requester!.toString(), username: "unknown" }; // reteurn something that makes sense for you!
        },
        onDisconnect: {
            autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
            destroyPlayer: false // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, // 0 === instantly destroy | don't provide the option, to don't destroy the player
            autoPlayFunction: async (player, lastPlayedTrack) => {
                if(lastPlayedTrack.info.sourceName === "spotify") {
                    const filtered = player.queue.previous.filter(v => v.info.sourceName === "spotify").slice(0, 5);
                    const ids = filtered.map(v => v.info.identifier || v.info.uri.split("/")?.reverse()?.[0] || v.info.uri.split("/")?.reverse()?.[1]);
                    if(ids.length >= 2) {
                        const res = await player.search({
                            query: `seed_tracks=${ids.join(",")}`, //`seed_artists=${artistIds.join(",")}&seed_genres=${genre.join(",")}&seed_tracks=${trackIds.join(",")}`;
                            source: "sprec"
                        }, lastPlayedTrack.requester).then(response => {
                            response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
                            return response;
                        }).catch(console.warn);
                        if(res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => { 
                            // transform the track plugininfo so you can figure out if the track is from autoplay or not. 
                            track.pluginInfo.clientData = { ...(track.pluginInfo.clientData||{}), fromAutoplay: true }; 
                            return track;
                        })); else console.log("Spotify - NOTHING GOT ADDED");
                    }
                    return;
                }
                if(lastPlayedTrack.info.sourceName === "youtube" || lastPlayedTrack.info.sourceName === "youtubemusic") {
                    const res = await player.search({
                        query:`https://www.youtube.com/watch?v=${lastPlayedTrack.info.identifier}&list=RD${lastPlayedTrack.info.identifier}`,
                        source: "youtube"
                    }, lastPlayedTrack.requester).then(response => {
                        console.log(response);
                        response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
                        return response;
                    }).catch(console.warn);
                    if(res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => { 
                        // transform the track plugininfo so you can figure out if the track is from autoplay or not. 
                        track.pluginInfo.clientData = { ...(track.pluginInfo.clientData||{}), fromAutoplay: true }; 
                        return track;
                    })); else console.log("YT - NOTHING GOT ADDED");
                    return;
                }
                return
            }
        }
    },
    queueOptions: {
        maxPreviousTracks: 0
    },
    queueStore: new myCustomStore(client.redis),
    queueChangesWatcher: new myCustomWatcher(client)
});

loadCommands(client);
loadEvents(client);
loadLavalinkEvents(client); 

client.login(envConfig.token);
