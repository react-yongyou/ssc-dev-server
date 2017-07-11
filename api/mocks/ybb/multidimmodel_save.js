const debug = require('debug')('ssc:mocks');
const save = require('../middleware/save');

function post(req, res) {
  save({
    dbDir: `${__dirname}/db_data`,
  })(req, res);
}

module.exports = {
  post: post
};
