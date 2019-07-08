# autoVote
用代理IP去做投票

在 autoVote.js 页面上有这几个常用参数需要设置。
var voteUrl = "http://www.ofweek.com/vote/voteactivitycontent.do?method=modTotalNumSingle&&id=4615"  // 投票url
var timeout = 20000 // 超时时间
var startPage = 1  // 免费ip代理页数开始
var endPage = 50  // 结束页面


run ： 
npm install request cheerio bluebird


node autoVote.js


