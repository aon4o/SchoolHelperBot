const { Permissions } = require('../Validation/Permissions');
const { Client } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');

const PG = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const table = new Ascii('Command Loader');

    await (await PG(`${process.cwd()}/src/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name) {
            return table.addRow(file.split('/')[7], '❌ Failed!', 'Missing Name');
        }

        if(!command.description) {
            return table.addRow(command.name, '❌ Failed!', 'Missing Name');
        }

        if(command.permission) {
            if(Permissions.includes(command.permission)) {
                command.defaultPermission = false;
            } else {
                await table.addRow(command.name, '❌ Failed!', 'Permission Invalid');
                return;
            }
        }

        await client.commands.set(command.name, command);
        await table.addRow(command.name, '✅ Success');
    });

    console.log(table.toString());
}