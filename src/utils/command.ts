import { MessageArgs } from "./interfaces";

interface Description {
  content: string,
  usage: string,
  examples: string[]
}

interface Argument {
  id: string,
  check?: ({ bot, message, args }: MessageArgs) => boolean,
  required: boolean,
}

interface Props {
  name: string,
  aliases?: string[],
  category: string,
  description: Description,
  permissions?: string[],
  args?: Argument[],
}

export default class Command {
  public props: Props;

  public constructor(props: Props) {
    this.props = {
      name: props.name || "command",
      aliases: props.aliases || [],
      category: props.category || "None",
      description: {
        content: props.description.content,
        usage: props.description.usage,
        examples: props.description.examples
      },
      permissions: props.permissions || [],
      args: props.args || []
    }
  }

  public checkValid({ bot, message, args }: MessageArgs): boolean {
    return true;
  }

  public async exec({ bot, message, args }: MessageArgs): Promise<any> {
    message.channel.createMessage("Currently in development...");
  }
}