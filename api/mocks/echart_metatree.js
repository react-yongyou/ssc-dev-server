const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const sleep = require('system-sleep');

const utils = require('./utils');
const config = require('./config');

/**
 * - 0 正常
 * - 1 查询失败
 */
const ERROR_TYPE = 0;

function get(req, res) {

  // 模仿网络延迟以及IO延迟
  sleep(config.IO_DELAY);

  const eid = req.body.eid; // G001ZM0000BILLTYPE000000000000000006

  const resObj = {
    __fake_server__: true
  };

  switch(ERROR_TYPE) {
    default:
    case 0:
      let ctrlFilename = 'echart_metatree.json';
      debug(`Open controller data file: ${ctrlFilename}`);
      const db = low(`${__dirname}/ctrl_data/${ctrlFilename}`);
      if (!db.isEmpty().valueOf()) {
        // const meta = db.get('__meta__').value(); // 获取meta信息
        var data = db.get('data').value();
        debug('data: %s', JSON.stringify(data));
        resObj.success = true;
        resObj.message = null;
        resObj.data = data;
        resObj.code = 1;
        
      } else {
        resObj.success = false;
        resObj.message = '对应该类型的数据表JSON文件不存在，请检查api/mocks/ctrl_data/目录';
      }
      res.json(resObj);
      break;
    case 1:
      resObj.success = false;
      resObj.message = '查询失败。null';
      resObj.data = null;
      resObj.code = 0;
      res.json(resObj);
      break;
  }
}

module.exports = {
  get: get
};
