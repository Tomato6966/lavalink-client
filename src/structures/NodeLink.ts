import { LavalinkNode } from "./Node";
import type { NodeManager } from "./NodeManager";
import type { LavalinkNodeOptions } from "./Types/Node";

export class NodeLinkNode extends LavalinkNode {
    public nodeType = "NodeLink" as const;

    constructor(options: LavalinkNodeOptions, manager: NodeManager) {
        super(options, manager);

        if (this.options.nodeType === "Lavalink" && this.constructor.name === "NodeLink") {
            return new (LavalinkNode as any)(options, manager);
        }
        this.nodeType = "NodeLink";
    }

    public thisIsNodeLink() {
        return true;
    }
}

LavalinkNode._NodeLinkClass = NodeLinkNode;
