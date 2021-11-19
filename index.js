const axios = require("axios");
const cheerio = require("cheerio");

const todayPeriod = new Date();

const runApplication = async () => {
  const newArticles = await getDescriptions(todayPeriod);
  console.log("dataProcessors: ", newArticles);
};

/**
 * 
 * @param {date} todayPeriod - The period of the article was published 
 * @returns 
 */
const getDescriptions = async (todayPeriod) => {
  const Posts = [];
  try {
    const returnHtml = await axios.get(
      `https://aws.amazon.com/about-aws/whats-new/${todayPeriod.getFullYear()}/`
    );
    const $ = cheerio.load(returnHtml.data);

    const listOfPosts = $('[class="directory-list whats-new-detail"] li');

    listOfPosts.each((idx, element) => {
      const wantedDate = new Date( $(element).find(".date").text().trim().split(":")[1]);
      
      if(wantedDate.getMonth()!= todayPeriod.getMonth()) return;
      
      Posts.push({
        title: $(element).find("a").text().split("Read More")[0],
        url: $(element).find("a").attr("href"),
        wantedDate,
      });
    });

    return Posts;
  
  } catch (error) {
    console.log(error);
  }
};

runApplication();
