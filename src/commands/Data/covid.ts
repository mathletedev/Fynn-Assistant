import get from "axios";
import { AdvancedMessageContent, EmbedOptions } from "eris";
import Command from "../../utils/command";
import { MessageArgs } from "../../utils/interfaces";

module.exports = new Command(
	{
		name: "covid",
		aliases: ["coronavirus", "covidtracker"],
		category: "Data",
		description: {
			content:
				"Get COVID data for a specific state! Leave the state field empty to see current US values. Note: Use the abbreviation of a state name (WA, CA, NY, etc.).",
			usage: "covid [ state ]",
			examples: ["covid", "covid wa"]
		}
	},

	async ({
		bot,
		message,
		args
	}: MessageArgs): Promise<AdvancedMessageContent | EmbedOptions> => {
		if (!args.length) {
			const res: any = await get(
				"https://api.covidtracking.com/v1/us/current.json"
			).catch(() => {});

			const data = res.data[0];

			return {
				title: "🦠 US COVID Data",
				fields: [
					{ name: "Positive", value: data.positive ?? "N/A", inline: true },
					{ name: "Negative", value: data.negative ?? "N/A", inline: true },
					{ name: "Pending", value: data.pending ?? "N/A", inline: true },
					{
						name: "Hospitalized",
						value: data.hospitalizedCurrently ?? "N/A",
						inline: true
					},
					{ name: "ICU", value: data.inIcuCurrently, inline: true },
					{
						name: "Ventilator",
						value: data.onVentilatorCurrently ?? "N/A",
						inline: true
					},
					{ name: "Deaths", value: data.death, inline: true },
					{ name: "Total Tests", value: data.totalTestResults, inline: true },
					{
						name: "Death Increase",
						value: `+${data.deathIncrease ?? "N/A"}`,
						inline: true
					},
					{
						name: "Hospitalized Increase",
						value: `+${data.hospitalizedIncrease ?? "N/A"}`,
						inline: true
					},
					{
						name: "Negative Increase",
						value: `+${data.negativeIncrease ?? "N/A"}`,
						inline: true
					},
					{
						name: "Positive Increase",
						value: `+${data.positiveIncrease ?? "N/A"}`,
						inline: true
					}
				],
				footer: { text: `Last updated on ${data.dateChecked ?? "N/A"}` }
			};
		}

		const res: any = await get(
			`https://api.covidtracking.com/v1/states/${args[0]}/current.json`
		).catch(() => {});

		const data = res.data;

		if (data.error)
			return bot.utils.error(
				"Invalid state name... Try using an abbreviated state name such as `WA`.",
				message
			);

		return {
			title: `🦠 ${data.state} COVID Data`,
			fields: [
				{ name: "Positive", value: data.positive ?? "N/A", inline: true },
				{ name: "Negative", value: data.negative ?? "N/A", inline: true },
				{ name: "Pending", value: data.pending ?? "N/A", inline: true },
				{
					name: "Hospitalized",
					value: data.hospitalizedCurrently ?? "N/A",
					inline: true
				},
				{ name: "ICU", value: data.inIcuCurrently ?? "N/A", inline: true },
				{
					name: "Ventilator",
					value: data.onVentilatorCurrently ?? "N/A",
					inline: true
				},
				{ name: "Deaths", value: data.death ?? "N/A", inline: true },
				{
					name: "Total Tests",
					value: data.totalTestResults ?? "N/A",
					inline: true
				},
				{
					name: "Death Increase",
					value: `+${data.deathIncrease ?? "N/A"}`,
					inline: true
				},
				{
					name: "Hospitalized Increase",
					value: `+${data.hospitalizedIncrease ?? "N/A"}`,
					inline: true
				},
				{
					name: "Negative Increase",
					value: `+${data.negativeIncrease ?? "N/A"}`,
					inline: true
				},
				{
					name: "Positive Increase",
					value: `+${data.positiveIncrease ?? "N/A"}`,
					inline: true
				}
			],
			footer: { text: `Last updated on ${data.dateChecked ?? "N/A"}` }
		};
	}
);
