import type { Player } from "../Player";
import type { anyObject } from "./Player";
import type { Base64 } from "./Utils";

/** Sourcenames provided by lavalink server */
export type LavalinkSourceNames = "youtube" | "youtubemusic" | "soundcloud" | "bandcamp" | "twitch";
/** Source Names provided by lava src plugin */
export type LavalinkPlugin_LavaSrc_SourceNames = "deezer" | "spotify" | "applemusic" | "yandexmusic" | "flowery-tts" | "vkmusic" | "tidal" | "qobuz" | "pandora";
/** Source Names provided by jiosaavan plugin */
export type LavalinkPlugin_JioSaavn_SourceNames = "jiosaavn";
/** The SourceNames provided by lavalink */
export type SourceNames = LavalinkSourceNames | LavalinkPlugin_LavaSrc_SourceNames | LavalinkPlugin_JioSaavn_SourceNames;

export interface LavalinkTrackInfo {
    /** The Identifier of the Track */
    identifier: string;
    /** The Track Title / Name */
    title: string;
    /** The Name of the Author */
    author: string;
    /** The duration of the Track */
    length: number;
    /** The URL of the artwork if available */
    artworkUrl: string | null;
    /** The URL (aka Link) of the Track called URI */
    uri: string;
    /** The Source name of the Track, e.g. soundcloud, youtube, spotify */
    sourceName: SourceNames;
    /** Wether the audio is seekable */
    isSeekable: boolean;
    /** Wether the audio is of a live stream */
    isStream: boolean;
    /** If isrc code is available, it's provided */
    isrc: string | null;
}

export interface TrackInfo {
    /** The Identifier of the Track */
    identifier: string;
    /** The Track Title / Name */
    title: string;
    /** The Name of the Author */
    author: string;
    /** The duration of the Track */
    duration: number;
    /** The URL of the artwork if available */
    artworkUrl: string | null;
    /** The URL (aka Link) of the Track called URI */
    uri: string;
    /** The Source name of the Track, e.g. soundcloud, youtube, spotify */
    sourceName: SourceNames;
    /** Wether the audio is seekable */
    isSeekable: boolean;
    /** Wether the audio is of a live stream */
    isStream: boolean;
    /** If isrc code is available, it's provided */
    isrc: string | null;
}



export interface PluginInfo {
    /** The Type provided by a plugin */
    type?: "album" | "playlist" | "artist" | "recommendations" | string;
    /** The Identifier provided by a plugin */
    albumName?: string;
    /** The url of the album */
    albumUrl?: string;
    /** The url of the album art */
    albumArtUrl?: string;
    /** The url of the artist */
    artistUrl?: string;
    /** The url of the artist artwork */
    artistArtworkUrl?: string;
    /** The url of the preview */
    previewUrl?: string;
    /** Whether the track is a preview */
    isPreview?: boolean;
    /** The total number of tracks in the playlist */
    totalTracks?: number;
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
    /** You can put specific track information here, to transform the tracks... */
    clientData?: {
        /* If provided and true, then this track won't get added to the previous array */
        previousTrack?: boolean;

        [key: string]: any;
    },
}

export interface LavalinkTrack {
    /** The Base 64 encoded String */
    encoded?: Base64;
    /** Track Information */
    info: LavalinkTrackInfo;
    /** Plugin Information from Lavalink */
    pluginInfo: Partial<PluginInfo>;
    /** The userData Object from when you provide to the lavalink request */
    userData?: anyObject;
}

export interface Track {
    /** The Base 64 encoded String */
    encoded?: Base64;
    /** Track Information */
    info: TrackInfo;
    /** Plugin Information from Lavalink */
    pluginInfo: Partial<PluginInfo>;
    /** The Track's Requester */
    requester?: unknown;
    /** The userData Object from when you provide to the lavalink request */
    userData?: anyObject;
}


export interface UnresolvedTrackInfo extends Partial<TrackInfo> {
    /** Required */
    title: string;
}
export interface UnresolvedQuery extends UnresolvedTrackInfo {
    /** The base64 of the unresolved track to "encode" */
    encoded?: Base64;
}
export interface UnresolvedTrack {
    /** Required */
    resolve: (player: Player) => Promise<void>;
    /** The Base 64 encoded String */
    encoded?: Base64;
    /** Track Information */
    info: UnresolvedTrackInfo;
    /** Plugin Information from Lavalink */
    pluginInfo: Partial<PluginInfo>;
    /** The userData Object from when you provide to the lavalink request */
    userData?: anyObject;
    /** The Track's Requester */
    requester?: unknown;
}
