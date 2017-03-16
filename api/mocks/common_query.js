const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {
  // 这里使用通用处理的controller，需要从swaggerObj中获取到path
  // path中含有对应的档案类型
  // 比如`/dept/query`
  const doctype = utils.getDocTypeFromQueryPath(
    req.swagger.operation.pathObject.path);

  const condition = req.body.condition || '';
  const begin = req.body.begin;
  const itemsPerPage = req.body.groupnum; // 每页显示数量

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null,
  };

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_${doctype}.json`);
  const db = low(`${__dirname}/db_data/t_${doctype}.json`);

  // 为啥isEmpty返回的是Boolean对象?
  if (!db.isEmpty().valueOf()) {
    var body = db.get('body').value();
    debug('body: %s', JSON.stringify(body));
    // 对整个表数据进行分页，获取单页数据
    // TODO 由于数据库结构和后端定义的response结构不同，这里处理transform
    resObj.data = body.slice(begin, begin + itemsPerPage);
    resObj.begin = begin;
    resObj.num = itemsPerPage;
    resObj.totalnum = body.length; // 表的总行数
  } else {
    resObj.success = false;
    resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/db_data/目录';
  }

  res.json(resObj);
}
