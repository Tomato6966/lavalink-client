import type { DebugEvents } from "../Constants";

import type { Player } from "../Player";
import type { LavalinkNodeOptions } from "./Node";
import type { DestroyReasonsType, PlayerJson } from "./Player";
import type { ManagerQueueOptions } from "./Queue";
import type { Track, UnresolvedTrack } from "./Track";
import type { GuildShardPayload, SearchPlatform, SponsorBlockChaptersLoaded, SponsorBlockChapterStarted, SponsorBlockSegmentSkipped, SponsorBlockSegmentsLoaded, TrackExceptionEvent, TrackEndEvent, TrackStuckEvent, WebSocketClosedEvent, TrackStartEvent, LyricsFoundEvent, LyricsNotFoundEvent, LyricsLineEvent } from "./Utils";

/**
 * The events from the lavalink Manager
 */
export interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager#trackStart
     */
    "trackStart": (player: Player, track: Track | null, payload: TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager#trackEnd
     */
    "trackEnd": (player: Player, track: Track | null, payload: TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager#trackStuck
     */
    "trackStuck": (player: Player, track: Track | null, payload: TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager#trackError
     */
    "trackError": (player: Player, track: Track | UnresolvedTrack | null, payload: TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager#queueEnd
     */
    "queueEnd": (player: Player, track: Track | UnresolvedTrack | null, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
    /**
     * Emitted when a Player is created.
     * @event Manager#playerCreate
     */
    "playerCreate": (player: Player) => void;
    /**
     * Emitted when a Player is moved within the channel.
     * @event Manager#playerMove
     */
    "playerMove": (player: Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
    /**
     * Emitted when a Player is disconnected from a channel.
     * @event Manager#playerDisconnect
     */
    "playerDisconnect": (player: Player, voiceChannelId: string) => void;
    /**
     * Emitted when a Node-Socket got closed for a specific Player.
     * Usually emits when the audio websocket to discord is closed, This can happen for various reasons (normal and abnormal), e.g. when using an expired voice server update. 4xxx codes are usually bad.
     *
     * So this is just information, normally lavalink should handle disconnections
     *
     * Discord Docs:
     * @link https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-close-event-codes
     *
     * Lavalink Docs:
     * @link https://lavalink.dev/api/websocket.html#websocketclosedevent
     * @event Manager#playerSocketClosed
     */
    "playerSocketClosed": (player: Player, payload: WebSocketClosedEvent) => void;
    /**
     * Emitted when a Player get's destroyed
     * @event Manager#playerDestroy
     */
    "playerDestroy": (player: Player, destroyReason?: DestroyReasonsType) => void;

    /**
     * Always emits when the player (on lavalink side) got updated
     * @event Manager#playerUpdate
     */
    "playerUpdate": (oldPlayerJson: PlayerJson, newPlayer: Player) => void;

    /**
     * Emitted when the player's selfMuted or serverMuted state changed (true -> false | false -> true)
     * @event Manager#playerMuteChange
     */
    "playerMuteChange": (player: Player, selfMuted: boolean, serverMuted: boolean) => void;

    /**
     * Emitted when the player's selfDeafed or serverDeafed state changed (true -> false | false -> true)
     * @event Manager#playerDeafChange
     */
    "playerDeafChange": (player: Player, selfDeafed: boolean, serverDeafed: boolean) => void;

    /**
     * Emitted when the player's suppressed (true -> false | false -> true)
     * @event Manager#playerSuppressChange
     */
    "playerSuppressChange": (player: Player, suppress: boolean) => void;

    /**
     * Emitted when the player's queue got empty, and the timeout started
     * @event Manager#playerQueueEmptyStart
     */
    "playerQueueEmptyStart": (player: Player, timeoutMs: number) => void;

    /**
     * Emitted when the player's queue got empty, and the timeout finished leading to destroying the player
     * @event Manager#playerQueueEmptyEnd
     */
    "playerQueueEmptyEnd": (player: Player) => void;

    /**
     * Emitted when the player's queue got empty, and the timeout got cancelled becuase a track got re-added to it.
     * @event Manager#playerQueueEmptyEnd
     */
    "playerQueueEmptyCancel": (player: Player) => void;

    /**
     * Emitted, when a user joins the voice channel, while there is a player existing
     * @event Manager#playerQueueEmptyStart
     */
    "playerVoiceJoin": (player: Player, userId: string) => void;

    /**
     * Emitted, when a user leaves the voice channel, while there is a player existing
     * @event Manager#playerQueueEmptyEnd
     */
    "playerVoiceLeave": (player: Player, userId: string) => void;

    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when Segments are loaded
     * @link https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
     * @event Manager#trackError
     */
    "SegmentsLoaded": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockSegmentsLoaded) => void;

    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when a specific Segment was skipped
     * @link https://github.com/topi314/Sponsorblock-Plugin#segmentskipped
     * @event Manager#trackError
     */
    "SegmentSkipped": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockSegmentSkipped) => void;

    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when a specific Chapter starts playing
     * @link https://github.com/topi314/Sponsorblock-Plugin#chapterstarted
     * @event Manager#trackError
     */
    "ChapterStarted": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockChapterStarted) => void;

    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when Chapters are loaded
     * @link https://github.com/topi314/Sponsorblock-Plugin#chaptersloaded
     * @event Manager#trackError
     */
    "ChaptersLoaded": (player: Player, track: Track | UnresolvedTrack | null, payload: SponsorBlockChaptersLoaded) => void;

    /**
     * Lavalink-Client Debug Event
     * Emitted for several erros, and logs within lavalink-client, if managerOptions.advancedOptions.enableDebugEvents is true
     * Useful for debugging the lavalink-client
     *
     * @event Manager#debug
     */
    "debug": (eventKey: DebugEvents, eventData: { message: string, state: "log" | "warn" | "error", error?: Error | string, functionLayer: string }) => void;

    /**
     * Emitted when a Lyrics line is received
     * @link https://github.com/topi314/LavaLyrics
     * @event Manager#LyricsLine
     */
    "LyricsLine": (player: Player, track: Track | UnresolvedTrack | null, payload: LyricsLineEvent) => void;

    /**
     * Emitted when a Lyrics is found
     * @link https://github.com/topi314/LavaLyrics
     * @event Manager#LyricsFound
     */
    "LyricsFound": (player: Player, track: Track | UnresolvedTrack | null, payload: LyricsFoundEvent) => void;

    /**
     * Emitted when a Lyrics is not found
     * @link https://github.com/topi314/LavaLyrics
     * @event Manager#LyricsNotFound
     */
    "LyricsNotFound": (player: Player, track: Track | UnresolvedTrack | null, payload: LyricsNotFoundEvent) => void;

    "playerResumed": (player: Player, track: Track | UnresolvedTrack | null) => void;

    "playerPaused": (player: Player, track: Track | UnresolvedTrack | null) => void;
}
/**
 * The Bot client Options needed for the manager
 */
export interface BotClientOptions {
    /** Bot Client Id */
    id: string;
    /** Bot Client Username */
    username?: string;
    /** So users can pass entire objects / classes */
    [x: string | number | symbol]: unknown;
}

/** Sub Manager Options, for player specific things */
export interface ManagerPlayerOptions {
    /** If the Lavalink Volume should be decremented by x number */
    volumeDecrementer?: number;
    /** How often it should update the the player Position */
    clientBasedPositionUpdateInterval?: number;
    /** What should be used as a searchPlatform, if no source was provided during the query */
    defaultSearchPlatform?: SearchPlatform;
    /** Applies the volume via a filter, not via the lavalink volume transformer */
    applyVolumeAsFilter?: boolean;
    /** Transforms the saved data of a requested user */
    requesterTransformer?: (requester: unknown) => unknown;
    /** What lavalink-client should do when the player reconnects */
    onDisconnect?: {
        /** Try to reconnect? -> If fails -> Destroy */
        autoReconnect?: boolean;
        /** Only try to reconnect if there are tracks in the queue */
        autoReconnectOnlyWithTracks?: boolean;
        /** Instantly destroy player (overrides autoReconnect) | Don't provide == disable feature*/
        destroyPlayer?: boolean;
    };
    /** Minimum time to play the song before autoPlayFunction is executed (prevents error spamming) Set to 0 to disable it @default 10000 */
    minAutoPlayMs?: number;
    /** Allows you to declare how many tracks are allowed to error/stuck within a time-frame before player is destroyed @default "{threshold: 35000, maxAmount: 3 }" */
    maxErrorsPerTime?: {
        /** The threshold time to count errors (recommended is 35s) */
        threshold: number;
        /** The max amount of errors within the threshold time which are allowed before destroying the player (when errors > maxAmount -> player.destroy()) */
        maxAmount: number;
    };
    /* What the Player should do, when the queue gets empty */
    onEmptyQueue?: {
        /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
        autoPlayFunction?: (player: Player, lastPlayedTrack: Track) => Promise<void>;
        /* aut. destroy the player after x ms, if 1 it instantly destroys, don't provide or set to 0 to not destroy the player */
        destroyAfterMs?: number;
    };
    /* If to override the data from the Unresolved Track. for unresolved tracks */
    useUnresolvedData?: boolean;
}

/** Manager Options used to create the manager */
export interface ManagerOptions {
    /** The Node Options, for all Nodes! (on init) */
    nodes: LavalinkNodeOptions[];
    /** @async The Function to send the voice connection changes from Lavalink to Discord */
    sendToShard: (guildId: string, payload: GuildShardPayload) => void;
    /** The Bot Client's Data for Authorization */
    client?: BotClientOptions;
    /** QueueOptions for all Queues */
    queueOptions?: ManagerQueueOptions;
    /** PlayerOptions for all Players */
    playerOptions?: ManagerPlayerOptions;
    /** If it should skip to the next Track on TrackEnd / TrackError etc. events */
    autoSkip?: boolean;
    /** If it should skip to the next Track if track.resolve errors while trying to play a track. */
    autoSkipOnResolveError?: boolean;
    /** If it should emit only new (unique) songs and not when a looping track (or similar) is plaid, default false */
    emitNewSongsOnly?: boolean;
    /** Only allow link requests with links either matching some of that regExp or including some of that string */
    linksWhitelist?: (RegExp | string)[];
    /** Never allow link requests with links either matching some of that regExp or including some of that string (doesn't even allow if it's whitelisted) */
    linksBlacklist?: (RegExp | string)[];
    /** If links should be allowed or not. If set to false, it will throw an error if a link was provided. */
    linksAllowed?: boolean;
    /** Advanced Options for the Library, which may or may not be "library breaking" */
    advancedOptions?: {
        /** Max duration for that the filter fix duration works (in ms) - default is 8mins */
        maxFilterFixDuration?: number,
        /** Enable Debug event */
        enableDebugEvents?: boolean;
        /** optional */
        debugOptions?: {
            /** For logging custom searches */
            logCustomSearches?: boolean;
            /** logs for debugging the "no-Audio" playing error */
            noAudio?: boolean;
            /** For Logging the Destroy function */
            playerDestroy?: {
                /** To show the debug reason at all times. */
                debugLog?: boolean;
                /** If you get 'Error: Use Player#destroy("reason") not LavalinkManager#deletePlayer() to stop the Player' put it on true */
                dontThrowError?: boolean;
            }
        }
    }
}
