import Command from "../../utils/command";
import { MessageArgs, ParsedArg } from "../../utils/interfaces";

module.exports = new Command(
  {
    name: "purge",
    aliases: ["delete", "clear"],
    category: "Utilities",
    description: {
      content: "Deletes messages from a channel!",
      usage: "purge < amount >",
      examples: ["purge 100"]
    },
    permissions: ["manageMessages"],
    args: [
      {
        id: "amount",
        valid: ({ arg }: ParsedArg): boolean => !isNaN(parseInt(arg)) && parseInt(arg) >= 1 && parseInt(arg) <= 10000,
        required: true
      }
    ]
  },

  async ({ bot, message }: MessageArgs): Promise<void> => {
    
  }
);