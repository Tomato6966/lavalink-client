"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
const stream_1 = require("stream");
const Player_1 = require("./Player");
const Utils_1 = require("./Utils");
class PlayerManager extends stream_1.EventEmitter {
    players = new Utils_1.MiniMap();
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
    }
    createPlayer(options) {
        if (this.players.has(options.guildId))
            return this.players.get(options.guildId);
        const newPlayer = new Player_1.Player(options, this);
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
exports.PlayerManager = PlayerManager;
