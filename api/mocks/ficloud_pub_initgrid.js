const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');
const DB_TABLE = require('./db').db();
const sleep = require('sleep'); // 在windows下可能会报错
// const sleep = require('system-sleep'); // 据说可以支持windows

// 模仿网络和IO延迟
const ENABLE_FAKE_IO_DELAY = 0;

module.exports = {
  post: post
};

function post(req, res) {

  // 模仿网络延迟以及IO延迟
  if (ENABLE_FAKE_IO_DELAY) {
    sleep.sleep(1);
  }

  const doctype = req.body.doctype || 'dept';

  const resObj = {
    __fake_server__: true,
    success: true,
    message: null,
  };

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_${doctype}.json`);
  const db = low(`${__dirname}/db_data/t_${doctype}.json`);

  if (db.isEmpty().valueOf()) {
    resObj.success = false;
    resObj.message = `档案类型${doctype}对应的表文件t_${doctype}.json不存在，或者文件为空`;
  } else {
    resObj.data = db.value().head;
  }

  res.json(resObj);
}
