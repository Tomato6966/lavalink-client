import { readdirSync } from "node:fs";
import { join } from "node:path";
import { BotClient, Command } from "../types/Client";
import { Collection } from "discord.js";
import { pathToFileURL } from "node:url";
import { MiniMap } from "../../src";


export async function loadCommands(client:BotClient) {
    client.commands = new MiniMap();
    const path = join(process.cwd(), "commands");
    const files = readdirSync(path).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    for(const file of files) {
        const filePath = join(path, file)
        const cmd = await import(filePath).then(v => v.default) as Command;
        if("data" in cmd && "execute" in cmd) {
            client.commands.set(cmd.data.name, cmd);
        } else {
            console.warn(`[WARNING] The Command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}