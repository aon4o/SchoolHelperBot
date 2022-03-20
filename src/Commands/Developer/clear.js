const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "clear",
    description: 'Remove messages from the current Channel.',
    permission: "SEND_MESSAGES",

    options: [
        {
            name: 'amount',
            description: "The amount of messages to be deleted.",
            type: 'NUMBER',
            required: true
        },
        {
            name: 'target',
            description: "The target whose messages should be deleted.",
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
                        .setDescription(`Cleared ${messages.size} from ${target}.`);
                    interaction.reply({embeds: [response]});
                })
        }
        else {
            await channel.bulkDelete(amount, true)
                .then(messages => {
                    response.setDescription(`Cleared ${messages.size} from this channel.`);
                    interaction.reply({embeds: [response]});
                })
        }
    }
}