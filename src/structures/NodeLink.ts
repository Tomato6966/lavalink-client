import { LavalinkNode } from "./Node";
import type { NodeManager } from "./NodeManager";
import { Player } from "./Player";
import {
    NodeLink_ChorusFilter,
    NodeLink_CompressorFilter,
    NodeLink_EchoFilter,
    NodeLink_HighPassFilter,
    NodeLink_PhaserFilter,
    NodeLink_SpatialFilter,
} from "./Types/Filters";
import type { LavalinkNodeOptions } from "./Types/Node";
import {
    AddMixerLayerResponse,
    ConnectionMetricsResponse,
    DirectStreamResponse,
    ListMixerLayersResponse,
    NodeLinkChapter,
    NodeLinkLyrics,
    NodeLinkNoLyrics,
    YoutubeOAuthResponse,
} from "./Types/NodeLink";
import { Track, UnresolvedTrack } from "./Types/Track";
import { safeStringify } from "./Utils";

export class NodeLinkNode extends LavalinkNode {
    public nodeType = "NodeLink" as const;

    constructor(options: LavalinkNodeOptions, manager: NodeManager) {
        super(options, manager);

        if (this.options.nodeType === "Lavalink" && this.constructor.name === "NodeLink") {
            return new (LavalinkNode as any)(options, manager);
        }
        this.nodeType = "NodeLink";
    }

    /**
     * Adds a new audio track to be mixed over the current playback.
     * @param player The player to add the mixer layer to.
     * @param trackToAdd The track to add to the mixer layer.
     * @param volume The volume of the track to add to the mixer layer. (0 - 100)
     * @link {https://nodelink.js.org/docs/api/rest#add-mix-layer} documentiation
     */
    public async addMixerLayer(player: Player, trackToAdd: Track, volume: number): Promise<AddMixerLayerResponse> {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        return (await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/mix`, (m) => {
            m.method = "POST";
            m.body = safeStringify({
                track: {
                    encoded: trackToAdd.encoded,
                    //identifier: trackToAdd.info?.identifier, // atm not supported
                    userData: trackToAdd.userData,
                },
                volume: (volume / 100).toFixed(2),
            });
        })) as AddMixerLayerResponse;
    }

    /**
     * Retrieves a list of currently active mix layers.
     * @param player The player to list the mixer layers for.
     * @link {https://nodelink.js.org/docs/api/rest#get-active-mixes} documentiation
     */
    public async listMixerLayers(player: Player): Promise<ListMixerLayersResponse> {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        return (await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/mix`, (m) => {
            m.method = "GET";
        })) as ListMixerLayersResponse;
    }

    /**
     * Updates the volume of a specific mix layer.
     * @param player The player to update the mixer layer volume for.
     * @param mixId The ID of the mix layer to update.
     * @param volume The volume of the mix layer to update. (0 - 100)
     * @link {https://nodelink.js.org/docs/api/rest#update-mix-volume} documentiation
     */
    public async updateMixerLayerVolume(player: Player, mixId: string, volume: number) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/mix/${mixId}`, (m) => {
            m.method = "PATCH";
            m.body = safeStringify({
                volume: (volume / 100).toFixed(2),
            });
        });
        return true;
    }

    /**
     * Removes a specific mix layer.
     * @param player The player to remove the mix layer from.
     * @param mixId The ID of the mix layer to remove.
     * @link {https://nodelink.js.org/docs/api/rest#remove-mix-layer} documentiation
     */
    public async removeMixerLayer(player: Player, mixId: string) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        await this.request(`/sessions/${this.sessionId}/players/${player.guildId}/mix/${mixId}`, (m) => {
            m.method = "DELETE";
        });
        return true;
    }

    /**
     * @description
     * NodeLink has a lot of filters SPECIFICALLY for NodeLink, check the documentation for more information.
     * @link {https://nodelink.js.org/docs/api/nodelink-features#additional-filters} documentiation
     */
    specificFilters = {
        /**
         * Creates delay-based echo with feedback control
         * @param player The player to apply the filter to
         * @param options The echo filter options
         */
        echo: async (
            player: Player,
            options: NodeLink_EchoFilter,
            disableFilter: boolean = false,
        ): Promise<boolean> => {
            if (disableFilter) delete player.filterManager.data.echo;
            else player.filterManager.data.echo = options;
            await player.filterManager.applyPlayerFilters();
            return player.filterManager.filters.nodeLinkEcho;
        },
        /**
         * Simulates multiple voices playing together with modulated delays
         * @param player The player to apply the filter to
         * @param options The chorus filter options
         */
        chorus: async (
            player: Player,
            options: NodeLink_ChorusFilter,
            disableFilter: boolean = false,
        ): Promise<boolean> => {
            if (disableFilter) delete player.filterManager.data.chorus;
            else player.filterManager.data.chorus = options;
            await player.filterManager.applyPlayerFilters();
            return player.filterManager.filters.nodeLinkChorus;
        },
        /**
         * Dynamic range compression for balanced audio levels
         * @param player The player to apply the filter to
         * @param options The compressor filter options
         */
        compressor: async (
            player: Player,
            options: NodeLink_CompressorFilter,
            disableFilter: boolean = false,
        ): Promise<boolean> => {
            if (disableFilter) delete player.filterManager.data.compressor;
            else player.filterManager.data.compressor = options;
            await player.filterManager.applyPlayerFilters();
            return player.filterManager.filters.nodeLinkCompressor;
        },
        /**
         * Filters out low frequencies, letting high frequencies pass through
         * @param player The player to apply the filter to
         * @param options The highpass filter options
         */
        highPass: async (
            player: Player,
            options: NodeLink_HighPassFilter,
            disableFilter: boolean = false,
        ): Promise<boolean> => {
            if (disableFilter) delete player.filterManager.data.highPass;
            else player.filterManager.data.highPass = options;
            await player.filterManager.applyPlayerFilters();
            return player.filterManager.filters.nodeLinkHighPass;
        },
        /**
         * Sweeps all-pass filters across the frequency spectrum for a swooshing effect
         * @param player The player to apply the filter to
         * @param options The phaser filter options
         */
        phaser: async (
            player: Player,
            options: NodeLink_PhaserFilter,
            disableFilter: boolean = false,
        ): Promise<boolean> => {
            if (disableFilter) delete player.filterManager.data.phaser;
            else player.filterManager.data.phaser = options;
            await player.filterManager.applyPlayerFilters();
            return player.filterManager.filters.nodeLinkPhaser;
        },
        /**
         * Creates spatial audio using cross-channel delays and modulation
         * @param player The player to apply the filter to
         * @param options The spatial filter options
         */
        spatial: async (
            player: Player,
            options: NodeLink_SpatialFilter,
            disableFilter: boolean = false,
        ): Promise<boolean> => {
            if (disableFilter) delete player.filterManager.data.spatial;
            else player.filterManager.data.spatial = options;
            await player.filterManager.applyPlayerFilters();
            return player.filterManager.filters.nodeLinkSpatial;
        },

        /**
         * Resets all NodeLink filters
         * @param player The player to reset the filters for
         */
        resetNodeLinkFilters: async (player: Player): Promise<boolean> => {
            delete player.filterManager.data.spatial;
            delete player.filterManager.data.echo;
            delete player.filterManager.data.chorus;
            delete player.filterManager.data.compressor;
            delete player.filterManager.data.highPass;
            delete player.filterManager.data.phaser;
            player.filterManager.checkFiltersState();
            await player.filterManager.applyPlayerFilters();
            return true;
        },
    };

    /**
     * Retrieve Lyrics of Youtube Videos.
     * @param player The Player you use with that node.
     * @param track if not provided, it will use the current track
     * @param language if not provided, it will use the default language (en)
     * @link {https://nodelink.js.org/docs/api/nodelink-features#lyrics--chapters}
     * @returns NodeLinkLyrics either synced/unsynced or NodeLinkNoLyrics
     */
    public async nodeLinkLyrics(
        player: Player,
        track?: Track | UnresolvedTrack,
        language: string = "en",
    ): Promise<NodeLinkLyrics | NodeLinkNoLyrics> {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        const encodedTrack = track?.encoded || player.queue.current?.encoded;
        if (!encodedTrack) throw new Error("No track provided");
        return (await this.request(
            `/sessions/${this.sessionId}/players/${player.guildId}/lyrics?encodedTrack=${encodedTrack}&lang=${language}`,
            (m) => {
                m.method = "GET";
            },
        )) as NodeLinkLyrics | NodeLinkNoLyrics;
    }

    /**
     * Retrieve Chapters of Youtube Videos.
     * @link {https://nodelink.js.org/docs/api/nodelink-features#loadchapters}
     * @param player The Player you use with that node.
     * @param track if not provided, it will use the current track
     * @returns Array of NodeLinkChapter objects (if empty than there are no chapters available)
     */
    public async getChapters(player: Player, track?: Track | UnresolvedTrack): Promise<NodeLinkChapter[]> {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");
        const encodedTrack = track?.encoded || player.queue.current?.encoded;
        if (!encodedTrack) throw new Error("No track provided");
        return (await this.request(
            `/sessions/${this.sessionId}/players/${player.guildId}/chapters?encodedTrack=${encodedTrack}`,
            (m) => {
                m.method = "GET";
            },
        )) as NodeLinkChapter[];
    }

    /**
     * @link {https://nodelink.js.org/docs/api/rest#node-information}
     * @returns
     */
    public async getConnectionMetrics(): Promise<ConnectionMetricsResponse> {
        return (await this.request(`/connection`, (m) => {
            m.method = "GET";
        })) as ConnectionMetricsResponse;
    }

    /**
     * Stream audio directly from NodeLink without Discord voice connection. | Note this must be enabled by NodeLink...
     * @link {https://nodelink.js.org/docs/api/nodelink-features#direct-streaming}
     */
    public async getDirectStream(track: Track | UnresolvedTrack): Promise<DirectStreamResponse> {
        return (await this.request(`/trackstream?encodedTrack=${track.encoded}`, (m) => {
            m.method = "GET";
        })) as DirectStreamResponse;
    }

    /**
     * Stream raw PCM audio for custom processing or recording.
     * @link {https://nodelink.js.org/docs/api/nodelink-features#loadstream}
     * @param track The track to stream
     * @param volume The volume to stream at
     * @param position The position to stream from
     * @param filters The filters to apply to the stream
     * @returns Returns a raw PCM stream with Content-Type: audio/l16;rate=48000;channels=2.
     */
    public async loadDirectStream(
        track: Track | UnresolvedTrack,
        volume: number,
        position: number,
        filters: object | string,
    ): Promise<ReadableStream> {
        let requestPath = `/loadstream?encodedTrack=${track.encoded}`;
        if (volume && volume > 0 && volume <= 100) requestPath += `&volume=${(volume / 100).toFixed(2)}`;
        if (position && position > 0) requestPath += `&position=${position}`;
        if (filters) requestPath += `&filters=${typeof filters === "object" ? safeStringify(filters) : filters}`;
        const res = await this.rawRequest(requestPath, (m) => {
            m.method = "GET";
        });
        return res.response as unknown as ReadableStream;
    }

    /**
     * NodeLink supports selecting specific audio tracks for videos that contain multiple audio streams (e.g., Netflixstyle dubs, multi-language YouTube videos).
     * This function changes the current language of the audio, in place at the same position of the current track.
     * You can always do it manually by providing extra field in the track object "audioTrackId"
     * @link {https://nodelink.js.org/docs/api/nodelink-features#additional-filters}
     * @param player The player to apply the filter to
     * @param language_audioTrackId The language of the audio track to select, see it in the pluginInfo.audioTracks
     */
    public async changeAudioTrackLanguage(player: Player, language_audioTrackId: string) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");

        const res = await this.request(`/sessions/${this.sessionId}/players/${player.guildId}`, (r) => {
            r.method = "PATCH";

            r.headers!["Content-Type"] = "application/json";

            r.body = safeStringify({
                track: {
                    encoded: player.queue.current?.encoded,
                    position: player.position,
                    audioTrackId: language_audioTrackId,
                },
            });
        });

        return res;
    }

    /**
     * Updates the YouTube configuration (RefreshToken or VisitorData) in real-time.
     * @link {https://nodelink.js.org/docs/api/nodelink-features#update-config}
     */
    public async updateYoutubeConfig(refreshToken?: string, visitorData?: string) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");

        const res = await this.request(`/youtube/config`, (r) => {
            r.method = "PATCH";

            r.headers!["Content-Type"] = "application/json";

            r.body = safeStringify({
                refreshToken: refreshToken,
                visitorData: visitorData,
            });
        });

        return res;
    }

    public async getYoutubeConfig(validate: boolean = false) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");

        const res = await this.request(`/youtube/config${validate ? "?validate=true" : ""}`, (r) => {
            r.method = "GET";
        });

        return res as {
            refreshToken: string;
            visitorData: string | null;
            isConfigured: boolean;
            isValid: boolean | null;
        };
    }

    /**
     * @link {https://nodelink.js.org/docs/api/nodelink-features#oauth}
     */
    public async getYoutubeOAUTH(refreshToken: string) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");

        return (await this.request(`/youtube/oauth?refreshToken=${refreshToken}`, (m) => {
            m.method = "GET";
        })) as YoutubeOAuthResponse;
    }

    /**
     * @link {https://nodelink.js.org/docs/api/nodelink-features#oauth}
     */
    public async updateYoutubeOAUTH(refreshToken: string) {
        if (!this.sessionId) throw new Error("The Lavalink Node is either not ready, or not up to date!");

        return (await this.request(`/youtube/oauth`, (m) => {
            m.method = "POST";
            m.body = safeStringify({
                refreshToken: refreshToken,
            });
        })) as YoutubeOAuthResponse;
    }
}

LavalinkNode._NodeLinkClass = NodeLinkNode;
