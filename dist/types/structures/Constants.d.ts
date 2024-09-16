import type { AudioOutputs, ChannelMixFilter, EQBand } from "./Types/Filters";
export declare enum DebugEvents {
    SetSponsorBlock = "SetSponsorBlock",
    DeleteSponsorBlock = "DeleteSponsorBlock",
    TrackEndReplaced = "TrackEndReplaced",
    AutoplayExecution = "AutoplayExecution",
    AutoplayNoSongsAdded = "AutoplayNoSongsAdded",
    AutoplayThresholdSpamLimiter = "AutoplayThresholdSpamLimiter",
    TriggerQueueEmptyInterval = "TriggerQueueEmptyInterval",
    QueueEnded = "QueueEnded",
    TrackStartNewSongsOnly = "TrackStartNewSongsOnly",
    TrackStartNoTrack = "TrackStartNoTrack",
    ResumingFetchingError = "ResumingFetchingError",
    PlayerUpdateNoPlayer = "PlayerUpdateNoPlayer",
    PlayerUpdateFilterFixApply = "PlayerUpdateFilterFixApply",
    PlayerUpdateSuccess = "PlayerUpdateSuccess",
    HeartBeatTriggered = "HeartBeatTriggered",
    NoSocketOnDestroy = "NoSocketOnDestroy",
    SocketTerminateHeartBeatTimeout = "SocketTerminateHeartBeatTimeout",
    TryingConnectWhileConnected = "TryingConnectWhileConnected",
    LavaSearchNothingFound = "LavaSearchNothingFound",
    SearchNothingFound = "SearchNothingFound",
    ValidatingBlacklistLinks = "ValidatingBlacklistLinks",
    ValidatingWhitelistLinks = "ValidatingWhitelistLinks",
    TrackErrorMaxTracksErroredPerTime = "TrackErrorMaxTracksErroredPerTime",
    TrackStuckMaxTracksErroredPerTime = "TrackStuckMaxTracksErroredPerTime",
    PlayerDestroyingSomewhereElse = "PlayerDestroyingSomewhereElse",
    PlayerCreateNodeNotFound = "PlayerCreateNodeNotFound",
    PlayerPlayQueueEmptyTimeoutClear = "PlayerPlayQueueEmptyTimeoutClear",
    PlayerPlayWithTrackReplace = "PlayerPlayWithTrackReplace",
    PlayerPlayUnresolvedTrack = "PlayerPlayUnresolvedTrack",
    PlayerPlayUnresolvedTrackFailed = "PlayerPlayUnresolvedTrackFailed",
    PlayerVolumeAsFilter = "PlayerVolumeAsFilter",
    BandcampSearchLokalEngine = "BandcampSearchLokalEngine",
    PlayerChangeNode = "PlayerChangeNode",
    BuildTrackError = "BuildTrackError",
    TransformRequesterFunctionFailed = "TransformRequesterFunctionFailed",
    GetClosestTrackFailed = "GetClosestTrackFailed",
    PlayerDeleteInsteadOfDestroy = "PlayerDeleteInsteadOfDestroy",
    FailedToConnectToNodes = "FailedToConnectToNodes",
    NoAudioDebug = "NoAudioDebug",
    PlayerAutoReconnect = "PlayerAutoReconnect"
}
export declare enum DestroyReasons {
    QueueEmpty = "QueueEmpty",
    NodeDestroy = "NodeDestroy",
    NodeDeleted = "NodeDeleted",
    LavalinkNoVoice = "LavalinkNoVoice",
    NodeReconnectFail = "NodeReconnectFail",
    Disconnected = "Disconnected",
    PlayerReconnectFail = "PlayerReconnectFail",
    ChannelDeleted = "ChannelDeleted",
    DisconnectAllNodes = "DisconnectAllNodes",
    ReconnectAllNodes = "ReconnectAllNodes",
    TrackErrorMaxTracksErroredPerTime = "TrackErrorMaxTracksErroredPerTime",
    TrackStuckMaxTracksErroredPerTime = "TrackStuckMaxTracksErroredPerTime"
}
export declare const validSponsorBlocks: string[];
/**  The audio Outputs Data map declaration */
export declare const audioOutputsData: Record<AudioOutputs, ChannelMixFilter>;
export declare const EQList: {
    /** A Bassboost Equalizer, so high it distorts the audio */
    BassboostEarrape: EQBand[];
    /** A High and decent Bassboost Equalizer */
    BassboostHigh: EQBand[];
    /** A decent Bassboost Equalizer */
    BassboostMedium: EQBand[];
    /** A slight Bassboost Equalizer */
    BassboostLow: EQBand[];
    /** Makes the Music slightly "better" */
    BetterMusic: EQBand[];
    /** Makes the Music sound like rock music / sound rock music better */
    Rock: EQBand[];
    /** Makes the Music sound like Classic music / sound Classic music better */
    Classic: EQBand[];
    /** Makes the Music sound like Pop music / sound Pop music better */
    Pop: EQBand[];
    /** Makes the Music sound like Electronic music / sound Electronic music better */
    Electronic: EQBand[];
    /** Boosts all Bands slightly for louder and fuller sound */
    FullSound: EQBand[];
    /** Boosts basses + lower highs for a pro gaming sound */
    Gaming: EQBand[];
};
