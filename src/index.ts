import { Master as Sharder } from "eris-sharder";
require("dotenv").config();

const _ = new Sharder(process.env.BOT_TOKEN!, "/dist/main.js", {
  stats: true,
  name: "Fynn",
  clientOptions: {
    messageLimit: 0
  }
});