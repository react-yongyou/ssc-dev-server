const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {
  // var sleep = require('sleep');
  // sleep.sleep(1);

  const condition = req.body.condition || '';
  const begin = req.body.begin;
  const itemsPerPage = req.body.groupnum || 15; // 每页显示数量，默认15个

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null,
  };

  debug(`Open database file: entity.json`);
  const db = low(`${__dirname}/ctrl_data/entity.json`);

  // 为啥isEmpty返回的是Boolean对象?
  if (!db.isEmpty().valueOf()) {
    var data = db.value();
    debug('data: %s', JSON.stringify(data));
    // 对整个表数据进行分页，获取单页数据
    // TODO 由于数据库结构和后端定义的response结构不同，这里处理transform
    resObj.data = data.slice(begin, begin + itemsPerPage);
    resObj.begin = begin;
    resObj.num = itemsPerPage;
    resObj.totalnum = data.length; // 表的总行数
  } else {
    resObj.success = false;
    resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/db_data/目录';
  }

  res.json(resObj);
}
