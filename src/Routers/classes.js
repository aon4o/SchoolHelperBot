const router = require('express').Router();
const bodyParser = require("express");
const {CATEGORY_CHANNEL_NAME} = require("../../config.json");
const {MessageEmbed} = require("discord.js");

router.use(bodyParser.json());

router.route('/classes')
    .delete(async (request, response) => {
        const guild_id = await request.body.guild_id;
        let guildToBeDeactivated = undefined;
        let guildCategory = false;
        let MainChannel = undefined;
        const endEmbed = new MessageEmbed();

        // GETTING THE GUILD TO BE DELETED
        request.client.guilds.cache.map(async (guild) => {
            if (guild.id === guild_id) {
                guildToBeDeactivated = guild;
            }
        });

        if (guildToBeDeactivated === undefined) {
            await response.status(404).send(`Канал с id '${guild_id}' не беше намерен!`);
            return;
        }

        // GETTING THE GENERAL TEXT CHANNEL FOR SENDING AN INFO MESSAGE
        await guildToBeDeactivated.channels.fetch()
            .then((channels) => {
                channels.map((channel) => {
                    if (channel.name.toLowerCase() === 'general' && channel.isText()) {
                        MainChannel = channel;
                    }
                })
            })

        // CHECKING IF GUILD CATEGORY FOR SCHOOL EXISTS
        await guildToBeDeactivated.channels.fetch()
            .then(channels => {
                channels.map((channel) => {
                    if (channel.name === CATEGORY_CHANNEL_NAME) {
                        if (channel.type === 'GUILD_CATEGORY') {
                            guildCategory = channel;
                        }
                    }
                })
            })

        // DELETING THE SCHOOL CHANNELS IF THEY EXIST
        if (guildCategory) {
            guildCategory.children.map(async channel => {
                await channel.delete();
            })
            await guildCategory.delete();
        }

        // SENDING MESSAGE IF THERE IS MAIN CHANNEL PRESENT
        if (MainChannel) {
            await endEmbed
                .setColor('PURPLE')
                .setDescription(`Сървърът Ви беше деактивиран.`);
            await MainChannel.send({embeds: [endEmbed]});
        }

        await response.status(200).end();
    });

module.exports = router;