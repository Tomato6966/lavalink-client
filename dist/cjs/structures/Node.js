"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavalinkNode = exports.validSponsorBlocks = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const ws_1 = tslib_1.__importDefault(require("ws"));
const Player_1 = require("./Player");
const Utils_1 = require("./Utils");
exports.validSponsorBlocks = ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "filler"];
class LavalinkNode {
    /** The provided Options of the Node */
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
    sessionId = null;
    /** Wether the node resuming is enabled or not */
    resuming = { enabled: true, timeout: null };
    /** Actual Lavalink Information of the Node */
    info = null;
    /** The Node Manager of this Node */
    NodeManager = null;
    /** The Reconnection Timeout */
    reconnectTimeout = undefined;
    /** The Reconnection Attempt counter */
    reconnectAttempts = 1;
    /** The Socket of the Lavalink */
    socket = null;
    /** Version of what the Lavalink Server should be */
    version = "v4";
    /**
     * Create a new Node
     * @param options Lavalink Node Options
     * @param manager Node Manager
     */
    constructor(options, manager) {
        this.options = {
            secure: false,
            retryAmount: 5,
            retryDelay: 30e3,
            requestSignalTimeoutMS: 10000,
            ...options
        };
        this.NodeManager = manager;
        this.validate();
        if (this.options.secure && this.options.port !== 443)
            throw new SyntaxError("If secure is true, then the port must be 443");
        this.options.regions = (this.options.regions || []).map(a => a.toLowerCase());
        Object.defineProperty(this, Utils_1.NodeSymbol, { configurable: true, value: true });
    }
    /**
     * Raw Request util function
     * @param endpoint endpoint string
     * @param modify modify the request
     * @returns
     */
    async rawRequest(endpoint, modify) {
        const options = {
            path: `/${this.version}/${endpoint.replace(/^\//gm, "")}`,
            method: "GET",
            headers: {
                "Authorization": this.options.authorization
            },
            signal: this.options.requestSignalTimeoutMS && this.options.requestSignalTimeoutMS > 0 ? AbortSignal.timeout(this.options.requestSignalTimeoutMS) : undefined,
        };
        modify?.(options);
        const url = new URL(`${this.restAddress}${options.path}`);
        url.searchParams.append("trace", "true");
        delete options.path;
        const request = await fetch(url.href, options);
        this.calls++;
        return { request, options };
    }
    /**
     * Makes an API call to the Node
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     */
    async request(endpoint, modify, parseAsText = false) {
        const { request, options } = await this.rawRequest(endpoint, modify);
        if (["DELETE", "PUT"].includes(options.method))
            return;
        if (request.status === 404)
            throw new Error(`Node Request resulted into an error, request-PATH: ${options.path} | headers: ${JSON.stringify(request.headers)}`);
        return parseAsText ? await request.text() : await request.json();
    }
    /**
     * Search something raw on the node, please note only add tracks to players of that node
     * @param query SearchQuery Object
     * @param requestUser Request User for creating the player(s)
     * @returns Searchresult
     */
    async search(query, requestUser) {
        const Query = this.NodeManager.LavalinkManager.utils.transformQuery(query);
        this.NodeManager.LavalinkManager.utils.validateQueryString(this, Query.query, Query.source);
        if (Query.source)
            this.NodeManager.LavalinkManager.utils.validateSourceString(this, Query.source);
        if (["bcsearch", "bandcamp"].includes(Query.source) && !this.info.sourceManagers.includes("bandcamp")) {
            throw new Error("Bandcamp Search only works on the player (lavaplayer version < 2.2.0!");
        }
        let uri = `/loadtracks?identifier=`;
        if (/^https?:\/\//.test(Query.query) || ["http", "https", "link", "uri"].includes(Query.source)) { // if it's a link simply encode it
            uri += encodeURIComponent(decodeURIComponent(Query.query));
        }
        else { // if not make a query out of it
            if (Query.source !== "local")
                uri += `${Query.source}:`; // only add the query source string if it's not a local track
            if (Query.source === "ftts")
                uri += `//${encodeURIComponent(encodeURI(decodeURIComponent(Query.query)))}`;
            else
                uri += encodeURIComponent(decodeURIComponent(Query.query));
        }
        const res = await this.request(uri);
        // transform the data which can be Error, Track or Track[] to enfore [Track]
        const resTracks = res.loadType === "playlist" ? res.data?.tracks : res.loadType === "track" ? [res.data] : res.loadType === "search" ? Array.isArray(res.data) ? res.data : [res.data] : [];
        return {
            loadType: res.loadType,
            exception: res.loadType === "error" ? res.data : null,
            pluginInfo: res.pluginInfo || {},
            playlist: res.loadType === "playlist" ? {
                name: res.data.info?.name || res.data.pluginInfo?.name || null,
                title: res.data.info?.name || res.data.pluginInfo?.name || null,
                author: res.data.info?.author || res.data.pluginInfo?.author || null,
                thumbnail: (res.data.info?.artworkUrl) || (res.data.pluginInfo?.artworkUrl) || ((typeof res.data?.info?.selectedTrack !== "number" || res.data?.info?.selectedTrack === -1) ? null : resTracks[res.data?.info?.selectedTrack] ? (resTracks[res.data?.info?.selectedTrack]?.info?.artworkUrl || resTracks[res.data?.info?.selectedTrack]?.info?.pluginInfo?.artworkUrl) : null) || null,
                uri: res.data.info?.url || res.data.info?.uri || res.data.info?.link || res.data.pluginInfo?.url || res.data.pluginInfo?.uri || res.data.pluginInfo?.link || null,
                selectedTrack: typeof res.data?.info?.selectedTrack !== "number" || res.data?.info?.selectedTrack === -1 ? null : resTracks[res.data?.info?.selectedTrack] ? this.NodeManager.LavalinkManager.utils.buildTrack(resTracks[res.data?.info?.selectedTrack], requestUser) : null,
                duration: resTracks.length ? resTracks.reduce((acc, cur) => acc + (cur?.info?.length || 0), 0) : 0,
            } : null,
            tracks: (resTracks.length ? resTracks.map(t => this.NodeManager.LavalinkManager.utils.buildTrack(t, requestUser)) : [])
        };
    }
    async lavaSearch(query, requestUser, throwOnEmpty = false) {
        const Query = this.NodeManager.LavalinkManager.utils.transformLavaSearchQuery(query);
        if (Query.source)
            this.NodeManager.LavalinkManager.utils.validateSourceString(this, Query.source);
        if (/^https?:\/\//.test(Query.query))
            return await this.search({ query: Query.query, source: Query.source }, requestUser);
        if (!["spsearch", "sprec", "amsearch", "dzsearch", "dzisrc", "ytmsearch", "ytsearch"].includes(Query.source))
            throw new SyntaxError(`Query.source must be a source from LavaSrc: "spsearch" | "sprec" | "amsearch" | "dzsearch" | "dzisrc" | "ytmsearch" | "ytsearch"`);
        if (!this.info.plugins.find(v => v.name === "lavasearch-plugin"))
            throw new RangeError(`there is no lavasearch-plugin available in the lavalink node: ${this.id}`);
        if (!this.info.plugins.find(v => v.name === "lavasrc-plugin"))
            throw new RangeError(`there is no lavasrc-plugin available in the lavalink node: ${this.id}`);
        const { request } = await this.rawRequest(`/loadsearch?query=${Query.source ? `${Query.source}:` : ""}${encodeURIComponent(Query.query)}${Query.types?.length ? `&types=${Query.types.join(",")}` : ""}`);
        if (throwOnEmpty === true)
            throw new Error("Nothing found");
        const res = (request.status === 204 ? {} : await request.json());
        return {
            tracks: res.tracks?.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) || [],
            albums: res.albums?.map(v => ({ info: v.info, pluginInfo: v?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            artists: res.artists?.map(v => ({ info: v.info, pluginInfo: v?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            playlists: res.playlists?.map(v => ({ info: v.info, pluginInfo: v?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            texts: res.texts?.map(v => ({ text: v.text, pluginInfo: v?.plugin || v.pluginInfo })) || [],
            pluginInfo: res.pluginInfo || res?.plugin
        };
    }
    /**
     * Update the Player State on the Lavalink Server
     * @param data
     * @returns
     */
    async updatePlayer(data) {
        if (!this.sessionId)
            throw new Error("The Lavalink Node is either not ready, or not up to date!");
        this.syncPlayerData(data);
        const res = await this.request(`/sessions/${this.sessionId}/players/${data.guildId}`, r => {
            r.method = "PATCH";
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            r.headers["Content-Type"] = "application/json";
            r.body = JSON.stringify(data.playerOptions);
            if (data.noReplace) {
                const url = new URL(`${this.restAddress}${r.path}`);
                url.searchParams.append("noReplace", data.noReplace === true && typeof data.noReplace === "boolean" ? "true" : "false");
                r.path = url.pathname + url.search;
            }
        });
        return this.syncPlayerData({}, res), res;
    }
    /**
     * Destroys the Player on the Lavalink Server
     * @param guildId
     * @returns
     */
    async destroyPlayer(guildId) {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.request(`/sessions/${this.sessionId}/players/${guildId}`, r => { r.method = "DELETE"; });
    }
    /**
     * Connect to the Lavalink Node
     * @param sessionId Provide the Session Id of the previous connection, to resume the node and it's player(s)
     * @returns
     */
    connect(sessionId) {
        if (this.connected)
            return;
        const headers = {
            Authorization: this.options.authorization,
            "User-Id": this.NodeManager.LavalinkManager.options.client.id,
            "Client-Name": this.NodeManager.LavalinkManager.options.client.username || "Lavalink-Client",
        };
        if (typeof this.options.sessionId === "string" || typeof sessionId === "string") {
            headers["Session-Id"] = this.options.sessionId || sessionId;
            this.sessionId = this.options.sessionId || sessionId;
        }
        this.socket = new ws_1.default(`ws${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}/v4/websocket`, { headers });
        this.socket.on("open", this.open.bind(this));
        this.socket.on("close", (code, reason) => this.close(code, reason?.toString()));
        this.socket.on("message", this.message.bind(this));
        this.socket.on("error", this.error.bind(this));
    }
    /** Get the id of the node */
    get id() {
        return this.options.id || `${this.options.host}:${this.options.port}`;
    }
    /**
     * Destroys the Node-Connection (Websocket) and all player's of the node
     * @returns
     */
    destroy(destroyReason, deleteNode = true) {
        if (!this.connected)
            return;
        const players = this.NodeManager.LavalinkManager.players.filter(p => p.node.id == this.id);
        if (players)
            players.forEach(p => p.destroy(destroyReason || Player_1.DestroyReasons.NodeDestroy));
        this.socket.close(1000, "Node-Destroy");
        this.socket.removeAllListeners();
        this.socket = null;
        this.reconnectAttempts = 1;
        clearTimeout(this.reconnectTimeout);
        if (deleteNode) {
            this.NodeManager.emit("destroy", this, destroyReason);
            this.NodeManager.nodes.delete(this.id);
        }
        else {
            this.NodeManager.emit("disconnect", this, { code: 1000, reason: destroyReason });
        }
        return;
    }
    /** Returns if connected to the Node. */
    get connected() {
        if (!this.socket)
            return false;
        return this.socket.readyState === ws_1.default.OPEN;
    }
    /**
     * Gets all Players of a Node
     */
    async fetchAllPlayers() {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const players = await this.request(`/sessions/${this.sessionId}/players`);
        if (!Array.isArray(players))
            return [];
        else
            return players;
    }
    /**
     * Gets specific Player Information
     */
    async fetchPlayer(guildId) {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.request(`/sessions/${this.sessionId}/players/${guildId}`);
    }
    /**
     * Updates the session with and enables/disables resuming and timeout
     * @param resuming Whether resuming is enabled for this session or not
     * @param timeout The timeout in seconds (default is 60s)
     */
    async updateSession(resuming, timeout) {
        if (!this.sessionId)
            throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        const data = {};
        if (typeof resuming === "boolean")
            data.resuming = resuming;
        if (typeof timeout === "number" && timeout > 0)
            data.timeout = timeout;
        this.resuming = {
            enabled: typeof resuming === "boolean" ? resuming : false,
            timeout: typeof resuming === "boolean" && resuming === true ? timeout : null,
        };
        return await this.request(`/sessions/${this.sessionId}`, r => {
            r.method = "PATCH";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' };
            r.body = JSON.stringify(data);
        });
    }
    /**
     * Decode Track or Tracks
     */
    decode = {
        /**
         * Decode a single track into its info, where BASE64 is the encoded base64 data.
         * @param encoded
         * @returns
         */
        singleTrack: async (encoded, requester) => {
            if (!encoded)
                throw new SyntaxError("No encoded (Base64 string) was provided");
            // return the decoded + builded track
            return this.NodeManager.LavalinkManager.utils.buildTrack(await this.request(`/decodetrack?encodedTrack=${encoded}`), requester);
        },
        /**
         *
         * @param encodeds Decodes multiple tracks into their info
         * @returns
         */
        multipleTracks: async (encodeds, requester) => {
            if (!Array.isArray(encodeds) || !encodeds.every(v => typeof v === "string" && v.length > 1))
                throw new SyntaxError("You need to provide encodeds, which is an array of base64 strings");
            // return the decoded + builded tracks
            return await this.request(`/decodetracks`, r => {
                r.method = "POST";
                r.body = JSON.stringify(encodeds);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                r.headers["Content-Type"] = "application/json";
            }).then((r) => r.map(track => this.NodeManager.LavalinkManager.utils.buildTrack(track, requester)));
        }
    };
    /**
     * Request Lavalink statistics.
     * @returns
     */
    async fetchStats() {
        return await this.request(`/stats`);
    }
    /**
     * Request Lavalink version.
     * @returns
     */
    async fetchVersion() {
        // need to adjust path for no-prefix version info
        return await this.request(`/version`, r => { r.path = "/version"; }, true);
    }
    /**
     * Request Lavalink information.
     * @returns
     */
    async fetchInfo() {
        return await this.request(`/info`);
    }
    /**
     * Lavalink's Route Planner Api
     */
    routePlannerApi = {
        /**
         * Get routplanner Info from Lavalink
         */
        getStatus: async () => {
            if (!this.sessionId)
                throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            return await this.request(`/routeplanner/status`);
        },
        /**
         * Release blacklisted IP address into pool of IPs
         * @param address IP address
         */
        unmarkFailedAddress: async (address) => {
            if (!this.sessionId)
                throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            await this.request(`/routeplanner/free/address`, r => {
                r.method = "POST";
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                r.headers["Content-Type"] = "application/json";
                r.body = JSON.stringify({ address });
            });
        },
        /**
         * Release all blacklisted IP addresses into pool of IPs
         */
        unmarkAllFailedAddresses: async () => {
            if (!this.sessionId)
                throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            return await this.request(`/routeplanner/free/all`, r => {
                r.method = "POST";
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                r.headers["Content-Type"] = "application/json";
            });
        }
    };
    /** Private Utils */
    validate() {
        if (!this.options.authorization)
            throw new SyntaxError("LavalinkNode requires 'authorization'");
        if (!this.options.host)
            throw new SyntaxError("LavalinkNode requires 'host'");
        if (!this.options.port)
            throw new SyntaxError("LavalinkNode requires 'port'");
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
            if (typeof data.playerOptions.position === "number") {
                player.position = data.playerOptions.position;
                player.lastPosition = data.playerOptions.position;
            }
            if (typeof data.playerOptions.voice !== "undefined")
                player.voice = data.playerOptions.voice;
            if (typeof data.playerOptions.volume !== "undefined") {
                if (this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer) {
                    player.volume = Math.round(data.playerOptions.volume / this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer);
                    player.lavalinkVolume = Math.round(data.playerOptions.volume);
                }
                else {
                    player.volume = Math.round(data.playerOptions.volume);
                    player.lavalinkVolume = Math.round(data.playerOptions.volume);
                }
            }
            if (typeof data.playerOptions.filters !== "undefined") {
                const oldFilterTimescale = { ...(player.filterManager.data.timescale || {}) };
                Object.freeze(oldFilterTimescale);
                if (data.playerOptions.filters.timescale)
                    player.filterManager.data.timescale = data.playerOptions.filters.timescale;
                if (data.playerOptions.filters.distortion)
                    player.filterManager.data.distortion = data.playerOptions.filters.distortion;
                if (data.playerOptions.filters.pluginFilters)
                    player.filterManager.data.pluginFilters = data.playerOptions.filters.pluginFilters;
                if (data.playerOptions.filters.vibrato)
                    player.filterManager.data.vibrato = data.playerOptions.filters.vibrato;
                if (data.playerOptions.filters.volume)
                    player.filterManager.data.volume = data.playerOptions.filters.volume;
                if (data.playerOptions.filters.equalizer)
                    player.filterManager.equalizerBands = data.playerOptions.filters.equalizer;
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
                return player.destroy(Player_1.DestroyReasons.LavalinkNoVoice);
            player.ping.ws = res?.voice?.ping || player?.ping.ws;
        }
        return true;
    }
    get restAddress() {
        return `http${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}`;
    }
    reconnect(instaReconnect = false) {
        if (instaReconnect) {
            if (this.reconnectAttempts >= this.options.retryAmount) {
                const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`);
                this.NodeManager.emit("error", this, error);
                return this.destroy(Player_1.DestroyReasons.NodeReconnectFail);
            }
            this.socket.removeAllListeners();
            this.socket = null;
            this.NodeManager.emit("reconnecting", this);
            this.connect();
            this.reconnectAttempts++;
            return;
        }
        this.reconnectTimeout = setTimeout(() => {
            if (this.reconnectAttempts >= this.options.retryAmount) {
                const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`);
                this.NodeManager.emit("error", this, error);
                return this.destroy(Player_1.DestroyReasons.NodeReconnectFail);
            }
            this.socket.removeAllListeners();
            this.socket = null;
            this.NodeManager.emit("reconnecting", this);
            this.connect();
            this.reconnectAttempts++;
        }, this.options.retryDelay || 1000);
    }
    async open() {
        if (this.reconnectTimeout)
            clearTimeout(this.reconnectTimeout);
        // reset the reconnect attempts amount
        this.reconnectAttempts = 1;
        this.info = await this.fetchInfo().catch((e) => (console.error(e, "ON-OPEN-FETCH"), null));
        if (!this.info && ["v3", "v4"].includes(this.version)) {
            const errorString = `Lavalink Node (${this.restAddress}) does not provide any /${this.version}/info`;
            throw new Error(errorString);
        }
        this.NodeManager.emit("connect", this);
    }
    close(code, reason) {
        this.NodeManager.emit("disconnect", this, { code, reason });
        if (code !== 1000 || reason !== "Node-Destroy")
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
                {
                    const player = this.NodeManager.LavalinkManager.getPlayer(payload.guildId);
                    if (!player)
                        return;
                    const oldPlayer = player?.toJSON();
                    if (player.get("internal_updateInterval"))
                        clearInterval(player.get("internal_updateInterval"));
                    // override the position
                    player.position = payload.state.position || 0;
                    player.lastPosition = payload.state.position || 0;
                    player.connected = payload.state.connected;
                    player.ping.ws = payload.state.ping >= 0 ? payload.state.ping : player.ping.ws <= 0 && player.connected ? null : player.ping.ws || 0;
                    if (!player.createdTimeStamp && payload.state.time)
                        player.createdTimeStamp = payload.state.time;
                    if (typeof this.NodeManager.LavalinkManager.options.playerOptions.clientBasedPositionUpdateInterval === "number" && this.NodeManager.LavalinkManager.options.playerOptions.clientBasedPositionUpdateInterval >= 10) {
                        player.set("internal_updateInterval", setInterval(() => {
                            player.position += this.NodeManager.LavalinkManager.options.playerOptions.clientBasedPositionUpdateInterval || 250;
                            if (player.filterManager.filterUpdatedState >= 1) {
                                player.filterManager.filterUpdatedState++;
                                const maxMins = 8;
                                const currentDuration = player.queue.current?.info?.duration || 0;
                                if (currentDuration <= maxMins * 6e4 || (0, path_1.isAbsolute)(player.queue.current?.info?.uri)) {
                                    if (player.filterManager.filterUpdatedState >= ((this.NodeManager.LavalinkManager.options.playerOptions.clientBasedPositionUpdateInterval || 250) > 400 ? 2 : 3)) {
                                        player.filterManager.filterUpdatedState = 0;
                                        player.seek(player.position);
                                    }
                                }
                                else {
                                    player.filterManager.filterUpdatedState = 0;
                                }
                            }
                        }, this.NodeManager.LavalinkManager.options.playerOptions.clientBasedPositionUpdateInterval || 250));
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
                    this.NodeManager.LavalinkManager.emit("playerUpdate", oldPlayer, player);
                }
                break;
            case "event":
                this.handleEvent(payload);
                break;
            case "ready": // payload: { resumed: false, sessionId: 'ytva350aevn6n9n8', op: 'ready' }
                this.sessionId = payload.sessionId;
                this.resuming.enabled = payload.resumed;
                if (payload.resumed === true) {
                    this.NodeManager.emit("resumed", this, payload, await this.fetchAllPlayers());
                }
                break;
            default:
                this.NodeManager.emit("error", this, new Error(`Unexpected op "${payload.op}" with data`), payload);
                return;
        }
    }
    // LAVALINK EVENT HANDLING UTIL FUNCTION
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
            case "SegmentsLoaded":
                this.SponsorBlockSegmentLoaded(player, player.queue.current, payload);
                break;
            case "SegmentSkipped":
                this.SponsorBlockSegmentkipped(player, player.queue.current, payload);
                break;
            case "ChaptersLoaded":
                this.SponsorBlockChaptersLoaded(player, player.queue.current, payload);
                break;
            case "ChapterStarted":
                this.SponsorBlockChapterStarted(player, player.queue.current, payload);
                break;
            default:
                this.NodeManager.emit("error", this, new Error(`Node#event unknown event '${payload.type}'.`), payload);
                break;
        }
        return;
    }
    // LAVALINK EVENT HANDLING FUNCTIONS
    trackStart(player, track, payload) {
        player.playing = true;
        player.paused = false;
        // don't emit the event if previous track == new track aka track loop
        if (this.NodeManager.LavalinkManager.options?.emitNewSongsOnly === true && player.queue.previous[0]?.info?.identifier === track?.info?.identifier)
            return;
        return this.NodeManager.LavalinkManager.emit("trackStart", player, track, payload);
    }
    async trackEnd(player, track, payload) {
        // If there are no songs in the queue
        if (!player.queue.tracks.length && (player.repeatMode === "off" || player.get("internal_stopPlaying")))
            return this.queueEnd(player, track, payload);
        // If a track was forcibly played
        if (payload.reason === "replaced")
            return this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
        // If a track had an error while starting
        if (["loadFailed", "cleanup"].includes(payload.reason)) {
            await (0, Utils_1.queueTrackEnd)(player);
            // if no track available, end queue
            if (!player.queue.current)
                return this.queueEnd(player, track, payload);
            // fire event
            this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
            // play track if autoSkip is true
            return this.NodeManager.LavalinkManager.options.autoSkip && player.play({ noReplace: true });
        }
        // remove tracks from the queue
        if (player.repeatMode !== "track" || player.get("internal_skipped"))
            await (0, Utils_1.queueTrackEnd)(player);
        else if (player.queue.current) { // If there was a current Track already and repeatmode === true, add it to the queue.
            player.queue.previous.unshift(player.queue.current);
            if (player.queue.previous.length > player.queue.options.maxPreviousTracks)
                player.queue.previous.splice(player.queue.options.maxPreviousTracks, player.queue.previous.length);
            await player.queue.utils.save();
        }
        player.set("internal_skipped", false);
        // if no track available, end queue
        if (!player.queue.current)
            return this.queueEnd(player, track, payload);
        // fire event
        this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
        // play track if autoSkip is true
        return this.NodeManager.LavalinkManager.options.autoSkip && player.play({ noReplace: true });
    }
    async trackStuck(player, track, payload) {
        this.NodeManager.LavalinkManager.emit("trackStuck", player, track, payload);
        // If there are no songs in the queue
        if (!player.queue.tracks.length && (player.repeatMode === "off" || player.get("internal_stopPlaying")))
            return this.queueEnd(player, track, payload);
        // remove the current track, and enqueue the next one
        await (0, Utils_1.queueTrackEnd)(player);
        // if no track available, end queue
        if (!player.queue.current)
            return this.queueEnd(player, track, payload);
        // play track if autoSkip is true
        return (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) && player.play({ noReplace: true });
    }
    async trackError(player, track, payload) {
        this.NodeManager.LavalinkManager.emit("trackError", player, track, payload);
        return; // get's handled by trackEnd
        // If there are no songs in the queue
        if (!player.queue.tracks.length && (player.repeatMode === "off" || player.get("internal_stopPlaying")))
            return this.queueEnd(player, track, payload);
        // remove the current track, and enqueue the next one
        await (0, Utils_1.queueTrackEnd)(player);
        // if no track available, end queue
        if (!player.queue.current)
            return this.queueEnd(player, track, payload);
        // play track if autoSkip is true
        return (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) && player.play({ noReplace: true });
    }
    socketClosed(player, payload) {
        return this.NodeManager.LavalinkManager.emit("playerSocketClosed", player, payload);
    }
    // SPONSOR BLOCK EVENT FUNCTIONS
    SponsorBlockSegmentLoaded(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("SegmentsLoaded", player, track, payload);
    }
    SponsorBlockSegmentkipped(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("SegmentSkipped", player, track, payload);
    }
    SponsorBlockChaptersLoaded(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("ChaptersLoaded", player, track, payload);
    }
    SponsorBlockChapterStarted(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("ChapterStarted", player, track, payload);
    }
    // SPONSOR BLOCK EXECUTE FUNCTIONS
    async getSponsorBlock(player) {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin"))
            throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // do the request
        return await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`);
    }
    async setSponsorBlock(player, segments = ["sponsor", "selfpromo"]) {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin"))
            throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // no segments length
        if (!segments.length)
            throw new RangeError("No Segments provided. Did you ment to use 'deleteSponsorBlock'?");
        // a not valid segment
        if (segments.some(v => !exports.validSponsorBlocks.includes(v.toLowerCase())))
            throw new SyntaxError(`You provided a sponsorblock which isn't valid, valid ones are: ${exports.validSponsorBlocks.map(v => `'${v}'`).join(", ")}`);
        // do the request
        await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`, (r) => {
            r.method = "PUT";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' };
            r.body = JSON.stringify(segments.map(v => v.toLowerCase()));
        });
        return;
    }
    async deleteSponsorBlock(player) {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin"))
            throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // do the request
        await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`, (r) => {
            r.method = "DELETE";
        });
        return;
    }
    // UTIL FOR QUEUE END
    async queueEnd(player, track, payload) {
        // add previous track to the queue!
        player.queue.current = null;
        player.playing = false;
        player.set("internal_stopPlaying", undefined);
        if (typeof this.NodeManager.LavalinkManager.options?.playerOptions?.onEmptyQueue?.autoPlayFunction === "function" && typeof player.get("internal_autoplayStopPlaying") === "undefined") {
            await this.NodeManager.LavalinkManager.options?.playerOptions?.onEmptyQueue?.autoPlayFunction(player, track);
            if (player.queue.tracks.length > 0)
                await (0, Utils_1.queueTrackEnd)(player);
            if (player.queue.current) {
                if (payload.type === "TrackEndEvent")
                    this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
                return player.play({ noReplace: true, paused: false });
            }
        }
        player.set("internal_autoplayStopPlaying", undefined);
        player.queue.previous.unshift(track);
        if (payload?.reason !== "stopped") {
            await player.queue.utils.save();
        }
        if (typeof this.NodeManager.LavalinkManager.options.playerOptions?.onEmptyQueue?.destroyAfterMs === "number" && !isNaN(this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs) && this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs >= 0) {
            if (this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs === 0)
                return player.destroy(Player_1.DestroyReasons.QueueEmpty);
            else {
                if (player.get("internal_queueempty")) {
                    clearTimeout(player.get("internal_queueempty"));
                    player.set("internal_queueempty", undefined);
                }
                player.set("internal_queueempty", setTimeout(() => {
                    player.destroy(Player_1.DestroyReasons.QueueEmpty);
                }, this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs));
            }
        }
        return this.NodeManager.LavalinkManager.emit("queueEnd", player, track, payload);
    }
}
exports.LavalinkNode = LavalinkNode;
