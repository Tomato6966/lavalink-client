import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder, VoiceChannel } from "discord.js";
import {  Command } from "../types/Client";
import { formatMS_HHMMSS } from "../Utils/Time";
import { LavaSearchFilteredResponse, LavaSearchType, LavaSrcSearchPlatform, LavaSrcSearchPlatformBase, SearchPlatform, SearchResult, Track } from "../../src";

const autocompleteMap = new Map();

export default {
    data: new SlashCommandBuilder()
        .setName("lavasearch")
        .setDescription("Play Music filtered via lava-search plugin")
        .addStringOption(o => o.setName("filter").setDescription("What are you looking for?").setChoices(
            { name: "Tracks", value: "track" },
            { name: "Albums", value: "album" },
            { name: "Artists", value: "artist" },
            { name: "Playlists", value: "playlist" },
        ).setRequired(true))
        .addStringOption(o => o.setName("source").setDescription("From which Source you want to play?").setRequired(true).setChoices(
            // { name: "Youtube", value: "ytsearch" },
            // { name: "Youtube Music", value: "ytmsearch" },
            // { name: "Soundcloud", value: "scsearch" },
            { name: "Spotify", value: "spsearch" },
            { name: "Deezer", value: "dzsearch" },
            { name: "Apple Music", value: "amsearch" },
        ))
        .addStringOption(o => o.setName("query").setDescription("What to play?").setAutocomplete(true).setRequired(true)),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.reply({ ephemeral: true, content: `Join a voice Channel` });

        const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
        if(!vc.joinable || !vc.speakable) return interaction.reply({ ephemeral: true, content: "I am not able to join your channel / speak in there." });
        
        const src = (interaction.options as CommandInteractionOptionResolver).getString("source") as SearchPlatform|undefined;
        const query = (interaction.options as CommandInteractionOptionResolver).getString("query") as string;
        
        if(query === "nothing_found") return interaction.reply({ content: `No Tracks found`, ephemeral: true });
        if(query === "join_vc") return interaction.reply({ content: `You joined a VC, but redo the Command please.`, ephemeral: true });
        
        const fromAutoComplete = (Number(query.replace("autocomplete_", "")) >= 0 && autocompleteMap.has(`${interaction.user.id}_res`)) && autocompleteMap.get(`${interaction.user.id}_res`);
        if(autocompleteMap.has(`${interaction.user.id}_res`)) {
            if(autocompleteMap.has(`${interaction.user.id}_timeout`)) clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
            autocompleteMap.delete(`${interaction.user.id}_res`);
            autocompleteMap.delete(`${interaction.user.id}_timeout`);
        }
        if(!fromAutoComplete) return interaction.reply({ ephemeral: true, content: "You have to use autocomplete" });
        if(!fromAutoComplete[Number(query.replace("autocomplete_", ""))]?.pluginInfo?.url) return interaction.reply({ ephemeral: true, content: "Nothing found" });
        const player = client.lavalink.getPlayer(interaction.guildId) || await client.lavalink.createPlayer({
            guildId: interaction.guildId, 
            voiceChannelId: vcId, 
            textChannelId: interaction.channelId, 
            selfDeaf: true, 
            selfMute: false,
            volume: client.defaultVolume,  // default volume
            instaUpdateFiltersFix: true, // optional
            applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
            // node: "YOUR_NODE_ID",
            // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
        });
        
        const connected = player.connected;

        if(!connected) await player.connect();

        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" });
        
        const response = await player.search({ query: fromAutoComplete[Number(query.replace("autocomplete_", ""))].pluginInfo.url }, interaction.user) as SearchResult | undefined;
        if(!response || !response.tracks?.length) return interaction.reply({ content: `No Tracks found`, ephemeral: true });

        await player.queue.add(response.loadType === "playlist" ? response.tracks : response.tracks[0]);

        await interaction.reply({
            content: response.loadType === "playlist" 
                ? `✅ Added [${response.tracks.length}] Tracks${response.playlist?.title ? ` - from the ${response.pluginInfo.type || "Playlist"} ${response.playlist.uri ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)` : `\`${response.playlist.title}\``}` : ""} at \`#${player.queue.tracks.length-response.tracks.length}\`` 
                : `✅ Added [\`${response.tracks[0].info.title}\`](<${response.tracks[0].info.uri}>) by \`${response.tracks[0].info.author}\` at \`#${player.queue.tracks.length}\`` 
        });

        if(!player.playing) await player.play(connected ? { volume: client.defaultVolume, paused: false } : undefined);
    },
    autocomplete: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.respond([{ name: `Join a voice Channel`, value: "join_vc" }]);

        const focussedQuery = interaction.options.getFocused();
        const player = client.lavalink.getPlayer(interaction.guildId) || await client.lavalink.createPlayer({
            guildId: interaction.guildId, voiceChannelId: vcId, textChannelId: interaction.channelId, // in what guild + channel(s)
            selfDeaf: true, selfMute: false, volume: client.defaultVolume, instaUpdateFiltersFix: true // configuration(s)
        });

        if(!player.connected) await player.connect();

        if(player.voiceChannelId !== vcId) return interaction.respond([{ name: `You need to be in my Voice Channel`, value: "join_vc" }]);

        const type = interaction.options.getString("filter") as LavaSearchType;
        const res = await player.lavaSearch({ query: focussedQuery, types: [type], source: interaction.options.getString("source") as LavaSrcSearchPlatformBase }, interaction.user);
        
        if(!res[`${type}s`]?.length) {
            return await interaction.respond([{ name: `Nothing found`, value: "nothing_found" }]);
        }
        // handle the res
        if(autocompleteMap.has(`${interaction.user.id}_timeout`)) clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
        autocompleteMap.set(`${interaction.user.id}_res`, res[`${type}s`]);
        autocompleteMap.set(`${interaction.user.id}_timeout`, setTimeout(() => {
            autocompleteMap.delete(`${interaction.user.id}_res`);
            autocompleteMap.delete(`${interaction.user.id}_timeout`);
        }, 25000));

        await interaction.respond(
            res[`${type}s`].map((t:LavaSearchFilteredResponse, i) => ({ name: `[${t.pluginInfo.totalTracks || NaN} Tracks] ${t.info.title || t.info.name} (by ${t.pluginInfo.author || "Unknown-Author"})`.substring(0, 100), value: `autocomplete_${i}` })).slice(0, 25)
        );
    }
} as Command;