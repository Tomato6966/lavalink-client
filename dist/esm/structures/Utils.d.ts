import type { LavalinkNodeOptions } from "./Types/Node.js";
import type { LavalinkSearchPlatform, LavaSearchQuery, MiniMapConstructor, SearchPlatform, SearchQuery } from "./Types/Utils.js";
import type { LavalinkManager } from "./LavalinkManager.js";
import type { LavalinkNode } from "./Node.js";
import type { Player } from "./Player.js";
import type { LavalinkTrack, Track, UnresolvedQuery, UnresolvedTrack } from "./Types/Track.js";
export declare const TrackSymbol: unique symbol;
export declare const UnresolvedTrackSymbol: unique symbol;
export declare const QueueSymbol: unique symbol;
export declare const NodeSymbol: unique symbol;
/**
 * Parses Node Connection Url: "lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>"
 * @param connectionUrl
 * @returns
 */
export declare function parseLavalinkConnUrl(connectionUrl: string): {
    authorization: string;
    id: string;
    host: string;
    port: number;
};
export declare class ManagerUtils {
    LavalinkManager: LavalinkManager | null;
    constructor(LavalinkManager?: LavalinkManager);
    buildPluginInfo(data: any, clientData?: any): any;
    buildTrack(data: LavalinkTrack | Track, requester: unknown): Track;
    /**
     * Builds a UnresolvedTrack to be resolved before being played  .
     * @param query
     * @param requester
     */
    buildUnresolvedTrack(query: UnresolvedQuery | UnresolvedTrack, requester: unknown): UnresolvedTrack;
    /**
     * Validate if a data is equal to a node
     * @param data
     */
    isNode(data: LavalinkNode): boolean;
    getTransformedRequester(requester: unknown): unknown;
    /**
     * Validate if a data is equal to node options
     * @param data
     */
    isNodeOptions(data: LavalinkNodeOptions): boolean;
    /**
     * Validate if a data is equal to a track
     * @param data the Track to validate
     * @returns
     */
    isTrack(data: Track | UnresolvedTrack): data is Track;
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrack(data: UnresolvedTrack | Track): data is UnresolvedTrack;
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    isUnresolvedTrackQuery(data: UnresolvedQuery): boolean;
    getClosestTrack(data: UnresolvedTrack, player: Player): Promise<Track | undefined>;
    validateQueryString(node: LavalinkNode, queryString: string, sourceString?: LavalinkSearchPlatform): void;
    transformQuery(query: SearchQuery): {
        query: string;
        extraQueryUrlParams: URLSearchParams;
        source: any;
    };
    transformLavaSearchQuery(query: LavaSearchQuery): {
        query: string;
        types: string[];
        source: any;
    };
    validateSourceString(node: LavalinkNode, sourceString: SearchPlatform): void;
}
/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
export interface MiniMap<K, V> extends Map<K, V> {
    constructor: MiniMapConstructor;
}
export declare class MiniMap<K, V> extends Map<K, V> {
    constructor(data?: [K, V][]);
    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a MiniMap instead of an Array.
     *
     * @param fn The function to test with (should return boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * miniMap.filter(user => user.username === 'Bob');
     */
    filter<K2 extends K>(fn: (value: V, key: K, miniMap: this) => key is K2): MiniMap<K2, V>;
    filter<V2 extends V>(fn: (value: V, key: K, miniMap: this) => value is V2): MiniMap<K, V2>;
    filter(fn: (value: V, key: K, miniMap: this) => boolean): MiniMap<K, V>;
    filter<This, K2 extends K>(fn: (this: This, value: V, key: K, miniMap: this) => key is K2, thisArg: This): MiniMap<K2, V>;
    filter<This, V2 extends V>(fn: (this: This, value: V, key: K, miniMap: this) => value is V2, thisArg: This): MiniMap<K, V2>;
    filter<This>(fn: (this: This, value: V, key: K, miniMap: this) => boolean, thisArg: This): MiniMap<K, V>;
    toJSON(): [K, V][];
    /**
     * Maps each item to another value into an array. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     *
     * @param fn Function that produces an element of the new array, taking three arguments
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * miniMap.map(user => user.tag);
     */
    map<T>(fn: (value: V, key: K, miniMap: this) => T): T[];
    map<This, T>(fn: (this: This, value: V, key: K, miniMap: this) => T, thisArg: This): T[];
}
export declare function queueTrackEnd(player: Player): Promise<Track>;
