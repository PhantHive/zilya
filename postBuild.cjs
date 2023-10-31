const fs = require('fs');
const path = require('path');

function fixImportPaths(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // Recursively apply the fixes to all subdirectories
            fixImportPaths(filePath);
        } else if (filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf-8');

            // Replace with { type: 'json' } with assert { type: 'json' }
            let updatedContent = content.replace(/with\s*\{\s*type\s*:\s*'json'\s*\}/g, "assert { type: 'json' }");

            // Remove assert { type: 'json' }
            updatedContent = updatedContent.replace(/,\s*assert\s*:\s*\{\s*type\s*:\s*'json'\s*\}/g, '');

            // Add .js extension to imports
            updatedContent = updatedContent.replace(/from\s*["']([^"']+?)["']/g, (match, importPath) => {
                // Skip if it's a node module, HTTP/HTTPS import, or already has .js extension
                if (/^(\w|@)|(\:\/\/)/.test(importPath) || importPath.endsWith('.js') || importPath.endsWith('.json')) {
                    return match;
                }

                // Skip if it's an import from "dotenv"
                if (importPath === 'dotenv') {
                    console.log('Skipped:', match);
                    return match;
                }

                // Add .js extension
                const newImport = `from '${importPath}.js'`;
                console.log('Updated:', match, 'to', newImport);
                return newImport;
            });

            // If updates were made, write the updated content back to the file
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent);
                console.log('File updated:', filePath);
            }
        }
    }
}

fixImportPaths('./dist');
