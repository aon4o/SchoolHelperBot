const { Client } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        console.log('The Client is now Ready!');
        client.user.setActivity(", Hello!", {type: 'WATCHING'});
    }
}