export let content_opf = `<?xml version='1.0' encoding='UTF-8' standalone='no' ?>
<package version="2.0" unique-identifier="duokan-book-id" xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <metadata>
    <dc:identifier>{uuid}</dc:identifier>
    <dc:title>{bookName}</dc:title>
    <dc:description>{bookDesc}</dc:description>
    <dc:publisher>po18脸红心跳</dc:publisher>
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

export let toc_ncx = `<?xml version='1.0' encoding='UTF-8' standalone='no' ?>
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

export let chapter = `<!DOCTYPE html>
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

export let container = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
	<rootfiles>
		<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
	</rootfiles>
</container>`

export let mimetype = "application/epub+zip"