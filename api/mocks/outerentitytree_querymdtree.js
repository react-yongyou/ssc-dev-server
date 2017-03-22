const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {

  const billTypeCode = req.body.billtypecode; // C0
  const mappingDefId = req.body.mappingdefid; // 1

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null
  };

  debug(`Open controller data file: outerentitytree_querymdtree.json`);
  const db = low(`${__dirname}/ctrl_data/outerentitytree_querymdtree.json`);

  // 为啥isEmpty返回的是Boolean对象?
  if (!db.isEmpty().valueOf()) {
    // const meta = db.get('__meta__').value(); // 获取meta信息
    var data = db.get('data').value();
    debug('data: %s', JSON.stringify(data));
    resObj.data = data;
  } else {
    resObj.success = false;
    resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/ctrl_data/目录';
  }

  res.json(resObj);
}
