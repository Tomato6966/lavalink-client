/// <reference types="node" />
import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { ManagerQueueOptions } from "./Queue";
import { GuildShardPayload, ManagerUtils, MiniMap, SearchPlatform, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
import { DestroyReasonsType, Player, PlayerJson, PlayerOptions } from "./Player";
import { Track, UnresolvedTrack } from "./Track";
export interface LavalinkManager {
    nodeManager: NodeManager;
    utils: ManagerUtils;
}
export interface BotClientOptions {
    /** Bot Client Id */
    id: string;
    /** Bot Client Username */
    username?: string;
    /** So users can pass entire objects / classes */
    [x: string | number | symbol | undefined]: unknown;
}
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
        /** Instantly destroy player (overrides autoReconnect) */
        destroyPlayer?: boolean;
    };
    onEmptyQueue?: {
        /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
        autoPlayFunction?: (player: Player, lastPlayedTrack: Track) => Promise<void>;
        destroyAfterMs?: number;
    };
    useUnresolvedData?: boolean;
}
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
    /** optional */
    debugOptions?: {
        /** logs for debugging the "no-Audio" playing error */
        noAudio: boolean;
    };
}
interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager#trackStart
     */
    "trackStart": (player: Player, track: Track, payload: TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager#trackEnd
     */
    "trackEnd": (player: Player, track: Track, payload: TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager#trackStuck
     */
    "trackStuck": (player: Player, track: Track, payload: TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager#trackError
     */
    "trackError": (player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager#queueEnd
     */
    "queueEnd": (player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
    /**
     * Emitted when a Player is created.
     * @event Manager#playerCreate
     */
    "playerCreate": (player: Player) => void;
    /**
     * Emitted when a Player is moved within the channel.
     * @event Manager.playerManager#move
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
}
export interface LavalinkManager {
    options: ManagerOptions;
    on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;
    emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
}
export declare class LavalinkManager extends EventEmitter {
    static DefaultSources: Record<SearchPlatform, import("./Utils").LavalinkSearchPlatform>;
    static SourceLinksRegexes: Record<import("./Utils").SourcesRegex, RegExp>;
    initiated: boolean;
    readonly players: MiniMap<string, Player>;
    private applyOptions;
    private validateOptions;
    constructor(options: ManagerOptions);
    createPlayer(options: PlayerOptions): Player;
    getPlayer(guildId: string): Player;
    deletePlayer(guildId: string): boolean;
    get useable(): boolean;
    /**
     * Initiates the Manager.
     * @param clientData
     */
    init(clientData: BotClientOptions): Promise<this>;
    /**
     * Sends voice data to the Lavalink server.
     * @param data
     */
    sendRawData(data: VoicePacket | VoiceServer | VoiceState | any): Promise<void>;
}
export {};
