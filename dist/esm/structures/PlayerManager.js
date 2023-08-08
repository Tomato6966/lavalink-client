import { EventEmitter } from "stream";
import { Player } from "./Player";
import { MiniMap } from "./Utils";
export class PlayerManager extends EventEmitter {
    players = new MiniMap();
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
    }
    createPlayer(options) {
        if (this.players.has(options.guildId))
            return this.players.get(options.guildId);
        const newPlayer = new Player(options, this);
        this.players.set(newPlayer.guildId, newPlayer);
        return newPlayer;
    }
    getPlayer(guildId) {
        return this.players.get(guildId);
    }
    deletePlayer(guildId) {
        if (this.players.get(guildId).connected)
            throw new Error("Use Player#destroy() not PlayerManager#deletePlayer() to stop the Player");
        return this.players.delete(guildId);
    }
}
