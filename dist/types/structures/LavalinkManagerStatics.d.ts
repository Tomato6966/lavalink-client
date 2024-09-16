import type { ClientCustomSearchPlatformUtils, LavalinkSearchPlatform, SearchPlatform, SourcesRegex } from "./Types/Utils";
/** Default Sources Record, to allow source parsing with multiple inputs. */
export declare const DefaultSources: Record<SearchPlatform, LavalinkSearchPlatform | ClientCustomSearchPlatformUtils>;
/** Lavalink Plugins definiton */
export declare const LavalinkPlugins: {
    DuncteBot_Plugin: string;
    LavaSrc: string;
    GoogleCloudTTS: string;
    LavaSearch: string;
    Jiosaavn_Plugin: string;
    LavalinkFilterPlugin: string;
    JavaTimedLyricsPlugin: string;
};
/** Lavalink Sources regexes for url validations */
export declare const SourceLinksRegexes: Record<SourcesRegex, RegExp>;
