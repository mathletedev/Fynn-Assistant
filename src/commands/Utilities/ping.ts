import { TextChannel } from "eris";
import Command from "../../utils/command";
import { MessageArgs } from "../../utils/interfaces";

module.exports = new Command(
  {
    name: "ping",
    aliases: ["latency"],
    category: "Utilities",
    description: {
      content: "Check the latency of the bot!",
      usage: "ping",
      examples: ["ping"]
    }
  },

  async ({ bot, message }: MessageArgs): Promise<void> => {
    let ping = await message.channel.createMessage("🏓 Ping?");
    ping.edit({ embed: {
      title: "🏓 Pong!",
      description: `❯ ⌛ ${Math.round(ping.createdAt - message.createdAt)} ms\n\n❯ 💓 ${(message.channel as TextChannel).guild.shard.latency.toFixed()} ms`,
      color: bot.embedColors.blue,
      footer: bot.utils.getFooter(message.author)
    }});
  }
);