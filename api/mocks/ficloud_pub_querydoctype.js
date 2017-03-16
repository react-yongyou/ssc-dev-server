const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {
  const condition = req.body.condition;

  // TODO 应该使用SQL parser来处理
  const entityids = condition
    .replace(/\'/g, '')
    .replace('entityid in (', '')
    .replace(')', '')
    .split(',');

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null,
  };

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_doctype.json`);
  const db = low(`${__dirname}/db_data/t_doctype.json`);

  // 为啥isEmpty返回的是Boolean对象?
  if (!db.isEmpty().valueOf()) {
    const data = db.value();

    var filterDocTypes = data.filter(doctype => entityids.indexOf(doctype.entityid) !== -1);

    debug('body: %s', JSON.stringify(data));
    // 对整个表数据进行分页，获取单页数据
    // TODO 由于数据库结构和后端定义的response结构不同，这里处理transform
    resObj.data = filterDocTypes;
  } else {
    resObj.success = false;
    resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/db_data/目录';
  }

  res.json(resObj);
}
