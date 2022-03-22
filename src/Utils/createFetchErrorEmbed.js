const {MessageEmbed} = require("discord.js");

/**
 * @param error
 */
const createFetchErrorEmbed = async (error) => {

    const errorEmbed = new MessageEmbed()
        .setColor("RED")

    if (error.response) {
        errorEmbed
            .setDescription(error.response.data.detail);
    } else if (error.request) {
        errorEmbed
            .setDescription('Възникна грешка при извличането на информация от Сървъра.');
    } else {
        errorEmbed
            .setDescription(error.message);
    }

    return errorEmbed;
}

module.exports = createFetchErrorEmbed;