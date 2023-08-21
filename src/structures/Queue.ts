import { Track, UnresolvedTrack } from "./Track";
import { ManagerUtils, MiniMap, QueueSymbol } from "./Utils";

export interface StoredQueue {
  current: Track | null;
  previous: Track[];
  tracks: Track[];
}

export interface QueueStoreManager extends Record<string, any>{
  /** @async get a Value (MUST RETURN UNPARSED!) */
  get: (guildId: unknown) => Promise<unknown>;
  /** @async Set a value inside a guildId (MUST BE UNPARSED) */
  set: (guildId: unknown, value: unknown) => Promise<unknown>;
  /** @async Delete a Database Value based of it's guildId */
  delete: (guildId: unknown) => Promise<unknown>;
  /** @async Transform the value(s) inside of the QueueStoreManager (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
  stringify: (value: unknown) => Promise<unknown>;
  /** @async Parse the saved value back to the Queue (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
  parse: (value: unknown) => Promise<Partial<StoredQueue>>;
}

export interface ManagerQueueOptions {
  /** Maximum Amount of tracks for the queue.previous array */
  maxPreviousTracks?: number;
  /** Custom Queue Store option */
  queueStore?: QueueStoreManager;
  /** Custom Queue Watcher class */
  queueChangesWatcher?: QueueChangesWatcher;
}

export interface QueueSaver {
  /** @private */
  _: QueueStoreManager;
  /** @private */
  options: {
    maxPreviousTracks: number
  };
}


export class QueueSaver {
  constructor(options: ManagerQueueOptions) {
    this._ = options?.queueStore || new DefaultQueueStore();
    this.options = {
      maxPreviousTracks: options?.maxPreviousTracks || 25,
    };
  }
  async get(guildId: string) {
    return await this._.parse(await this._.get(guildId));
  }
  async delete(guildId: string) {
    return await this._.delete(guildId);
  }
  async set(guildId: string, value: any) {
    return await this._.set(guildId, await this._.stringify(value));
  }
  async sync(guildId: string) {
    return await this.get(guildId);
  }
}

export class DefaultQueueStore implements QueueStoreManager {
  private data = new MiniMap();
  constructor() {}
  async get(guildId) {
    return await this.data.get(guildId);
  }
  async set(guildId, stringifiedValue) {
    return await this.data.set(guildId, stringifiedValue)
  }
  async delete(guildId) {
    return await this.data.delete(guildId);
  }
  async stringify(value) {
    return value; // JSON.stringify(value);
  }
  async parse(value) {
    return value as Partial<StoredQueue>; // JSON.parse(value)
  }
}

export interface QueueChangesWatcher {
    /** get a Value (MUST RETURN UNPARSED!) */
    tracksAdd: (guildId:string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue:StoredQueue, newStoredQueue: StoredQueue) => any;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    tracksRemoved: (guildId:string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue:StoredQueue, newStoredQueue: StoredQueue) => any;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    shuffled: (guildId:string, oldStoredQueue:StoredQueue, newStoredQueue: StoredQueue) => any;
}

export class Queue {
  public readonly tracks: (Track | UnresolvedTrack)[] = [];
  public readonly previous: Track[] = [];
  public current: Track | null = null;
  public options = { maxPreviousTracks: 25 };
  private readonly guildId: string = "";
  private readonly QueueSaver: QueueSaver | null = null;
  private managerUtils = new ManagerUtils();
  private queueChanges: QueueChangesWatcher | null;
  constructor(guildId: string, data: Partial<StoredQueue> = {}, QueueSaver?: QueueSaver, queueOptions?: ManagerQueueOptions) {
    this.queueChanges = queueOptions.queueChangesWatcher || null;
    this.guildId = guildId;
    this.QueueSaver = QueueSaver;
    this.options.maxPreviousTracks = this.QueueSaver?.options?.maxPreviousTracks ?? this.options.maxPreviousTracks;

    this.current = this.managerUtils.isTrack(data.current)  ? data.current : null;
    this.previous = Array.isArray(data.previous) && data.previous.some(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track)) ? data.previous.filter(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track)) : [];
    this.tracks = Array.isArray(data.tracks) && data.tracks.some(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track)) ? data.tracks.filter(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track)) : [];
    
    Object.defineProperty(this, QueueSymbol, { configurable: true, value: true });
  }

  /**
   * Utils for a Queue
   */
  public utils = {
    /** 
     * Save the current cached Queue on the database/server (overides the server)
     */
    save: async () => {
      if (this.previous.length > this.options.maxPreviousTracks) this.previous.splice(this.options.maxPreviousTracks, this.previous.length);
      return await this.QueueSaver.set(this.guildId, this.utils.toJSON());
    },

    /**
     * Sync the current queue database/server with the cached one
     * @returns {void}
     */
    sync: async (override=true, dontSyncCurrent = true) => {
      const data = await this.QueueSaver.get(this.guildId);
      if (!data) return console.log("No data found to sync for guildId: ", this.guildId);
      if (!dontSyncCurrent && !this.current && (this.managerUtils.isTrack(data.current))) this.current = data.current;
      if (Array.isArray(data.tracks) && data?.tracks.length && data.tracks.some(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track))) this.tracks.splice(override ? 0 : this.tracks.length, override ? this.tracks.length : 0, ...data.tracks.filter(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track)));
      if (Array.isArray(data.previous) && data?.previous.length && data.previous.some(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track))) this.previous.splice(0, override ? this.tracks.length : 0, ...data.previous.filter(track => this.managerUtils.isTrack(track) || this.managerUtils.isUnresolvedTrack(track)));

      await this.utils.save();
      
      return;
    },

    destroy: async () => {
      return await this.QueueSaver.delete(this.guildId);
    },

    
    /**
     * @returns {{current:Track|null, previous:Track[], tracks:Track[]}}The Queue, but in a raw State, which allows easier handling for the QueueStoreManager
     */
    toJSON: () => {
      if (this.previous.length > this.options.maxPreviousTracks) this.previous.splice(this.options.maxPreviousTracks, this.previous.length);
      return {
        current: this.current ? { ...this.current } : null,
        previous: this.previous ? [ ...this.previous ] : [],
        tracks: this.tracks ? [ ...this.tracks ] : [],
      } as StoredQueue;
    },
    
    /**
     * Get the Total Duration of the Queue-Songs summed up
     * @returns {number}
     */
    totalDuration: () => {
      return this.tracks.reduce((acc: number, cur) => acc + (cur.info.duration || 0), this.current?.info.duration || 0);
    }
  }

    /**
     * Shuffles the current Queue, then saves it
     * @returns Amount of Tracks in the Queue
     */
    public async shuffle() {
      const oldStored = typeof this.queueChanges?.shuffled === "function" ? this.utils.toJSON() : null;

      if (this.tracks.length <= 1) return this.tracks.length;
      // swap #1 and #2 if only 2 tracks.
      if (this.tracks.length == 2) {
        [this.tracks[0], this.tracks[1]] = [this.tracks[1], this.tracks[0]];
      }
      else { // randomly swap places.
        for (let i = this.tracks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
      }

      // LOG
      if(typeof this.queueChanges?.shuffled === "function") this.queueChanges.shuffled(this.guildId, oldStored, this.utils.toJSON());

      await this.utils.save();
      return this.tracks.length;
    }
  /**
   * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
   * @param {Track | Track[]} TrackOrTracks 
   * @param {number} index At what position to add the Track
   * @returns {number} Queue-Size (for the next Tracks)
   */
  public async add(TrackOrTracks: Track | UnresolvedTrack | (Track | UnresolvedTrack)[], index?: number) {
    if (typeof index === "number" && index >= 0 && index < this.tracks.length) return await this.splice(index, 0, ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)));
   
    const oldStored = typeof this.queueChanges?.tracksAdd === "function" ? this.utils.toJSON() : null;
    // add the track(s)
    this.tracks.push(...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)));
    // log if available
    if(typeof this.queueChanges?.tracksAdd === "function") try { this.queueChanges.tracksAdd(this.guildId, (Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)), this.tracks.length, oldStored, this.utils.toJSON()); } catch (e) { /*  */ }
    
    // save the queue
    await this.utils.save();
    // return the amount of the tracks
    return this.tracks.length;
  }

  /**
   * Splice the tracks in the Queue
   * @param {number} index Where to remove the Track
   * @param {number} amount How many Tracks to remove?
   * @param {Track | Track[]} TrackOrTracks Want to Add more Tracks?
   * @returns {Track} Spliced Track
   */
  public async splice(index: number, amount: number, TrackOrTracks?: Track | UnresolvedTrack | (Track | UnresolvedTrack)[]) {
    const oldStored = typeof this.queueChanges?.tracksAdd === "function" || typeof this.queueChanges?.tracksRemoved === "function" ? this.utils.toJSON() : null;
    // if no tracks to splice, add the tracks
    if (!this.tracks.length) {
      if(TrackOrTracks) return await this.add(TrackOrTracks);
      return null
    }
    // Log if available
    if((TrackOrTracks) && typeof this.queueChanges?.tracksAdd === "function") try { this.queueChanges.tracksAdd(this.guildId, (Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v)), index, oldStored, this.utils.toJSON()); } catch (e) { /*  */ }
    // remove the tracks (and add the new ones)
    let spliced = TrackOrTracks ? this.tracks.splice(index, amount, ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.managerUtils.isTrack(v) || this.managerUtils.isUnresolvedTrack(v))) : this.tracks.splice(index, amount);
    // get the spliced array
    spliced = (Array.isArray(spliced) ? spliced : [spliced]);
    // Log if available
    if(typeof this.queueChanges?.tracksRemoved === "function") try { this.queueChanges.tracksRemoved(this.guildId, spliced, index, oldStored, this.utils.toJSON()) } catch (e) { /* */ }
    // save the queue
    await this.utils.save();
    // return the things
    return spliced.length === 1 ? spliced[0] : spliced;
  }
}