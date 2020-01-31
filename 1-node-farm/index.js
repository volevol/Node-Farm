const fs = require('fs');
const http = require('http');
const url = require('url');
const fetch = require("node-fetch");
const rp = require('request-promise');
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we hnow about the avocado: ${textIn}.\nCreated on  ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File has been written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR!!!');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written! c: ');
//             });
//         });
//     });
// });
// console.log('Will read the file!')

//////////////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const dataObj = rp('http://78.47.142.188:8000/news/list/2')
  .then(function(html){
    //success!
    const data = html
    console.log(data)
    return data
  })
  .catch(function(err){
    //handle error
  });
console.log(typeof(dataObj))


const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    // Overview page 
    if (pathname === "/" || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); // вообще вот так должно быть, но ругается на .join()
        // const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el));
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    
    // API 
    } else if (pathname === '/api') {
		res.writeHead(200, {'Content-type': 'application/json'});
		res.end(data);

		// fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
		// 	const productData = JSON.parse(data);
		// 	res.writeHead(200, {'Content-type': 'application/json'});
		// 	res.end(data);
		// });

	} else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests  on port 8000');
});