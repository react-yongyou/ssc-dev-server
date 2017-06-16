const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const commonController = require('./common_controller').commonController;

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

function post(req, res) {
  commonController(req, res, {
    data: 'mappingentity_querychildren.json',
    error: ERROR_TYPE
  });
}

module.exports = {
  post: post
};
