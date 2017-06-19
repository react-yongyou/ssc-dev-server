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

function post(req, res) {
  console.log(req.files);
  // 模仿网络延迟以及IO延迟
  sleep(config.IO_DELAY);

//  // 这里使用通用处理的controller，需要从swaggerObj中获取到path
//  // path中含有对应的档案类型
//  // 比如`/dept/save`
//  const doctype = utils.getDocTypeFromSavePath(
//    req.swagger.operation.pathObject.path);
  const doctype = 'rptmod';

  // 根据基础档案类型，获取数据库中对应表的所有数据
  debug(`Open database file: t_${doctype}.json`);
  const db = low(`${__dirname}/db_data/t_${doctype}.json`);
  const reqObj = req.body;

  const resObj = {
    __fake_server__: true,
  };

  switch(ERROR_TYPE) {
    default:
    case 0:
      // 查找指定项目，并更新modfiles属性
      const foundObj = db.get('body')
        .find({id: reqObj.modid})
        .value();
      console.log(foundObj);

      const newModfiles = foundObj.modfiles.map(file => {
        return {
          // ...file
          filename: file.filename,
          isparent: file.isparent,
          fs_filename: getFSFilename(file.filename),
        }
      });

      /**
       * 从req.files中按照原始文件名称查出保存文件系统中的文件名称
       */
      function getFSFilename(filename) {
        return req.files.find(file => file.originalname === filename).filename;
      }

      db.get('body')
        .find({id: reqObj.modid})
        .assign({
          modfiles: newModfiles,
        })
        .write();

      // upload files
      resObj.data = foundObj;
      resObj.success = true;
      resObj.message = `保存成功：res.data.id = ${reqObj.modid}，上传${req.files.length}个文件成功`;
      res.header('Access-Control-Allow-Origin', '*');
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

module.exports = {
  post: post
};
