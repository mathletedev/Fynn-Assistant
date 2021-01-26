import get from "axios";
import Command from "../../utils/command";
import { EmbedOptions, Emoji, Message, TextChannel } from "eris";
import { MessageArgs, ParsedArg } from "../../utils/interfaces";

const categories: Record<string, number> = {
	any: 0,
	general: 9,
	books: 10,
	film: 11,
	music: 12,
	theatre: 13,
	television: 14,
	videogames: 15,
	boardgames: 16,
	nature: 17,
	computers: 18,
	math: 19,
	mythology: 20,
	sports: 21,
	geography: 22,
	history: 23,
	politics: 24,
	art: 25,
	celebrities: 26,
	animals: 27,
	vehicles: 28,
	comics: 29,
	gadgets: 30,
	manga: 31,
	cartoons: 32
};

const difficulties: string[] = ["easy", "medium", "hard"];
const letters: string[] = ["w", "x", "y", "z"];
const emojis: string[] = ["🇼", "🇽", "🇾", "🇿"];

module.exports = new Command(
	{
		name: "quiz",
		aliases: ["question", "test"],
		category: "Study",
		description: {
			content:
				"Get a quiz question from OpenTDB! Don't pass any parameters to see all available categories.",
			usage: "quiz [ category ] [ difficulty ]",
			examples: ["quiz", "quiz math", "quiz sports hard"]
		},
		args: [
			{
				id: "category",
				valid: ({ arg }: ParsedArg): boolean => categories.hasOwnProperty(arg),
				required: false
			},
			{
				id: "difficulty",
				valid: ({ arg }: ParsedArg): boolean => difficulties.includes(arg),
				required: false
			}
		]
	},

	async ({
		bot,
		message,
		args
	}: MessageArgs): Promise<EmbedOptions | string | void> => {
		if (!args.length) {
			return {
				title: "🔎 Quiz Help",
				description: `❯ **Categories:** ${Object.keys(categories)
					.map((cat: string) => `\`${cat}\``)
					.join(" ")}\n\n❯ **Difficulties:** ${difficulties
					.map((dif: string) => `\`${dif}\``)
					.join(" ")}`
			};
		} else {
			const res: any = await get(
				`https://opentdb.com/api.php?amount=1&category=${
					categories[args[0]]
				}&difficulty=${
					args[1] && difficulties.includes(args[1]) ? args[1] : ""
				}&type=multiple`
			);

			const question: any = res.data.results[0];

			let allAnswers: string[] = question.incorrect_answers;
			allAnswers.push(question.correct_answer);
			allAnswers = bot.utils.shuffle<string>(allAnswers);

			const msg: Message<TextChannel> = await message.channel.createMessage({
				embed: {
					title: "🔎 Quiz",
					description: `**${bot.utils.decodeHTML(
						question.question
					)}**\n\n${allAnswers
						.map(
							(ans: string, i: number) =>
								`❯ **${letters[i].toUpperCase()})** ${bot.utils.decodeHTML(
									ans
								)}`
						)
						.join("\n")}\n\n❯ **Category:** ${
						question.category
					}\n❯ **Difficulty:** ${bot.utils.capitalize(question.difficulty)}`,
					color: bot.embedColors.green,
					footer: bot.utils.getFooter(message.author)
				}
			});

			for (const emoji of emojis) {
				msg.addReaction(emoji);
			}

			const filter = (userID: string, emoji: Emoji): boolean =>
				userID === message.author.id && emojis.includes(emoji.name);
			const reactions = await bot.collectors.awaitReactions(msg, filter, {
				time: 2e4,
				maxMatches: 1
			});

			if (!reactions.length)
				return `Time's up! The correct answer was \`${bot.utils.decodeHTML(
					question.correct_answer
				)}\``;

			const selected = emojis.indexOf(reactions[0].emoji.name);
			if (allAnswers[selected] === question.correct_answer)
				return "That's right! Great job!";
			return `Oops! The correct answer was \`${bot.utils.decodeHTML(
				question.correct_answer
			)}\``;
		}
	}
);
