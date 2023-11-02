const  fs = require( "fs")
const  JSZip = require( "jszip")
const  axios = require( "axios")

let main_css = fs.readFileSync("./assets/main.css")
let content_opf = `<?xml version='1.0' encoding='UTF-8' standalone='no' ?>
<package version="2.0" unique-identifier="duokan-book-id" xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <metadata>
    <dc:identifier>{uuid}</dc:identifier>
    <dc:title>{bookName}</dc:title>
    <dc:description>{bookDesc}</dc:description>
    <dc:publisher>{bookPub}</dc:publisher>
    <dc:creator n1:role="aut" n1:file-as="{bookAuthor}" xmlns:n1="http://www.idpf.org/2007/opf">{bookAuthor}</dc:creator>
    <dc:date n2:event="creation" xmlns:n2="http://www.idpf.org/2007/opf">2023-01-06</dc:date>
    <dc:language>zh</dc:language>
    <meta name="cover" content="cover" />
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="cover" href="Images/cover.png" media-type="image/png"/>
    <item id="main" href="Styles/main.css" media-type="text/css" />
    <item id="font" href="Styles/LXGWNeoXiHei.ttf" media-type="application/x-font-ttf" />
    {manifest}
    {imglist}
  </manifest>
  <spine toc="ncx"></spine>
  <guide />
</package>`

let toc_ncx = `<?xml version='1.0' encoding='UTF-8' standalone='no' ?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
  <head>
    <meta name="dtb:uid" content="{uuid}" />
    <meta name="dtb:generator" content="Ag2S EpubLib" />
    <meta name="dtb:depth" content="1" />
    <meta name="dtb:totalPageCount" content="0" />
    <meta name="dtb:maxPageNumber" content="0" />
  </head>
  <docTitle>
    <text>{bookName}</text>
  </docTitle>
  <docAuthor>
    <text>{bookAuthor}</text>
  </docAuthor>
  <navMap></navMap>
</ncx>`

 let chapter = `<!DOCTYPE html>
<html>
<head>
    <title>{bookName}</title>
    <link href="../Styles/main.css" type="text/css" rel="stylesheet"/>
</head>
<body>
<h2>{bookName}</h2>
{bookContent}
</body>
</html>`

 let container = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
	<rootfiles>
		<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
	</rootfiles>
</container>`
 let mimetype = "application/epub+zip"
  
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  })
}

async function imgd(img) {
    return await axios.get(img, {
        responseType: 'arraybuffer'
    }).then(function(response) {
        return response.data
    })
}

function toc(id, name, author, mulu,uuid) {
    let a = toc_ncx.replaceAll("{uuid}", uuid).replaceAll("{bookName}", name).replaceAll("{bookAuthor}", author)
    let toc = ""
    for (let i in mulu) {
        i = Number(i)
        toc += `<navPoint id="chapter_${i+1}" playOrder="${i+1}" class="chapter">
      <navLabel>
        <text>${mulu[i].title}</text>
      </navLabel>
      <content src="Chapter/chapter_${i+1}.html" />
    </navPoint>\n    `
    }
    return a.replace("<navMap></navMap>", `<navMap>\n    ${toc}\n  </navMap>`).replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
}

function copf(name, author, desc, mulu, imglist,content,uuid,pub) {
    let c = content_opf.replaceAll("{uuid}", uuid).replaceAll("{bookName}", name).replaceAll("{bookAuthor}", author).replaceAll("{bookDesc}", desc).replaceAll("{bookPub}", pub)
    let spi = ""
    for (let i in mulu) {
        i = Number(i)
        spi += `<itemref idref="chapter_${i+1}" />\n    `
    }
    let d = c.replace(`<spine toc="ncx"></spine>`, `<spine toc="ncx">\n    ${spi}\n  </spine>`)
    let img = ""
    for (let i in imglist) {
        img += `<item id="${imglist[i].name}" href="${imglist[i].url}.png" media-type="image/png"/>\n    `
    }
    let manifest = ""
    for(let j in content) {
        manifest += `<item id="${content[j].id}" href="${content[j].url}.html" media-type="text/html" />\n    `
    }
    d = d.replace("{manifest}",manifest).replace("{imglist}", img)
    return d.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
}

function chap(mulu) {
    let cha = chapter.replaceAll("{bookName}", mulu.title).replaceAll("{bookContent}", mulu.data)
    return cha
}

 function epub(options) {
    let zip = new JSZip()
    zip.file("META-INF/container.xml", container)
    zip.file("mimetype", mimetype)
    let OEBPS = zip.folder("OEBPS")
    OEBPS.file("Styles/main.css", main_css)
    var img = OEBPS.folder("Images");
    img.file("cover.png", imgd(options.cover))
    let uuid = guid()
    let t = toc(options.id, options.title,
        options.author, options.content,uuid,options.pub)
    OEBPS.file("toc.ncx", t)
    let imglist2 = []
    let content = []
    for (let i in options.content) {
        i = Number(i)
        let cha = chap(options.content[i])
        content.push({
            id: `chapter_${i+1}`,
            url: `Chapter/chapter_${i+1}`
        })
        let img = cha.match(/(?<=(img[^>]*src="))[^"]*/g)
        let imglist = []
        if (img)
            for (let j in img) {
                j = Number(j)
                imglist[j] = imgd(img[j])
                zip.file(`OEBPS/Images/${i+1}/${j+1}.png`, imglist[j])
                imglist2.push({
                    name: `${i+1}-${j+1}`,
                    url: `Images/${i+1}-${j+1}.png`
                })
                cha = cha.replace(img[j], `../Images/${i+1}/${j+1}.png`)
            }
        OEBPS.file(`Chapter/chapter_${i+1}.html`, cha)
    }
    let c = copf(options.title,
        options.author, options.desc, options.content, imglist2,content,uuid)
    OEBPS.file("content.opf", c)
    zip.generateAsync({
        type: "nodebuffer"
    }).then(function(content) {
        fs.writeFileSync(`./save/${options.title}.epub`, content)
    })
}
module.exports = epub 