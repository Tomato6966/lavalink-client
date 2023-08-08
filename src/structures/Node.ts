import WebSocket from "ws";
import { Dispatcher, Pool } from "undici";
import { NodeManager } from "./NodeManager";
import internal from "stream";
import { InvalidLavalinkRestRequest, LavalinkPlayer, PlayerEventType, PlayerEvents, PlayerUpdateInfo, RoutePlanner, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, WebSocketClosedEvent, Session } from "./Utils";
import { Player } from "./Player";
import { isAbsolute } from "path";
import { Track } from "./Track";

/** Modifies any outgoing REST requests. */
export type ModifyRequest = (options: Dispatcher.RequestOptions) => void;

export interface LavalinkNodeOptions {
    /** The Lavalink Server-Ip / Domain-URL */
    host: string;
    /** The Lavalink Connection Port */
    port: number;
    /** The Lavalink Password / Authorization-Key */
    authorization: string;
    /** Does the Server use ssl (https) */
    secure?: boolean;
    /** Add a Custom ID to the node, for later use */
    id?: string;
    /** Voice Regions of this Node */
    regions?: string[];
    /** Options for the undici http pool used for http requests */
    poolOptions?: Pool.Options;
    /** The retryAmount for the node. */
    retryAmount?: number;
    /** The retryDelay for the node. */
    retryDelay?: number;
    /** Pool Undici Options - requestTimeout */
    requestTimeout?: number;
}

export interface MemoryStats {
    /** The free memory of the allocated amount. */
    free: number;
    /** The used memory of the allocated amount. */
    used: number;
    /** The total allocated memory. */
    allocated: number;
    /** The reservable memory. */
    reservable: number;
}

export interface CPUStats {
    /** The core amount the host machine has. */
    cores: number;
    /** The system load. */
    systemLoad: number;
    /** The lavalink load. */
    lavalinkLoad: number;
}

export interface FrameStats {
    /** The amount of sent frames. */
    sent?: number;
    /** The amount of nulled frames. */
    nulled?: number;
    /** The amount of deficit frames. */
    deficit?: number;
}

export interface NodeStats {
    /** The amount of players on the node. */
    players: number;
    /** The amount of playing players on the node. */
    playingPlayers: number;
    /** The uptime for the node. */
    uptime: number;
    /** The memory stats for the node. */
    memory: MemoryStats;
    /** The cpu stats for the node. */
    cpu: CPUStats;
    /** The frame stats for the node. */
    frameStats: FrameStats;
}

export interface LavalinkInfo {
    version: VersionObject;
    buildTime: number;
    git: GitObject;
    jvm: string;
    lavaplayer: string;
    sourceManagers: string[];
    filters: string[];
    plugins: PluginObject[];
}

export interface VersionObject {
    semver: string;
    major: number;
    minor: number;
    patch: internal;
    preRelease?: string;
}

export interface GitObject {
    branch: string;
    commit: string;
    commitTime: string;
}

export interface PluginObject {
    name: string;
    version: string;
}

export class LavalinkNode {
    public socket: WebSocket | null = null;
    public rest: Pool
    public options: LavalinkNodeOptions;
    /** The amount of rest calls the node has made. */
    public calls = 0;
    public stats: NodeStats;
    private NodeManager: NodeManager | null = null;
    private reconnectTimeout?: NodeJS.Timeout;
    private reconnectAttempts = 1;
    public sessionId?: string | null = null;
    public info: LavalinkInfo | null = null;
    version: "v4";
    constructor(options: LavalinkNodeOptions, manager: NodeManager) {
        if (!this.options.authorization) throw new SyntaxError("LavalinkNode requires 'authorization'");
        if (!this.options.host) throw new SyntaxError("LavalinkNode requires 'host'");
        if (!this.options.port) throw new SyntaxError("LavalinkNode requires 'port'");

        this.options = {
            secure: false,
            retryAmount: 5,
            retryDelay: 30e3,
            requestTimeout: 10e3,
            ...options
        };

        this.NodeManager = manager;

        if (this.options.secure && this.options.port !== 443) throw new SyntaxError("If secure is true, then the port must be 443");

        this.rest = new Pool(this.poolAddress, this.options.poolOptions);
        this.options.regions = (this.options.regions || []).map(a => a.toLowerCase());
        this.stats = {
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
        }
    }
    /**
     * Makes an API call to the Node
     * @param endpoint The endpoint that we will make the call to
     * @param modify Used to modify the request before being sent
     * @returns The returned data
     */
    public async makeRequest(endpoint: string, modify?: ModifyRequest, parseAsText:boolean = false) {
        const options: Dispatcher.RequestOptions = {
            path: `/${this.version}/${endpoint.replace(/^\//gm, "")}`,
            method: "GET",
            headers: {
                Authorization: this.options.authorization
            },
            headersTimeout: this.options.requestTimeout,
        }

        modify?.(options);

        const url = new URL(`${this.poolAddress}${options.path}`);
        url.searchParams.append("trace", "true");
        options.path = url.toString().replace(this.poolAddress, "");


        const request = await this.rest.request(options);
        this.calls++;

        if (options.method === "DELETE") return;

        return parseAsText ? await request.body.text() : await request.body.json();
    }

    public async updatePlayer(data: PlayerUpdateInfo) {
        if(!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        this.syncPlayerData(data);

        const res = await this.makeRequest(`/sessions/${this.sessionId}/players/${data.guildId}`, r => {
            r.method = "PATCH";
            r.headers = { Authorization: this.options.authorization, "Content-Type": "application/json" };
            
            if(data.playerOptions.track) delete data.playerOptions.track;

            r.body = JSON.stringify(data.playerOptions);

            if(data.noReplace) {
                const url = new URL(`${this.poolAddress}${r.path}`);
                url.searchParams.append("noReplace", data.noReplace?.toString() || "false")
                r.path = url.toString().replace(this.poolAddress, "");
            }
        }) as LavalinkPlayer;

        return this.syncPlayerData({}, res), res;
    }

    private syncPlayerData(data:Partial<PlayerUpdateInfo>, res?:LavalinkPlayer) {
        if(typeof data === "object" && typeof data?.guildId === "string" && typeof data.playerOptions === "object" && Object.keys(data.playerOptions).length > 1) {
          const player = this.NodeManager.LavalinkManager.playerManager.getPlayer(data.guildId);
          if(!player) return;
          if(typeof data.playerOptions.paused !== "undefined") {
            player.paused = data.playerOptions.paused;
            player.playing = !data.playerOptions.paused;
          }
      
          if(typeof data.playerOptions.position !== "undefined") player.position = data.playerOptions.position
          if(typeof data.playerOptions.voice !== "undefined") player.voice = data.playerOptions.voice;
          if(typeof data.playerOptions.volume !== "undefined") {
            if (this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer) {
              player.volume = data.playerOptions.volume / this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer;
              player.lavalinkVolume = data.playerOptions.volume;
            } else {
              player.volume = data.playerOptions.volume;
              player.lavalinkVolume = data.playerOptions.volume;
            }
          }

          if(typeof data.playerOptions.filters !== "undefined") {
            const oldFilterTimescale = { ...(player.filterManager.data.timescale||{}) };
            Object.freeze(oldFilterTimescale);
            if(data.playerOptions.filters.timescale) player.filterManager.data.timescale = data.playerOptions.filters.timescale;
            if(data.playerOptions.filters.distortion) player.filterManager.data.distortion = data.playerOptions.filters.distortion;
            if(data.playerOptions.filters.echo) player.filterManager.data.echo = data.playerOptions.filters.echo;
            if(data.playerOptions.filters.vibrato) player.filterManager.data.vibrato = data.playerOptions.filters.vibrato;
            if(data.playerOptions.filters.volume) player.filterManager.data.volume = data.playerOptions.filters.volume;
            if(data.playerOptions.filters.equalizer) player.filterManager.data.equalizer = data.playerOptions.filters.equalizer;
            if(data.playerOptions.filters.karaoke) player.filterManager.data.karaoke = data.playerOptions.filters.karaoke;
            if(data.playerOptions.filters.lowPass) player.filterManager.data.lowPass = data.playerOptions.filters.lowPass;
            if(data.playerOptions.filters.rotation) player.filterManager.data.rotation = data.playerOptions.filters.rotation;
            if(data.playerOptions.filters.tremolo) player.filterManager.data.tremolo = data.playerOptions.filters.tremolo;
            player.filterManager.checkFiltersState(oldFilterTimescale);        
          }
        }

        // just for res
        if(res?.guildId === "string" && typeof res?.voice !== "undefined") {
          const player = this.NodeManager.LavalinkManager.playerManager.getPlayer(data.guildId);
          if(!player) return;
    
          if(typeof res?.voice?.connected === "boolean" && res.voice.connected === false) return player.destroy();
          player.wsPing = res?.voice?.ping || player?.wsPing;
        }

        return true;    
    }

    public async destroyPlayer(guildId) {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/sessions/${this.sessionId}/players/${guildId}`, r => { r.method = "DELETE"; });
    }

    public connect(): void {
        if (this.connected) return;
        const headers = {
            Authorization: this.options.authorization,
            "Num-Shards": String(this.NodeManager.LavalinkManager.options.client.shards || "auto"),
            "User-Id": this.NodeManager.LavalinkManager.options.client.id,
            "User-Name": this.NodeManager.LavalinkManager.options.client.username || "Lavalink-Client",
        }

        this.socket = new WebSocket(`ws${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}/v4/websocket`, { headers });
        this.socket.on("open", this.open.bind(this));
        this.socket.on("close", this.close.bind(this));
        this.socket.on("message", this.message.bind(this));
        this.socket.on("error", this.error.bind(this));
    }
    public get id() {
        return this.options.id || this.options.host;
    }
    public destroy() {
        if (!this.connected) return;

        const players = this.NodeManager.LavalinkManager.playerManager.players.filter(p => p.node.id == this.id);
        if (players) players.forEach(p => p.destroy());

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
    public get connected(): boolean {
        if (!this.socket) return false;
        return this.socket.readyState === WebSocket.OPEN;
    }

    public get poolAddress() {
        return `http${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}`;
    }

    private async fetchInfo() {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const resInfo = await this.makeRequest(`/info`, r => r.path = `/${this.version}/info`).catch(console.warn) || null;
        return resInfo as LavalinkInfo | null;
    }

    private async fetchVersion() {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const resInfo = await this.makeRequest(`/version`, r => r.path = "/version", true).catch(console.warn) || null;
        return resInfo as string | null;
    }

    /**
     * Gets all Players of a Node
     */
    public async getPlayers() {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        const players = await this.makeRequest(`/sessions/${this.sessionId}/players`) as LavalinkPlayer[];
        if (!Array.isArray(players)) return [];
        else return players;
    }
    /**
     * Gets specific Player Information
     */
    public async getPlayer(guildId: string) {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/sessions/${this.sessionId}/players/${guildId}`) as LavalinkPlayer | InvalidLavalinkRestRequest | null;
    }

    /**
     * Updates the session with a resuming key and timeout
     * @param resumingKey 
     * @param timeout
     */
    public async updateSession(resumingKey?: string, timeout?: number) {
        if(!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/sessions/${this.sessionId}`, r => {
            r.method = "PATCH";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' }
            r.body = JSON.stringify({ resumingKey, timeout });
        }) as Session|Record<string, string>
    }
    /**
     * Get routplanner Info from Lavalink
     */
    public async getRoutePlannerStatus() {
        if(!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        return await this.makeRequest(`/routeplanner/status`) as RoutePlanner;
    }

    /**
     * Release blacklisted IP address into pool of IPs
     * @param address IP address
     */
    public async unmarkFailedAddress(address: string) {
        if(!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
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
    public async unmarkAllFailedAddresses() {
      if(!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        await this.makeRequest(`/routeplanner/free/all`, r => {
          r.method = "POST";
          r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' };
        });
    }
    
    private reconnect(): void {
        this.reconnectTimeout = setTimeout(() => {
            if (this.reconnectAttempts >= this.options.retryAmount) {
                const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`)

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
    private open(): void {
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

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

    private close(code: number, reason: string): void {
        this.NodeManager.emit("disconnect", this, { code, reason });
        if (code !== 1000 || reason !== "destroy") this.reconnect();
    }

    private error(error: Error): void {
        if (!error) return;
        this.NodeManager.emit("error", this, error);
    }

    private async message(d: Buffer | string) {
        if (Array.isArray(d)) d = Buffer.concat(d);
        else if (d instanceof ArrayBuffer) d = Buffer.from(d);

        const payload = JSON.parse(d.toString());

        if (!payload.op) return;
        this.NodeManager.emit("raw", this, payload);

        switch (payload.op) {
            case "stats":
                delete payload.op;
                this.stats = ({ ...payload } as unknown) as NodeStats;
                break;
            case "playerUpdate":
                const player = this.NodeManager.LavalinkManager.playerManager.getPlayer(payload.guildId);
                if(!player) return;
                
                if(player.get("internal_updateInterval")) clearInterval(player.get("internal_updateInterval"));
                player.position = payload.state.position || 0;
                player.set("internal_lastposition", player.position);
                player.connected = payload.state.connected;
                player.wsPing = payload.state.ping >= 0 ? payload.state.ping : player.wsPing <= 0 && player.connected ? null : player.wsPing || 0;
                if(!player.createdTimeStamp && payload.state.time) player.createdTimeStamp = payload.sate.time;
                
                if(typeof this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval === "number" && this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval >= 10) {
                    player.set("internal_updateInterval", setInterval(() => {
                        player.position += this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval || 250;
                        player.set("internal_lastposition", player.position);
                        if(player.filterManager.filterUpdatedState >= 1) {
                            player.filterManager.filterUpdatedState++
                            const maxMins = 8;
                            const currentDuration = player.queue.currentTrack?.info?.duration || 0;
                            if(currentDuration <= maxMins*6e4 || isAbsolute(player.queue.currentTrack?.info?.uri)) {
                                if(player.filterManager.filterUpdatedState >= ((this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval || 250) > 400 ? 2 : 3)) {
                                    player.filterManager.filterUpdatedState = 0;
                                    player.seek(player.position);
                                }
                            } else {
                                player.filterManager.filterUpdatedState = 0;
                            }
                        }
                    }, this.NodeManager.LavalinkManager.options.playerOptions.clientBasedUpdateInterval || 250))
                } else {
                    if(player.filterManager.filterUpdatedState >= 1) { // if no interval but instafix available, findable via the "filterUpdatedState" property
                        const maxMins = 8;
                        const currentDuration = player.queue.currentTrack?.info?.duration || 0;
                        if(currentDuration <= maxMins*6e4 || isAbsolute(player.queue.currentTrack?.info?.uri)) player.seek(player.position);
                        player.filterManager.filterUpdatedState = 0;
                    }
                }
                break;
            case "event":
                this.handleEvent(payload);
                break;
            case "ready":  // payload: { resumed: false, sessionId: 'ytva350aevn6n9n8', op: 'ready' }
                this.sessionId = payload.sessionId;
                break;
            default:
                this.NodeManager.emit("error", this, new Error(`Unexpected op "${payload.op}" with data`), payload);
            return;
        }
    }
    private async handleEvent(payload: PlayerEventType & PlayerEvents) {
        if (!payload.guildId) return;

        const player = this.NodeManager.LavalinkManager.playerManager.getPlayer(payload.guildId);
        if (!player) return;

        switch(payload.type) {
            case "TrackStartEvent": this.trackStart(player, player.queue.currentTrack, payload); break;
            case "TrackEndEvent": this.trackEnd(player, player.queue.currentTrack, payload); break;
            case "TrackStuckEvent": this.trackStuck(player, player.queue.currentTrack, payload); break;
            case "TrackExceptionEvent": this.trackError(player, player.queue.currentTrack, payload); break;
            case "WebSocketClosedEvent": this.socketClosed(player, payload); break;
            default: this.NodeManager.emit("error", this, new Error(`Node#event unknown event '${(payload as PlayerEventType & PlayerEvents).type}'.`), (payload as PlayerEventType & PlayerEvents)); break;
        }
        return;
    }

    private trackStart(player: Player, track: Track, payload: TrackStartEvent) {
        player.playing = true;
        player.paused = false;
        return this.NodeManager.LavalinkManager.playerManager.emit("trackStart", player, track, payload);
    }

    private async trackEnd(player: Player, track: Track, payload: TrackEndEvent) {
        // If there are no songs in the queue
        if (!player.queue.size && player.repeatMode === "off") return this.queueEnd(player, player.queue.currentTrack, payload);
        // If a track was forcibly played
        if (payload.reason === "REPLACED") return this.NodeManager.LavalinkManager.playerManager.emit("trackEnd", player, track, payload);
        // If a track had an error while starting
        if (["LOAD_FAILED", "CLEAN_UP"].includes(payload.reason)) {
            await player.queue._trackEnd();
            if(!player.queue.currentTrack) return this.queueEnd(player, player.queue.currentTrack, payload);
            this.NodeManager.LavalinkManager.playerManager.emit("trackEnd", player, track, payload);
            return this.NodeManager.LavalinkManager.options.autoSkip && player.play({ track: player.queue.currentTrack });
        }
        // remove tracks from the queue
        if(player.repeatMode !== "track") await player.queue._trackEnd(player.repeatMode === "queue"); 
        // if no track available, end queue
        if(!player.queue.currentTrack) return this.queueEnd(player, player.queue.currentTrack, payload);
        // fire event
        this.NodeManager.LavalinkManager.playerManager.emit("trackEnd", player, track, payload);
        // play track if autoSkip is true
        return this.NodeManager.LavalinkManager.options.autoSkip && player.play({ track: player.queue.currentTrack });
    }

    private async queueEnd(player: Player, track: Track, payload: TrackEndEvent) {
        player.queue.setCurrent(null);
        player.playing = false;
        return this.NodeManager.LavalinkManager.playerManager.emit("queueEnd", player, track, payload);
    }

    private async trackStuck(player: Player, track: Track, payload: TrackStuckEvent) {
        this.NodeManager.LavalinkManager.playerManager.emit("trackStuck", player, track, payload);
        // If there are no songs in the queue
        if (!player.queue.size && player.repeatMode === "off") return // this.queueEnd(player, queue, payload);
        // player.stop()
    }

    private trackError(
        player: Player,
        track: Track,
        payload: TrackExceptionEvent
    ) {
        this.NodeManager.LavalinkManager.playerManager.emit("trackError", player, track, payload);
        // player.stop();
    }

    private socketClosed(player: Player, payload: WebSocketClosedEvent) {
        return this.NodeManager.LavalinkManager.playerManager.emit("socketClosed", player, payload);
    }
}
