import get from "axios";
import { EmbedOptions } from "eris";
import Command from "../../utils/command";
import { MessageArgs } from "../../utils/interfaces";

const sub: string[] = ["memes"];

module.exports = new Command(
	{
		name: "meme",
		category: "Procrastination",
		description: {
			content: "Get back to work! Why are you looking at memes?",
			usage: "meme",
			examples: ["meme"]
		}
	},

	async ({ bot, message }: MessageArgs): Promise<EmbedOptions | void> => {
		const res: any = await get(
			`https://www.reddit.com/r/${bot.utils.pickRandom(
				sub
			)}/random.json?obey_over18=true`
		).catch(() => {});

		if (!res) return;

		const meme: any = res.data[0].data.children[0].data;
		return {
			title: `📰 Meme | ${meme.title}`,
			url: `https://www.reddit.com${meme.permalink}`,
			image: { url: meme.url },
			color: bot.embedColors.orange,
			footer: bot.utils.getFooter(
				message.author,
				`${meme.ups} | 💬 ${meme.num_comments}`
			)
		};
	}
);
