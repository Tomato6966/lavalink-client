import { EventEmitter } from "stream";
import { LavalinkNode } from "./Node";
import { MiniMap } from "./Utils";
import { DestroyReasons } from "./Player";
export class NodeManager extends EventEmitter {
    nodes = new MiniMap();
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
        if (this.LavalinkManager.options.nodes)
            this.LavalinkManager.options.nodes.forEach(node => this.createNode(node));
    }
    createNode(options) {
        if (this.nodes.has(options.id || options.host))
            return this.nodes.get(options.id || options.host);
        const newNode = new LavalinkNode(options, this);
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }
    get leastUsedNodes() {
        return [...this.nodes.values()].filter(v => v);
    }
    deleteNode(node) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes[0];
        if (!decodeNode)
            throw new Error("Node was not found");
        decodeNode.destroy(DestroyReasons.NodeDeleted);
        this.nodes.delete(decodeNode.id);
        return;
    }
}
