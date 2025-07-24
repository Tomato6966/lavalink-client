import { EventEmitter } from "events";

import { DestroyReasons, DisconnectReasons } from "./Constants";
import { LavalinkNode } from "./Node";
import { MiniMap } from "./Utils";

import type { LavalinkNodeIdentifier, LavalinkNodeOptions, NodeManagerEvents } from "./Types/Node";
import type { LavalinkManager } from "./LavalinkManager";

export class NodeManager extends EventEmitter {
    /**
     * Emit an event
     * @param event The event to emit
     * @param args The arguments to pass to the event
     * @returns
     */
    emit<Event extends keyof NodeManagerEvents>(event: Event, ...args: Parameters<NodeManagerEvents[Event]>): boolean {
        return super.emit(event, ...args);
    }

    /**
     * Add an event listener
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    on<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this {
        return super.on(event, listener);
    }

    /**
     * Add an event listener that only fires once
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    once<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this {
        return super.once(event, listener);
    }

    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    off<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this {
        return super.off(event, listener);
    }

    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    removeListener<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this {
        return super.removeListener(event, listener);
    }

    /**
     * The LavalinkManager that created this NodeManager
     */
    public LavalinkManager: LavalinkManager;
    /**
     * A map of all nodes in the nodeManager
     */
    public nodes: MiniMap<string, LavalinkNode> = new MiniMap();

    /**
     * @param LavalinkManager The LavalinkManager that created this NodeManager
     */
    constructor(LavalinkManager: LavalinkManager) {
        super();
        this.LavalinkManager = LavalinkManager;

        if (this.LavalinkManager.options.nodes) this.LavalinkManager.options.nodes.forEach(node => {
            this.createNode(node);
        });
    }

    /**
     * Disconnects all Nodes from lavalink ws sockets
     * @param deleteAllNodes if the nodes should also be deleted from nodeManager.nodes
     * @param destroyPlayers if the players should be destroyed
     * @returns amount of disconnected Nodes
     */
    public async disconnectAll(deleteAllNodes = false, destroyPlayers = true) {
        if (!this.nodes.size) throw new Error("There are no nodes to disconnect (no nodes in the nodemanager)");
        if (!this.nodes.filter(v => v.connected).size) throw new Error("There are no nodes to disconnect (all nodes disconnected)");
        let counter = 0;
        for (const node of this.nodes.values()) {
            if (!node.connected) continue;
            if (destroyPlayers) {
                await node.destroy(DestroyReasons.DisconnectAllNodes, deleteAllNodes);
            } else {
                await node.disconnect(DisconnectReasons.DisconnectAllNodes);
            }
            counter++;
        }
        return counter;
    }

    /**
     * Connects all not connected nodes
     * @returns Amount of connected Nodes
     */
    public async connectAll(): Promise<number> {
        if (!this.nodes.size) throw new Error("There are no nodes to connect (no nodes in the nodemanager)");
        if (!this.nodes.filter(v => !v.connected).size) throw new Error("There are no nodes to connect (all nodes connected)");
        let counter = 0;
        for (const node of this.nodes.values()) {
            if (node.connected) continue;
            await node.connect();
            counter++;
        }
        return counter;
    }

    /**
     * Forcefully reconnects all nodes
     * @returns amount of nodes
     */
    public async reconnectAll(): Promise<number> {
        if (!this.nodes.size) throw new Error("There are no nodes to reconnect (no nodes in the nodemanager)");
        let counter = 0;
        for (const node of this.nodes.values()) {
            const sessionId = node.sessionId ? `${node.sessionId}` : undefined;
            await node.destroy(DestroyReasons.ReconnectAllNodes, false);
            await node.connect(sessionId);
            counter++;
        }
        return counter;
    }

    /**
     * Create a node and add it to the nodeManager
     * @param options The options for the node
     * @returns The node that was created
     */
    createNode(options: LavalinkNodeOptions): LavalinkNode {
        if (this.nodes.has(options.id || `${options.host}:${options.port}`)) return this.nodes.get(options.id || `${options.host}:${options.port}`)!;
        const newNode = new LavalinkNode(options, this);
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }

    /**
     * Get the nodes sorted for the least usage, by a sorttype
     * @param sortType The type of sorting to use
     * @returns
     */
    public leastUsedNodes(sortType: "memory" | "cpuLavalink" | "cpuSystem" | "calls" | "playingPlayers" | "players" = "players"): LavalinkNode[] {
        const connectedNodes = Array.from(this.nodes.values()).filter((node) => node.connected);
        switch (sortType) {
            case "memory": {
                return connectedNodes
                    .sort((a, b) => (a.stats?.memory?.used || 0) - (b.stats?.memory?.used || 0)) // sort after memor
            } break;
            case "cpuLavalink": {
                return connectedNodes
                    .sort((a, b) => (a.stats?.cpu?.lavalinkLoad || 0) - (b.stats?.cpu?.lavalinkLoad || 0)) // sort after memor
            } break;
            case "cpuSystem": {
                return connectedNodes
                    .sort((a, b) => (a.stats?.cpu?.systemLoad || 0) - (b.stats?.cpu?.systemLoad || 0)) // sort after memor
            } break;
            case "calls": {
                return connectedNodes
                    .sort((a, b) => a.calls - b.calls); // client sided sorting
            } break;
            case "playingPlayers": {
                return connectedNodes
                    .sort((a, b) => (a.stats?.playingPlayers || 0) - (b.stats?.playingPlayers || 0))
            } break;
            case "players": {
                return connectedNodes
                    .sort((a, b) => (a.stats?.players || 0) - (b.stats?.players || 0))
            } break;
            default: {
                return connectedNodes
                    .sort((a, b) => (a.stats?.players || 0) - (b.stats?.players || 0))
            } break;
        }
    }

    /**
     * Delete a node from the nodeManager and destroy it
     * @param node The node to delete
     * @param movePlayers whether to movePlayers to different connected node before deletion. @default false
     * @returns
     * 
     * @example
     * Deletes the node
     * ```ts
     * client.lavalink.nodeManager.deleteNode("nodeId to delete");
     * ```
     * Moves players to a different node before deleting
     * ```ts
     * client.lavalink.nodeManager.deleteNode("nodeId to delete", true);
     * ```
     */
    deleteNode(node: LavalinkNodeIdentifier | LavalinkNode, movePlayers: boolean = false): void {
        const decodeNode = typeof node === "string" ? this.nodes.get(node) : node;
        if (!(decodeNode instanceof LavalinkNode))
            throw new RangeError("nodeManager.deleteNode: The node you provided is not valid or doesn't exist.");
        if (typeof movePlayers !== "boolean")
            throw new TypeError("nodeManager.deleteNode: movePlayers must be a boolean");
        decodeNode.destroy(DestroyReasons.NodeDeleted, true, movePlayers);
        this.nodes.delete(decodeNode.id);
        return;
    }
}
