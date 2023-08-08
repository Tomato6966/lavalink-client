import { Events } from "discord.js";
import { Event } from "../types/Client";

export default {
    name: Events.Raw,
    execute: async (client, d) => {
        client.musicManager.updateVoiceState(d);  // VERY IMPORTANT!
    }
} as Event;