const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const PORT = process.env.PORT || 3000;

const app = express();


const articles = [];
const amplify = [];
const newsPapers = [
    {
        name: "The Guardian",
        url:"https://www.theguardian.com/environment/climate-crisis"
    },

    {
        name: "The Times",
        url:"https://www.thetimes.co.uk/environment/climate-change"
    },

    {
        name: "The Telegraph",
        url:"https://www.telegraph.co.uk/climate-change"
    }
];


newsPapers.forEach(news =>{
    axios.get(news.url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("climate")',html).each(function(){
                const title = $(this).text();;
                const url = $(this).attr('href');
                articles.push({title, url, source: news.url});
            })
            // res.json(articles);
        })
        .catch(err=>console.log(err))
})

app.get('/', (req, res) => {
    res.json('Hello world')
})

app.get('/news',  async (req, res) => {

    res.json(articles)
//     axios.get('https://docs.amplify.aws/cli/graphql-transformer/model/#model')
//         .then(response =>{
//             const html = response.data;
//             console.log(html);
//             const $ = cheerio.load(html);
//             $('a:contains("Usage")',html).each(function(){
//                 const title = $(this).text();
//                 const url = $(this).attr('href');
//                 articles.push({title, url});
//             })
//             res.json(articles);
            
//         })
//         .catch(err =>console.log(`Error found ${err}`));

});


app.get('/test', (req, res) =>{
    // axios.get('https://amplify.com/news')
    axios.get('https://aws.amazon.com/new/')
        .then(response =>{
            // res.json(response.data);
            const html = response.data
            const $ = cheerio.load(html);
            $('a',html).each(function(){
                const title = $(this).text();
                const url = $(this).attr('href');
                amplify.push({title, url});
            })
            res.json(amplify)
        })
        .catch(err =>console.log(err))
})

app.listen(PORT, () => {console.log(`Server runing on port ${PORT}`)});
