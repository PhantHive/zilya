const fs = require('fs-extra');

async function copyAssets() {
    try {

        // Copy data directory
        await fs.copy('src/assets/data', 'dist/assets/data');

        // Copy fonts directory
        await fs.copy('src/assets/fonts', 'dist/assets/fonts');

        // Copy img directory
        await fs.copy('src/assets/img', 'dist/assets/img');

        // Copy phearion directory
        await fs.copy('src/assets/phearion', 'dist/assets/phearion');

        // Copy utils directory
        await fs.copy('src/assets/utils', 'dist/assets/utils');

        // for paladins subfolders, copy all js files located in paladins/src
        await fs.copy('src/SlashCommands/paladins/subcommands/src', 'dist/SlashCommands/paladins/subcommands/src');


        console.log('Assets copied successfully.');
    } catch (error) {
        console.error('Error copying assets:', error);
    }
}

copyAssets();
