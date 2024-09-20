import { EventEmitter } from "events";
import { LavalinkNode } from "./Node.js";
import { MiniMap } from "./Utils.js";
import type { LavalinkNodeIdentifier, LavalinkNodeOptions, NodeManagerEvents } from "./Types/Node.js";
import type { LavalinkManager } from "./LavalinkManager.js";
export declare class NodeManager extends EventEmitter {
    /**
     * Emit an event
     * @param event The event to emit
     * @param args The arguments to pass to the event
     * @returns
     */
    emit<Event extends keyof NodeManagerEvents>(event: Event, ...args: Parameters<NodeManagerEvents[Event]>): boolean;
    /**
     * Add an event listener
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    on<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this;
    /**
     * Add an event listener that only fires once
     * @param event The event to listen to
     * @param listener The listener to add
     * @returns
     */
    once<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this;
    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    off<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this;
    /**
     * Remove an event listener
     * @param event The event to remove the listener from
     * @param listener The listener to remove
     * @returns
     */
    removeListener<Event extends keyof NodeManagerEvents>(event: Event, listener: NodeManagerEvents[Event]): this;
    /**
     * The LavalinkManager that created this NodeManager
     */
    LavalinkManager: LavalinkManager;
    /**
     * A map of all nodes in the nodeManager
     */
    nodes: MiniMap<string, LavalinkNode>;
    /**
     * @param LavalinkManager The LavalinkManager that created this NodeManager
     */
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
    /**
     * Create a node and add it to the nodeManager
     * @param options The options for the node
     * @returns The node that was created
     */
    createNode(options: LavalinkNodeOptions): LavalinkNode;
    /**
     * Get the nodes sorted for the least usage, by a sorttype
     * @param sortType The type of sorting to use
     * @returns
     */
    leastUsedNodes(sortType?: "memory" | "cpuLavalink" | "cpuSystem" | "calls" | "playingPlayers" | "players"): LavalinkNode[];
    /**
     * Delete a node from the nodeManager and destroy it
     * @param node The node to delete
     * @returns
     */
    deleteNode(node: LavalinkNodeIdentifier | LavalinkNode): void;
}
