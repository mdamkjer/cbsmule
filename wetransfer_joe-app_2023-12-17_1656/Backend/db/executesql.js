let Connection = require('tedious').Connection;
let Request = require('tedious').Request;
const config = require("./config.json");

const executeSQL = (sql, userParams = []) => {
    return new Promise((resolve, reject) => {
        let connection = new Connection(config);

        connection.on('connect', function (err) {
            if (err) {
                reject(err);
            } else {
                const request = new Request(sql, function (err) {
                    if (err) {
                        reject(err);
                    }
                });

                // Add user parameters to the request
                userParams.forEach(param => {
                    request.addParameter(param.name, param.type, param.value);
                });

                connection.execSql(request);

                let counter = 0;
                let response = {};

                request.on('row', function (columns) {
                    response[counter] = {};
                    columns.forEach(function (column) {
                        response[counter][column.metadata.colName] = column.value;
                    });
                    counter += 1;
                });

                request.on('requestCompleted', () => {
                    resolve(response);
                });
            }
        });

        connection.connect();
    });
}

module.exports = { executeSQL };
// Ovenstående er Nicolais kode jvf youtube video "Connect til MSSQL med node.js" - dette gælder også koden i config.json