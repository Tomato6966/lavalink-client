import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import type { RedisClientType } from "redis";

import { type LavalinkManager, MiniMap, type PlayerJson, type QueueChangesWatcher, type QueueStoreManager, type StoredQueue } from "../../src";

import type { BotClient } from "../types/Client";

export class JSONStore {
	public data = new MiniMap<string, string>();
	filePath = `${process.cwd()}/queueData.json`;
	constructor(filePath?: string) {
		this.filePath = filePath || this.filePath;
		this.initLoadData();
	}

	async initLoadData() {
		try {
			// important to do sync so it's loaded on the initialisation
			this.data = new MiniMap(this.JSONtoMap(readFileSync(this.filePath, "utf-8")));
		} catch (error) {
			await writeFile(this.filePath, this.MapToJSON(this.data));
		}
	}

	private JSONtoMap(json: string): [string, string][] {
		return Object.entries(JSON.parse(json));
	}

	private MapToJSON(map: MiniMap<string, string>) {
		return JSON.stringify(Object.fromEntries(Array.from(map.entries())));
	}

	async get(guildId: string): Promise<any> {
		// return the map cache : )
		return this.data.get(guildId);
	}
	/**
	 * Update the cache, and save it
	 * @param guildId
	 * @param stringifiedQueueData
	 */
	async set(guildId: string, stringifiedQueueData: string): Promise<any> {
		this.data.set(guildId, stringifiedQueueData);
		await writeFile(this.filePath, this.MapToJSON(this.data));
	}
	/**
	 * Delete the cache, and save it
	 * @param guildId
	 */
	async delete(guildId: string): Promise<any> {
		this.data.delete(guildId);
		await writeFile(this.filePath, this.MapToJSON(this.data));
	}
}

export class PlayerSaver extends JSONStore {
	constructor() {
		super(`${process.cwd()}/playerData.json`);
	}
	/**
	 * Listen to the playerUpdate event and save the player data to the json file
	 * @param lavalink
	 */
	listenToEvents(lavalink: LavalinkManager) {
		lavalink.on("playerUpdate", (oldPlayer, newPlayer) => {
			const newPlayerData = newPlayer.toJSON();
			// we only save the data if anything changes of what we need later on
			if (
				!oldPlayer ||
				oldPlayer.voiceChannelId !== newPlayerData.voiceChannelId ||
				oldPlayer.textChannelId !== newPlayerData.textChannelId ||
				oldPlayer.options.selfDeaf !== newPlayerData.options.selfDeaf ||
				oldPlayer.options.selfMute !== newPlayerData.options.selfDeaf ||
				oldPlayer.nodeId !== newPlayerData.nodeId ||
				oldPlayer.nodeSessionId !== newPlayerData.nodeSessionId ||
				oldPlayer.options.applyVolumeAsFilter !== newPlayerData.options.applyVolumeAsFilter ||
				oldPlayer.options.instaUpdateFiltersFix !== newPlayerData.options.instaUpdateFiltersFix ||
				oldPlayer.options.vcRegion !== newPlayerData.options.vcRegion
			) {
				this.set(newPlayer.guildId, JSON.stringify(newPlayerData));
			}
		});
	}
	async getAllLastNodeSessions() {
		try {
			const datas = Array.from(this.data.values());
			const sessionIds = new Map();
			for (const theData of datas) {
				const json = JSON.parse(theData);
				if (json.nodeSessionId && json.nodeId) sessionIds.set(json.nodeId, json.nodeSessionId);
			}
			return sessionIds;
		} catch {
			return new Map();
		}
	}
	async getPlayer(guildId: string) {
		const data = await this.get(guildId);
		return data ? (JSON.parse(data) as PlayerJson) : null;
	}
	async delPlayer(guildId: string) {
		await this.delete(guildId);
	}
}

export class myCustomStore implements QueueStoreManager {
	private redis: RedisClientType | MiniMap<string, string> | JSONStore;
	constructor(redisClient: RedisClientType | MiniMap<string, string> | JSONStore) {
		this.redis = redisClient;
	}
	async get(guildId): Promise<any> {
		return await this.redis.get(this.id(guildId));
	}
	async set(guildId, stringifiedQueueData): Promise<any> {
		// await this.delete(guildId); // redis requires you to delete it first;
		return await this.redis.set(this.id(guildId), stringifiedQueueData);
	}
	async delete(guildId): Promise<any> {
		// fallback for the JSONSTORe and the MINIMAP
		if ("delete" in this.redis) return await this.redis.delete(this.id(guildId));
		return await this.redis.del(this.id(guildId));
	}
	async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
		return typeof stringifiedQueueData === "string" ? JSON.parse(stringifiedQueueData) : stringifiedQueueData;
	}
	async stringify(parsedQueueData): Promise<any> {
		return typeof parsedQueueData === "object" ? JSON.stringify(parsedQueueData) : parsedQueueData;
	}
	// you can add more utils if you need to...
	private id(guildId) {
		return `lavalinkqueue_${guildId}`; // transform the id
	}
}

// you can make a custom queue watcher for queue logs!
export class myCustomWatcher implements QueueChangesWatcher {
	private client: BotClient;
	constructor(client: BotClient) {
		this.client = client;
	}
	shuffled(guildId, oldStoredQueue, newStoredQueue) {
		console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: Queue got shuffled`);
	}
	tracksAdd(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
		console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got added into the Queue at position #${position}`);
	}
	tracksRemoved(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
		console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got removed from the Queue at position #${position}`);
	}
}
