/// <reference types="node" />
import { EventEmitter } from "stream";
import { LavalinkManager } from "./LavalinkManager";
import { LavalinkNode, LavalinkNodeOptions } from "./Node";
import { DestroyReasonsType } from "./Player";
import { LavalinkPlayer, MiniMap } from "./Utils";
type LavalinkNodeIdentifier = string;
export interface NodeManagerEvents {
    /**
     * Emitted when a Node is created.
     * @event Manager.nodeManager#create
     */
    "create": (node: LavalinkNode) => void;
    /**
     * Emitted when a Node is destroyed.
     * @event Manager.nodeManager#destroy
     */
    "destroy": (node: LavalinkNode, destroyReason?: DestroyReasonsType) => void;
    /**
     * Emitted when a Node is connected.
     * @event Manager.nodeManager#connect
     */
    "connect": (node: LavalinkNode) => void;
    /**
     * Emitted when a Node is reconnecting.
     * @event Manager.nodeManager#reconnecting
    */
    "reconnecting": (node: LavalinkNode) => void;
    /**
     * Emitted when a Node is disconnects.
     * @event Manager.nodeManager#disconnect
    */
    "disconnect": (node: LavalinkNode, reason: {
        code?: number;
        reason?: string;
    }) => void;
    /**
     * Emitted when a Node is error.
     * @event Manager.nodeManager#error
    */
    "error": (node: LavalinkNode, error: Error, payload?: unknown) => void;
    /**
     * Emits every single Node event.
     * @event Manager.nodeManager#raw
    */
    "raw": (node: LavalinkNode, payload: unknown) => void;
    /**
     * Emits when the node connects resumed. You then need to create all players within this event for your usecase.
     * Aka for that you need to be able to save player data like vc channel + text channel in a db and then sync it again
     * @event Manager.nodeManager#nodeResumed
     */
    "resumed": (node: LavalinkNode, paylaod: {
        resumed: true;
        sessionId: string;
        op: "ready";
    }, players: LavalinkPlayer[]) => void;
}
export declare interface NodeManager {
    on<U extends keyof NodeManagerEvents>(event: U, listener: NodeManagerEvents[U]): this;
    emit<U extends keyof NodeManagerEvents>(event: U, ...args: Parameters<NodeManagerEvents[U]>): boolean;
    /** @private */
    LavalinkManager: LavalinkManager;
}
export declare class NodeManager extends EventEmitter {
    nodes: MiniMap<string, LavalinkNode>;
    constructor(LavalinkManager: LavalinkManager);
    /**
     * Disconnects all Nodes from lavalink ws sockets
     * @param deleteAllNodes if the nodes should also be deleted from nodeManager.nodes
     * @returns amount of disconnected Nodes
     */
    disconnectAll(deleteAllNodes?: boolean): Promise<number>;
    /**
     * Connects all not connected nodes
     * @returns Amount of connected Nodes
     */
    connectAll(): Promise<number>;
    /**
     * Forcefully reconnects all nodes
     * @returns amount of nodes
     */
    reconnectAll(): Promise<number>;
    createNode(options: LavalinkNodeOptions): LavalinkNode;
    leastUsedNodes(sortType?: "memory" | "cpuLavalink" | "cpuSystem" | "calls" | "playingPlayers" | "players"): LavalinkNode[];
    deleteNode(node: LavalinkNodeIdentifier | LavalinkNode): void;
}
export {};
