import type { Player } from "../Player";
import type { UnresolvedSearchResult } from "../Types/Utils";
export declare const bandCampSearch: (player: Player, query: string, requestUser: unknown) => Promise<UnresolvedSearchResult>;
