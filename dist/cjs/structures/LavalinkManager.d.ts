/// <reference types="node" />
import { EventEmitter } from "events";
import { LavalinkNodeOptions } from "./Node";
import { NodeManager } from "./NodeManager";
import { DestroyReasonsType, Player, PlayerJson, PlayerOptions } from "./Player";
import { ManagerQueueOptions } from "./Queue";
import { Track, UnresolvedTrack } from "./Track";
import { ChannelDeletePacket, GuildShardPayload, ManagerUtils, MiniMap, SearchPlatform, SponsorBlockChaptersLoaded, SponsorBlockChapterStarted, SponsorBlockSegmentSkipped, SponsorBlockSegmentsLoaded, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, VoicePacket, VoiceServer, VoiceState, WebSocketClosedEvent } from "./Utils";
export interface LavalinkManager {
    nodeManager: NodeManager;
    utils: ManagerUtils;
}
export interface BotClientOptions {
    /** Bot Client Id */
    id: string;
    /** Bot Client Username */
    username?: string;
    /** So users can pass entire objects / classes */
    [x: string | number | symbol]: unknown;
}
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
        /** Instantly destroy player (overrides autoReconnect) | Don't provide == disable feature*/
        destroyPlayer?: boolean;
    };
    onEmptyQueue?: {
        /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
        autoPlayFunction?: (player: Player, lastPlayedTrack: Track) => Promise<void>;
        destroyAfterMs?: number;
    };
    useUnresolvedData?: boolean;
}
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
        /** optional */
        debugOptions?: {
            /** logs for debugging the "no-Audio" playing error */
            noAudio?: boolean;
            /** For Logging the Destroy function */
            playerDestroy?: {
                /** To show the debug reason at all times. */
                debugLog?: boolean;
                /** If you get 'Error: Use Player#destroy("reason") not LavalinkManager#deletePlayer() to stop the Player' put it on true */
                dontThrowError?: boolean;
            };
        };
    };
}
interface LavalinkManagerEvents {
    /**
     * Emitted when a Track started playing.
     * @event Manager#trackStart
     */
    "trackStart": (player: Player, track: Track, payload: TrackStartEvent) => void;
    /**
     * Emitted when a Track finished.
     * @event Manager#trackEnd
     */
    "trackEnd": (player: Player, track: Track, payload: TrackEndEvent) => void;
    /**
     * Emitted when a Track got stuck while playing.
     * @event Manager#trackStuck
     */
    "trackStuck": (player: Player, track: Track, payload: TrackStuckEvent) => void;
    /**
     * Emitted when a Track errored.
     * @event Manager#trackError
     */
    "trackError": (player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent) => void;
    /**
     * Emitted when the Playing finished and no more tracks in the queue.
     * @event Manager#queueEnd
     */
    "queueEnd": (player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
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
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when Segments are loaded
     * @link https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
     * @event Manager#trackError
     */
    "SegmentsLoaded": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentsLoaded) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when a specific Segment was skipped
     * @link https://github.com/topi314/Sponsorblock-Plugin#segmentskipped
     * @event Manager#trackError
     */
    "SegmentSkipped": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentSkipped) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when a specific Chapter starts playing
     * @link https://github.com/topi314/Sponsorblock-Plugin#chapterstarted
     * @event Manager#trackError
     */
    "ChapterStarted": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChapterStarted) => void;
    /**
     * SPONSORBLOCK-PLUGIN EVENT
     * Emitted when Chapters are loaded
     * @link https://github.com/topi314/Sponsorblock-Plugin#chaptersloaded
     * @event Manager#trackError
     */
    "ChaptersLoaded": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChaptersLoaded) => void;
}
export interface LavalinkManager {
    options: ManagerOptions;
    on<U extends keyof LavalinkManagerEvents>(event: U, listener: LavalinkManagerEvents[U]): this;
    emit<U extends keyof LavalinkManagerEvents>(event: U, ...args: Parameters<LavalinkManagerEvents[U]>): boolean;
}
export declare class LavalinkManager extends EventEmitter {
    static DefaultSources: Record<SearchPlatform, import("./Utils").LavalinkSearchPlatform | import("./Utils").ClientCustomSearchPlatformUtils>;
    static SourceLinksRegexes: Record<import("./Utils").SourcesRegex, RegExp>;
    initiated: boolean;
    readonly players: MiniMap<string, Player>;
    private applyOptions;
    private validateOptions;
    constructor(options: ManagerOptions);
    createPlayer(options: PlayerOptions): Player;
    getPlayer(guildId: string): Player;
    destroyPlayer(guildId: string, destroyReason?: string): Promise<Player>;
    deletePlayer(guildId: string): boolean;
    get useable(): boolean;
    /**
     * Initiates the Manager.
     * @param clientData
     */
    init(clientData: BotClientOptions): Promise<this>;
    /**
     * Sends voice data to the Lavalink server.
     * @param data
     */
    sendRawData(data: VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket): Promise<void>;
}
export {};
