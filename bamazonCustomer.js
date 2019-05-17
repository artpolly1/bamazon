//GLOBAL VARIBLES 
//=============================================================
const mysql = require("mysql");
const chalkPipe = require("chalk-pipe");
const inquirer = require("inquirer");

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

//PRINTS MYSQL DATABASE TO THE CONSOLE
//==============================================================
connection.query("select * from products" ,function (err, rows, fields) {
    if (err) {
        console.log(err);
        return;
    }
    rows.forEach(function(result){
        console.log (result.item_id,result.product_name, result.department_name , result.price, result.stock_quantity);
       
    })
    start();
});

//THIS IS THE START FUNCTION THAT TRIGGERS THE INQUIRIER PROMPTS 
//============================================================================
function start(){
  
  inquirer.prompt ({
    name: "itemToBuy",
    type: "input",
    message: "What is the item_id of the product they would like to buy?",
    // choices: []
}).then(function(answer){
  if(answer.purchaseShoes === '1' ||'2'||'3'||'4'||'5'||'6'||'7'||'8'||'9'||'10'){
    purchaseShoes(answer.itemToBuy);
   }else {
       console.log (chalkPipe('redBright')('Please Try again'));
       
      
   }
}).catch(function(err){
console.log(err);
})

};

//THIS IS THE FUNCTION THAT TRIGGERS THE RESTARTS/ ENDS INQUIRIER PURCHASE PROMPTS 
//============================================================================
function makeAnotherPurchase(){
  inquirer.prompt ({
    name: "makeAnotherPurchase",
    type: "rawlist",
    message: "Woud you like to make another purchase?",
    choices: [
      'yes',
      'no'
    ]
  }
  
  ).then(function(answer){
    console.log(answer.makeAnotherPurchase);
    if(answer.makeAnotherPurchase === 'yes') {
      start();
    }else {
      console.log (chalkPipe('blue')('Thank you for visiting our site, Good Bye.'));

    }

  })
  
  };



//THIS IS THE PURCHASE FUNCTION THAT TRIGGERS THE INQUIRIER PURCHASE PROMPTS 
//============================================================================
function purchaseShoes(item_id){
  connection.query("SELECT * FROM products WHERE item_id = ?", [item_id], function(err, results){
      if (err) throw err;
      inquirer.prompt([

          {
            name: "purchaseChoice",
            type: "input",
            choices: function() {
                const choiceArray = [];
                for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].item_id);
                }
                return choiceArray;
            },
            message: "how many pair OF shoes would you like to add to your cart ?"
           
          }
      ]) .then(function(answer){
           let stock_quantity = results[0].stock_quantity;
           let price = results[0].price;
          
          if (stock_quantity >= parseInt(answer.purchaseChoice)) {
              
              connection.query(
                "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                [stock_quantity - parseInt(answer.purchaseChoice), item_id],
                
                
                function(error) {
                  if (error) throw err;
                  console.log(chalkPipe('greenBright')("Purchase made successfully!"));
                  console.log("Your total cost " + '$' + price * parseInt(answer.purchaseChoice));
                
                  makeAnotherPurchase();
                }
              );
      }else {
        console.log (chalkPipe('red')('Insufficient quantity!'));
        makeAnotherPurchase();
      }
            


      }).catch(function(err){
        console.log(err);

      });
  })

}
