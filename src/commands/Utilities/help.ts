import Command from "../../utils/command";
import { MessageArgs, Embed } from "../../utils/interfaces";
require("dotenv").config();

const emojis: Record<string, string> = {
  Utilities: "🛠️"
}

export default class HelpCommand extends Command {
  public constructor() {
    super({
      name: "help",
      aliases: ["commands", "cmds"],
      category: "Utilities",
      description: {
        content: "Get info and help on commands!",
        usage: "help [ command ]",
        examples: [
          "help",
          "help ping"
        ]
      },
      args: [
        {
          id: "command",
          required: false
        }
      ]
    });
  }

  public async exec({ bot, message, args }: MessageArgs): Promise<Embed | string> {
    if (args.length) {
      const command: Command = bot.cmds.find(cmd => cmd.props.name === args[0].toLowerCase() || (cmd.props.aliases && cmd.props.aliases.includes(args[0].toLowerCase())))!;

      if (!command || !command.props.name) return `No information found on the command \`${args[0].toLowerCase()}\``;

      let info = `❯ **Command**: \`${command.props.name}\``;
      if (command.props.aliases) info += `\n❯ **Aliases**: ${command.props.aliases.sort().map((alias: string) => `\`${alias}\``).join(" ")}`;
      info += `\n❯ **Description**: ${command.props.description.content}\n❯ **Category**: ${command.props.category}`;
      if (command.props.permissions!.length) info += `\n❯ **Permissions**: ${command.props.permissions!.map((perm: string) => `\`${perm}\``).join(" ")}`;
      info += `\n❯ **Usage**: \`${command.props.description.usage}\`\n❯ **Examples**:\n${command.props.description.examples.map((example: string) => `\`${example}\``).join("\n")}`;

      return {
        title: "📖 Help",
        description: info,
        color: bot.embedColors.blue,
        footer: {
          text: message.author.username,
          icon_url: message.author.dynamicAvatarURL("png")
        }
      }
    } else {
      const commands = (cat: string): string => {
        return bot.cmds
          .filter((cmd: Command) => cmd.props.category === cat)
          .map((cmd: Command) => `\`${cmd.props.name}\``)
          .join("\n");
      }

      return {
        title: "📖 Help",
        description: `Type \`${process.env.BOT_PREFIX}help [ command ]\` to see info on that command!`,
        fields: bot.categories.map((cat: string) => ({ name: `${emojis[cat]} ${cat}`, value: commands(cat), inline: true })),
        color: bot.embedColors.blue,
        footer: {
          text: message.author.username,
          icon_url: message.author.dynamicAvatarURL("png")
        }
      }
    }
  }
}