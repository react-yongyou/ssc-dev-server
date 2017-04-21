const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const sleep = require('system-sleep');

const utils = require('./utils');
const config = require('./config');

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 1;

function post(req, res) {
  const TABLE_NAME = 'outerentitytree';

  // 模仿网络延迟以及IO延迟
  sleep(config.IO_DELAY);

  const resObj = {
    __fake_server__: true
  };

  switch(ERROR_TYPE) {
    default:
    case 0:
      debug(`Open database file: t_${TABLE_NAME}.json`);
      const db = low(`${__dirname}/db_data/t_${TABLE_NAME}.json`);
      const data = req.body;

      db.get('body')
        .find({id: data.id})
        .assign(data)
        .write();
      resObj.data = data;

      resObj.success = true;
      resObj.message = `保存成功：res.data.id = ${data.id}`;
      resObj.code = 1;

      res.json(resObj);
      break;
    case 1:
      resObj.success = false;
      resObj.message = '保存失败。null';
      resObj.data = null;
      resObj.code = 0;
      res.json(resObj);
      break;
  }
}

module.exports = {
  post: post
};