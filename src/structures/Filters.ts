import { audioOutputsData, EQList } from "./Constants";
import type { Player } from "./Player";
import type {
    AudioOutputs,
    EQBand,
    FilterData,
    LavalinkFilterData,
    PlayerFilters,
    TimescaleFilter,
} from "./Types/Filters";
import { safeStringify } from "./Utils";
/**
 * The FilterManager for each player
 */

const DEFAULT_FILTER_DATAS: FilterData = {
    volume: 1,
    lowPass: {
        smoothing: 0,
    },
    karaoke: {
        level: 0,
        monoLevel: 0,
        filterBand: 0,
        filterWidth: 0,
    },
    timescale: {
        speed: 1, // 0 = x
        pitch: 1, // 0 = x
        rate: 1, // 0 = x
    },
    rotation: {
        rotationHz: 0,
    },
    tremolo: {
        frequency: 0, // 0 < x
        depth: 0, // 0 < x = 1
    },
    vibrato: {
        frequency: 0, // 0 < x <= 14
        depth: 0, // 0 < x <= 1
    },
    channelMix: audioOutputsData.stereo,
    // NODELINK SPECIFIC
    echo: {
        delay: 0,
        feedback: 0,
        mix: 0,
    },
    chorus: {
        rate: 0,
        depth: 0,
        delay: 0,
        mix: 0,
        feedback: 0,
    },
    compressor: {
        threshold: 0,
        ratio: 1,
        attack: 0,
        release: 0,
        gain: 0,
    },
    highPass: {
        smoothing: 0,
    },
    phaser: {
        stages: 0,
        rate: 0,
        depth: 0,
        feedback: 0,
        mix: 0,
        minFrequency: 0,
        maxFrequency: 0,
    },
    spatial: {
        depth: 0,
        rate: 0,
    },
    // LAVALINK-FILTER-PLUGIN SPECIFIC
    pluginFilters: {
        "lavalink-filter-plugin": {
            echo: {
                delay: 0, // in seconds
                decay: 0, // 0 < 1
            },
            reverb: {
                delays: [], // [0.037, 0.042, 0.048, 0.053]
                gains: [], // [0.84, 0.83, 0.82, 0.81]
            },
        },
        "high-pass": {
            // Cuts off frequencies lower than the specified {cutoffFrequency}.
            // "cutoffFrequency": 1475, // Integer, higher than zero, in Hz.
            // "boostFactor": 1.0    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
        },
        "low-pass": {
            // Cuts off frequencies higher than the specified {cutoffFrequency}.
            // "cutoffFrequency": 284, // Integer, higher than zero, in Hz.
            // "boostFactor": 1.24389    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
        },
        normalization: {
            // Attenuates peaking where peaks are defined as having a higher value than {maxAmplitude}.
            // "maxAmplitude": 0.6327, // Float, within the range of 0.0 - 1.0. A value of 0.0 mutes the output.
            // "adaptive": true    // false
        },
        echo: {
            // Self-explanatory; provides an echo effect.
            // "echoLength": 0.5649, // Float, higher than 0.0, in seconds (1.0 = 1 second).
            // "decay": 0.4649       // Float, within the range of 0.0 - 1.0. A value of 1.0 means no decay, and a value of 0.0 means
        },
    },
    /*distortion: {
        sinOffset: 0,
        sinScale: 1,
        cosOffset: 0,
        cosScale: 1,
        tanOffset: 0,
        tanScale: 1,
        offset: 0,
        scale: 1
    }*/
};
export class FilterManager {
    public static EQList = EQList;
    /** The Equalizer bands currently applied to the Lavalink Server */
    public equalizerBands: EQBand[] = [];
    /** Private Util for the instaFix Filters option */
    public filterUpdatedState: boolean = false;
    /** All "Active" / "disabled" Player Filters */
    public filters: PlayerFilters = {
        volume: false,
        vaporwave: false,
        custom: false,
        nightcore: false,
        rotation: false,
        karaoke: false,
        tremolo: false,
        vibrato: false,
        lowPass: false,
        nodeLinkEcho: false,
        nodeLinkChorus: false,
        nodeLinkCompressor: false,
        nodeLinkHighPass: false,
        nodeLinkPhaser: false,
        nodeLinkSpatial: false,
        lavalinkFilterPlugin: {
            echo: false,
            reverb: false,
        },
        lavalinkLavaDspxPlugin: {
            lowPass: false,
            highPass: false,
            normalization: false,
            echo: false,
        },
        audioOutput: "stereo",
    };
    /** The Filter Data sent to Lavalink, only if the filter is enabled (ofc.) */
    public data: FilterData = structuredClone(DEFAULT_FILTER_DATAS);
    /** The Player assigned to this Filter Manager */
    public player: Player;
    /** The Constructor for the FilterManager */
    constructor(player: Player) {
        /** Assign the player to the filter manager */
        this.player = player;
    }

    /**
     * Apply Player filters for lavalink filter sending data, if the filter is enabled / not
     *
     * @returns {Promise<void>}
     *
     * @example
     * ```ts
     * // Apply the filters after changing them manually:
     * player.filterManager.data.volume = 0.5;
     * // maybe you wanna manually set a distorition filter? then do it like this...
     * player.filterManager.data.distortion = { sinOffset: 0.5, sinScale: 2, cosOffset: 0.5, cosScale: 2, tanOffset: 0.5, tanScale: 2, offset: 0.5, scale: 2 };
     * await player.filterManager.applyPlayerFilters();
     * ```
     */
    async applyPlayerFilters(): Promise<void> {
        const sendData = { ...this.data } as LavalinkFilterData & { equalizer: EQBand[] };
        this.checkFiltersState();

        if (!this.filters.volume) delete sendData.volume;
        if (!this.filters.tremolo) delete sendData.tremolo;
        if (!this.filters.vibrato) delete sendData.vibrato;

        if (!this.filters.lavalinkFilterPlugin.echo) delete sendData.pluginFilters?.["lavalink-filter-plugin"]?.echo;
        if (!this.filters.lavalinkFilterPlugin.reverb)
            delete sendData.pluginFilters?.["lavalink-filter-plugin"]?.reverb;

        if (!this.filters.lavalinkLavaDspxPlugin.echo) delete sendData.pluginFilters?.echo;
        if (!this.filters.lavalinkLavaDspxPlugin.normalization) delete sendData.pluginFilters?.normalization;
        if (!this.filters.lavalinkLavaDspxPlugin.highPass) delete sendData.pluginFilters?.["high-pass"];
        if (!this.filters.lavalinkLavaDspxPlugin.lowPass) delete sendData.pluginFilters?.["low-pass"];

        if (
            sendData.pluginFilters?.["lavalink-filter-plugin"] &&
            Object.values(sendData.pluginFilters?.["lavalink-filter-plugin"]).length === 0
        )
            delete sendData.pluginFilters["lavalink-filter-plugin"];
        if (sendData.pluginFilters && Object.values(sendData.pluginFilters).length === 0) delete sendData.pluginFilters;
        if (!this.filters.lowPass) delete sendData.lowPass;
        if (!this.filters.karaoke) delete sendData.karaoke;
        if (!this.filters.rotation) delete sendData.rotation;
        if (this.filters.audioOutput === "stereo") delete sendData.channelMix;

        if (!this.filters.nodeLinkEcho) delete sendData.echo;
        if (!this.filters.nodeLinkChorus) delete sendData.chorus;
        if (!this.filters.nodeLinkCompressor) delete sendData.compressor;
        if (!this.filters.nodeLinkHighPass) delete sendData.highPass;
        if (!this.filters.nodeLinkPhaser) delete sendData.phaser;
        if (!this.filters.nodeLinkSpatial) delete sendData.spatial;

        if (Object.values(this.data.timescale ?? {}).every((v) => v === 1)) delete sendData.timescale;

        if (!this.player.node.sessionId) throw new Error("The Lavalink-Node is either not ready or not up to date");

        sendData.equalizer = [...this.equalizerBands];
        if (sendData.equalizer.length === 0) delete sendData.equalizer;

        for (const key of Object.keys(sendData)) {
            // delete disabled filters
            if (key === "pluginFilters") {
                // for(const key of [...Object.keys(sendData.pluginFilters)]) {
                //     // if (this.player.node._checkForPlugins && !this.player?.node?.info?.plugins?.find?.(v => v.name === key)) delete sendData[key];
                // }
            } else if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.(key))
                delete sendData[key];
        }

        const now = performance.now();

        if (this.player.options.instaUpdateFiltersFix === true) this.filterUpdatedState = true;

        await this.player.node.updatePlayer({
            guildId: this.player.guildId,
            playerOptions: {
                filters: sendData,
            },
        });

        this.player.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return;
    }

    private privateNot0(value: number | undefined): boolean {
        return typeof value === "number" && value !== 0;
    }

    private getLavalinkFilterData(): LavalinkFilterData["pluginFilters"]["lavalink-filter-plugin"] {
        return (
            this.data.pluginFilters?.["lavalink-filter-plugin"] || {
                echo: {
                    decay:
                        this.data.pluginFilters?.echo?.decay && !this.data.pluginFilters?.echo?.echoLength
                            ? this.data.pluginFilters?.echo?.decay
                            : 0,
                    delay: (this.data.pluginFilters?.echo as { decay: number; delay: number })?.delay || 0,
                },
                reverb: {
                    gains: [],
                    delays: [],
                    ...(this.data.pluginFilters as { reverb: { gains: number[]; delays: number[] } })?.reverb,
                },
            }
        );
    }

    /**
     * Checks if the filters are correctly stated (active / not-active) - mostly used internally.
     * @param oldFilterTimescale
     * @returns {boolean} True, if the check was successfull
     *
     * @example
     * ```ts
     * // Check the filter states
     * player.filterManager.checkFiltersState();
     * // Apply the filters after checking
     * await player.filterManager.applyPlayerFilters();
     * ```
     */
    checkFiltersState(oldFilterTimescale?: Partial<TimescaleFilter>): boolean {
        this.data = this.data ?? {};

        this.filters.rotation = this.privateNot0(this.data.rotation?.rotationHz);
        this.filters.vibrato =
            this.privateNot0(this.data.vibrato?.frequency) || this.privateNot0(this.data.vibrato?.depth);
        this.filters.tremolo =
            this.privateNot0(this.data.tremolo?.frequency) || this.privateNot0(this.data.tremolo?.depth);

        const lavalinkFilterData = this.getLavalinkFilterData();
        this.filters.lavalinkFilterPlugin = {
            echo:
                this.privateNot0(lavalinkFilterData?.echo?.decay) || this.privateNot0(lavalinkFilterData?.echo?.delay),
            reverb:
                this.privateNot0(lavalinkFilterData?.reverb?.delays?.length) ||
                this.privateNot0(lavalinkFilterData?.reverb?.gains?.length),
        };
        this.filters.lavalinkLavaDspxPlugin = {
            lowPass: Object.values(this.data.pluginFilters?.["low-pass"] || {})?.length > 0,
            highPass: Object.values(this.data.pluginFilters?.["high-pass"] || {})?.length > 0,
            normalization: Object.values(this.data.pluginFilters?.normalization || {})?.length > 0,
            echo:
                Object.values(this.data.pluginFilters?.echo || {})?.length > 0 &&
                typeof (this.data.pluginFilters?.echo as { decay: number; delay: number })?.delay === "undefined",
        };
        this.filters.lowPass = this.privateNot0(this.data.lowPass?.smoothing);
        this.filters.nodeLinkEcho =
            this.privateNot0(this.data.echo?.delay) ||
            this.privateNot0(this.data.echo?.feedback) ||
            this.privateNot0(this.data.echo?.mix);
        this.filters.nodeLinkChorus =
            this.privateNot0(this.data.chorus?.rate) ||
            this.privateNot0(this.data.chorus?.depth) ||
            this.privateNot0(this.data.chorus?.delay) ||
            this.privateNot0(this.data.chorus?.mix) ||
            this.privateNot0(this.data.chorus?.feedback);
        this.filters.nodeLinkCompressor =
            this.privateNot0(this.data.compressor?.threshold) ||
            this.data.compressor?.ratio > 1 ||
            this.privateNot0(this.data.compressor?.attack) ||
            this.privateNot0(this.data.compressor?.release) ||
            this.privateNot0(this.data.compressor?.gain);
        this.filters.nodeLinkHighPass = this.privateNot0(this.data.highPass?.smoothing);
        this.filters.nodeLinkPhaser =
            this.privateNot0(this.data.phaser?.stages) ||
            this.privateNot0(this.data.phaser?.rate) ||
            this.privateNot0(this.data.phaser?.depth) ||
            this.privateNot0(this.data.phaser?.feedback) ||
            this.privateNot0(this.data.phaser?.mix) ||
            this.privateNot0(this.data.phaser?.minFrequency) ||
            this.privateNot0(this.data.phaser?.maxFrequency);
        this.filters.nodeLinkSpatial =
            this.privateNot0(this.data.spatial?.depth) || this.privateNot0(this.data.spatial?.rate);
        this.filters.karaoke = Object.values(this.data.karaoke ?? {}).some((v) => v !== 0);
        if ((this.filters.nightcore || this.filters.vaporwave) && oldFilterTimescale) {
            if (
                oldFilterTimescale.pitch !== this.data.timescale?.pitch ||
                oldFilterTimescale.rate !== this.data.timescale?.rate ||
                oldFilterTimescale.speed !== this.data.timescale?.speed
            ) {
                this.filters.custom = Object.values(this.data.timescale || {}).some((v) => v !== 1);
                this.filters.nightcore = false;
                this.filters.vaporwave = false;
            }
        }
        return true;
    }

    /**
     * Reset all Filters
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Reset all filters
     * await player.filterManager.resetFilters();
     * ```
     */
    public async resetFilters(): Promise<FilterManager> {
        this.filters.lavalinkLavaDspxPlugin.echo = false;
        this.filters.lavalinkLavaDspxPlugin.normalization = false;
        this.filters.lavalinkLavaDspxPlugin.highPass = false;
        this.filters.lavalinkLavaDspxPlugin.lowPass = false;
        this.filters.lavalinkFilterPlugin.echo = false;
        this.filters.lavalinkFilterPlugin.reverb = false;
        this.filters.nightcore = false;
        this.filters.lowPass = false;
        this.filters.rotation = false;
        this.filters.tremolo = false;
        this.filters.vibrato = false;
        this.filters.karaoke = false;
        this.filters.karaoke = false;
        this.filters.volume = false;
        this.filters.nodeLinkEcho = false;
        this.filters.nodeLinkChorus = false;
        this.filters.nodeLinkCompressor = false;
        this.filters.nodeLinkHighPass = false;
        this.filters.nodeLinkPhaser = false;
        this.filters.nodeLinkSpatial = false;
        this.filters.audioOutput = "stereo";

        this.data = structuredClone(DEFAULT_FILTER_DATAS);

        await this.applyPlayerFilters();
        return this;
    }

    /**
     * Set the Filter Volume
     * @param volume the volume (0.0 - 5.0)
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set Volume to 50%
     * await player.filterManager.setVolume(0.5);
     * // note this is a filter, so it will "jump" to the volume, i think it's like a "volume boost effect" so i marketed it as a filter
     * ```
     */
    public async setVolume(volume: number) {
        if (volume < 0 || volume > 5) throw new SyntaxError("Volume-Filter must be between 0 and 5");

        this.data = this.data ?? {};

        this.data.volume = volume;
        this.filters.volume = volume !== 1;

        await this.applyPlayerFilters();

        return this;
    }

    /**
     * Set the AudioOutput Filter
     * @param {AudioOutputs} type the audio output type
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set Audio Output to Mono
     * await player.filterManager.setAudioOutput("mono");
     *
     * // Set Audio Output to Stereo
     * await player.filterManager.setAudioOutput("stereo");
     *
     * // Set Audio Output to Left
     * await player.filterManager.setAudioOutput("left");
     *
     * // Set Audio Output to Right
     * await player.filterManager.setAudioOutput("right");
     * ```
     */
    public async setAudioOutput(type: AudioOutputs): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("channelMix"))
            throw new Error("Node#Info#filters does not include the 'channelMix' Filter (Node has it not enable)");
        if (!type || !audioOutputsData[type])
            throw "Invalid audio type added, must be 'mono' / 'stereo' / 'left' / 'right'";

        this.data = this.data ?? {};

        this.data.channelMix = audioOutputsData[type];
        this.filters.audioOutput = type;

        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Set custom filter.timescale#speed . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param {number} speed set the speed of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set Speed to 1.25 (disableds nightcore and vaporwave effect which are pre-made timescale settings of rate,pitch and speed)
     * await player.filterManager.setSpeed(1.25);
     * ```
     */
    public async setSpeed(speed = 1): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("timescale"))
            throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.filters.nightcore = false;
        this.filters.vaporwave = false;
        this.data.timescale = { ...DEFAULT_FILTER_DATAS.timescale, speed };

        this.isCustomFilterActive();

        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Set custom filter.timescale#pitch . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param  {number} pitch set the pitch of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set Pitch to 1.25 (disableds nightcore and vaporwave effect which are pre-made timescale settings of rate,pitch and speed)
     * await player.filterManager.setPitch(1.25);
     * ```
     */
    public async setPitch(pitch = 1): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("timescale"))
            throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.filters.nightcore = false;
        this.filters.vaporwave = false;
        this.data.timescale = { ...DEFAULT_FILTER_DATAS.timescale, pitch };

        this.isCustomFilterActive();

        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Set custom filter.timescale#rate . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param {number} rate set the rate of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set Rate to 1.25 (disableds nightcore and vaporwave effect which are pre-made timescale settings of rate,pitch and speed)
     * await player.filterManager.setRate(1.25);
     * ```
     */
    public async setRate(rate = 1): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("timescale"))
            throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.filters.nightcore = false;
        this.filters.vaporwave = false;
        this.data.timescale = { ...DEFAULT_FILTER_DATAS.timescale, rate };

        this.isCustomFilterActive();

        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Enables / Disables the rotation effect, (Optional: provide your Own Data)
     * @param {number} rotationHz set the rotationHz of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle Rotation filter with custom settings
     * await player.filterManager.toggleRotation(0.4);
     * // or use the defaults
     * await player.filterManager.toggleRotation();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleRotation(rotationHz = 0.2): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("rotation"))
            throw new Error("Node#Info#filters does not include the 'rotation' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.rotation = this.filters.rotation ? DEFAULT_FILTER_DATAS.rotation : { rotationHz };

        this.filters.rotation = !this.filters.rotation;

        await this.applyPlayerFilters();

        return this;
    }

    /**
     * Enables / Disables the Vibrato effect, (Optional: provide your Own Data)
     * @param {number} frequency set the frequency of the filter
     * @param {number} depth set the depth of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle Vibrato filter with custom settings
     * await player.filterManager.toggleVibrato(8, 0.5);
     * // or use the defaults
     * await player.filterManager.toggleVibrato();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleVibrato(frequency = 10, depth = 1): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("vibrato"))
            throw new Error("Node#Info#filters does not include the 'vibrato' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.vibrato = this.filters.vibrato ? DEFAULT_FILTER_DATAS.vibrato : { depth, frequency };

        this.filters.vibrato = !this.filters.vibrato;
        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Enables / Disables the Tremolo effect, (Optional: provide your Own Data)
     * @param {number} frequency set the frequency of the filter
     * @param {number} depth set the depth of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle Tremolo filter with custom settings
     * await player.filterManager.toggleTremolo(5, 0.7);
     * // or use the defaults
     * await player.filterManager.toggleTremolo();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleTremolo(frequency = 4, depth = 0.8): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("tremolo"))
            throw new Error("Node#Info#filters does not include the 'tremolo' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.tremolo = this.filters.tremolo ? DEFAULT_FILTER_DATAS.tremolo : { depth, frequency };

        this.filters.tremolo = !this.filters.tremolo;
        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Enables / Disables the LowPass effect, (Optional: provide your Own Data)
     * @param {number} smoothing set the smoothing of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle LowPass filter with custom settings
     * await player.filterManager.toggleLowPass(30);
     * // or use the defaults
     * await player.filterManager.toggleLowPass();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleLowPass(smoothing = 20): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("lowPass"))
            throw new Error("Node#Info#filters does not include the 'lowPass' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.lowPass = this.filters.lowPass ? DEFAULT_FILTER_DATAS.lowPass : { smoothing };

        this.filters.lowPass = !this.filters.lowPass;
        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Lavalink LavaDspx Plugin Filters
     */
    lavalinkLavaDspxPlugin = {
        /**
         * Enables / Disables the LowPass effect, (Optional: provide your Own Data)
         * @param {number} boostFactor set the boost factor of the filter
         * @param {number} cutoffFrequency set the cutoff frequency of the filter
         * @returns  {Promise<boolean>} the state of the filter after execution.
         *
         * @example
         * ```ts
         * // Toggle LowPass filter with custom settings
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleLowPass(1.2, 300);
         * // or use the defaults
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleLowPass();
         * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
         * ```
         */
        toggleLowPass: async (boostFactor = 1.0, cutoffFrequency = 80): Promise<FilterManager> => {
            if (
                this.player.node._checkForPlugins &&
                !this.player?.node?.info?.plugins?.find?.((v) => v.name === "lavadspx-plugin")
            )
                throw new Error("Node#Info#plugins does not include the lavadspx plugin");
            if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("low-pass"))
                throw new Error("Node#Info#filters does not include the 'low-pass' Filter (Node has it not enable)");

            this.data = this.data ?? {};
            this.data.pluginFilters = this.data.pluginFilters ?? {};

            if (this.filters.lavalinkLavaDspxPlugin.lowPass) delete this.data.pluginFilters["low-pass"];
            else this.data.pluginFilters["low-pass"] = { boostFactor, cutoffFrequency };

            this.filters.lavalinkLavaDspxPlugin.lowPass = !this.filters.lavalinkLavaDspxPlugin.lowPass;
            await this.applyPlayerFilters();
            return this;
        },

        /**
         * Enables / Disables the HighPass effect, (Optional: provide your Own Data)
         * @param {number} boostFactor [] set the boost factor of the filter
         * @param {number} cutoffFrequency set the cutoff frequency of the filter
         * @returns  {Promise<boolean>} the state of the filter after execution.
         *
         * @example
         * ```ts
         * // Toggle HighPass filter with custom settings
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleHighPass(1.2, 150); // custom values
         * // or use the defaults
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleHighPass();
         * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
         * ```
         */
        toggleHighPass: async (boostFactor = 1.0, cutoffFrequency = 80): Promise<FilterManager> => {
            if (
                this.player.node._checkForPlugins &&
                !this.player?.node?.info?.plugins?.find?.((v) => v.name === "lavadspx-plugin")
            )
                throw new Error("Node#Info#plugins does not include the lavadspx plugin");
            if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("high-pass"))
                throw new Error("Node#Info#filters does not include the 'high-pass' Filter (Node has it not enable)");

            this.data = this.data ?? {};
            this.data.pluginFilters = this.data.pluginFilters ?? {};

            if (this.filters.lavalinkLavaDspxPlugin.highPass) delete this.data.pluginFilters["high-pass"];
            else this.data.pluginFilters["high-pass"] = { boostFactor, cutoffFrequency };

            this.filters.lavalinkLavaDspxPlugin.highPass = !this.filters.lavalinkLavaDspxPlugin.highPass;
            await this.applyPlayerFilters();
            return this;
        },

        /**
         * Enables / Disables the Normalization effect.
         * @param {number} [maxAmplitude=0.75] - The maximum amplitude of the audio.
         * @param {boolean} [adaptive=true] Whether to use adaptive normalization or not.
         * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
         *
         * @example
         * ```ts
         * // Toggle Normalization filter with custom settings
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleNormalization(0.9, false); // custom values
         * // or use the defaults
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleNormalization();
         * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
         * ```
         */
        toggleNormalization: async (maxAmplitude: number = 0.75, adaptive: boolean = true): Promise<FilterManager> => {
            if (
                this.player.node._checkForPlugins &&
                !this.player?.node?.info?.plugins?.find?.((v) => v.name === "lavadspx-plugin")
            )
                throw new Error("Node#Info#plugins does not include the lavadspx plugin");
            if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("normalization"))
                throw new Error(
                    "Node#Info#filters does not include the 'normalization' Filter (Node has it not enable)",
                );

            this.data = this.data ?? {};
            this.data.pluginFilters = this.data.pluginFilters ?? {};

            if (this.filters.lavalinkLavaDspxPlugin.normalization) delete this.data.pluginFilters.normalization;
            else this.data.pluginFilters.normalization = { adaptive, maxAmplitude };

            this.filters.lavalinkLavaDspxPlugin.normalization = !this.filters.lavalinkLavaDspxPlugin.normalization;
            await this.applyPlayerFilters();
            return this;
        },

        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param {number} [decay=0.5] The decay of the echo effect.
         * @param {number} [echoLength=0.5] The length of the echo effect.
         * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
         *
         * @example
         * ```ts
         * // Toggle Echo filter with custom settings
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleEcho(0.7, 0.6); // custom values
         * // or use the defaults
         * await player.filterManager.lavalinkLavaDspxPlugin.toggleEcho();
         * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
         * ```
         */
        toggleEcho: async (decay: number = 0.5, echoLength: number = 0.5): Promise<FilterManager> => {
            if (
                this.player.node._checkForPlugins &&
                !this.player?.node?.info?.plugins?.find?.((v) => v.name === "lavadspx-plugin")
            )
                throw new Error("Node#Info#plugins does not include the lavadspx plugin");
            if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("echo"))
                throw new Error("Node#Info#filters does not include the 'echo' Filter (Node has it not enable)");

            this.data = this.data ?? {};
            this.data.pluginFilters = this.data.pluginFilters ?? {};

            if (this.filters.lavalinkLavaDspxPlugin.echo) delete this.data.pluginFilters.echo;
            else this.data.pluginFilters.echo = { decay, echoLength };

            this.filters.lavalinkLavaDspxPlugin.echo = !this.filters.lavalinkLavaDspxPlugin.echo;
            await this.applyPlayerFilters();
            return this;
        },
    };
    /**
     * LavalinkFilter Plugin specific Filters
     */
    lavalinkFilterPlugin = {
        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param {number} delay set the delay of the echo
         * @param {number} decay set the decay of the echo
         * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
         *
         * @example
         * ```ts
         * // Toggle Echo filter with custom settings
         * await player.filterManager.lavalinkFilterPlugin.toggleEcho(3, 0.7); // custom values
         * // or use the defaults
         * await player.filterManager.lavalinkFilterPlugin.toggleEcho();
         * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
         * ```
         */
        toggleEcho: async (delay = 4, decay = 0.8): Promise<FilterManager> => {
            if (
                this.player.node._checkForPlugins &&
                !this.player?.node?.info?.plugins?.find?.((v) => v.name === "lavalink-filter-plugin")
            )
                throw new Error("Node#Info#plugins does not include the lavalink-filter-plugin plugin");
            if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("echo"))
                throw new Error(
                    "Node#Info#filters does not include the 'echo' Filter (Node has it not enable aka not installed!)",
                );

            this.data = this.data ?? {};

            const { echo, reverb } = DEFAULT_FILTER_DATAS.pluginFilters["lavalink-filter-plugin"];

            this.data.pluginFilters = {
                ...this.data.pluginFilters,
                ["lavalink-filter-plugin"]: {
                    reverb: this.data.pluginFilters?.["lavalink-filter-plugin"]?.reverb ?? reverb,
                    echo: this.filters.lavalinkFilterPlugin.echo ? echo : { delay, decay },
                },
            };

            this.filters.lavalinkFilterPlugin.echo = !this.filters.lavalinkFilterPlugin.echo;

            await this.applyPlayerFilters();
            return this;
        },

        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param {number} delays set the delays of the reverb
         * @param {number} gains set the gains of the reverb
         * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
         *
         * @example
         * ```ts
         * // Toggle Reverb filter with custom settings
         * await player.filterManager.lavalinkFilterPlugin.toggleReverb([0.04, 0.045, 0.05, 0.055], [0.85, 0.84, 0.83, 0.82]);
         * // or use the defaults
         * await player.filterManager.lavalinkFilterPlugin.toggleReverb();
         * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
         * ```
         */
        toggleReverb: async (
            delays = [0.037, 0.042, 0.048, 0.053],
            gains = [0.84, 0.83, 0.82, 0.81],
        ): Promise<FilterManager> => {
            if (
                this.player.node._checkForPlugins &&
                !this.player?.node?.info?.plugins?.find?.((v) => v.name === "lavalink-filter-plugin")
            )
                throw new Error("Node#Info#plugins does not include the lavalink-filter-plugin plugin");
            if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("reverb"))
                throw new Error(
                    "Node#Info#filters does not include the 'reverb' Filter (Node has it not enable aka not installed!)",
                );

            this.data = this.data ?? {};

            const { echo, reverb } = DEFAULT_FILTER_DATAS.pluginFilters["lavalink-filter-plugin"];

            this.data.pluginFilters = {
                ...this.data.pluginFilters,
                ["lavalink-filter-plugin"]: {
                    echo: this.data.pluginFilters?.["lavalink-filter-plugin"]?.echo ?? echo,
                    reverb: this.filters.lavalinkFilterPlugin.reverb ? reverb : { delays, gains },
                },
            };

            this.filters.lavalinkFilterPlugin.reverb = !this.filters.lavalinkFilterPlugin.reverb;
            await this.applyPlayerFilters();
            return this;
        },
    };
    /**
     * Enables / Disables a Nightcore-like filter Effect. Disables/Overrides both: custom and Vaporwave Filter
     * @param {number} speed set the speed of the filter
     * @param {number} pitch set the pitch of the filter
     * @param {number} rate set the rate of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle Nightcore filter with custom settings
     * await player.filterManager.toggleNightcore(1.3, 1.3, 0.9);
     * // or use the defaults
     * await player.filterManager.toggleNightcore();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleNightcore(
        speed = 1.289999523162842,
        pitch = 1.289999523162842,
        rate = 0.9365999523162842,
    ): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("timescale"))
            throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.timescale = this.filters.nightcore ? DEFAULT_FILTER_DATAS.timescale : { speed, pitch, rate };

        this.filters.nightcore = !this.filters.nightcore;
        this.filters.vaporwave = false;
        this.filters.custom = false;

        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Enables / Disables a Vaporwave-like filter Effect. Disables/Overrides both: custom and nightcore Filter
     * @param {number} speed set the speed of the filterq
     * @param {number} pitch set the pitch of the filter
     * @param {number} rate set the rate of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle Vaporwave filter with custom settings
     * await player.filterManager.toggleVaporwave(0.9, 0.7, 1);
     * // or use the defaults
     * await player.filterManager.toggleVaporwave();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleVaporwave(
        speed = 0.8500000238418579,
        pitch = 0.800000011920929,
        rate = 1,
    ): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("timescale"))
            throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.timescale = this.filters.vaporwave ? DEFAULT_FILTER_DATAS.timescale : { speed, pitch, rate };

        this.filters.vaporwave = !this.filters.vaporwave;
        this.filters.nightcore = false;
        this.filters.custom = false;

        await this.applyPlayerFilters();
        return this;
    }
    /**
     * Enable / Disables a Karaoke like Filter Effect
     * @param {number} level set the level of the filter
     * @param {number} monoLevel set the mono level of the filter
     * @param {number} filterBand set the filter band of the filter
     * @param {number} filterWidth set the filter width of the filter
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Toggle Karaoke filter with custom settings
     * await player.filterManager.toggleKaraoke(1.5, 1.0, 220, 100);
     * // or use the defaults
     * await player.filterManager.toggleKaraoke();
     * // when it's enabled before calling the toggle function, it disables it, so you might need to do some if/else logic.
     * ```
     */
    public async toggleKaraoke(level = 1, monoLevel = 1, filterBand = 220, filterWidth = 100): Promise<FilterManager> {
        if (this.player.node._checkForSources && !this.player?.node?.info?.filters?.includes?.("karaoke"))
            throw new Error("Node#Info#filters does not include the 'karaoke' Filter (Node has it not enable)");

        this.data = this.data ?? {};

        this.data.karaoke = this.filters.karaoke
            ? DEFAULT_FILTER_DATAS.karaoke
            : { level, monoLevel, filterBand, filterWidth };

        this.filters.karaoke = !this.filters.karaoke;
        await this.applyPlayerFilters();
        return this;
    }

    /**
     * Function to find out if currently there is a custom timescamle etc. filter applied
     * @returns {boolean} whether a custom filter is active
     *
     * @example
     * ```ts
     * // Check if a custom filter is active
     * const isCustom = player.filterManager.isCustomFilterActive();
     * console.log(`Is custom filter active? ${isCustom}`);
     * ```
     */
    public isCustomFilterActive(): boolean {
        this.filters.custom =
            !this.filters.nightcore &&
            !this.filters.vaporwave &&
            Object.values(this.data.timescale).some((d) => d !== 1);
        return this.filters.custom;
    }

    /**
     * Sets the players equalizer bands using one of the predefined presets.
     * @param {keyof typeof EQList} preset The preset to use.
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set EQ preset
     * await player.filterManager.setEQPreset('BassboostMedium');
     * ```
     */
    public async setEQPreset(preset: keyof typeof EQList): Promise<this> {
        const bands = EQList[preset];
        return this.setEQ(bands);
    }

    /**
     * Sets the players equalizer band on-top of the existing ones.
     * @param {number} bands
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Set EQ bands
     * await player.filterManager.setEQ([
     *   { band: 0, gain: 0.3 },
     *   { band: 1, gain: -0.2 },
     *   { band: 2, gain: 0.1 }
     * ]);
     *
     * // or use one of the templates:
     * await player.filterManager.setEQ(player.filterManager.EQList.BassboostMedium); // you can also import EQList from somewhere package if wanted.
     * ```
     */
    public async setEQ(bands: EQBand | EQBand[]): Promise<this> {
        if (!Array.isArray(bands)) bands = [bands];

        if (!bands.length || !bands.every((band) => safeStringify(Object.keys(band).sort()) === '["band","gain"]'))
            throw new TypeError("Bands must be a non-empty object array containing 'band' and 'gain' properties.");

        for (const { band, gain } of bands) this.equalizerBands[band] = { band, gain };

        if (!this.player.node.sessionId) throw new Error("The Lavalink-Node is either not ready or not up to date");

        const now = performance.now();

        if (this.player.options.instaUpdateFiltersFix === true) this.filterUpdatedState = true;

        await this.player.node.updatePlayer({
            guildId: this.player.guildId,
            playerOptions: {
                filters: { equalizer: this.equalizerBands },
            },
        });

        this.player.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;

        return this;
    }

    /**
     * Clears the equalizer bands.
     * @returns {Promise<FilterManager>} The Filter Manager, for chaining.
     *
     * @example
     * ```ts
     * // Clear all EQ bands
     * await player.filterManager.clearEQ();
     * ```
     */
    public async clearEQ(): Promise<this> {
        return this.setEQ(Array.from({ length: 15 }, (_v, i) => ({ band: i, gain: 0 })));
    }
}
