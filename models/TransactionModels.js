var dbDMA = require("../library/dbConnection");

const TransactionModels = (module.exports = {
  Insert: async function (data, tableName) {
    return new Promise((resolve, reject) => {
      var col = [];
      var val = [];
      var valSql = [];

      var i = 1;
      for (var d in data) {
        col.push(d);
        val.push(data[d]);
        valSql.push("?");
        i++;
      }

      var query =
        `INSERT INTO ${tableName}` +
        ` (${col.join(", ")})  values (${valSql.join(", ")})`;

      dbDMA.query(query, val, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: result.insertId,
          });
        }
      });
    });
  },
  GetAll: async function () {
    return new Promise((resolve, reject) => {
      let query = `SELECT id, code, total_price, created_at FROM transactions ORDER BY id desc`;

      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  },
  GetBestSellingProducts: async function (data) {
    return new Promise((resolve, reject) => {
      let query = `SELECT products.name, transaction_details.product_id, SUM(transaction_details.qty) 
                AS total_qty FROM transaction_details LEFT JOIN products
                ON transaction_details.product_id = products.id`;

      if (data.start_date != undefined && data.end_date != undefined) {
        query += `WHERE transaction_details.created_at BETWEEN '${data.start_date}' 
                    AND '${data.end_date}'`;
      }

      query += ` GROUP BY transaction_details.product_id ORDER BY total_qty DESC LIMIT 1`;

      dbDMA.query(query, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  },
  GetTotalTransactionsAndPrices: async function (data) {
    return new Promise((resolve, reject) => {
      let query = `
                SELECT 
                    (SELECT COUNT(*) FROM transactions) AS total_transactions,
                    (SELECT SUM(total_price) FROM transactions) AS total_sum
            `;

      if (data.start_date != undefined && data.end_date != undefined) {
        query += `
                    WHERE created_at BETWEEN '${data.start_date}' AND '${data.end_date}'
                `;
      }

      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  },
  Income: async function () {
    return new Promise((resolve, reject) => {
      // '%Y-%m' for 2023-01
      // '%M' for January
      // '%m' for 01
      // let query = `SELECT DATE_FORMAT(created_at, '%M') AS month,
      //   SUM(total_price) AS total_income
      //   FROM transactions GROUP BY month`;

      let query = `SELECT DATE_FORMAT(created_at, '%M') AS month,
        COUNT(*) AS total_transactions,
        SUM(total_price) AS total_income
        FROM transactions
        GROUP BY month`;

      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  // GetTotalTransactions: async function(data) {
  //     return new Promise((resolve, reject) => {
  //         let query = `SELECT COUNT(*) AS total_transactions FROM transactions`;

  //         if(data.start_date != undefined && data.end_date != undefined){
  //             query += `WHERE transaction_details.created_at BETWEEN '${data.start_date}'
  //                 AND '${data.end_date}'`;
  //         }

  //         dbDMA.query(query, function(err, result) {
  //             if(err) {
  //                 reject(err)
  //             } else {
  //                 console.log(result)
  //                 resolve(result)
  //             }
  //         })
  //     });
  // },
  // GetTotalPrices: async function(data) {
  //     return new Promise((resolve, reject) => {
  //         let query = `SELECT SUM(total_price) AS total_sum FROM transactions`;

  //         if(data.start_date != undefined && data.end_date != undefined){
  //             query += `WHERE transaction_details.created_at BETWEEN '${data.start_date}'
  //                 AND '${data.end_date}'`;
  //         }

  //         dbDMA.query(query, function(err, result) {
  //             if(err) {
  //                 reject(err)
  //             } else {
  //                 console.log(result)
  //                 resolve(result)
  //             }
  //         })
  //     });
  // },
  Detail: async function (id) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM transactions RIGHT JOIN transaction_details ON 
                transaction_details.transaction_id = transactions.id LEFT JOIN products ON 
                transaction_details.product_id = products.id WHERE transactions.id = ${id}`;

      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  },
  // Delete: async function(id) {
  //     return new Promise((resolve, reject) =>{
  //         let query = `UPDATE products SET status = '0' WHERE id = `+id

  //         dbDMA.query(query, function(err, result){
  //             if(err){
  //                 reject(err)
  //             }else{
  //                 resolve(result)
  //             }
  //         })
  //     });
  // },
});
