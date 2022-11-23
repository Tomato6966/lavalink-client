import { PlatformStrings, Platforms } from "./Platforms";


export interface LavalinkSearchTrack {
    track: string,
    info: {
        identifier: string,
        isSeekable: boolean,
        author: string,
        length: number,
        isStream: boolean,
        position: number,
        sourceName: keyof typeof PlatformStrings,
        title: string,
        uri: string
    },
}

//export interface LavalinkTrack extends LavalinkSearchTrack {
//    requester: any;
//    isPreview: boolean;
//   thumbnail: string | null;
// }

export interface Track {
    /** The base64 encoded track. */
    track: string;
    /** The title of the track. */
    title: string;
    /** The identifier of the track. */
    identifier: string;
    /** The author of the track. */
    author: string;
    /** The duration of the track. */
    duration: number;
    /** If the track is seekable. */
    isSeekable: boolean;
    /** If the track is a stream.. */
    isStream: boolean;
    /** The uri of the track. */
    uri: string;
    /** The thumbnail of the track or null if it's a unsupported source. */
    thumbnail: string | null;
    /** The user that requested the track. */
    requester: unknown | null;
    /** Displays the track thumbnail with optional size or null if it's a unsupported source. */
    displayThumbnail(size?: Sizes): string;
    /** If the Track is a preview */
    isPreview: boolean;
}

/** Unresolved tracks can't be played normally, they will resolve before playing into a Track. - Useful for Databasing things */
export interface UnresolvedTrack extends Partial<Track> {
    /** The title to search against. */
    title: string;
    /** The author to search against. */
    author?: string;
    /** The duration to search within 1500 milliseconds of the results from YouTube. */
    duration?: number;
    /** Thumbnail of the track */
    thumbnail?: string;
    /** Identifier of the track */
    identifier?: string;
    /** Resolves into a Track. */
    resolve(): Promise<void>;
}