import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

// This is a simplified regex. A more robust one might be needed for a real-world scenario.
const tableRegex = /## Properties\s*\n\n\|.*?\|\n\|.*?\|\n([\s\S]*?)(?=\n\n|\n$)/g;

function modifyTableMarkdown(markdown) {
    return markdown.replace(tableRegex, (fullMatch, content) => {
        const rows = content.split('\n').filter(line => line.trim().startsWith('|'));
        if (rows.length === 0) return fullMatch;

        const headerRow = fullMatch.split('\n')[2];
        const headers = headerRow.split('|').map(h => h.trim().toLowerCase()).filter(h => h);

        const getColumnIndex = (columnName) => headers.indexOf(columnName.toLowerCase());

        const propertyIndex = getColumnIndex('property');
        const typeIndex = getColumnIndex('type');
        const defaultValueIndex = getColumnIndex('default value');
        const descriptionIndex = getColumnIndex('description');
        const definedInIndex = getColumnIndex('defined in');
        const overridesIndex = getColumnIndex('overrides');

        if (propertyIndex === -1 || typeIndex === -1) {
            return fullMatch;
        }

        let hasDefaultValues = false;
        let hasDescription = false;

        const newRows = rows.map(row => {
            const cells = row.split('|').map(cell => cell.trim());

            const propertyCell = cells[propertyIndex + 1] || '';
            const typeCell = cells[typeIndex + 1] || '';
            let defaultValueCell = defaultValueIndex !== -1 ? cells[defaultValueIndex + 1] : '';
            let descriptionCell = descriptionIndex !== -1 ? cells[descriptionIndex + 1] : '';
            const definedInCell = definedInIndex !== -1 ? cells[definedInIndex + 1] : '';

            const overridesCell = overridesIndex !== -1 ? cells[overridesIndex + 1] : '';
            let combinedDefinedIn = definedInCell;
            if (overridesCell && overridesCell !== '-') {
                combinedDefinedIn = `{${overridesCell}} <br/> ${definedInCell}`;
            }

            if (defaultValueCell && defaultValueCell !== '-') {
                hasDefaultValues = true;
            } else {
                defaultValueCell = '';
            }

            if (descriptionCell && descriptionCell !== '-') {
                hasDescription = true;
            } else {
                descriptionCell = '';
            }

            if (descriptionCell.length > 200) {
                descriptionCell = descriptionCell.substring(0, 200) + "...";
            }

            const newPropertyCell = combinedDefinedIn ? `${propertyCell} <br/> *(${combinedDefinedIn})*` : propertyCell;

            return {
                property: newPropertyCell,
                type: typeCell,
                defaultValue: defaultValueCell,
                description: descriptionCell
            };
        });

        // Use arrays to build the header and rows
        const headerCells = ['Property (defined in)', 'Type'];
        const separatorCells = ['---', '---'];

        if (hasDefaultValues) {
            headerCells.push('Default value');
            separatorCells.push('---');
        }

        if (hasDescription) {
            headerCells.push('Description');
            separatorCells.push('---');
        }

        const newHeader = `| ${headerCells.join(' | ')} |`;
        const newHeaderSeparator = `| ${separatorCells.join(' | ')} |`;

        const outputRows = newRows.map(row => {
            const rowCells = [row.property, row.type];
            if (hasDefaultValues) {
                rowCells.push(row.defaultValue);
            }
            if (hasDescription) {
                rowCells.push(row.description);
            }
            return `| ${rowCells.join(' | ')} |`;
        });

        const newTableContent = `${newHeader}\n${newHeaderSeparator}\n${outputRows.join('\n')}`;
        return `## Properties\n\n${newTableContent}`;
    });
}
async function processDocumentation() {
    console.log(chalk.cyan.bold(`\n--- Starting Documentation Cleanup ---\n`));

    const docsPath = path.resolve('./src/content/docs/api');
    const files = fs.readdirSync(docsPath, { recursive: true }).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

    console.log(chalk.yellow(`📝 Found ${chalk.bold(files.length)} files to check.`));

    let modifiedCount = 0;

    for (const file of files) {
        const filePath = path.join(docsPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('## Properties')) {
            console.log(chalk.green(`✅ Optimizing properties table in: ${chalk.white.italic(file)}`));
            content = modifyTableMarkdown(content);
            fs.writeFileSync(filePath, content);
            modifiedCount++;
        } else {
            console.log(chalk.gray(`⚪ Skipping ${chalk.white.italic(file)} (no properties table found).`));
        }
    }

    console.log(chalk.cyan.bold(`\n--- Finished Documentation Cleanup ---\n`));
    console.log(chalk.bgGreen.black(` 🎉 Successfully optimized ${modifiedCount} tables. `));
    console.log(chalk.bgBlue.black(` ℹ️  Skipped ${files.length - modifiedCount} files. `));
}

processDocumentation();
