import {
	AutocompleteInteraction, ChatInputCommandInteraction, Client, SlashCommandBuilder,
	SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import { RedisClientType } from "redis";

import { myCustomPlayer } from "../Utils/CustomClasses/customPlayerClass";

import type { LavalinkManager, MiniMap } from "lavalink-client";
import type { JSONStore } from "../Utils/CustomClasses";
declare type InteractionExecuteFN = (client: BotClient, interaction: ChatInputCommandInteraction<"cached">) => any;
declare type AutoCompleteExecuteFN = (client: BotClient, interaction: AutocompleteInteraction) => any;

export interface CustomRequester {
    id: string,
    username: string,
    avatar?: string,
}

export interface Command {
    data: SlashCommandBuilder;
    execute: InteractionExecuteFN;
    autocomplete?: AutoCompleteExecuteFN;
}

type subCommandExecute = { [subCommandName: string]: InteractionExecuteFN };
type subCommandAutocomplete = { [subCommandName: string]: AutoCompleteExecuteFN };
export interface SubCommand {
    data: SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: subCommandExecute;
    autocomplete?: subCommandAutocomplete;
}

export interface Event {
    name: string,
    execute: (client: BotClient, ...params: any) => any;
}

export interface BotClient extends Client {
    lavalink: LavalinkManager<myCustomPlayer>;
    commands: MiniMap<string, Command | SubCommand>;
    redis: RedisClientType | JSONStore | MiniMap<string, string>;
    defaultVolume: number;
}
