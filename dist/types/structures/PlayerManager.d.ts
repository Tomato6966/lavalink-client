/// <reference types="node" />
import { EventEmitter } from "stream";
import { Player, PlayerOptions } from "./Player";
import { LavalinkManager } from "./LavalinkManager";
import { Track } from "./Track";
import { TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, WebSocketClosedEvent } from "./Utils";
interface PlayerManagerEvents {
    /**
     * Emitted when a Player is created.
     * @event Manager.playerManager#create
     */
    "create": (player: Player) => void;
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
     * Emitted when a Track finished.
     * @event Manager.playerManager#trackStuck
     */
    "trackStuck": (player: Player, track: Track, payload: TrackStuckEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager.playerManager#trackError
     */
    "trackError": (player: Player, track: Track, payload: TrackExceptionEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager.playerManager#queueEnd
     */
    "queueEnd": (player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent) => void;
    /**
     * Emitted when a Node-Socket got closed for a specific Player.
     * @event Manager.playerManager#socketClosed
     */
    "socketClosed": (player: Player, payload: WebSocketClosedEvent) => void;
    /**
     * Emitted when a Player get's destroyed
     * @event Manager.playerManager#destroy
     */
    "destroy": (player: Player) => void;
}
export interface PlayerManager {
    on<U extends keyof PlayerManagerEvents>(event: U, listener: PlayerManagerEvents[U]): this;
    emit<U extends keyof PlayerManagerEvents>(event: U, ...args: Parameters<PlayerManagerEvents[U]>): boolean;
    /** @private */
    LavalinkManager: LavalinkManager;
}
export declare class PlayerManager extends EventEmitter {
    private players;
    constructor(LavalinkManager: LavalinkManager);
    createPlayer(options: PlayerOptions): Player;
    getPlayer(guildId: string): Player;
    deletePlayer(guildId: string): boolean;
}
export {};
