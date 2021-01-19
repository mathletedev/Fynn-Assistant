import { TextChannel } from "eris";
import Command from "../../utils/command";
import { MessageArgs } from "../../utils/interfaces";

export default class PingCommand extends Command {
  public constructor() {
    super({
      name: "ping",
      aliases: ["latency"],
      category: "Utilities",
      description: {
        content: "Check the latency of the bot!",
        usage: "ping",
        examples: [
          "ping"
        ]
      }
    });
  }

  public async exec({ bot, message }: MessageArgs): Promise<void> {
    let ping = await message.channel.createMessage("🏓 Ping?");
    ping.edit({ embed: {
      title: "🏓 Pong!",
      description: `❯ ⌛ ${Math.round(ping.createdAt - message.createdAt)} ms\n\n❯ 💓 ${(message.channel as TextChannel).guild.shard.latency.toFixed()} ms`,
      color: bot.embedColors.blue,
      footer: {
        text: message.author.username,
        icon_url: message.author.dynamicAvatarURL("png")
      }
    }});
  }
}