const debug = require('debug')('ssc:mocks');
const deleteMiddleware = require('../middleware/delete');


module.exports = {
  post: post
};

function post(req, res) {
  deleteMiddleware({})(req, res);
}
