'use strict';

module.exports.write = async event => {
  const connection = await require('./connect.js').invoke();
  const input = JSON.parse(event.body);
  const bcrypt = require('bcrypt');

  if(!input.name || !input.contents || !input.password){
    return {
      statusCode : 400,
      body: '인풋 더 줘',
    }
  }
  // 임의의 소금을 생성하고, 10번의 키 스트레칭을 통해 해시를 생성
  //비밀번호 해쉬화 및 데이터 insert
  const password_hash = await new Promise((resolve, reject) =>{
    bcrypt.hash(input.password, 10,  function(err, hash) {
      input.password = hash;
      resolve(hash);
    });
  });
  const resultQuery = connection.execute("INSERT INTO guestbook (name,contents,password) VALUES (?,?,?);",[input.name,input.contents,input.password]);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: 'write success',
  };
};

module.exports.read = async event => {
  const connection = await require('./connect.js').invoke();
  
  const page = JSON.parse(event.body).page;
  let contents = new Array();
  console.log("pageNum : "+page);
  const [rows, fields]= await connection.execute(
    "select"+
    " gb.idx,"+
    "gb.contents,"+
    "gb.name,"+
    "gb.password,"+
    "date_format(gb.wdate,'%y-%m-%d %T') as wdate,"+
    "gb.alive "+
    "FROM (SELECT * FROM guestbook order by wdate desc) gb WHERE NOT gb.alive = 0 LIMIT ?,? ;",[(page-1)*10,10]);
  contents = rows;
  //console.log(rows);
 //비교함수 
 
  //console.log(resultQuery);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(contents),
  };
};


module.exports.delete = async event => {
  const connection = await require('./connect.js').invoke();
  const bcrypt = require('bcrypt');
  const input = JSON.parse(event.body);
  let output;
  const [rows, fields]= await connection.execute("select password FROM guestbook WHERE idx = ? ;",[input.idx]);
  if(!rows[0]){
    return {
      statusCode: 401,
      body: "Empty data",
    };
  }
  console.log("idx :"+input.idx +"  password :"+rows[0].password);
  const result = bcrypt.compareSync(input.password, rows[0].password);
  console.log(result);
  if(result){
    //DELETE
    connection.execute("UPDATE guestbook SET alive = ? WHERE idx = ?;",[0,input.idx]);
    output = {
      statusCode: 200,
      body: "delete success",
    };
  }else{
    //delete fail
    console.log("delete fail");
    output = {
      statusCode: 401,
      body: "delete fail",
    };
  }
  return output;
};

module.exports.update = async event => {
  const connection = await require('./connect.js').invoke();
  const bcrypt = require('bcrypt');
  const input = JSON.parse(event.body);
  let output;
  const [rows, fields]= await connection.execute("select password,alive FROM guestbook WHERE idx = ? ;",[input.idx]);
  if(!rows[0]){ //데이터를 못불러왔을때
    return {
      statusCode: 404,
      body: "404 NOT FOUND ..not exist data",
    };
  }
  console.log("aliveStatus : "+rows[0].alive+"   idx :"+input.idx +"  password :"+rows[0].password);
  const result = bcrypt.compareSync(input.password, rows[0].password);
  console.log(result);
  if(rows[0].alive == 0) { //삭제된 데이터일때
    return output = {
      statusCode: 404,
      body: "404 NOT FOUND  ..deleted data",
    };
  }
  if(result){
    //UPDATE success
    connection.execute("UPDATE guestbook SET contents = ? WHERE idx = ?;",[input.contents,input.idx]);
    output = {
      statusCode: 200,
      body: "UPDATE success",
    };
  }else{
    //UPDATE fail
    console.log("UPDATE fail");
    output = {
      statusCode: 401,
      body: "UPDATE fail",
    };
  }
  return output;
};

module.exports.addtestdata = async event => {
  const sqlConnect = await require("./connect.js").invoke()
  const bcrypt = require('bcrypt');
  const input = JSON.parse(event.body)
  if(!input.test) {
    return {
      statusCode: 400,
      body: "INPUT DATA가 부족합니다."
    }
  }
  let password;
  for(let i = 1; i <= 500; i++) {
    const password_hash = await new Promise((resolve, reject) =>{
      password =`${i}`;
      bcrypt.hash(password, 8,  function(err, hash) {
        password = hash;
        resolve(hash);
      });
    });
    //console.log(password);
    const resultQuery = await sqlConnect.execute("INSERT INTO guestbook (name, contents, password) VALUES (?, ?, ?);", ["MR." + String(i), "I say " + String(i), String(password)]);
  }

  return {
    statusCode: 200,
    body: "success"
  }
}