/*eslint strict: ["error", "global"]*/

"use strict";

const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const sleep = require('system-sleep');

const utils = require('../utils');
const config = require('../config');

/**
 * 后端返回的类型不正确，比如应该把`"true"`改成`true`
 * @param {Object} condition
 * ```json
 * [
 *   {
 *     "field": "enable",
 *     "datatype": "boolean",
 *     "value": "true"
 *   }
 * ]
 * ```
 */
function fixConditions(condition) {
  if (condition.datatype === 'boolean') {
    condition.value = condition.value === 'true';
  }
  return condition;
}

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

    const resObj = {
      __fake_server__: true,
    };

    switch(ERROR_TYPE) {
      case 0:
        console.log('[common_query] in');

        // 这里使用通用处理的controller，需要从swaggerObj中获取到path
        // path中含有对应的档案类型
        // 比如`/dept/query`
        const doctype = utils.getDocTypeFromQueryPath(
          req.swagger.operation.pathObject.path);

        const conditions = req.body.conditions.map(fixConditions);
        const begin = req.body.begin;
        const itemsPerPage = req.body.groupnum; // 每页显示数量

        // 根据基础档案类型，获取数据库中对应表的所有数据
        debug(`Open database file: t_${doctype}.json`);
        const db = low(`${dbDir}/t_${doctype}.json`);

        // 为啥isEmpty返回的是Boolean对象?
        if (!db.isEmpty().valueOf()) {
          let matches = {};
          conditions.forEach(condition => {
            matches[condition.field] = condition.value;
          });
          let body = db.get('body')
            .filter(matches)
            .value();
          // debug('body: %s', JSON.stringify(body));

          // 对整个表数据进行分页，获取单页数据
          // TODO 由于数据库结构和后端定义的response结构不同，这里处理transform
          resObj.data = body.slice(begin, begin + itemsPerPage);
          resObj.begin = begin;
          resObj.num = itemsPerPage;
          resObj.totalnum = body.length; // 表的总行数
          resObj.success = true;
          resObj.message = null;
        } else {
          resObj.success = false;
          resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/db_data/目录';
        }

        break;
      case 1:
        resObj.success = false;
        resObj.message = '查询失败。null（ssc-dev-server模拟失败）';
        resObj.data = null;
        resObj.code = 0;
        break;
    }

    res.json(resObj);
  }

};
