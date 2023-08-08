import { envConfig } from "../config";
import { BotClient } from "../types/Client";
import { delay } from "./Time";

export async function testPlay(client:BotClient) {
    await delay(150); // SHORT DELAY
    if(!client.lavalink.useable) return console.log("NOT USEABLE ATM!");
    const testGuild = client.guilds.cache.get("1070626568260562954")!;

    const player = await client.lavalink.createPlayer({
        guildId: testGuild.id, voiceChannelId: envConfig.voiceChannelId, textChannelId: envConfig.textChannelId, // in what guild + channel(s)
        selfDeaf: true, selfMute: false, volume: 100 // configuration(s)
    });

    await player.connect();

    const res = await player.search({
        query: `Elton John`,
    }, client.user);

    await player.queue.add(res.tracks.slice(0, 25));

    await player.play({
        endTime: 30000,
        position: 25000,
    });
}