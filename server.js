const bodyParser = require('body-parser');
const Ascii = require('ascii-table');
const status = require('./src/Routers/status');
const messages = require('./src/Routers/messages');
const subjects = require('./src/Routers/subjects');
const classes = require('./src/Routers/classes');

module.exports = async (server, client) => {
    const table = new Ascii('Express Sever');

    server.use(bodyParser.json());
    server.use('', (request, response, next) => {
        request.client = client;
        next();
    })

    // INDEX
    server.get('/', (request, response) => {
        response.send(`Hello, I'm ${client.user.username}.`);
        console.log('hello world', client.user.username);
    })

    // SETTING THE ROUTERS
    try {
        await server.use(status);
        await table.addRow('"Status" Router', '✅ Success');
    } catch (error) {
        await table.addRow('"Status" Router', '❌ Failed!');
    }
    try {
        await server.use(messages);
        await table.addRow('"Messages" Router', '✅ Success');
    } catch (error) {
        await table.addRow('"Messages" Router', '❌ Failed!');
    }
    try {
        await server.use(subjects);
        await table.addRow('"Subjects" Router', '✅ Success');
    } catch (error) {
        await table.addRow('"Subjects" Router', '❌ Failed!');
    }
    try {
        await server.use(classes);
        await table.addRow('"Classes" Router', '✅ Success');
    } catch (error) {
        await table.addRow('"Classes" Router', '❌ Failed!');
    }

    console.log(table.toString());
}
