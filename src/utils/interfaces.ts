import { Message } from "eris";
import Bot from "../main";

export interface MessageArgs {
  bot: Bot,
  message: Message,
  args: string[]
}

export interface Embed {
  title?: string,
  description?: string,
  url?: string,
  timestamp?: string,
  color?: number,
  footer?: {
    text?: string,
    icon_url?: string
  },
  image?: {
    url?: string,
    width?: number,
    height?: number
  },
  thumbnail?: {
    url?: string,
    width?: number,
    height?: number
  },
  author?: {
    name?: string,
    url?: string,
    icon_url?: string
  },
  fields?: EmbedField[]
}

export interface EmbedField {
  name: string,
  value: string,
  inline?: boolean
}