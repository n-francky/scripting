const axios = require("axios");
const cheerio = require("cheerio");

const _ = [];

const years = ["2021"];
const runApplication = async () => {
  for await (yearPublished of years) {
    const dataProcessors = await getDescriptions(yearPublished);

    console.log("dataProcessors: ", dataProcessors);
  }
};

const getDescriptions = async (yearPublished) => {
  try {
    const returnData = await axios.get(
      `https://aws.amazon.com/about-aws/whats-new/${yearPublished}/`
    );
    const $ = cheerio.load(returnData.data);

    const listItems = $('[class="directory-list whats-new-detail"] li');

    listItems.each((idx, element) => {
      const url = $(element).find("a").attr("href");
      const datePosted = $(element).find(".date").text();

      _.push({
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


