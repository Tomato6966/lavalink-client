import type { AudioOutputs, ChannelMixFilter, EQBand } from "./Types/Filters";
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
    ReconnectAllNodes = "ReconnectAllNodes"
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
