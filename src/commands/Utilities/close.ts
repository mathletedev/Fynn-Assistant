import { EmbedOptions } from "eris";
import Command from "../../utils/command";
import { MessageArgs } from "../../utils/interfaces";
require("dotenv").config();

module.exports = new Command(
	{
		name: "close",
		aliases: ["stop", "exit"],
		category: "Utilities",
		description: {
			content:
				"Close a help channel for others to use! (It can only be used in a Help Ongoing channel)",
			usage: "close",
			examples: ["close"]
		}
	},

	async ({ bot, message }: MessageArgs): Promise<EmbedOptions | void> => {
		if (message.channel.parentID !== process.env.HELP_ONGOING) return;

		message.channel.edit(
			{ parentID: process.env.HELP_AVAILABLE },
			"Help Available"
		);
		return {
			title: "🙋 Help Available",
			description: `Start typing in the chat to get help!\n\n❯ Please give a detailed description of your question\n❯ Include images / text if possible\n❯ Be patient! Someone will be there to help you\n❯ Please don't use commands in this channel (except for closing)\n\nType \`${process.env.BOT_PREFIX}close\` in order to close the help channel!`
		};
	}
);
