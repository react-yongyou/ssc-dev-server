const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {
  // 这里使用通用处理的controller，需要从swaggerObj中获取到path
  // path中含有对应的档案类型
  // 比如`/dept/save`
  const doctype = utils.getDocTypeFromSavePath(
    req.swagger.operation.pathObject.path);

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_${doctype}.json`);
  const db = low(`${__dirname}/db_data/t_${doctype}.json`);
  const data = req.body;

  const resObj = {
    __fake_server__: true,
    success: true
  };

  if (data.id) {
    db.get('body')
      .find({id: data.id})
      .assign(data)
      .write();
    resObj.data = data;

    resObj.message = `保存成功：res.data.id = ${data.id}`;
  } else {
    const newData = Object.assign({id: utils.makeid(40)}, data);
    db.get('body')
      .push(newData)
      .write();
    resObj.data = newData;

    resObj.message = `创建成功，新数据的主键：${newData.id}`;
  }

  res.json(resObj);
}
