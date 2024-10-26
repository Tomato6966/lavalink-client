const { existsSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const writePackageJson = path => {
	if (!existsSync(path)) return console.error('no path found for: ', path);
	writeFileSync(
		join(path, '/package.json'),
		JSON.stringify({ type: path.endsWith('esm') ? 'module' : 'commonjs' }, null, 2),
	);
};

const folder = process.argv.slice(2)[0];

if (folder) {
	writePackageJson(join(__dirname, '../dist', folder));
} else {
	writePackageJson(join(__dirname, '../dist/cjs'));
	writePackageJson(join(__dirname, '../dist/esm'));
}
