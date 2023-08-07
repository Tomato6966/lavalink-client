"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEXES = exports.DEFAULT_SOURCES = void 0;
exports.DEFAULT_SOURCES = {
    // youtubemusic
    "youtube music": "ytmsearch",
    "ytmsearch": "ytmsearch",
    "ytm": "ytmsearch",
    // youtube
    "youtube": "ytsearch",
    "yt": "ytsearch",
    "ytsearch": "ytsearch",
    // soundcloud
    "soundcloud": "scsearch",
    "scsearch": "scsearch",
    "sc": "scsearch",
    // apple music
    "amsearch": "amsearch",
    "am": "amsearch",
    // spotify 
    "spsearch": "spsearch",
    "sp": "spsearch",
    "sprec": "sprec",
    "spsuggestion": "sprec",
    // deezer
    "dz": "dzsearch",
    "deezer": "dzsearch",
    "ds": "dzsearch",
    "dzsearch": "dzsearch",
    "dzisrc": "dzisrc",
    // yandexmusic
    "yandexmusic": "ymsearch",
    "yandex": "ymsearch",
    "ymsearch": "ymsearch",
    // speak
    "speak": "speak",
    "tts": "tts",
};
exports.REGEXES = {
    YoutubeRegex: /https?:\/\/?(?:www\.)?(?:(m|www)\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/,
    YoutubeMusicRegex: /https?:\/\/?(?:www\.)?(?:(music|m|www)\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/,
    SoundCloudRegex: /https:\/\/(?:on\.)?soundcloud\.com\//,
    SoundCloudMobileRegex: /https?:\/\/(soundcloud\.app\.goo\.gl)\/(\S+)/,
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
    mp3Url: /(https?|ftp|file):\/\/(www.)?(.*?)\.(mp3)$/,
    m3uUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(m3u)$/,
    m3u8Url: /(https?|ftp|file):\/\/(www.)?(.*?)\.(m3u8)$/,
    mp4Url: /(https?|ftp|file):\/\/(www.)?(.*?)\.(mp4)$/,
    m4aUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(m4a)$/,
    wavUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(wav)$/,
    aacpUrl: /(https?|ftp|file):\/\/(www.)?(.*?)\.(aacp)$/,
    tiktok: /https:\/\/www\.tiktok\.com\//,
    mixcloud: /https:\/\/www\.mixcloud\.com\//,
    musicYandex: /https:\/\/music\.yandex\.ru\//,
    radiohost: /https?:\/\/[^.\s]+\.radiohost\.de\/(\S+)/,
    bandcamp: /https?:\/\/?(?:www\.)?([\d|\w]+)\.bandcamp\.com\/(\S+)/,
    appleMusic: /https?:\/\/?(?:www\.)?music\.apple\.com\/(\S+)/,
    TwitchTv: /https?:\/\/?(?:www\.)?twitch\.tv\/\w+/,
    vimeo: /https?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/,
};
