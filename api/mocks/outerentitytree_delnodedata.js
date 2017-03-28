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
  const id = req.body.id;

  db.get('body')
    .remove({id: id})
    .write();

  const basedoc = {
    __fake_server__: true,
    "success": true,
    "message": `${id} 删除成功`
  };

  res.json(basedoc);
}
