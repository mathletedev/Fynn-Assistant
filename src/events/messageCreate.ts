import { Message, TextChannel } from "eris";
import Command from "../utils/command";
require("dotenv").config();

exports.handler = async function (message: Message<TextChannel>): Promise<any> {
	if (message.author.bot) return;

	if (
		message.channel.parentID &&
		message.channel.parentID === process.env.HELP_AVAILABLE &&
		!message.content.startsWith(process.env.BOT_PREFIX!)
	) {
		message.channel.edit(
			{
				parentID: process.env.HELP_ONGOING
			},
			"Help Ongoing"
		);
		return;
	}

	let args: string[] = message.content
		.slice(process.env.BOT_PREFIX!.length)
		.toLowerCase()
		.split(" ")
		.map((item: string) => item.trim());

	let commandName: string = args.shift()!;
	const command: Command = this.cmds.find(
		(cmd: Command) =>
			cmd.props.name === commandName ||
			(cmd.props.aliases && cmd.props.aliases.includes(commandName))
	)!;

	if (!command) return;
	if (
		message.channel.parentID &&
		command.props.name !== "close" &&
		(message.channel.parentID === process.env.HELP_ONGOING ||
			message.channel.parentID === process.env.HELP_AVAILABLE)
	) {
		message.delete();
		return;
	}

	let res: any = await command.exec({
		bot: this,
		message,
		args
	});
	if (!res) return;

	if (res instanceof Object) {
		res = {
			content: res.content,
			file: res.file,
			embed: res.embed ? res.embed : res
		};

		if (!res.embed.color) {
			res.embed.color = this.embedColors[
				this.utils.getEmbedColor(command.props.category)
			];
		}

		if (!res.embed.footer || !res.embed.footer.text) {
			res.embed.footer = this.utils.getFooter(message.author);
		} else {
			res.embed.footer = this.utils.getFooter(
				message.author,
				res.embed.footer.text
			);
		}
	}

	message.channel.createMessage(res, res.file);
};
