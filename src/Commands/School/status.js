const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
require('../../Events/Client/ready');
const axios = require("axios");
const {API_URL} = require("../../../config.json");

module.exports = {
    name: 'status',
    description: 'Показава Статуса на Бота, Сървъра и Учебните канали.',

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const responseEmbed = new MessageEmbed()
            .setColor("AQUA")

        let responseText =
            `**Бот**: :green_circle: \`НА ЛИНИЯ\` - \`${client.ws.ping}ms\`
            **Пуснат от**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n`;

        await axios({
            url: '/status',
            method: 'get',
            baseURL: API_URL,
            responseType: "json",
            data: {guild_id: interaction.guild.id}
        })
            .then(() => {
                responseText += `**Сървър**: :green_circle: \`НА ЛИНИЯ\`\n`;
                responseText += `**Учебни Канали**: :green_circle: \`АКТИВНИ\`\n`;
            })
            .catch(async error => {
                if (error.response) {
                    responseText += `**Сървър**: :green_circle: \`НА ЛИНИЯ\`\n`;
                    responseText += `**Учебни Канали**: :red_circle: \`НЕАКТИВНИ\`\n`;
                } else if (error.request) {
                    responseText += `**Сървър**: :red_circle: \`ИЗВЪН ЛИНИЯ\`\n`;
                    responseText += `**Учебни Канали**: :yellow_circle: \`НЕДОСТЪПНО\`\n`;
                } else {
                    responseText += `**Сървър**: :yellow_circle: \`НЕДОСТЪПНО\`\n`;
                    responseText += `**Учебни Канали**: :yellow_circle: \`НЕДОСТЪПНО\`\n`;
                }
            });

        await responseEmbed.setDescription(responseText);

        await interaction.reply({embeds: [responseEmbed]});
    }
}