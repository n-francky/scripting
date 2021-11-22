const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

const PORT = process.env.PORT || 3000;

const app = express();

moment.locale("en-US");
const todayPeriod = new Date();

/**
 * key words to use to search for.
 */
const keyWords = [
  "lambda",
  "s3",
  "ec2",
  "ses",
  "open search",
  "dynamoDb",
  "Amazon lex",
];

/**
 *
 * @param {date} todayPeriod - The period of the article was published
 * @returns
 */
const getArticles = async (todayPeriod) => {
  const Posts = [];
  try {
    const pageDa = await axios.get(
      `https://aws.amazon.com/about-aws/whats-new/${todayPeriod.getFullYear()}/`
    );
    const $ = cheerio.load(pageDa.data);
    const listOfPosts = $('[class="directory-list whats-new-detail"] li');

    listOfPosts.each((idx, element) => {
      const wantedDate = new Date(
        $(element).find(".date").text().trim().split(":")[1]
      );

      if (wantedDate.getMonth() !== todayPeriod.getMonth()) return;

      Posts.push({
        title: $(element).find("a").text().split("Read More")[0],
        url: "https:" + $(element).find("a").attr("href"),
        PostedOn: moment(wantedDate).fromNow(),
      });
    });

    return Posts;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {Object} posts
 * @returns
 */
const relevantArticles = (posts) => {
  const relavantPosts = [];
  posts.forEach((post) => {
    keyWords.forEach((key) => {
      if (post.title.toLowerCase().includes(key.toLowerCase()))
        relavantPosts.push(post);
    });
  });
  return relavantPosts;
};

app.get("/news", async (req, res) => {
  const newArticles = await getArticles(todayPeriod);
  const relevant = relevantArticles(newArticles);
  res.json(relevant);
});

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
