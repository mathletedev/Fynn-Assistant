import { Constants, Message, TextChannel } from "eris";
import Bot from "../main";

export interface MessageArgs {
  bot: Bot,
  message: Message<TextChannel>,
  args: any[]
}

export interface ParsedArg {
  bot: Bot,
  message: Message,
  arg: string
}

export interface CommandArgs {
  name: string,
  aliases?: string[],
  category: string,
  description: Description,
  permissions?: string[],
  args?: Argument[]
}

export interface Description {
  content: string,
  usage: string,
  examples: string[]
}

export interface Argument {
  id: string,
  valid?: (arg: ParsedArg) => boolean,
  required: boolean
}