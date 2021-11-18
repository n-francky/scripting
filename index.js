const axios = require("axios");
const cheerio = require("cheerio");

const todayPeriod = new Date();

const runApplication = async () => {
  const dataProcessors = await getDescriptions(todayPeriod);
  console.log("dataProcessors: ", dataProcessors);
};

/**
 * 
 * @param {date} todayPeriod - The period of the article was published 
 * @returns 
 */
const getDescriptions = async (todayPeriod) => {
  const _ = [];
  try {
    const returnData = await axios.get(
      `https://aws.amazon.com/about-aws/whats-new/${todayPeriod.getFullYear()}/`
    );
    const $ = cheerio.load(returnData.data);

    const listOfPosts = $('[class="directory-list whats-new-detail"] li');

    listOfPosts.each((idx, element) => {
      const wantedDate = new Date( $(element).find(".date").text().trim().split(":")[1]);
      
      if(wantedDate.getMonth()!= todayPeriod.getMonth()) return;

      _.push({
        title: $(element).find("a").text().split("Read More")[0],
        url: $(element).find("a").attr("href"),
        wantedDate,
      });
    });

    return _;
  
  } catch (error) {
    console.log(error);
  }
};

runApplication();
