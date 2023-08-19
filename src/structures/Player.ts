import { EQBand, FilterData, FilterManager, LavalinkFilterData } from "./Filters";
import { LavalinkManager } from "./LavalinkManager";
import { DefaultSources } from "./LavalinkManagerStatics";
import { LavalinkNode } from "./Node";
import { Queue, QueueSaver } from "./Queue";
import { PluginInfo, Track, UnresolvedTrack } from "./Track";
import { LavalinkPlayerVoiceOptions, SearchPlatform, SearchResult, LoadTypes, queueTrackEnd, LavaSearchType, LavaSearchResponse, LavaSrcSearchPlatformBase } from "./Utils";

type PlayerDestroyReasons = "QueueEmpty" | "NodeDestroy" | "NodeDeleted" | "LavalinkNoVoice" | "NodeReconnectFail" | "PlayerReconnectFail" | "Disconnected" | "ChannelDeleted";
export type DestroyReasonsType = PlayerDestroyReasons | string;

export const DestroyReasons = {
    QueueEmpty: "QueueEmpty",
    NodeDestroy: "NodeDestroy",
    NodeDeleted: "NodeDeleted",
    LavalinkNoVoice: "LavalinkNoVoice",
    NodeReconnectFail: "NodeReconnectFail",
    Disconnected: "Disconnected",
    PlayerReconnectFail: "PlayerReconnectFail",
    ChannelDeleted: "ChannelDeleted"
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
       
        if(this.LavalinkManager.options.playerOptions.volumeDecrementer) this.volume *= this.LavalinkManager.options.playerOptions.volumeDecrementer;
        
        this.LavalinkManager.emit("playerCreate", this);
        if(typeof options.volume === "number" && !isNaN(options.volume)) this.setVolume(options.volume);

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
            this.lavalinkVolume = Math.floor(vol * 100) / 100;
            options.volume = vol;
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
        this.volume = Math.max(Math.min(volume, 500), 0);
        
        volume = Number(this.volume);
        if(this.LavalinkManager.options.playerOptions.volumeDecrementer && !ignoreVolumeDecrementer) volume *= this.LavalinkManager.options.playerOptions.volumeDecrementer;
        this.lavalinkVolume = Math.floor(volume * 100) / 100;

        const now = performance.now();
        if(this.LavalinkManager.options.playerOptions.applyVolumeAsFilter) {
            await this.node.updatePlayer({ guildId: this.guildId, playerOptions: { filters: { volume: volume / 100 } } });
        } else {
            await this.node.updatePlayer({ guildId: this.guildId, playerOptions: { volume } });
        }
        this.ping.lavalink = Math.round((performance.now() - now) / 10) / 100;
        return;
    }

    async lavaSearch(query: { query: string, source: LavaSrcSearchPlatformBase, types?: LavaSearchType[] }, requestUser: unknown) {
        // transform the query object
        const Query = { 
            query: typeof query === "string" ? query : query.query, 
            types: query.types ? ["track", "playlist", "artist", "album", "text"].filter(v => query.types?.find(x => x.toLowerCase().startsWith(v))) : ["track", "playlist", "artist", "album", "text"],
            source: DefaultSources[(typeof query === "string" ? undefined : query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager.options.playerOptions.defaultSearchPlatform.toLowerCase()] ?? (typeof query === "string" ? undefined : query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager.options.playerOptions.defaultSearchPlatform 
        }

        // if user does player.search("ytsearch:Hello")
        const foundSource = Object.keys(DefaultSources).find(source => Query.query.toLowerCase().startsWith(`${source}:`.toLowerCase()))?.trim?.()?.toLowerCase?.() as SearchPlatform | undefined;
        if(foundSource && DefaultSources[foundSource]){
            Query.source = DefaultSources[foundSource]; // set the source to ytsearch:
            Query.query = Query.query.slice(`${foundSource}:`.length, Query.query.length); // remove ytsearch: from the query
        }

        if(Query.source) this.LavalinkManager.utils.validateSourceString(this.node, Query.source);
        if(!["spsearch", "sprec", "amsearch", "dzsearch", "dzisrc", "ytmsearch", "ytsearch"].includes(Query.source)) throw new SyntaxError(`Query.source must be a source from LavaSrc: "spsearch" | "sprec" | "amsearch" | "dzsearch" | "dzisrc" | "ytmsearch" | "ytsearch"`)
        
        if(/^https?:\/\//.test(Query.query)) return await this.search({ query: Query.query, source: Query.source }, requestUser);


        if(!this.node.info.plugins.find(v => v.name === "lavasearch-plugin")) throw new RangeError(`there is no lavasearch-plugin available in the lavalink node: ${this.node.id}`);

        const res = await this.node.request(`/loadsearch?query=${Query.source ? `${Query.source}:` : ""}${encodeURIComponent(Query.query)}${Query.types?.length ? `&types=${Query.types.join(",")}`: ""}`) as LavaSearchResponse;
        return {
            tracks: res.tracks?.map(v => this.LavalinkManager.utils.buildTrack(v, requestUser)) || [],
            albums: res.albums?.map(v => ({info: v.info, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            artists: res.artists?.map(v => ({info: v.info, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            playlists: res.playlists?.map(v => ({info: v.info, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo, tracks: v.tracks.map(v => this.LavalinkManager.utils.buildTrack(v, requestUser)) })) || [],
            texts: res.texts?.map(v => ({text: v.text, pluginInfo: (v as unknown as { plugin: unknown })?.plugin || v.pluginInfo })) || [],
            pluginInfo: res.pluginInfo || (res as unknown as { plugin: unknown })?.plugin
        } as LavaSearchResponse
    }
    /**
     * 
     * @param query Query for your data
     * @param requestUser 
     */
    async search(query: { query: string, source?: SearchPlatform } | string, requestUser: unknown) {
        // transform the query object
        const Query = { 
            query: typeof query === "string" ? query : query.query, 
            source: DefaultSources[(typeof query === "string" ? undefined : query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager.options.playerOptions.defaultSearchPlatform.toLowerCase()] ?? (typeof query === "string" ? undefined : query.source?.trim?.()?.toLowerCase?.()) ?? this.LavalinkManager.options.playerOptions.defaultSearchPlatform 
        }
        
        // if user does player.search("ytsearch:Hello")
        const foundSource = Object.keys(DefaultSources).find(source => Query.query?.toLowerCase?.()?.startsWith(`${source}:`.toLowerCase()))?.trim?.()?.toLowerCase?.() as SearchPlatform | undefined;
        if(foundSource && DefaultSources[foundSource]){
            Query.source = DefaultSources[foundSource]; // set the source to ytsearch:
            Query.query = Query.query.slice(`${foundSource}:`.length, Query.query.length); // remove ytsearch: from the query
        }
        if(/^https?:\/\//.test(Query.query)) this.LavalinkManager.utils.validateQueryString(this.node, Query.source);
        else if(Query.source) this.LavalinkManager.utils.validateSourceString(this.node, Query.source);

        // ftts query parameters: ?voice=Olivia&audio_format=ogg_opus&translate=False&silence=1000&speed=1.0 | example raw get query: https://api.flowery.pw/v1/tts?voice=Olivia&audio_format=ogg_opus&translate=False&silence=0&speed=1.0&text=Hello%20World
        // request the data 
        const res = await this.node.request(`/loadtracks?identifier=${!/^https?:\/\//.test(Query.query) ? `${Query.source}:${Query.source === "ftts" ? "//" : ""}` : ""}${encodeURIComponent(Query.query)}`) as {
            loadType: LoadTypes,
            data: any,
            pluginInfo: PluginInfo,
        };


        // transform the data which can be Error, Track or Track[] to enfore [Track] 
        const resTracks = res.loadType === "playlist" ? res.data?.tracks : res.loadType === "track" ? [res.data] : res.loadType === "search" ? Array.isArray(res.data) ? res.data : [res.data] : [];

        return {
            loadType: res.loadType,
            exception: res.loadType === "error" ? res.data : null,
            pluginInfo: res.pluginInfo || {},
            playlist: res.loadType === "playlist" ? {
                title: res.data.info?.name || res.data.pluginInfo?.name || null,
                author: res.data.info?.author || res.data.pluginInfo?.author || null,
                thumbnail: (res.data.info?.artworkUrl) || (res.data.pluginInfo?.artworkUrl) || ((typeof res.data?.info?.selectedTrack !== "number" || res.data?.info?.selectedTrack === -1) ? null : resTracks[res.data?.info?.selectedTrack] ? (resTracks[res.data?.info?.selectedTrack]?.info?.artworkUrl || resTracks[res.data?.info?.selectedTrack]?.info?.pluginInfo?.artworkUrl) : null) || null,
                uri: res.data.info?.url || res.data.info?.uri || res.data.info?.link || res.data.pluginInfo?.url || res.data.pluginInfo?.uri || res.data.pluginInfo?.link || null,
                selectedTrack: typeof res.data?.info?.selectedTrack !== "number" || res.data?.info?.selectedTrack === -1 ? null : resTracks[res.data?.info?.selectedTrack] ? this.LavalinkManager.utils.buildTrack(resTracks[res.data?.info?.selectedTrack], requestUser) : null,
                duration: resTracks.length ? resTracks.reduce((acc, cur) => acc + (cur?.info?.duration || 0), 0) : 0,
            } : null,
            tracks: resTracks.length ? resTracks.map(t => this.LavalinkManager.utils.buildTrack(t, requestUser)) : []
        } as SearchResult;
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
        await this.connect();

        const now = performance.now();
        await this.node.updatePlayer({
            guildId: this.guildId,
            noReplace: false,
            playerOptions: {
                position: data.position,
                volume: data.volume,
                paused: data.paused,
                filters: { ...data.filters, equalizer: data.equalizer },
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
