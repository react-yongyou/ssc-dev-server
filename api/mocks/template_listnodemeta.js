const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {
  const itemTypes = req.body.itemTypes;
  const billTypePk = req.body.billTypePk;

  const resObj = {
    __fake_server__: true,
    code: '0',
    information: '成功',
  };

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_nodemeta.json`);
  const db = low(`${__dirname}/db_data/t_nodemeta.json`);

  // 为啥isEmpty返回的是Boolean对象?
  if (!db.isEmpty().valueOf()) {
    var db_table = db.value();
    debug('db_table: %s', JSON.stringify(db_table));
    resObj.others = db_table.others;
    resObj.heads = db_table.heads;
    resObj.bodys = db_table.bodys;
  } else {
    resObj.code = '1';
    resObj.information = '对应该类型的数据表JSON文件不存在，请检查api/mocks/db_data/目录';
  }

  res.json(resObj);
}
