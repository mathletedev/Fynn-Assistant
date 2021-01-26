import get from "axios";
import Command from "../../utils/command";
import { EmbedOptions } from "eris";
import { MessageArgs, ParsedArg } from "../../utils/interfaces";

module.exports = new Command(
	{
		name: "math",
		aliases: ["eval", "evaluate", "calc", "calculate"],
		category: "Study",
		description: {
			content:
				"Evaluate a math equation! (Only simpler ones that I can solve...)",
			usage: "math < equation >",
			examples: ["math 1 + 1"]
		},
		args: [
			{
				id: "equation",
				valid: (_: ParsedArg): boolean => true,
				required: true
			}
		]
	},

	async ({ args }: MessageArgs): Promise<EmbedOptions | string> => {
		const equation: string = args.join(" ");
		const result = await get(
			`https://api.mathjs.org/v4?expr=${encodeURIComponent(equation)}`
		).catch(() => {});

		if (!result) return "I can't solve that equation...";

		return {
			title: "🧮 Calculator",
			fields: [
				{ name: "Input", value: `\`\`\`${equation}\`\`\`` },
				{ name: "Output", value: `\`\`\`${result.data}\`\`\`` }
			]
		};
	}
);
