/// <reference types="node" />
import { EventEmitter } from "stream";
import { LavalinkNode, LavalinkNodeOptions } from "./Node";
import { LavalinkManager } from "./LavalinkManager";
import { LavalinkTrackDataInfo } from "./Track";
import { MiniMap } from "./Utils";
type LavalinkNodeIdentifier = string;
interface NodeManagerEvents {
    /**
     * Emitted when a Node is created.
     * @event Manager.nodeManager#create
     */
    "create": (node: LavalinkNode) => void;
    /**
     * Emitted when a Node is destroyed.
     * @event Manager.nodeManager#destroy
     */
    "destroy": (node: LavalinkNode) => void;
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
    createNode(options: LavalinkNodeOptions): LavalinkNode;
    get leastUsedNodes(): LavalinkNode[];
    deleteNode(node: LavalinkNodeIdentifier | LavalinkNode): void;
    /**
     * Decodes the base64 encoded tracks and returns a TrackData array.
     * @param encodedTracks
     */
    decodeTracks(encodedTracks: string[], node?: LavalinkNodeIdentifier | LavalinkNode): Promise<LavalinkTrackDataInfo[]>;
    /**
     * Decodes the base64 encoded track and returns a TrackData.
     * @param encodedTrack
     */
    decodeTrack(encodedTrack: string): Promise<LavalinkTrackDataInfo>;
}
export {};
