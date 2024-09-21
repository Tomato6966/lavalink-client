export var DebugEvents;
(function (DebugEvents) {
    DebugEvents["SetSponsorBlock"] = "SetSponsorBlock";
    DebugEvents["DeleteSponsorBlock"] = "DeleteSponsorBlock";
    DebugEvents["TrackEndReplaced"] = "TrackEndReplaced";
    DebugEvents["AutoplayExecution"] = "AutoplayExecution";
    DebugEvents["AutoplayNoSongsAdded"] = "AutoplayNoSongsAdded";
    DebugEvents["AutoplayThresholdSpamLimiter"] = "AutoplayThresholdSpamLimiter";
    DebugEvents["TriggerQueueEmptyInterval"] = "TriggerQueueEmptyInterval";
    DebugEvents["QueueEnded"] = "QueueEnded";
    DebugEvents["TrackStartNewSongsOnly"] = "TrackStartNewSongsOnly";
    DebugEvents["TrackStartNoTrack"] = "TrackStartNoTrack";
    DebugEvents["ResumingFetchingError"] = "ResumingFetchingError";
    DebugEvents["PlayerUpdateNoPlayer"] = "PlayerUpdateNoPlayer";
    DebugEvents["PlayerUpdateFilterFixApply"] = "PlayerUpdateFilterFixApply";
    DebugEvents["PlayerUpdateSuccess"] = "PlayerUpdateSuccess";
    DebugEvents["HeartBeatTriggered"] = "HeartBeatTriggered";
    DebugEvents["NoSocketOnDestroy"] = "NoSocketOnDestroy";
    DebugEvents["SocketTerminateHeartBeatTimeout"] = "SocketTerminateHeartBeatTimeout";
    DebugEvents["TryingConnectWhileConnected"] = "TryingConnectWhileConnected";
    DebugEvents["LavaSearchNothingFound"] = "LavaSearchNothingFound";
    DebugEvents["SearchNothingFound"] = "SearchNothingFound";
    DebugEvents["ValidatingBlacklistLinks"] = "ValidatingBlacklistLinks";
    DebugEvents["ValidatingWhitelistLinks"] = "ValidatingWhitelistLinks";
    DebugEvents["TrackErrorMaxTracksErroredPerTime"] = "TrackErrorMaxTracksErroredPerTime";
    DebugEvents["TrackStuckMaxTracksErroredPerTime"] = "TrackStuckMaxTracksErroredPerTime";
    DebugEvents["PlayerDestroyingSomewhereElse"] = "PlayerDestroyingSomewhereElse";
    DebugEvents["PlayerCreateNodeNotFound"] = "PlayerCreateNodeNotFound";
    DebugEvents["PlayerPlayQueueEmptyTimeoutClear"] = "PlayerPlayQueueEmptyTimeoutClear";
    DebugEvents["PlayerPlayWithTrackReplace"] = "PlayerPlayWithTrackReplace";
    DebugEvents["PlayerPlayUnresolvedTrack"] = "PlayerPlayUnresolvedTrack";
    DebugEvents["PlayerPlayUnresolvedTrackFailed"] = "PlayerPlayUnresolvedTrackFailed";
    DebugEvents["PlayerVolumeAsFilter"] = "PlayerVolumeAsFilter";
    DebugEvents["BandcampSearchLokalEngine"] = "BandcampSearchLokalEngine";
    DebugEvents["PlayerChangeNode"] = "PlayerChangeNode";
    DebugEvents["BuildTrackError"] = "BuildTrackError";
    DebugEvents["TransformRequesterFunctionFailed"] = "TransformRequesterFunctionFailed";
    DebugEvents["GetClosestTrackFailed"] = "GetClosestTrackFailed";
    DebugEvents["PlayerDeleteInsteadOfDestroy"] = "PlayerDeleteInsteadOfDestroy";
    DebugEvents["FailedToConnectToNodes"] = "FailedToConnectToNodes";
    DebugEvents["NoAudioDebug"] = "NoAudioDebug";
    DebugEvents["PlayerAutoReconnect"] = "PlayerAutoReconnect";
})(DebugEvents || (DebugEvents = {}));
export var DestroyReasons;
(function (DestroyReasons) {
    DestroyReasons["QueueEmpty"] = "QueueEmpty";
    DestroyReasons["NodeDestroy"] = "NodeDestroy";
    DestroyReasons["NodeDeleted"] = "NodeDeleted";
    DestroyReasons["LavalinkNoVoice"] = "LavalinkNoVoice";
    DestroyReasons["NodeReconnectFail"] = "NodeReconnectFail";
    DestroyReasons["Disconnected"] = "Disconnected";
    DestroyReasons["PlayerReconnectFail"] = "PlayerReconnectFail";
    DestroyReasons["ChannelDeleted"] = "ChannelDeleted";
    DestroyReasons["DisconnectAllNodes"] = "DisconnectAllNodes";
    DestroyReasons["ReconnectAllNodes"] = "ReconnectAllNodes";
    DestroyReasons["TrackErrorMaxTracksErroredPerTime"] = "TrackErrorMaxTracksErroredPerTime";
    DestroyReasons["TrackStuckMaxTracksErroredPerTime"] = "TrackStuckMaxTracksErroredPerTime";
})(DestroyReasons || (DestroyReasons = {}));
;
export const validSponsorBlocks = ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "filler"];
/**  The audio Outputs Data map declaration */
export const audioOutputsData = {
    mono: {
        leftToLeft: 0.5,
        leftToRight: 0.5,
        rightToLeft: 0.5,
        rightToRight: 0.5,
    },
    stereo: {
        leftToLeft: 1,
        leftToRight: 0,
        rightToLeft: 0,
        rightToRight: 1,
    },
    left: {
        leftToLeft: 1,
        leftToRight: 0,
        rightToLeft: 1,
        rightToRight: 0,
    },
    right: {
        leftToLeft: 0,
        leftToRight: 1,
        rightToLeft: 0,
        rightToRight: 1,
    },
};
export const EQList = {
    /** A Bassboost Equalizer, so high it distorts the audio */
    BassboostEarrape: [
        { band: 0, gain: 0.6 * 0.375 },
        { band: 1, gain: 0.67 * 0.375 },
        { band: 2, gain: 0.67 * 0.375 },
        { band: 3, gain: 0.4 * 0.375 },
        { band: 4, gain: -0.5 * 0.375 },
        { band: 5, gain: 0.15 * 0.375 },
        { band: 6, gain: -0.45 * 0.375 },
        { band: 7, gain: 0.23 * 0.375 },
        { band: 8, gain: 0.35 * 0.375 },
        { band: 9, gain: 0.45 * 0.375 },
        { band: 10, gain: 0.55 * 0.375 },
        { band: 11, gain: -0.6 * 0.375 },
        { band: 12, gain: 0.55 * 0.375 },
        { band: 13, gain: -0.5 * 0.375 },
        { band: 14, gain: -0.75 * 0.375 },
    ],
    /** A High and decent Bassboost Equalizer */
    BassboostHigh: [
        { band: 0, gain: 0.6 * 0.25 },
        { band: 1, gain: 0.67 * 0.25 },
        { band: 2, gain: 0.67 * 0.25 },
        { band: 3, gain: 0.4 * 0.25 },
        { band: 4, gain: -0.5 * 0.25 },
        { band: 5, gain: 0.15 * 0.25 },
        { band: 6, gain: -0.45 * 0.25 },
        { band: 7, gain: 0.23 * 0.25 },
        { band: 8, gain: 0.35 * 0.25 },
        { band: 9, gain: 0.45 * 0.25 },
        { band: 10, gain: 0.55 * 0.25 },
        { band: 11, gain: -0.6 * 0.25 },
        { band: 12, gain: 0.55 * 0.25 },
        { band: 13, gain: -0.5 * 0.25 },
        { band: 14, gain: -0.75 * 0.25 },
    ],
    /** A decent Bassboost Equalizer */
    BassboostMedium: [
        { band: 0, gain: 0.6 * 0.1875 },
        { band: 1, gain: 0.67 * 0.1875 },
        { band: 2, gain: 0.67 * 0.1875 },
        { band: 3, gain: 0.4 * 0.1875 },
        { band: 4, gain: -0.5 * 0.1875 },
        { band: 5, gain: 0.15 * 0.1875 },
        { band: 6, gain: -0.45 * 0.1875 },
        { band: 7, gain: 0.23 * 0.1875 },
        { band: 8, gain: 0.35 * 0.1875 },
        { band: 9, gain: 0.45 * 0.1875 },
        { band: 10, gain: 0.55 * 0.1875 },
        { band: 11, gain: -0.6 * 0.1875 },
        { band: 12, gain: 0.55 * 0.1875 },
        { band: 13, gain: -0.5 * 0.1875 },
        { band: 14, gain: -0.75 * 0.1875 },
    ],
    /** A slight Bassboost Equalizer */
    BassboostLow: [
        { band: 0, gain: 0.6 * 0.125 },
        { band: 1, gain: 0.67 * 0.125 },
        { band: 2, gain: 0.67 * 0.125 },
        { band: 3, gain: 0.4 * 0.125 },
        { band: 4, gain: -0.5 * 0.125 },
        { band: 5, gain: 0.15 * 0.125 },
        { band: 6, gain: -0.45 * 0.125 },
        { band: 7, gain: 0.23 * 0.125 },
        { band: 8, gain: 0.35 * 0.125 },
        { band: 9, gain: 0.45 * 0.125 },
        { band: 10, gain: 0.55 * 0.125 },
        { band: 11, gain: -0.6 * 0.125 },
        { band: 12, gain: 0.55 * 0.125 },
        { band: 13, gain: -0.5 * 0.125 },
        { band: 14, gain: -0.75 * 0.125 },
    ],
    /** Makes the Music slightly "better" */
    BetterMusic: [
        { band: 0, gain: 0.25 },
        { band: 1, gain: 0.025 },
        { band: 2, gain: 0.0125 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: -0.0125 },
        { band: 6, gain: -0.025 },
        { band: 7, gain: -0.0175 },
        { band: 8, gain: 0 },
        { band: 9, gain: 0 },
        { band: 10, gain: 0.0125 },
        { band: 11, gain: 0.025 },
        { band: 12, gain: 0.25 },
        { band: 13, gain: 0.125 },
        { band: 14, gain: 0.125 },
    ],
    /** Makes the Music sound like rock music / sound rock music better */
    Rock: [
        { band: 0, gain: 0.300 },
        { band: 1, gain: 0.250 },
        { band: 2, gain: 0.200 },
        { band: 3, gain: 0.100 },
        { band: 4, gain: 0.050 },
        { band: 5, gain: -0.050 },
        { band: 6, gain: -0.150 },
        { band: 7, gain: -0.200 },
        { band: 8, gain: -0.100 },
        { band: 9, gain: -0.050 },
        { band: 10, gain: 0.050 },
        { band: 11, gain: 0.100 },
        { band: 12, gain: 0.200 },
        { band: 13, gain: 0.250 },
        { band: 14, gain: 0.300 },
    ],
    /** Makes the Music sound like Classic music / sound Classic music better */
    Classic: [
        { band: 0, gain: 0.375 },
        { band: 1, gain: 0.350 },
        { band: 2, gain: 0.125 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: 0.125 },
        { band: 6, gain: 0.550 },
        { band: 7, gain: 0.050 },
        { band: 8, gain: 0.125 },
        { band: 9, gain: 0.250 },
        { band: 10, gain: 0.200 },
        { band: 11, gain: 0.250 },
        { band: 12, gain: 0.300 },
        { band: 13, gain: 0.250 },
        { band: 14, gain: 0.300 },
    ],
    /** Makes the Music sound like Pop music / sound Pop music better */
    Pop: [
        { band: 0, gain: 0.2635 },
        { band: 1, gain: 0.22141 },
        { band: 2, gain: -0.21141 },
        { band: 3, gain: -0.1851 },
        { band: 4, gain: -0.155 },
        { band: 5, gain: 0.21141 },
        { band: 6, gain: 0.22456 },
        { band: 7, gain: 0.237 },
        { band: 8, gain: 0.237 },
        { band: 9, gain: 0.237 },
        { band: 10, gain: -0.05 },
        { band: 11, gain: -0.116 },
        { band: 12, gain: 0.192 },
        { band: 13, gain: 0 },
    ],
    /** Makes the Music sound like Electronic music / sound Electronic music better */
    Electronic: [
        { band: 0, gain: 0.375 },
        { band: 1, gain: 0.350 },
        { band: 2, gain: 0.125 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: -0.125 },
        { band: 6, gain: -0.125 },
        { band: 7, gain: 0 },
        { band: 8, gain: 0.25 },
        { band: 9, gain: 0.125 },
        { band: 10, gain: 0.15 },
        { band: 11, gain: 0.2 },
        { band: 12, gain: 0.250 },
        { band: 13, gain: 0.350 },
        { band: 14, gain: 0.400 },
    ],
    /** Boosts all Bands slightly for louder and fuller sound */
    FullSound: [
        { band: 0, gain: 0.25 + 0.375 },
        { band: 1, gain: 0.25 + 0.025 },
        { band: 2, gain: 0.25 + 0.0125 },
        { band: 3, gain: 0.25 + 0 },
        { band: 4, gain: 0.25 + 0 },
        { band: 5, gain: 0.25 + -0.0125 },
        { band: 6, gain: 0.25 + -0.025 },
        { band: 7, gain: 0.25 + -0.0175 },
        { band: 8, gain: 0.25 + 0 },
        { band: 9, gain: 0.25 + 0 },
        { band: 10, gain: 0.25 + 0.0125 },
        { band: 11, gain: 0.25 + 0.025 },
        { band: 12, gain: 0.25 + 0.375 },
        { band: 13, gain: 0.25 + 0.125 },
        { band: 14, gain: 0.25 + 0.125 },
    ],
    /** Boosts basses + lower highs for a pro gaming sound */
    Gaming: [
        { band: 0, gain: 0.350 },
        { band: 1, gain: 0.300 },
        { band: 2, gain: 0.250 },
        { band: 3, gain: 0.200 },
        { band: 4, gain: 0.150 },
        { band: 5, gain: 0.100 },
        { band: 6, gain: 0.050 },
        { band: 7, gain: -0.0 },
        { band: 8, gain: -0.050 },
        { band: 9, gain: -0.100 },
        { band: 10, gain: -0.150 },
        { band: 11, gain: -0.200 },
        { band: 12, gain: -0.250 },
        { band: 13, gain: -0.300 },
        { band: 14, gain: -0.350 },
    ],
};
