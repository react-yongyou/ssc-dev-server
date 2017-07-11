const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const sleep = require('system-sleep');
const uuid = require('uuid');

const utils = require('../utils');
const config = require('../config');

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

const defaultDBDir = `${__dirname}/../db_data`;

module.exports = function(options) {
  let dbDir = defaultDBDir;
  if (options.dbDir) {
    dbDir = options.dbDir;
  }
  return function(req, res) {
    // 模仿网络延迟以及IO延迟
    sleep(config.IO_DELAY);

    // 这里使用通用处理的controller，需要从swaggerObj中获取到path
    // path中含有对应的档案类型
    // 比如`/dept/save`
    const doctype = utils.getDocTypeFromSavePath(
      req.swagger.operation.pathObject.path);

    // 根据基础档案类型，获取数据库中对应表的所有数据
    debug(`Open database file: t_${doctype}.json`);
    const db = low(`${dbDir}/t_${doctype}.json`);
    const data = req.body;

    const resObj = {
      __fake_server__: true,
    };

    switch(ERROR_TYPE) {
      default:
      case 0:
        // TODO 如果字段类型为ref那么保存方式是不同的，需要单独处理
        if (data.id) {
          // 进行保存操作
          db.get('body')
            .find({id: data.id})
            .assign(data)
            .write();
          resObj.data = data;
          resObj.success = true;
          resObj.message = `保存成功：res.data.id = ${data.id}`;
        } else {
          // 进行创建操作
          try {
            // 所有基础档案类型的"编码"(code)不能重复
            if (db.get('body').find({code: data.code}).value() !== undefined) {
              throw {
                name: 'DuplicatedCodeError',
                message: '保存失败。档案编码重复,请重新输入!'
              }
            }

            const newData = Object.assign(data, {id: uuid().toUpperCase()});
            db.get('body')
              .push(newData)
              .write();

            resObj.success = true;
            resObj.data = newData;
            resObj.message = `基础档案创建成功，新数据的主键：${newData.id}`;

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
        break;
      case 1:
        resObj.success = false;
        resObj.message = '保存失败。null（ssc-dev-server模拟失败）';
        resObj.data = null;
        resObj.code = 0;
        res.json(resObj);
        break;
    }
  }
}
