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

export interface UnresolvedTrackInfo {
    /** [QUERY] The title to search against. */
    title: string;
    /** [QUERY] The author to search against. */
    author?: string;
    /** [QUERY] The duration to search within 1500 milliseconds of the results from YouTube. */
    duration?: number;
    /** [QUERY] If provided, it will search via identifier, (only works for youtube & soundcloud) */
    identifier?: string;
    /** [QUERY] If provided, it will search via uri */
    uri?: string;
    /** [QUERY] If it's a local track */
    local?: boolean;
    /** [Override] Default artwork url */
    artworkUrl: string | null;
}

export interface UnresolvedQuery {
    /** The base64 of the unresolved track to "encode" */
    encodedTrack?: string;
    /** Search for the closest track possible, by providing as much information as you can! */
    info?: Partial<UnresolvedTrackInfo>;
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
    url?: string,
}