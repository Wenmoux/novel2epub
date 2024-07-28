let content = []
let option = {}
const axios = require("axios")
const cheerio = require("cheerio")
const userId = "";
const authCookie = ""
const g = { "e": 15, "b": "1.8.0", "d": "864394106400106", "a": "aDVGYWtlZEFwaUtleQ==zzz", "c": { "qiyiId": "864394106400106", "srcPlatform": 15, "apiKey": "aDVGYWtlZEFwaUtleQ==zzz" } }
function getSign(bookid, chapterid) {
    function CC(t, e, n) {
        var r;
        function i(t, e) {
            var n = (65535 & t) + (65535 & e);
            return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
        }
        function a(t, e, n, r, o, a) {
            return i((u = i(i(e, t), i(r, a))) << (s = o) | u >>> 32 - s, n);
            var u, s
        }
        function u(t, e, n, r, o, i, u) {
            return a(e & n | ~e & r, t, e, o, i, u)
        }
        function s(t, e, n, r, o, i, u) {
            return a(e & r | n & ~r, t, e, o, i, u)
        }
        function c(t, e, n, r, o, i, u) {
            return a(e ^ n ^ r, t, e, o, i, u)
        }
        function f(t, e, n, r, o, i, u) {
            return a(n ^ (e | ~r), t, e, o, i, u)
        }
        function l(t, e) {
            var n, r, o, a, l;
            t[e >> 5] |= 128 << e % 32,
                t[14 + (e + 64 >>> 9 << 4)] = e;
            var p = 1732584193
                , h = -271733879
                , d = -1732584194
                , v = 271733878;
            for (n = 0; n < t.length; n += 16)
                r = p,
                    o = h,
                    a = d,
                    l = v,
                    h = f(h = f(h = f(h = f(h = c(h = c(h = c(h = c(h = s(h = s(h = s(h = s(h = u(h = u(h = u(h = u(h, d = u(d, v = u(v, p = u(p, h, d, v, t[n], 7, -680876936), h, d, t[n + 1], 12, -389564586), p, h, t[n + 2], 17, 606105819), v, p, t[n + 3], 22, -1044525330), d = u(d, v = u(v, p = u(p, h, d, v, t[n + 4], 7, -176418897), h, d, t[n + 5], 12, 1200080426), p, h, t[n + 6], 17, -1473231341), v, p, t[n + 7], 22, -45705983), d = u(d, v = u(v, p = u(p, h, d, v, t[n + 8], 7, 1770035416), h, d, t[n + 9], 12, -1958414417), p, h, t[n + 10], 17, -42063), v, p, t[n + 11], 22, -1990404162), d = u(d, v = u(v, p = u(p, h, d, v, t[n + 12], 7, 1804603682), h, d, t[n + 13], 12, -40341101), p, h, t[n + 14], 17, -1502002290), v, p, t[n + 15], 22, 1236535329), d = s(d, v = s(v, p = s(p, h, d, v, t[n + 1], 5, -165796510), h, d, t[n + 6], 9, -1069501632), p, h, t[n + 11], 14, 643717713), v, p, t[n], 20, -373897302), d = s(d, v = s(v, p = s(p, h, d, v, t[n + 5], 5, -701558691), h, d, t[n + 10], 9, 38016083), p, h, t[n + 15], 14, -660478335), v, p, t[n + 4], 20, -405537848), d = s(d, v = s(v, p = s(p, h, d, v, t[n + 9], 5, 568446438), h, d, t[n + 14], 9, -1019803690), p, h, t[n + 3], 14, -187363961), v, p, t[n + 8], 20, 1163531501), d = s(d, v = s(v, p = s(p, h, d, v, t[n + 13], 5, -1444681467), h, d, t[n + 2], 9, -51403784), p, h, t[n + 7], 14, 1735328473), v, p, t[n + 12], 20, -1926607734), d = c(d, v = c(v, p = c(p, h, d, v, t[n + 5], 4, -378558), h, d, t[n + 8], 11, -2022574463), p, h, t[n + 11], 16, 1839030562), v, p, t[n + 14], 23, -35309556), d = c(d, v = c(v, p = c(p, h, d, v, t[n + 1], 4, -1530992060), h, d, t[n + 4], 11, 1272893353), p, h, t[n + 7], 16, -155497632), v, p, t[n + 10], 23, -1094730640), d = c(d, v = c(v, p = c(p, h, d, v, t[n + 13], 4, 681279174), h, d, t[n], 11, -358537222), p, h, t[n + 3], 16, -722521979), v, p, t[n + 6], 23, 76029189), d = c(d, v = c(v, p = c(p, h, d, v, t[n + 9], 4, -640364487), h, d, t[n + 12], 11, -421815835), p, h, t[n + 15], 16, 530742520), v, p, t[n + 2], 23, -995338651), d = f(d, v = f(v, p = f(p, h, d, v, t[n], 6, -198630844), h, d, t[n + 7], 10, 1126891415), p, h, t[n + 14], 15, -1416354905), v, p, t[n + 5], 21, -57434055), d = f(d, v = f(v, p = f(p, h, d, v, t[n + 12], 6, 1700485571), h, d, t[n + 3], 10, -1894986606), p, h, t[n + 10], 15, -1051523), v, p, t[n + 1], 21, -2054922799), d = f(d, v = f(v, p = f(p, h, d, v, t[n + 8], 6, 1873313359), h, d, t[n + 15], 10, -30611744), p, h, t[n + 6], 15, -1560198380), v, p, t[n + 13], 21, 1309151649), d = f(d, v = f(v, p = f(p, h, d, v, t[n + 4], 6, -145523070), h, d, t[n + 11], 10, -1120210379), p, h, t[n + 2], 15, 718787259), v, p, t[n + 9], 21, -343485551),
                    p = i(p, r),
                    h = i(h, o),
                    d = i(d, a),
                    v = i(v, l);
            return [p, h, d, v]
        }
        function p(t) {
            var e, n = "", r = 32 * t.length;
            for (e = 0; e < r; e += 8)
                n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
            return n
        }
        function h(t) {
            var e, n = [];
            for (n[(t.length >> 2) - 1] = void 0,
                e = 0; e < n.length; e += 1)
                n[e] = 0;
            var r = 8 * t.length;
            for (e = 0; e < r; e += 8)
                n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
            return n
        }
        function d(t) {
            var e, n, r = "";
            for (n = 0; n < t.length; n += 1)
                e = t.charCodeAt(n),
                    r += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(15 & e);
            return r
        }
        function v(t) {
            return unescape(encodeURIComponent(t))
        }
        function y(t) {
            return function (t) {
                return p(l(h(t), 8 * t.length))
            }(v(t))
        }
        function g(t, e) {
            return function (t, e) {
                var n, r, o = h(t), i = [], a = [];
                for (i[15] = a[15] = void 0,
                    o.length > 16 && (o = l(o, 8 * t.length)),
                    n = 0; n < 16; n += 1)
                    i[n] = 909522486 ^ o[n],
                        a[n] = 1549556828 ^ o[n];
                return r = l(i.concat(h(e)), 512 + 8 * e.length),
                    p(l(a.concat(r), 640))
            }(v(t), v(e))
        }
        function m(t, e, n) {
            return e ? n ? g(e, t) : d(g(e, t)) : n ? y(t) : d(y(t))
        }
        a = m(t, null, null)
        console.log(a)
        return a
    }

    var r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        , o = function (t) {
            for (var e = "", n = t.length - 1; n >= 0; n--) {
                var r = t.charCodeAt(n);
                e += r.toString(16)
            }
            return parseInt(e, 16)
        }("reader");
    function i(t, e) {
        t = t.toString(2).split("").reverse(),
            e = e.toString(2).split("").reverse();
        for (var n = Math.max(t.length, e.length), r = [], o = 0; o < n; o++)
            r.push(t[o] && e[o] ? t[o] !== e[o] ? 1 : 0 : t[o] || e[o]);
        return parseInt(r.reverse().join(""), 2)
    }
    function B(t) {
        return t ? i(function (t, e) {
            for (var n = 0, o = t.length, i = void 0, a = 0; a < o; a++)
                i = r.indexOf(t.charAt(a)),
                    n += i * Math.pow(e, o - a - 1);
            return n
        }(t, 36), o) : 0
    }
    e = B(bookid)
    n = B(chapterid)
    r = "apiKey=" + g.a + "&bookId=" + e + "&chapterId=" + n + "&srcPlatform=" + g.e + "1b4c8580fd2607e13d4754015db6090d"
    sign = CC(r)
    return sign
}

async function getContent(bookId, chapterId, ii, title) {
    sign = getSign(bookId, chapterId)
    let url = `https://api-yuedu.iqiyi.com/book/h5/bookRead?apiKey=${g.a}&sign=${sign}&srcPlatform=${g.e}&authCookie=${authCookie}&userId=${userId}&appType=2&bookId=${bookId}&chapterId=${chapterId}&fields=read&sourceType=-1`
    let res = await axios.get(url)
    const rawText = res.data.text
    const lines = rawText.split("\n");
    const result = lines.map(line => `<p>${line}</p>`).join("");
    option.content[ii] = {
        title,
        data: result
    }
    res.data.text
}
let headers = {
}
async function getNovel(bid) {
    if (userId.length == 0) {
        console.log("please 先填写userId authCookie")
        return;
    }
    const detail = await getdetail(bid);
    if (detail) {
        option = Object.assign({}, detail);
        await getCon(detail);
        content = option.content
        option.volumes= 
       [ {
            title: "正文",
            chapters: content}]
        return option
    }

}






async function getCon(detail) {
    const urls = Array.from({
        length: detail.pageNum
    }, (_, i) => `https://wenxue.m.iqiyi.com/book/catalog-${detail.bid}-${i + 1}.html`);
    let k = 0;
    for (const url of urls) {
        console.log(`第${urls.indexOf(url) + 1}页`);
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list = $('.catalog-list>dd>.catalog-chapter');
        await Promise.all(
            list.toArray().map((li) => {
                const name = $("a", li).text();
                if ($(li).text().match(/訂購/)) {
                    return Promise.resolve();
                } else {
                    k++
                    const href = $("a", li).attr('href');
                    const id = href.split('\.')[2].split("-");
                    console.log("    下载中...", `${k}.${name}---`, id[2]);
                    return getContent(id[1], id[2], k, name).then(() => { });
                }
            })
        );
    }
}
//downp18()
async function getdetail(bid) {
    let url = `https://wenxue.m.iqiyi.com/book/detail-${bid}.html`
    let res = await axios.get(url)
    console.log(res.data)
    let $ = cheerio.load(res.data)
    let zh = $(".chapter-all").text().match(/\d+/)
    let detail = {
        title: $("h1").text(),
        author: $(".book-details-about>em.writerName").text(),
        cover: "https:" + $('.bookBigCover>a>img').attr("src"),
        description: $(".book-details-briefing").text(),
        content: [],
        bid,
        tags:"爱奇艺",
        pub: "爱奇艺文学",
        pageNum: Math.ceil(zh / 100)
    };
    console.log(detail)
    return detail
}
module.exports = { getNovel };