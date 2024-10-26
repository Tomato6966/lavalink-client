import { Events } from 'discord.js';
import type { Event } from '../types/Client';

export default {
	name: Events.Raw,
	execute: async (client, d) => {
		client.lavalink.sendRawData(d); // VERY IMPORTANT!
	},
} as Event;
