const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

const PORT = 3000;

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
    const pageHTML = await axios.get(
      `https://aws.amazon.com/about-aws/whats-new/${todayPeriod.getFullYear()}/`
    );
    const $ = cheerio.load(pageHTML.data);
    const listOfPosts = $('[class="directory-list whats-new-detail"] li');

    listOfPosts.each((idx, element) => {
      const postedDate = new Date(
        $(element).find(".date").text().trim().split(":")[1]
      );

      // Only get for this month!
      if (postedDate.getMonth() !== todayPeriod.getMonth()) return;

      Posts.push({
        title: $(element).find("a").text().split("Read More")[0],
        url: "https:" + $(element).find("a").attr("href"),
        PostedOn: moment(postedDate).fromNow(),
      });
    });

    return Posts;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Returns only the posts that have one or many of the keyWords
 * @param {Object} posts
 * @returns
 */
const filterRelevantArticles = (posts) => {
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
  const incomingArticles = await getArticles(todayPeriod);

  if(incomingArticles.length === 0) return;

  const relevant = filterRelevantArticles(incomingArticles);
  res.json(relevant);
});

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
