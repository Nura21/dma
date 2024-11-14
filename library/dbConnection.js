var mysql = require('mysql2')
var config = require('../config/env.config.js');
var pool = mysql.createPool(config.dbConfig)
var util = require('util')
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Koneksi database ditutup.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Basis data memiliki terlalu banyak koneksi.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Koneksi database ditolak.')
        }
    }
    if (connection) connection.release()
    return
})
pool.query = util.promisify(pool.query)
module.exports = pool;