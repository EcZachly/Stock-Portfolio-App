var StockService = angular.module("StockService", []);

StockService.factory("StockService", ["$http", "$sessionStorage", "$location", "$window", function ($http, $sessionStorage, $location, $window) {
    var Stock = {};


    Stock.getQuotes = function (symbol) {
        return $http.get('/api/quotes?symbol=' + symbol).then(function (quotes) {
            return Stock.transformQuotes(quotes.data);
        })
    };

    Stock.getSymbols = function () {
        return $http.get('/api/symbols').then(function (quotes) {
            return quotes.data;
        })
    };



    Stock.transformQuotes = function (quotes) {
        var object = [
            {
                key: 'high',
                values: [],
                mean: 0
            },
            {
                key: 'low',
                values: [],
                mean: 0
            }
            //{
            //    key: 'close',
            //    values: [],
            //    mean: 0
            //}
        ];

        //array.map :  ['1','2','3'] -> ['2','4','6']
        //array.reduce: ['1','2','3'] -> {sum: 6}
        //array.reduceRight
       quotes.reduce(function(obj, currentRow){
            var date = new Date(currentRow.date).getTime();
            if(date > 0 && currentRow.high && currentRow.low) {


                var highArray = [];
                highArray[1] = currentRow.high;
                highArray[0] = date;
                var lowArray = [];
                lowArray[1] = currentRow.low;
                lowArray[0] = date;
                //var closeArray = [];
                //closeArray[0] = date;
                //closeArray[1] = currentRow.close;
                obj[0].values.push(highArray);
                obj[1].values.push(lowArray);
                //obj[2].values.push(closeArray);
            }
            return obj;
        }, object)


        object[0].mean = 50;
        object[1].mean = 50;
        //object[2].mean = 50;
        return object;

    }
    return Stock
}]);
