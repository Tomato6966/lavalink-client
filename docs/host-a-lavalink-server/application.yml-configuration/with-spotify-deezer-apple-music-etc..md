# With Spotify, Deezer, Apple Music, etc.

You need to add plugins, like lavasrc, for that check out [plugins setup](https://lavalink.dev/plugins.html) from lavalink or just use this  application.yml (to your needs)

<pre class="language-yaml" data-title="application.yml"><code class="lang-yaml">server: # REST and WS server
  port: 2333
  address: 0.0.0.0
lavalink:
  server:
    password: "yourverystrongpassword"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
      local: true
    filters: # All filters are enabled by default
      volume: true
      equalizer: true
      karaoke: true
      timescale: true
      tremolo: true
      vibrato: true
      distortion: true
      rotation: true
      channelMix: true
      lowPass: true
    bufferDurationMs: 400 # The duration of the NAS buffer. Higher values fare better against longer GC pauses
    frameBufferDurationMs: 5000 # How many milliseconds of audio to keep buffered
    youtubePlaylistLoadLimit: 3 # Number of pages at 100 each
    opusEncodingQuality: 5 # Opus encoder quality. Valid values range from 0 to 10, where 10 is best quality but is the most expensive on the CPU.
    resamplingQuality: LOW # Quality of resampling operations. Valid values are LOW, MEDIUM and HIGH, where HIGH uses the most CPU.
    trackStuckThresholdMs: 10000 # The threshold for how long a track can be stuck. A track is stuck if does not return any audio data.
    playerUpdateInterval: 5 # How frequently to send player updates to clients, in seconds
    useSeekGhosting: true # Seek ghosting is the effect where whilst a seek is in progress, the audio buffer is read from until empty, or until seek is ready.
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-warnings: true
    #ratelimit: # 
      #ipBlocks: [] # list of ip blocks, e.g. ["1234:2abc:100:10e::/64"]
      #excludedIps: ["...", "..."] # ips which should be explicit excluded from usage by lavalink
      #strategy: "RotateOnBan" # RotateOnBan | LoadBalance | NanoSwitch | RotatingNanoSwitch
      #searchTriggersFail: true # Whether a search 429 should trigger marking the ip as failing
      #retryLimit: -1 # -1 = use default lavaplayer value | 0 = infinity | >0 = retry will happen this numbers times
    #youtubeConfig: # Required for avoiding all age restrictions by YouTube, some restricted videos still can be played without.
      #email: "" # Email of Google account
      #password: "" # Password of Google account
    #httpConfig: # Useful for blocking bad-actors from ip-grabbing your music node and attacking it, this way only the http proxy will be attacked
      #proxyHost: "localhost" # Hostname of the proxy, (ip or domain)
      #proxyPort: 3128 # Proxy port, 3128 is the default for squidProxy
      #proxyUser: "" # Optional user for basic authentication fields, leave blank if you don't use basic auth
      #proxyPassword: "" # Password for basic authentication


  plugins:
<strong>#    - dependency: "com.dunctebot:skybot-lavalink-plugin:1.4.2" # DuncteBot lavalink plugin
</strong>#      repository: "https://m2.duncte123.dev/releases"
#    - dependency: "me.rohank05:lavalink-filter-plugin:0.0.4" # lavalink-filter plugin (echo+reverb filter [currently not working on v4])
#      repository: "https://jitpack.io"
#     - dependency: "com.github.topi314.sponsorblock:sponsorblock-plugin:3.0.0-beta.3" # Not really needed, but adds support for skipping sponsor-block/chapter segments 
#      repository: "https://maven.topi.wtf/releases"

# The following plugins are the ones which add the support for the advanced searches + sources
    - dependency: "com.github.topi314.lavasrc:lavasrc-plugin:4.0.0-beta.6" # adds support for spotify, deezer, yandexmusic, applemusic
      repository: "https://maven.topi.wtf/releases"
    - dependency: "com.github.topi314.lavasearch:lavasearch-plugin:1.0.0-beta.2" # adds support for filtered searches for track, playlist, album, artist, text ( player.lavaSearch() )
      repository: "https://maven.topi.wtf/releases"
    

plugins:
  lavasrc:
    providers:
      - "dzisrc:%ISRC%" # If ISRC available, search on deezer
      - "ytsearch:\"%ISRC%\"" # If ISRC available, search on youtube
      - "dzsearch:%QUERY%" # Search on deezer, if no results found use the next provider
      - "ytmsearch:%QUERY%" # If you want music.youtube results first
      - "ytsearch:%QUERY%" # If no result found on music.youtube, search on www.youtube
      - "scsearch:%QUERY%" # Last try to search on soundcloud.
    sources:
      spotify: true
      applemusic: true # only enable applemusic if you have the mediaAPIToken provided
      deezer: true
      yandexmusic: true
      flowerytts: true # Enable Flowery TTS source
    spotify:
      clientId: "..."
      clientSecret: "..."
      countryCode: "US"
      playlistLoadLimit: 3 # The number of pages at 100 tracks each
      albumLoadLimit: 6 # The number of pages at 50 tracks each
    applemusic:
      countryCode: "US" 
      mediaAPIToken: "..." # apple music api token
      playlistLoadLimit: 1 # The number of pages at 300 tracks each
      albumLoadLimit: 1 # The number of pages at 300 tracks each
    deezer:
      masterDecryptionKey: "g.............1"
    yandexmusic:
      accessToken: "...."
    flowerytts: # Example (correct + working) configuration for flowery-tts
      voice: "Olivia" # (case-sensitive) get default voice from here https://api.flowery.pw/v1/tts/voices
      translate: false # whether to translate the text to the native language of voice
      silence: 0 # the silence parameter is in milliseconds. Range is 0 to 10000. The default is 0.
      speed: 1.0 # the speed parameter is a float between 0.5 and 10. The default is 1.0. (0.5 is half speed, 2.0 is double speed, etc.)
      audioFormat: "mp3" # supported formats are: mp3, ogg_opus, ogg_vorbis, aac, wav, and flac. Default format is mp3

metrics:
  prometheus:
    enabled: false
    endpoint: /metrics

sentry:
  dsn: ""
  environment: ""
#  tags:
#    some_key: some_value
#    another_key: another_value

logging: # keep logs as low (on storage size) as possible to save space
  file:
    max-history: 10
    max-size: 10MB
  path: ./logs/

  level:
    root: INFO
    lavalink: INFO

  request:
    enabled: true
    includeClientInfo: true
    includeHeaders: true
    includeQueryString: true
    includePayload: true
    maxPayloadLength: 10000

  logback:
    rollingpolicy:
      max-file-size: 10MB
      max-history: 10
</code></pre>
