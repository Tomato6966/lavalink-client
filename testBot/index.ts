import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { LavalinkManager } from "lavalink-client";

config();
const envConfig = {
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.CLIENT_ID as string,
    voiceChannelId: "1070626568260562958", textChannelId: "1070645885236695090"
}

async function LavalinkClientEvents() {
    /**
     * NODE EVENTS
     */
    client.musicManager.nodeManager.on("raw", (node, payload) => {
        //console.log(node.id, " :: RAW :: ", payload);
    }).on("disconnect", (node, reason) => {
        console.log(node.id, " :: DISCONNECT :: ", reason);
    }).on("connect", (node) => {
        console.log(node.id, " :: CONNECTED :: ");
        testPlay(); // TEST THE MUSIC ONCE CONNECTED TO THE BOT
    }).on("reconnecting", (node) => {
        console.log(node.id, " :: RECONNECTING :: ");
    }).on("create", (node) => {
        console.log(node.id, " :: CREATED :: ");
    }).on("destroy", (node) => {
        console.log(node.id, " :: DESTROYED :: ");
    }).on("error", (node, error, payload) => {
        console.log(node.id, " :: ERRORED :: ", error, " :: PAYLOAD :: ", payload);
    });

    /**
     * PLAYER EVENTS
     */
    client.musicManager.playerManager.on("trackStart", (player, track) => {
        console.log(player.guildId, " :: Started Playing :: ", track.info.title)
    });
}

async function testPlay() {
    await delay(150); // SHORT DELAY
    if(!client.musicManager.useable) return console.log("NOT USEABLE ATM!");
    const testGuild = client.guilds.cache.get("1070626568260562954")!;

    const player = await client.musicManager.playerManager.createPlayer({
        guildId: testGuild.id, voiceChannelId: envConfig.voiceChannelId, textChannelId: envConfig.textChannelId, // in what guild + channel(s)
        selfDeaf: true, selfMute: false, volume: 100 // configuration(s)
    });

    await player.connect();

    const res = await player.search({
        query: `Elton John`,
    }, client.user);

    await player.queue.add(res.tracks);

    await player.play({
        endTime: 30000,
        position: 25000,
    });
}


const delay = async (ms) => new Promise(r => setTimeout(() => r(true), ms));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
}) as Client & { musicManager: LavalinkManager };

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
        defaultSearchPlatform: "dzsearch",
        volumeDecrementer: 0.7
    },
    queueOptions: {
        maxPreviousTracks: 5
    }
});
// register the lavalink Client Event(s)
LavalinkClientEvents(); 

client.on("raw", d => { 
    // VERY IMPORTANT!
    client.musicManager.updateVoiceState(d); 
})
client.on("ready", async () => {
    console.log("Discord Bot is ready to be Used!");
    //VERY IMPORTANT!
    await client.musicManager.init({ ...client.user!, shards: "auto" }); 
});

client.login(process.env.DISCORD_TOKEN);