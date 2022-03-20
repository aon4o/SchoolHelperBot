const { Client, Collection } = require('discord.js');
const { TOKEN } = require('./config.json');

const client = new Client({intents: 32767});

client.commands = new Collection();

require('./src/Handlers/Events')(client);
require('./src/Handlers/Commands')(client);

client.login(TOKEN);