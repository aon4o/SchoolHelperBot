const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "clear",
    description: 'Изтрива съобщения от текущия Канал.',
    permission: "SEND_MESSAGES",

    options: [
        {
            name: 'amount',
            description: "Броят съобщения, които трябва да бъдат изтрити.",
            type: 'NUMBER',
            required: true
        },
        {
            name: 'target',
            description: "Човекът, чиито съобщения трябва да бъдат изтрити.",
            type: 'USER',
            required: false
        }
    ],

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { channel, options } = interaction;

        const amount = options.getNumber('amount');
        const target = options.getUser('target');

        const messages = await channel.messages.fetch();

        const response = new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK");

        if (target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((m) => {
                if (m.author.id === target.id && amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true)
                .then(messages => {
                    response
                        .setDescription(`Изтрити са **${messages.size}** съобщения на ${target}.`);
                    interaction.reply({embeds: [response]});
                })
        }
        else {
            await channel.bulkDelete(amount, true)
                .then(messages => {
                    response.setDescription(`Изтрити са **${messages.size}** съобщения от този канал.`);
                    interaction.reply({embeds: [response]});
                })
        }
    }
}