const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

/**
 * 参照API
 * 接口：http://api.yyssc.org/refbase_ctr/queryRefJSON
 * 参照Java后端API：http://git.yonyou.com/sscplatform/fc_doc/blob/master/refBase.md
 */

/*
Usage:
$ curl -X POST \
  http://172.20.4.220:8080/ficloud/refbase_ctr/queryRefJSON \
  -H 'content-type: application/json' \
  -d '{
  "refCode": "dept",
  "refType": "tree",
}'
*/

module.exports = {
  post: post
};

function post(req, res) {
  const refCode = req.body.refCode;
  const refType = req.body.refType; // 暂时无用
  const rootName = req.body.rootName; // 暂时无用

  const doctype = refCode; // 外键

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

    /**
     * 只需要从数据中截取如下内容，以bank为例
     * ```json
     * {
     *   "code": "101000",
     *   "name": "建行北京上地支行00",
     *   "pid": "DB142E51-2812-4E6E-86F2-C631E8E9FBA6",
     *   "id": "25B49D8D-F",
     *   "isLeaf": "false"
     * }
     * ```
     */
    var data = [];
    body.forEach(item => {
      data.push({
        code: item.code,
        name: item.name,
        pid: item.parentid ? item.parentid.id : '',
        id: item.id,
        isLeaf: "false" // 为啥后端返回字符串类型
      });
    });
    resObj.data = data;

  } else {
    resObj.success = false;
    resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/db_data/目录';
  }

  res.json(resObj);
}
