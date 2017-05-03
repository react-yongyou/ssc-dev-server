const debug = require('debug')('ssc:mocks');
const low = require('lowdb');

exports.commonController = function(req, res, config) {
  var ctrlData = config.data;
  var error = config.error;
  
  const resObj = {
    __fake_server__: true
  };

  switch(error) {
    default:
    case 0:
      debug(`Open controller data file: ${ctrlData}`);
      const db = low(`${__dirname}/ctrl_data/${ctrlData}`);
      // 为啥isEmpty返回的是Boolean对象?
      if (!db.isEmpty().valueOf()) {
        // const meta = db.get('__meta__').value(); // 获取meta信息
        var data = db.get('data').value();
        debug('data: %s', JSON.stringify(data));
        resObj.data = data;
        resObj.success = true;
        resObj.code = 1;
        resObj.message = '';
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
};