"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeManager = void 0;
const stream_1 = require("stream");
const Node_1 = require("./Node");
class NodeManager extends stream_1.EventEmitter {
    nodes;
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
    }
    createNode(options) {
        if (this.nodes.has(options.id || options.host))
            return this.nodes.get(options.id || options.host);
        const newNode = new Node_1.LavalinkNode(options, this);
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }
    get leastUsedNodes() {
        return [...this.nodes.values()].filter(v => v);
    }
    deleteNode(options) {
    }
}
exports.NodeManager = NodeManager;
