import type { Player } from "../Player.js";
import type { UnresolvedSearchResult } from "../Types/Utils.js";
export declare const bandCampSearch: (player: Player, query: string, requestUser: unknown) => Promise<UnresolvedSearchResult>;
