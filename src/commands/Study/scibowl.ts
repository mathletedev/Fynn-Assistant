import get from "axios";
import Command from "../../utils/command";
import { EmbedOptions, Emoji } from "eris";
import { MessageArgs } from "../../utils/interfaces";
require("dotenv").config();

module.exports = new Command(
	{
		name: "scibowl",
		aliases: ["sciencebowl"],
		category: "Study",
		description: {
			content: "Get a Science Bowl question from SciBowlDB to study!",
			usage: "scibowl",
			examples: ["scibowl"]
		}
	},

	async ({ bot, message, args }: MessageArgs): Promise<EmbedOptions | void> => {
		const res: any = await get(
			`https://www.scibowldb.com/api/questions/random`
		).catch(() => {});

		const question: any = res.data.question;

		const tossup = await message.channel.createMessage({
			embed: {
				title: `🔬 Science Bowl | Tossup - ${bot.utils.strictCapitalize(
					question.category
				)} - ${question.tossup_format}`,
				description: question.tossup_question,
				color: bot.embedColors.green,
				footer: bot.utils.getFooter(
					message.author,
					"React below to see the answer!"
				)
			}
		});

		tossup.addReaction("🙋");

		const filter = (userID: string, emoji: Emoji): boolean =>
			userID === message.author.id && emoji.name === "🙋";
		await bot.collectors.awaitReactions(tossup, filter, {
			time: 1e4,
			maxMatches: 1
		});

		const answer = await message.channel.createMessage({
			embed: {
				title: "🔬 Science Bowl | Tossup Answer",
				description: question.tossup_answer,
				color: bot.embedColors.green,
				footer: bot.utils.getFooter(
					message.author,
					"React below to see the bonus!"
				)
			}
		});

		answer.addReaction("🏆");

		const ansFilter = (userID: string, emoji: Emoji): boolean =>
			userID === message.author.id && emoji.name === "🏆";
		const ansReactions = await bot.collectors.awaitReactions(
			answer,
			ansFilter,
			{
				time: 1e4,
				maxMatches: 1
			}
		);

		if (!ansReactions.length) return;

		const bonus = await message.channel.createMessage({
			embed: {
				title: `🔬 Science Bowl | Bonus - ${bot.utils.strictCapitalize(
					question.category
				)} - ${question.bonus_format}`,
				description: question.bonus_question,
				color: bot.embedColors.green,
				footer: bot.utils.getFooter(
					message.author,
					"React below to see the answer!"
				)
			}
		});

		bonus.addReaction("🙋");

		const bonusFilter = (userID: string, emoji: Emoji): boolean =>
			userID === message.author.id && emoji.name === "🙋";
		await bot.collectors.awaitReactions(bonus, bonusFilter, {
			time: 1e4,
			maxMatches: 1
		});

		return {
			title: "🔬 Science Bowl | Bonus Answer",
			description: question.bonus_answer
		};
	}
);
