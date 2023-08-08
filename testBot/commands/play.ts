import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import {  Command } from "../types/Client";
import { formatMS_HHMMSS } from "../Utils/Time";
import { SearchPlatform, Track } from "../src";

const autocompleteMap = new Map();

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play Music")
        .addStringOption(o => o.setName("query").setDescription("What to play?").setAutocomplete(true).setRequired(true))
        .addStringOption(o => o.setName("source").setDescription("From which Source you want to play?").setRequired(false).setChoices(
            { name: "Youtube", value: "ytsearch" },
            { name: "Youtube Music", value: "ytmsearch" },
            { name: "Soundcloud", value: "scsearch" },
            { name: "Deezer", value: "dzsearch" },
            { name: "Spotify", value: "spsearch" },
            { name: "Apple Music", value: "amsearch" }
        )),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.reply({ ephemeral: true, content: `Join a voice Channel` });

        const src = (interaction.options as CommandInteractionOptionResolver).getString("source") as SearchPlatform|undefined;
        const query = (interaction.options as CommandInteractionOptionResolver).getString("query") as string;
        
        if(query === "nothing_found") return interaction.reply({ content: `No Tracks found`, ephemeral: true });
        if(query === "join_vc") return interaction.reply({ content: `You joined a VC, but redo the Command please.`, ephemeral: true });
        
        
        const fromAutoComplete = (Number(query.replace("autocomplete_", "")) >= 0 && autocompleteMap.has(`${interaction.user.id}_res`)) && autocompleteMap.get(`${interaction.user.id}_res`)?.[Number(query.replace("autocomplete_", ""))];
        if(autocompleteMap.has(`${interaction.user.id}_res`)) {
            if(autocompleteMap.has(`${interaction.user.id}_timeout`)) clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
            autocompleteMap.delete(`${interaction.user.id}_res`);
            autocompleteMap.delete(`${interaction.user.id}_timeout`);
        }

        const player = client.musicManager.getPlayer(interaction.guildId) || await client.musicManager.createPlayer({
            guildId: interaction.guildId, voiceChannelId: vcId, textChannelId: interaction.channelId, // in what guild + channel(s)
            selfDeaf: true, selfMute: false, volume: 100, instaUpdateFiltersFix: true // configuration(s)
        });
        
        if(!player.connected) await player.connect();

        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" });
        

        let track = fromAutoComplete || await player.search({ query: query, source: src }, interaction.user).then(v => v.tracks[0]) as Track;
        if(!track) return interaction.reply({ content: `No Tracks found`, ephemeral: true });

        await player.queue.add(track);
        await interaction.reply({
            content: `✅ Added [\`${track.info.title}\`](${track.info.uri}) by \`${track.info.author}\``
        });

        console.log(player.queue.nextTracks.map(v => v.info.title))
        
        if(!player.playing) await player.play();
    },
    autocomplete: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.respond([{ name: `Join a voice Channel`, value: "join_vc" }]);

        const focussedQuery = interaction.options.getFocused();
        const player = client.musicManager.getPlayer(interaction.guildId) || await client.musicManager.createPlayer({
            guildId: interaction.guildId, voiceChannelId: vcId, textChannelId: interaction.channelId, // in what guild + channel(s)
            selfDeaf: true, selfMute: false, volume: 100, instaUpdateFiltersFix: true // configuration(s)
        });

        if(!player.connected) await player.connect();

        if(player.voiceChannelId !== vcId) return interaction.respond([{ name: `You need to be in my Voice Channel`, value: "join_vc" }]);

        const res = await player.search({ query: focussedQuery, source: interaction.options.getString("source") as SearchPlatform }, interaction.user);
        
        if(!res.tracks.length) return await interaction.respond([{ name: `No Tracks found`, value: "nothing_found" }]);
        // handle the res
        if(autocompleteMap.has(`${interaction.user.id}_timeout`)) clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
        autocompleteMap.set(`${interaction.user.id}_res`, res.tracks);
        autocompleteMap.set(`${interaction.user.id}_timeout`, setTimeout(() => {
            autocompleteMap.delete(`${interaction.user.id}_res`);
            autocompleteMap.delete(`${interaction.user.id}_timeout`);
        }, 25000));

        await interaction.respond(
            res.tracks.map((t, i) => ({ name: `[${formatMS_HHMMSS(t.info.duration)}] ${t.info.title} (${t.info.author})`.substring(0, 100), value: `autocomplete_${i}` })).slice(0, 25)
        );
    }
} as Command;