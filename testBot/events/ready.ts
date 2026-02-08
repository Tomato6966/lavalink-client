import { Events } from "discord.js";
import type { ApplicationCommandDataResolvable } from "discord.js";

import { envConfig } from "../config";
import type { Event } from "../types/Client";

export default {
    name: Events.ClientReady,
    execute: async (client) => {
        console.log("[Discord Bot] Ready to be used!");
        await client.lavalink.init({ ...client.user!, shards: "auto" }); //VERY IMPORTANT!

        client.guilds.cache
            .get(envConfig.devGuild)
            ?.commands.set(client.commands.map((v) => v.data.toJSON()) as ApplicationCommandDataResolvable[]);
    },
} as Event;
