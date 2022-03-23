const { Events } = require('../Validation/EventNames');
const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');

const PG = promisify(glob);

module.exports = async (client) => {
    const table = new Ascii('Events Loader');

    (await PG(`${process.cwd()}/src/Events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (!Events.includes(event.name) || !event.name) {
            const L = file.split('/');
            return table.addRow(
                `${event.name || 'MISSING'}`,
                '❌ Failed!',
                `Event name is either invalid or missing: ${L[6]}/${L[7]}`
            );
        }

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        await table.addRow(event.name, '✅ Success');
    });

    console.log(table.toString());
}