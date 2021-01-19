import { Message, Permission, TextChannel } from "eris";
import Bot from "../main";
import Command from "../utils/command";
require("dotenv").config();

exports.handler = async function(message: Message): Promise<any> {
  if (message.author.bot || !message.content.startsWith(process.env.BOT_PREFIX!)) return;

  let args: string[] = message.content.slice(process.env.BOT_PREFIX!.length).toLowerCase().split(" ").map((item: string) => item.trim());
  let commandName: string = args.shift()!;
  const command: Command = this.cmds.find((cmd: Command) => cmd.props.name === commandName || (cmd.props.aliases && cmd.props.aliases.includes(commandName)))!;

  if (!command) return;

  const perms: Permission = (message.channel as TextChannel).permissionsOf(message.author.id);
  if (command.props.permissions && command.props.permissions.some((perm: string) => perms.has(perm))) {
    const req = command.props.permissions.filter((perm: string) => !perms.has(perm)).sort();
    return message.channel.createMessage({ embed: {
      title: "🔑 Missing Permissions",
      description: req.map((perm: string) => `\`${perm[0].toUpperCase + perm.slice(1)}\``).join(" "),
      color: this.embedColors.red
    }});
  }

  if (command.props.args) {
    for (const arg of command.props.args) {
      if (arg.required && arg.check && !arg.check({ bot: this, message, args })) {
        return message.channel.createMessage({ embed: {
          title: "🏷️ Missing Arguments",
          description: `Missing argument \`${arg.id}\` of \`${process.env.BOT_PREFIX}${command.props.description.usage}\``,
          color: this.embedColors.red
        }});
      }
    }
  }

  try {
    let res: any = await command.exec({
      bot: this,
      message,
      args
    })
    if (!res) return;

    if (res instanceof Object) {
      res = {
        content: res.content,
        file: res.file,
        embed: (res.embed ? res.embed : res)
      }
    }

    message.channel.createMessage(res, res.file);
  } catch (error: any) {
    console.log(error);
    message.channel.createMessage({ embed: {
      title: "⚠️ Error!",
      description: error.toString(),
      color: this.embedColors.red
    }});
  }
}