'use strict';
const app = require('http').createServer(handler);
const fs = require('fs');
const pako = require('pako');
const path = require('path');
try{
    fs.statSync(path.join(__dirname,'/file'));
}catch(e){
    fs.mkdirSync(path.join(__dirname,'/file'));
}
function handler (req, res) {
    req.setEncoding('utf8');
    switch(req.url){
        case '/':
            fs.readFile(__dirname + '/src/index.html',function (err, data) {
                if (err) {
                  res.writeHead(500);
                  return res.end('Error loading index.html');
                }
                res.writeHead(200);
                res.end(data);
            });
            break;
        case '/pako.js':
        case '/demo.js':
            fs.readFile(__dirname + '/src'+req.url,function (err, data) {
                if (err) {
                  res.writeHead(500);
                  return res.end('Error loading');
                }
                res.writeHead(200);
                res.end(data);
            });
            break;
        case '/file/':
            let fileName=req.headers['x-file-name'];
            let body='';
            req.on('data', (chunk) => {
                body+=chunk;
            });
            req.on('end', () => {
                fs.writeFile(path.join(__dirname,'/file/',fileName), pako.inflate(body, { to: 'string' }).replace(/^data:\S+;base64,/,''), 'base64', (err) => {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error Upload');
                    }
                    res.writeHead(200);
                    res.end(JSON.stringify({'msg':'success'}));
                });
            })
            break;
        default:
            res.writeHead(404);
            res.end('Error, page not found');
    }
}
app.listen(8000);