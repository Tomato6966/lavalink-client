import { bandCampSearch } from "./CustomSearches/BandCampSearch";
import { EQBand, FilterData, FilterManager, LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { DefaultSources } from "./LavalinkManagerStatics";
import { LavalinkNode } from "./Node";
import { Queue, QueueSaver } from "./Queue";
import { PluginInfo, Track, UnresolvedTrack } from "./Track";
import { LavalinkPlayerVoiceOptions, SearchPlatform, SearchResult, LoadTypes, queueTrackEnd, LavaSearchType, LavaSearchResponse, LavaSrcSearchPlatformBase, LavaSearchQuery, SearchQuery } from "./Utils";

type PlayerDestroyReasons = "QueueEmpty" | "NodeDestroy" | "NodeDeleted" | "LavalinkNoVoice" | "NodeReconnectFail" | "PlayerReconnectFail" | "Disconnected" | "ChannelDeleted" | "ReconnectAllNodes" | "DisconnectAllNodes";
export type DestroyReasonsType = PlayerDestroyReasons | string;

export const DestroyReasons = {
    QueueEmpty: "QueueEmpty",
    NodeDestroy: "NodeDestroy",
    NodeDeleted: "NodeDeleted",
    LavalinkNoVoice: "LavalinkNoVoice",
    NodeReconnectFail: "NodeReconnectFail",
    Disconnected: "Disconnected",
    PlayerReconnectFail: "PlayerReconnectFail",
    ChannelDeleted: "ChannelDeleted",
    DisconnectAllNodes: "DisconnectAllNodes",
    ReconnectAllNodes: "ReconnectAllNodes"
} as Record<PlayerDestroyReasons, PlayerDestroyReasons>

export interface PlayerJson {
    guildId: string;
    options: PlayerOptions;
    voiceChannelId: string;
    textChannelId?: string;
    position: number;
    lastPosition: number;
    volume: number;
    lavalinkVolume: number;
    repeatMode: RepeatMode;
    paused: boolean;
    playing: boolean;
    createdTimeStamp?: number;
    filters: FilterData;
    ping: {
        ws: number;
        lavalink: number;
    }
    equalizer: EQBand[];
    nodeId?: string;
}

export type RepeatMode = "queue" | "track" | "off";
export interface PlayerOptions {
    guildId: string;
    voiceChannelId: string;
    
    volume?: number;
    vcRegion?: string;
    selfDeaf?: boolean;
    selfMute?: boolean;
    textChannelId?: string;
    node?: LavalinkNode|string;
    instaUpdateFiltersFix?:boolean;
    applyVolumeAsFilter?:boolean;
}

export interface PlayOptions {
    /** Which Track to play | don't provide, if it should pick from the Queue */
    track?: Track | UnresolvedTrack;
    /** Encoded Track to use, instead of the queue system... */
    encodedTrack?: string | null;
    /** Encoded Track to use&search, instead of the queue system (yt only)... */
    identifier?: string;
    /** The position to start the track. */
    position?: number;
    /** The position to end the track. */
    endTime?: number;
    /** Whether to not replace the track if a play payload is sent. */
    noReplace?: boolean;
    /** If to start "paused" */
    paused?: boolean;
    /** The Volume to start with */
    volume?: number;
    /** The Lavalink Filters to use | only with the new REST API */
    filters?: Partial<LavalinkFilterData>;
    voice?: LavalinkPlayerVoiceOptions;
}


export interface Player {
    filterManager: FilterManager;
    LavalinkManager: LavalinkManager;
    options: PlayerOptions;
    node: LavalinkNode;
    queue: Queue,
}

export class Player {
    /** The Guild Id of the Player */
    public guildId: string;
    /** The Voice Channel Id of the Player */
    public voiceChannelId: string | null = null;
    /** The Text Channel Id of the Player */
    public textChannelId: string | null = null;
    /** States if the Bot is supposed to be outputting audio */
    public playing: boolean = false;
    /** States if the Bot is paused or not */
    public paused: boolean = false;
    /** Repeat Mode of the Player */
    public repeatMode: RepeatMode = "off";
    /** Player's ping */
    public ping = { 
        /* Response time for rest actions with Lavalink Server */
        lavalink: 0, 
        /* Latency of the Discord's Websocket Voice Server */
        ws: 0
    };

    /** The Display Volume */
    public volume: number = 100;
    /** The Volume Lavalink actually is outputting */
    public lavalinkVolume: number = 100;

    /** The current Positin of the player (Calculated) */
    public position: number = 0;
    /** The current Positin of the player (from Lavalink) */
    public lastPosition: number = 0;

    /** When the player was created [Timestamp in Ms] (from lavalink) */
    public createdTimeStamp: number;
    /** The Player Connection's State (from Lavalink) */
    public connected: boolean|undefined = false;
    /** Voice Server Data (from Lavalink) */
    public voice: LavalinkPlayerVoiceOptions = {
        endpoint: null,
        sessionId: null,
        token: null
    };

    private readonly data: Record<string, unknown> = {};
    
    /**
     * Create a new Player
     * @param options 
     * @param LavalinkManager 
     */
    constructor(options: PlayerOptions, LavalinkManager:LavalinkManager) {
        this.options = options;
        this.filterManager = new FilterManager(this);
        this.LavalinkManager = LavalinkManager;
        
        this.guildId = this.options.guildId;
        this.voiceChannelId = this.options.voiceChannelId;
        this.textChannelId = this.options.textChannelId || null;

        this.node = typeof this.options.node === "string" ? this.LavalinkManager.nodeManager.nodes.get(this.options.node) : this.options.node;

        if(!this.node || typeof this.node.request !== "function") {
            const least = this.LavalinkManager.nodeManager.leastUsedNodes();
            this.node = least.filter(v => options.vcRegion ? v.options?.regions?.includes(options.vcRegion) : true)[0] || least[0] || null;
        }
        if(!this.node) throw new Error("No available Node was found, please add a LavalinkNode to the Manager via Manager.NodeManager#createNode")
        
        if(typeof options.volume === "number" && !isNaN(options.volume)) this.volume = Number(options.volume);
        
        this.volume = Math.round(Math.max(Math.min(this.volume, 1000), 0));
        
        this.lavalinkVolume = Math.round(Math.max(Math.min(Math.round(
            this.LavalinkManager.options.playerOptions.volumeDecrementer
            ? this.volume * this.LavalinkManager.options.playerOptions.volumeDecrementer
            : this.volume), 1000), 0));

        this.LavalinkManager.emit("playerCreate", this);

        this.queue = new Queue(this.guildId, {}, new QueueSaver(this.LavalinkManager.options.queueOptions), this.LavalinkManager.options.queueOptions)
    }

    /**
     * Set custom data.
     * @param key
     * @param value
     */
    public set(key: string, value: unknown): void { 
        this.data[key] = value; 
        return;
    }

    /**
     * Get custom data.
     * @param key
     */
    public get<T>(key: string): T { 
        return this.data[key] as T;
    }

    /**
     * CLears all the custom data.
     */
    public clearData(): void {
        const toKeep = Object.keys(this.data).filter(v => v.startsWith("internal_"));
        for(const key in this.data) {
            if(toKeep.includes(key)) continue;
            delete this.data[key];
        }
        return;
    }

    /**
     * Get all custom Data
     */
    public getAllData(): Record<string, unknown> { 
        return Object.fromEntries(Object.entries(this.data).filter(v => !v[0].startsWith("internal_")));
    }

    /**
     * Play the next track from the queue / a specific track, with playoptions for Lavalink
     * @param options 
     */
    async play(options?: Partial<PlayOptions>) {
        if(this.get("internal_queueempty")) {
            clearTimeout(this.get("internal_queueempty"));
            this.set("internal_queueempty", undefined);
        }

        if(options?.track && (this.LavalinkManager.utils.isTrack(options?.track) || this.LavalinkManager.utils.isUnresolvedTrack(options.track))) {
            if(this.LavalinkManager.utils.isUnresolvedTrack(options.track)) await (options.track as UnresolvedTrack).resolve(this);
            await this.queue.add(options?.track, 0);
            await queueTrackEnd(this);
        }
        if(!this.queue.current && this.queue.tracks.length) await queueTrackEnd(this);

        if(this.queue.current && this.LavalinkManager.utils.isUnresolvedTrack(this.queue.current)) {
            try { 
                // resolve the unresolved track
                await (this.queue.current as unknown as UnresolvedTrack).resolve(this);
            } catch (error) {
                this.LavalinkManager.emit("trackError", this, this.queue.current, error);
                if(options && "track" in options) delete options.track;
                if(options && "encodedTrack" in options) delete options.encodedTrack;
                if (this.queue.tracks[0]) return this.play(options);
                return;
            }
        }

        const track = this.queue.current;
        if(!track) throw new Error(`There is no Track in the Queue, nor provided in the PlayOptions`);
        
        if (typeof options?.volume === "number" && !isNaN(options?.volume)) {
            this.volume = Math.max(Math.min(options?.volume, 500), 0);
            let vol = Number(this.volume);
            if (this.LavalinkManager.options.playerOptions.volumeDecrementer) vol *= this.LavalinkManager.options.playerOptions.volumeDecrementer;
            this.lavalinkVolume = Math.round(vol);
            options.volume = this.lavalinkVolume;
        }

        const finalOptions = {
            encodedTrack: track.encoded,
            volume: this.lavalinkVolume,
            position: 0,
            ...options,
        } as Partial<PlayOptions>;

        if("track" in finalOptions) delete finalOptions.track;
       
        if((typeof finalOptions.position !== "undefined" && isNaN(finalOptions.position)) || (typeof finalOptions.position === "number" && (finalOptions.position < 0 || finalOptions.position >= track.info.duration))) throw new Error("PlayerOption#position must be a positive number, less than track's duration");
        if((typeof finalOptions.volume !== "undefined" && isNaN(finalOptions.volume) || (typeof finalOptions.volume === "number" && finalOptions.volume < 0))) throw new Error("PlayerOption#volume must be a positive number");
        if((typeof finalOptions.endTime !== "undefined" && isNaN(finalOptions.endTime)) || (typeof finalOptions.endTime === "number" && (finalOptions.endTime < 0 || finalOptions.endTime >= track.info.duration))) throw new Error("PlayerOption#endTime must be a positive number, less than track's duration");
        if(typeof finalOptions.position === "number" && typeof finalOptions.endTime === "number" && finalOptions.endTime < finalOptions.position) throw new Error("PlayerOption#endTime must be bigger than PlayerOption#position")
        if("noReplace" in finalOptions) delete finalOptions.noReplace
        
        const now = performance.now();
        await this.node.updatePlayer({
            guildId: this.guildId,
            noReplace: options?.noReplace ?? false,
            playerOptions: finalOptions,
        });
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
    }

    /**
     * Set the Volume for the Player
     * @param volume The Volume in percent
     * @param ignoreVolumeDecrementer If it should ignore the volumedecrementer option
     */
    async setVolume(volume:number, ignoreVolumeDecrementer:boolean = false) {
        volume = Number(volume);

        if (isNaN(volume)) throw new TypeError("Volume must be a number.");
        
        this.volume = Math.round(Math.max(Math.min(volume, 1000), 0));
        
        this.lavalinkVolume = Math.round(Math.max(Math.min(Math.round(
            this.LavalinkManager.options.playerOptions.volumeDecrementer && !ignoreVolumeDecrementer
            ? this.volume * this.LavalinkManager.options.playerOptions.volumeDecrementer
            : this.volume), 1000), 0));

        const now = performance.now();
        if(this.LavalinkManager.options.playerOptions.applyVolumeAsFilter) {
            await this.node.updatePlayer({ guildId: this.guildId, playerOptions: { filters: { volume: this.lavalinkVolume / 100 } } });
        } else {
            await this.node.updatePlayer({ guildId: this.guildId, playerOptions: { volume: this.lavalinkVolume } });
        }
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return;
    }

    async lavaSearch(query:LavaSearchQuery, requestUser: unknown) {
        return this.node.lavaSearch(query, requestUser);
    }

    /**
     * 
     * @param query Query for your data
     * @param requestUser 
     */
    async search(query: SearchQuery, requestUser: unknown) {
        const Query = this.LavalinkManager.utils.transformQuery(query);
        
        if(/^https?:\/\//.test(Query.query)) this.LavalinkManager.utils.validateQueryString(this.node, Query.source);
        else if(Query.source) this.LavalinkManager.utils.validateSourceString(this.node, Query.source);
        
        if(["bcsearch", "bandcamp"].includes(Query.source)) return await bandCampSearch(this, Query.query, requestUser);

        return this.node.search(Query, requestUser);
    }

    /**
     * Pause the player
     */
    async pause() {
        if(this.paused && !this.playing) throw new Error("Player is already paused - not able to pause.");
        this.paused = true;
        const now = performance.now();
        await this.node.updatePlayer({ guildId: this.guildId, playerOptions: { paused: true } });
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return;
    }
    
    /**
     * Resume the Player
     */
    async resume() {
        if(!this.paused) throw new Error("Player isn't paused - not able to resume.");
        this.paused = false;
        const now = performance.now();
        await this.node.updatePlayer({ guildId: this.guildId, playerOptions: { paused: false } });
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return;
    }

    /**
     * Seek to a specific Position
     * @param position 
     */
    async seek(position:number) {
        if(!this.queue.current) return undefined;
        
        position = Number(position);
        
        if(isNaN(position)) throw new RangeError("Position must be a number.");
        
        if(!this.queue.current.info.isSeekable || this.queue.current.info.isStream) throw new RangeError("Current Track is not seekable / a stream");
        
        if(position < 0 || position > this.queue.current.info.duration) position = Math.max(Math.min(position, this.queue.current.info.duration), 0);
        
        this.position = position;
        
        this.lastPosition = position;

        const now = performance.now();
        await this.node.updatePlayer({ guildId:this.guildId, playerOptions: { position }});
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;

        return;
    }

    /**
     * Set the Repeatmode of the Player
     * @param repeatMode 
     */
    async setRepeatMode(repeatMode:RepeatMode) {
        if(!["off", "track", "queue"].includes(repeatMode)) throw new RangeError("Repeatmode must be either 'off', 'track', or 'queue'");
        return this.repeatMode = repeatMode;
    }

    /**
     * Skip the current song, or a specific amount of songs
     * @param amount provide the index of the next track to skip to
     */
    async skip(skipTo:number = 0) {
        if(!this.queue.tracks.length) throw new RangeError("Can't skip more than the queue size");

        if(typeof skipTo === "number" && skipTo > 1) {
            if(skipTo > this.queue.tracks.length) throw new RangeError("Can't skip more than the queue size");
            await this.queue.splice(0, skipTo - 1);
        }
        if(!this.playing) return await this.play();

        const now = performance.now();
        await this.node.updatePlayer({ guildId:this.guildId, playerOptions: { encodedTrack: null }});
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return true;
    }

    /**
     * Connects the Player to the Voice Channel
     * @returns 
     */
    public async connect() {
        if(!this.options.voiceChannelId) throw new RangeError("No Voice Channel id has been set.");

        await this.LavalinkManager.options.sendToShard(this.guildId, {
            op: 4,
            d: {
                guild_id: this.guildId,
                channel_id: this.options.voiceChannelId,
                self_mute: this.options.selfMute ?? false,
                self_deaf: this.options.selfDeaf ?? true,
            }
        });

        return;
    }

    /**
     * Disconnects the Player from the Voice Channel, but keeps the player in the cache
     * @param force If false it throws an error, if player thinks it's already disconnected
     * @returns
     */
    public async disconnect(force:boolean = false) {
        if(!force && !this.options.voiceChannelId) throw new RangeError("No Voice Channel id has been set.");

        await this.LavalinkManager.options.sendToShard(this.guildId, {
            op: 4,
            d: {
                guild_id: this.guildId,
                channel_id: null,
                self_mute: false,
                self_deaf: false,
            }
        });

        this.voiceChannelId = null;

        return;
    }
    
    /**
     * Destroy the player and disconnect from the voice channel
     */
    public async destroy(reason?:string) {
        await this.disconnect(true);

        await this.queue.utils.destroy();

        this.LavalinkManager.deletePlayer(this.guildId);

        await this.node.destroyPlayer(this.guildId);

        this.LavalinkManager.emit("playerDestroy", this, reason);
        return;
    }

    /**
     * Move the player on a different Audio-Node
     * @param newNode New Node / New Node Id 
     */
    public async changeNode(newNode: LavalinkNode | string) {
        const updateNode = typeof newNode === "string" ? this.LavalinkManager.nodeManager.nodes.get(newNode) : newNode;
        if(!updateNode) throw new Error("Could not find the new Node");

        const data = this.toJSON();

        await this.node.destroyPlayer(this.guildId);
        
        this.node = updateNode;

        const now = performance.now();

        await this.node.updatePlayer({
            guildId: this.guildId,
            noReplace: false,
            playerOptions: {
                position: data.position,
                volume: Math.round(Math.max(Math.min(data.volume, 1000), 0)),
                paused: data.paused,
                filters: { ...data.filters, equalizer: data.equalizer },
                voice: this.voice,
                // track: this.queue.current,
            },
        });

        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        
        return this.node.id;
    }

    /** Converts the Player including Queue to a Json state */
    public toJSON() {
        return {
            guildId: this.guildId,
            options: this.options,
            voiceChannelId: this.voiceChannelId,
            textChannelId: this.textChannelId,
            position: this.position,
            lastPosition: this.lastPosition,
            volume: this.volume,
            lavalinkVolume: this.lavalinkVolume,
            repeatMode: this.repeatMode,
            paused: this.paused,
            playing: this.playing,
            createdTimeStamp: this.createdTimeStamp,
            filters: this.filterManager?.data || {},
            equalizer: this.filterManager?.equalizerBands || [],
            nodeId: this.node?.id,
            ping: this.ping,
        } as PlayerJson
    }
}
