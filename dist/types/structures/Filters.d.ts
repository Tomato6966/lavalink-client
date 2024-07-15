import { Player } from "./Player";
import { FloatNumber, IntegerNumber } from "./Utils";
/**
 * The FilterManager for each player
 */
export declare class FilterManager {
    /** The Equalizer bands currently applied to the Lavalink Server */
    equalizerBands: EQBand[];
    /** Private Util for the instaFix Filters option */
    filterUpdatedState: boolean;
    /** All "Active" / "disabled" Player Filters */
    filters: PlayerFilters;
    /** The Filter Data sent to Lavalink, only if the filter is enabled (ofc.) */
    data: FilterData;
    /** The Player assigned to this Filter Manager */
    player: Player;
    /** The Constructor for the FilterManager */
    constructor(player: Player);
    /**
     * Apply Player filters for lavalink filter sending data, if the filter is enabled / not
     */
    applyPlayerFilters(): Promise<void>;
    /**
     * Checks if the filters are correctly stated (active / not-active)
     * @param oldFilterTimescale
     * @returns
     */
    checkFiltersState(oldFilterTimescale?: Partial<TimescaleFilter>): boolean;
    /**
     * Reset all Filters
     */
    resetFilters(): Promise<PlayerFilters>;
    /**
     * Set the Filter Volume
     * @param volume
     * @returns
     */
    setVolume(volume: number): Promise<boolean>;
    /**
     * Set the AudioOutput Filter
     * @param type
     * @returns
     */
    setAudioOutput(type: AudioOutputs): Promise<AudioOutputs>;
    /**
     * Set custom filter.timescale#speed . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param speed
     * @returns
     */
    setSpeed(speed?: number): Promise<boolean>;
    /**
     * Set custom filter.timescale#pitch . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param speed
     * @returns
     */
    setPitch(pitch?: number): Promise<boolean>;
    /**
     * Set custom filter.timescale#rate . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param speed
     * @returns
     */
    setRate(rate?: number): Promise<boolean>;
    /**
     * Enables / Disables the rotation effect, (Optional: provide your Own Data)
     * @param rotationHz
     * @returns
     */
    toggleRotation(rotationHz?: number): Promise<boolean>;
    /**
     * Enables / Disables the Vibrato effect, (Optional: provide your Own Data)
     * @param frequency
     * @param depth
     * @returns
     */
    toggleVibrato(frequency?: number, depth?: number): Promise<boolean>;
    /**
     * Enables / Disables the Tremolo effect, (Optional: provide your Own Data)
     * @param frequency
     * @param depth
     * @returns
     */
    toggleTremolo(frequency?: number, depth?: number): Promise<boolean>;
    /**
     * Enables / Disables the LowPass effect, (Optional: provide your Own Data)
     * @param smoothing
     * @returns
     */
    toggleLowPass(smoothing?: number): Promise<boolean>;
    lavalinkLavaDspxPlugin: {
        toggleLowPass: (boostFactor?: number, cutoffFrequency?: number) => Promise<boolean>;
        toggleHighPass: (boostFactor?: number, cutoffFrequency?: number) => Promise<boolean>;
        toggleNormalization: (maxAmplitude?: number, adaptive?: boolean) => Promise<boolean>;
        toggleEcho: (decay?: number, echoLength?: number) => Promise<boolean>;
    };
    lavalinkFilterPlugin: {
        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param delay
         * @param decay
         * @returns
         */
        toggleEcho: (delay?: number, decay?: number) => Promise<boolean>;
        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param delays
         * @param gains
         * @returns
         */
        toggleReverb: (delays?: number[], gains?: number[]) => Promise<boolean>;
    };
    /**
     * Enables / Disables a Nightcore-like filter Effect. Disables/Overrides both: custom and Vaporwave Filter
     * @param speed
     * @param pitch
     * @param rate
     * @returns
     */
    toggleNightcore(speed?: number, pitch?: number, rate?: number): Promise<boolean>;
    /**
     * Enables / Disables a Vaporwave-like filter Effect. Disables/Overrides both: custom and nightcore Filter
     * @param speed
     * @param pitch
     * @param rate
     * @returns
     */
    toggleVaporwave(speed?: number, pitch?: number, rate?: number): Promise<boolean>;
    /**
     * Enable / Disables a Karaoke like Filter Effect
     * @param level
     * @param monoLevel
     * @param filterBand
     * @param filterWidth
     * @returns
     */
    toggleKaraoke(level?: number, monoLevel?: number, filterBand?: number, filterWidth?: number): Promise<boolean>;
    /** Function to find out if currently there is a custom timescamle etc. filter applied */
    isCustomFilterActive(): boolean;
    /**
   * Sets the players equalizer band on-top of the existing ones.
   * @param bands
   */
    setEQ(bands: EQBand | EQBand[]): Promise<this>;
    /** Clears the equalizer bands. */
    clearEQ(): Promise<this>;
}
/** The Audio Outputs type */
export type AudioOutputs = "mono" | "stereo" | "left" | "right";
/**  The audio Outputs Data map declaration */
export declare const audioOutputsData: Record<AudioOutputs, ChannelMixFilter>;
/** The "active" / "disabled" Player Filters */
export interface PlayerFilters {
    /** Sets nightcore to false, and vaporwave to false */
    custom: boolean;
    /** Sets custom to false, and vaporwave to false */
    nightcore: boolean;
    /** Sets custom to false, and nightcore to false */
    vaporwave: boolean;
    /** If rotation filter is enabled / not */
    rotation: boolean;
    /** if karaoke filter is enabled / not */
    karaoke: boolean;
    /** if tremolo filter is enabled / not */
    tremolo: boolean;
    /** if vibrato filter is enabled / not */
    vibrato: boolean;
    lowPass: boolean;
    /** audio Output (default stereo, mono sounds the fullest and best for not-stereo tracks) */
    audioOutput: AudioOutputs;
    /** Lavalink Volume FILTER (not player Volume, think of it as a gain booster) */
    volume: boolean;
    /** Filters for the Lavalink Filter Plugin */
    lavalinkFilterPlugin: {
        /** if echo filter is enabled / not */
        echo: boolean;
        /** if reverb filter is enabled / not */
        reverb: boolean;
    };
    lavalinkLavaDspxPlugin: {
        /** if lowPass filter is enabled / not */
        lowPass: boolean;
        /** if highPass filter is enabled / not */
        highPass: boolean;
        /** if normalization filter is enabled / not */
        normalization: boolean;
        /** if echo filter is enabled / not */
        echo: boolean;
    };
}
/**
 * There are 15 bands (0-14) that can be changed.
 * "gain" is the multiplier for the given band.
 * The default value is 0.
 *  Valid values range from -0.25 to 1.0, where -0.25 means the given band is completely muted, and 0.25 means it is doubled.
 * Modifying the gain could also change the volume of the output.
 */
export interface EQBand {
    /** On what band position (0-14) it should work */
    band: IntegerNumber | number;
    /** The gain (-0.25 to 1.0) */
    gain: FloatNumber | number;
}
/**
 * Uses equalization to eliminate part of a band, usually targeting vocals.
 */
export interface KaraokeFilter {
    /** The level (0 to 1.0 where 0.0 is no effect and 1.0 is full effect) */
    level?: number;
    /** The mono level (0 to 1.0 where 0.0 is no effect and 1.0 is full effect) */
    monoLevel?: number;
    /** The filter band (in Hz) */
    filterBand?: number;
    /**	The filter width */
    filterWidth?: number;
}
/**
 * Changes the speed, pitch, and rate
 */
export interface TimescaleFilter {
    /** The playback speed 0.0 ≤ x */
    speed?: number;
    /** The pitch 0.0 ≤ x */
    pitch?: number;
    /** The rate 0.0 ≤ x */
    rate?: number;
}
/**
 * Uses amplification to create a shuddering effect, where the volume quickly oscillates.
 * Demo: https://en.wikipedia.org/wiki/File:Fuse_Electronics_Tremolo_MK-III_Quick_Demo.ogv
 */
export interface TremoloFilter {
    /** The frequency 0.0 < x */
    frequency?: number;
    /** The tremolo depth 0.0 < x ≤ 1.0 */
    depth?: number;
}
/**
 * Similar to tremolo. While tremolo oscillates the volume, vibrato oscillates the pitch.
 */
export interface VibratoFilter {
    /** The frequency 0.0 < x ≤ 14.0 */
    frequency?: number;
    /** The vibrato depth 0.0 < x ≤ 1.0 */
    depth?: number;
}
/**
 * Rotates the sound around the stereo channels/user headphones (aka Audio Panning).
 * It can produce an effect similar to https://youtu.be/QB9EB8mTKcc (without the reverb).
 */
export interface RotationFilter {
    /** The frequency of the audio rotating around the listener in Hz. 0.2 is similar to the example video above */
    rotationHz?: number;
}
/**
 * Distortion effect. It can generate some pretty unique audio effects.
 */
export interface DistortionFilter {
    sinOffset?: number;
    sinScale?: number;
    cosOffset?: number;
    cosScale?: number;
    tanOffset?: number;
    tanScale?: number;
    offset?: number;
    scale?: number;
}
/**
 * Mixes both channels (left and right), with a configurable factor on how much each channel affects the other.
 * With the defaults, both channels are kept independent of each other.
 * Setting all factors to 0.5 means both channels get the same audio.
 */
export interface ChannelMixFilter {
    /** The left to left channel mix factor (0.0 ≤ x ≤ 1.0) */
    leftToLeft?: number;
    /** The left to right channel mix factor (0.0 ≤ x ≤ 1.0) */
    leftToRight?: number;
    /** The right to left channel mix factor (0.0 ≤ x ≤ 1.0) */
    rightToLeft?: number;
    /** The right to right channel mix factor (0.0 ≤ x ≤ 1.0) */
    rightToRight?: number;
}
/**
 * Higher frequencies get suppressed, while lower frequencies pass through this filter, thus the name low pass.
 * Any smoothing values equal to or less than 1.0 will disable the filter.
 */
export interface LowPassFilter {
    /** The smoothing factor (1.0 < x) */
    smoothing?: number;
}
/**
 * Filter Data stored in the Client and partially sent to Lavalink
 */
export interface FilterData {
    volume?: number;
    karaoke?: KaraokeFilter;
    timescale?: TimescaleFilter;
    tremolo?: TremoloFilter;
    vibrato?: VibratoFilter;
    rotation?: RotationFilter;
    distortion?: DistortionFilter;
    channelMix?: ChannelMixFilter;
    lowPass?: LowPassFilter;
    pluginFilters?: {
        "lavalink-filter-plugin"?: {
            "echo"?: {
                delay?: number;
                decay?: number;
            };
            "reverb"?: {
                delays?: number[];
                gains?: number[];
            };
        };
        "high-pass"?: {
            cutoffFrequency?: number;
            boostFactor?: number;
        };
        "low-pass"?: {
            cutoffFrequency?: number;
            boostFactor?: number;
        };
        normalization?: {
            maxAmplitude?: number;
            adaptive?: boolean;
        };
        echo?: {
            echoLength?: number;
            decay?: number;
        };
    };
}
/**
 * Actual Filter Data sent to Lavalink
 */
export interface LavalinkFilterData extends FilterData {
    equalizer?: EQBand[];
}
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
