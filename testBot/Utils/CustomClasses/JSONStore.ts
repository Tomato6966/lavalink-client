import { MiniMap } from "lavalink-client";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

export class JSONStore {
    public data = new MiniMap<string, string>();
    filePath = process.cwd() + "/queueData.json";
    constructor(filePath?: string) {
        this.filePath = filePath || this.filePath;
        this.initLoadData();
    }

    async initLoadData() {
        try { // important to do sync so it's loaded on the initialisation
            this.data = new MiniMap(this.JSONtoMap(readFileSync(this.filePath, "utf-8")));
        } catch (error) {
            await writeFile(this.filePath, this.MapToJSON(this.data));
        }
    }

    private JSONtoMap(json: string): [string, string][] {
        return Object.entries(JSON.parse(json));
    }

    private MapToJSON(map: MiniMap<string, string>) {
        return JSON.stringify(Object.fromEntries(Array.from(map.entries())));
    }

    async get(guildId: string): Promise<any> {
        // return the map cache : )
        return this.data.get(guildId);
    }
    /**
     * Update the cache, and save it
     * @param guildId
     * @param stringifiedQueueData
     */
    async set(guildId: string, stringifiedQueueData: string): Promise<any> {
        this.data.set(guildId, stringifiedQueueData);
        await writeFile(this.filePath, this.MapToJSON(this.data));
    }
    /**
     * Delete the cache, and save it
     * @param guildId
     */
    async delete(guildId: string): Promise<any> {
        this.data.delete(guildId);
        await writeFile(this.filePath, this.MapToJSON(this.data));
    }
}
