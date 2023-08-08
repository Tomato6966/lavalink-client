import { Track } from "./Track";

export interface StoredQueue {
  currentTrack: Track | null;
  previousTracks: Track[];
  nextTracks: Track[];
}

export interface StoreManager extends Record<any,any> {
  /** @async get a Value */
  get: (key:unknown) => any;
  /** @async Set a value inside a key */
  set: (key:unknown, value:unknown) => any;
  /** @async Delete a Database Value based of it's key */ 
  delete: (key: unknown) => any;
  /** @async Transform the value(s) inside of the StoreManager */
  stringify: (value:unknown) => any;
  /** @async Parse the saved value back to the Queue */
  parse: (value:unknown) => Queue;
} 
export interface QueueSaverOptions {
  maxPreviousTracks: number;
}
export interface QueueSaver {
  /** @private */
  _: StoreManager;
  /** @private */
  options: QueueSaverOptions;
}
export class QueueSaver {
  constructor(storeManager: StoreManager, options: QueueSaverOptions) {
      this._ = storeManager;
      this.options = options;
  }
  async get(key:string) {
      return new Queue(await this._.parse(await this._.get(key)), key, this);
  }
  async delete(key:string) {
      return await this._.delete(key);
  }
  async set(key:string, value:any) {
      return await this._.set(key, await this._.stringify(value));
  }
}

export class DefaultQueueStore {
  private data = new Map();
  constructor() {
    
  }
  get(key) {
      return this.data.get(key);
  }
  set(key, value) {
      return this.data.set(key, value)
  }
  delete(key) {
      return this.data.delete(key);
  }
  stringify(value) {
      return value;
  }
  parse(value) {
      return value;
  }
}

export class Queue {
  private readonly _nextTracks: Track[] = [];
  private readonly _previousTracks: Track[] = [];
  private _currentTrack: Track | null = null;
  private readonly _guildId: string = "";
  private readonly _QueueSaver: QueueSaver | null = null;

  constructor(data:Partial<StoredQueue> = {}, guildId?: string, QueueSaver?: QueueSaver) {
    this._guildId = guildId;
    this._QueueSaver = QueueSaver;
    this._currentTrack = this.isTrack(data.currentTrack) ? data.currentTrack : null;
    this._previousTracks = Array.isArray(data.previousTracks) && data.previousTracks.some(track => this.isTrack(track)) ? data.previousTracks.filter(track => this.isTrack(track)) : [];
    this._nextTracks = Array.isArray(data.nextTracks) && data.nextTracks.some(track => this.isTrack(track)) ? data.nextTracks.filter(track => this.isTrack(track)) : [];
    // TODO bind event Function for trackEnd
  }

  /**
   * Validate if a data is euqal to a track
   * @param {Track|any} data the Track to validate 
   * @returns {boolean}
   */
  public isTrack(data:Track|any) {
    return typeof data?.encodedTrack === "string" && typeof data?.info === "object";
  }

  /** 
   * Get the current Playing Track
   * @returns {Track}
   */
  public get currentTrack() {
    return this._currentTrack || null;
  } 

  
  /** 
   * Get all previously plaid Tracks
   * @returns {Track[]}
   */
  public get previousTracks() {
    return this._previousTracks || [];
  } 
  
  /** 
   * Get all Upcoming Tracks
   * @returns {Track[]}
   */
  public get nextTracks() {
    return this._nextTracks || [];
  } 

  /** 
   * Get the amount of the upcoming Tracks
   * @returns {number}
   */
  public get size() {
    return this.nextTracks.length;
  }

  /** 
   * Get the amount of the previous Tracks
   * @returns {number}
   */
  public get previousSize() {
    return this.previousTracks.length;
  }

  /**
   * @returns {{currentTrack:Track|null, previousTracks:Track[], nextTracks:Track[]}}The Queue, but in a raw State, which allows easier handling for the storeManager
   */
  public getRaw() {
    return {
        currentTrack: this.currentTrack,
        previousTracks: this.previousTracks,
        nextTracks: this.nextTracks,
    } as StoredQueue;
  }

  /**
   * Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks
   * @param {Track | Track[]} TrackOrTracks 
   * @param {number} index At what position to add the Track
   * @returns {number} Queue-Size (for the next Tracks)
   */
  public async add(TrackOrTracks: Track | Track[], index?: number) {
    if(typeof index === "number") return await this.splice(index, 0, TrackOrTracks);
    // add the track(s)
    this._nextTracks.push(...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.isTrack(v)));
    // save the queue
    await this._QueueSaver.set(this._guildId, this.getRaw());

    return this.nextTracks.length;
  } 

  /**
   * Splice the nextTracks in the Queue
   * @param {number} index Where to remove the Track
   * @param {number} amount How many Tracks to remove?
   * @param {Track | Track[]} TrackOrTracks Want to Add more Tracks?
   * @returns {Track} Spliced Track
   */
  public async splice(index: number, amount: number, TrackOrTracks?: Track | Track[]) {
    if(!this.nextTracks.length) return null;

    let spliced = TrackOrTracks ? this._nextTracks.splice(index, amount, ...(Array.isArray(TrackOrTracks) ? TrackOrTracks : [TrackOrTracks]).filter(v => this.isTrack(v))) : this._nextTracks.splice(index, amount);
    // save the queue
    await this._QueueSaver.set(this._guildId, this.getRaw());
    spliced = (Array.isArray(spliced) ? spliced : [spliced]);
    return spliced.length === 1 ? spliced[0] : spliced;
  }

  /**
   * Shuffles the current Queue, then saves it
   * @returns Amount of Tracks in the Queue
   */
  public async shuffle() {
    if(this.nextTracks.length <= 1) return this.nextTracks.length;
    
    // swap #1 and #2 if only 2 tracks.
    if(this.nextTracks.length == 2) [this[0], this[1]] = [this[1], this[0]]
    else { // randomly swap places.
      for (let i = this.nextTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
      }
    }

    await this._QueueSaver.set(this._guildId, this.getRaw());
    
    return this.nextTracks.length;
  }
  
  
  /**
   * Get the Total Duration of the Queue-Songs summed up
   * @returns {number}
   */
  public get duration(): number {
    return this.nextTracks.reduce((acc: number, cur) => acc + (cur.info.duration || 0), this.currentTrack?.info.duration || 0);
  }

  /**
   * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
   * @param Track 
   * @returns {number} Previous Queue Size
   */
  async addPrevious(Track: Track) {
    if(!this.isTrack(Track)) return;
    this._previousTracks.unshift(Track);
    if(this.previousSize > this._QueueSaver.options.maxPreviousTracks) this._previousTracks.pop();
    await this._QueueSaver.set(this._guildId, this.getRaw());
    return this.previousSize;
  }

  /**
   * Add a Track to the Previous Track list, and after saved in the "db" it returns the amount of the previous Tracks
   * @param Track 
   * @returns {Track|null} new Current Track
   */
  async setCurrent(Track: Track|null) {
    this._currentTrack = Track;
    await this._QueueSaver.set(this._guildId, this.getRaw());
    return this.currentTrack;
  }
  /** @private @hidden */
  async _trackEnd(addBackToQueue:boolean = false) {
    if(this.currentTrack) { // if there was a current Track -> Add it
      this._previousTracks.unshift(this.currentTrack);
      if(this.previousSize > this._QueueSaver.options.maxPreviousTracks) this._previousTracks.pop();
    }
    // change the current Track to the next upcoming one
    this._currentTrack = this._nextTracks.shift() || null;
    // and if repeatMode == queue, add it back to the queue!
    if(addBackToQueue && this.currentTrack) this._nextTracks.push(this.currentTrack)
    // save it in the DB
    await this._QueueSaver.set(this._guildId, this.getRaw());
    // return the new current Track
    return this.currentTrack;
  }

}