/*eslint strict: ["error", "global"]*/

"use strict";

const fs = require('fs');

// returns a promise which resolves true if file exists:
exports.checkFileExists = function (filepath){
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, error => {
      resolve(!error);
    });
  });
}
