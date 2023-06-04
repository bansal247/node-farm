const fs = require('fs');
const http = require('http');
const url = require('url')

const slugify = require('slugify')

const replaceTemplate = require('./modules/replaceTemplate')
// // Async
// fs.readFile('./txt/input.txt','utf-8',(err,data)=>{
//     console.log('async')
//     console.log(data)
//     fs.writeFile('./txt/final.txt',`${data} data`, err => {
//         console.log('your file has been written')
//     })
// });

// //Sync
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File Witten')

///////////////////////////////////////////////////////////////////////////////////////////////



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName,{lower:true}))

// console.log(slugs)

const server = http.createServer((req, res)=>{
    

    const {query,pathname} = url.parse(req.url,true)

    // Overview
    if(pathname=='/' || pathname=='/overview'){
        res.writeHead(200,{
            'Content-type':'text/html'
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('')
        // console.log(cardsHtml)
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output);
    }
    // Product
    else if (pathname=='/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product)
        res.end(output);
    }
    //API
    else if (pathname=='/api'){
        res.writeHead(200, {
            'Content-type':'application/json'
        })

        res.end(data);
    }
    else {
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end('<h1>ERROR</h1>');
    }

    // console.log(req.url)
    // console.log(req)
});

server.listen(8000,'127.0.0.1', ()=>{
    console.log('listning')
});``