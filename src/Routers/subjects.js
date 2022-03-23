const router = require('express').Router();
const bodyParser = require("express");
const {CATEGORY_CHANNEL_NAME} = require("../../config.json");
const {Permissions} = require("discord.js");

router.use(bodyParser.json());

router.route('/subjects')
    .post(async (request, response) => {
        const guild = request.client.guilds.cache.get(request.body.guild_id);
        const subject_name = request.body.subject;
        let categoryChannel = undefined;
        let endFlag = false;

        // CHECKING IF THE SERVER EXISTS
        if (!guild) {
            await response.status(404).send(`Сървър с id '${request.body.guild_id}' не съществува!`);
            return;
        }
        // CHECKING IF THE SUBJECT NAME EXISTS
        if (!subject_name) {
            await response.status(400).send(`Полето 'subject' не може да е празно!`);
            return;
        }

        // CHECKING IF THE CHANNEL FOR THE SUBJECT ALREADY EXISTS
        await guild.channels.fetch()
            .then(channels => {
                channels.map(async (ch) => {
                    if (ch.name === subject_name.toLowerCase()) {
                        await response.status(400).send(`Канал за предмет '${subject_name}' вече съществува!`)
                        endFlag = true;
                    }
                })
            })

        if (endFlag) {
            return;
        }

        // GETTING THE CATEGORY
        await guild.channels.fetch()
            .then(channels => {
                channels.map((ch) => {
                    if (ch.name === CATEGORY_CHANNEL_NAME && ch.type === "GUILD_CATEGORY") {
                        categoryChannel = ch;
                    }
                })
            })

        // CHECKING IF THE CATEGORY EXISTS
        if (!categoryChannel) {
            await response.status(400).send(`Сървърът с id '${request.body.guild_id}' не е инициализиран правилно!`)
            return;
        }

        // CREATING THE CHANNEL FOR THE SUBJECT
        await guild.channels.create(subject_name, {
            type: "GUILD_TEXT",
            topic: subject_name,
            parent: categoryChannel,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: Permissions.FLAGS.SEND_MESSAGES,
                    allow: Permissions.FLAGS.VIEW_CHANNEL
                }
            ]
        })

        await response.status(200).end();
    })
    .delete(async (request, response) => {
        const guild = request.client.guilds.cache.get(request.body.guild_id);
        const subject_name = request.body.subject;
        let channelToDelete = undefined;

        // CHECKING IF THE SERVER EXISTS
        if (!guild) {
            await response.status(404).send(`Сървър с id '${request.body.guild_id}' не съществува!`);
            return;
        }
        // CHECKING IF THE SUBJECT NAME EXISTS
        if (!subject_name) {
            await response.status(400).send(`Полето 'subject' не може да е празно!`);
            return;
        }

        // GETTING THE CHANNEL FOR THE SUBJECT
        await guild.channels.fetch()
            .then(channels => {
                channels.map(async (ch) => {
                    if (
                        ch.name === subject_name.toLowerCase() &&
                        ch.type === "GUILD_TEXT" && ch.parent &&
                        ch.parent.name === CATEGORY_CHANNEL_NAME
                    ) {
                        channelToDelete = ch;
                    }
                })
            })

        // CHECKING IF THE CHANNEL FOR THE SUBJECT EXISTS
        if (!channelToDelete) {
            await response.status(404).send(`Канал с име '${subject_name}' не беше открит!`);
            return;
        }

        await channelToDelete.delete()
        await response.status(200).end();
    });

module.exports = router;