import type { FloatNumber, IntegerNumber } from "./Utils";

/** The Audio Outputs type */
export type AudioOutputs = "mono" | "stereo" | "left" | "right";


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
    /* if lowpass filter is enabled / not */
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
    }
    lavalinkLavaDspxPlugin: {
        /** if lowPass filter is enabled / not */
        lowPass: boolean;
        /** if highPass filter is enabled / not */
        highPass: boolean;
        /** if normalization filter is enabled / not */
        normalization: boolean;
        /** if echo filter is enabled / not */
        echo: boolean;
    }
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
    smoothing?: number
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
            },
            "reverb"?: {
                delays?: number[];
                gains?: number[];
            };
        };
        "high-pass"?: { // Cuts off frequencies lower than the specified {cutoffFrequency}.
            cutoffFrequency?: number; // Integer, higher than zero, in Hz.
            boostFactor?: number;    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
        };
        "low-pass"?: { // Cuts off frequencies higher than the specified {cutoffFrequency}.
            cutoffFrequency?: number; // Integer, higher than zero, in Hz.
            boostFactor?: number;    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
        };
        normalization?: { // Attenuates peaking where peaks are defined as having a higher value than {maxAmplitude}.
            maxAmplitude?: number; // Float, within the range of 0.0 - 1.0. A value of 0.0 mutes the output.
            adaptive?: boolean;    // false
        };
        echo?: { // Self-explanatory; provides an echo effect.
            echoLength?: number; // Float, higher than 0.0, in seconds (1.0 = 1 second).
            decay?: number;      // Float, within the range of 0.0 - 1.0. A value of 1.0 means no decay, and a value of 0.0 means
        };
    };
}
/**
 * Actual Filter Data sent to Lavalink
 */
export interface LavalinkFilterData extends FilterData {
    equalizer?: EQBand[];
}
