/*eslint strict: ["error", "global"]*/

"use strict";

const debug = require('debug')('ssc:mocks');
const query = require('./middleware/query');

// exports.post = query({})(req, res);
exports.post = function(req, res) {
  query({})(req, res);
}
