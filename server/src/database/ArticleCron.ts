import cron from "node-cron";
import Parser from "rss-parser";
import Article, { ArticleDocument } from "./models/articleModel";

const FEED_URLS = [
  "https://www.cryptoninjas.net/feed/",
  "https://www.cryptoninjas.net/feed/",
  "https://www.coindesk.com/feed/",
  "https://medium.com/feed/the-capital",
  "https://blog.coinbase.com/feed",
  "https://cryptoslate.com/feed"
];

export default class ArticleCron
{
  private readonly parser = new Parser();

  constructor()
  {
    this.saveNewArticles();
    cron.schedule("1 * * * *", this.saveNewArticles);
  }

  private saveNewArticles = async () =>
  {
    for (const feed of FEED_URLS.map(async (url) => (await this.parser.parseURL(url)))) {
      const articles = await feed;
      for (const article of articles.items || []) {
        try {
          await this.generateArticleObject(article, articles.title!).save()
        }
        catch (err) {

        }
      }
    }
  }
  private generateArticleObject(article:any, source:string):ArticleDocument
  {
    return (new Article({
      title: article.title,
      url: article.link,
      imageUrls: [],
      publishedAt: new Date(article.isoDate),
      categories: article.categories,
      content: article.content,
      source
    }));
  }
}