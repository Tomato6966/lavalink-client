import { LavalinkNode } from "./Node";
import type { NodeManager } from "./NodeManager";
import { Player } from "./Player";
import type { LavalinkNodeOptions } from "./Types/Node";
import { AddMixerLayerResponse, ListMixerLayersResponse } from "./Types/NodeLink";
import { Track } from "./Types/Track";

export class NodeLinkNode extends LavalinkNode {
    public nodeType = "NodeLink" as const;

    constructor(options: LavalinkNodeOptions, manager: NodeManager) {
        super(options, manager);

        if (this.options.nodeType === "Lavalink" && this.constructor.name === "NodeLink") {
            return new (LavalinkNode as any)(options, manager);
        }
        this.nodeType = "NodeLink";
    }

    public thisIsNodeLink() {
        return true;
    }

    /**
     * Adds a new audio track to be mixed over the current playback.
     * @param player The player to add the mixer layer to.
     * @param trackToAdd The track to add to the mixer layer.
     * @param volume The volume of the track to add to the mixer layer. (0 - 100)
     * @link {https://nodelink.js.org/docs/api/rest#add-mix-layer} documentiation
     */
    public async addMixerLayer(player: Player, trackToAdd: Track, volume: number): Promise<AddMixerLayerResponse> {
        return await this.request(
            `/sessions/${this.sessionId}/players/${player.guildId}/mix`,
            (m) => {
                m.method = "POST";
                m.body = JSON.stringify({
                    track: {
                        encoded: trackToAdd.encoded,
                        //identifier: trackToAdd.info?.identifier, // atm not supported
                        userData: trackToAdd.userData,
                    },
                    volume: (volume / 100).toFixed(2),
                })
            }
        ) as AddMixerLayerResponse;
    }

    /**
     * Retrieves a list of currently active mix layers.
     * @param player The player to list the mixer layers for.
     * @link {https://nodelink.js.org/docs/api/rest#get-active-mixes} documentiation
     */
    public async listMixerLayers(player: Player): Promise<ListMixerLayersResponse> {
        return await this.request(
            `/sessions/${this.sessionId}/players/${player.guildId}/mix`,
            (m) => {
                m.method = "GET";
            }
        ) as ListMixerLayersResponse;
    }

    /**
     * Updates the volume of a specific mix layer.
     * @param player The player to update the mixer layer volume for.
     * @param mixId The ID of the mix layer to update.
     * @param volume The volume of the mix layer to update. (0 - 100)
     * @link {https://nodelink.js.org/docs/api/rest#update-mix-volume} documentiation
     */
    public async updateMixerLayerVolume(player: Player, mixId: string, volume: number) {
        await this.request(
            `/sessions/${this.sessionId}/players/${player.guildId}/mix/${mixId}`,
            (m) => {
                m.method = "PATCH";
                m.body = JSON.stringify({
                    volume: (volume / 100).toFixed(2),
                })
            }
        );
        return true;
    }

    /**
     * Removes a specific mix layer.
     * @param player The player to remove the mix layer from.
     * @param mixId The ID of the mix layer to remove.
     * @link {https://nodelink.js.org/docs/api/rest#remove-mix-layer} documentiation
     */
    public async removeMixerLayer(player: Player, mixId: string) {
        await this.request(
            `/sessions/${this.sessionId}/players/${player.guildId}/mix/${mixId}`,
            (m) => {
                m.method = "DELETE";
            }
        );
        return true;
    }

    specificFilters = {

    }
}

LavalinkNode._NodeLinkClass = NodeLinkNode;
