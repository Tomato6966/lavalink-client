"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeManager = void 0;
const stream_1 = require("stream");
const Node_1 = require("./Node");
const Utils_1 = require("./Utils");
class NodeManager extends stream_1.EventEmitter {
    nodes = new Utils_1.MiniMap();
    constructor(LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;
        if (this.LavalinkManager.options.nodes)
            this.LavalinkManager.options.nodes.forEach(node => this.createNode(node));
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
    deleteNode(node) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes[0];
        if (!decodeNode)
            throw new Error("Node was not found");
        decodeNode.destroy();
        this.nodes.delete(decodeNode.id);
        return;
    }
    /**
     * Decodes the base64 encoded tracks and returns a TrackData array.
     * @param encodedTracks
     */
    async decodeTracks(encodedTracks, node) {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node || this.leastUsedNodes[0];
        if (!decodeNode)
            throw new Error("No available nodes.");
        const res = await decodeNode.makeRequest(`/decodetracks`, r => {
            r.method = "POST";
            r.body = JSON.stringify(encodedTracks);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            r.headers["Content-Type"] = "application/json";
        });
        if (!res)
            throw new Error("No data returned from query.");
        return res;
    }
    /**
     * Decodes the base64 encoded track and returns a TrackData.
     * @param encodedTrack
     */
    async decodeTrack(encodedTrack) {
        const res = await this.decodeTracks([encodedTrack]);
        return res[0];
    }
}
exports.NodeManager = NodeManager;
