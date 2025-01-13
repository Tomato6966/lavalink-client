import { envConfig } from "../config";
import { BotClient } from "../types/Client";
import { delay } from "./Time";

// this function allows you to test playing just from pre-defined functions on the most basic behaviour
export async function testPlay(client: BotClient) {
    await delay(150); // SHORT DELAY
    if (!client.lavalink.useable) return console.log("NOT USEABLE ATM!");
    const testGuild = client.guilds.cache.get("1070626568260562954")!;

    // 0. create a player
    const player = await client.lavalink.createPlayer({
        guildId: testGuild.id, // in which guild the voice channel is in.

        voiceChannelId: envConfig.voiceChannelId, // which voice channel the bot should join REQUIRED!

        textChannelId: envConfig.textChannelId, // which text channel id should be saved on the player so you can send messages to OPTIONAL!

        selfDeaf: true, // if true then the bot will be deafend (headphones next to username in vc)

        selfMute: false, // if true then no audio will come from the player

        volume: 100, // the volume which the player should have on creation

        applyVolumeAsFilter: false, // on default it's false, if set to true, then setVolume will trigger filterManager.setVolumeFilter instead

        instaUpdateFiltersFix: true, // will apply a seek after applying a filter so that they get applied instantly

        // those are very specific behaviors, only provide if you know what you're doing
        // node: "<id>",
        // vcRegion: "voicechannel.rtcRegion"
    });

    // 1. connect to the voice
    await player.connect();

    // 2. use the player to search a track by user
    const res = await player.search({ query: `Elton John` }, client.user);

    // 3. add the wished track(s) to the queue, it can be an array or just a single track
    await player.queue.add(res.tracks.slice(0, 25));

    // play the track
    await player.play();
}
