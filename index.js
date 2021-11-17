const axios = require("axios");
const cheerio = require("cheerio");

const _ = [];
const currentYear = new Date();
console.log(currentYear.getFullYear())
const years = ["2021"];
const runApplication = async () => {
    const dataProcessors = await getDescriptions(currentYear.getFullYear());
    console.log("dataProcessors: ", dataProcessors);
};

const getDescriptions = async (yearPublished) => {
  try {
    const returnData = await axios.get(
      `https://aws.amazon.com/about-aws/whats-new/${yearPublished}/`
    );
    const $ = cheerio.load(returnData.data);

    const listItems = $('[class="directory-list whats-new-detail"] li');

    listItems.each((idx, element) => {
      const title = $(element).find("a").text().split('Read More')[0];
      const url = $(element).find("a").attr("href");
      const datePosted = $(element).find(".date").text().trim().split(":")[1];

      _.push({
        title,
        url,
        datePosted,
      });
    });

    return _;
  } catch (error) {
    console.log(error);
  }
};

runApplication();
