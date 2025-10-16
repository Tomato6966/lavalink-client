import type {
    ClientCustomSearchPlatformUtils, LavalinkSearchPlatform, SearchPlatform, SourcesRegex
} from "./Types/Utils";

/** Default Sources Record, to allow source parsing with multiple inputs. */
export const DefaultSources: Record<SearchPlatform, LavalinkSearchPlatform | ClientCustomSearchPlatformUtils> = {
    // youtubemusic
    "youtube music": "ytmsearch",
    "youtubemusic": "ytmsearch",
    "ytmsearch": "ytmsearch",
    "ytm": "ytmsearch",
    "musicyoutube": "ytmsearch",
    "music youtube": "ytmsearch",
    // youtube
    "youtube": "ytsearch",
    "yt": "ytsearch",
    "ytsearch": "ytsearch",
    // soundcloud
    "soundcloud": "scsearch",
    "scsearch": "scsearch",
    "sc": "scsearch",
    // apple music
    "apple music": "amsearch",
    "apple": "amsearch",
    "applemusic": "amsearch",
    "amsearch": "amsearch",
    "am": "amsearch",
    "musicapple": "amsearch",
    "music apple": "amsearch",
    // spotify
    "spotify": "spsearch",
    "spsearch": "spsearch",
    "sp": "spsearch",
    "spotify.com": "spsearch",
    "spotifycom": "spsearch",
    "sprec": "sprec",
    "spsuggestion": "sprec",
    // deezer
    "deezer": "dzsearch",
    "dz": "dzsearch",
    "dzsearch": "dzsearch",
    "dzisrc": "dzisrc",
    "dzrec": "dzrec",
    // yandexmusic
    "yandex music": "ymsearch",
    "yandexmusic": "ymsearch",
    "yandex": "ymsearch",
    "ymsearch": "ymsearch",
    "ymrec": "ymrec",
    // VK Music (lavasrc)
    "vksearch": "vksearch",
    "vkmusic": "vksearch",
    "vk music": "vksearch",
    "vkrec": "vkrec",
    "vk": "vksearch",
    // Qobuz (lavasrc)
    "qbsearch": "qbsearch",
    "qobuz": "qbsearch",
    "qbisrc": "qbisrc",
    "qbrec": "qbrec",
    // pandora (lavasrc)
    "pandora": "pdsearch",
    "pd": "pdsearch",
    "pdsearch": "pdsearch",
    "pdisrc": "pdisrc",
    "pdrec": "pdrec",
    "pandora music": "pdsearch",
    "pandoramusic": "pdsearch",
    // speak PLUGIN
    "speak": "speak",
    "tts": "tts",
    "ftts": "ftts",
    "flowery": "ftts",
    "flowery.tts": "ftts",
    "flowerytts": "ftts",
    // Client sided search platforms (after lavalinkv4.0.6 it will search via bcsearch on the node itself)
    "bandcamp": "bcsearch",
    "bc": "bcsearch",
    "bcsearch": "bcsearch",
    // other searches:
    "phsearch": "phsearch",
    "pornhub": "phsearch",
    "porn": "phsearch",
    // local files
    "local": "local",
    // http requests
    "http": "http",
    "https": "https",
    "link": "link",
    "uri": "uri",
    // tidal
    "tidal": "tdsearch",
    "td": "tdsearch",
    "tidal music": "tdsearch",
    "tdsearch": "tdsearch",
    "tdrec": "tdrec",
    // jiosaavn
    "jiosaavn": "jssearch",
    "js": "jssearch",
    "jssearch": "jssearch",
    "jsrec": "jsrec"
}

/** Lavalink Plugins definiton */
export const LavalinkPlugins = {
    DuncteBot_Plugin: "DuncteBot-plugin",
    LavaSrc: "lavasrc-plugin",
    GoogleCloudTTS: "tts-plugin",
    LavaSearch: "lavasearch-plugin",
    Jiosaavn_Plugin: "jiosaavn-plugin",
    LavalinkFilterPlugin: "lavalink-filter-plugin",
    JavaTimedLyricsPlugin: "java-lyrics-plugin"
}

/** Lavalink Sources regexes for url validations */
export const SourceLinksRegexes: Record<SourcesRegex, RegExp> = {
    /** DEFAULT SUPPORTED BY LAVALINK */
    YoutubeRegex: /https?:\/\/?(?:www\.)?(?:(m|www)\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/,
    YoutubeMusicRegex: /https?:\/\/?(?:www\.)?(?:(music|m|www)\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/,

    SoundCloudRegex: /https:\/\/(?:on\.)?soundcloud\.com\//,
    SoundCloudMobileRegex: /https?:\/\/(soundcloud\.app\.goo\.gl)\/(\S+)/,
    bandcamp: /https?:\/\/?(?:www\.)?([\d|\w]+)\.bandcamp\.com\/(\S+)/,
    TwitchTv: /https?:\/\/?(?:www\.)?twitch\.tv\/\w+/,
    vimeo: /https?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/,

    mp3Url: /(https?|ftp|file):\/\/(www.)?(.*?)\.(mp3)$/,
    m3uUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(m3u)$/,
    m3u8Url: /(https?|ftp|file):\/\/(www.)?(.*?)\.(m3u8)$/,
    mp4Url: /(https?|ftp|file):\/\/(www.)?(.*?)\.(mp4)$/,
    m4aUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(m4a)$/,
    wavUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(wav)$/,
    aacpUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(aacp)$/,

    /** FROM LAVA SOURCE */
    DeezerTrackRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?track\/(\d+)/,
    DeezerPageLinkRegex: /(https?:\/\/|)?(?:www\.)?deezer\.page\.link\/(\S+)/,
    DeezerPlaylistRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?playlist\/(\d+)/,
    DeezerAlbumRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?album\/(\d+)/,
    DeezerArtistRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?artist\/(\d+)/,
    DeezerMixesRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?mixes\/genre\/(\d+)/,
    DeezerEpisodeRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?episode\/(\d+)/,
    // DeezerPodcastRegex: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?podcast\/(\d+)/,
    AllDeezerRegexWithoutPageLink: /(https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|playlist|album|artist|mixes\/genre|episode)\/(\d+)/,
    AllDeezerRegex: /((https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|playlist|album|artist|mixes\/genre|episode)\/(\d+)|(https?:\/\/|)?(?:www\.)?deezer\.page\.link\/(\S+))/,

    SpotifySongRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?track\/(?<identifier>[a-zA-Z0-9-_]+)/,
    SpotifyPlaylistRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?playlist\/(?<identifier>[a-zA-Z0-9-_]+)/,
    SpotifyArtistRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?artist\/(?<identifier>[a-zA-Z0-9-_]+)/,
    SpotifyEpisodeRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?episode\/(?<identifier>[a-zA-Z0-9-_]+)/,
    SpotifyShowRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?show\/(?<identifier>[a-zA-Z0-9-_]+)/,
    SpotifyAlbumRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?album\/(?<identifier>[a-zA-Z0-9-_]+)/,
    AllSpotifyRegex: /(https?:\/\/)(www\.)?open\.spotify\.com\/((?<region>[a-zA-Z-]+)\/)?(user\/(?<user>[a-zA-Z0-9-_]+)\/)?(?<type>track|album|playlist|artist|episode|show)\/(?<identifier>[a-zA-Z0-9-_]+)/,

    appleMusic: /https?:\/\/?(?:www\.)?music\.apple\.com\/(\S+)/,

    /** From tidal */
    tidal: /https?:\/\/?(?:www\.)?(?:tidal|listen)\.tidal\.com\/(?<type>track|album|playlist|artist)\/(?<identifier>[a-zA-Z0-9-_]+)/,

    /** From jiosaavn-plugin */
    jiosaavn: /(https?:\/\/)(www\.)?jiosaavn\.com\/(?<type>song|album|featured|artist)\/([a-zA-Z0-9-_/,]+)/,

    /** From pandora */
    PandoraTrackRegex: /^@?(?:https?:\/\/)?(?:www\.)?pandora\.com\/artist\/[\w\-]+(?:\/[\w\-]+)*\/(?<identifier>TR[A-Za-z0-9]+)(?:[?#].*)?$/,
    PandoraAlbumRegex: /^@?(?:https?:\/\/)?(?:www\.)?pandora\.com\/artist\/[\w\-]+(?:\/[\w\-]+)*\/(?<identifier>AL[A-Za-z0-9]+)(?:[?#].*)?$/,
    PandoraArtistRegex: /^@?(?:https?:\/\/)?(?:www\.)?pandora\.com\/artist\/[\w\-]+\/(?<identifier>AR[A-Za-z0-9]+)(?:[?#].*)?$/,
    PandoraPlaylistRegex: /^@?(?:https?:\/\/)?(?:www\.)?pandora\.com\/playlist\/(?<identifier>PL:[\d:]+)(?:[?#].*)?$/,
    AllPandoraRegex: /^@?(?:https?:\/\/)?(?:www\.)?pandora\.com\/(?:playlist\/(?<playlistId>PL:[\d:]+)|artist\/[\w\-]+(?:\/[\w\-]+)*\/(?<identifier>(?:TR|AL|AR)[A-Za-z0-9]+))(?:[?#].*)?$/,

    /** FROM DUNCTE BOT PLUGIN */
    tiktok: /https:\/\/www\.tiktok\.com\//,
    mixcloud: /https:\/\/www\.mixcloud\.com\//,
    musicYandex: /https:\/\/music\.yandex\.ru\//,
    radiohost: /https?:\/\/[^.\s]+\.radiohost\.de\/(\S+)/,
}
