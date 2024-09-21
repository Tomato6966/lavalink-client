/// <reference types="node" />
import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { Player } from "./Player";
import { ManagerUtils, MiniMap } from "./Utils";
import type { BotClientOptions, LavalinkManagerEvents, ManagerOptions } from "./Types/Manager";
import type { PlayerOptions } from "./Types/Player";
import type { ChannelDeletePacket, VoicePacket, VoiceServer, VoiceState } from "./Types/Utils";
export declare class LavalinkManager extends EventEmitter {
    /**
     * Emit an event
     * @param event The event to emit
     * @param args The arguments to pass to the event
     * @returns
     */
    emit<Event extends keyof LavalinkManagerEvents>(event: Event, ...args: Parameters<LavalinkManagerEvents[Event]>): boolean;
    /**
     * Add an event listener
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    on<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this;
    /**
     * Add an event listener that only fires once
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    once<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this;
    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    off<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this;
    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    removeListener<Event extends keyof LavalinkManagerEvents>(event: Event, listener: LavalinkManagerEvents[Event]): this;
    /** The Options of LavalinkManager (changeable) */
    options: ManagerOptions;
    /** LavalinkManager's NodeManager to manage all Nodes */
    nodeManager: NodeManager;
    /** LavalinkManager's Utils Class */
    utils: ManagerUtils;
    /** Wether the manager was initiated or not */
    initiated: boolean;
    /** All Players stored in a MiniMap */
    readonly players: MiniMap<string, Player>;
    /**
     * Applies the options provided by the User
     * @param options
     * @returns
     */
    private applyOptions;
    /**
     * Validates the current manager's options
     * @param options
     */
    private validateOptions;
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
    constructor(options: ManagerOptions);
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
    getPlayer(guildId: string): Player;
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
    createPlayer(options: PlayerOptions): Player;
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
    destroyPlayer(guildId: string, destroyReason?: string): Promise<Player>;
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
    deletePlayer(guildId: string): boolean;
    /**
     * Checks wether the the lib is useable based on if any node is connected
     *
     * @example
     * ```ts
     * if(!client.lavalink.useable) return console.error("can'T search yet, because there is no useable lavalink node.")
     * // continue with code e.g. createing a player and searching
     * ```
     */
    get useable(): boolean;
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
    init(clientData: BotClientOptions): Promise<this>;
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
    sendRawData(data: VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket): Promise<void>;
}
