import { EventEmitter } from "events";

import { DebugEvents, DestroyReasons } from "./Constants";
import { NodeManager } from "./NodeManager";
import { Player } from "./Player";
import { DefaultQueueStore } from "./Queue";
import { ManagerUtils, MiniMap, safeStringify } from "./Utils";

import type {
    ChannelDeletePacket, VoicePacket, VoiceServer, VoiceState
} from "./Types/Utils";
import type { BotClientOptions, LavalinkManagerEvents, ManagerOptions } from "./Types/Manager";
import type { PlayerOptions } from "./Types/Player";
export class LavalinkManager extends EventEmitter {
    /**
     * Emit an event
     * @param event The event to emit
     * @param args The arguments to pass to the event
     * @returns
     */
    emit<Event extends keyof LavalinkManagerEvents>(event: Event, ...args: Parameters<LavalinkManagerEvents[Event]>): boolean {
        return super.emit(event, ...args);
    }

    /**
     * Add an event listener
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    on<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this {
        return super.on(event, listener);
    }

    /**
     * Add an event listener that only fires once
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    once<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this {
        return super.once(event, listener);
    }

    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    off<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this {
        return super.off(event, listener);
    }

    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    removeListener<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this {
        return super.removeListener(event, listener);
    }

    /** The Options of LavalinkManager (changeable) */
    public options: ManagerOptions;
    /** LavalinkManager's NodeManager to manage all Nodes */
    public nodeManager: NodeManager;
    /** LavalinkManager's Utils Class */
    public utils: ManagerUtils;
    /** Wether the manager was initiated or not */
    public initiated: boolean = false;
    /** All Players stored in a MiniMap */
    public readonly players: MiniMap<string, Player> = new MiniMap();

    /**
     * Applies the options provided by the User
     * @param options
     * @returns
     */
    private applyOptions(options: ManagerOptions) {
        this.options = {
            client: {
                ...options?.client,
                id: options?.client?.id,
                username: options?.client?.username ?? "lavalink-client"
            },
            sendToShard: options?.sendToShard,
            nodes: options?.nodes,
            playerOptions: {
                applyVolumeAsFilter: options?.playerOptions?.applyVolumeAsFilter ?? false,
                clientBasedPositionUpdateInterval: options?.playerOptions?.clientBasedPositionUpdateInterval ?? 100,
                defaultSearchPlatform: options?.playerOptions?.defaultSearchPlatform ?? "ytsearch",
                onDisconnect: {
                    destroyPlayer: options?.playerOptions?.onDisconnect?.destroyPlayer ?? true,
                    autoReconnect: options?.playerOptions?.onDisconnect?.autoReconnect ?? false,
                    autoReconnectOnlyWithTracks: options?.playerOptions?.onDisconnect?.autoReconnectOnlyWithTracks ?? false,
                },
                onEmptyQueue: {
                    autoPlayFunction: options?.playerOptions?.onEmptyQueue?.autoPlayFunction ?? null,
                    destroyAfterMs: options?.playerOptions?.onEmptyQueue?.destroyAfterMs ?? undefined
                },
                volumeDecrementer: options?.playerOptions?.volumeDecrementer ?? 1,
                requesterTransformer: options?.playerOptions?.requesterTransformer ?? null,
                useUnresolvedData: options?.playerOptions?.useUnresolvedData ?? false,
                minAutoPlayMs: options?.playerOptions?.minAutoPlayMs ?? 10_000,
                maxErrorsPerTime: {
                    threshold: options?.playerOptions?.maxErrorsPerTime?.threshold ?? 35_000,
                    maxAmount: options?.playerOptions?.maxErrorsPerTime?.maxAmount ?? 3
                }
            },
            linksWhitelist: options?.linksWhitelist ?? [],
            linksBlacklist: options?.linksBlacklist ?? [],
            linksAllowed: options?.linksAllowed ?? true,
            autoSkip: options?.autoSkip ?? true,
            autoSkipOnResolveError: options?.autoSkipOnResolveError ?? true,
            emitNewSongsOnly: options?.emitNewSongsOnly ?? false,
            queueOptions: {
                maxPreviousTracks: options?.queueOptions?.maxPreviousTracks ?? 25,
                queueChangesWatcher: options?.queueOptions?.queueChangesWatcher ?? null,
                queueStore: options?.queueOptions?.queueStore ?? new DefaultQueueStore(),
            },
            advancedOptions: {
                enableDebugEvents: options?.advancedOptions?.enableDebugEvents ?? false,
                maxFilterFixDuration: options?.advancedOptions?.maxFilterFixDuration ?? 600_000,
                debugOptions: {
                    logCustomSearches: options?.advancedOptions?.debugOptions?.logCustomSearches ?? false,
                    noAudio: options?.advancedOptions?.debugOptions?.noAudio ?? false,
                    playerDestroy: {
                        dontThrowError: options?.advancedOptions?.debugOptions?.playerDestroy?.dontThrowError ?? false,
                        debugLog: options?.advancedOptions?.debugOptions?.playerDestroy?.debugLog ?? false,
                    }
                }
            }
        }
        return;
    }

    /**
     * Validates the current manager's options
     * @param options
     */
    private validateOptions(options: ManagerOptions) {
        if (typeof options?.sendToShard !== "function") throw new SyntaxError("ManagerOption.sendToShard was not provided, which is required!");
        // only check in .init()
        // if(typeof options?.client !== "object" || typeof options?.client.id !== "string") throw new SyntaxError("ManagerOption.client = { id: string, username?:string } was not provided, which is required");

        if (options?.autoSkip && typeof options?.autoSkip !== "boolean") throw new SyntaxError("ManagerOption.autoSkip must be either false | true aka boolean");

        if (options?.autoSkipOnResolveError && typeof options?.autoSkipOnResolveError !== "boolean") throw new SyntaxError("ManagerOption.autoSkipOnResolveError must be either false | true aka boolean");

        if (options?.emitNewSongsOnly && typeof options?.emitNewSongsOnly !== "boolean") throw new SyntaxError("ManagerOption.emitNewSongsOnly must be either false | true aka boolean");

        if (!options?.nodes || !Array.isArray(options?.nodes) || !options?.nodes.every(node => this.utils.isNodeOptions(node))) throw new SyntaxError("ManagerOption.nodes must be an Array of NodeOptions and is required of at least 1 Node");

        /* QUEUE STORE */
        if (options?.queueOptions?.queueStore) {
            const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(options?.queueOptions?.queueStore));
            const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
            if (!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options?.queueOptions?.queueStore[v] === "function")) throw new SyntaxError(`The provided ManagerOption.QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
        }

        /* QUEUE WATCHER */
        if (options?.queueOptions?.queueChangesWatcher) {
            const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(options?.queueOptions?.queueChangesWatcher));
            const requiredKeys = ["tracksAdd", "tracksRemoved", "shuffled"];
            if (!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options?.queueOptions?.queueChangesWatcher[v] === "function")) throw new SyntaxError(`The provided ManagerOption.DefaultQueueChangesWatcher, does not have all required functions: ${requiredKeys.join(", ")}`);
        }

        if (typeof options?.queueOptions?.maxPreviousTracks !== "number" || options?.queueOptions?.maxPreviousTracks < 0) options.queueOptions.maxPreviousTracks = 25;


    }

    /**
     * Create the Lavalink Manager
     * @param options
     *
     * @example
     * ```ts
     * //const client = new Client({...}); // create your BOT Client (e.g. via discord.js)
     * client.lavalink = new LavalinkManager({
     *   nodes: [
     *     {
     *       authorization: "yourverystrongpassword",
     *       host: "localhost",
     *       port: 2333,
     *       id: "testnode"
     *     },
     *     sendToShard(guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
     *     client: {
     *       id: process.env.CLIENT_ID,
     *       username: "TESTBOT"
     *     },
     *     // optional Options:
     *     autoSkip: true,
     *     playerOptions: {
     *       applyVolumeAsFilter: false,
     *       clientBasedPositionUpdateInterval: 150,
     *       defaultSearchPlatform: "ytmsearch",
     *       volumeDecrementer: 0.75,
     *       //requesterTransformer: YourRequesterTransformerFunction,
     *       onDisconnect: {
     *         autoReconnect: true,
     *         destroyPlayer: false
     *       },
     *       onEmptyQueue: {
     *         destroyAfterMs: 30_000,
     *         //autoPlayFunction: YourAutoplayFunction,
     *       },
     *       useUnresolvedData: true
     *     },
     *     queueOptions: {
     *       maxPreviousTracks: 25,
     *       //queueStore: yourCustomQueueStoreManagerClass,
     *       //queueChangesWatcher: yourCustomQueueChangesWatcherClass
     *     },
     *     linksBlacklist: [],
     *     linksWhitelist: [],
     *     advancedOptions: {
     *       maxFilterFixDuration: 600_000,
     *       debugOptions: {
     *         noAudio: false,
     *         playerDestroy: {
     *           dontThrowError: false,
     *           debugLogs: false
     *         }
     *       }
     *     }
     *   ]
     * })
     * ```
     */
    constructor(options: ManagerOptions) {
        super();

        if (!options) throw new SyntaxError("No Manager Options Provided")
        this.utils = new ManagerUtils(this);

        // use the validators
        this.applyOptions(options);
        this.validateOptions(this.options);

        // create classes
        this.nodeManager = new NodeManager(this);

    }

    /**
     * Get a Player from Lava
     * @param guildId The guildId of the player
     *
     * @example
     * ```ts
     * const player = client.lavalink.getPlayer(interaction.guildId);
     * ```
     * A quicker and easier way than doing:
     * ```ts
     * const player = client.lavalink.players.get(interaction.guildId);
     * ```
     * @returns
     */
    public getPlayer(guildId: string): Player | undefined {
        return this.players.get(guildId);
    }

    /**
     * Create a Music-Player. If a player exists, then it returns it before creating a new one
     * @param options
     * @returns
     *
     * @example
     * ```ts
     * const player = client.lavalink.createPlayer({
     *   guildId: interaction.guildId,
     *   voiceChannelId: interaction.member.voice.channelId,
     *   // everything below is optional
     *   textChannelId: interaction.channelId,
     *   volume: 100,
     *   selfDeaf: true,
     *   selfMute: false,
     *   instaUpdateFiltersFix: true,
     *   applyVolumeAsFilter: false
     *   //only needed if you want to autopick node by region (configured by you)
     *   // vcRegion: interaction.member.voice.rtcRegion,
     *   // provide a specific node
     *   // node: client.lavalink.nodeManager.leastUsedNodes("memory")[0]
     * });
     * ```
     */
    public createPlayer(options: PlayerOptions): Player {
        const oldPlayer = this.getPlayer(options?.guildId)
        if (oldPlayer) return oldPlayer;

        const newPlayer = new Player(options, this, true);
        this.players.set(newPlayer.guildId, newPlayer);
        this.emit("playerCreate", newPlayer);
        return newPlayer;
    }


    /**
     * Destroy a player with optional destroy reason and disconnect it from the voice channel
     * @param guildId
     * @param destroyReason
     * @returns
     *
     * @example
     * ```ts
     * client.lavalink.destroyPlayer(interaction.guildId, "forcefully destroyed the player");
     * // recommend to do it on the player tho: player.destroy("forcefully destroyed the player");
     * ```
     */
    public destroyPlayer(guildId: string, destroyReason?: string): Promise<void | Player> {
        const oldPlayer = this.getPlayer(guildId);
        if (!oldPlayer) return;
        return oldPlayer.destroy(destroyReason);
    }

    /**
     * Delete's a player from the cache without destroying it on lavalink (only works when it's disconnected)
     * @param guildId
     * @returns
     *
     * @example
     * ```ts
     * client.lavalink.deletePlayer(interaction.guildId);
     * // shouldn't be used except you know what you are doing.
     * ```
     */
    public deletePlayer(guildId: string): boolean | void {
        const oldPlayer = this.getPlayer(guildId);
        if (!oldPlayer) return;
        // oldPlayer.connected is operational. you could also do oldPlayer.voice?.token
        if (oldPlayer.voiceChannelId === "string" && oldPlayer.connected && !oldPlayer.get("internal_destroywithoutdisconnect")) {
            if (!this.options?.advancedOptions?.debugOptions?.playerDestroy?.dontThrowError) throw new Error(`Use Player#destroy() not LavalinkManager#deletePlayer() to stop the Player ${safeStringify(oldPlayer.toJSON?.())}`)
            else if (this.options?.advancedOptions?.enableDebugEvents) {
                this.emit("debug", DebugEvents.PlayerDeleteInsteadOfDestroy, {
                    state: "warn",
                    message: "Use Player#destroy() not LavalinkManager#deletePlayer() to stop the Player",
                    functionLayer: "LavalinkManager > deletePlayer()",
                })
            }
        }
        return this.players.delete(guildId);
    }

    /**
     * Checks wether the the lib is useable based on if any node is connected
     *
     * @example
     * ```ts
     * if(!client.lavalink.useable) return console.error("can'T search yet, because there is no useable lavalink node.")
     * // continue with code e.g. createing a player and searching
     * ```
     */
    public get useable(): boolean {
        return this.nodeManager.nodes.filter(v => v.connected).size > 0;
    }

    /**
     * Initiates the Manager, creates all nodes and connects all of them
     * @param clientData
     *
     * @example
     * ```ts
     * // on the bot ready event
     * client.on("ready", () => {
     *   client.lavalink.init({
     *     id: client.user.id,
     *     username: client.user.username
     *   });
     * });
     * ```
     */
    public async init(clientData: BotClientOptions): Promise<LavalinkManager> {
        if (this.initiated) return this;
        clientData = clientData ?? {} as BotClientOptions;
        this.options.client = { ...this.options?.client, ...clientData };
        if (!this.options?.client.id) throw new Error('"client.id" is not set. Pass it in Manager#init() or as a option in the constructor.');

        if (typeof this.options?.client.id !== "string") throw new Error('"client.id" set is not type of "string"');

        let success = 0;
        for (const node of this.nodeManager.nodes.values()) {
            try {
                await node.connect();
                success++;
            }
            catch (err) {
                console.error(err);
                this.nodeManager.emit("error", node, err);
            }
        }
        if (success > 0) this.initiated = true;
        else if (this.options?.advancedOptions?.enableDebugEvents) {
            this.emit("debug", DebugEvents.FailedToConnectToNodes, {
                state: "error",
                message: "Failed to connect to at least 1 Node",
                functionLayer: "LavalinkManager > init()",
            })
        }
        return this;
    }

    /**
     * Sends voice data to the Lavalink server.
     * ! Without this the library won't work
     * @param data
     *
     * @example
     *
     * ```ts
     * // on the bot "raw" event
     * client.on("raw", (d) => {
     *   // required in order to send audio updates and register channel deletion etc.
     *   client.lavalink.sendRawData(d)
     * })
     * ```
     */
    public async sendRawData(data: VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket): Promise<void> {
        if (!this.initiated) {
            if (this.options?.advancedOptions?.enableDebugEvents) {
                this.emit("debug", DebugEvents.NoAudioDebug, {
                    state: "log",
                    message: "Manager is not initated yet",
                    functionLayer: "LavalinkManager > sendRawData()",
                })
            }
            if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, manager is not initated yet");
            return;
        }

        if (!("t" in data)) {
            if (this.options?.advancedOptions?.enableDebugEvents) {
                this.emit("debug", DebugEvents.NoAudioDebug, {
                    state: "error",
                    message: "No 't' in payload-data of the raw event:",
                    functionLayer: "LavalinkManager > sendRawData()",
                })
            }
            if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no 't' in payload-data of the raw event:", data);
            return;
        }

        // for channel Delete
        if ("CHANNEL_DELETE" === data.t) {
            const update = "d" in data ? data.d : data;
            if (!update.guild_id) return;
            const player = this.getPlayer(update.guild_id);
            if (player && player.voiceChannelId === update.id) return void player.destroy(DestroyReasons.ChannelDeleted);
        }

        // for voice updates
        if (["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t)) {
            const update = ("d" in data ? data.d : data) as VoiceServer | VoiceState;
            if (!update) {
                if (this.options?.advancedOptions?.enableDebugEvents) {
                    this.emit("debug", DebugEvents.NoAudioDebug, {
                        state: "warn",
                        message: `No Update data found in payload :: ${safeStringify(data, 2)}`,
                        functionLayer: "LavalinkManager > sendRawData()",
                    })
                }
                if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no update data found in payload:", data);
                return;
            }

            if (!("token" in update) && !("session_id" in update)) {
                if (this.options?.advancedOptions?.enableDebugEvents) {
                    this.emit("debug", DebugEvents.NoAudioDebug, {
                        state: "error",
                        message: `No 'token' nor 'session_id' found in payload :: ${safeStringify(data, 2)}`,
                        functionLayer: "LavalinkManager > sendRawData()",
                    })
                }
                if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, no 'token' nor 'session_id' found in payload:", data);
                return;
            }

            const player = this.getPlayer(update.guild_id) as Player;

            if (!player) {
                if (this.options?.advancedOptions?.enableDebugEvents) {
                    this.emit("debug", DebugEvents.NoAudioDebug, {
                        state: "warn",
                        message: `No Lavalink Player found via key: 'guild_id' of update-data :: ${safeStringify(update, 2)}`,
                        functionLayer: "LavalinkManager > sendRawData()",
                    })
                }
                if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, No Lavalink Player found via key: 'guild_id' of update-data:", update);
                return;
            }

            if (player.get("internal_destroystatus") === true) {
                if (this.options?.advancedOptions?.enableDebugEvents) {
                    this.emit("debug", DebugEvents.NoAudioDebug, {
                        state: "warn",
                        message: `Player is in a destroying state. can't signal the voice states`,
                        functionLayer: "LavalinkManager > sendRawData()",
                    })
                }
                if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Player is in a destroying state. can't signal the voice states")
                return;
            }

            if ("token" in update) {
                if (!player.node?.sessionId) throw new Error("Lavalink Node is either not ready or not up to date");
                const sessionId2Use = player.voice?.sessionId || ("sessionId" in update ? update.sessionId as string : undefined);
                if (!sessionId2Use) {
                    this.emit("debug", DebugEvents.NoAudioDebug, {
                        state: "error",
                        message: `Can't send updatePlayer for voice token session - Missing sessionId :: ${safeStringify({ voice: { token: update.token, endpoint: update.endpoint, sessionId: sessionId2Use, }, update, playerVoice: player.voice }, 2)}`,
                        functionLayer: "LavalinkManager > sendRawData()",
                    });
                    if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Can't send updatePlayer for voice token session - Missing sessionId", { voice: { token: update.token, endpoint: update.endpoint, sessionId: sessionId2Use, }, update, playerVoice: player.voice });
                } else {
                    await player.node.updatePlayer({
                        guildId: player.guildId,
                        playerOptions: {
                            voice: {
                                token: update.token,
                                endpoint: update.endpoint,
                                sessionId: sessionId2Use,
                            },
                        },
                    });
                    if (this.options?.advancedOptions?.enableDebugEvents) {
                        this.emit("debug", DebugEvents.NoAudioDebug, {
                            state: "log",
                            message: `Sent updatePlayer for voice token session :: ${safeStringify({ voice: { token: update.token, endpoint: update.endpoint, sessionId: sessionId2Use, }, update, playerVoice: player.voice }, 2)}`,
                            functionLayer: "LavalinkManager > sendRawData()",
                        })
                    }
                    if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Sent updatePlayer for voice token session", { voice: { token: update.token, endpoint: update.endpoint, sessionId: sessionId2Use, }, playerVoice: player.voice, update });
                }
                return
            }

            /* voice state update */
            if (update.user_id !== this.options?.client.id) {
                if (update.user_id && player.voiceChannelId) {
                    this.emit(update.channel_id === player.voiceChannelId ? "playerVoiceJoin" : "playerVoiceLeave", player, update.user_id);
                }

                if (this.options?.advancedOptions?.enableDebugEvents) {
                    this.emit("debug", DebugEvents.NoAudioDebug, {
                        state: "warn",
                        message: `voice update user is not equal to provided client id of the LavalinkManager.options.client.id :: user: "${update.user_id}" manager client id: "${this.options?.client.id}"`,
                        functionLayer: "LavalinkManager > sendRawData()",
                    })
                }

                if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug("Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, voice update user is not equal to provided client id of the manageroptions#client#id", "user:", update.user_id, "manager client id:", this.options?.client.id);
                return;
            }

            if (update.channel_id) {
                if (player.voiceChannelId !== update.channel_id) this.emit("playerMove", player, player.voiceChannelId, update.channel_id);

                player.voice.sessionId = update.session_id || player.voice.sessionId;

                if (!player.voice.sessionId) {
                    if (this.options?.advancedOptions?.enableDebugEvents) {
                        this.emit("debug", DebugEvents.NoAudioDebug, {
                            state: "warn",
                            message: `Function to assing sessionId provided, but no found in Payload: ${safeStringify({ update, playerVoice: player.voice }, 2)}`,
                            functionLayer: "LavalinkManager > sendRawData()",
                        })
                    }
                    if (this.options?.advancedOptions?.debugOptions?.noAudio === true) console.debug(`Lavalink-Client-Debug | NO-AUDIO [::] sendRawData function, Function to assing sessionId provided, but no found in Payload: ${safeStringify(update, 2)}`);
                }

                player.voiceChannelId = update.channel_id;

                const selfMuteChanged = typeof update.self_mute === "boolean" && player.voiceState.selfMute !== update.self_mute;
                const serverMuteChanged = typeof update.mute === "boolean" && player.voiceState.serverMute !== update.mute;
                const selfDeafChanged = typeof update.self_deaf === "boolean" && player.voiceState.selfDeaf !== update.self_deaf;
                const serverDeafChanged = typeof update.deaf === "boolean" && player.voiceState.serverDeaf !== update.deaf;
                const suppressChange = typeof update.suppress === "boolean" && player.voiceState.suppress !== update.suppress;

                player.voiceState.selfDeaf = update.self_deaf ?? player.voiceState?.selfDeaf;
                player.voiceState.selfMute = update.self_mute ?? player.voiceState?.selfMute;
                player.voiceState.serverDeaf = update.deaf ?? player.voiceState?.serverDeaf;
                player.voiceState.serverMute = update.mute ?? player.voiceState?.serverMute;
                player.voiceState.suppress = update.suppress ?? player.voiceState?.suppress;

                if (selfMuteChanged || serverMuteChanged) this.emit("playerMuteChange", player, player.voiceState.selfMute, player.voiceState.serverMute);
                if (selfDeafChanged || serverDeafChanged) this.emit("playerDeafChange", player, player.voiceState.selfDeaf, player.voiceState.serverDeaf);
                if (suppressChange) this.emit("playerSuppressChange", player, player.voiceState.suppress);

            } else {

                const {
                    autoReconnectOnlyWithTracks,
                    destroyPlayer,
                    autoReconnect
                } = this.options?.playerOptions?.onDisconnect ?? {};

                if (destroyPlayer === true) {
                    return void await player.destroy(DestroyReasons.Disconnected);
                }

                if (autoReconnect === true) {
                    try {
                        const previousPosition = player.position;
                        const previousPaused = player.paused;

                        if (this.options?.advancedOptions?.enableDebugEvents) {
                            this.emit("debug", DebugEvents.PlayerAutoReconnect, {
                                state: "log",
                                message: `Auto reconnecting player because LavalinkManager.options.playerOptions.onDisconnect.autoReconnect is true`,
                                functionLayer: "LavalinkManager > sendRawData()",
                            });
                        }

                        // connect if there are tracks & autoReconnectOnlyWithTracks = true or autoReconnectOnlyWithTracks is false
                        if (!autoReconnectOnlyWithTracks || (autoReconnectOnlyWithTracks && (player.queue.current || player.queue.tracks.length))) {
                            await player.connect();
                        }
                        // replay the current playing stream
                        if (player.queue.current) {
                            return void await player.play({ position: previousPosition, paused: previousPaused, clientTrack: player.queue.current, });
                        }
                        // try to play the next track
                        if (player.queue.tracks.length) {
                            return void await player.play({ paused: previousPaused });
                        }
                        // debug log if nothing was possible
                        this.emit("debug", DebugEvents.PlayerAutoReconnect, {
                            state: "log",
                            message: `Auto reconnected, but nothing to play`,
                            functionLayer: "LavalinkManager > sendRawData()",
                        });
                    } catch (e) {
                        console.error(e);
                        return void await player.destroy(DestroyReasons.PlayerReconnectFail);
                    }
                }

                this.emit("playerDisconnect", player, player.voiceChannelId);

                player.voiceChannelId = null;
                player.voice = Object.assign({});
                return
            }
        }
    }
}