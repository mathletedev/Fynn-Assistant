import { Permission, TextChannel, Embed } from "eris";
import { CommandArgs, MessageArgs, Argument } from "./interfaces";

export default class Command {
  public props: CommandArgs;
  public execCommand: (messageArgs: MessageArgs) => Promise<Embed | string | void>;

  public constructor(props: CommandArgs, exec: (messageArgs: MessageArgs) => Promise<Embed | string | void>) {
    this.props = props;
    this.execCommand = exec;
  }

  public async exec({ bot, message, args }: MessageArgs): Promise<Embed | string | void> {
    const perms: Permission = (message.channel as TextChannel).permissionsOf(message.author.id);

    if (this.props.permissions) {
      const req: string[] = this.props.permissions.filter(perm => !perms.has(perm));
      if (req.length > 0) {
        return {
          type: "rich",
          title: "🔑 Missing Permissions",
          description: req.sort().map((perm: string) => `\`${perm[0].toUpperCase + perm.slice(1)}\``).join(" "),
          color: bot.embedColors.red,
          footer: bot.utils.getFooter(message.author)
        }
      }
    }

    if (this.props.args) {
      for (let i: number = 0; i < this.props.args.length; i++) {
        const arg: Argument = this.props.args[i];
        if ((arg.required && !args[i]) || (args[i] && arg.valid && !arg.valid({ bot, message, arg: args[i] }))) {
          return {
            type: "rich",
            title: "🏷️ Invalid Arguments",
            description: `Invalid argument \`${arg.id}\` of \`${this.props.description.usage}\``,
            color: bot.embedColors.red
          }
        }
      }
    }

    try {
      return this.execCommand({ bot, message, args });
    } catch (error: any) {
      console.log(error);
      
      return {
        type: "rich",
        title: "⚠️ Error!",
        description: error.toString(),
        color: bot.embedColors.red
      }
    }
  }
}