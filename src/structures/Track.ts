import { Base64 } from "./Utils";

export interface TrackInfo {
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


export interface PluginInfo {
    /** The Type provided by a plugin */
    type?: string;
    /** The Identifier provided by a plugin */
    identifier?: string;
    /** The ArtworkUrl provided by a plugin */
    artworkUrl?: string;
    /** The Author Information provided by a plugin */
    author?: string;
    /** The Url provided by a Plugin */
    url?: string,
    /** The Url provided by a Plugin */
    uri?: string,
}

export interface LavalinkTrack {
    /** The Base 64 encoded String */
    encoded?: Base64;
    /** Track Information */
    info: TrackInfo;
    /** Plugin Information from Lavalink */
    pluginInfo: Partial<PluginInfo>;
}

export interface Track extends LavalinkTrack {
    /** The Track's Requester */
    requester?: unknown;
}


export interface UnresolvedQuery {
    /** The base64 of the unresolved track to "encode" */
    encoded?: Base64;
    /** Search for the closest track possible, by providing as much information as you can! */
    info?: Partial<TrackInfo>;
    /** The Track's Requester */
    requester?: unknown;
}