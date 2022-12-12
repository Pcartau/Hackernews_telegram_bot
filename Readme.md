# HackerNews Telegram Newsletter

Get hackernews newsletter directly from Telegram.

## Presentation

[Hackernews](https://news.ycombinator.com) is the [Ycombinator](https://www.ycombinator.com/) news website.

With this piece of code you can get the news you want directly by message on Telegram

## Install & Use

### Telegram configuration

1. Create a bot on Telegram. [Contact the BotFather](https://telegram.me/botfather) to do so.
2. Replace the variable `chatID` by yours in `index.ts`. [Ping that bot](https://telegram.me/getidsbot) to get your `chatID`.
3. Export env variable `TOKEN` with the token of your bot.

### Hackernews configuration

`RSS_FEED_URL` is by default set on the [front page](https://hnrss.org/frontpage). You can update this variable by the availabes RSS [here](https://hnrss.github.io/)

`INTERESTING_ARTICLE_POINTS` is the number of points required for an article to be sent. Default is `500`.

### Dependencies

> ✍️ **Note:** The script runs with `ts-node` 


```sh
  npm install
  npm start
```