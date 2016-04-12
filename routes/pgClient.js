var pg = require('pg');
var Bluebird = require('bluebird');
var client = new pg.Client("postgres://jbkbkyyircgttb:RwDbfdHtdnLwwBx51G0xsk4kTU@ec2-23-21-249-224.compute-1.amazonaws.com:5432/dao6cb7d02if3r?ssl=true");
module.exports = {
    getRetToJSCONString: function () {
        return retToJSONString;
    },
    getConString: function () {
        return "postgres://jbkbkyyircgttb:RwDbfdHtdnLwwBx51G0xsk4kTU@ec2-23-21-249-224.compute-1.amazonaws.com:5432/dao6cb7d02if3r?ssl=true";
    },
    query: function (queryToExecute, queryDone) {
        pg.connect("postgres://jbkbkyyircgttb:RwDbfdHtdnLwwBx51G0xsk4kTU@ec2-23-21-249-224.compute-1.amazonaws.com:5432/dao6cb7d02if3r?ssl=true", function (err, client, done) {
            var handleError = function (err, client, done) {
                // no error occurred, continue with the request
                if (!err) return false;


                // An error occurred, remove the client from the connection pool.
                // A truthy value passed to done will remove the connection from the pool
                // instead of simply returning it to be reused.
                // In this case, if we have successfully received a client (truthy)
                // then it will be removed from the pool.
                queryDone(err);
                //if(client){
                //    done(client);
                //}

            };
            // handle an error from the connection
            if (handleError(err, client, done)) return;

            client.query(queryToExecute, function (err, result) {
                done(client); ///release the client back to the pool before we move on
                if (handleError(err)) {
                    console.log(queryToExecute);
                    return;
                }
                ///return the result of the query
                queryDone(result);
            });
        });
    },
    querySync: function (query) {
        return new Bluebird(function (resolve, reject) {
            pg.connect("postgres://jbkbkyyircgttb:RwDbfdHtdnLwwBx51G0xsk4kTU@ec2-23-21-249-224.compute-1.amazonaws.com:5432/dao6cb7d02if3r?ssl=true", function (err, client, done) {
                var handleError = function (err, client, done) {
                    // no error occurred, continue with the request
                    if (!err) return false;


                    reject(err);
                };
                // handle an error from the connection
                if (handleError(err, client, done)) return;

                client.query(query, function (err, result) {
                    done(client); ///release the client back to the pool before we move on
                    if (handleError(err)) {
                        return;
                    }
                    ///return the result of the query
                    resolve(result);
                });
            });


        })


    }
};