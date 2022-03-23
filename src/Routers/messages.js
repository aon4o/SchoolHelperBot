const router = require('express').Router();
const bodyParser = require("express");
const {MessageEmbed} = require("discord.js");

router.use(bodyParser.json());

router.route('/messages')
    .post(async (request, response) => {
        const guild = request.client.guilds.cache.get(request.body.guild_id);
        let channel = undefined;

        // CHECKING IF THE SERVER EXISTS
        if (!guild) {
            await response.status(404).send(`Сървър с id '${request.body.guild_id}' не съществува!`);
        }

        // GETTING THE CHANNEL FOR THE SUBJECT
        await guild.channels.fetch()
            .then(channels => {
                channels.map((ch) => {
                    if (ch.name === request.body.subject.toLowerCase() && ch.isText()) {
                        channel = ch;
                    }
                })
            })

        // CHECKING IF THE CHANNEL EXISTS AND SENDING THE MESSAGE
        if (channel) {
            const embed = new MessageEmbed()
                .setColor("GOLD")
                .setTitle(request.body.title)
                .setDescription(request.body.text)
                .setAuthor({name: request.body.user})
                .setFooter({text: ''});

            await channel.send({embeds: [embed]});
            response.status(200).end();
        } else {
            await response.status(404).send(`Този сървър няма Канал за предмет '${request.body.subject}'!`);
        }
    })

module.exports = router;