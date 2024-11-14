const dbDMA = require("../library/dbConnection");

const userModels = (module.exports = {
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
        `INSERT INTO users` +
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

  UpdateToken: async function (userId, token, refresh_token) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET token = ?, refresh_token = ? WHERE id = ?`;
      dbDMA.query(query, [token, refresh_token, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  // Update: async function (Id, data) {
  //   return new Promise((resolve, reject) => {
  //     const query = `UPDATE users SET token = ?, refresh_token = ? WHERE id = ?`;
  //     dbDMA.query(query, [token, refresh_token, Id], (err, result) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // },

  GetUserById: async function (id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE id = ?`;
      dbDMA.query(query, [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  GetUserByEmail: async function (email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`;
      dbDMA.query(query, [email], function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  GetUserByToken: async function (token) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE refresh_token = ?`;
      dbDMA.query(query, [token], function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  },
});
