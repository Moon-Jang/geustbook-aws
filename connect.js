module.exports.invoke = async () => {
    const mysql = require('mysql2');   
    // create the connection to database
    const connection = mysql.createConnection({
    host: 'test-for-study.cluster-cnp0zjrelbpj.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password : "v8gCEXQSsBAkEUvzsAzw",
    database: 'test-for-stduy'
    });
    return connection;
}
//test-for-study.cluster-cnp0zjrelbpj.ap-northeast-2.rds.amazonaws.com