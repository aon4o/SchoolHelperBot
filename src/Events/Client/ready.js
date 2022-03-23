const { Client } = require('discord.js');
const {setCommandsToGuild} = require("../../Utils/setCommandsToGuild");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        const Guilds = await client.guilds.cache;

        Guilds.map(async (guild) => {
            await setCommandsToGuild(client, guild);
        })
        await client.user.setActivity(", Hello!", {type: 'WATCHING'});

        console.log('The Client is now Ready!');
    }
}