import { EventEmitter } from "stream";
import { Player } from "./Player";
export class PlayerManager extends EventEmitter {
    players;
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
        return this.players.delete(guildId);
    }
}
