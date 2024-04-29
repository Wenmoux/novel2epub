const fs = require("fs");
const fs2 = require("fs").promises; // 引入fs模块的promises API

// 假设已经有一个初始化的JSZip实例

const JSZip = require("jszip");
const axios = require("axios");
let main_css = fs.readFileSync("./assets/main.css");
// Helper functions
function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
async function imgd(img) {
  return await axios
    .get(img, {
      responseType: "arraybuffer",
    })
    .then(function (response) {
      return response.data;
    });
}
function generateContainer() {
  return `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`;
}

function generateChapterHTML(title, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="../Styles/main.css"/>
</head>
<body>
    <h2>${title}</h2>
    ${content}
</body>
</html>`;
}

function generateVolumeHTML(title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="../Styles/main.css"/>
</head>
<body>
    <h1>${title}</h1>
</body>
</html>`;
}

function generateContentOpf(book, uuid) {
  let manifestItems = `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`;
  let spineItems = "";

  book.volumes.forEach((volume, vIndex) => {
    manifestItems += `\n<item id="volume_${vIndex + 1}" href="Text/volume_${vIndex + 1}.html" media-type="application/xhtml+xml"/>`;
    spineItems += `\n<itemref idref="volume_${vIndex + 1}"/>`;
    volume.chapters.forEach((chapter, cIndex) => {
      manifestItems += `\n<item id="chapter_${vIndex + 1}_${cIndex + 1}" href="Text/chapter_${vIndex + 1}_${cIndex + 1}.html" media-type="application/xhtml+xml"/>`;
      spineItems += `\n<itemref idref="chapter_${vIndex + 1}_${cIndex + 1}"/>`;
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>${book.title}</dc:title>
        <dc:creator>${book.author}</dc:creator>
        <dc:identifier id="bookid">urn:uuid:${uuid}</dc:identifier>
        <dc:language>zh</dc:language>
        <meta name="cover" content="cover-image" />
    </metadata>
    <manifest>
        ${manifestItems}
    </manifest>
    <spine toc="ncx">
        ${spineItems}
    </spine>
</package>`;
}

// 生成toc.ncx文件的函数
function generateTocNcx(book, uuid) {
  let navPoints = "";
  let playOrder = 1;

  book.volumes.forEach((volume, vIndex) => {
    navPoints += `\n<navPoint id="volume_${vIndex + 1}" playOrder="${playOrder++}">
            <navLabel><text>${volume.title}</text></navLabel>
            <content src="Text/volume_${vIndex + 1}.html"/>
        `;
    volume.chapters.forEach((chapter, cIndex) => {
      navPoints += `\n<navPoint id="chapter_${vIndex + 1}_${cIndex + 1}" playOrder="${playOrder++}">
                <navLabel><text>${chapter.title}</text></navLabel>
                <content src="Text/chapter_${vIndex + 1}_${cIndex + 1}.html"/>
            </navPoint>`;
    });
    navPoints += "</navPoint>";
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle><text>${book.title}</text></docTitle>
    <navMap>
        ${navPoints}
    </navMap>
</ncx>`;
}
async function addCoverImage(coverImage, cpof, isLocal, zip) {
  try {
    let imageData;
    if (isLocal) {
      // 从本地文件系统读取图片
      imageData = await fs2.readFile(coverImage);
    } else {
      const response = await axios({
        method: "get",
        url: coverImage,
        responseType: "arraybuffer",
      });
      imageData = response.data;
    }
    // 将图片作为封面添加到EPUB中
    zip.file("OEBPS/Images/cover.jpg", imageData);
    updateContentOpfForCover(copf, zip);
  } catch (error) {
    console.error("处理封面图片失败:", error);
  }
}
function updateContentOpfForCover(copf, zip) {
  // 在manifest中添加封面图片的条目
  const coverImageEntry = `<item id="cover-image" href="Images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>`;
  content = copf.replace("</manifest>", `    ${coverImageEntry}\n</manifest>`);
  // 替换content.opf文件
  zip.file("OEBPS/content.opf", content);
}
async function generateEpub(book) {
    console.log(book);
    let zip = new JSZip();
    let uuid = guid();
    // Add mimetype file
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
    // Add container file
    zip.folder("META-INF").file("container.xml", generateContainer());
    // OEBPS folder
    let oebps = zip.folder("OEBPS");
    oebps.folder("Styles").file("main.css", main_css);
      book.volumes.forEach((volume, vIndex) => {
        oebps.file(
          `Text/volume_${vIndex + 1}.html`,
          generateVolumeHTML(volume.title),
        );
        volume.chapters.forEach(async (chapter, cIndex) => {
          console.log(chapter);
          let chtml = generateChapterHTML(chapter.title, chapter.content);
          console.log(chapter.content);
          let img = chtml.match(/(?<=(img[^>]*src="))[^"]*/g);
          let imglist = [];
          for (let j in img) {
            j = Number(j);
            imgdata = imgd(img[j]);
            zip.file(
              `OEBPS/Images/chapter_${cIndex + 1}_image_${j}.jpg`,
              imgdata,
            );
            chtml = chtml.replace(
              img[j],
              `../Images/chapter_${cIndex + 1}_image_${j}.jpg`,
            );
          }
          oebps.file(`Text/chapter_${vIndex + 1}_${cIndex + 1}.html`, chtml);
        });
      });
    copf = generateContentOpf(book, uuid);
    oebps.file("content.opf", copf);
    oebps.file("toc.ncx", generateTocNcx(book, uuid));
    await addCoverImage(book.cover, copf, false, zip);
    zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
      fs.writeFileSync(
        `./save/${book.title.replace(/\s+/g, "_")}.epub`,
        content,
      );
    });
  }
  
  /*
book = {
	volumes: [{
			title: "卷一",
			chapters: [
				title,
				content
			]
		}
	]
}  
  */
module.exports = generateEpub;