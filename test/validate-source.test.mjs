import assert from "node:assert/strict";
import test from "node:test";

import { LavalinkManager } from "../dist/index.mjs";

function createManager(allowCustomSources) {
	return new LavalinkManager({
		nodes: [],
		sendToShard: () => {},
		playerOptions: { allowCustomSources },
	});
}

const node = {
	info: { sourceManagers: ["archive"] },
	_checkForSources: false,
};

test("allows custom source strings when allowCustomSources is enabled", () => {
	const manager = createManager(true);

	assert.doesNotThrow(() => {
		manager.utils.validateSourceString(node, "arcsearch");
	});
});

test("rejects custom source strings when allowCustomSources is disabled", () => {
	const manager = createManager(false);

	assert.throws(
		() => manager.utils.validateSourceString(node, "arcsearch"),
		/Lavalink-Client does not support SearchQuerySource/,
	);
});
