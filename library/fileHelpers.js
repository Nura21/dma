const fs = require('fs');
const path = require("path");

const STORAGE_PATH = path.join(__dirname, '../files/storage/');

const file_helpers = {
  STORAGE_URL: process.env.STORAGE + '/',
  save(filename, dirpath, rawBase64) {
    return new Promise((resolve, reject) => {
      const cleanBase64 = rawBase64.replace(/^data:(image|application)\/(png|jpg|jpeg);base64,/, '');
      const saveLocation = `${STORAGE_PATH}${dirpath}/${filename}`;

      file_helpers.ensureDirectoryExistence(saveLocation);

      fs.writeFile(saveLocation, cleanBase64, 'base64', function (err) {
        if (err) return reject(err);
        resolve(`${dirpath}/${filename}`);
      });
    });
  },
  ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    file_helpers.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  },
  remove(filenamepath) {
    return new Promise((resolve, reject) => {
      const removeLocation = `${STORAGE_PATH}${filenamepath}`;
      // if not exists mean, have been deleted
      if (!fs.existsSync(removeLocation)) return resolve(true);
      // if exist mean not deleted
      fs.unlink(removeLocation, function(err) {
        if (err) return reject(err);
        resolve(true);
      });
    })
  },
}

module.exports = file_helpers;