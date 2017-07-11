const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const sleep = require('system-sleep');
const fs = require('fs');

const utils = require('../utils');
const ybbUtils = require('./utils');
const config = require('../config');

// 模仿网络和IO延迟
const ENABLE_FAKE_IO_DELAY = true;

module.exports = {
  post: post
};

function post(req, res) {

  // 模仿网络延迟以及IO延迟
  sleep(config.IO_DELAY);

  // 这里使用通用处理的controller，需要从swaggerObj中获取到path
  // path中含有对应的档案类型
  // 比如`/dept/delete`
//  const doctype = utils.getDocTypeFromDeletePath(
//    req.swagger.operation.pathObject.path);
  const doctype = 'rptmod';

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_${doctype}.json`);
  const db = low(`${__dirname}/db_data/t_${doctype}.json`);
  const id = req.body.id;

  const foundObj = db.get('body')
    .find({id: id})
    .value();

  const filename = foundObj.modfiles[0].fs_filename;
  var file = `uploads/${filename}`;
  ybbUtils.checkFileExists(file)
    .then(isExist => {
      if (isExist) {
        res.setHeader('Content-disposition', 'attachment; filename=test.jpg');
        res.setHeader('Content-type', 'image/jpeg');
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      } else {
        res.json({
          success: false,
          message: 'file not found',
        });
      }
    })
}
