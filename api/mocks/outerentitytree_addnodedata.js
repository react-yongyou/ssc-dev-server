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

  try {
    const newData = Object.assign({id: utils.makeid(40)}, data);
    db.get('body')
      .push(newData)
      .write();

    resObj.data = newData;
    resObj.message = `创建成功，新数据的主键：${newData.id}`;

  } catch (e) {
    if (e.name === 'DuplicatedCodeError') {
      resObj.code = 0;
      resObj.success = false;
      resObj.message = e.message;
      resObj.data = null;
    } else {
      resObj.success = false;
      resObj.message = '未知错误';
    }
  } finally {
  }

  res.json(resObj);
}
