"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavalinkManager = void 0;
const node_events_1 = require("node:events");
const NodeManager_1 = require("./NodeManager");
const Queue_1 = require("./Queue");
const PlayerManager_1 = require("./PlayerManager");
const Utils_1 = require("./Utils");
const LavalinkManagerStatics_1 = require("./LavalinkManagerStatics");
class LavalinkManager extends node_events_1.EventEmitter {
    static DEFAULT_SOURCES = LavalinkManagerStatics_1.DEFAULT_SOURCES;
    static REGEXES = LavalinkManagerStatics_1.REGEXES;
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
            this.options.queueStore = new Queue_1.DefaultQueueStore();
        this.playerManager = new PlayerManager_1.PlayerManager(this);
        this.nodeManager = new NodeManager_1.NodeManager(this);
        this.utilManager = new Utils_1.ManagerUitls(this);
    }
}
exports.LavalinkManager = LavalinkManager;
