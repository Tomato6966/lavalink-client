"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerUitls = exports.NodeSymbol = exports.QueueSymbol = exports.TrackSymbol = void 0;
exports.TrackSymbol = Symbol("LC-Track");
exports.QueueSymbol = Symbol("LC-Queue");
exports.NodeSymbol = Symbol("LC-Node");
class ManagerUitls {
    constructor(LavalinkManager) {
        this.manager = LavalinkManager;
    }
    buildTrack(data, requester) {
        const encodedTrack = data.encoded || data.encodedTrack || typeof data.track === "string" ? data.track : undefined;
        if (!encodedTrack)
            throw new RangeError("Argument 'data.encoded' / 'data.encodedTrack' / 'data.track' must be present.");
        if (!data.info)
            data.info = {};
        try {
            const r = {
                info: {
                    identifier: data.info?.identifier,
                    title: data.info?.title,
                    author: data.info?.author,
                    duration: data.info?.duration,
                    artworkUrl: data.info?.artworkUrl || ["youtube.", "youtu.be"].some(d => data.info?.uri?.includes?.(d)) ? `https://img.youtube.com/vi/${data.info?.identifier}/mqdefault.jpg` : undefined,
                    uri: data.info?.uri,
                    sourceName: data.info?.sourceName,
                    isSeekable: data.info?.isSeekable,
                    isStream: data.info?.isStream,
                    isrc: data.info?.isrc,
                    requester: data.info?.requester || requester,
                },
                pluginInfo: data.pluginInfo || data.plugin || {},
                encodedTrack
            };
            Object.defineProperty(r, exports.TrackSymbol, { configurable: true, value: true });
            return r;
        }
        catch (error) {
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }
}
exports.ManagerUitls = ManagerUitls;
