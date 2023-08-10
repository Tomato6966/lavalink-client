import { config } from "dotenv";

config();

export const envConfig = {
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.CLIENT_ID as string,
    redis: {
        url: process.env.REDIS_URL as string,
        password: process.env.REDIS_PASSWORD as string
    },
    devGuild: "1015301715886624778",
    voiceChannelId: "1070626568260562958", 
    textChannelId: "1070645885236695090"
}
