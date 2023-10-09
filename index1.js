const fs = require('fs');
const http = require('http');
const url = require('url');
 
const replaceTemplate = (temp, product) => {
    
  let output = temp.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  
  if (!product.organic) 
      output = temp.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
}
 
 
/////////////////////////////////
// SERVER
//const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
//const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
//const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
 
//const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync('./templates/template-overview.html','utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html','utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html','utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');

const dataObj = JSON.parse(data);
 
const server = http.createServer((req, res) => {
  //console.log(req.url);
  const {query,pathname}=(url.parse(req.url,true));//parse the url parse(req,true-to parse the query into an object )
  //const pathname = req.url;
 
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
 
    const cardsHtml = dataObj
      .map(el => replaceTemplate(tempCard, el))
      .join('');
    
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct,product);//pass in the product
    //console.log(query);
    res.end(output);//send the output as response
 
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
  });
  