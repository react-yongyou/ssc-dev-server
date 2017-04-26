const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const sleep = require('system-sleep');

const utils = require('./utils');
const config = require('./config');

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

function post(req, res) {
  // 模仿网络延迟以及IO延迟
  sleep(config.IO_DELAY);

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
  };

  switch(ERROR_TYPE) {
    default:
    case 0:
      db.get('body')
        .find({id: data.id})
        .assign({enable: data.enable})
        .write();
      resObj.data = data;

      resObj.success = true;
      resObj.message = `启用/禁用成功：res.data.id = ${data.id}`;

      res.json(resObj);
      break;
    case 1:
      resObj.success = false;
      resObj.message = '启用/禁用失败。null（ssc-dev-server模拟失败）';
      resObj.data = null;
      resObj.code = 0;
      res.json(resObj);
      break;
  }
}

module.exports = {
  post: post
};