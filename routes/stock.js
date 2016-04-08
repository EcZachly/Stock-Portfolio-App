var fs = require('fs');

function getStockData(request, response){
    var symbol = request.query.symbol;
    response.json(JSON.parse(fs.readFileSync(__dirname.substring(0, __dirname.length - 7) + '/extraction/data/' + symbol + '.json', 'utf-8')));
    //console.log();
    ////console.log(fs.statSync('/extraction/data/' + symbol + '.json'));
    //if(fs.statSync(__dirname.substring(0, __dirname.length - 7) + '/extraction/data/' + symbol + '.json').isFile()){
    //   var data = fs.readFileSync('../extraction/data/' + symbol + '.json', 'utf-8');
    //    response.json(data);
    //}
    //else{
    //    response.json({message: 'Symbol Could not be found'})
    //}
}
exports.getStockData = getStockData;