import { Player } from "lavalink-client";

import type { BotClient } from "../../types/Client";
import type { Message } from "discord.js";

export class myCustomPlayer extends Player {
    npMessage:null | Message = null;
    sendNpMessage = async (client:BotClient) => {
        const npChannel = client.channels.cache.get(this.options.textChannelId!);
        if(!npChannel || !npChannel.isSendable() || !("guild" in npChannel)) return;
        const msg = await npChannel.send({
            content: `Now playing [${this.queue.current?.info.title}](${this.queue.current?.info.uri}) [:notes:](${this.queue.current?.info.artworkUrl})`
        });
        this.npMessage = msg;
    }
}
