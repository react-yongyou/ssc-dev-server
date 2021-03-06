const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

function post(req, res) {

  const billTypeCode = req.body.billtypecode; // C0
  const mappingDefId = req.body.mappingdefid; // 1

  const resObj = {
    __fake_server__: true
  };

  switch(ERROR_TYPE) {
    default:
    case 0:
      debug(`Open controller data file: outerentitytree_querymdtree.json`);
      const db = low(`${__dirname}/ctrl_data/outerentitytree_querymdtree.json`);
      // 为啥isEmpty返回的是Boolean对象?
      if (!db.isEmpty().valueOf()) {
        // const meta = db.get('__meta__').value(); // 获取meta信息
        var data = db.get('data').value();
        debug('data: %s', JSON.stringify(data));
        resObj.data = data;
        resObj.success = true;
        resObj.message = null;
      } else {
        resObj.success = false;
        resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/ctrl_data/目录';
      }
      res.json(resObj);
      break;
    case 1:
      resObj.success = false;
      resObj.message = '查询失败。null';
      resObj.data = null;
      resObj.code = 0;
      res.json(resObj);
      break;
  }
}

module.exports = {
  post: post
};
