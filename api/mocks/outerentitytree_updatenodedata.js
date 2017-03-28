const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');
const sleep = require('system-sleep');

// 模仿网络和IO延迟
const ENABLE_FAKE_IO_DELAY = true;

module.exports = {
  post: post
};

function post(req, res) {
  const TABLE_NAME = 'outerentitytree';

  // 模仿网络延迟以及IO延迟
  if (ENABLE_FAKE_IO_DELAY) {
    sleep(1000);
  }

  debug(`Open database file: t_${TABLE_NAME}.json`);
  const db = low(`${__dirname}/db_data/t_${TABLE_NAME}.json`);
  const data = req.body;

  const resObj = {
    __fake_server__: true,
    success: true
  };

  db.get('body')
    .find({id: data.id})
    .assign(data)
    .write();
  resObj.data = data;

  resObj.message = `保存成功：res.data.id = ${data.id}`;

  res.json(resObj);
}
