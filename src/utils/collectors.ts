import { Client, Emoji, Message, TextChannel } from "eris";
import { EventEmitter } from "events";

interface Options {
  time: number,
  maxMatches: number
}

interface Reaction {
  message: Message,
  emoji: Emoji,
  userID: string
}

class MessageCollector extends EventEmitter {
  private filter: (message: Message) => boolean;
  private channel: TextChannel;
  private options: Options;
  private ended: boolean;
  private collected: Message[];
  private collectors: MessageCollector[];

	constructor(channel: TextChannel, filter: (message: Message) => boolean, options={ time: 1e4, maxMatches: 1 }, collectors: MessageCollector[]) {
    super();
        
		this.filter = filter;
		this.channel = channel;
		this.options = options;
		this.ended = false;
    this.collected = [];
    this.collectors = collectors;

		collectors.push(this);
		if (options.time) setTimeout(() => this.stop("time"), options.time);
	};

	verify(message: Message) {
		if (this.channel.id !== message.channel.id) return false;
		if (this.filter(message)) {
			this.collected.push(message);

			this.emit("message", message);
			if (this.collected.length >= this.options.maxMatches) this.stop("maxMatches");
			return true;
		}

		return false;
	}

	stop(reason: string) {
		if (this.ended) return;
		this.ended = true;

		this.collectors.splice(this.collectors.indexOf(this), 1);
		this.emit("end", this.collected, reason);
	}
}

class ReactionHandler extends EventEmitter {
  private client: Client;
  private filter: (userID: string, emoji: Emoji) => boolean;
  private message: Message;
  private options: Options;
  private ended: boolean;
  private collected: Reaction[];
  private listener: (msg: Message, emoji: Emoji, userID: string) => boolean;

  constructor(message: Message<TextChannel>, filter: (userID: string, emoji: Emoji) => boolean, options={ time: 1e4, maxMatches: 1 }) {
    super();

    this.client = message.channel.guild.shard.client;
    this.filter = filter;
    this.message = message;
    this.options = options;
    this.ended = false;
    this.collected = [];
    this.listener = (message, emoji, userID) => this.verify(message, emoji, userID);

    this.client.on("messageReactionAdd", this.listener);

    if (options.time) setTimeout(() => this.stop("time"), options.time);
  }

  verify(message: Message, emoji: Emoji, userID: string) {
    if (this.message.id !== message.id) return false;

    if (this.filter(userID, emoji)) {
      this.collected.push({ message, emoji, userID });
      this.emit("reacted", { message, emoji, userID });

      if (this.collected.length >= this.options.maxMatches) {
        this.stop("maxMatches");
        return true;
      }
    }

    return false;
  }

  stop(reason: string) {
    if (this.ended) return;

    this.ended = true;

    this.client.removeListener('messageReactionAdd', this.listener);
    
    this.emit("end", this.collected, reason);
  }
}

export default class Collector {
  private listening: boolean = false;
  private collectors: MessageCollector[] = [];

	public awaitMessages(channel: TextChannel, filter: (message: Message) => boolean, options: Options): Promise<Message[]> {
		if (!this.listening) {
			channel.client.on("messageCreate", (message: Message) => {
				for (const collector of this.collectors) collector.verify(message);
			});

			this.listening = true;
		};

    const collector: MessageCollector = new MessageCollector(channel, filter, options, this.collectors);
    
		return new Promise((resolve: (value: Message[]) => void) => collector.on("end", resolve));
  }
    
  public awaitReactions(message: Message<TextChannel>, filter: (userID: string, emoji: Emoji) => boolean, options: Options): Promise<Reaction[]> {
    const bulkCollector = new ReactionHandler(message, filter, options);

    return new Promise((resolve: (value: Reaction[]) => void) => bulkCollector.on("end", resolve));
  }
}