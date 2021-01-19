import { readdirSync } from "fs";
import { join } from "path";
import { Base } from "eris-sharder";
import { Client } from "eris";
import Command from "./utils/command";

export default class Bot extends Base {
  public cmds: Command[] = [];
  public categories: string[] = readdirSync(join(__dirname, "commands"));

  public embedColors: Record<string, number>;

  public constructor(client: { bot: Client, clusterID: number }) {
    super(client);

    this.embedColors = {
      blue: 0x0066ff,
      red: 0xff0000
    }
  }

  public launch(): void {
    this.loadEvents();
    this.loadCommands();
    this.RefreshStatus();
  }

  public RefreshStatus(): void {
    this.bot.editStatus("offline", {
      name: `"$help"!`,
      type: 0
    });
  }

  private loadCommands(): void {
    readdirSync(join(__dirname, "commands")).forEach((dir: string) => {
      readdirSync(join(__dirname, "commands", dir)).filter((file: string) => file.endsWith(".js")).forEach((file: string) => {
        const pull: any = require(`./commands/${dir}/${file}`);

        this.cmds.push(new pull.default());
      });
    });
  }

  private loadEvents(): void {
    readdirSync(join(__dirname, "events")).forEach((file: string) => {
      const pull: any = require(`./events/${file}`);

      this.bot.on(file.slice(0, file.length - 3), pull.handler.bind(this));
    });
  }
}