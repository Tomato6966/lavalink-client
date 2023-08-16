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
    leastUsedNodes(sortType = "players") {
        switch (sortType) {
            case "memory":
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => (a.stats?.memory?.used || 0) - (b.stats?.memory?.used || 0)); // sort after memor
                }
                break;
            case "cpuLavalink":
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => (a.stats?.cpu?.lavalinkLoad || 0) - (b.stats?.cpu?.lavalinkLoad || 0)); // sort after memor
                }
                break;
            case "cpuSystem":
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => (a.stats?.cpu?.systemLoad || 0) - (b.stats?.cpu?.systemLoad || 0)); // sort after memor
                }
                break;
            case "calls":
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => a.calls - b.calls); // client sided sorting
                }
                break;
            case "playingPlayers":
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => (a.stats?.playingPlayers || 0) - (b.stats?.playingPlayers || 0));
                }
                break;
            case "players":
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => (a.stats?.players || 0) - (b.stats?.players || 0));
                }
                break;
            default:
                {
                    return [...this.nodes.values()]
                        .filter((node) => node.connected)
                        .sort((a, b) => (a.stats?.players || 0) - (b.stats?.players || 0));
                }
                break;
        }
    }
    deleteNode(node) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes()[0];
        if (!decodeNode)
            throw new Error("Node was not found");
        decodeNode.destroy(Player_1.DestroyReasons.NodeDeleted);
        this.nodes.delete(decodeNode.id);
        return;
    }
}
exports.NodeManager = NodeManager;
