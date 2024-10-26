const { readdirSync, existsSync, lstatSync, rmdirSync, unlinkSync } = require('fs');
const { join } = require('path');

const deleteFolderRecursive = path => {
	if (!existsSync(path)) return console.error('No Path found for: ', path);
	readdirSync(path).forEach(file => {
		const curPath = join(path, file);
		if (lstatSync(curPath).isDirectory()) return deleteFolderRecursive(curPath);
		unlinkSync(curPath);
	});
	rmdirSync(path);
};

const folder = process.argv.slice(2)[0];

if (folder) {
	deleteFolderRecursive(join(__dirname, '../dist', folder));
} else {
	deleteFolderRecursive(join(__dirname, '../dist/cjs'));
	deleteFolderRecursive(join(__dirname, '../dist/esm'));
	deleteFolderRecursive(join(__dirname, '../dist/types'));
}
