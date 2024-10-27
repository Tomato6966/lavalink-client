import { config } from "dotenv";

config();

export const envConfig = {
	token: process.env.DISCORD_TOKEN as string,
	clientId: process.env.CLIENT_ID as string,
	redis: {
		url: process.env.REDIS_URL as string,
		password: process.env.REDIS_PASSWORD as string,
	},
	useJSONStore: !process.env.REDIS_URL,
	devGuild: "1180208273958375524",
	voiceChannelId: "1180208281407463448",
	textChannelId: "1192771980513005598",
};
