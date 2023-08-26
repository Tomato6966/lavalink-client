# application.yml Configuration

The server configuration is done in `application.yml`. You can find an example below.

### Example `application.yml` <a href="#example-applicationyml" id="example-applicationyml"></a>

<details>

<summary><mark style="color:red;">application.yml</mark></summary>

{% code title="application.yml" %}
```yaml
server: # REST and WS server
  port: 2333
  address: 0.0.0.0
plugins:
#  name: # Name of the plugin
#    some_key: some_value # Some key-value pair for the plugin
#    another_key: another_value
lavalink:
  plugins:
#    - dependency: "group:artifact:version"
#      repository: "repository"
  pluginsDir: "./plugins"
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
      local: false
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
    bufferDurationMs: 400 # The duration of the NAS buffer. Higher values fare better against longer GC pauses. Duration <= 0 to disable JDA-NAS. Minimum of 40ms, lower values may introduce pauses.
    frameBufferDurationMs: 5000 # How many milliseconds of audio to keep buffered
    opusEncodingQuality: 10 # Opus encoder quality. Valid values range from 0 to 10, where 10 is best quality but is the most expensive on the CPU.
    resamplingQuality: LOW # Quality of resampling operations. Valid values are LOW, MEDIUM and HIGH, where HIGH uses the most CPU.
    trackStuckThresholdMs: 10000 # The threshold for how long a track can be stuck. A track is stuck if does not return any audio data.
    useSeekGhosting: true # Seek ghosting is the effect where whilst a seek is in progress, the audio buffer is read from until empty, or until seek is ready.
    youtubePlaylistLoadLimit: 6 # Number of pages at 100 each
    playerUpdateInterval: 5 # How frequently to send player updates to clients, in seconds
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-warnings: true
    #ratelimit:
      #ipBlocks: ["1.0.0.0/8", "..."] # list of ip blocks
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

logging:
  file:
    path: ./logs/

  level:
    root: INFO
    lavalink: INFO

  request:
    enabled: true
    includeClientInfo: true
    includeHeaders: false
    includeQueryString: true
    includePayload: true
    maxPayloadLength: 10000


  logback:
    rollingpolicy:
      max-file-size: 1GB
      max-history: 30
```
{% endcode %}

</details>

[Example for application.yml with plugins](with-spotify-deezer-apple-music-etc..md)

Alternatively, you can also use environment variables to configure the server. The environment variables are named the same as the keys in the `application.yml` file, but in uppercase and with `.` replaced with `_`. For example, `server.port` becomes `SERVER_PORT`. For arrays, the index is appended to the key, starting at 0. For example, `LAVALINK_PLUGINS_0_DEPENDENCY` refers to the `dependency` key of the first plugin.

### Example environment variables <a href="#example-environment-variables" id="example-environment-variables"></a>

<details>

<summary><mark style="color:red;">environment variables</mark></summary>

```
SERVER_PORT
SERVER_ADDRESS

LAVALINK_PLUGINS_0_DEPENDENCY
LAVALINK_PLUGINS_0_REPOSITORY

LAVALINK_PLUGINS_1_DEPENDENCY
LAVALINK_PLUGINS_1_REPOSITORY

LAVALINK_PLUGINS_DIR

LAVALINK_SERVER_PASSWORD
LAVALINK_SERVER_SOURCES_YOUTUBE
LAVALINK_SERVER_SOURCES_BANDCAMP
LAVALINK_SERVER_SOURCES_SOUNDCLOUD
LAVALINK_SERVER_SOURCES_TWITCH
LAVALINK_SERVER_SOURCES_VIMEO
LAVALINK_SERVER_SOURCES_HTTP
LAVALINK_SERVER_SOURCES_LOCAL

LAVALINK_SERVER_FILTERS_VOLUME
LAVALINK_SERVER_FILTERS_EQUALIZER
LAVALINK_SERVER_FILTERS_KARAOKE
LAVALINK_SERVER_FILTERS_TIMESCALE
LAVALINK_SERVER_FILTERS_TREMOLO
LAVALINK_SERVER_FILTERS_VIBRATO
LAVALINK_SERVER_FILTERS_DISTORTION
LAVALINK_SERVER_FILTERS_ROTATION
LAVALINK_SERVER_FILTERS_CHANNEL_MIX
LAVALINK_SERVER_FILTERS_LOW_PASS

LAVALINK_SERVER_BUFFER_DURATION_MS
LAVALINK_SERVER_FRAME_BUFFER_DURATION_MS
LAVALINK_SERVER_OPUS_ENCODING_QUALITY
LAVALINK_SERVER_RESAMPLING_QUALITY
LAVALINK_SERVER_TRACK_STUCK_THRESHOLD_MS
LAVALINK_SERVER_USE_SEEK_GHOSTING

LAVALINK_SERVER_PLAYER_UPDATE_INTERVAL
LAVALINK_SERVER_YOUTUBE_SEARCH_ENABLED
LAVALINK_SERVER_SOUNDCLOUD_SEARCH_ENABLED

LAVALINK_SERVER_GC_WARNINGS

LAVALINK_SERVER_RATELIMIT_IP_BLOCKS
LAVALINK_SERVER_RATELIMIT_EXCLUDE_IPS
LAVALINK_SERVER_RATELIMIT_STRATEGY
LAVALINK_SERVER_RATELIMIT_SEARCH_TRIGGERS_FAIK
LAVALINK_SERVER_RATELIMIT_RETRY_LIMIT

LAVALINK_SERVER_YOUTUBE_CONFIG_EMAIL
LAVALINK_SERVER_YOUTUBE_CONFIG_PASSWORD

LAVALINK_SERVER_HTTP_CONFIG_PROXY_HOST
LAVALINK_SERVER_HTTP_CONFIG_PROXY_PORT
LAVALINK_SERVER_HTTP_CONFIG_PROXY_USER
LAVALINK_SERVER_HTTP_CONFIG_PROXY_PASSWORD

METRICS_PROMETHEUS_ENABLED
METRICS_PROMETHEUS_ENDPOINT

SENTRY_DSN
SENTRY_ENVIRONMENT
SENTRY_TAGS_SOME_KEY
SENTRY_TAGS_ANOTHER_KEY

LOGGING_FILE_PATH
LOGGING_LEVEL_ROOT
LOGGING_LEVEL_LAVALINK

LOGGING_REQUEST_ENABLED
LOGGING_REQUEST_INCLUDE_CLIENT_INFO
LOGGING_REQUEST_INCLUDE_HEADERS
LOGGING_REQUEST_INCLUDE_QUERY_STRING
LOGGING_REQUEST_INCLUDE_PAYLOAD
LOGGING_REQUEST_MAX_PAYLOAD_LENGTH

LOGGING_LOGBACK_ROLLINGPOLICY_MAX_FILE_SIZE
LOGGING_LOGBACK_ROLLINGPOLICY_MAX_HISTORY
```

</details>

You can also use a combination of both. Environment variables take precedence over the `application.yml` file.
