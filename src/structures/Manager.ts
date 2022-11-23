import { EventEmitter } from "events";

import { Player } from "./Player";
import { Node } from "./Node";

export class Manager {
  public players: Map<string, Player>;
  public nodes: Map<string, Node>;
  
  constructor() {
    this.players = new Map();
    this.nodes = new Map();
  }
}
