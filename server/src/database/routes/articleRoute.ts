import express from "express";
import Article, { ArticleDocument } from "./../models/articleModel";

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {source: req.query["source"] as string};
  const categories = req.query["categories"] as string[];
  let output:Array<ArticleDocument>;

  if (filter.source)
    output = await Article.find(filter);
  else
    output = await Article.find({}).sort({ publishedAt: 'desc' });
  if (!Array.isArray(categories))
    return (res.send({data: output}));
  output = output.filter((article) => {
    for (let i = categories.length; i >= 0; i--) {
      for (let j = article.categories.length - 1; j >= 0; j--) {
        if (categories[i] === article.categories[j])
          return (true);
      }
    }
    return (false);
  });
  return (res.send({data: output}));
});

router.get("/:id", async (req, res) => {
  const output = await Article.findOne({_id: req.params.id});

  if (!output)
    return (res.status(404).send({message: 'Article not found.'}));
  return (res.send({data: output}));
});

export default router;