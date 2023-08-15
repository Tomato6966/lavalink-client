import { EventEmitter } from "stream";
import { LavalinkNode, LavalinkNodeOptions } from "./Node";
import { LavalinkManager } from "./LavalinkManager";
import { MiniMap } from "./Utils";
import { DestroyReasons, DestroyReasonsType } from "./Player";

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
    "disconnect": (node: LavalinkNode, reason: { code?: number, reason?: string }) => void;

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

export class NodeManager extends EventEmitter {
    public nodes: MiniMap<string, LavalinkNode> = new MiniMap();
    constructor(LavalinkManager: LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
        if (this.LavalinkManager.options.nodes) this.LavalinkManager.options.nodes.forEach(node => this.createNode(node));
    }
    createNode(options: LavalinkNodeOptions) {
        if (this.nodes.has(options.id || `${options.host}:${options.port}`)) return this.nodes.get(options.id || `${options.host}:${options.port}`)!;
        const newNode = new LavalinkNode(options, this);
        console.log(newNode.id, this.LavalinkManager.utils.isNode(newNode));
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }
    public get leastUsedNodes(): MiniMap<string, LavalinkNode> {
        if(this.LavalinkManager.options.defaultLeastUsedNodeSortType === "memory") return this.leastUsedNodesMemory;
        else if(this.LavalinkManager.options.defaultLeastUsedNodeSortType === "calls")  return this.leastUsedNodesCalls;
        else return this.leastUsedNodesPlayers; // this.options.defaultLeastUsedNodeSortType === "players"
    }
    /** Returns the least used Nodes sorted by amount of calls. */
    private get leastUsedNodesCalls(): MiniMap<string, LavalinkNode> {
        return this.nodes
            .filter((node) => node.connected)
            .sort((a, b) => b.calls - a.calls); // client sided sorting
    }
    /** Returns the least used Nodes sorted by amount of players. */
    private get leastUsedNodesPlayers(): MiniMap<string, LavalinkNode> {
        return this.nodes
            .filter((node) => node.connected)
            .sort((a, b) => (a.stats?.players || 0) - (b.stats?.players || 0))
    }
    /** Returns the least used Nodes sorted by amount of memory usage. */
    private get leastUsedNodesMemory(): MiniMap<string, LavalinkNode> {
        return this.nodes
            .filter((node) => node.connected)
            .sort((a, b) => (b.stats?.memory?.used || 0) - (a.stats?.memory?.used || 0)) // sort after memory
    }

    /** Returns the least system load Nodes. */
    public get leastLoadNodes(): MiniMap<string, LavalinkNode> {
        if (this.LavalinkManager.options.defaultLeastLoadNodeSortType === "cpu") return this.leastLoadNodesCpu;
        else return this.leastLoadNodesMemory; // this.options.defaultLeastLoadNodeSortType === "memory"
    }

    public get leastLoadNodesMemory(): MiniMap<string, LavalinkNode> {
        return this.nodes
            .filter((node) => node.connected)
            .sort((a, b) => {
                const aload = a.stats.memory?.used
                    ? a.stats.memory.used
                    : 0;
                const bload = b.stats.memory?.used
                    ? b.stats.memory.used
                    : 0;
                return aload - bload;
            });
    }

    /** Returns the least system load Nodes. */
    public get leastLoadNodesCpu(): MiniMap<string, LavalinkNode> {
        return this.nodes
            .filter((node) => node.connected)
            .sort((a, b) => {
                const aload = a.stats.cpu
                    ? (a.stats.cpu.systemLoad / a.stats.cpu.cores) * 100
                    : 0;
                const bload = b.stats.cpu
                    ? (b.stats.cpu.systemLoad / b.stats.cpu.cores) * 100
                    : 0;
                return aload - bload;
            });
    }
    deleteNode(node: LavalinkNodeIdentifier | LavalinkNode) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes[0];
        if (!decodeNode) throw new Error("Node was not found");
        decodeNode.destroy(DestroyReasons.NodeDeleted);
        this.nodes.delete(decodeNode.id);
        return;
    }
}