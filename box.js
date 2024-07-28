const fs = require('fs');
const path = require('path');
const superagent = require('axios');
const cheerio = require('cheerio');
const { promisify } = require('util');
const epub=   require( "./epub.js")
//const { createEpub } = require('epub-gen');

const writeFileAsync = promisify(fs.writeFile);

const platforms = {
  'po18': require('./platforms/po18.js'), //po18脸红心跳
  'douban': require('./platforms/douban.js'),//豆瓣阅读
  'hotupub': require('./platforms/hotupub.js'),//河图文化
  'iqiyi': require('./platforms/iqiyi.js'),//爱奇艺文学

  
  // 添加其他平台的脚本
};

async function downloadNovel(name, bookid) {
  const platform = platforms[name];
  if (!platform) {
    console.error(`Unknown platform: ${name}`);
    return;
  }

  const novel = await platform.getNovel(bookid);
  if (!novel) {
    console.error(`Failed to get novel from ${name}`);
    return;
  }

 /* const chapters = await Promise.all(novel.chapters.map(async (chapter) => {
    const content = await platform.getChapterContent(chapter.url);
    return {
      title: chapter.title,
      data: content,
    };
  }));*/
/*
  const options = {
    title: novel.title,
    author: novel.author,
    publisher: name,
    cover,
    css,
    content: chapters,
  };
*/
//  const epub = await createEpub(options);
  const filename = `${novel.title}.epub`;
  console.log(`Downloaded ${filename} start` )
  await  epub(novel );

 ;
}

if (process.argv[2] === 'web') {
  const http = require('http');
  const url = require('url');

  const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    console.log({ pathname, query } )
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<ul>');
      for (const name in platforms) {
        res.write(`
              <form action="/${ name}/download" method="get">
        <label for="bookId">ID：</label>
        <input type="text" name="bookId" id="bookId">
        <button type="submit">download</button>
      </form>`);
      }
      res.write('</ul>');
      res.end();
    } else {
      const name = pathname.slice(1).split("/")[00];
      const bookid = query.bookId
      console.log(query)
      console.log(bookid )
     // res.writeHead(200, { 'Content-Type': 'text/html' });
      
      //res.write(`${ name}下载中 `)
    //  res.end(); 
      if (!name || !bookid) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
        return;
      }
     console.log(name )
      downloadNovel(name, bookid).then(() => {
        res.writeHead(200, { 'Content-Type': 'application/epub+zip' });
        res.setHeader(`'Content-Disposition', attachment; filename="${name}-${bookid}.epub"`);
        fs.createReadStream(`${name}-${bookid}.epub` ).pipe(res);
      }).catch((err) => {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      });
    }
  });

  server.listen(8080, () => {
    console.log('Server started at http://localhost:8080/');
  });
} else {
  const name = process.argv[2];
  const bookid = process.argv[3];
  if (!name || !bookid) {
    console.error('Usage: node index.js name bookid');
    return;
  }
  downloadNovel(name, bookid).catch(console.error);
}