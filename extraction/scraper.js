var startURL = 'http://www.nasdaq.com/screening/companies-by-name.aspx?letter=C&page=2';
var urlParser = require('url');
var baseURL = 'http://www.nasdaq.com/screening/companies-by-name.aspx?';
var Nightmare = require('nightmare');
var nightmare = Nightmare({show: true});
var cheerio = require('cheerio');
var Bluebird = require('bluebird');
var fs = require('fs');

function getNextList(url){
    console.log(url);
nightmare
    .goto(url)
    .wait('#CompanylistResults')
    .evaluate(function () {
        return document.body.innerHTML;
    })
    .run(function (err, html) {
            var $ = cheerio.load(html);
            var linkArr = [];
            $('.quick-links').children().each(function (index, element) {
                if (element.attribs.href && element.attribs.href.indexOf('symbol') >= 0 && element.attribs.href.indexOf('stock-report') < 0) {
                    linkArr.push(element.attribs.href + '/historical');
                }
            });
            var lastPageUrl = $('#main_content_lb_LastPage')[0].attribs.href;
            var lastPageNumber = getParameter(lastPageUrl, 'page');


            return Bluebird.mapSeries(linkArr, function (link) {
                return getStockData(link).then(function (data) {
                    if(data.message){
                        console.log(data.message);
                        return;
                    }
                    var symbol = data[0].symbol;
                    var dataToWrite = JSON.stringify(data).replace(/,/g, ',\n');
                    fs.writeFileSync('data/' + symbol + '.json', dataToWrite);
                });
            }).then(function () {
                var currentPage = getParameter(url, 'page');
                if (currentPage < lastPageNumber) {
                    var nextPage = currentPage + 1;
                    var nextUrl = baseURL + 'letter=' + getParameter(url, 'letter') + '&page=' + nextPage;
                    getNextList(nextUrl);
                }
                else {
                    var letter = getParameter(url, 'letter');
                    var nextLetter = nextChar(letter);
                    var page = 1;
                    if (nextLetter.charCodeAt(0) <= 'Z'.charCodeAt(0)) {
                        var nextUrl = baseURL + 'letter=' + nextLetter + '&page=' + page;
                        getNextList(nextUrl);
                    }
                    else {
                        process.exit(1);
                    }
                }
            })
    });
}


function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}


function getParameter(url, parameter){
   var query = urlParser.parse(url).query.split('&');
   return query.reduce(function(prev, current){
        if(current.indexOf(parameter) >= 0){
            prev = current.split('=')[1];
        }
        return prev;
    }, '')
}

function getStockData(link) {
    return new Bluebird(function (resolve, reject) {
        var symbol = getSymbol(link);
        var dataArr = [];
        nightmare.goto(link)
            .wait('.table-headtag')
            .evaluate(function () {
                return document.body.innerHTML;
            })
            .run(function (err, html) {
                if(html) {
                    var $ = cheerio.load(html);
                    var object = {
                        symbol: symbol
                    };
                    $('td').each(function (index, element) {
                        if (index % 6 == 3) {
                            console.log(object);
                            if (Object.keys(object).length > 1) {
                                if (!object.symbol) {
                                    object.symbol = symbol;
                                }
                                dataArr.push(object);
                            }
                            object = {symbol: symbol};
                        }
                        element.children.forEach(function (child) {
                            var columnName = determineColumnName(index);
                            if (child.data) {
                                if (index % 6 != 3) {
                                    object[columnName] = parseFloat(child.data.trim());
                                }
                                else {
                                    object[columnName] = child.data.trim();
                                }
                            }
                        })
                    });
                    resolve(dataArr);
                }
                else{
                    resolve({message: 'shit fucked up'});
                }
            })
    })
}

function getSymbol(link) {
    var symbol = link.substring(link.indexOf('symbol/') + 7);
    symbol = symbol.substring(0, symbol.indexOf('/'));
    return symbol;
}

getNextList(startURL);


function determineColumnName(index) {
    switch (index % 6) {
        case 3:
            return 'date';
        case 4:
            return 'open';
        case 5:
            return 'high';
        case 0:
            return 'low';
        case 1:
            return 'high';
        case 2:
            return 'volume';

    }
}