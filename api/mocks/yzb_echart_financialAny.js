const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const commonController = require('./common_controller').commonController;

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

function get(req, res) {
  commonController(req, res, {
    data: 'yzb_echart_financialAny.json',
    error: ERROR_TYPE
  });
}

module.exports = {
  get: get
};
