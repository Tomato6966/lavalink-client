export interface LavalinkTrackDataInfo {
    identifier: string;
    title: string;
    author: string;
    duration: number;
    artworkUrl: string | null;
    uri: string;
    sourceName: string;
    isSeekable: boolean;
    isStream: boolean;
    isrc: string | null;
}
export interface LavalinkTrackDataInfoExtended extends LavalinkTrackDataInfo {
    requester?: unknown;
}
export interface Track {
    encodedTrack?: string;
    info: LavalinkTrackDataInfoExtended;
    pluginInfo: Partial<PluginDataInfo> | Record<string, string | number>;
}
export interface PluginDataInfo {
    type?: string;
    identifier?: string;
    artworkUrl?: string;
    author?: string;
    url?: string;
}
