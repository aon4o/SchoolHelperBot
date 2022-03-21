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
    const table = new Ascii('Command Loader')

    const commands = [];

    (await PG(`${process.cwd()}/src/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name) {
            return table.addRow(file.split('/')[7], 'Failed!', 'Missing Name');
        }

        if(!command.description) {
            return table.addRow(command.name, 'Failed!', 'Missing Name');
        }

        if(command.permission) {
            if(Permissions.includes(command.permission)) {
                command.defaultPermission = false;
            } else {
                return table.addRow(command.name, 'Failed!', 'Permission Invalid');
            }
        }

        client.commands.set(command.name, command);
        commands.push(command);

        await table.addRow(command.name, 'Successful');
    });

    console.log(table.toString());

//    PERMISSIONS CHECK
    client.on('ready', async () => {
        const Guilds = await client.guilds.cache;

        Guilds.map((guild) => {
            guild.commands.set(commands).then(async (command) => {
                const Roles = (commandName) => {
                    const commandPermissions = commands.find((command) => command.name === commandName).permission;

                    if(!commandPermissions) {
                        return null;
                    }

                    return guild.roles.cache.filter((role) => role.permissions.has(commandPermissions));
                }

                const fullPermissions = command.reduce((accumulator, role) => {
                    const roles = Roles(role.name);
                    if (!roles) {
                        return accumulator;
                    }

                    const permissions = roles.reduce((a, role) => {
                        return [...a, {id: role.id, type: 'ROLE', permission: true}];
                    }, []);

                    return [...accumulator, {id: role.id, permissions}];
                }, [])

                await guild.commands.permissions.set({ fullPermissions });
            });
        })
    })
}