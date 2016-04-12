var fs = require('fs');
var postgres = require('./pgClient.js');
var Bluebird = require('bluebird');

function transformAndLoadStocks(stocks) {
    var query = "INSERT INTO daily_quotes(symbol, date, high, open, low, volume) VALUES (";
    return Bluebird.mapSeries(stocks, function (stock) {
        return new Bluebird(function (resolve, reject) {
            var values = "'" + stock.symbol + "', to_date('" + stock.date + "', 'MM/DD/YYYY'), " + stock.high + "," + stock.open + "," + stock.low + "," + stock.volume + ")";
            postgres.query(query + values, function (data) {
                resolve(data);
            })
        })
    });
}
exports.transformAndLoadStocks = transformAndLoadStocks;

function getQuotesBySymbol(object){
    return new Bluebird(function(resolve, reject){
        var query = "SELECT * FROM daily_quotes WHERE symbol='" + object.symbol + "'";
        if(object.date){
            query += object.dateAfter ? " AND date > to_date('" + object.date + "', 'YYYY-MM-DD')"  : " AND date < to_date('" + object.date + "', 'YYYY-MM-DD')"
        }
        postgres.query(query, function (cursor) {
            console.log(cursor);
            resolve(cursor.rows);
        })
    })
}


function getSymbols(){
    return new Bluebird(function(resolve, reject){
        var query = "SELECT DISTINCT symbol FROM daily_quotes;";
        postgres.query(query, function (cursor) {
            resolve(cursor.rows);
        })
    })
}


function getDistinctSymbols(request, response){
    getSymbols().then(function(symbols){
        symbols = symbols.map(function(symbol){
            return symbol.symbol;
        });
        response.json(symbols);
    })
}

exports.getDistinctSymbols = getDistinctSymbols;


/**
 * This takes query parameters date, symbol, and dateAfter
 * date must be formatted YYYY-MM-DD
 * dateAfter is true/false, when it's true, it only gets data after the parameter date, otherwise before
 * symbol is required and filters the data to a specific symbol
 * @param request
 * @param response
 */
function getQuotes(request, response){
    if(!request.query.symbol){
        response.json({message: 'symbol query parameter is required'})
        return;
    }
    if(request.query.symbol){
        getQuotesBySymbol(request.query).then(function(quotes){
            response.json(quotes);
        })
    }
}
exports.getQuotes = getQuotes;


