const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

moment.locale("en-US");
const todayPeriod = new Date();

/**
 *
 * @param {date} todayPeriod - The period of the article was published
 * @returns
 */
const getDescriptions = async (todayPeriod) => {
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
        url: 'https:'+$(element).find("a").attr("href"),
        PostedOn: moment(wantedDate).fromNow(),
      });
    });

    return Posts;
  } catch (error) {
    console.log(error);
  }
};

const runApplication = async () => {
  const newArticles = await getDescriptions(todayPeriod);
  console.log("dataProcessors: ", newArticles);
};

runApplication();
