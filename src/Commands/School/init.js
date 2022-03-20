const { Client, CommandInteraction, MessageEmbed, Permissions} = require('discord.js');
require('../../Events/Client/ready');
const axios = require("axios");
const {API_URL} = require("../../../config.json");
const handleFetchError = require("../../Utils/handleFetchError");

module.exports = {
    name: 'init',
    description: 'Initialize the School Discord Channels!',

    options: [
        {
            name: 'key',
            description: "Ключът нужен за Инициализиране на Учебния Discord сървър..",
            type: 'STRING',
            required: true
        },
    ],

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { options } = interaction;
        const key = options.getString('key');

        const guildCategoryName = 'school channels';
        let subjects = {};
        let guildCategory = false;

        const responseEmbed = new MessageEmbed();
        let endFlag = false;

        // CHECKING IF GUILD CATEGORY ALREADY EXISTS
        await interaction.guild.channels.fetch()
            .then(channels => {
                channels.map((channel) => {
                    if (channel.name === guildCategoryName) {
                        if (channel.type === 'GUILD_CATEGORY') {
                            guildCategory = channel;
                        }
                    }
                })
            })


        // CREATING THE GUILD CATEGORY FOR SCHOOL CHANNELS IF IT DOES NOT EXIST
        if (!guildCategory) {
            await interaction.guild.channels.create(guildCategoryName, {type: "GUILD_CATEGORY"})
                .then(response => {
                    guildCategory = response;
                })
                .catch(error => {
                    console.log(error);
                    responseEmbed
                        .setColor("RED")
                        .setDescription('Възникна грешка при създаването на Категория за Канали!');
                    endFlag = true;
                });
        }
        if (endFlag) {
            await interaction.reply({embeds: [responseEmbed]});
            return;
        }


        // FETCHING THE SUBJECTS FOR THE CLASS FROM THE API
        await axios({
            url: '/init',
            method: 'put',
            baseURL: API_URL,
            responseType: "json",
            data: {key: key, guild_id: interaction.guild.id}
        })
            .then(response => {subjects = response.data})
            .catch(async error => {
                await handleFetchError(error, interaction);
                if (error.response.status === 404) {
                    guildCategory.delete();
                }
                endFlag = true;
            });

        if (endFlag) return;


        for (let subject of subjects) {
            console.log(subject)
            let flag = false;
            for (let channel of guildCategory.children) {
                console.log(channel)
                if (channel.name === subject.name) {
                    flag = true;
                    break;
                }
            }
            if (flag) continue;
            await interaction.guild.channels.create(subject.name, {
                type: "GUILD_TEXT",
                topic: subject.name,
                parent: guildCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: Permissions.FLAGS.SEND_MESSAGES,
                        allow: Permissions.FLAGS.VIEW_CHANNEL
                    }
                ]
            })
        }

        await responseEmbed
            .setColor('GREEN')
            .setDescription(
                `Сървърът беше активиран успешно.\n
                Успешно бяха създадени ${subjects.length} учебни канала.`
            );
        await interaction.reply({embeds: [responseEmbed]});
    }
}