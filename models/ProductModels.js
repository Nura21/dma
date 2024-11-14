var dbDMA = require("../library/dbConnection");

const ProductModels = (module.exports = {
  Insert: async function (data) {
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
        `INSERT INTO products` +
        `  (${col.join(", ")})  values (${valSql.join(", ")})`;

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
  GetAll: async function (id, type) {
    return new Promise((resolve, reject) => {
      let operator = "WHERE";
      let query = `SELECT * FROM products`;

      if (type !== undefined && type === "transaction") {
        query += " WHERE status = 'ACTIVE'";
      }

      if (id != undefined) {
        if (type !== undefined) {
          operator = "AND";
        }

        query += ` ${operator} id = ` + id;
      }

      query += " ORDER BY id desc";
console.log(query)
      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  GetByIds: async function (ids) {
    return new Promise((resolve, reject) => {
      let query = `SELECT id, price FROM products WHERE id IN (?)`;

      dbDMA.query(query, [ids], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  Delete: async function (id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE products SET status = '0' WHERE id = ` + id;

      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  Update: async function (data, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE products SET`;

      if (data.name != undefined) {
        query += ` name = '${data.name}', `;
      }

      if (data.image != '') {
        query += `image = '${data.image}', `;
      }

      if (data.description != undefined) {
        query += `description = '${data.description}', `;
      }

      if (data.price != undefined) {
        query += `price = '${data.price}', `;
      }

      if (data.status != undefined) {
        query += `status = '${data.status}', `;
      }

      if (data.updated_at != undefined) {
        query += `updated_at = '${data.updated_at}', `;
      }

      query = query.replace(/,\s*$/, "");

      query += ` WHERE id = '${id}'`;

      dbDMA.query(query, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
});
