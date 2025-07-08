import { audioOutputsData } from "./Constants";
import { safeStringify } from "./Utils";

import type { Player } from "./Player";
import type { AudioOutputs, EQBand, FilterData, LavalinkFilterData, PlayerFilters, TimescaleFilter } from "./Types/Filters";
/**
 * The FilterManager for each player
 */
export class FilterManager {
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
    }
    /** The Filter Data sent to Lavalink, only if the filter is enabled (ofc.) */
    public data: FilterData = {
        lowPass: {
            smoothing: 0
        },
        karaoke: {
            level: 0,
            monoLevel: 0,
            filterBand: 0,
            filterWidth: 0
        },
        timescale: {
            speed: 1, // 0 = x
            pitch: 1, // 0 = x
            rate: 1 // 0 = x
        },
        rotation: {
            rotationHz: 0
        },
        tremolo: {
            frequency: 0, // 0 < x
            depth: 0// 0 < x = 1
        },
        vibrato: {
            frequency: 0, // 0 < x <= 14
            depth: 0     // 0 < x <= 1
        },
        pluginFilters: {
            "lavalink-filter-plugin": {
                echo: {
                    delay: 0, // in seconds
                    decay: 0 // 0 < 1
                },
                reverb: {
                    delays: [], // [0.037, 0.042, 0.048, 0.053]
                    gains: [] // [0.84, 0.83, 0.82, 0.81]
                }
            },
            "high-pass": { // Cuts off frequencies lower than the specified {cutoffFrequency}.
                // "cutoffFrequency": 1475, // Integer, higher than zero, in Hz.
                // "boostFactor": 1.0    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
            },
            "low-pass": { // Cuts off frequencies higher than the specified {cutoffFrequency}.
                // "cutoffFrequency": 284, // Integer, higher than zero, in Hz.
                // "boostFactor": 1.24389    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
            },
            "normalization": { // Attenuates peaking where peaks are defined as having a higher value than {maxAmplitude}.
                // "maxAmplitude": 0.6327, // Float, within the range of 0.0 - 1.0. A value of 0.0 mutes the output.
                // "adaptive": true    // false
            },
            "echo": { // Self-explanatory; provides an echo effect.
                // "echoLength": 0.5649, // Float, higher than 0.0, in seconds (1.0 = 1 second).
                // "decay": 0.4649       // Float, within the range of 0.0 - 1.0. A value of 1.0 means no decay, and a value of 0.0 means
            },
        },
        channelMix: audioOutputsData.stereo,
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
    }
    /** The Player assigned to this Filter Manager */
    public player: Player;
    /** The Constructor for the FilterManager */
    constructor(player: Player) {
        /** Assign the player to the filter manager */
        this.player = player;
    }

    /**
     * Apply Player filters for lavalink filter sending data, if the filter is enabled / not
     */
    async applyPlayerFilters() {
        const sendData = { ...this.data } as LavalinkFilterData & { equalizer: EQBand[] };
        this.checkFiltersState();

        if (!this.filters.volume) delete sendData.volume;
        if (!this.filters.tremolo) delete sendData.tremolo;
        if (!this.filters.vibrato) delete sendData.vibrato;

        if (!this.filters.lavalinkFilterPlugin.echo) delete sendData.pluginFilters?.["lavalink-filter-plugin"]?.echo;
        if (!this.filters.lavalinkFilterPlugin.reverb) delete sendData.pluginFilters?.["lavalink-filter-plugin"]?.reverb;

        if (!this.filters.lavalinkLavaDspxPlugin.echo) delete sendData.pluginFilters?.echo;
        if (!this.filters.lavalinkLavaDspxPlugin.normalization) delete sendData.pluginFilters?.normalization;
        if (!this.filters.lavalinkLavaDspxPlugin.highPass) delete sendData.pluginFilters?.["high-pass"];
        if (!this.filters.lavalinkLavaDspxPlugin.lowPass) delete sendData.pluginFilters?.["low-pass"];

        if (sendData.pluginFilters?.["lavalink-filter-plugin"] && Object.values(sendData.pluginFilters?.["lavalink-filter-plugin"]).length === 0) delete sendData.pluginFilters["lavalink-filter-plugin"];
        if (sendData.pluginFilters && Object.values(sendData.pluginFilters).length === 0) delete sendData.pluginFilters;
        if (!this.filters.lowPass) delete sendData.lowPass;
        if (!this.filters.karaoke) delete sendData.karaoke;
        if (!this.filters.rotation) delete sendData.rotation;
        if (this.filters.audioOutput === "stereo") delete sendData.channelMix;

        if (Object.values(this.data.timescale).every(v => v === 1)) delete sendData.timescale;

        if (!this.player.node.sessionId) throw new Error("The Lavalink-Node is either not ready or not up to date");

        sendData.equalizer = [...this.equalizerBands];
        if (sendData.equalizer.length === 0) delete sendData.equalizer;

        for (const key of Object.keys(sendData)) {
            // delete disabled filters
            if (key === "pluginFilters") {
                // for(const key of [...Object.keys(sendData.pluginFilters)]) {
                //     // if (this.player.node.info && !this.player.node.info?.plugins?.find?.(v => v.name === key)) delete sendData[key];
                // }
            } else if (this.player.node.info && !this.player.node.info?.filters?.includes?.(key)) delete sendData[key];
        }

        const now = performance.now();

        if (this.player.options.instaUpdateFiltersFix === true) this.filterUpdatedState = true;

        await this.player.node.updatePlayer({
            guildId: this.player.guildId,
            playerOptions: {
                filters: sendData,
            }
        })

        this.player.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return;
    }

    /**
     * Checks if the filters are correctly stated (active / not-active)
     * @param oldFilterTimescale
     * @returns
     */
    checkFiltersState(oldFilterTimescale?: Partial<TimescaleFilter>) {
        this.filters.rotation = this.data.rotation.rotationHz !== 0;
        this.filters.vibrato = this.data.vibrato.frequency !== 0 || this.data.vibrato.depth !== 0;
        this.filters.tremolo = this.data.tremolo.frequency !== 0 || this.data.tremolo.depth !== 0;

        const lavalinkFilterData = (this.data.pluginFilters?.["lavalink-filter-plugin"] || { echo: { decay: this.data.pluginFilters?.echo?.decay && !this.data.pluginFilters?.echo?.echoLength ? this.data.pluginFilters.echo.decay : 0, delay: (this.data.pluginFilters?.echo as { decay: number, delay: number })?.delay || 0 }, reverb: { gains: [], delays: [], ...((this.data.pluginFilters as { reverb: { gains: number[], delays: number[] } }).reverb) } });
        this.filters.lavalinkFilterPlugin.echo = lavalinkFilterData.echo.decay !== 0 || lavalinkFilterData.echo.delay !== 0;
        this.filters.lavalinkFilterPlugin.reverb = lavalinkFilterData.reverb?.delays?.length !== 0 || lavalinkFilterData.reverb?.gains?.length !== 0;
        this.filters.lavalinkLavaDspxPlugin.highPass = Object.values(this.data.pluginFilters["high-pass"] || {}).length > 0;
        this.filters.lavalinkLavaDspxPlugin.lowPass = Object.values(this.data.pluginFilters["low-pass"] || {}).length > 0;
        this.filters.lavalinkLavaDspxPlugin.normalization = Object.values(this.data.pluginFilters.normalization || {}).length > 0;
        this.filters.lavalinkLavaDspxPlugin.echo = Object.values(this.data.pluginFilters.echo || {}).length > 0 && typeof (this.data.pluginFilters?.echo as { decay: number, delay: number })?.delay === "undefined";

        this.filters.lowPass = this.data.lowPass.smoothing !== 0;
        this.filters.karaoke = Object.values(this.data.karaoke).some(v => v !== 0);
        if ((this.filters.nightcore || this.filters.vaporwave) && oldFilterTimescale) {
            if (oldFilterTimescale.pitch !== this.data.timescale.pitch || oldFilterTimescale.rate !== this.data.timescale.rate || oldFilterTimescale.speed !== this.data.timescale.speed) {
                this.filters.custom = Object.values(this.data.timescale).some(v => v !== 1);
                this.filters.nightcore = false;
                this.filters.vaporwave = false;
            }
        }
        return true;
    }

    /**
     * Reset all Filters
     */
    public async resetFilters(): Promise<PlayerFilters> {
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
        this.filters.audioOutput = "stereo";
        // reset all filter datas
        for (const [key, value] of Object.entries({
            volume: 1,
            lowPass: {
                smoothing: 0
            },
            karaoke: {
                level: 0,
                monoLevel: 0,
                filterBand: 0,
                filterWidth: 0
            },
            timescale: {
                speed: 1, // 0 = x
                pitch: 1, // 0 = x
                rate: 1 // 0 = x
            },
            pluginFilters: {
                "lavalink-filter-plugin": {
                    echo: {
                        // delay: 0, // in seconds
                        // decay: 0 // 0 < 1
                    },
                    reverb: {
                        // delays: [], // [0.037, 0.042, 0.048, 0.053]
                        // gains: [] // [0.84, 0.83, 0.82, 0.81]
                    }
                },
                "high-pass": { // Cuts off frequencies lower than the specified {cutoffFrequency}.
                    // "cutoffFrequency": 1475, // Integer, higher than zero, in Hz.
                    // "boostFactor": 1.0    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
                },
                "low-pass": { // Cuts off frequencies higher than the specified {cutoffFrequency}.
                    // "cutoffFrequency": 284, // Integer, higher than zero, in Hz.
                    // "boostFactor": 1.24389    // Float, higher than 0.0. This alters volume output. A value of 1.0 means no volume change.
                },
                "normalization": { // Attenuates peaking where peaks are defined as having a higher value than {maxAmplitude}.
                    // "maxAmplitude": 0.6327, // Float, within the range of 0.0 - 1.0. A value of 0.0 mutes the output.
                    // "adaptive": true    // false
                },
                "echo": { // Self-explanatory; provides an echo effect.
                    // "echoLength": 0.5649, // Float, higher than 0.0, in seconds (1.0 = 1 second).
                    // "decay": 0.4649       // Float, within the range of 0.0 - 1.0. A value of 1.0 means no decay, and a value of 0.0 means
                },
            },
            rotation: {
                rotationHz: 0
            },
            tremolo: {
                frequency: 0, // 0 < x
                depth: 0 // 0 < x = 1
            },
            vibrato: {
                frequency: 0, // 0 < x = 14
                depth: 0      // 0 < x = 1
            },
            channelMix: audioOutputsData.stereo,
        } as FilterData)) {
            this.data[key] = value;
        }
        await this.applyPlayerFilters();
        return this.filters;
    }

    /**
     * Set the Filter Volume
     * @param volume
     * @returns
     */
    public async setVolume(volume: number) {
        if (volume < 0 || volume > 5) throw new SyntaxError("Volume-Filter must be between 0 and 5");

        this.data.volume = volume;

        await this.applyPlayerFilters();

        return this.filters.volume;
    }

    /**
     * Set the AudioOutput Filter
     * @param type
     * @returns
     */
    public async setAudioOutput(type: AudioOutputs): Promise<AudioOutputs> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("channelMix")) throw new Error("Node#Info#filters does not include the 'channelMix' Filter (Node has it not enable)")
        if (!type || !audioOutputsData[type]) throw "Invalid audio type added, must be 'mono' / 'stereo' / 'left' / 'right'"
        this.data.channelMix = audioOutputsData[type];
        this.filters.audioOutput = type;
        await this.applyPlayerFilters();
        return this.filters.audioOutput;
    }
    /**
     * Set custom filter.timescale#speed . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param speed
     * @returns
     */
    public async setSpeed(speed = 1): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("timescale")) throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)")
        // reset nightcore / vaporwave filter if enabled
        if (this.filters.nightcore || this.filters.vaporwave) {
            this.data.timescale.pitch = 1;
            this.data.timescale.speed = 1;
            this.data.timescale.rate = 1;
            this.filters.nightcore = false;
            this.filters.vaporwave = false;
        }

        this.data.timescale.speed = speed;

        // check if custom filter is active / not
        this.isCustomFilterActive();

        await this.applyPlayerFilters();
        return this.filters.custom;
    }
    /**
     * Set custom filter.timescale#pitch . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param speed
     * @returns
     */
    public async setPitch(pitch = 1): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("timescale")) throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)")
        // reset nightcore / vaporwave filter if enabled
        if (this.filters.nightcore || this.filters.vaporwave) {
            this.data.timescale.pitch = 1;
            this.data.timescale.speed = 1;
            this.data.timescale.rate = 1;
            this.filters.nightcore = false;
            this.filters.vaporwave = false;
        }

        this.data.timescale.pitch = pitch;


        // check if custom filter is active / not
        this.isCustomFilterActive();

        await this.applyPlayerFilters();
        return this.filters.custom;
    }
    /**
     * Set custom filter.timescale#rate . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal
     * @param speed
     * @returns
     */
    public async setRate(rate = 1): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("timescale")) throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)")
        // reset nightcore / vaporwave filter if enabled
        if (this.filters.nightcore || this.filters.vaporwave) {
            this.data.timescale.pitch = 1;
            this.data.timescale.speed = 1;
            this.data.timescale.rate = 1;
            this.filters.nightcore = false;
            this.filters.vaporwave = false;
        }

        this.data.timescale.rate = rate;

        // check if custom filter is active / not
        this.isCustomFilterActive();
        await this.applyPlayerFilters();
        return this.filters.custom;
    }
    /**
     * Enables / Disables the rotation effect, (Optional: provide your Own Data)
     * @param rotationHz
     * @returns
     */
    public async toggleRotation(rotationHz = 0.2): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("rotation")) throw new Error("Node#Info#filters does not include the 'rotation' Filter (Node has it not enable)")
        this.data.rotation.rotationHz = this.filters.rotation ? 0 : rotationHz;

        this.filters.rotation = !this.filters.rotation;

        await this.applyPlayerFilters();

        return this.filters.rotation;
    }

    /**
     * Enables / Disables the Vibrato effect, (Optional: provide your Own Data)
     * @param frequency
     * @param depth
     * @returns
     */
    public async toggleVibrato(frequency = 10, depth = 1): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("vibrato")) throw new Error("Node#Info#filters does not include the 'vibrato' Filter (Node has it not enable)")
        this.data.vibrato.frequency = this.filters.vibrato ? 0 : frequency;
        this.data.vibrato.depth = this.filters.vibrato ? 0 : depth;

        this.filters.vibrato = !this.filters.vibrato;
        await this.applyPlayerFilters();
        return this.filters.vibrato;
    }
    /**
     * Enables / Disables the Tremolo effect, (Optional: provide your Own Data)
     * @param frequency
     * @param depth
     * @returns
     */
    public async toggleTremolo(frequency = 4, depth = 0.8): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("tremolo")) throw new Error("Node#Info#filters does not include the 'tremolo' Filter (Node has it not enable)")
        this.data.tremolo.frequency = this.filters.tremolo ? 0 : frequency;
        this.data.tremolo.depth = this.filters.tremolo ? 0 : depth;

        this.filters.tremolo = !this.filters.tremolo;
        await this.applyPlayerFilters()
        return this.filters.tremolo;
    }
    /**
     * Enables / Disables the LowPass effect, (Optional: provide your Own Data)
     * @param smoothing
     * @returns
     */
    public async toggleLowPass(smoothing = 20): Promise<boolean> {

        if (this.player.node.info && !this.player.node.info?.filters?.includes("lowPass")) throw new Error("Node#Info#filters does not include the 'lowPass' Filter (Node has it not enable)")
        this.data.lowPass.smoothing = this.filters.lowPass ? 0 : smoothing;

        this.filters.lowPass = !this.filters.lowPass;
        await this.applyPlayerFilters();
        return this.filters.lowPass;
    }
    lavalinkLavaDspxPlugin = {

        /**
         * Enables / Disables the LowPass effect, (Optional: provide your Own Data)
         * @param boostFactor
         * @param cutoffFrequency
         * @returns
         */
        toggleLowPass: async (boostFactor = 1.0, cutoffFrequency = 80): Promise<boolean> => {
            if (this.player.node.info && !this.player.node.info?.plugins?.find(v => v.name === "lavadspx-plugin")) throw new Error("Node#Info#plugins does not include the lavadspx plugin")
            if (this.player.node.info && !this.player.node.info?.filters?.includes("low-pass")) throw new Error("Node#Info#filters does not include the 'low-pass' Filter (Node has it not enable)")

            if (!this.data) this.data = {};
            if (!this.data.pluginFilters) this.data.pluginFilters = {}
            if (!this.data.pluginFilters["low-pass"]) this.data.pluginFilters["low-pass"] = {};
            if (this.filters.lavalinkLavaDspxPlugin.lowPass) {
                delete this.data.pluginFilters["low-pass"]
            } else {
                this.data.pluginFilters["low-pass"] = {
                    boostFactor: boostFactor,
                    cutoffFrequency: cutoffFrequency
                }
            }
            this.filters.lavalinkLavaDspxPlugin.lowPass = !this.filters.lavalinkLavaDspxPlugin.lowPass;
            await this.applyPlayerFilters();
            return this.filters.lavalinkLavaDspxPlugin.lowPass;
        },

        /**
         * Enables / Disables the HighPass effect, (Optional: provide your Own Data)
         * @param boostFactor
         * @param cutoffFrequency
         * @returns
         */
        toggleHighPass: async (boostFactor = 1.0, cutoffFrequency = 80): Promise<boolean> => {
            if (this.player.node.info && !this.player.node.info?.plugins?.find(v => v.name === "lavadspx-plugin")) throw new Error("Node#Info#plugins does not include the lavadspx plugin")
            if (this.player.node.info && !this.player.node.info?.filters?.includes("high-pass")) throw new Error("Node#Info#filters does not include the 'high-pass' Filter (Node has it not enable)")

            if (!this.data) this.data = {};
            if (!this.data.pluginFilters) this.data.pluginFilters = {}
            if (!this.data.pluginFilters["high-pass"]) this.data.pluginFilters["high-pass"] = {};
            if (this.filters.lavalinkLavaDspxPlugin.highPass) {
                delete this.data.pluginFilters["high-pass"]
            } else {
                this.data.pluginFilters["high-pass"] = {
                    boostFactor: boostFactor,
                    cutoffFrequency: cutoffFrequency
                }
            }
            this.filters.lavalinkLavaDspxPlugin.highPass = !this.filters.lavalinkLavaDspxPlugin.highPass;
            await this.applyPlayerFilters();
            return this.filters.lavalinkLavaDspxPlugin.highPass;
        },

        /**
         * Enables / Disables the Normalization effect.
         * @param {number} [maxAmplitude=0.75] - The maximum amplitude of the audio.
         * @param {boolean} [adaptive=true] - Whether to use adaptive normalization or not.
         * @returns {Promise<boolean>} - The state of the filter after execution.
         */
        toggleNormalization: async (maxAmplitude: number = 0.75, adaptive: boolean = true): Promise<boolean> => {
            if (this.player.node.info && !this.player.node.info?.plugins?.find(v => v.name === "lavadspx-plugin")) throw new Error("Node#Info#plugins does not include the lavadspx plugin")
            if (this.player.node.info && !this.player.node.info?.filters?.includes("normalization")) throw new Error("Node#Info#filters does not include the 'normalization' Filter (Node has it not enable)")

            if (!this.data) this.data = {};
            if (!this.data.pluginFilters) this.data.pluginFilters = {}
            if (!this.data.pluginFilters.normalization) this.data.pluginFilters.normalization = {};
            if (this.filters.lavalinkLavaDspxPlugin.normalization) {
                delete this.data.pluginFilters.normalization
            } else {
                this.data.pluginFilters.normalization = {
                    adaptive: adaptive,
                    maxAmplitude: maxAmplitude
                }
            }
            this.filters.lavalinkLavaDspxPlugin.normalization = !this.filters.lavalinkLavaDspxPlugin.normalization;
            await this.applyPlayerFilters();
            return this.filters.lavalinkLavaDspxPlugin.normalization;
        },

        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param {number} [decay=0.5] - The decay of the echo effect.
         * @param {number} [echoLength=0.5] - The length of the echo effect.
         * @returns {Promise<boolean>} - The state of the filter after execution.
         */
        toggleEcho: async (decay: number = 0.5, echoLength: number = 0.5): Promise<boolean> => {
            if (this.player.node.info && !this.player.node.info?.plugins?.find(v => v.name === "lavadspx-plugin")) throw new Error("Node#Info#plugins does not include the lavadspx plugin")
            if (this.player.node.info && !this.player.node.info?.filters?.includes("echo")) throw new Error("Node#Info#filters does not include the 'echo' Filter (Node has it not enable)")

            if (!this.data) this.data = {};
            if (!this.data.pluginFilters) this.data.pluginFilters = {}
            if (!this.data.pluginFilters.echo) this.data.pluginFilters.echo = {};
            if (this.filters.lavalinkLavaDspxPlugin.echo) {
                delete this.data.pluginFilters.echo
            } else {
                this.data.pluginFilters.echo = {
                    decay: decay,
                    echoLength: echoLength
                }
            }
            this.filters.lavalinkLavaDspxPlugin.echo = !this.filters.lavalinkLavaDspxPlugin.echo;
            await this.applyPlayerFilters();
            return this.filters.lavalinkLavaDspxPlugin.echo;
        }
    }
    lavalinkFilterPlugin = {
        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param delay
         * @param decay
         * @returns
         */
        toggleEcho: async (delay = 4, decay = 0.8): Promise<boolean> => {
            if (this.player.node.info && !this.player.node.info?.plugins?.find(v => v.name === "lavalink-filter-plugin")) throw new Error("Node#Info#plugins does not include the lavalink-filter-plugin plugin")
            if (this.player.node.info && !this.player.node.info?.filters?.includes("echo")) throw new Error("Node#Info#filters does not include the 'echo' Filter (Node has it not enable aka not installed!)")

            if (!this.data) this.data = {};
            if (!this.data.pluginFilters) this.data.pluginFilters = {}
            if (!this.data.pluginFilters["lavalink-filter-plugin"]) this.data.pluginFilters["lavalink-filter-plugin"] = { echo: { decay: 0, delay: 0 }, reverb: { delays: [], gains: [] } };
            if (!this.data.pluginFilters["lavalink-filter-plugin"].echo) this.data.pluginFilters["lavalink-filter-plugin"].echo = { decay: 0, delay: 0 };

            this.data.pluginFilters["lavalink-filter-plugin"].echo.delay = this.filters.lavalinkFilterPlugin.echo ? 0 : delay;
            this.data.pluginFilters["lavalink-filter-plugin"].echo.decay = this.filters.lavalinkFilterPlugin.echo ? 0 : decay;

            this.filters.lavalinkFilterPlugin.echo = !this.filters.lavalinkFilterPlugin.echo;

            await this.applyPlayerFilters();
            return this.filters.lavalinkFilterPlugin.echo;
        },

        /**
         * Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
         * @param delays
         * @param gains
         * @returns
         */
        toggleReverb: async (delays = [0.037, 0.042, 0.048, 0.053], gains = [0.84, 0.83, 0.82, 0.81]): Promise<boolean> => {
            if (this.player.node.info && !this.player.node.info?.plugins?.find(v => v.name === "lavalink-filter-plugin")) throw new Error("Node#Info#plugins does not include the lavalink-filter-plugin plugin")
            if (this.player.node.info && !this.player.node.info?.filters?.includes("reverb")) throw new Error("Node#Info#filters does not include the 'reverb' Filter (Node has it not enable aka not installed!)")
            if (!this.data) this.data = {};
            if (!this.data.pluginFilters) this.data.pluginFilters = {}
            if (!this.data.pluginFilters["lavalink-filter-plugin"]) this.data.pluginFilters["lavalink-filter-plugin"] = { echo: { decay: 0, delay: 0 }, reverb: { delays: [], gains: [] } };
            if (!this.data.pluginFilters["lavalink-filter-plugin"].reverb) this.data.pluginFilters["lavalink-filter-plugin"].reverb = { delays: [], gains: [] };
            this.data.pluginFilters["lavalink-filter-plugin"].reverb.delays = this.filters.lavalinkFilterPlugin.reverb ? [] : delays;
            this.data.pluginFilters["lavalink-filter-plugin"].reverb.gains = this.filters.lavalinkFilterPlugin.reverb ? [] : gains;

            this.filters.lavalinkFilterPlugin.reverb = !this.filters.lavalinkFilterPlugin.reverb;
            await this.applyPlayerFilters();
            return this.filters.lavalinkFilterPlugin.reverb;
        }
    }
    /**
     * Enables / Disables a Nightcore-like filter Effect. Disables/Overrides both: custom and Vaporwave Filter
     * @param speed
     * @param pitch
     * @param rate
     * @returns
     */
    public async toggleNightcore(speed = 1.289999523162842, pitch = 1.289999523162842, rate = 0.9365999523162842): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("timescale")) throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)")
        this.data.timescale.speed = this.filters.nightcore ? 1 : speed;
        this.data.timescale.pitch = this.filters.nightcore ? 1 : pitch;
        this.data.timescale.rate = this.filters.nightcore ? 1 : rate;

        this.filters.nightcore = !this.filters.nightcore;
        this.filters.vaporwave = false;
        this.filters.custom = false;
        await this.applyPlayerFilters();
        return this.filters.nightcore;
    }
    /**
     * Enables / Disables a Vaporwave-like filter Effect. Disables/Overrides both: custom and nightcore Filter
     * @param speed
     * @param pitch
     * @param rate
     * @returns
     */
    public async toggleVaporwave(speed = 0.8500000238418579, pitch = 0.800000011920929, rate = 1): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("timescale")) throw new Error("Node#Info#filters does not include the 'timescale' Filter (Node has it not enable)")
        this.data.timescale.speed = this.filters.vaporwave ? 1 : speed;
        this.data.timescale.pitch = this.filters.vaporwave ? 1 : pitch;
        this.data.timescale.rate = this.filters.vaporwave ? 1 : rate;

        this.filters.vaporwave = !this.filters.vaporwave;
        this.filters.nightcore = false;
        this.filters.custom = false;
        await this.applyPlayerFilters();
        return this.filters.vaporwave;
    }
    /**
     * Enable / Disables a Karaoke like Filter Effect
     * @param level
     * @param monoLevel
     * @param filterBand
     * @param filterWidth
     * @returns
     */
    public async toggleKaraoke(level = 1, monoLevel = 1, filterBand = 220, filterWidth = 100): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("karaoke")) throw new Error("Node#Info#filters does not include the 'karaoke' Filter (Node has it not enable)")

        this.data.karaoke.level = this.filters.karaoke ? 0 : level;
        this.data.karaoke.monoLevel = this.filters.karaoke ? 0 : monoLevel;
        this.data.karaoke.filterBand = this.filters.karaoke ? 0 : filterBand;
        this.data.karaoke.filterWidth = this.filters.karaoke ? 0 : filterWidth;

        this.filters.karaoke = !this.filters.karaoke;
        await this.applyPlayerFilters();
        return this.filters.karaoke;
    }

    /** Function to find out if currently there is a custom timescamle etc. filter applied */
    public isCustomFilterActive(): boolean {
        this.filters.custom = !this.filters.nightcore && !this.filters.vaporwave && Object.values(this.data.timescale).some(d => d !== 1);
        return this.filters.custom;
    }
    /**
   * Sets the players equalizer band on-top of the existing ones.
   * @param bands
   */
    public async setEQ(bands: EQBand | EQBand[]): Promise<this> {
        if (!Array.isArray(bands)) bands = [bands];

        if (!bands.length || !bands.every((band) => safeStringify(Object.keys(band).sort()) === '["band","gain"]')) throw new TypeError("Bands must be a non-empty object array containing 'band' and 'gain' properties.");

        for (const { band, gain } of bands) this.equalizerBands[band] = { band, gain };

        if (!this.player.node.sessionId) throw new Error("The Lavalink-Node is either not ready or not up to date");

        const now = performance.now();

        if (this.player.options.instaUpdateFiltersFix === true) this.filterUpdatedState = true

        await this.player.node.updatePlayer({
            guildId: this.player.guildId,
            playerOptions: {
                filters: { equalizer: this.equalizerBands }
            }
        });

        this.player.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;

        return this;
    }

    /** Clears the equalizer bands. */
    public async clearEQ(): Promise<this> {
        return this.setEQ(Array.from({ length: 15 }, (_v, i) => ({ band: i, gain: 0 })));
    }
}
