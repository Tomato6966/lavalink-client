/// <reference types="node" />
import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { QueueSaverOptions, StoreManager } from "./Queue";
import { GuildShardPayload, LavalinkSearchPlatform, ManagerUitls, MiniMap, SearchPlatform, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent } from "./Utils";
import { LavalinkNodeOptions } from "./Node";
import { Player, PlayerOptions } from "./Player";
import { Track } from "./Track";
export interface LavalinkManager {
    nodeManager: NodeManager;
    utils: ManagerUitls;
}
export interface BotClientOptions {
    shards?: number | number[] | "auto";
    id: string;
    username?: string;
    /** So users can pass entire objects / classes */
    [x: string | number | symbol | undefined]: any;
}
export interface LavalinkPlayerOptions {
    volumeDecrementer?: number;
    clientBasedUpdateInterval?: number;
    defaultSearchPlatform?: SearchPlatform;
    applyVolumeAsFilter?: boolean;
    autoReconnectOnDisconnect?: boolean;
}
export interface ManagerOptions {
    nodes: LavalinkNodeOptions[];
    queueStore?: StoreManager;
    queueOptions?: QueueSaverOptions;
    client?: BotClientOptions;
    playerOptions?: LavalinkPlayerOptions;
    autoSkip?: boolean;
    /** @async */
    sendToShard: (guildId: string, payload: GuildShardPayload) => void;
}
interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager.playerManager#trackStart
     */
    "trackStart": (player: Player, track: Track, payload: TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager.playerManager#trackEnd
     */
    "trackEnd": (player: Player, track: Track, payload: TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager.playerManager#trackStuck
     */
    "trackStuck": (player: Player, track: Track, payload: TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager.playerManager#trackError
     */
    "trackError": (player: Player, track: Track, payload: TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager.playerManager#queueEnd
     */
    "queueEnd": (player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
    /**
     * Emitted when a Player is created.
     * @event Manager.playerManager#create
     */
    "playerCreate": (player: Player) => void;
    /**
     * Emitted when a Player is moved within the channel.
     * @event Manager.playerManager#move
     */
    "playerMove": (player: Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
    /**
     * Emitted when a Player is disconnected from a channel.
     * @event Manager.playerManager#disconnect
     */
    "playerDisconnect": (player: Player, voiceChannelId: string) => void;
    /**
     * Emitted when a Node-Socket got closed for a specific Player.
     * @event Manager.playerManager#socketClosed
     */
    "playerSocketClosed": (player: Player, payload: WebSocketClosedEvent) => void;
    /**
     * Emitted when a Player get's destroyed
     * @event Manager.playerManager#destroy
     */
    "playerDestroy": (player: Player) => void;
}
export interface LavalinkManager {
    options: ManagerOptions;
    on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;
    emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
}
export declare class LavalinkManager extends EventEmitter {
    static DEFAULT_SOURCES: Record<SearchPlatform, LavalinkSearchPlatform>;
    static REGEXES: Record<import("./Utils").SourcesRegex, RegExp>;
    initiated: boolean;
    readonly players: MiniMap<string, Player>;
    private applyDefaultOptions;
    private validateAndApply;
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
    updateVoiceState(data: VoicePacket | VoiceServer | VoiceState): Promise<void>;
}
export {};
