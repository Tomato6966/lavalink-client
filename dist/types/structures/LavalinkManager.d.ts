/// <reference types="node" />
import { EventEmitter } from "events";
import { LavalinkNodeOptions } from "./Node";
import { NodeManager } from "./NodeManager";
import { DestroyReasonsType, Player, PlayerJson, PlayerOptions } from "./Player";
import { ManagerQueueOptions } from "./Queue";
import { Track, UnresolvedTrack } from "./Track";
import { ChannelDeletePacket, GuildShardPayload, ManagerUtils, MiniMap, SearchPlatform, SponsorBlockChaptersLoaded, SponsorBlockChapterStarted, SponsorBlockSegmentSkipped, SponsorBlockSegmentsLoaded, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent } from "./Utils";
/** How the botclient is allowed to be structured */
export interface BotClientOptions {
    /** Bot Client Id */
    id: string;
    /** Bot Client Username */
    username?: string;
    /** So users can pass entire objects / classes */
    [x: string | number | symbol]: unknown;
}
/** Sub Manager Options, for player specific things */
export interface ManagerPlayerOptions {
    /** If the Lavalink Volume should be decremented by x number */
    volumeDecrementer?: number;
    /** How often it should update the the player Position */
    clientBasedPositionUpdateInterval?: number;
    /** What should be used as a searchPlatform, if no source was provided during the query */
    defaultSearchPlatform?: SearchPlatform;
    /** Applies the volume via a filter, not via the lavalink volume transformer */
    applyVolumeAsFilter?: boolean;
    /** Transforms the saved data of a requested user */
    requesterTransformer?: (requester: unknown) => unknown;
    /** What lavalink-client should do when the player reconnects */
    onDisconnect?: {
        /** Try to reconnect? -> If fails -> Destroy */
        autoReconnect?: boolean;
        /** Instantly destroy player (overrides autoReconnect) | Don't provide == disable feature*/
        destroyPlayer?: boolean;
    };
    onEmptyQueue?: {
        /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
        autoPlayFunction?: (player: Player, lastPlayedTrack: Track) => Promise<void>;
        destroyAfterMs?: number;
    };
    useUnresolvedData?: boolean;
}
/** Manager Options used to create the manager */
export interface ManagerOptions {
    /** The Node Options, for all Nodes! (on init) */
    nodes: LavalinkNodeOptions[];
    /** @async The Function to send the voice connection changes from Lavalink to Discord */
    sendToShard: (guildId: string, payload: GuildShardPayload) => void;
    /** The Bot Client's Data for Authorization */
    client?: BotClientOptions;
    /** QueueOptions for all Queues */
    queueOptions?: ManagerQueueOptions;
    /** PlayerOptions for all Players */
    playerOptions?: ManagerPlayerOptions;
    /** If it should skip to the next Track on TrackEnd / TrackError etc. events */
    autoSkip?: boolean;
    /** If it should skip to the next Track if track.resolve errors while trying to play a track. */
    autoSkipOnResolveError?: boolean;
    /** If it should emit only new (unique) songs and not when a looping track (or similar) is plaid, default false */
    emitNewSongsOnly?: boolean;
    /** Only allow link requests with links either matching some of that regExp or including some of that string */
    linksWhitelist?: (RegExp | string)[];
    /** Never allow link requests with links either matching some of that regExp or including some of that string (doesn't even allow if it's whitelisted) */
    linksBlacklist?: (RegExp | string)[];
    /** If links should be allowed or not. If set to false, it will throw an error if a link was provided. */
    linksAllowed?: boolean;
    /** Advanced Options for the Library, which may or may not be "library breaking" */
    advancedOptions?: {
        /** Max duration for that the filter fix duration works (in ms) - default is 8mins */
        maxFilterFixDuration?: number;
        /** optional */
        debugOptions?: {
            /** For logging custom searches */
            logCustomSearches?: boolean;
            /** logs for debugging the "no-Audio" playing error */
            noAudio?: boolean;
            /** For Logging the Destroy function */
            playerDestroy?: {
                /** To show the debug reason at all times. */
                debugLog?: boolean;
                /** If you get 'Error: Use Player#destroy("reason") not LavalinkManager#deletePlayer() to stop the Player' put it on true */
                dontThrowError?: boolean;
            };
        };
    };
}
export interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager#trackStart
     */
    "trackStart": (player: Player, track: Track, payload: TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager#trackEnd
     */
    "trackEnd": (player: Player, track: Track | null, payload: TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager#trackStuck
     */
    "trackStuck": (player: Player, track: Track | null, payload: TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager#trackError
     */
    "trackError": (player: Player, track: Track | UnresolvedTrack | null, payload: TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager#queueEnd
     */
    "queueEnd": (player: Player, track: Track | UnresolvedTrack | null, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
    /**
     * Emitted when a Player is created.
     * @event Manager#playerCreate
     */
    "playerCreate": (player: Player) => void;
    /**
     * Emitted when a Player is moved within the channel.
     * @event Manager#playerMove
     */
    "playerMove": (player: Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
    /**
     * Emitted when a Player is disconnected from a channel.
     * @event Manager#playerDisconnect
     */
    "playerDisconnect": (player: Player, voiceChannelId: string) => void;
    /**
     * Emitted when a Node-Socket got closed for a specific Player.
     * @event Manager#playerSocketClosed
     */
    "playerSocketClosed": (player: Player, payload: WebSocketClosedEvent) => void;
    /**
     * Emitted when a Player get's destroyed
     * @event Manager#playerDestroy
     */
    "playerDestroy": (player: Player, destroyReason?: DestroyReasonsType) => void;
    /**
     * Always emits when the player (on lavalink side) got updated
     * @event Manager#playerUpdate
     */
    "playerUpdate": (oldPlayerJson: PlayerJson, newPlayer: Player) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when Segments are loaded
     * @link https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
     * @event Manager#trackError
     */
    "SegmentsLoaded": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockSegmentsLoaded) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when a specific Segment was skipped
     * @link https://github.com/topi314/Sponsorblock-Plugin#segmentskipped
     * @event Manager#trackError
     */
    "SegmentSkipped": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockSegmentSkipped) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when a specific Chapter starts playing
     * @link https://github.com/topi314/Sponsorblock-Plugin#chapterstarted
     * @event Manager#trackError
     */
    "ChapterStarted": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockChapterStarted) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when Chapters are loaded
     * @link https://github.com/topi314/Sponsorblock-Plugin#chaptersloaded
     * @event Manager#trackError
     */
    "ChaptersLoaded": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockChaptersLoaded) => void;
}
export interface LavalinkManager {
    /** @private */
    on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;
    /** @private */
    emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
}
export declare class LavalinkManager extends EventEmitter {
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
