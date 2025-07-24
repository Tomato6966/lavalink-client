import { isAbsolute } from "path";
import WebSocket from "ws";

import { DebugEvents, DestroyReasons, validSponsorBlocks } from "./Constants";
import { NodeSymbol, queueTrackEnd, safeStringify } from "./Utils";

import type {
	Base64, InvalidLavalinkRestRequest, LavalinkPlayer, LavaSearchQuery, LavaSearchResponse,
	LoadTypes, LyricsFoundEvent, LyricsLineEvent, LyricsNotFoundEvent, PlayerEvents,
	PlayerEventType, PlayerUpdateInfo, RoutePlanner, SearchQuery, SearchResult,
	Session, SponsorBlockChaptersLoaded, SponsorBlockChapterStarted, SponsorBlockSegmentSkipped,
	SponsorBlockSegmentsLoaded, TrackEndEvent, TrackExceptionEvent, TrackStartEvent,
	TrackStuckEvent, WebSocketClosedEvent
} from "./Types/Utils";
import type { Player } from "./Player";
import type { DestroyReasonsType, DisconnectReasonsType } from "./Types/Player";
import type { LavalinkTrack, PluginInfo, Track } from "./Types/Track";
import type { NodeManager } from "./NodeManager";

import type {
    BaseNodeStats, LavalinkInfo, LavalinkNodeOptions, LyricsResult, ModifyRequest, NodeStats, SponsorBlockSegment
} from "./Types/Node";
/**
 * Lavalink Node creator class
 */
export class LavalinkNode {
    private heartBeatPingTimestamp: number = 0;
    private heartBeatPongTimestamp: number = 0;
    public get heartBeatPing() {
        return this.heartBeatPongTimestamp - this.heartBeatPingTimestamp;
    }
    private heartBeatInterval?: NodeJS.Timeout;
    private pingTimeout?: NodeJS.Timeout;
    public isAlive: boolean = false;
    /** The provided Options of the Node */
    public options: LavalinkNodeOptions;
    /** The amount of rest calls the node has made. */
    public calls: number = 0;
    /** Stats from lavalink, will be updated via an interval by lavalink. */
    public stats: NodeStats = {
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
    public sessionId?: string | null = null;
    /** Wether the node resuming is enabled or not */
    public resuming: { enabled: boolean, timeout: number | null } = { enabled: true, timeout: null };
    /** Actual Lavalink Information of the Node */
    public info: LavalinkInfo | null = null;
    /** The Node Manager of this Node */
    private NodeManager: NodeManager | null = null;
    /** The Reconnection Timeout */
    private reconnectTimeout?: NodeJS.Timeout = undefined;
    /** The Reconnection Attempt counter */
    private reconnectAttempts = 1;
    /** The Socket of the Lavalink */
    private socket: WebSocket | null = null;
    /** Version of what the Lavalink Server should be */
    private version = "v4";



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
    constructor(options: LavalinkNodeOptions, manager: NodeManager) {
        this.options = {
            secure: false,
            retryAmount: 5,
            retryDelay: 10e3,
            requestSignalTimeoutMS: 10000,
            heartBeatInterval: 30_000,
            closeOnError: true,
            enablePingOnStatsCheck: true,
            ...options
        };

        this.NodeManager = manager;

        this.validate();

        if (this.options.secure && this.options.port !== 443) throw new SyntaxError("If secure is true, then the port must be 443");

        this.options.regions = (this.options.regions || []).map(a => a.toLowerCase());

        Object.defineProperty(this, NodeSymbol, { configurable: true, value: true });
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
    private async rawRequest(endpoint: string, modify?: ModifyRequest): Promise<{ response: Response, options: RequestInit & { path: string, extraQueryUrlParams?: URLSearchParams } }> {
        const options: RequestInit & { path: string, extraQueryUrlParams?: URLSearchParams } = {
            path: `/${this.version}/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`,
            method: "GET",
            headers: {
                "Authorization": this.options.authorization
            },
            signal: this.options.requestSignalTimeoutMS && this.options.requestSignalTimeoutMS > 0 ? AbortSignal.timeout(this.options.requestSignalTimeoutMS) : undefined,
        }

        modify?.(options);

        const url = new URL(`${this.restAddress}${options.path}`);
        url.searchParams.append("trace", "true");

        if (options.extraQueryUrlParams && options.extraQueryUrlParams?.size > 0) {
            for (const [paramKey, paramValue] of options.extraQueryUrlParams.entries()) {
                url.searchParams.append(paramKey, paramValue)
            }
        }

        const urlToUse = url.toString();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { path, extraQueryUrlParams, ...fetchOptions } = options; // destructure fetch only options

        const response = await fetch(urlToUse, fetchOptions);

        this.calls++;

        return { response, options: options };
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

    public async request(endpoint: string, modify: ModifyRequest | undefined, parseAsText: true): Promise<string>;
    public async request(endpoint: string, modify?: ModifyRequest, parseAsText?: false): Promise<any>;
    public async request(endpoint: string, modify?: ModifyRequest, parseAsText?: boolean): Promise<any | string> {
        if (!this.connected) throw new Error("The node is not connected to the Lavalink Server!, Please call node.connect() first!");

        const { response, options } = await this.rawRequest(endpoint, modify);

        if (["DELETE", "PUT"].includes(options.method)) return;

        if (response.status === 204) return; // no content
        if (response.status === 404) throw new Error(`Node Request resulted into an error, request-PATH: ${options.path} | headers: ${safeStringify(response.headers)}`)

        return parseAsText ? await response.text() : await response.json();
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
    public async search(query: SearchQuery, requestUser: unknown, throwOnEmpty: boolean = false): Promise<SearchResult> {
        const Query = this.NodeManager.LavalinkManager.utils.transformQuery(query);

        this.NodeManager.LavalinkManager.utils.validateQueryString(this, Query.query, Query.source);
        if (Query.source) this.NodeManager.LavalinkManager.utils.validateSourceString(this, Query.source);

        if (["bcsearch", "bandcamp"].includes(Query.source) && !this.info.sourceManagers.includes("bandcamp")) {
            throw new Error("Bandcamp Search only works on the player (lavaplayer version < 2.2.0!");
        }

        const requestUrl = new URL(`${this.restAddress}/loadtracks`);

        if (/^https?:\/\//.test(Query.query) || ["http", "https", "link", "uri"].includes(Query.source)) { // if it's a link simply encode it
            requestUrl.searchParams.append("identifier", Query.query);
        } else { // if not make a query out of it
            const fttsPrefix = Query.source === "ftts" ? "//" : "";
            const prefix = Query.source !== "local" ? `${Query.source}:${fttsPrefix}` : "";
            requestUrl.searchParams.append("identifier", `${prefix}${Query.query}`)
        }

        const requestPathAndSearch = requestUrl.pathname + requestUrl.search;

        const res = await this.request(requestPathAndSearch, (options) => {
            if (typeof query === "object" && typeof query.extraQueryUrlParams?.size === "number" && query.extraQueryUrlParams?.size > 0) {
                options.extraQueryUrlParams = query.extraQueryUrlParams;
            }
        }) as {
            loadType: LoadTypes,
            data: any,
            pluginInfo: PluginInfo,
        };

        // transform the data which can be Error, Track or Track[] to enfore [Track]
        const resTracks = res.loadType === "playlist" ? res.data?.tracks : res.loadType === "track" ? [res.data] : res.loadType === "search" ? Array.isArray(res.data) ? res.data : [res.data] : [];

        if (throwOnEmpty === true && (res.loadType === "empty" || !resTracks.length)) {
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.SearchNothingFound, {
                    state: "warn",
                    message: `Search found nothing for Request: "${Query.source ? `${Query.source}:` : ""}${Query.query}"`,
                    functionLayer: "(LavalinkNode > node | player) > search()",
                });
            }
            throw new Error("Nothing found");
        }

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
                duration: resTracks.length ? resTracks.reduce((acc: number, cur: Track & { info: Track["info"] & { length?: number } }) => acc + (cur?.info?.duration || cur?.info?.length || 0), 0) : 0,

            } : null,
            tracks: (resTracks.length ? resTracks.map(t => this.NodeManager.LavalinkManager.utils.buildTrack(t, requestUser)) : []) as Track[]
        };
    }

    /**
     * Search something using the lavaSearchPlugin (filtered searches by types)
     * @param query LavaSearchQuery Object
     * @param requestUser Request User for creating the player(s)
     * @param throwOnEmpty Wether to throw on an empty result or not
     * @returns LavaSearchresult (SearchResult if link is provided)
     *
     * @example
     * ```ts
     * // use player.search() instead
     * player.node.lavaSearch({ types: ["playlist", "album"], query: "Rick Astley", source: "spotify" }, interaction.user);
     * ```
     */
    async lavaSearch(query: LavaSearchQuery, requestUser: unknown, throwOnEmpty: boolean = false): Promise<LavaSearchResponse | SearchResult> {
        const Query = this.NodeManager.LavalinkManager.utils.transformLavaSearchQuery(query);

        if (Query.source) this.NodeManager.LavalinkManager.utils.validateSourceString(this, Query.source);
        if (/^https?:\/\//.test(Query.query)) return this.search({ query: Query.query, source: Query.source }, requestUser);

        if (!["spsearch", "sprec", "amsearch", "dzsearch", "dzisrc", "ytmsearch", "ytsearch"].includes(Query.source)) throw new SyntaxError(`Query.source must be a source from LavaSrc: "spsearch" | "sprec" | "amsearch" | "dzsearch" | "dzisrc" | "ytmsearch" | "ytsearch"`)

        if (!this.info.plugins.find(v => v.name === "lavasearch-plugin")) throw new RangeError(`there is no lavasearch-plugin available in the lavalink node: ${this.id}`);
        if (!this.info.plugins.find(v => v.name === "lavasrc-plugin")) throw new RangeError(`there is no lavasrc-plugin available in the lavalink node: ${this.id}`);

        const { response } = await this.rawRequest(`/loadsearch?query=${Query.source ? `${Query.source}:` : ""}${encodeURIComponent(Query.query)}${Query.types?.length ? `&types=${Query.types.join(",")}` : ""}`);

        const res = (response.status === 204 ? {} : await response.json()) as LavaSearchResponse;

        if (throwOnEmpty === true && !Object.entries(res).flat().filter(Boolean).length) {
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.LavaSearchNothingFound, {
                    state: "warn",
                    message: `LavaSearch found nothing for Request: "${Query.source ? `${Query.source}:` : ""}${Query.query}"`,
                    functionLayer: "(LavalinkNode > node | player) > lavaSearch()",
                });
            }
            throw new Error("Nothing found");
        }

        return {
            tracks: res.tracks?.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) || [],
            albums: res.albums?.map(v => ({ info: v.info, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            artists: res.artists?.map(v => ({ info: v.info, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            playlists: res.playlists?.map(v => ({ info: v.info, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.NodeManager.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            texts: res.texts?.map(v => ({ text: v.text, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo })) || [],
            pluginInfo: res.pluginInfo || (res as unknown as { plugin: unknown })?.plugin
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
    public async updatePlayer(data: PlayerUpdateInfo): Promise<LavalinkPlayer> {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");

        this.syncPlayerData(data);

        const res = await this.request(`/sessions/${this.sessionId}/players/${data.guildId}`, r => {
            r.method = "PATCH";

            r.headers!["Content-Type"] = "application/json";

            r.body = safeStringify(data.playerOptions);

            if (data.noReplace) {
                const url = new URL(`${this.restAddress}${r.path}`);
                url.searchParams.append("noReplace", data.noReplace === true && typeof data.noReplace === "boolean" ? "true" : "false")
                r.path = url.pathname + url.search;
            }
        }) as LavalinkPlayer;

        if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
            this.NodeManager.LavalinkManager.emit("debug", DebugEvents.PlayerUpdateSuccess, {
                state: "log",
                message: `Player get's updated with following payload :: ${safeStringify(data.playerOptions, 3)}`,
                functionLayer: "LavalinkNode > node > updatePlayer()",
            });
        }

        this.syncPlayerData({}, res)

        return res;
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
    public async destroyPlayer(guildId): Promise<void> {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");

        return this.request(`/sessions/${this.sessionId}/players/${guildId}`, r => { r.method = "DELETE"; });
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
    public connect(sessionId?: string): void {
        if (this.connected) {
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TryingConnectWhileConnected, {
                    state: "warn",
                    message: `Tryed to connect to node, but it's already connected!`,
                    functionLayer: "LavalinkNode > node > connect()",
                });
            }
            return;
        }

        const headers = {
            Authorization: this.options.authorization,
            "User-Id": this.NodeManager.LavalinkManager.options.client.id,
            "Client-Name": this.NodeManager.LavalinkManager.options.client.username || "Lavalink-Client",
        }

        if (typeof this.options.sessionId === "string" || typeof sessionId === "string") {
            headers["Session-Id"] = this.options.sessionId || sessionId;
            this.sessionId = this.options.sessionId || sessionId;
        }

        this.socket = new WebSocket(`ws${this.options.secure ? "s" : ""}://${this.options.host}:${this.options.port}/v4/websocket`, { headers });
        this.socket.on("open", this.open.bind(this));
        this.socket.on("close", (code, reason) => this.close(code, reason?.toString()));
        this.socket.on("message", this.message.bind(this));
        this.socket.on("error", this.error.bind(this));
        // this.socket.on("ping", () => this.heartBeat("ping")); // lavalink doesn'T send ping periodically, therefore we use the stats message
    }


    private heartBeat(): void {
        if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
            this.NodeManager.LavalinkManager.emit("debug", DebugEvents.HeartBeatTriggered, {
                state: "log",
                message: `Node Socket Heartbeat triggered, resetting old Timeout to 65000ms (should happen every 60s due to /stats event)`,
                functionLayer: "LavalinkNode > nodeEvent > stats > heartBeat()",
            });
        }

        if (this.pingTimeout) clearTimeout(this.pingTimeout);
        this.pingTimeout = setTimeout(() => {
            this.pingTimeout = null;
            if (!this.socket) {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.NoSocketOnDestroy, {
                        state: "error",
                        message: `Heartbeat registered a disconnect, but socket didn't exist therefore can't terminate`,
                        functionLayer: "LavalinkNode > nodeEvent > stats > heartBeat() > timeoutHit",
                    });
                }
                return;
            }
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.SocketTerminateHeartBeatTimeout, {
                    state: "warn",
                    message: `Heartbeat registered a disconnect, because timeout wasn't resetted in time. Terminating Web-Socket`,
                    functionLayer: "LavalinkNode > nodeEvent > stats > heartBeat() > timeoutHit",
                });
            }
            this.isAlive = false;
            this.socket.terminate();
        }, 65_000); // the stats endpoint get's sent every 60s. se wee add a 5s buffer to make sure we don't miss any stats message
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
    public get id(): string {
        return this.options.id || `${this.options.host}:${this.options.port}`;
    }

    /**
     * Destroys the Node-Connection (Websocket) and all player's of the node
     * @param destroyReason Destroy Reason to use when destroying the players
     * @param deleteNode wether to delete the nodte from the nodes list too, if false it will emit a disconnect. @default true
     * @param movePlayers whether to movePlayers to different eligible connected node. If false players won't be moved @default false
     * @returns void
     *
     * @example
     * Destroys node and its players
     * ```ts
     * player.node.destroy("custom Player Destroy Reason", true);
     * ```
     * destroys only the node and moves its players to different connected node.
     * ```ts
     * player.node.destroy("custom Player Destroy Reason", true, true);
     * ```
     */
    public destroy(destroyReason?: DestroyReasonsType, deleteNode: boolean = true, movePlayers: boolean = false): void {
        // if (!this.connected) return; This Prevents the node from being destroyed if it is not connected, but we want to allow it to be destroyed even if not connected.

        const players = this.NodeManager.LavalinkManager.players.filter(p => p.node.id === this.id);
        if (players.size) {
            const enableDebugEvents = this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents;
            const handlePlayerOperations = () => {
                if (movePlayers) {
                    const nodeToMove = Array.from(this.NodeManager.leastUsedNodes("playingPlayers"))
                        .find(n => n.connected && n.options.id !== this.id);

                    if (nodeToMove) {
                        return Promise.allSettled(Array.from(players.values()).map(player =>
                            player.changeNode(nodeToMove.options.id)
                                .catch(error => {
                                    if (enableDebugEvents) {
                                        console.error(`Node > destroy() Failed to move player ${player.guildId}: ${error.message}`);
                                    }
                                    return player.destroy(error.message ?? DestroyReasons.PlayerChangeNodeFail)
                                        .catch(destroyError => {
                                            if (enableDebugEvents) {
                                                console.error(`Node > destroy() Failed to destroy player ${player.guildId} after move failure: ${destroyError.message}`);
                                            }
                                        });
                                })
                        ));
                    } else {
                        return Promise.allSettled(Array.from(players.values()).map(player =>
                            player.destroy(DestroyReasons.PlayerChangeNodeFailNoEligibleNode)
                                .catch(error => {
                                    if (enableDebugEvents) {
                                        console.error(`Node > destroy() Failed to destroy player ${player.guildId}: ${error.message}`);
                                    }
                                })
                        ));
                    }
                } else {
                    return Promise.allSettled(Array.from(players.values()).map(player =>
                        player.destroy(destroyReason || DestroyReasons.NodeDestroy)
                            .catch(error => {
                                if (enableDebugEvents) {
                                    console.error(`Node > destroy() Failed to destroy player ${player.guildId}: ${error.message}`);
                                }
                            })
                    ));
                }
            };

            // Handle all player operations first, then clean up the socket
            handlePlayerOperations().finally(() => {
                this.socket.close(1000, "Node-Destroy");
                this.socket.removeAllListeners();
                this.socket = null;
                this.reconnectAttempts = 1;
                clearTimeout(this.reconnectTimeout);

                if (deleteNode) {
                    this.NodeManager.emit("destroy", this, destroyReason);
                    this.NodeManager.nodes.delete(this.id);
                    clearInterval(this.heartBeatInterval);
                    clearTimeout(this.pingTimeout);
                } else {
                    this.NodeManager.emit("disconnect", this, { code: 1000, reason: destroyReason });
                }
            });
        } else { // If no players, proceed with socket cleanup immediately
            this.socket.close(1000, "Node-Destroy");
            this.socket.removeAllListeners();
            this.socket = null;
            this.reconnectAttempts = 1;
            clearTimeout(this.reconnectTimeout);

            if (deleteNode) {
                this.NodeManager.emit("destroy", this, destroyReason);
                this.NodeManager.nodes.delete(this.id);
                clearInterval(this.heartBeatInterval);
                clearTimeout(this.pingTimeout);
            } else {
                this.NodeManager.emit("disconnect", this, { code: 1000, reason: destroyReason });
            }
        }
        return;
    }

    /**
     * Disconnects the Node-Connection (Websocket)
     * @param disconnectReason Disconnect Reason to use when disconnecting Node
     * @returns void
     *
     * Also the node will not get re-connected again.
     *
     * @example
     * ```ts
     * player.node.destroy("custom Player Destroy Reason", true);
     * ```
     */
    public disconnect(disconnectReason?: DisconnectReasonsType) {
        if (!this.connected) return

        this.socket.close(1000, "Node-Disconnect");
        this.socket.removeAllListeners();
        this.socket = null;

        this.reconnectAttempts = 1;
        clearTimeout(this.reconnectTimeout);

        this.NodeManager.emit("disconnect", this, { code: 1000, reason: disconnectReason });
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
    public get connected(): boolean {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
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
    public get connectionStatus(): string {
        if (!this.socket) throw new Error("no websocket was initialized yet");
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
    public async fetchAllPlayers(): Promise<LavalinkPlayer[] | InvalidLavalinkRestRequest | null> {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return this.request(`/sessions/${this.sessionId}/players`) as Promise<LavalinkPlayer[] | InvalidLavalinkRestRequest | null> || [] as LavalinkPlayer[];
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
    public async fetchPlayer(guildId: string): Promise<LavalinkPlayer | InvalidLavalinkRestRequest | null> {
        if (!this.sessionId) throw new Error("The Lavalink-Node is either not ready, or not up to date!");
        return this.request(`/sessions/${this.sessionId}/players/${guildId}`) as Promise<LavalinkPlayer | InvalidLavalinkRestRequest | null>;
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
    public async updateSession(resuming?: boolean, timeout?: number): Promise<Session | InvalidLavalinkRestRequest | null> {
        if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
        const data = {} as Session;
        if (typeof resuming === "boolean") data.resuming = resuming;
        if (typeof timeout === "number" && timeout > 0) data.timeout = timeout;
        this.resuming = {
            enabled: typeof resuming === "boolean" ? resuming : false,
            timeout: typeof resuming === "boolean" && resuming === true ? timeout : null,
        };
        return this.request(`/sessions/${this.sessionId}`, r => {
            r.method = "PATCH";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' }
            r.body = safeStringify(data);
        }) as Promise<Session | InvalidLavalinkRestRequest | null>;
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
        singleTrack: async (encoded: Base64, requester: unknown): Promise<Track> => {
            if (!encoded) throw new SyntaxError("No encoded (Base64 string) was provided");
            // return the decoded + builded track
            return this.NodeManager.LavalinkManager.utils?.buildTrack(await this.request(`/decodetrack?encodedTrack=${encodeURIComponent(encoded.replace(/\s/g, ""))}`) as LavalinkTrack, requester);
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
        multipleTracks: async (encodeds: Base64[], requester: unknown): Promise<Track[]> => {
            if (!Array.isArray(encodeds) || !encodeds.every(v => typeof v === "string" && v.length > 1)) throw new SyntaxError("You need to provide encodeds, which is an array of base64 strings")
            // return the decoded + builded tracks
            return await this.request(`/decodetracks`, r => {
                r.method = "POST";
                r.body = safeStringify(encodeds);

                r.headers!["Content-Type"] = "application/json";
            }).then((r: LavalinkTrack[]) => r.map(track => this.NodeManager.LavalinkManager.utils.buildTrack(track, requester)));
        }
    }

    lyrics = {
        /**
         * Get the lyrics of a track
         * @param track the track to get the lyrics for
         * @param skipTrackSource wether to skip the track source or not
         * @returns the lyrics of the track
         * @example
         *
         * ```ts
         * const lyrics = await player.node.lyrics.get(track, true);
         * // use it of player instead:
         * // const lyrics = await player.getLyrics(track, true);
         * ```
         */
        get: async (track: Track, skipTrackSource: boolean = false): Promise<LyricsResult | null> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");

            if (
                !this.info.plugins.find(v => v.name === "lavalyrics-plugin")
            ) throw new RangeError(`there is no lavalyrics-plugin available in the lavalink node (required for lyrics): ${this.id}`);

            if (
                !this.info.plugins.find(v => v.name === "lavasrc-plugin") &&
                !this.info.plugins.find(v => v.name === "java-lyrics-plugin")
            ) throw new RangeError(`there is no lyrics source (via lavasrc-plugin / java-lyrics-plugin) available in the lavalink node (required for lyrics): ${this.id}`);

            const url = `/lyrics?track=${track.encoded}&skipTrackSource=${skipTrackSource}`;
            return (await this.request(url)) as LyricsResult | null;
        },

        /**
         * Get the lyrics of the current playing track
         *
         * @param guildId the guild id of the player
         * @param skipTrackSource wether to skip the track source or not
         * @returns the lyrics of the current playing track
         * @example
         * ```ts
         * const lyrics = await player.node.lyrics.getCurrent(guildId);
         * // use it of player instead:
         * // const lyrics = await player.getCurrentLyrics();
         * ```
         */
        getCurrent: async (guildId: string, skipTrackSource: boolean = false): Promise<LyricsResult | null> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");

            if (
                !this.info.plugins.find(v => v.name === "lavalyrics-plugin")
            ) throw new RangeError(`there is no lavalyrics-plugin available in the lavalink node (required for lyrics): ${this.id}`);

            if (
                !this.info.plugins.find(v => v.name === "lavasrc-plugin") &&
                !this.info.plugins.find(v => v.name === "java-lyrics-plugin")
            ) throw new RangeError(`there is no lyrics source (via lavasrc-plugin / java-lyrics-plugin) available in the lavalink node (required for lyrics): ${this.id}`);

            const url = `/sessions/${this.sessionId}/players/${guildId}/track/lyrics?skipTrackSource=${skipTrackSource}`;
            return (await this.request(url)) as LyricsResult | null;
        },

        /**
         * subscribe to lyrics updates for a guild
         * @param guildId the guild id of the player
         * @returns request data of the request
         *
         * @example
         * ```ts
         * await player.node.lyrics.subscribe(guildId);
         * // use it of player instead:
         * // const lyrics = await player.subscribeLyrics();
         * ```
         */

        subscribe: async (guildId: string): Promise<unknown> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");

            if (
                !this.info.plugins.find(v => v.name === "lavalyrics-plugin")
            ) throw new RangeError(`there is no lavalyrics-plugin available in the lavalink node (required for lyrics): ${this.id}`);

            if (
                !this.info.plugins.find(v => v.name === "lavasrc-plugin") &&
                !this.info.plugins.find(v => v.name === "java-lyrics-plugin")
            ) throw new RangeError(`there is no lyrics source (via lavasrc-plugin / java-lyrics-plugin) available in the lavalink node (required for lyrics): ${this.id}`);

            return await this.request(`/sessions/${this.sessionId}/players/${guildId}/lyrics/subscribe`, (options) => {
                options.method = "POST";
            });
        },
        /**
         * unsubscribe from lyrics updates for a guild
         * @param guildId the guild id of the player
         * @returns request data of the request
         *
         * @example
         * ```ts
         * await player.node.lyrics.unsubscribe(guildId);
         * // use it of player instead:
         * // const lyrics = await player.unsubscribeLyrics();
         * ```
         */
        unsubscribe: async (guildId: string): Promise<void> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");

            if (
                !this.info.plugins.find(v => v.name === "lavalyrics-plugin")
            ) throw new RangeError(`there is no lavalyrics-plugin available in the lavalink node (required for lyrics): ${this.id}`);

            if (
                !this.info.plugins.find(v => v.name === "lavasrc-plugin") &&
                !this.info.plugins.find(v => v.name === "java-lyrics-plugin")
            ) throw new RangeError(`there is no lyrics source (via lavasrc-plugin / java-lyrics-plugin) available in the lavalink node (required for lyrics): ${this.id}`);

            return await this.request(`/sessions/${this.sessionId}/players/${guildId}/lyrics/subscribe`, (options) => {
                options.method = "DELETE";
            });
        },
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
    public async fetchStats(): Promise<BaseNodeStats> {
        return await this.request(`/stats`) as BaseNodeStats;
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
    public async fetchVersion(): Promise<string> {
        // need to adjust path for no-prefix version info
        return await this.request(`/version`, r => { r.path = "/version"; }, true) as string;
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
    public async fetchInfo(): Promise<LavalinkInfo> {
        return await this.request(`/info`) as LavalinkInfo;
    }

    /**
     * Lavalink's Route Planner Api
     */
    public routePlannerApi = {
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
        getStatus: async (): Promise<RoutePlanner> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            return await this.request(`/routeplanner/status`) as RoutePlanner;
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
        unmarkFailedAddress: async (address: string): Promise<unknown> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            return await this.request(`/routeplanner/free/address`, r => {
                r.method = "POST";

                r.headers!["Content-Type"] = "application/json";
                r.body = safeStringify({ address });
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
        unmarkAllFailedAddresses: async (): Promise<unknown> => {
            if (!this.sessionId) throw new Error("the Lavalink-Node is either not ready, or not up to date!");
            return await this.request(`/routeplanner/free/all`, r => {
                r.method = "POST";

                r.headers!["Content-Type"] = "application/json";
            });
        }
    }

    /** @private Utils for validating the */
    private validate(): void {
        if (!this.options.authorization) throw new SyntaxError("LavalinkNode requires 'authorization'");
        if (!this.options.host) throw new SyntaxError("LavalinkNode requires 'host'");
        if (!this.options.port) throw new SyntaxError("LavalinkNode requires 'port'");
        // TODO add more validations
    }

    /**
     * Sync the data of the player you make an action to lavalink to
     * @param data data to use to update the player
     * @param res result data from lavalink, to override, if available
     * @returns boolean
     */
    private syncPlayerData(data: Partial<PlayerUpdateInfo>, res?: LavalinkPlayer): void {
        if (typeof data === "object" && typeof data?.guildId === "string" && typeof data.playerOptions === "object" && Object.keys(data.playerOptions).length > 0) {
            const player = this.NodeManager.LavalinkManager.getPlayer(data.guildId);
            if (!player) return;

            if (typeof data.playerOptions.paused !== "undefined") {
                player.paused = data.playerOptions.paused;
                player.playing = !data.playerOptions.paused;
            }

            if (typeof data.playerOptions.position === "number") {
                // player.position = data.playerOptions.position;
                player.lastPosition = data.playerOptions.position;
                player.lastPositionChange = Date.now();
            }

            if (typeof data.playerOptions.voice !== "undefined") player.voice = data.playerOptions.voice;
            if (typeof data.playerOptions.volume !== "undefined") {
                if (this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer) {
                    player.volume = Math.round(data.playerOptions.volume / this.NodeManager.LavalinkManager.options.playerOptions.volumeDecrementer);
                    player.lavalinkVolume = Math.round(data.playerOptions.volume);
                } else {
                    player.volume = Math.round(data.playerOptions.volume);
                    player.lavalinkVolume = Math.round(data.playerOptions.volume);
                }
            }

            if (typeof data.playerOptions.filters !== "undefined") {
                const oldFilterTimescale = { ...player.filterManager.data.timescale };
                Object.freeze(oldFilterTimescale);
                if (data.playerOptions.filters.timescale) player.filterManager.data.timescale = data.playerOptions.filters.timescale;
                if (data.playerOptions.filters.distortion) player.filterManager.data.distortion = data.playerOptions.filters.distortion;
                if (data.playerOptions.filters.pluginFilters) player.filterManager.data.pluginFilters = data.playerOptions.filters.pluginFilters;
                if (data.playerOptions.filters.vibrato) player.filterManager.data.vibrato = data.playerOptions.filters.vibrato;
                if (data.playerOptions.filters.volume) player.filterManager.data.volume = data.playerOptions.filters.volume;
                if (data.playerOptions.filters.equalizer) player.filterManager.equalizerBands = data.playerOptions.filters.equalizer;
                if (data.playerOptions.filters.karaoke) player.filterManager.data.karaoke = data.playerOptions.filters.karaoke;
                if (data.playerOptions.filters.lowPass) player.filterManager.data.lowPass = data.playerOptions.filters.lowPass;
                if (data.playerOptions.filters.rotation) player.filterManager.data.rotation = data.playerOptions.filters.rotation;
                if (data.playerOptions.filters.tremolo) player.filterManager.data.tremolo = data.playerOptions.filters.tremolo;
                player.filterManager.checkFiltersState(oldFilterTimescale);
            }
        }

        // just for res
        if (res?.guildId === "string" && typeof res?.voice !== "undefined") {
            const player = this.NodeManager.LavalinkManager.getPlayer(data.guildId);
            if (!player) return;

            if (typeof res?.voice?.connected === "boolean" && res.voice.connected === false) {
                player.destroy(DestroyReasons.LavalinkNoVoice);
                return;
            }
            player.ping.ws = res?.voice?.ping || player?.ping.ws;
        }

        return;
    }

    /**
     * Get the rest Adress for making requests
     */
    private get restAddress(): string {
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
    private reconnect(instaReconnect = false): void {
        this.NodeManager.emit("reconnectinprogress", this);
        if (instaReconnect) {
            if (this.reconnectAttempts >= this.options.retryAmount) {
                const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`)

                this.NodeManager.emit("error", this, error);
                return this.destroy(DestroyReasons.NodeReconnectFail);
            }
            this.socket.removeAllListeners();
            this.socket = null;
            this.NodeManager.emit("reconnecting", this);
            this.connect();
            this.reconnectAttempts++;
            return;
        }
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            if (this.reconnectAttempts >= this.options.retryAmount) {
                const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`)
                this.NodeManager.emit("error", this, error);
                return this.destroy(DestroyReasons.NodeReconnectFail);
            }
            this.socket.removeAllListeners();
            this.socket = null;
            this.NodeManager.emit("reconnecting", this);
            this.connect();
            this.reconnectAttempts++;
        }, this.options.retryDelay || 1000);
    }

    /** @private util function for handling opening events from websocket */
    private async open(): Promise<void> {
        this.isAlive = true;

        // trigger heartbeat-ping timeout - this is to check wether the client lost connection without knowing it
        if (this.options.enablePingOnStatsCheck) this.heartBeat();

        if (this.heartBeatInterval) clearInterval(this.heartBeatInterval);

        if (this.options.heartBeatInterval > 0) {
            // everytime a pong happens, set this.isAlive to true
            this.socket.on("pong", () => {
                this.heartBeatPongTimestamp = performance.now();
                this.isAlive = true;
            });

            // every x ms send a ping to lavalink to retrieve a pong later on
            this.heartBeatInterval = setInterval(() => {
                if (!this.socket) return console.error("Node-Heartbeat-Interval - Socket not available - maybe reconnecting?");
                if (!this.isAlive) this.close(500, "Node-Heartbeat-Timeout");

                this.isAlive = false;
                this.heartBeatPingTimestamp = performance.now();
                this.socket.ping();
            }, this.options.heartBeatInterval || 30_000);
        }


        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
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
    private close(code: number, reason: string): void {
        if (this.pingTimeout) clearTimeout(this.pingTimeout);
        if (this.heartBeatInterval) clearInterval(this.heartBeatInterval);
        if (code === 1006 && !reason) reason = "Socket got terminated due to no ping connection";
        if (code === 1000 && reason === "Node-Disconnect") return; // manually disconnected and already emitted the event.

        this.NodeManager.emit("disconnect", this, { code, reason });

        if (code !== 1000 || reason !== "Node-Destroy") {
            if (this.NodeManager.nodes.has(this.id)) { // try to reconnect only when the node is still in the nodeManager.nodes list
                this.reconnect();
            }
        }
    }

    /** @private util function for handling error events from websocket */
    private error(error: Error): void {
        if (!error) return;
        this.NodeManager.emit("error", this, error);
        if (this.options.closeOnError) {
            if (this.heartBeatInterval) clearInterval(this.heartBeatInterval);
            if (this.pingTimeout) clearTimeout(this.pingTimeout);
            this.socket?.close(500, "Node-Error - Force Reconnect")
        };
    }

    /** @private util function for handling message events from websocket */
    private async message(d: Buffer | string): Promise<void> {
        if (Array.isArray(d)) d = Buffer.concat(d);
        else if (d instanceof ArrayBuffer) d = Buffer.from(d);

        let payload;
        try {
            payload = JSON.parse(d.toString());
        } catch (e) {
            this.NodeManager.emit("error", this, e);
            return;
        }

        if (!payload.op) return;

        this.NodeManager.emit("raw", this, payload);

        switch (payload.op) {
            case "stats":
                if (this.options.enablePingOnStatsCheck) this.heartBeat(); // lavalink doesn'T send "ping" periodically, therefore we use the stats message to check for a ping
                delete payload.op;
                this.stats = ({ ...payload } as unknown) as NodeStats;
                break;
            case "playerUpdate": {
                const player = this.NodeManager.LavalinkManager.getPlayer(payload.guildId);
                if (!player) {
                    if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                        this.NodeManager.LavalinkManager.emit("debug", DebugEvents.PlayerUpdateNoPlayer, {
                            state: "error",
                            message: `PlayerUpdate Event Triggered, but no player found of payload.guildId: ${payload.guildId}`,
                            functionLayer: "LavalinkNode > nodeEvent > playerUpdate",
                        });
                    }
                    return;
                }

                const oldPlayer = player?.toJSON();

                player.lastPositionChange = Date.now();
                player.lastPosition = payload.state.position || 0;
                player.connected = payload.state.connected;
                player.ping.ws = payload.state.ping >= 0 ? payload.state.ping : player.ping.ws <= 0 && player.connected ? null : player.ping.ws || 0;

                if (!player.createdTimeStamp && payload.state.time) player.createdTimeStamp = payload.state.time;

                if (player.filterManager.filterUpdatedState === true && ((player.queue.current?.info?.duration || 0) <= (player.LavalinkManager.options.advancedOptions.maxFilterFixDuration || 600_000) || (player.queue.current?.info?.uri && isAbsolute(player.queue.current?.info?.uri)))) {
                    player.filterManager.filterUpdatedState = false;

                    if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                        this.NodeManager.LavalinkManager.emit("debug", DebugEvents.PlayerUpdateFilterFixApply, {
                            state: "log",
                            message: `Fixing FilterState on "${player.guildId}" because player.options.instaUpdateFiltersFix === true`,
                            functionLayer: "LavalinkNode > nodeEvent > playerUpdate",
                        });
                    }

                    await player.seek(player.position)
                }
                this.NodeManager.LavalinkManager.emit("playerUpdate", oldPlayer, player);
            } break;
            case "event":
                this.handleEvent(payload);
                break;
            case "ready":  // payload: { resumed: false, sessionId: 'ytva350aevn6n9n8', op: 'ready' }
                this.sessionId = payload.sessionId;
                this.resuming.enabled = payload.resumed;
                if (payload.resumed === true) {
                    try {
                        this.NodeManager.emit("resumed", this, payload, await this.fetchAllPlayers())
                    } catch (e) {
                        if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                            this.NodeManager.LavalinkManager.emit("debug", DebugEvents.ResumingFetchingError, {
                                state: "error",
                                message: `Failed to fetch players for resumed event, falling back without players array`,
                                error: e,
                                functionLayer: "LavalinkNode > nodeEvent > resumed",
                            });
                        }
                        this.NodeManager.emit("resumed", this, payload, [])
                    }
                }
                break;
            default:
                this.NodeManager.emit("error", this, new Error(`Unexpected op "${payload.op}" with data`), payload);
                return;
        }
    }

    /** @private middleware util function for handling all kind of events from websocket */
    private async handleEvent(payload: PlayerEventType & PlayerEvents): Promise<void> {
        if (!payload?.guildId) return;

        const player = this.NodeManager.LavalinkManager.getPlayer(payload.guildId);
        if (!player) return;


        switch (payload.type) {
            case "TrackStartEvent": this.trackStart(player, player.queue.current as Track, payload); break;
            case "TrackEndEvent": this.trackEnd(player, player.queue.current as Track, payload); break;
            case "TrackStuckEvent": this.trackStuck(player, player.queue.current as Track, payload); break;
            case "TrackExceptionEvent": this.trackError(player, player.queue.current as Track, payload); break;
            case "WebSocketClosedEvent": this.socketClosed(player, payload); break;
            case "SegmentsLoaded": this.SponsorBlockSegmentLoaded(player, player.queue.current as Track, payload); break;
            case "SegmentSkipped": this.SponsorBlockSegmentSkipped(player, player.queue.current as Track, payload); break;
            case "ChaptersLoaded": this.SponsorBlockChaptersLoaded(player, player.queue.current as Track, payload); break;
            case "ChapterStarted": this.SponsorBlockChapterStarted(player, player.queue.current as Track, payload); break;
            case "LyricsLineEvent": this.LyricsLine(player, player.queue.current as Track, payload); break;
            case "LyricsFoundEvent": this.LyricsFound(player, player.queue.current as Track, payload); break;
            case "LyricsNotFoundEvent": this.LyricsNotFound(player, player.queue.current as Track, payload); break;
            default: this.NodeManager.emit("error", this, new Error(`Node#event unknown event '${(payload as PlayerEventType & PlayerEvents).type}'.`), (payload as PlayerEventType & PlayerEvents)); break;
        }
        return;
    }


    private getTrackOfPayload(payload: PlayerEvents): Track | null {
        return "track" in payload
            ? this.NodeManager.LavalinkManager.utils.buildTrack(payload.track, undefined)
            : null;
    }
    /** @private util function for handling trackStart event */
    private async trackStart(player: Player, track: Track, payload: TrackStartEvent): Promise<void> {
        if (!player.get('internal_nodeChanging')) { // Don't change the playing state if a nodeChange is in progress.

            player.playing = true;
            player.paused = false;
        }
        // don't emit the event if previous track == new track aka track loop
        if (this.NodeManager.LavalinkManager.options?.emitNewSongsOnly === true && player.queue.previous[0]?.info?.identifier === track?.info?.identifier) {
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackStartNewSongsOnly, {
                    state: "log",
                    message: `TrackStart not Emitting, because playing the previous song again.`,
                    functionLayer: "LavalinkNode > trackStart()",
                });
            }
            return;
        }
        if (!player.queue.current) {
            player.queue.current = this.getTrackOfPayload(payload);
            if (player.queue.current) {
                await player.queue.utils.save();
            }
            else {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackStartNoTrack, {
                        state: "warn",
                        message: `Trackstart emitted but there is no track on player.queue.current, trying to get the track of the payload failed too.`,
                        functionLayer: "LavalinkNode > trackStart()",
                    });
                }
            }
        }
        this.NodeManager.LavalinkManager.emit("trackStart", player, player.queue.current, payload);
        return;
    }

    /** @private util function for handling trackEnd event */
    private async trackEnd(player: Player, track: Track, payload: TrackEndEvent): Promise<void> {
        if (player.get('internal_nodeChanging') === true) return; // Check if nodeChange is in Progress than stop the trackEnd Event from being triggered.
        const trackToUse = track || this.getTrackOfPayload(payload);
        // If a track was forcibly played
        if (payload.reason === "replaced") {
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackEndReplaced, {
                    state: "warn",
                    message: `TrackEnd Event does not handle any playback, because the track was replaced.`,
                    functionLayer: "LavalinkNode > trackEnd()",
                });
            }
            this.NodeManager.LavalinkManager.emit("trackEnd", player, trackToUse, payload);
            return;
        }
        // If there are no songs in the queue
        if (!player.queue.tracks.length && (player.repeatMode === "off" || player.get("internal_stopPlaying"))) return this.queueEnd(player, track, payload);
        // If a track had an error while starting
        if (["loadFailed", "cleanup"].includes(payload.reason)) {
            //Dont add tracks if the player is already destroying.
            if (player.get("internal_destroystatus") === true) return;
            await queueTrackEnd(player);
            // if no track available, end queue
            if (!player.queue.current) return this.queueEnd(player, trackToUse, payload);
            // fire event
            this.NodeManager.LavalinkManager.emit("trackEnd", player, trackToUse, payload);
            // play track if autoSkip is true
            if (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) {
                player.play({ noReplace: true });
            }
            return;
        }
        // remove tracks from the queue
        if (player.repeatMode !== "track" || player.get("internal_skipped")) await queueTrackEnd(player);
        else if (trackToUse && !trackToUse?.pluginInfo?.clientData?.previousTrack) { // If there was a current Track already and repeatmode === true, add it to the queue.
            player.queue.previous.unshift(trackToUse as Track);
            if (player.queue.previous.length > player.queue.options.maxPreviousTracks) player.queue.previous.splice(player.queue.options.maxPreviousTracks, player.queue.previous.length);
            await player.queue.utils.save();
        }
        // if no track available, end queue
        if (!player.queue.current) return this.queueEnd(player, trackToUse, payload);
        player.set("internal_skipped", false);
        // fire event
        this.NodeManager.LavalinkManager.emit("trackEnd", player, trackToUse, payload);
        // play track if autoSkip is true
        if (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) {
            player.play({ noReplace: true });
        }
        return;
    }

    /** @private util function for handling trackStuck event */
    private async trackStuck(player: Player, track: Track, payload: TrackStuckEvent): Promise<void> {
        if (this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.threshold > 0 && this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.maxAmount >= 0) {
            const oldTimestamps = (player.get("internal_erroredTracksTimestamps") as number[] || [])
                .filter(v => Date.now() - v < this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.threshold);
            player.set("internal_erroredTracksTimestamps", [...oldTimestamps, Date.now()]);
            if (oldTimestamps.length > this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.maxAmount) {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackStuckMaxTracksErroredPerTime, {
                        state: "log",
                        message: `trackStuck Event was triggered too often within a given threshold (LavalinkManager.options.playerOptions.maxErrorsPerTime). Threshold: "${this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.threshold}ms", maxAmount: "${this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.maxAmount}"`,
                        functionLayer: "LavalinkNode > trackStuck()",
                    });
                }
                player.destroy(DestroyReasons.TrackStuckMaxTracksErroredPerTime)
                return;
            }
        }
        this.NodeManager.LavalinkManager.emit("trackStuck", player, track || this.getTrackOfPayload(payload), payload);
        // If there are no songs in the queue
        if (!player.queue.tracks.length && (player.repeatMode === "off" || player.get("internal_stopPlaying"))) {
            try { //Sometimes the trackStuck event triggers from the Lavalink server, but the track continues playing or resumes after. We explicitly end the track in such cases
                await player.node.updatePlayer({ guildId: player.guildId, playerOptions: { track: { encoded: null } } });  //trackEnd -> queueEnd
                return;
            } catch {
                return this.queueEnd(player, track || this.getTrackOfPayload(payload), payload);
            }
        }
        // remove the current track, and enqueue the next one
        await queueTrackEnd(player);
        // if no track available, end queue
        if (!player.queue.current) {
            return this.queueEnd(player, track || this.getTrackOfPayload(payload), payload);
        }
        // play track if autoSkip is true
        if (this.NodeManager.LavalinkManager.options.autoSkip && player.queue.current) {
            player.play({ track: player.queue.current, noReplace: false }); // Replace the stuck track with the new track.
        }
        return;
    }

    /** @private util function for handling trackError event */
    private async trackError(
        player: Player,
        track: Track,
        payload: TrackExceptionEvent
    ): Promise<void> {
        if (this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.threshold > 0 && this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.maxAmount >= 0) {
            const oldTimestamps = (player.get("internal_erroredTracksTimestamps") as number[] || [])
                .filter(v => Date.now() - v < this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.threshold);
            player.set("internal_erroredTracksTimestamps", [...oldTimestamps, Date.now()]);
            if (oldTimestamps.length > this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.maxAmount) {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackErrorMaxTracksErroredPerTime, {
                        state: "log",
                        message: `TrackError Event was triggered too often within a given threshold (LavalinkManager.options.playerOptions.maxErrorsPerTime). Threshold: "${this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.threshold}ms", maxAmount: "${this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime?.maxAmount}"`,
                        functionLayer: "LavalinkNode > trackError()",
                    });
                }
                player.destroy(DestroyReasons.TrackErrorMaxTracksErroredPerTime)
                return;
            }
        }

        this.NodeManager.LavalinkManager.emit("trackError", player, track || this.getTrackOfPayload(payload), payload);
        return;
    }

    /** @private util function for handling socketClosed event */
    private socketClosed(player: Player, payload: WebSocketClosedEvent): void {
        this.NodeManager.LavalinkManager.emit("playerSocketClosed", player, payload);
        return;
    }

    /** @private util function for handling SponsorBlock Segmentloaded event */
    private SponsorBlockSegmentLoaded(player: Player, track: Track, payload: SponsorBlockSegmentsLoaded): void {
        this.NodeManager.LavalinkManager.emit("SegmentsLoaded", player, track || this.getTrackOfPayload(payload), payload);
        return;
    }

    /** @private util function for handling SponsorBlock SegmentSkipped event */
    private SponsorBlockSegmentSkipped(player: Player, track: Track, payload: SponsorBlockSegmentSkipped): void {
        this.NodeManager.LavalinkManager.emit("SegmentSkipped", player, track || this.getTrackOfPayload(payload), payload);
        return;
    }

    /** @private util function for handling SponsorBlock Chaptersloaded event */
    private SponsorBlockChaptersLoaded(player: Player, track: Track, payload: SponsorBlockChaptersLoaded): void {
        this.NodeManager.LavalinkManager.emit("ChaptersLoaded", player, track || this.getTrackOfPayload(payload), payload);
        return;
    }

    /** @private util function for handling SponsorBlock Chaptersstarted event */
    private SponsorBlockChapterStarted(player: Player, track: Track, payload: SponsorBlockChapterStarted): void {
        this.NodeManager.LavalinkManager.emit("ChapterStarted", player, track || this.getTrackOfPayload(payload), payload);
        return;
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
    public async getSponsorBlock(player: Player): Promise<SponsorBlockSegment[]> {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin")) throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // do the request
        return await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`) as SponsorBlockSegment[];
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
    public async setSponsorBlock(player: Player, segments: SponsorBlockSegment[] = ["sponsor", "selfpromo"]): Promise<void> {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin")) throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // no segments length
        if (!segments.length) throw new RangeError("No Segments provided. Did you ment to use 'deleteSponsorBlock'?")
        // a not valid segment
        if (segments.some(v => !validSponsorBlocks.includes(v.toLowerCase()))) throw new SyntaxError(`You provided a sponsorblock which isn't valid, valid ones are: ${validSponsorBlocks.map(v => `'${v}'`).join(", ")}`)
        // do the request
        await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`, (r) => {
            r.method = "PUT";
            r.headers = { Authorization: this.options.authorization, 'Content-Type': 'application/json' }
            r.body = safeStringify(segments.map(v => v.toLowerCase()));
        });

        player.set("internal_sponsorBlockCategories", segments.map(v => v.toLowerCase()));

        if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
            this.NodeManager.LavalinkManager.emit("debug", DebugEvents.SetSponsorBlock, {
                state: "log",
                message: `SponsorBlock was set for Player: ${player.guildId} to: ${segments.map(v => `'${v.toLowerCase()}'`).join(", ")}`,
                functionLayer: "LavalinkNode > setSponsorBlock()",
            });
        }

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
    public async deleteSponsorBlock(player: Player): Promise<void> {
        // no plugin enabled
        if (!this.info.plugins.find(v => v.name === "sponsorblock-plugin")) throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.id}`);
        // do the request
        await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/sponsorblock/categories`, (r) => {
            r.method = "DELETE";
        });

        player.set("internal_sponsorBlockCategories", []);

        if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
            this.NodeManager.LavalinkManager.emit("debug", DebugEvents.DeleteSponsorBlock, {
                state: "log",
                message: `SponsorBlock was deleted for Player: ${player.guildId}`,
                functionLayer: "LavalinkNode > deleteSponsorBlock()",
            });
        }
        return;
    }

    /** private util function for handling the queue end event */
    private async queueEnd(player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent): Promise<void> {
        if (player.get('internal_nodeChanging') === true) return; // Check if nodeChange is in Progress than stop the queueEnd Event from being triggered.
        // add previous track to the queue!
        player.queue.current = null;
        player.playing = false;
        player.set("internal_stopPlaying", undefined);

        if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
            this.NodeManager.LavalinkManager.emit("debug", DebugEvents.QueueEnded, {
                state: "log",
                message: `Queue Ended because no more Tracks were in the Queue, due to EventName: "${payload.type}"`,
                functionLayer: "LavalinkNode > queueEnd()",
            });
        }

        if (typeof this.NodeManager.LavalinkManager.options?.playerOptions?.onEmptyQueue?.autoPlayFunction === "function" && typeof player.get("internal_autoplayStopPlaying") === "undefined") {
            if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                this.NodeManager.LavalinkManager.emit("debug", DebugEvents.AutoplayExecution, {
                    state: "log",
                    message: `Now Triggering Autoplay.`,
                    functionLayer: "LavalinkNode > queueEnd() > autoplayFunction",
                });
            }

            const previousAutoplayTime = player.get("internal_previousautoplay") as number;
            const duration = previousAutoplayTime ? Date.now() - previousAutoplayTime : 0;
            if (!duration || duration > this.NodeManager.LavalinkManager.options.playerOptions.minAutoPlayMs || !!player.get("internal_skipped")) {
                await this.NodeManager.LavalinkManager.options?.playerOptions?.onEmptyQueue?.autoPlayFunction(player, track);
                player.set("internal_previousautoplay", Date.now());
                if (player.queue.tracks.length > 0) await queueTrackEnd(player);
                else if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.AutoplayNoSongsAdded, {
                        state: "warn",
                        message: `Autoplay was triggered but no songs were added to the queue.`,
                        functionLayer: "LavalinkNode > queueEnd() > autoplayFunction",
                    });
                }
                if (player.queue.current) {
                    if (payload.type === "TrackEndEvent") this.NodeManager.LavalinkManager.emit("trackEnd", player, track, payload);
                    if (this.NodeManager.LavalinkManager.options.autoSkip) return player.play({ noReplace: true, paused: false });
                }
            } else {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.AutoplayThresholdSpamLimiter, {
                        state: "warn",
                        message: `Autoplay was triggered after the previousautoplay too early. Threshold is: ${this.NodeManager.LavalinkManager.options.playerOptions.minAutoPlayMs}ms and the Duration was ${duration}ms`,
                        functionLayer: "LavalinkNode > queueEnd() > autoplayFunction",
                    });
                }
            }
        }

        player.set("internal_skipped", false);
        player.set("internal_autoplayStopPlaying", undefined);

        if (track && !track?.pluginInfo?.clientData?.previousTrack) { // If there was a current Track already and repeatmode === true, add it to the queue.
            player.queue.previous.unshift(track);
            if (player.queue.previous.length > player.queue.options.maxPreviousTracks) player.queue.previous.splice(player.queue.options.maxPreviousTracks, player.queue.previous.length);
            await player.queue.utils.save();
        }

        if ((payload as TrackEndEvent)?.reason !== "stopped") {
            await player.queue.utils.save();
        }

        if (typeof this.NodeManager.LavalinkManager.options.playerOptions?.onEmptyQueue?.destroyAfterMs === "number" && !isNaN(this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs) && this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs >= 0) {
            if (this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs === 0) {
                player.destroy(DestroyReasons.QueueEmpty);
                return;
            } else {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TriggerQueueEmptyInterval, {
                        state: "log",
                        message: `Trigger Queue Empty Interval was Triggered because playerOptions.onEmptyQueue.destroyAfterMs is set to ${this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs}ms`,
                        functionLayer: "LavalinkNode > queueEnd() > destroyAfterMs",
                    });
                }

                this.NodeManager.LavalinkManager.emit("playerQueueEmptyStart", player, this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs);

                if (player.get("internal_queueempty")) {
                    clearTimeout(player.get("internal_queueempty"));
                    player.set("internal_queueempty", undefined);
                }

                player.set("internal_queueempty", setTimeout(() => {
                    player.set("internal_queueempty", undefined);
                    if (player.queue.current) {
                        return this.NodeManager.LavalinkManager.emit("playerQueueEmptyCancel", player);
                    }
                    this.NodeManager.LavalinkManager.emit("playerQueueEmptyEnd", player);
                    player.destroy(DestroyReasons.QueueEmpty);
                }, this.NodeManager.LavalinkManager.options.playerOptions.onEmptyQueue?.destroyAfterMs))
            }
        }

        this.NodeManager.LavalinkManager.emit("queueEnd", player, track, payload);
        return;
    }

    /**
     * Emitted whenever a line of lyrics gets emitted
     * @event
     * @param {Player} player The player that emitted the event
     * @param {Track} track The track that emitted the event
     * @param {LyricsLineEvent} payload The payload of the event
     */
    private async LyricsLine(player: Player, track: Track, payload: LyricsLineEvent): Promise<void> {
        if (!player.queue.current) {
            player.queue.current = this.getTrackOfPayload(payload);
            if (player.queue.current) {
                await player.queue.utils.save();
            }
            else {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackStartNoTrack, {
                        state: "warn",
                        message: `Trackstart emitted but there is no track on player.queue.current, trying to get the track of the payload failed too.`,
                        functionLayer: "LavalinkNode > trackStart()",
                    });
                }
            }
        }

        this.NodeManager.LavalinkManager.emit("LyricsLine", player, track, payload);
        return;
    }

    /**
     * Emitted whenever the lyrics for a track got found
     * @event
     * @param {Player} player The player that emitted the event
     * @param {Track} track The track that emitted the event
     * @param {LyricsFoundEvent} payload The payload of the event
     */
    private async LyricsFound(player: Player, track: Track, payload: LyricsFoundEvent): Promise<void> {
        if (!player.queue.current) {
            player.queue.current = this.getTrackOfPayload(payload);
            if (player.queue.current) {
                await player.queue.utils.save();
            }
            else {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackStartNoTrack, {
                        state: "warn",
                        message: `Trackstart emitted but there is no track on player.queue.current, trying to get the track of the payload failed too.`,
                        functionLayer: "LavalinkNode > trackStart()",
                    });
                }
            }
        }

        this.NodeManager.LavalinkManager.emit("LyricsFound", player, track, payload);
        return;
    }
    /**
     * Emitted whenever the lyrics for a track got not found
     * @event
     * @param {Player} player The player that emitted the event
     * @param {Track} track The track that emitted the event
     * @param {LyricsNotFoundEvent} payload The payload of the event
     */
    private async LyricsNotFound(player: Player, track: Track, payload: LyricsNotFoundEvent): Promise<void> {
        if (!player.queue.current) {
            player.queue.current = this.getTrackOfPayload(payload);
            if (player.queue.current) {
                await player.queue.utils.save();
            }
            else {
                if (this.NodeManager.LavalinkManager.options?.advancedOptions?.enableDebugEvents) {
                    this.NodeManager.LavalinkManager.emit("debug", DebugEvents.TrackStartNoTrack, {
                        state: "warn",
                        message: `Trackstart emitted but there is no track on player.queue.current, trying to get the track of the payload failed too.`,
                        functionLayer: "LavalinkNode > trackStart()",
                    });
                }
            }
        }

        this.NodeManager.LavalinkManager.emit("LyricsNotFound", player, track, payload);
        return;
    }
}
