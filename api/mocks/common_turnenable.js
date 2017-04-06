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
  // 模仿网络延迟以及IO延迟
  if (ENABLE_FAKE_IO_DELAY) {
    sleep(1000);
  }

  // 这里使用通用处理的controller，需要从swaggerObj中获取到path
  // path中含有对应的档案类型
  // 比如`/dept/save`
  const doctype = utils.getDocTypeFromTurnEnablePath(
    req.swagger.operation.pathObject.path);

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_${doctype}.json`);
  const db = low(`${__dirname}/db_data/t_${doctype}.json`);
  const data = req.body;

  const resObj = {
    __fake_server__: true,
    success: true
  };

  db.get('body')
    .find({id: data.id})
    .assign({enable: data.enable})
    .write();
  resObj.data = data;

  resObj.message = `保存成功：res.data.id = ${data.id}`;


  res.json(resObj);
}
