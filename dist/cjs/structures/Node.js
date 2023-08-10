"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavalinkNode = void 0;
const tslib_1 = require("tslib");
const ws_1 = tslib_1.__importDefault(require("ws"));
const undici_1 = require("undici");
const Utils_1 = require("./Utils");
const path_1 = require("path");
class LavalinkNode {
    socket = null;
    rest;
    options;
    /** The amount of rest calls the node has made. */
    calls = 0;
    stats = {
        players: 0,
        playingPlayers: 0,
        cpu: {
            cores: 0,
            lavalinkLoad: 0,
            systemLoad: 0
        },
        memory: {
            allocated: 0,
            free: 0,
            reservable: 0,
            used: 0,
        },
        uptime: 0,
        frameStats: {
            deficit: 0,
            nulled: 0,
            sent: 0,
        }
    };
    NodeManager = null;
    reconnectTimeout = undefined;
    reconnectAttempts = 1;
    sessionId = null;
    info = null;
    version = "v4";
    constructor(options, manager) {
        this.options = {
            secure: false,
            retryAmount: 5,
            retryDelay: 30e3,
            requestTimeout: 10e3,
            ...options
        };
        this.NodeManager = manager;
        this.validate();
        if (this.options.secure && this.options.port !== 443)
            throw new SyntaxError("If secure is true, then the port must be 443");
        this.rest = new undici_1.Pool(this.poolAddress, this.options.poolOptions);
        this.options.regions = (this.options.regions || []).map(a => a.toLowerCase());
    }
    validate() {
        if (!this.options.authorization)
            throw new SyntaxError("LavalinkNode requires 'authorization'");
        if (!this.options.host)
            throw new SyntaxError("LavalinkNode requires 'host'");
        if (!this.options.port)
            throw new SyntaxError("LavalinkNode requires 'port'");
    }
    /**
     * Makes an API call to the Node
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     */
    async makeRequest(endpoint, modify, parseAsText = false) {
        const options = {
            path: `/${this.version}/${endpoint.replace(/^\//gm, "")}`,
            method: "GET",
            headers: {
                Authorization: this.options.authorization
            },
            headersTimeout: this.options.requestTimeout,
        };
        modify?.(options);
        const url = new URL(`${this.poolAddress}${options.path}`);
        url.searchParams.append("trace", "true");
        options.path = url.toString().replace(this.poolAddress, "");
        const request = await this.rest.request(options);
        this.calls++;
        if (options.method === "DELETE")
            return;
        return parseAsText ? await request.body.text() : await request.body.json();
    }
    async updatePlayer(data) {
        if (!this.sessionId)
            throw new Error("The Lavalink Node is either not ready, or not up to date!");
        this.syncPlayerData(data);
        const res = await this.makeRequest(`/sessions/${this.sessionId}/players/${data.guildId}`, r => {
            r.method = "PATCH";
            r.headers = { Authorization: this.options.authorization, "Content-Type": "application/json" };
            if (data.playerOptions.track)
                delete data.playerOptions.track;
            r.body = JSON.stringify(data.playerOptions);
            if (data.noReplace) {
                const url = new URL(`${this.poolAddress}${r.path}`);
                url.searchParams.append("noReplace", data.noReplace?.toString() || "false");
                r.path = url.toString().replace(this.poolAddress, "");
            }
        });
        return this.syncPlayerData({}, res), res;
    }
    /**
     * Decodes the base64 encoded tracks and returns a TrackData array.
     * @param encodedTracks
     */
    async decodeTracks(encodedTracks) {
        const res = await this.makeRequest(`/decodetracks`, r => {
            r.method = "POST";
            r.body = JSON.stringify(encodedTracks);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            r.headers["Content-Type"] = "application/json";
        });
        if (!res)
            throw new Error("No data returned from query.");
        return res;
    }
    /**
     * Decodes the base64 encoded track and returns a TrackData.
     * @param encodedTrack
     */
    async decodeTrack(encodedTrack) {
        const res = await this.decodeTracks([encodedTrack]);
        return res[0];
    }
    syncPlayerData(data, res) {
        if (typeof data === "object" && typeof data?.guildId === "string" && typeof data.playerOptions === "object" && Object.keys(data.playerOptions).length > 1) {
            const player = this.NodeManager.LavalinkManager.getPlayer(data.guildId);
            if (!player)
                return;
            if (typeof data.playerOptions.paused !== "undefined") {
                player.paused = data.playerOptions.paused;
                player.playing = !data.playerOptions.paused;
            }
            if (typeof data.playerOptions.position !== "undefined")
                player.position = data.playerOptions.position;
            if (typeof data.playerOptions.voice !== "undefined")
                player.voice = data.playerOptions.voice;
            if (typeof data.playerOptions.volume !== "undefined") {
                if (this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer) {
                    player.volume = data.playerOptions.volume / this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer;
                    player.lavalinkVolume = data.playerOptions.volume;
                }
                else {
                    player.volume = data.playerOptions.volume;
                    player.lavalinkVolume = data.playerOptions.volume;
                }
            }
            if (typeof data.playerOptions.filters !== "undefined") {
                const oldFilterTimescale = { ...(player.filterManager.data.timescale || {}) };
                Object.freeze(oldFilterTimescale);
                if (data.playerOptions.filters.timescale)
                    player.filterManager.data.timescale = data.playerOptions.filters.timescale;
                if (data.playerOptions.filters.distortion)
                    player.filterManager.data.distortion = data.playerOptions.filters.distortion;
                if (data.playerOptions.filters.echo)
                    player.filterManager.data.echo = data.playerOptions.filters.echo;
                if (data.playerOptions.filters.vibrato)
                    player.filterManager.data.vibrato = data.playerOptions.filters.vibrato;
                if (data.playerOptions.filters.volume)
                    player.filterManager.data.volume = data.playerOptions.filters.volume;
                if (data.playerOptions.filters.equalizer)
                    player.filterManager.data.equalizer = data.playerOptions.filters.equalizer;
                if (data.playerOptions.filters.karaoke)
                    player.filterManager.data.karaoke = data.playerOptions.filters.karaoke;
                if (data.playerOptions.filters.lowPass)
                    player.filterManager.data.lowPass = data.playerOptions.filters.lowPass;
                if (data.playerOptions.filters.rotation)
                    player.filterManager.data.rotation = data.playerOptions.filters.rotation;
                if (data.playerOptions.filters.tremolo)
                    player.filterManager.data.tremolo = data.playerOptions.filters.tremolo;
                player.filterManager.checkFiltersState(oldFilterTimescale);
            }
        }
        // just for res
        if (res?.guildId === "string" && typeof res?.voice !== "undefined") {
            const player = this.NodeManager.LavalinkManager.getPlayer(data.guildId);
            if (!player)
                return;
            if (typeof res?.voice?.connected === "boolean" && res.voice.connected === false)
                return player.destroy();
            player.wsPing = res?.voice?.ping || player?.wsPing;
        }
        return true;
    }
    async destroyPlayer(guildId) {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/sessions/${this.sessionId}/players/${guildId}`, r => { r.method = "DELETE"; });
    }
    connect() {
        if (this.connected)
            return;
        const headers = {
            Authorization: this.options.authorization,
            "Num-Shards": String(this.NodeManager.LavalinkManager.options.client.shards || "auto"),
            "User-Id": this.NodeManager.LavalinkManager.options.client.id,
            "User-Name": this.NodeManager.LavalinkManager.options.client.username || "Lavalink-Client",
        };
        this.socket = new ws_1.default(`ws${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}/v4/websocket`, { headers });
        this.socket.on("open", this.open.bind(this));
        this.socket.on("close", this.close.bind(this));
        this.socket.on("message", this.message.bind(this));
        this.socket.on("error", this.error.bind(this));
    }
    get id() {
        return this.options.id || this.options.host;
    }
    destroy() {
        if (!this.connected)
            return;
        const players = this.NodeManager.LavalinkManager.players.filter(p => p.node.id == this.id);
        if (players)
            players.forEach(p => p.destroy());
        this.socket.close(1000, "destroy");
        this.socket.removeAllListeners();
        this.socket = null;
        this.reconnectAttempts = 1;
        clearTimeout(this.reconnectTimeout);
        this.NodeManager.emit("destroy", this);
        this.NodeManager.nodes.delete(this.id);
        return;
    }
    /** Returns if connected to the Node. */
    get connected() {
        if (!this.socket)
            return false;
        return this.socket.readyState === ws_1.default.OPEN;
    }
    get poolAddress() {
        return `http${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}`;
    }
    async fetchInfo() {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const resInfo = await this.makeRequest(`/info`, r => r.path = `/${this.version}/info`).catch(console.warn) || null;
        return resInfo;
    }
    async fetchVersion() {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const resInfo = await this.makeRequest(`/version`, r => r.path = "/version", true).catch(console.warn) || null;
        return resInfo;
    }
    /**
     * Gets all Players of a Node
     */
    async getPlayers() {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const players = await this.makeRequest(`/sessions/${this.sessionId}/players`);
        if (!Array.isArray(players))
            return [];
        else
            return players;
    }
    /**
     * Gets specific Player Information
     */
    async getPlayer(guildId) {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/sessions/${this.sessionId}/players/${guildId}`);
    }
    /**
     * Updates the session with a resuming key and timeout
     * @param resumingKey
     * @param timeout
     */
    async updateSession(resumingKey, timeout) {
        if (!this.sessionId)
            throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/sessions/${this.sessionId}`, r => {
            r.method = "PATCH";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' };
            r.body = JSON.stringify({ resumingKey, timeout });
        });
    }
    /**
     * Get routplanner Info from Lavalink
     */
    async getRoutePlannerStatus() {
        if (!this.sessionId)
            throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/routeplanner/status`);
    }
    /**
     * Release blacklisted IP address into pool of IPs
     * @param address IP address
     */
    async unmarkFailedAddress(address) {
        if (!this.sessionId)
            throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        await this.makeRequest(`/routeplanner/free/address`, r => {
            r.method = "POST";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' };
            r.body = JSON.stringify({ address });
        });
    }
    /**
     * Release blacklisted IP address into pool of IPs
     * @param address IP address
     */
    async unmarkAllFailedAddresses() {
        if (!this.sessionId)
            throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        await this.makeRequest(`/routeplanner/free/all`, r => {
            r.method = "POST";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' };
        });
    }
    reconnect() {
        this.reconnectTimeout = setTimeout(() => {
            if (this.reconnectAttempts >= this.options.retryAmount) {
                const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`);
                this.NodeManager.emit("error", this, error);
                return this.destroy();
            }
            this.socket.removeAllListeners();
            this.socket = null;
            this.NodeManager.emit("reconnecting", this);
            this.connect();
            this.reconnectAttempts++;
        }, this.options.retryDelay);
    }
    open() {
        if (this.reconnectTimeout)
            clearTimeout(this.reconnectTimeout);
        this.NodeManager.emit("connect", this);
        setTimeout(() => {
            this.fetchInfo().then(x => this.info = x).catch(() => null).then(() => {
                if (!this.info && ["v3", "v4"].includes(this.version)) {
                    const errorString = `Lavalink Node (${this.poolAddress}) does not provide any /${this.version}/info`;
                    throw new Error(errorString);
                }
            });
        }, 1500);
    }
    close(code, reason) {
        this.NodeManager.emit("disconnect", this, { code, reason });
        if (code !== 1000 || reason !== "destroy")
            this.reconnect();
    }
    error(error) {
        if (!error)
            return;
        this.NodeManager.emit("error", this, error);
    }
    async message(d) {
        if (Array.isArray(d))
            d = Buffer.concat(d);
        else if (d instanceof ArrayBuffer)
            d = Buffer.from(d);
        const payload = JSON.parse(d.toString());
        if (!payload.op)
            return;
        this.NodeManager.emit("raw", this, payload);
        switch (payload.op) {
            case "stats":
                delete payload.op;
                this.stats = { ...payload };
                break;
            case "playerUpdate":
                const player = this.NodeManager.LavalinkManager.getPlayer(payload.guildId);
                if (!player)
                    return;
                if (player.get("internal_updateInterval"))
                    clearInterval(player.get("internal_updateInterval"));
                player.position = payload.state.position || 0;
                player.set("internal_lastposition", player.position);
                player.connected = payload.state.connected;
                player.wsPing = payload.state.ping >= 0 ? payload.state.ping : player.wsPing <= 0 && player.connected ? null : player.wsPing || 0;
                if (!player.createdTimeStamp && payload.state.time)
                    player.createdTimeStamp = payload.state.time;
                if (typeof this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval === "number" && this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval >= 10) {
                    player.set("internal_updateInterval", setInterval(() => {
                        player.position += this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval || 250;
                        player.set("internal_lastposition", player.position);
                        if (player.filterManager.filterUpdatedState >= 1) {
                            player.filterManager.filterUpdatedState++;
                            const maxMins = 8;
                            const currentDuration = player.queue.current?.info?.duration || 0;
                            if (currentDuration <= maxMins * 6e4 || (0, path_1.isAbsolute)(player.queue.current?.info?.uri)) {
                                if (player.filterManager.filterUpdatedState >= ((this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval || 250) > 400 ? 2 : 3)) {
                                    player.filterManager.filterUpdatedState = 0;
                                    player.seek(player.position);
                                }
                            }
                            else {
                                player.filterManager.filterUpdatedState = 0;
                            }
                        }
                    }, this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval || 250));
                }
                else {
                    if (player.filterManager.filterUpdatedState >= 1) { // if no interval but instafix available, findable via the "filterUpdatedState" property
                        const maxMins = 8;
                        const currentDuration = player.queue.current?.info?.duration || 0;
                        if (currentDuration <= maxMins * 6e4 || (0, path_1.isAbsolute)(player.queue.current?.info?.uri))
                            player.seek(player.position);
                        player.filterManager.filterUpdatedState = 0;
                    }
                }
                break;
            case "event":
                this.handleEvent(payload);
                break;
            case "ready": // payload: { resumed: false, sessionId: 'ytva350aevn6n9n8', op: 'ready' }
                this.sessionId = payload.sessionId;
                break;
            default:
                this.NodeManager.emit("error", this, new Error(`Unexpected op "${payload.op}" with data`), payload);
                return;
        }
    }
    async handleEvent(payload) {
        if (!payload.guildId)
            return;
        const player = this.NodeManager.LavalinkManager.getPlayer(payload.guildId);
        if (!player)
            return;
        switch (payload.type) {
            case "TrackStartEvent":
                this.trackStart(player, player.queue.current, payload);
                break;
            case "TrackEndEvent":
                this.trackEnd(player, player.queue.current, payload);
                break;
            case "TrackStuckEvent":
                this.trackStuck(player, player.queue.current, payload);
                break;
            case "TrackExceptionEvent":
                this.trackError(player, player.queue.current, payload);
                break;
            case "WebSocketClosedEvent":
                this.socketClosed(player, payload);
                break;
            default:
                this.NodeManager.emit("error", this, new Error(`Node#event unknown event '${payload.type}'.`), payload);
                break;
        }
        return;
    }
    trackStart(player, track, payload) {
        player.playing = true;
        player.paused = false;
        return this.NodeManager.LavalinkManager.emit("trackStart", player, track, payload);
    }
    async trackEnd(player, track, payload) {
        // If there are no songs in the queue
        if (!player.queue.tracks.length && player.repeatMode === "off")
            return this.queueEnd(player, track, payload);
        // If a track was forcibly played
        if (payload.reason === "replaced")
            return this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
        // If a track had an error while starting
        if (["loadFailed", "cleanup"].includes(payload.reason)) {
            await (0, Utils_1.queueTrackEnd)(player.queue);
            // if no track available, end queue
            if (!player.queue.current)
                return this.queueEnd(player, track, payload);
            // fire event
            this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
            // play track if autoSkip is true
            return this.NodeManager.LavalinkManager.options.autoSkip && player.play({ track: player.queue.current, noReplace: true });
        }
        // remove tracks from the queue
        if (player.repeatMode !== "track")
            await (0, Utils_1.queueTrackEnd)(player.queue, player.repeatMode === "queue");
        // if no track available, end queue
        if (!player.queue.current)
            return this.queueEnd(player, track, payload);
        // fire event
        this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
        // play track if autoSkip is true
        return this.NodeManager.LavalinkManager.options.autoSkip && player.play({ track: player.queue.current, noReplace: true });
    }
    async queueEnd(player, track, payload) {
        player.queue.current = null;
        player.playing = false;
        if (payload?.reason !== "stopped") {
            await player.queue.utils.save();
            console.log("QUEUE END STOP");
        }
        else
            console.log(payload);
        return this.NodeManager.LavalinkManager.emit("queueEnd", player, track, payload);
    }
    async trackStuck(player, track, payload) {
        this.NodeManager.LavalinkManager.emit("trackStuck", player, track, payload);
        // If there are no songs in the queue
        if (!player.queue.tracks.length && player.repeatMode === "off")
            return;
        // remove the current track, and enqueue the next one
        await (0, Utils_1.queueTrackEnd)(player.queue, player.repeatMode === "queue");
        // if no track available, end queue
        if (!player.queue.current)
            return this.queueEnd(player, track, payload);
        // play track if autoSkip is true
        return (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) && player.play({ track: player.queue.current, noReplace: true });
    }
    async trackError(player, track, payload) {
        this.NodeManager.LavalinkManager.emit("trackError", player, track, payload);
        // remove the current track, and enqueue the next one
        await (0, Utils_1.queueTrackEnd)(player.queue, player.repeatMode === "queue");
        // if no track available, end queue
        if (!player.queue.current)
            return this.queueEnd(player, track, payload);
        // play track if autoSkip is true
        return (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) && player.play({ track: player.queue.current, noReplace: true });
    }
    socketClosed(player, payload) {
        return this.NodeManager.LavalinkManager.emit("playerSocketClosed", player, payload);
    }
}
exports.LavalinkNode = LavalinkNode;
