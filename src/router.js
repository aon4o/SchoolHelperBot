const Ascii = require('ascii-table');

module.exports = async (server, client) => {
    const table = new Ascii('Express Sever');

    server.get('/', (request, response) => {
        response.send('hello world');
        console.log('hello world', client);
    })

    await table.addRow('Started Successfully');
    console.log(table.toString());
}