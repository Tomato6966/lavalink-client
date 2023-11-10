import { fetch } from "undici";

import { Player } from "../Player";
import { UnresolvedSearchResult } from "../Utils";

export const bandCampSearch = async (player:Player, query: string, requestUser: unknown) => {
    let error = null;
    let tracks = [];
    
    player.LavalinkManager.utils.validateQueryString(player.node, query);
    
    try {
        const data = await fetch(`https://bandcamp.com/api/nusearch/2/autocomplete?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'android-async-http/1.4.1 (http://loopj.com/android-async-http)',
                'Cookie': '$Version=1'
            }
        });

        const json = await data.json() as { results: { [key:string]: string }[] };

        tracks = json?.results?.filter(x => !!x && typeof x === "object" && "type" in x && x.type === "t").map?.(item => player.LavalinkManager.utils.buildUnresolvedTrack({
            uri: item.url || item.uri,
            artworkUrl: item.img,
            author: item.band_name,
            title: item.name,
            identifier: item.id ? `${item.id}` : item.url?.split("/").reverse()[0],
        }, requestUser));

    } catch (e) { error = e; }

    return { 
        loadType: "search",
        exception: error,
        pluginInfo: {},
        playlist:  null,
        tracks: tracks
    } as UnresolvedSearchResult;
}