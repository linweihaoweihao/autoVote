var request = require("request");
var cheerio = require('cheerio')
var Promise = require('bluebird')
var successCount = 0
var total = 0
var voteUrl = "http://www.ofweek.com/vote/voteactivitycontent.do?method=modTotalNumSingle&&id=4615"  // 投票url
var timeout = 20000 // 超时时间
var startPage = 1  // 免费ip代理页数开始
var endPage = 50  // 结束页面

function getProxyWebpage(pn) {
    var options = {
        method: "get",
        url: "http://www.xiladaili.com/gaoni/" + pn
    }
    console.log("Request-url", options.url)
    return new Promise(function (resolve, reject) {
        request.get(options, function (err, ress, body) {
            // console.log("err, ress, body", body)
            if (!err && ress.statusCode == 200) {
                resolve(body)
            } else {
                reject(err)
            }
        })
    })
}

function extractProxy(html) {
    var $ = cheerio.load(html)
    var trList = $('tr')
    var ipUrls = []
    trList.each(function () {
        var tdList = $(this).find('td')
        var ip = $(tdList[0]).text()
        if ($(tdList[1]).text() === "HTTP代理") {
            ipUrls.push("http://" + ip)
        } else {
            ipUrls.push("https://" + ip)
        }
    })

    return ipUrls
}


function requestVote(proxyurl) {
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36',
        'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        'Upgrade-Insecure-Requests': 1,
        // 'Cookie': "_jzqckmp=1; uid=rBBkh1ZeUNQomkuEEpzgAg==; sto-id-20480=IHGEBAKMFAAA; _jzqx=1.1449025014.1449025014.1.jzqsr=xin%2Ecom|jzqct=/quanguo/s/b5s657o1a10i1v1/.-; PHPSESSID=db6rrcaalov903uai8rvetomo1; hmtsearch_type=brand; hmtsearch_record=46; XIN_ci_session=6z0r438D1maIbN6Mz0wGl6WCV4u411479vV%2FWOd4azsznh%2BpfzPtryX5GVuHOGNToyEg0oaAQb8WjWLvV6cr0zF8EYUkvayln0qYoBu63rOjgFNmtyVzQ548BpsQ3awvZUAFZWJkK7mRxtTSAJramIVrFzNPRFTx69WbxTb%2BQQrQidyyKjKivS54gp4V52OvRTJBCg%2BGRvO1Wl7MYLKDk%2FEtAOoPLULUFcaUk9%2BRB7Lyru2Njx3VFQEi%2BReUtz%2FYud5tYx8s6rgmWw3%2FQrlrY661nZ0%2F%2BHVEfqwIadgASXzKFNwrMDYcx0ib8qdlKTPoYhRqYFiNCfl9WH8OPs5gxwmiRK7ViGMaICcdOG7d701qkiYyxsBemtBwUAbyv45z3m0KnKgIaiS6cRl%2BW7tXPsR6sxsz9lID4vEfWt%2FQ%2BM4pqX4IXiIaW78msxtY4IIayhb0p3xwlUjFYV9in4Yi6xz5OwlZpiBJ1wvkw9pcxQHKBSB%2FfhH3oGHg%2BvzZSlmk6f589aecf4cc197d4e54e76b4bb93cc48c91f411; XIN_CARBROWSE_IDS=%5B11412192%2C11307964%5D; _qzja=1.645014287.1449021662989.1449021662989.1449025011203.1449027623181.1449029157979.0.0.0.31.2; _qzjb=1.1449025011202.25.0.0.0; _qzjc=1; _qzjto=31.2.0; _smt_uid=565e50de.5659b386; CNZZDATA1254778416=1435978663-1449017900-%7C1449026823; _jzqa=1.3883915374658527000.1449021664.1449021664.1449025014.2; _jzqc=1; _jzqb=1.52.10.1449025014.1; Hm_lvt_ae57612a280420ca44598b857c8a9712=1449021664; Hm_lpvt_ae57612a280420ca44598b857c8a9712=1449029159; XIN_LOCATION_CITY=%7B%22cityid%22%3A0%2C%22areaid%22%3A0%2C%22cityname%22%3A%22%5Cu5168%5Cu56fd%22%2C%22ename%22%3A%22quanguo%22%7D"
    }
    var targetOptions = {
        method: 'GET',
        headers,
        url: voteUrl,
        timeout,
    };
    ++total
    targetOptions.proxy = proxyurl;
    console.log(proxyurl, "successCount....", successCount, "....total...", total)
    return new Promise(function (resolve, reject) {
        request(targetOptions, function (error, response, body) {
            try {
                if (error) throw error;
                body = body.toString();
                // 这里看结果返回格式去判断了， 每个接口返回不一样
                if (body === '1' || body === 1) {
                    ++successCount
                }
                console.log(body);
                resolve()
            } catch (e) {
                console.error(e);
                resolve()
            }
        });
    })
}


function run(page) {
    return Promise.resolve()
        .then(() => {
            return getProxyWebpage(page)
        })
        .then(async function (html) {
            const ips = extractProxy(html)
            return Promise.map(ips, function (ipUrl) {
                return requestVote(ipUrl)
            }, { concurrency: 1 })
        })
        .then(() => {
            ++page
            if (page < endPage) {
                return run(page)
            }
            console.log('finish.....')
            process.exit(0)
        })
        .catch((err) => {
            console.log('err.....', err)
        })
}

return run(startPage)









