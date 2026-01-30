import { CustomRequester } from "./Client";

declare module "lavalink-client" {
    // Augment the TrackRequester interface to include your custom properties
    export interface TrackRequester extends CustomRequester { }
}
