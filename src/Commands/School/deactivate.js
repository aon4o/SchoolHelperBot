const { Client, CommandInteraction, MessageEmbed} = require('discord.js');
require('../../Events/Client/ready');
const axios = require("axios");
const {API_URL} = require("../../../config.json");
const handleFetchError = require("../../Utils/handleFetchError");

module.exports = {
    name: 'deactivate',
    description: 'Deactivates the School Discord Channels!',

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const guildCategoryName = 'school channels';
        let guildCategory = false;

        const channelsEmbed = new MessageEmbed();
        const endEmbed = new MessageEmbed();

        let endFlag = false;

        // DEACTIVATING THE SERVER IN FROM THE API
        await axios({
            url: '/deactivate',
            method: 'put',
            baseURL: API_URL,
            responseType: "json",
            data: {guild_id: interaction.guild.id}
        })
            .then()
            .catch(async error => {
                await handleFetchError(error, interaction);
                endFlag = true;
            });

        if (endFlag) return;

        // CHECKING IF GUILD CATEGORY ROR SCHOOL EXISTS
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

        // DELETING THE SCHOOL CHANNELS IF THEY EXIST
        if (guildCategory) {
            guildCategory.children.map(async channel => {
                await channel.delete();
            })
            await guildCategory.delete();
            await channelsEmbed
                .setColor("GREEN")
                .setDescription(`Учебните канали бяха изтрити успешно.`);
        } else {
            await channelsEmbed
                .setColor("RED")
                .setDescription(`Не бяха намерени Учебни канали за премахване!`);
        }

        await endEmbed
            .setColor('GREEN')
            .setDescription(`Сървърът бе успешно деактивиран.`);
        await interaction.reply({embeds: [channelsEmbed, endEmbed]});
    }
}