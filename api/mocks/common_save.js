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

  // TODO 如果字段类型为ref那么保存方式是不同的，需要单独处理

  if (data.id) {
    db.get('body')
      .find({id: data.id})
      .assign(data)
      .write();
    resObj.data = data;

    resObj.message = `保存成功：res.data.id = ${data.id}`;
  } else {

    try {
      // 有些字段需要唯一性
      if (doctype === 'dept') {
        // code 编码 不能重复
        if (db.get('body').find({code: data.code}).value() !== undefined) {
          throw {
            name: 'DuplicatedCodeError',
            message: '保存失败。档案编码重复,请重新输入!'
          }
        }
      }

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

  }

  res.json(resObj);
}
