import { LavalinkManager, PlayerJson } from "lavalink-client";

import { JSONStore } from "./JSONStore";

export class PlayerSaver extends JSONStore {
    constructor() {
        super(process.cwd() + "/playerData.json");
    }
    /**
     * Listen to the playerUpdate event and save the player data to the json file
     * @param lavalink
     */
    listenToEvents(lavalink: LavalinkManager) {
        lavalink.on("playerUpdate", (oldPlayer, newPlayer) => {
            const newPlayerData = newPlayer.toJSON();
            // we only save the data if anything changes of what we need later on
            if (
                !oldPlayer ||
                oldPlayer.voiceChannelId !== newPlayerData.voiceChannelId ||
                oldPlayer.textChannelId !== newPlayerData.textChannelId ||
                oldPlayer.options.selfDeaf !== newPlayerData.options.selfDeaf ||
                oldPlayer.options.selfMute !== newPlayerData.options.selfDeaf ||
                oldPlayer.nodeId !== newPlayerData.nodeId ||
                oldPlayer.nodeSessionId !== newPlayerData.nodeSessionId ||
                oldPlayer.options.applyVolumeAsFilter !== newPlayerData.options.applyVolumeAsFilter ||
                oldPlayer.options.instaUpdateFiltersFix !== newPlayerData.options.instaUpdateFiltersFix ||
                oldPlayer.options.vcRegion !== newPlayerData.options.vcRegion
            ) {
                this.set(newPlayer.guildId, JSON.stringify(newPlayerData));
            }
        });
    }
    async getAllLastNodeSessions() {
        try {
            const datas = Array.from(this.data.values());
            const sessionIds = new Map();
            for (const theData of datas) {
                const json = JSON.parse(theData);
                if (json.nodeSessionId && json.nodeId) sessionIds.set(json.nodeId, json.nodeSessionId);
            }
            return sessionIds;
        } catch {
            return new Map();
        }
    }
    async getPlayer(guildId: string) {
        const data = await this.get(guildId);
        return data ? (JSON.parse(data) as PlayerJson) : null;
    }
    async delPlayer(guildId: string) {
        await this.delete(guildId);
    }
}
