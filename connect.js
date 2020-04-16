module.exports.invoke = async () => {
    const mysql = require('mysql2/promise');   
    // create the connection to database
    const connection = mysql.createConnection({
    host: '52.78.18.86',
    user: 'root',
    password : "root",
    database: 'guestbook'
    });
    return connection;
}
/*pr1.ster.ws
test-for-study
SAgPuLMGYmITCzVg
test-for-study */
//test-for-study.cluster-cnp0zjrelbpj.ap-northeast-2.rds.amazonaws.com