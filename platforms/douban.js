    let content = []
    let option = {}
    const axios = require("axios")
    const cheerio = require("cheerio")
let headers = {
    "Authorization": "",  
}
async function getNovel(bid) { 
        if(headers.Authorization.length==0) {
        console.log("please 先填写Authorization")
        return;
        }
        const detail = await douban(bid);
        if (detail) {
            option = Object.assign({}, detail);  
           await getCon(detail);
            return option
        }    
}

//by  国家三级艺术家
function FuckDouBan_i_have_a_pen_aaa_i_have_a_banana(data) {
    let result = ""
    if (Array.isArray(data)) {
        for (let item of data) {
            result += FuckDouBan_i_have_a_pen_aaa_i_have_a_banana(item)
        }
    } else if (Object.hasOwn(data, "content")) {
        if (Array.isArray(data.content)) {
            result += FuckDouBan_i_have_a_pen_aaa_i_have_a_banana(data.content)
        } else {
            result += data.content
        }
    }
    return result
}

function getContent(bid, pid, ii) {
    return new Promise(async resolve => {
        try {      
            let {data } = await axios.get(`https://read.douban.com/weixin/miniprogram/hot_fiction/${bid}/reader_data?chapter_id=${pid}`,{headers})
            content = ""
           let  title = data.title
           let json = data 
  for (let i = 0; i < json.posts.length; i++) {
        for (let w = 0; w < json.posts[i].contents.length; w++) {
            if (Object.hasOwn(json.posts[i].contents[w], "data")) {
                let data = json.posts[i].contents[w]                
                if (data.type === "illus") {              
                    img = data.data.size.orig
                    content += `<img src="${img.src}" width="${img.width}" height="${img.height}" />\n图\n`
                } else if (data.type === "paragraph") {                 
                    content += FuckDouBan_i_have_a_pen_aaa_i_have_a_banana(data.data.text) + "\n"
                }
            }
        }
    }         
            option.content[ii] = {
                title,
                data: content
            }
        } catch (err) {
            console.log(err)
            console.log("重新请求中");
            await getContent(bid, pid, ii);
        }
        resolve()
    })
}


//task()    
async function getCon(detail) {
    let k = 0;         
    const {data} = await axios.get(`https://read.douban.com/weixin/miniprogram/hot_fiction/${detail.bid}/chapters?start=0&limit=1000000&latestFirst=0&all=0`);      
        await Promise.all(
            data.list.map((li) => {
                const name = li.title
                console.log(`${k}.${name}`);
           //     if ($(li).text().match(/訂購/)) {
                   // console.log('    请购买');
                 //   return Promise.resolve();
          //      } else {
                    console.log("    下载中...");
k++
                    const href =``
                    const id = href.split('/');
                    return getContent( detail.bid,li.id, k, option).then(() => {});
         //       }
            })
        );
    
}
//downp18()
async function douban(bid) {
    let url1 = "https://read.douban.com/j/weixin/miniprogram/graphql"
    let data = {"query":"\n  query getColumn($worksId: ID) {\n    column: universalWorks(worksId: $worksId) {\n      ... on ColumnWorks {\n        columnId\n        isFinished\n        isAutoPricing\n        isDirectOnsale\n        isAutoPricing\n        leavingStatement\n        contest {\n          shortlistedInfo\n          season\n          url\n          awards {\n            icon\n            title\n            comment\n          }\n        }\n        rally {\n          voteEnded\n          isCurrentSeason\n        }\n        chapters {\n          total\n        }\n        lastPublishedChapter {\n          id\n          readerUrl\n          onSaleTime(format: TIMESTAMP)\n          title\n        }\n      }\n      ... on WorksBase {\n        id\n        cover\n        coverLabel\n        isOrigin\n        title\n        isOnSale\n        isPurchased\n        fixedPrice\n        salesPrice\n        isInLibrary\n        averageRating\n        ratingCount\n        hasEffectiveContract\n        hadEffectiveContract\n        createTime(format: ISO)\n        authorHighlight\n        editorHighlight\n        abstract\n        readCount\n        wordCount\n        inLibraryCount\n        kinds {\n          name\n        }\n        tags {\n          name\n        }\n        characterDesigns {\n          type\n          typeCN\n          name\n          description\n        }\n        copyrightInfo {\n          newlyAdapted\n          newlyPublished\n        }\n        vip {\n          canRead\n          discount\n          price\n        }\n        limitedVip {\n          canRead\n          isActive\n          endTime(format: TIMESTAMP)\n        }\n        similarWorksList(limit: 8) {\n          author {\n            name url\n          }\n          cover\n          coverLabel\n          isBundle\n          title\n          url\n        }\n        agent {\n          userId: id\n          agentName\n          hasMedal\n          avatar\n          url\n          isFollowing\n          publishedWorks {\n            total\n          }\n          lastPublishedWorks {\n            title\n            isChapter\n            url\n            onSaleTime(format: TIMESTAMP)\n            ... on ChapterWorks {\n              column {\n                url\n                title\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n","operationName":"getColumn","variables":{"worksId":bid}}
    let res = await axios.post(url1,data)       
    data = res.data.data.column
            let detail = {
                title: data.title,
                author: data.agent.agentName,
                cover: data.cover,
                description: data.abstract,
                content: [],         
                pub:"豆瓣阅读",   
                bid  };    
    return detail
}
module.exports = {getNovel};