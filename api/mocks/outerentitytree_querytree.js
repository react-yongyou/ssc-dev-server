const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {

  const billTypeCode = req.body.billtypecode || ''; // 2643

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null
  };

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: outer_entity_tree.json`);
  const db = low(`${__dirname}/ctrl_data/outer_entity_tree.json`);

  // 为啥isEmpty返回的是Boolean对象?
  if (!db.isEmpty().valueOf()) {
    var data = db.value();
    debug('body: %s', JSON.stringify(data));
    resObj.data = data;
  } else {
    resObj.success = false;
    resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/ctrl_data/目录';
  }

  res.json(resObj);
}
