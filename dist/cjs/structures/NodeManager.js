"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeManager = void 0;
const stream_1 = require("stream");
const Node_1 = require("./Node");
const Utils_1 = require("./Utils");
const Player_1 = require("./Player");
class NodeManager extends stream_1.EventEmitter {
    nodes = new Utils_1.MiniMap();
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
        if (this.LavalinkManager.options.nodes)
            this.LavalinkManager.options.nodes.forEach(node => this.createNode(node));
    }
    createNode(options) {
        if (this.nodes.has(options.id || `${options.host}:${options.port}`))
            return this.nodes.get(options.id || `${options.host}:${options.port}`);
        const newNode = new Node_1.LavalinkNode(options, this);
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }
    get leastUsedNodes() {
        if (this.LavalinkManager.options.defaultLeastUsedNodeSortType === "memory")
            return this.leastUsedNodesMemory;
        else if (this.LavalinkManager.options.defaultLeastUsedNodeSortType === "calls")
            return this.leastUsedNodesCalls;
        else
            return this.leastUsedNodesPlayers; // this.options.defaultLeastUsedNodeSortType === "players"
    }
    /** Returns the least used Nodes sorted by amount of calls. */
    get leastUsedNodesCalls() {
        return [...this.nodes.values()]
            .filter((node) => node.connected)
            .sort((a, b) => b.calls - a.calls); // client sided sorting
    }
    /** Returns the least used Nodes sorted by amount of players. */
    get leastUsedNodesPlayers() {
        return [...this.nodes.values()]
            .filter((node) => node.connected)
            .sort((a, b) => (a.stats?.players || 0) - (b.stats?.players || 0));
    }
    /** Returns the least used Nodes sorted by amount of memory usage. */
    get leastUsedNodesMemory() {
        return [...this.nodes.values()]
            .filter((node) => node.connected)
            .sort((a, b) => (b.stats?.memory?.used || 0) - (a.stats?.memory?.used || 0)); // sort after memory
    }
    /** Returns the least system load Nodes. */
    get leastLoadNodes() {
        if (this.LavalinkManager.options.defaultLeastLoadNodeSortType === "cpu")
            return this.leastLoadNodesCpu;
        else
            return this.leastLoadNodesMemory; // this.options.defaultLeastLoadNodeSortType === "memory"
    }
    get leastLoadNodesMemory() {
        return [...this.nodes.values()]
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
    get leastLoadNodesCpu() {
        return [...this.nodes.values()]
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
    deleteNode(node) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes[0];
        if (!decodeNode)
            throw new Error("Node was not found");
        decodeNode.destroy(Player_1.DestroyReasons.NodeDeleted);
        this.nodes.delete(decodeNode.id);
        return;
    }
}
exports.NodeManager = NodeManager;
