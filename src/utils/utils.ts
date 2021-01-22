import Bot from "../main";
import { AdvancedMessageContent, Message, User } from "eris";
import { EmbedFooterOptions } from "eris";
import { decode } from "he";

export default class Utils {
	private bot: Bot;

	public constructor(bot: Bot) {
		this.bot = bot;
	}

	public capitalize = (str: string): string =>
		str
			.split(" ")
			.map((word: string) => word[0].toUpperCase() + word.slice(1))
			.join(" ");

	public strictCapitalize = (str: string): string =>
		str
			.split(" ")
			.map(
				(word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase()
			)
			.join(" ");

	public parseCamelCase = (str: string): string =>
		(str[0].toUpperCase() + str.slice(1)).split(/(?=[A-Z])/).join(" ");

	public joinParts(arr: string[]): string {
		const last: string = arr.pop()!;
		if (!arr.length) return last;
		if (arr.length === 1) return `${arr[0]} and ${last}`;
		return `${arr.join(", ")}, and ${last}`;
	}

	public pickRandom = <T>(arr: T[]): T =>
		arr[Math.floor(Math.random() * arr.length)];

	public shuffle<T>(arr: T[]): T[] {
		let tmpArr: T[] = arr;

		for (let i: number = tmpArr.length - 1; i > 0; i--) {
			const j: number = Math.floor(Math.random() * (i + 1));
			[tmpArr[i], tmpArr[j]] = [tmpArr[j], tmpArr[i]];
		}

		return tmpArr;
	}

	public getFooter(user: User, text: string = ""): EmbedFooterOptions {
		return {
			text: `${user.username} | ${text}`,
			icon_url: user.dynamicAvatarURL("png")
		};
	}

	public decodeHTML = (html: string): string => decode(html);

	public error(description: string, message: Message): AdvancedMessageContent {
		return {
			embed: {
				title: "⚠️ Error!",
				description,
				color: this.bot.embedColors.red,
				footer: this.getFooter(message.author)
			}
		};
	}
}
