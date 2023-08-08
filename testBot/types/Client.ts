import { AutocompleteInteraction, Client, Collection, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { LavalinkManager } from "../../src";

export interface Command {
    data: SlashCommandBuilder;
    execute: (client:BotClient, interaction:CommandInteraction) => any;
    autocomplete?: (client:BotClient, interaction:AutocompleteInteraction) => any;
}

export interface Event {
    name: string,
    execute: (client:BotClient, ...params:any) => any;
}

export interface BotClient extends Client {
    musicManager: LavalinkManager;
    commands: Collection<string, Command>;
}