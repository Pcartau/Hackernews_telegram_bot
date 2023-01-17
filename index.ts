import rssParser from 'rss-parser';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import fs from 'fs';

type article = {
  title: string|undefined,
  points: string|undefined,
  comments: string|undefined,
  contentUrl: string|undefined,
  commentsUrl: string|undefined,
}

/* Configuration variables */
const RSS_FEED_URL = 'https://hnrss.org/frontpage';
const INTERESTING_ARTICLE_POINTS = 500;
const INTERVAL_TIME = 1000 * 60 * 5; // 5min
const CLEAR_CACHE_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days
const token = process.env.TOKEN;
const chatID = 5096510411;
const parser = new rssParser();
const bot = new TelegramBot(token!, {polling: true});


function filterByCache(articles:article[]) {
  const cache = fs.readFileSync('./cache.txt', 'utf-8').split('\n');
  const filteredArticles = articles.filter((article) => !cache.includes(article.title!));
  fs.appendFileSync('./cache.txt', '\n' + filteredArticles.join('\n'));

  return filteredArticles;
}


async function getArticles() {
  const result = <article[]>[];
  const req = await axios.get(RSS_FEED_URL);
  const feed = await parser.parseString(req.data);

  feed.items.forEach((item) => {
    const title = item.title;
    const points = item.content?.split('Points: ')[1].split('</p>')[0];
    const comments = item.content?.split('Comments: ')[1].split('</p>')[0];
    const contentUrl = item.content?.split('Article URL: <a href="')[1]?.split('">')[0];
    const commentsUrl = item.content?.split('Comments URL: <a href="')[1]?.split('">')[0];
    if (+points! >= INTERESTING_ARTICLE_POINTS) {
      result.push({title, points, comments, contentUrl, commentsUrl});
    }
  });

  return filterByCache(result);
}


function sendTelegram(articles:article[]) {
  const messageText = articles.map((article) => `*${article.title}*\n(${article.points} points - ${article.comments} commentaires)\n[Article](${article.contentUrl})\n[Commentaires](${article.commentsUrl})\n`).join('\n');
  bot.sendMessage(chatID, messageText, {parse_mode: 'Markdown'});
}


function clearCache() {
  fs.writeFileSync('./cache.txt', '');
}


async function main() {
  const articles = await getArticles();
  sendTelegram(articles);
}


setInterval(() => {
  main();
}, INTERVAL_TIME);


setInterval(() => {
  clearCache();
}, CLEAR_CACHE_TIME);
