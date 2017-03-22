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

  const condition = req.body.condition || '';
  const begin = req.body.begin;
  const itemsPerPage = req.body.groupnum || 15; // 默认每页显示15个

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null,
  };

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: mappingdef.json`);
  const db = low(`${__dirname}/ctrl_data/mappingdef.json`);

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
