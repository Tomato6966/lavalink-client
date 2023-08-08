"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavalinkManager = void 0;
const events_1 = require("events");
const NodeManager_1 = require("./NodeManager");
const Queue_1 = require("./Queue");
const Utils_1 = require("./Utils");
const LavalinkManagerStatics_1 = require("./LavalinkManagerStatics");
const Player_1 = require("./Player");
class LavalinkManager extends events_1.EventEmitter {
    static DEFAULT_SOURCES = LavalinkManagerStatics_1.DEFAULT_SOURCES;
    static REGEXES = LavalinkManagerStatics_1.REGEXES;
    initiated = false;
    players = new Utils_1.MiniMap();
    constructor(options) {
        super();
        this.options = {
            autoSkip: true,
            ...options
        };
        this.initiated = false;
        if (!this.options.playerOptions.defaultSearchPlatform)
            this.options.playerOptions.defaultSearchPlatform = "ytsearch";
        if (!this.options.queueOptions.maxPreviousTracks || this.options.queueOptions.maxPreviousTracks <= 0)
            this.options.queueOptions.maxPreviousTracks = 25;
        if (options.queueStore) {
            const keys = Object.keys(options.queueStore);
            const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
            if (!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options.queueStore[v] === "function"))
                throw new SyntaxError(`The provided QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
        }
        else
            this.options.queueStore = new Queue_1.DefaultQueueStore();
        this.nodeManager = new NodeManager_1.NodeManager(this);
        this.utilManager = new Utils_1.ManagerUitls(this);
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
    get useable() {
        return this.nodeManager.nodes.filter(v => v.connected).size > 0;
    }
    /**
     * Initiates the Manager.
     * @param clientData
     */
    async init(clientData) {
        if (this.initiated)
            return this;
        this.options.client = { ...(this.options.client || {}), ...clientData };
        if (!this.options.client.id)
            throw new Error('"client.id" is not set. Pass it in Manager#init() or as a option in the constructor.');
        if (typeof this.options.client.id !== "string")
            throw new Error('"client.id" set is not type of "string"');
        let success = 0;
        for (const node of [...this.nodeManager.nodes.values()]) {
            try {
                await node.connect();
                success++;
            }
            catch (err) {
                console.error(err);
                this.nodeManager.emit("error", node, err);
            }
        }
        if (success > 0)
            this.initiated = true;
        else
            console.error("Could not connect to at least 1 Node");
        return this;
    }
    /**
     * Sends voice data to the Lavalink server.
     * @param data
     */
    async updateVoiceState(data) {
        if (!this.initiated)
            return;
        if ("t" in data && !["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t))
            return;
        const update = "d" in data ? data.d : data;
        if (!update || !("token" in update) && !("session_id" in update))
            return;
        const player = this.getPlayer(update.guild_id);
        if (!player)
            return;
        if ("token" in update) {
            if (!player.node?.sessionId)
                throw new Error("Lavalink Node is either not ready or not up to date");
            await player.node.updatePlayer({
                guildId: player.guildId,
                playerOptions: {
                    voice: {
                        token: update.token,
                        endpoint: update.endpoint,
                        sessionId: player.voice?.sessionId,
                    }
                }
            });
            return;
        }
        /* voice state update */
        if (update.user_id !== this.options.client.id)
            return;
        if (update.channel_id) {
            if (player.voiceChannelId !== update.channel_id)
                this.emit("playerMove", player, player.voiceChannelId, update.channel_id);
            player.voice.sessionId = update.session_id;
            player.voiceChannelId = update.channel_id;
        }
        else {
            this.emit("playerDisconnect", player, player.voiceChannelId);
            player.voiceChannelId = null;
            player.voice = Object.assign({});
            await player.pause();
        }
        return;
    }
}
exports.LavalinkManager = LavalinkManager;