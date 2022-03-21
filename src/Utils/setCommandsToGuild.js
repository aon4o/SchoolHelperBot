const { Client, Guild } = require('discord.js');

/**
 * @param {Client} client
 * @param {Guild} guild
 */
const setCommandsToGuild = async (client, guild) => {

    const commands = [];
    await client.commands.map((command) => {
        commands.push(command);
    })

    await guild.commands.set(client.commands).then(async (command) => {
        const Roles = (commandName) => {
            const commandPermissions = commands.find((command) => command.name === commandName).permission;

            if (!commandPermissions) {
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

        await guild.commands.permissions.set({fullPermissions});
    });
}

module.exports = { setCommandsToGuild };