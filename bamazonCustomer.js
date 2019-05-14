//GLOBAL VARIBLES 
//=============================================================
const mysql = require("mysql");
const chalkPipe = require("chalk-pipe");
const inquirer = require("inquirer");
require('console.table');
const unserInput = "";


//connecting node and mysql
//=============================================================

const connection = mysql.createConnection({
  host: "localhost", //default host name 
  port: 3306,  //default mysql port #
  user: "root", //default user name 
  password: "password", // password will be hidden in dotenv file
  database: "bamazon_db"  // mysql database
});

//establish connection: mysql and nodeJS
//===============================================================
connection.connect(function(err) {
  if (err) {
      throw err;
    }else {
        console.log("connected as id: "+connection.threadId);
    }
   
});

//PRINTS THE DATABASE TO THE CONSOLE
//==============================================================


connection.query("select * from products" ,function (err, rows, fields) {
    if (err) {
        console.log(err);
        return;
    }
    // rows.forEach(function(result){
    //     console.log (result.item_id,result.product_name, result.department_name , result.price, result.stock_quantity);
       
    // })
    start();
});

//THIS IS THE START FUNCTION THAT TRIGGERS THE INQUIRIER PROMPTS 
//============================================================================
function start(){
  
  inquirer.prompt ({
    name: "itemToBidOn",
    type: "input",
    message: "What is the item_id of the product they would like to buy?",
    // choices: []
}).then(function(answer){
  if(answer.itemToBidOn === '1' ||'2'||'3'||'4'||'5'||'6'||'7'||'8'||'9'||'10'){
    postBid();
   }else {
       console.log('Please try again');
   }
}).catch(function(err){
console.log(err);
})

};


function postBid(){
  connection.query("SELECT * FROM products", function(err, results){
      if (err) throw err;
      inquirer.prompt([

          {
            name: "bidChoice",
            type: "input",
            choices: function() {
                const choiceArray = [];
                for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            },
            message: "how many would you liek to purchase?"
           
          },
          {
              name: "bid",
              type: "input",
              message: "test"
          }
      ]) .then(function(answer){
          let chosenItem;
          for (let i = 0; i < results.length; i++) {
              if(results[1].product_name === answer.choice) {
                  chosenItem = results[i];
              }
          }
          if (chosenItem.highest_bid < parseInt(answer.bid)) {
              // bid was high enough, so update db, let the user know, and start over
              connection.query(
                "UPDATE auctions SET ? WHERE ?",
                [
                  {
                    highest_bid: answer.bid
                  },
                  {
                    id: chosenItem.id
                  }
                ],
                function(error) {
                  if (error) throw err;
                  console.log("Bid placed successfully!");
                  start();
                }
              );
      }
            


      }).catch(function(err){
        console.log(err);

      });
  })

}
