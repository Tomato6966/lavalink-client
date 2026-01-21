import { CustomRequester } from "./Client";

declare module "lavalink-client" {
    // Augment the Requester interface to include your custom properties
    export interface Requester extends CustomRequester { }
}
