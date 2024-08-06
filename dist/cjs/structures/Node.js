"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavalinkNode = exports.validSponsorBlocks = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const ws_1 = tslib_1.__importDefault(require("ws"));
const Player_1 = require("./Player");
const Utils_1 = require("./Utils");
exports.validSponsorBlocks = ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "filler"];
/**
 * Lavalink Node creator class
 */
class LavalinkNode {
    /** The provided Options of the Node */
    options;
    /** The amount of rest calls the node has made. */
    calls = 0;
    /** Stats from lavalink, will be updated via an interval by lavalink. */
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
    /** The current sessionId, only present when connected */
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
     *
     *
     * @example
     * ```ts
     * // don't create a node manually, instead use:
     *
     * client.lavalink.nodeManager.createNode(options)
     * ```
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
     * Parse url params correctly for lavalink requests, including support for urls and uris.
     * @param url input url object
     * @param extraQueryUrlParams UrlSearchParams to use in a encodedURI, useful for example for flowertts
     * @returns the url as a valid string
     *
     * @example
     * ```ts
     * player.node.getRequestingUrl(new URL(`http://localhost:2333/v4/loadtracks?identifier=Never gonna give you up`));
     * ```
     */
    getRequestingUrl(url, extraQueryUrlParams) {
        if (!url.searchParams.size)
            return `${url.origin}${url.pathname}`;
        const keysToAdd = [];
        for (const [paramKey, paramValue] of url.searchParams.entries()) {
            const decoded = decodeURIComponent(paramValue).trim(); // double decoding, once internally, a second time if decoded by provided user.
            if (decoded.includes("://") && !/^https?:\/\//.test(decoded)) { // uri, but not url.
                const [key, ...values] = decoded.split("://");
                keysToAdd.push(`${paramKey}=${encodeURI(`${key}://${encodeURIComponent(values.join("://"))}${extraQueryUrlParams && extraQueryUrlParams?.size > 0 ? `?${extraQueryUrlParams.toString()}` : ""}`)}`);
                continue;
            }
            keysToAdd.push(`${paramKey}=${encodeURIComponent(decoded)}`);
        }
        return `${url.origin}${url.pathname}?${keysToAdd.join("&")}`;
    }
    /**
     * Raw Request util function
     * @param endpoint endpoint string
     * @param modify modify the request
     * @param extraQueryUrlParams UrlSearchParams to use in a encodedURI, useful for example for flowertts
     * @returns object containing request and option information
     *
     * @example
     * ```ts
     * player.node.rawRequest(`/loadtracks?identifier=Never gonna give you up`, (options) => options.method = "GET");
     * ```
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
        const urlToUse = this.getRequestingUrl(url, options?.extraQueryUrlParams);
        delete options.path;
        delete options.extraQueryUrlParams;
        const request = await fetch(urlToUse, options);
        this.calls++;
        return { request, options };
    }
    /**
     * Makes an API call to the Node. Should only be used for manual parsing like for not supported plugins
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     *
     * @example
     * ```ts
     * player.node.request(`/loadtracks?identifier=Never gonna give you up`, (options) => options.method = "GET", false);
     * ```
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
     * @param throwOnEmpty Wether to throw on an empty result or not
     * @returns Searchresult
     *
     * @example
     * ```ts
     * // use player.search() instead
     * player.node.search({ query: "Never gonna give you up by Rick Astley", source: "soundcloud" }, interaction.user);
     * player.node.search({ query: "https://deezer.com/track/123456789" }, interaction.user);
     * ```
     */
    async search(query, requestUser, throwOnEmpty = false) {
        const Query = this.NodeManager.LavalinkManager.utils.transformQuery(query);
        this.NodeManager.LavalinkManager.utils.validateQueryString(this, Query.query, Query.source);
        if (Query.source)
            this.NodeManager.LavalinkManager.utils.validateSourceString(this, Query.source);
        if (["bcsearch", "bandcamp"].includes(Query.source) && !this.info.sourceManagers.includes("bandcamp")) {
            throw new Error("Bandcamp Search only works on the player (lavaplayer version < 2.2.0!");
        }
        let uri = `/loadtracks?identifier=`;
        if (/^https?:\/\//.test(Query.query) || ["http", "https", "link", "uri"].includes(Query.source)) { // if it's a link simply encode it
            uri += encodeURIComponent(Query.query);
        }
        else { // if not make a query out of it
            if (Query.source !== "local")
                uri += `${Query.source}:`; // only add the query source string if it's not a local track
            if (Query.source === "ftts")
                uri += `//${encodeURIComponent(Query.query)}`;
            else
                uri += encodeURIComponent(Query.query);
        }
        const res = await this.request(uri, (options) => {
            if (typeof query === "object" && typeof query.extraQueryUrlParams?.size === "number" && query.extraQueryUrlParams?.size > 0) {
                options.extraQueryUrlParams = query.extraQueryUrlParams;
            }
        });
        // transform the data which can be Error, Track or Track[] to enfore [Track]
        const resTracks = res.loadType === "playlist" ? res.data?.tracks : res.loadType === "track" ? [res.data] : res.loadType === "search" ? Array.isArray(res.data) ? res.data : [res.data] : [];
        if (throwOnEmpty === true && (res.loadType === "empty" || !resTracks.length))
            throw new Error("Nothing found");
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
    /**
     * Search something using the lavaSearchPlugin (filtered searches by types)
     * @param query LavaSearchQuery Object
     * @param requestUser Request User for creating the player(s)
     * @param throwOnEmpty Wether to throw on an empty result or not
     * @returns LavaSearchresult
     *
     * @example
     * ```ts
     * // use player.search() instead
     * player.node.lavaSearch({ types: ["playlist", "album"], query: "Rick Astley", source: "spotify" }, interaction.user);
     * ```
     */
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
        const res = (request.status === 204 ? {} : await request.json());
        if (throwOnEmpty === true && !Object.entries(res).flat().filter(Boolean).length)
            throw new Error("Nothing found");
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
     * @param data data to send to lavalink and sync locally
     * @returns result from lavalink
     *
     * @example
     * ```ts
     * // use player.search() instead
     * player.node.updatePlayer({ guildId: player.guildId, playerOptions: { paused: true } }); // example to pause it
     * ```
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
     * @returns request result
     *
     * @example
     * ```ts
     * // use player.destroy() instead
     * player.node.destroyPlayer(player.guildId);
     * ```
     */
    async destroyPlayer(guildId) {
        if (!this.sessionId)
            throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.request(`/sessions/${this.sessionId}/players/${guildId}`, r => { r.method = "DELETE"; });
    }
    /**
     * Connect to the Lavalink Node
     * @param sessionId Provide the Session Id of the previous connection, to resume the node and it's player(s)
     * @returns void
     *
     * @example
     * ```ts
     * player.node.connect(); // if provided on bootup in managerOptions#nodes, this will be called automatically when doing lavalink.init()
     *
     * // or connect from a resuming session:
     * player.node.connect("sessionId");
     * ```
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
    /**
     * Get the id of the node
     *
     * @example
     * ```ts
     * const nodeId = player.node.id;
     * console.log("node id is: ", nodeId)
     * ```
     */
    get id() {
        return this.options.id || `${this.options.host}:${this.options.port}`;
    }
    /**
     * Destroys the Node-Connection (Websocket) and all player's of the node
     * @param destroyReason Destroyreason to use when destroying the players
     * @param deleteNode wether to delete the nodte from the nodes list too, if false it will emit a disconnect. @default true
     * @returns void
     *
     * @example
     * ```ts
     * player.node.destroy("custom Player Destroy Reason", true);
     * ```
     */
    destroy(destroyReason, deleteNode = true) {
        if (!this.connected)
            return;
        const players = this.NodeManager.LavalinkManager.players.filter(p => p.node.id === this.id);
        if (players)
            players.forEach(p => {
                p.destroy(destroyReason || Player_1.DestroyReasons.NodeDestroy);
            });
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
    /**
     * Returns if connected to the Node.
     *
     * @example
     * ```ts
     * const isConnected = player.node.connected;
     * console.log("node is connected: ", isConnected ? "yes" : "no")
     * ```
     */
    get connected() {
        if (!this.socket)
            return false;
        return this.socket.readyState === ws_1.default.OPEN;
    }
    /**
     * Returns the current ConnectionStatus
     *
     * @example
     * ```ts
     * try {
     *     const statusOfConnection = player.node.connectionStatus;
     *     console.log("node's connection status is:", statusOfConnection)
     * } catch (error) {
     *     console.error("no socket available?", error)
     * }
     * ```
     */
    get connectionStatus() {
        if (!this.socket)
            throw new Error("no websocket was initialized yet");
        return ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][this.socket.readyState] || "UNKNOWN";
    }
    /**
     * Gets all Players of a Node
     * @returns array of players inside of lavalink
     *
     * @example
     * ```ts
     * const node = lavalink.nodes.get("NODEID");
     * const playersOfLavalink = await node?.fetchAllPlayers();
     * ```
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
     * @returns lavalink player object if player exists on lavalink
     *
     * @example
     * ```ts
     * const node = lavalink.nodes.get("NODEID");
     * const playerInformation = await node?.fetchPlayer("guildId");
     * ```
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
     * @returns the result of the request
     *
     * @example
     * ```ts
     * const node = player.node || lavalink.nodes.get("NODEID");
     * await node?.updateSession(true, 180e3); // will enable resuming for 180seconds
     * ```
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
         * Decode a single track into its info
         * @param encoded valid encoded base64 string from a track
         * @param requester the requesteruser for building the track
         * @returns decoded track from lavalink
         *
         * @example
         * ```ts
         * const encodedBase64 = 'QAACDgMACk5vIERpZ2dpdHkAC0JsYWNrc3RyZWV0AAAAAAAEo4AABjkxNjQ5NgABAB9odHRwczovL2RlZXplci5jb20vdHJhY2svOTE2NDk2AQBpaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvY292ZXIvZGFlN2EyNjViNzlmYjcxMjc4Y2RlMjUwNDg0OWQ2ZjcvMTAwMHgxMDAwLTAwMDAwMC04MC0wLTAuanBnAQAMVVNJUjE5NjAwOTc4AAZkZWV6ZXIBAChObyBEaWdnaXR5OiBUaGUgVmVyeSBCZXN0IE9mIEJsYWNrc3RyZWV0AQAjaHR0cHM6Ly93d3cuZGVlemVyLmNvbS9hbGJ1bS8xMDMyNTQBACJodHRwczovL3d3dy5kZWV6ZXIuY29tL2FydGlzdC8xODYxAQBqaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvYXJ0aXN0L2YxNmNhYzM2ZmVjMzkxZjczN2I3ZDQ4MmY1YWM3M2UzLzEwMDB4MTAwMC0wMDAwMDAtODAtMC0wLmpwZwEAT2h0dHBzOi8vY2RuLXByZXZpZXctYS5kemNkbi5uZXQvc3RyZWFtL2MtYTE1Yjg1NzFhYTYyMDBjMDQ0YmY1OWM3NmVkOTEyN2MtNi5tcDMAAAAAAAAAAAA=';
         * const track = await player.node.decode.singleTrack(encodedBase64, interaction.user);
         * ```
         */
        singleTrack: async (encoded, requester) => {
            if (!encoded)
                throw new SyntaxError("No encoded (Base64 string) was provided");
            // return the decoded + builded track
            return this.NodeManager.LavalinkManager.utils?.buildTrack(await this.request(`/decodetrack?encodedTrack=${encodeURIComponent(encoded.replace(/\s/g, ""))}`), requester);
        },
        /**
         * Decodes multiple tracks into their info
         * @param encodeds valid encoded base64 string array from all tracks
         * @param requester the requesteruser for building the tracks
         * @returns array of all tracks you decoded
         *
         * @example
         * ```ts
         * const encodedBase64_1 = 'QAACDgMACk5vIERpZ2dpdHkAC0JsYWNrc3RyZWV0AAAAAAAEo4AABjkxNjQ5NgABAB9odHRwczovL2RlZXplci5jb20vdHJhY2svOTE2NDk2AQBpaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvY292ZXIvZGFlN2EyNjViNzlmYjcxMjc4Y2RlMjUwNDg0OWQ2ZjcvMTAwMHgxMDAwLTAwMDAwMC04MC0wLTAuanBnAQAMVVNJUjE5NjAwOTc4AAZkZWV6ZXIBAChObyBEaWdnaXR5OiBUaGUgVmVyeSBCZXN0IE9mIEJsYWNrc3RyZWV0AQAjaHR0cHM6Ly93d3cuZGVlemVyLmNvbS9hbGJ1bS8xMDMyNTQBACJodHRwczovL3d3dy5kZWV6ZXIuY29tL2FydGlzdC8xODYxAQBqaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvYXJ0aXN0L2YxNmNhYzM2ZmVjMzkxZjczN2I3ZDQ4MmY1YWM3M2UzLzEwMDB4MTAwMC0wMDAwMDAtODAtMC0wLmpwZwEAT2h0dHBzOi8vY2RuLXByZXZpZXctYS5kemNkbi5uZXQvc3RyZWFtL2MtYTE1Yjg1NzFhYTYyMDBjMDQ0YmY1OWM3NmVkOTEyN2MtNi5tcDMAAAAAAAAAAAA=';
         * const encodedBase64_2 = 'QAABJAMAClRhbGsgYSBMb3QACjQwNHZpbmNlbnQAAAAAAAHr1gBxTzpodHRwczovL2FwaS12Mi5zb3VuZGNsb3VkLmNvbS9tZWRpYS9zb3VuZGNsb3VkOnRyYWNrczo4NTE0MjEwNzYvMzUyYTRiOTAtNzYxOS00M2E5LWJiOGItMjIxMzE0YzFjNjNhL3N0cmVhbS9obHMAAQAsaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS80MDR2aW5jZW50L3RhbGstYS1sb3QBADpodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtRTN1ek5Gc0Y4QzBXLTAtb3JpZ2luYWwuanBnAQAMUVpITkExOTg1Nzg0AApzb3VuZGNsb3VkAAAAAAAAAAA=';
         * const tracks = await player.node.decode.multipleTracks([encodedBase64_1, encodedBase64_2], interaction.user);
         * ```
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
     * @returns the lavalink node stats
     *
     * @example
     * ```ts
     * const lavalinkStats = await player.node.fetchStats();
     * ```
     */
    async fetchStats() {
        return await this.request(`/stats`);
    }
    /**
     * Request Lavalink version.
     * @returns the current used lavalink version
     *
     * @example
     * ```ts
     * const lavalinkVersion = await player.node.fetchVersion();
     * ```
     */
    async fetchVersion() {
        // need to adjust path for no-prefix version info
        return await this.request(`/version`, r => { r.path = "/version"; }, true);
    }
    /**
     * Request Lavalink information.
     * @returns lavalink info object
     *
     * @example
     * ```ts
     * const lavalinkInfo = await player.node.fetchInfo();
     * const availablePlugins:string[] = lavalinkInfo.plugins.map(plugin => plugin.name);
     * const availableSources:string[] = lavalinkInfo.sourceManagers;
     * ```
     */
    async fetchInfo() {
        return await this.request(`/info`);
    }
    /**
     * Lavalink's Route Planner Api
     */
    routePlannerApi = {
        /**
         * Get routplanner Info from Lavalink for ip rotation
         * @returns the status of the routeplanner
         *
         * @example
         * ```ts
         * const routePlannerStatus = await player.node.routePlannerApi.getStatus();
         * const usedBlock = routePlannerStatus.details?.ipBlock;
         * const currentIp = routePlannerStatus.currentAddress;
         * ```
         */
        getStatus: async () => {
            if (!this.sessionId)
                throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            return await this.request(`/routeplanner/status`);
        },
        /**
         * Release blacklisted IP address into pool of IPs for ip rotation
         * @param address IP address
         * @returns request data of the request
         *
         * @example
         * ```ts
         * await player.node.routePlannerApi.unmarkFailedAddress("ipv6address");
         * ```
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
         * @returns request data of the request
         *
         * @example
         * ```ts
         * await player.node.routePlannerApi.unmarkAllFailedAddresses();
         * ```
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
    /** @private Utils for validating the */
    validate() {
        if (!this.options.authorization)
            throw new SyntaxError("LavalinkNode requires 'authorization'");
        if (!this.options.host)
            throw new SyntaxError("LavalinkNode requires 'host'");
        if (!this.options.port)
            throw new SyntaxError("LavalinkNode requires 'port'");
    }
    /**
     * Sync the data of the player you make an action to lavalink to
     * @param data data to use to update the player
     * @param res result data from lavalink, to override, if available
     * @returns boolean
     */
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
                // player.position = data.playerOptions.position;
                player.lastPosition = data.playerOptions.position;
                player.lastPositionChange = Date.now();
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
    /**
     * Get the rest Adress for making requests
     */
    get restAddress() {
        return `http${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}`;
    }
    /**
     * Reconnect to the lavalink node
     * @param instaReconnect @default false wether to instantly try to reconnect
     * @returns void
     *
     * @example
     * ```ts
     * await player.node.reconnect();
     * ```
     */
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
    /** @private util function for handling opening events from websocket */
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
    /** @private util function for handling closing events from websocket */
    close(code, reason) {
        this.NodeManager.emit("disconnect", this, { code, reason });
        if (code !== 1000 || reason !== "Node-Destroy")
            this.reconnect();
    }
    /** @private util function for handling error events from websocket */
    error(error) {
        if (!error)
            return;
        this.NodeManager.emit("error", this, error);
    }
    /** @private util function for handling message events from websocket */
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
                    player.lastPositionChange = Date.now();
                    player.lastPosition = payload.state.position || 0;
                    player.connected = payload.state.connected;
                    player.ping.ws = payload.state.ping >= 0 ? payload.state.ping : player.ping.ws <= 0 && player.connected ? null : player.ping.ws || 0;
                    if (!player.createdTimeStamp && payload.state.time)
                        player.createdTimeStamp = payload.state.time;
                    if (player.filterManager.filterUpdatedState === true && ((player.queue.current?.info?.duration || 0) <= (player.LavalinkManager.options.advancedOptions.maxFilterFixDuration || 600000) || (0, path_1.isAbsolute)(player.queue.current?.info?.uri))) {
                        player.filterManager.filterUpdatedState = false;
                        await player.seek(player.position);
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
    /** @private middleware util function for handling all kind of events from websocket */
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
                this.SponsorBlockSegmentSkipped(player, player.queue.current, payload);
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
    /** @private util function for handling trackStart event */
    trackStart(player, track, payload) {
        player.playing = true;
        player.paused = false;
        // don't emit the event if previous track == new track aka track loop
        if (this.NodeManager.LavalinkManager.options?.emitNewSongsOnly === true && player.queue.previous[0]?.info?.identifier === track?.info?.identifier)
            return;
        return this.NodeManager.LavalinkManager.emit("trackStart", player, track, payload);
    }
    /** @private util function for handling trackEnd event */
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
        else if (player.queue.current && !player.queue.current?.pluginInfo?.clientData?.previousTrack) { // If there was a current Track already and repeatmode === true, add it to the queue.
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
    /** @private util function for handling trackStuck event */
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
    /** @private util function for handling trackError event */
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
    /** @private util function for handling socketClosed event */
    socketClosed(player, payload) {
        return this.NodeManager.LavalinkManager.emit("playerSocketClosed", player, payload);
    }
    /** @private util function for handling SponsorBlock Segmentloaded event */
    SponsorBlockSegmentLoaded(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("SegmentsLoaded", player, track, payload);
    }
    /** @private util function for handling SponsorBlock SegmentSkipped event */
    SponsorBlockSegmentSkipped(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("SegmentSkipped", player, track, payload);
    }
    /** @private util function for handling SponsorBlock Chaptersloaded event */
    SponsorBlockChaptersLoaded(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("ChaptersLoaded", player, track, payload);
    }
    /** @private util function for handling SponsorBlock Chaptersstarted event */
    SponsorBlockChapterStarted(player, track, payload) {
        return this.NodeManager.LavalinkManager.emit("ChapterStarted", player, track, payload);
    }
    /**
     * Get the current sponsorblocks for the sponsorblock plugin
     * @param player passthrough the player
     * @returns sponsorblock seggment from lavalink
     *
     * @example
     * ```ts
     * // use it on the player via player.getSponsorBlock();
     * const sponsorBlockSegments = await player.node.getSponsorBlock(player);
     * ```
     */
    async getSponsorBlock(player) {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin"))
            throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // do the request
        return await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`);
    }
    /**
     * Set the current sponsorblocks for the sponsorblock plugin
     * @param player passthrough the player
     * @returns void
     *
     * @example
     * ```ts
     * // use it on the player via player.setSponsorBlock();
     * const sponsorBlockSegments = await player.node.setSponsorBlock(player, ["sponsor", "selfpromo"]);
     * ```
     */
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
    /**
     * Delete the sponsorblock plugins
     * @param player passthrough the player
     * @returns void
     *
     * @example
     * ```ts
     * // use it on the player via player.deleteSponsorBlock();
     * const sponsorBlockSegments = await player.node.deleteSponsorBlock(player);
     * ```
     */
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
    /** private util function for handling the queue end event */
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
        if (track && !track?.pluginInfo?.clientData?.previousTrack) { // If there was a current Track already and repeatmode === true, add it to the queue.
            player.queue.previous.unshift(track);
            if (player.queue.previous.length > player.queue.options.maxPreviousTracks)
                player.queue.previous.splice(player.queue.options.maxPreviousTracks, player.queue.previous.length);
            await player.queue.utils.save();
        }
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
