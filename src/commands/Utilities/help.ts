import Command from "../../utils/command";
import { EmbedOptions } from "eris";
import { MessageArgs } from "../../utils/interfaces";
require("dotenv").config();

const emojis: Record<string, string> = {
  Study: "📖",
  Utilities: "🛠️"
};

module.exports = new Command(
  {
    name: "help",
    aliases: ["commands", "cmds"],
    category: "Utilities",
    description: {
      content: "Get help and info on commands!",
      usage: "help [ command ]",
      examples: ["help", "help ping"]
    }
  },

  async ({ bot, message, args }: MessageArgs): Promise<EmbedOptions | string> => {
    if (args.length) {
      const command: Command = bot.cmds.find(cmd => cmd.props.name === args[0] || (cmd.props.aliases && cmd.props.aliases.includes(args[0])))!;

      if (!command || !command.props.name) return `No information found on the command \`${args[0]}\``;

      let info = `❯ **Command:** \`${command.props.name}\``;
      if (command.props.aliases) info += `\n❯ **Aliases:** ${command.props.aliases.sort().map((alias: string) => `\`${alias}\``).join(" ")}`;
      info += `\n❯ **Description:** ${command.props.description.content}\n❯ **Category:** ${command.props.category}`;
      if (command.props.permissions!.length) info += `\n❯ **Permissions:** ${command.props.permissions!.map((perm: string) => `\`${perm}\``).join(" ")}`;
      info += `\n❯ **Usage:** \`${command.props.description.usage}\`\n❯ **Examples:**\n${command.props.description.examples.map((example: string) => `\`${example}\``).join("\n")}`;

      return {
        title: "📓 Help",
        description: info,
        color: bot.embedColors.blue,
        footer: bot.utils.getFooter(message.author)
      };
    } else {
      const commands = (cat: string): string => {
        return bot.cmds
          .filter((cmd: Command) => cmd.props.category === cat)
          .map((cmd: Command) => `\`${cmd.props.name}\``)
          .join("\n");
      }

      return {
        title: "📓 Help",
        description: `Type \`${process.env.BOT_PREFIX}help [ command ]\` to see info on that command!`,
        fields: bot.categories.map((cat: string) => ({ name: `${emojis[cat]} ${cat}`, value: commands(cat), inline: true })),
        color: bot.embedColors.blue,
        footer: bot.utils.getFooter(message.author)
      };
    }
  }
);