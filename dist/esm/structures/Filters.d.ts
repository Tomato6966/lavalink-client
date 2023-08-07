import { Player } from "./Player";
export type AudioOutputs = "mono" | "stereo" | "left" | "right";
export interface FilterManager {
    player: Player;
}
export declare class FilterManager {
    equalizerBands: EQBand[];
    filterUpdatedState: number;
    filters: PlayerFilters;
    data: LavalinkFilterData;
    constructor(player: Player);
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
     * Set the AudioOutput Filter
     * @param type
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
     * Enabels / Disables the rotation effect, (Optional: provide your Own Data)
     * @param rotationHz
     * @returns
     */
    toggleRotation(rotationHz?: number): Promise<boolean>;
    /**
     * Enabels / Disables the Vibrato effect, (Optional: provide your Own Data)
     * @param frequency
     * @param depth
     * @returns
     */
    toggleVibrato(frequency?: number, depth?: number): Promise<boolean>;
    /**
     * Enabels / Disables the Tremolo effect, (Optional: provide your Own Data)
     * @param frequency
     * @param depth
     * @returns
     */
    toggleTremolo(frequency?: number, depth?: number): Promise<boolean>;
    /**
     * Enabels / Disables the LowPass effect, (Optional: provide your Own Data)
     * @param smoothing
     * @returns
     */
    toggleLowPass(smoothing?: number): Promise<boolean>;
    /**
     * Enabels / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
     * @param delay
     * @param decay
     * @returns
     */
    toggleEcho(delay?: number, decay?: number): Promise<boolean>;
    /**
     * Enabels / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
     * @param delay
     * @param decay
     * @returns
     */
    toggleReverb(delay?: number, decay?: number): Promise<boolean>;
    /**
     * Enables / Disabels a Nightcore-like filter Effect. Disables/Overwrides both: custom and Vaporwave Filter
     * @param speed
     * @param pitch
     * @param rate
     * @returns
     */
    toggleNightcore(speed?: number, pitch?: number, rate?: number): Promise<boolean>;
    /**
     * Enables / Disabels a Vaporwave-like filter Effect. Disables/Overwrides both: custom and nightcore Filter
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
export declare const validAudioOutputs: {
    mono: {
        leftToLeft: number;
        leftToRight: number;
        rightToLeft: number;
        rightToRight: number;
    };
    stereo: {
        leftToLeft: number;
        leftToRight: number;
        rightToLeft: number;
        rightToRight: number;
    };
    left: {
        leftToLeft: number;
        leftToRight: number;
        rightToLeft: number;
        rightToRight: number;
    };
    right: {
        leftToLeft: number;
        leftToRight: number;
        rightToLeft: number;
        rightToRight: number;
    };
};
export interface PlayerFilters {
    /** Sets nightcore to false, and vaporwave to false */
    custom: boolean;
    /** Sets custom to false, and vaporwave to false */
    nightcore: boolean;
    /** Sets custom to false, and nightcore to false */
    vaporwave: boolean;
    /** only with the custom lavalink filter plugin */
    echo: boolean;
    /** only with the custom lavalink filter plugin */
    reverb: boolean;
    rotation: boolean;
    karaoke: boolean;
    tremolo: boolean;
    vibrato: boolean;
    lowPass: boolean;
    /** audio Output (default stereo, mono sounds the fullest and best for not-stereo tracks) */
    audioOutput: AudioOutputs;
    /** Lavalink Volume FILTER (not player Volume, think of it as a gain booster) */
    volume: boolean;
}
export interface EQBand {
    band: number;
    gain: number;
}
export interface KaraokeFilter {
    level?: number;
    monoLevel?: number;
    filterBand?: number;
    filterWidth?: number;
}
export interface TimescaleFilter {
    speed?: number;
    pitch?: number;
    rate?: number;
}
export interface FreqFilter {
    frequency?: number;
    depth?: number;
}
export interface RotationFilter {
    rotationHz?: number;
}
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
export interface ChannelMixFilter {
    leftToLeft?: number;
    leftToRight?: number;
    rightToLeft?: number;
    rightToRight?: number;
}
export interface LowPassFilter {
    smoothing?: number;
}
export interface EchoFilter {
    delay: number;
    decay: number;
}
export interface ReverbFilter {
    delay: number;
    decay: number;
}
export interface LavalinkFilterData {
    volume?: number;
    equalizer?: EQBand[];
    karaoke?: KaraokeFilter;
    timescale?: TimescaleFilter;
    tremolo?: FreqFilter;
    vibrato?: FreqFilter;
    rotation?: RotationFilter;
    distortion?: DistortionFilter;
    channelMix?: ChannelMixFilter;
    lowPass?: LowPassFilter;
    echo: EchoFilter;
    reverb: ReverbFilter;
}
