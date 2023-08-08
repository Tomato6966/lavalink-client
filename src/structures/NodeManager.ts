import { EventEmitter } from "stream";
import { LavalinkNode, LavalinkNodeOptions } from "./Node";
import { LavalinkManager } from "./LavalinkManager";
import { MiniMap } from "./Utils";

type LavalinkNodeIdentifier = string;

interface NodeManagerEvents {
    /**
     * Emitted when a Node is created.
     * @event Manager.nodeManager#create
     */
    "create": (node:LavalinkNode) => void;
    
    /**
     * Emitted when a Node is destroyed.
     * @event Manager.nodeManager#destroy
     */
    "destroy": (node:LavalinkNode) => void;

    /**
     * Emitted when a Node is connected.
     * @event Manager.nodeManager#connect
     */
    "connect": (node:LavalinkNode) => void;

    /**
     * Emitted when a Node is reconnecting.
     * @event Manager.nodeManager#reconnecting
    */
    "reconnecting": (node:LavalinkNode) => void;

    /**
     * Emitted when a Node is disconnects.
     * @event Manager.nodeManager#disconnect
    */
    "disconnect": (node:LavalinkNode, reason: { code?: number, reason?: string }) => void;

    /**
     * Emitted when a Node is error.
     * @event Manager.nodeManager#error
    */
    "error": (node:LavalinkNode, error:Error, payload?:unknown) => void;

    /**
     * Emits every single Node event.
     * @event Manager.nodeManager#raw
    */
    "raw": (node:LavalinkNode, payload:unknown) => void;
}

export declare interface NodeManager {
    on<U extends keyof NodeManagerEvents>(event: U, listener: NodeManagerEvents[U]): this;

    emit<U extends keyof NodeManagerEvents>(event: U, ...args: Parameters<NodeManagerEvents[U]>): boolean;

    /** @private */
    LavalinkManager: LavalinkManager;
}

export class NodeManager extends EventEmitter {
    public nodes: MiniMap<string, LavalinkNode> = new MiniMap();
    constructor(LavalinkManager:LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
        if(this.LavalinkManager.options.nodes) this.LavalinkManager.options.nodes.forEach(node => this.createNode(node));
    }
    createNode(options:LavalinkNodeOptions) {
        if(this.nodes.has(options.id || options.host)) return this.nodes.get(options.id || options.host)!;
        const newNode = new LavalinkNode(options, this);
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }
    public get leastUsedNodes() {
        return [...this.nodes.values()].filter(v => v);
    }
    deleteNode(node:LavalinkNodeIdentifier|LavalinkNode) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes[0];
        if(!decodeNode) throw new Error("Node was not found");
        decodeNode.destroy();
        this.nodes.delete(decodeNode.id);
        return;
    }
}