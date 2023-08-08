import { BotClient } from "../types/Client";
import { NodesEvents } from "./Nodes";
import { PlayerEvents } from "./Player";

export function loadLavalinkEvents(client:BotClient) {
    NodesEvents(client);
    PlayerEvents(client);
}