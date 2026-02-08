import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";

import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("ftts")
        .setDescription("Use Flowery Text To Speech")
        .addStringOption((o) => o.setName("text").setDescription("The Text to translate").setRequired(true))
        .addStringOption((o) =>
            o.setName("voice").setDescription("The Voice, and thus language to use").setRequired(false),
        )
        .addStringOption((o) =>
            o.setName("speed").setDescription("Speed (float number e.g.   1.5  )").setRequired(false),
        ),

    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId)
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "Join a Voice Channel ",
            });

        const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
        if (!vc.joinable || !vc.speakable)
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "I am not able to join your channel / speak in there.",
            });

        const player = await client.lavalink.createPlayer({
            guildId: interaction.guildId,
            voiceChannelId: vcId,
            textChannelId: interaction.channelId,
            selfDeaf: true,
            selfMute: false,
            volume: 100, // default volume
            instaUpdateFiltersFix: true, // optional
            applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
            // node: "YOUR_NODE_ID",
            // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
        });
        const connected = player.connected;

        if (!connected) await player.connect();
        if (player.voiceChannelId !== vcId)
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "You need to be in my Voice Channel",
            });

        const query = (interaction.options as CommandInteractionOptionResolver).getString("text")!;
        const voice = (interaction.options as CommandInteractionOptionResolver).getString("voice")! || "Ava";
        const speed = (interaction.options as CommandInteractionOptionResolver).getString("speed")! || "1.0";

        const fttsParams = new URLSearchParams();
        if (voice) fttsParams.append("voice", voice);
        if (speed) fttsParams.append("speed", speed);

        const response = await player.search(
            {
                // e.g. query "Hello World How are you?"
                // for flowerytts you need to send a URL
                // and if you want to add optiojns, this is how you add the params to the query..
                query: `${encodeURI(query)}${fttsParams.size ? `?${fttsParams.toString()}` : ""}`,
                // extraQueryUrlParams: fttsParams, // don't use this for flowerytts, this is url params for LAVALINK not for song url
                source: "ftts",
            },
            interaction.user,
        );

        if (!response || !response.tracks?.length)
            return interaction.reply({ content: `No Tracks found`, flags: [MessageFlags.Ephemeral] });

        player.queue.add(response.tracks[0]);

        await interaction.reply({
            content: `Added your TTs request to queue position. #${player.queue.tracks.length}`,
            flags: [MessageFlags.Ephemeral],
        });

        if (!player.playing) await player.play(connected ? { volume: client.defaultVolume, paused: false } : undefined);
    },
} as Command;
