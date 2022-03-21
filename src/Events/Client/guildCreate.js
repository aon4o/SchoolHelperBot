const { Client, Guild, MessageEmbed} = require('discord.js');
const { setCommandsToGuild } = require('../../Utils/setCommandsToGuild')

module.exports = {
    name: 'guildCreate',

    /**
     * @param {Client} client
     * @param {Guild} guild
     */
    async execute(guild, client) {

        let MainChannel = undefined;
        const responseEmbed = new MessageEmbed().setColor("LUMINOUS_VIVID_PINK");

        // GETTING THE GENERAL TEXT CHANNEL FOR SENDING A HELLO MESSAGE
        await guild.channels.fetch()
            .then((channels) => {
                channels.map((channel) => {
                    if (channel.name.toLowerCase() === 'general' && channel.isText()) {
                        MainChannel = channel;
                    }
                })
            })

        // CREATING THE HELLO MESSAGE
        const success =
            `Здравейте,
            Аз съм \`SchoolHelperBot\` :robot: и съм тук за да Ви изпращам съобщения :newspaper: от учителите Ви :teacher:.
            Надявам се не ви досаждам много, но за жалост това не зависи от мен :smiley:!\n
            За да активирате сървъра си :green_circle:, Admin трябва да използва командата \`/init *key*\`,
            като ключът :key: трябва да Ви бъде предоставен от Класния Ръководител или Администратор.
            За повече информация :information_source: може да използвате командата \`/help\`.`;
        const failure =
            `Здравейте,
            Аз съм \`SchoolHelperBot\` :robot:!
            За жалост нещо се обърка :red_circle: и не можах да заредя функциите си :disappointed_relieved:.
            Опитайте се да ме поканите отново или се свържете с Админ за помощ :sos:.`;

        // SETTING THE COMMANDS TO THE NEW DISCORD SERVER
        await setCommandsToGuild(client, guild)
            .then(() => responseEmbed.setDescription(success))
            .catch(() => responseEmbed.setDescription(failure));

        // SENDING THE HELLO MESSAGE AND LOGGING
        if (MainChannel) {
            await MainChannel.send({embeds: [responseEmbed]});
        }
        console.log(`The Client joined guild \`${guild.name}\`.`);
    }
}