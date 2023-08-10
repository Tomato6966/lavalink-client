import { ApplicationCommandDataResolvable, Events } from "discord.js";
import { Event } from "../types/Client";
import { envConfig } from "../config";

export default {
    name: Events.ClientReady,
    execute: async (client) => {
        console.log("[Discord Bot] Ready to be used!"); 
        await client.lavalink.init({ ...client.user!, shards: "auto" });  //VERY IMPORTANT!

        client.guilds.cache.get(envConfig.devGuild)?.commands.set(client.commands.map(v => v.data.toJSON()) as ApplicationCommandDataResolvable[])
    }
} as Event;