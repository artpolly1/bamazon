//GLOBAL VARIBLES 
//=============================================================
const mysql = require("mysql");
const inquirer = require("inquirer");
const unserInput = "";

//connecting node and mysql
//=============================================================

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});


connection.connect(function(err) {
  if (err) {
      throw err
    }else {
        console.log("connected as id: "+connection.threadId);
    }
  
});

