import { EventEmitter } from "events";
import { NodeManager } from "./NodeManager";
import { DefaultQueueStore } from "./Queue";
import { PlayerManager } from "./PlayerManager";
import { ManagerUitls } from "./Utils";
import { DEFAULT_SOURCES, REGEXES } from "./LavalinkManagerStatics";
export class LavalinkManager extends EventEmitter {
    static DEFAULT_SOURCES = DEFAULT_SOURCES;
    static REGEXES = REGEXES;
    constructor(options) {
        super();
        this.options = {
            autoSkip: true,
            ...options
        };
        if (!this.options.playerOptions.defaultSearchPlatform)
            this.options.playerOptions.defaultSearchPlatform = "ytsearch";
        if (!this.options.queueOptions.maxPreviousTracks || this.options.queueOptions.maxPreviousTracks <= 0)
            this.options.queueOptions.maxPreviousTracks = 25;
        if (options.queueStore) {
            const keys = Object.keys(options.queueStore);
            const requiredKeys = ["get", "set", "stringify", "parse", "delete"];
            if (!requiredKeys.every(v => keys.includes(v)) || !requiredKeys.every(v => typeof options.queueStore[v] === "function"))
                throw new SyntaxError(`The provided QueueStore, does not have all required functions: ${requiredKeys.join(", ")}`);
        }
        else
            this.options.queueStore = new DefaultQueueStore();
        this.playerManager = new PlayerManager(this);
        this.nodeManager = new NodeManager(this);
        this.utilManager = new ManagerUitls(this);
    }
}
