const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const dbQuery = require('./common_controller').dbQuery;

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

function get(req, res) {
  dbQuery(req, res, {
    data: 'mobx_posts.json',
    error: ERROR_TYPE
  });
}

module.exports = {
  get: get
};
