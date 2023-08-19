import { Player } from "./Player";
import { FloatNumber, IntegerNumber } from "./Utils";

/**
 * The FilterManager for each player
 */
export class FilterManager {
    /** The Equalizer bands currently applied to the Lavalink Server */
    public equalizerBands: EQBand[] = [];
    /** Private Util for the instaFix Filters option */
    public filterUpdatedState: number = 0;
    /** All "Active" / "disabled" Player Filters */
    public filters: PlayerFilters = {
        volume: false,
        vaporwave: false,
        custom: false,
        nightcore: false,
        echo: false,
        reverb: false,
        rotation: false,
        karaoke: false,
        tremolo: false,
        vibrato: false,
        lowPass: false,
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
        echo: {
            delay: 0,
            decay: 0
        },
        reverb: {
            delay: 0,
            decay: 0
        },
        rotation: {
            rotationHz: 0
        },
        tremolo: {
            frequency: 0, // 0 < x
            depth: 0// 0 < x = 1
        },
        vibrato: {
            frequency: 0, // 0 < x = 14
            depth: 0     // 0 < x = 1
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

        if (!this.filters.volume) delete sendData.volume;
        if (!this.filters.tremolo) delete sendData.tremolo;
        if (!this.filters.vibrato) delete sendData.vibrato;
        //if(!this.filters.karaoke) delete sendData.karaoke;
        if (!this.filters.echo) delete sendData.echo;
        if (!this.filters.reverb) delete sendData.reverb;
        if (!this.filters.lowPass) delete sendData.lowPass;
        if (!this.filters.karaoke) delete sendData.karaoke;
        //if(!this.filters.rotating) delete sendData.rotating;
        if (this.filters.audioOutput === "stereo") delete sendData.channelMix;

        if (!this.player.node.sessionId) throw new Error("The Lavalink-Node is either not ready or not up to date");

        sendData.equalizer = [...this.equalizerBands];
        for (const key of [...Object.keys(sendData)]) {
            // delete disabled filters
            if (this.player.node.info && !this.player.node.info?.filters?.includes?.(key)) delete sendData[key];
        }

        const now = performance.now();
        await this.player.node.updatePlayer({
            guildId: this.player.guildId,
            playerOptions: {
                filters: sendData,
            }
        })
        this.player.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        if (this.player.options.instaUpdateFiltersFix === true) this.filterUpdatedState = 1;
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
        this.filters.echo = this.data.echo.decay !== 0 || this.data.echo.delay !== 0;
        this.filters.reverb = this.data.reverb.decay !== 0 || this.data.reverb.delay !== 0;
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
        this.filters.echo = false;
        this.filters.reverb = false;
        this.filters.nightcore = false;
        this.filters.lowPass = false;
        this.filters.rotation = false;
        this.filters.tremolo = false;
        this.filters.vibrato = false;
        this.filters.karaoke = false;
        this.filters.karaoke = false;
        this.filters.volume = false;
        this.filters.audioOutput = "stereo";
        // disable all filters
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
            echo: {
                delay: 0,
                decay: 0
            },
            reverb: {
                delay: 0,
                decay: 0
            },
            rotation: {
                rotationHz: 0
            },
            tremolo: {
                frequency: 2, // 0 < x
                depth: 0.1 // 0 < x = 1
            },
            vibrato: {
                frequency: 2, // 0 < x = 14
                depth: 0.1      // 0 < x = 1
            },
            channelMix: audioOutputsData.stereo,
        })) {
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
     * Enabels / Disables the rotation effect, (Optional: provide your Own Data)
     * @param rotationHz
     * @returns 
     */
    public async toggleRotation(rotationHz = 0.2): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("rotation")) throw new Error("Node#Info#filters does not include the 'rotation' Filter (Node has it not enable)")
        this.data.rotation.rotationHz = this.filters.rotation ? 0 : rotationHz;

        this.filters.rotation = !this.filters.rotation;

        return await this.applyPlayerFilters(), this.filters.rotation;
    }

    /**
     * Enabels / Disables the Vibrato effect, (Optional: provide your Own Data)
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
     * Enabels / Disables the Tremolo effect, (Optional: provide your Own Data)
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
     * Enabels / Disables the LowPass effect, (Optional: provide your Own Data)
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
    /**
     * Enabels / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
     * @param delay
     * @param decay
     * @returns 
     */
    public async toggleEcho(delay = 1, decay = 0.5): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("echo")) throw new Error("Node#Info#filters does not include the 'echo' Filter (Node has it not enable aka not installed!)")
        this.data.echo.delay = this.filters.echo ? 0 : delay;
        this.data.echo.decay = this.filters.echo ? 0 : decay;

        this.filters.echo = !this.filters.echo;
        await this.applyPlayerFilters();
        return this.filters.echo;
    }
    /**
     * Enabels / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data)
     * @param delay
     * @param decay
     * @returns 
     */
    public async toggleReverb(delay = 1, decay = 0.5): Promise<boolean> {
        if (this.player.node.info && !this.player.node.info?.filters?.includes("reverb")) throw new Error("Node#Info#filters does not include the 'reverb' Filter (Node has it not enable aka not installed!)")
        this.data.reverb.delay = this.filters.reverb ? 0 : delay;
        this.data.reverb.decay = this.filters.reverb ? 0 : decay;

        this.filters.reverb = !this.filters.reverb;
        await this.applyPlayerFilters();
        return this.filters.reverb;
    }
    /**
     * Enables / Disabels a Nightcore-like filter Effect. Disables/Overwrides both: custom and Vaporwave Filter
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
     * Enables / Disabels a Vaporwave-like filter Effect. Disables/Overwrides both: custom and nightcore Filter
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

        if (!bands.length || !bands.every((band) => JSON.stringify(Object.keys(band).sort()) === '["band","gain"]')) throw new TypeError("Bands must be a non-empty object array containing 'band' and 'gain' properties.");

        for (const { band, gain } of bands) this.equalizerBands[band] = { band, gain };

        if (!this.player.node.sessionId) throw new Error("The Lavalink-Node is either not ready or not up to date");

        const now = performance.now();

        await this.player.node.updatePlayer({
            guildId: this.player.guildId,
            playerOptions: {
                filters: { equalizer: this.equalizerBands }
            }
        });

        this.player.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;

        if (this.player.options.instaUpdateFiltersFix === true) this.filterUpdatedState = 1;

        return this;
    }

    /** Clears the equalizer bands. */
    public async clearEQ(): Promise<this> {
        return this.setEQ(new Array(15).fill(0.0).map((gain:FloatNumber, band:IntegerNumber) => ({ band, gain })));
    }
}

/** The Audio Outputs type */
export type AudioOutputs = "mono" | "stereo" | "left" | "right";

/**  The audio Outputs Data map declaration */
export const audioOutputsData:Record<AudioOutputs, ChannelMixFilter> = {
    mono: { // totalLeft: 1, totalRight: 1
        leftToLeft: 0.5, //each channel should in total 0 | 1, 0 === off, 1 === on, 0.5+0.5 === 1
        leftToRight: 0.5,
        rightToLeft: 0.5,
        rightToRight: 0.5,
    },
    stereo: { // totalLeft: 1, totalRight: 1
        leftToLeft: 1,
        leftToRight: 0,
        rightToLeft: 0,
        rightToRight: 1,
    },
    left: { // totalLeft: 1, totalRight: 0
        leftToLeft: 1,
        leftToRight: 0,
        rightToLeft: 1,
        rightToRight: 0,
    },
    right: { // totalLeft: 0, totalRight: 1
        leftToLeft: 0,
        leftToRight: 1,
        rightToLeft: 0,
        rightToRight: 1,
    },
}

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
    /** only with the custom lavalink filter plugin */
    echo: boolean;
    /** only with the custom lavalink filter plugin */
    reverb: boolean;
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
    band: IntegerNumber;
    /** The gain (-0.25 to 1.0) */
    gain: FloatNumber;
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
 * A Plugin Filter
 */
export interface EchoFilter {
    delay: number
    decay: number
}
/**
 * A Plugin Filter
 */
export interface ReverbFilter {
    delay: number
    decay: number
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
    echo: EchoFilter,
    reverb: ReverbFilter,
}
/** 
 * Actual Filter Data sent to Lavalink
 */
export interface LavalinkFilterData extends FilterData {
    equalizer?: EQBand[];
}


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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
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
    ] as EQBand[],
}