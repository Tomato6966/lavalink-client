import { readdirSync } from "node:fs";
import { join } from "node:path";
import { BotClient, Event } from "../types/Client";

export async function loadEvents(client:BotClient) {
    const path = join(process.cwd(), "events");
    const files = readdirSync(path).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    for(const file of files) {
        const filePath = join(path, file)
        const cmd = await import(filePath).then(v => v.default) as Event;
        if("name" in cmd && "execute" in cmd) {
            client.on(cmd.name, cmd.execute.bind(null, client))
        } else {
            console.warn(`[WARNING] The Event at ${filePath} is missing a required "name" or "execute" property.`)
        }
    }
}