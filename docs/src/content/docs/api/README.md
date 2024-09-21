---
editUrl: false
next: true
prev: true
title: "Lavalink Client"
---

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [DebugEvents](/api/enumerations/debugevents/) | - |
| [DestroyReasons](/api/enumerations/destroyreasons/) | - |

## Classes

| Class | Description |
| ------ | ------ |
| [DefaultQueueStore](/api/classes/defaultqueuestore/) | - |
| [FilterManager](/api/classes/filtermanager/) | The FilterManager for each player |
| [LavalinkManager](/api/classes/lavalinkmanager/) | - |
| [LavalinkNode](/api/classes/lavalinknode/) | Lavalink Node creator class |
| [ManagerUtils](/api/classes/managerutils/) | - |
| [MiniMap](/api/classes/minimap/) | - |
| [NodeManager](/api/classes/nodemanager/) | - |
| [Player](/api/classes/player/) | - |
| [Queue](/api/classes/queue/) | - |
| [QueueSaver](/api/classes/queuesaver/) | - |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [BaseNodeStats](/api/interfaces/basenodestats/) | BaseNodeStats object from Lavalink |
| [BasePlayOptions](/api/interfaces/baseplayoptions/) | - |
| [BotClientOptions](/api/interfaces/botclientoptions/) | The Bot client Options needed for the manager |
| [ChannelDeletePacket](/api/interfaces/channeldeletepacket/) | - |
| [ChannelMixFilter](/api/interfaces/channelmixfilter/) | Mixes both channels (left and right), with a configurable factor on how much each channel affects the other. With the defaults, both channels are kept independent of each other. Setting all factors to 0.5 means both channels get the same audio. |
| [CPUStats](/api/interfaces/cpustats/) | CPU Stats object from lavalink |
| [DistortionFilter](/api/interfaces/distortionfilter/) | Distortion effect. It can generate some pretty unique audio effects. |
| [EQBand](/api/interfaces/eqband/) | There are 15 bands (0-14) that can be changed. "gain" is the multiplier for the given band. The default value is 0. Valid values range from -0.25 to 1.0, where -0.25 means the given band is completely muted, and 0.25 means it is doubled. Modifying the gain could also change the volume of the output. |
| [Exception](/api/interfaces/exception/) | - |
| [FailingAddress](/api/interfaces/failingaddress/) | - |
| [FilterData](/api/interfaces/filterdata/) | Filter Data stored in the Client and partially sent to Lavalink |
| [FrameStats](/api/interfaces/framestats/) | FrameStats Object from lavalink |
| [GitObject](/api/interfaces/gitobject/) | Git information object from lavalink |
| [GuildShardPayload](/api/interfaces/guildshardpayload/) | - |
| [InvalidLavalinkRestRequest](/api/interfaces/invalidlavalinkrestrequest/) | - |
| [KaraokeFilter](/api/interfaces/karaokefilter/) | Uses equalization to eliminate part of a band, usually targeting vocals. |
| [LavalinkFilterData](/api/interfaces/lavalinkfilterdata/) | Actual Filter Data sent to Lavalink |
| [LavalinkInfo](/api/interfaces/lavalinkinfo/) | Entire lavalink information object from lavalink |
| [LavalinkManagerEvents](/api/interfaces/lavalinkmanagerevents/) | The events from the lavalink Manager |
| [LavalinkNodeOptions](/api/interfaces/lavalinknodeoptions/) | Node Options for creating a lavalink node |
| [LavalinkPlayer](/api/interfaces/lavalinkplayer/) | - |
| [LavalinkPlayerVoice](/api/interfaces/lavalinkplayervoice/) | - |
| [LavalinkPlayOptions](/api/interfaces/lavalinkplayoptions/) | - |
| [LavalinkTrack](/api/interfaces/lavalinktrack/) | - |
| [LavalinkTrackInfo](/api/interfaces/lavalinktrackinfo/) | - |
| [LavaSearchFilteredResponse](/api/interfaces/lavasearchfilteredresponse/) | - |
| [LavaSearchResponse](/api/interfaces/lavasearchresponse/) | - |
| [LowPassFilter](/api/interfaces/lowpassfilter/) | Higher frequencies get suppressed, while lower frequencies pass through this filter, thus the name low pass. Any smoothing values equal to or less than 1.0 will disable the filter. |
| [LyricsFoundEvent](/api/interfaces/lyricsfoundevent/) | - |
| [LyricsLine](/api/interfaces/lyricsline/) | - |
| [LyricsLineEvent](/api/interfaces/lyricslineevent/) | - |
| [LyricsNotFoundEvent](/api/interfaces/lyricsnotfoundevent/) | - |
| [LyricsResult](/api/interfaces/lyricsresult/) | - |
| [ManagerOptions](/api/interfaces/manageroptions/) | Manager Options used to create the manager |
| [ManagerPlayerOptions](/api/interfaces/managerplayeroptions/) | Sub Manager Options, for player specific things |
| [ManagerQueueOptions](/api/interfaces/managerqueueoptions/) | - |
| [MemoryStats](/api/interfaces/memorystats/) | Memory Stats object from lavalink |
| [NodeManagerEvents](/api/interfaces/nodemanagerevents/) | - |
| [NodeMessage](/api/interfaces/nodemessage/) | Interface for nodeStats from lavalink |
| [NodeStats](/api/interfaces/nodestats/) | Interface for nodeStats from lavalink |
| [PlayerEvent](/api/interfaces/playerevent/) | - |
| [PlayerFilters](/api/interfaces/playerfilters/) | The "active" / "disabled" Player Filters |
| [PlayerJson](/api/interfaces/playerjson/) | - |
| [PlayerOptions](/api/interfaces/playeroptions/) | - |
| [PlayerUpdateInfo](/api/interfaces/playerupdateinfo/) | - |
| [PlaylistInfo](/api/interfaces/playlistinfo/) | - |
| [PlayOptions](/api/interfaces/playoptions/) | - |
| [PluginInfo](/api/interfaces/plugininfo/) | - |
| [PluginObject](/api/interfaces/pluginobject/) | Lavalink's plugins object from lavalink's plugin |
| [QueueChangesWatcher](/api/interfaces/queuechangeswatcher/) | - |
| [QueueStoreManager](/api/interfaces/queuestoremanager/) | - |
| [RotationFilter](/api/interfaces/rotationfilter/) | Rotates the sound around the stereo channels/user headphones (aka Audio Panning). It can produce an effect similar to https://youtu.be/QB9EB8mTKcc (without the reverb). |
| [RoutePlanner](/api/interfaces/routeplanner/) | - |
| [SearchResult](/api/interfaces/searchresult/) | - |
| [Session](/api/interfaces/session/) | - |
| [SponsorBlockChaptersLoaded](/api/interfaces/sponsorblockchaptersloaded/) | - |
| [SponsorBlockChapterStarted](/api/interfaces/sponsorblockchapterstarted/) | - |
| [SponsorBlockSegmentSkipped](/api/interfaces/sponsorblocksegmentskipped/) | - |
| [SponsorBlockSegmentsLoaded](/api/interfaces/sponsorblocksegmentsloaded/) | - |
| [StoredQueue](/api/interfaces/storedqueue/) | - |
| [TimescaleFilter](/api/interfaces/timescalefilter/) | Changes the speed, pitch, and rate |
| [Track](/api/interfaces/track/) | - |
| [TrackEndEvent](/api/interfaces/trackendevent/) | - |
| [TrackExceptionEvent](/api/interfaces/trackexceptionevent/) | - |
| [TrackInfo](/api/interfaces/trackinfo/) | - |
| [TrackStartEvent](/api/interfaces/trackstartevent/) | - |
| [TrackStuckEvent](/api/interfaces/trackstuckevent/) | - |
| [TremoloFilter](/api/interfaces/tremolofilter/) | Uses amplification to create a shuddering effect, where the volume quickly oscillates. Demo: https://en.wikipedia.org/wiki/File:Fuse_Electronics_Tremolo_MK-III_Quick_Demo.ogv |
| [UnresolvedQuery](/api/interfaces/unresolvedquery/) | - |
| [UnresolvedSearchResult](/api/interfaces/unresolvedsearchresult/) | - |
| [UnresolvedTrack](/api/interfaces/unresolvedtrack/) | - |
| [UnresolvedTrackInfo](/api/interfaces/unresolvedtrackinfo/) | - |
| [VersionObject](/api/interfaces/versionobject/) | Lavalink's version object from lavalink |
| [VibratoFilter](/api/interfaces/vibratofilter/) | Similar to tremolo. While tremolo oscillates the volume, vibrato oscillates the pitch. |
| [VoicePacket](/api/interfaces/voicepacket/) | - |
| [VoiceServer](/api/interfaces/voiceserver/) | - |
| [VoiceState](/api/interfaces/voicestate/) | - |
| [WebSocketClosedEvent](/api/interfaces/websocketclosedevent/) | - |

## Type Aliases

| Type alias | Description |
| ------ | ------ |
| [anyObject](/api/type-aliases/anyobject/) | - |
| [AudioOutputs](/api/type-aliases/audiooutputs/) | The Audio Outputs type |
| [Base64](/api/type-aliases/base64/) | The Base64 decodes tring by lavalink |
| [ClientCustomSearchPlatformUtils](/api/type-aliases/clientcustomsearchplatformutils/) | - |
| [ClientSearchPlatform](/api/type-aliases/clientsearchplatform/) | - |
| [DestroyReasonsType](/api/type-aliases/destroyreasonstype/) | - |
| [DuncteSearchPlatform](/api/type-aliases/dunctesearchplatform/) | - |
| [FloatNumber](/api/type-aliases/floatnumber/) | Opqaue tyep for floatnumber |
| [IntegerNumber](/api/type-aliases/integernumber/) | Opqaue tyep for integernumber |
| [JioSaavnSearchPlatform](/api/type-aliases/jiosaavnsearchplatform/) | - |
| [LavalinkClientSearchPlatform](/api/type-aliases/lavalinkclientsearchplatform/) | - |
| [LavalinkClientSearchPlatformResolve](/api/type-aliases/lavalinkclientsearchplatformresolve/) | - |
| [LavalinkNodeIdentifier](/api/type-aliases/lavalinknodeidentifier/) | - |
| [LavalinkPlayerVoiceOptions](/api/type-aliases/lavalinkplayervoiceoptions/) | - |
| [LavalinkPlugin\_LavaSrc\_SourceNames](/api/type-aliases/lavalinkplugin_lavasrc_sourcenames/) | Source Names provided by lava src plugin |
| [LavalinkSearchPlatform](/api/type-aliases/lavalinksearchplatform/) | - |
| [LavalinkSourceNames](/api/type-aliases/lavalinksourcenames/) | Sourcenames provided by lavalink server |
| [LavaSearchQuery](/api/type-aliases/lavasearchquery/) | SearchQuery Object for Lavalink LavaSearch Plugin requests |
| [LavaSearchType](/api/type-aliases/lavasearchtype/) | Specific types to filter for lavasearch, will be filtered to correct types |
| [LavaSrcSearchPlatform](/api/type-aliases/lavasrcsearchplatform/) | - |
| [LavaSrcSearchPlatformBase](/api/type-aliases/lavasrcsearchplatformbase/) | - |
| [LoadTypes](/api/type-aliases/loadtypes/) | - |
| [LyricsEvent](/api/type-aliases/lyricsevent/) | Types & Events for Lyrics plugin from Lavalink: https://github.com/topi314/LavaLyrics |
| [LyricsEventType](/api/type-aliases/lyricseventtype/) | - |
| [ModifyRequest](/api/type-aliases/modifyrequest/) | Ability to manipulate fetch requests |
| [Opaque](/api/type-aliases/opaque/) | Helper for generating Opaque types. |
| [PlayerEvents](/api/type-aliases/playerevents/) | - |
| [PlayerEventType](/api/type-aliases/playereventtype/) | - |
| [RepeatMode](/api/type-aliases/repeatmode/) | - |
| [RoutePlannerTypes](/api/type-aliases/routeplannertypes/) | - |
| [SearchPlatform](/api/type-aliases/searchplatform/) | - |
| [SearchQuery](/api/type-aliases/searchquery/) | SearchQuery Object for raw lavalink requests |
| [Severity](/api/type-aliases/severity/) | - |
| [SourceNames](/api/type-aliases/sourcenames/) | The SourceNames provided by lavalink |
| [SourcesRegex](/api/type-aliases/sourcesregex/) | - |
| [SponsorBlockSegment](/api/type-aliases/sponsorblocksegment/) | - |
| [SponsorBlockSegmentEvents](/api/type-aliases/sponsorblocksegmentevents/) | Types & Events for Sponsorblock-plugin from Lavalink: https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded |
| [SponsorBlockSegmentEventType](/api/type-aliases/sponsorblocksegmenteventtype/) | - |
| [State](/api/type-aliases/state/) | - |
| [TrackEndReason](/api/type-aliases/trackendreason/) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [audioOutputsData](/api/variables/audiooutputsdata/) | The audio Outputs Data map declaration |
| [DefaultSources](/api/variables/defaultsources/) | Default Sources Record, to allow source parsing with multiple inputs. |
| [EQList](/api/variables/eqlist/) | - |
| [LavalinkPlugins](/api/variables/lavalinkplugins/) | Lavalink Plugins definiton |
| [NodeSymbol](/api/variables/nodesymbol/) | - |
| [QueueSymbol](/api/variables/queuesymbol/) | - |
| [SourceLinksRegexes](/api/variables/sourcelinksregexes/) | Lavalink Sources regexes for url validations |
| [TrackSymbol](/api/variables/tracksymbol/) | - |
| [UnresolvedTrackSymbol](/api/variables/unresolvedtracksymbol/) | - |
| [validSponsorBlocks](/api/variables/validsponsorblocks/) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [parseLavalinkConnUrl](/api/functions/parselavalinkconnurl/) | Parses Node Connection Url: "lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>" |
| [queueTrackEnd](/api/functions/queuetrackend/) | - |
