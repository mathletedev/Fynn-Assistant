import { Message, TextChannel } from "eris";
import Command from "../utils/command";
require("dotenv").config();

exports.handler = async function(message: Message<TextChannel>): Promise<any> {
  if (message.author.bot || !message.content.startsWith(process.env.BOT_PREFIX!)) return;

  let args: string[] = message.content.slice(process.env.BOT_PREFIX!.length).toLowerCase().split(" ").map((item: string) => item.trim());
  
  let commandName: string = args.shift()!;
  const command: Command = this.cmds.find((cmd: Command) => cmd.props.name === commandName || (cmd.props.aliases && cmd.props.aliases.includes(commandName)))!;

  if (!command) return;

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
      embed: (res.embed ? res.embed : res)
    };
  }

  message.channel.createMessage(res, res.file);
}