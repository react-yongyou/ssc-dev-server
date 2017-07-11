const debug = require('debug')('ssc:mocks');
const save = require('../middleware/save');

function post(req, res) {
  save({})(req, res);
}

module.exports = {
  post: post
};
