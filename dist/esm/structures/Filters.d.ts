import type { Player } from "./Player";
import type { AudioOutputs, EQBand, FilterData, PlayerFilters, TimescaleFilter } from "./Types/Filters";
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
