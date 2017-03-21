const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');
const sleep = require('sleep');

// 模仿网络和IO延迟
const ENABLE_FAKE_IO_DELAY = true;

module.exports = {
  post: post
};

/**
 * 获取指定节点的所有child
 * @param {Array} treeData 树
 * @param {String} key 节点key
 */
function getChildOfNode(treeData, key) {
  var children = [];
  const loop = (nodes) => {
    nodes.forEach(node => {
      if (node.key === key) {
        children = node.children;
      }
      if (node.children) {
        loop(node.children);
      }
    });
  };
  const setLeaf = (nodes) => {
    nodes.forEach(node => {
      if (node.children) {
        delete node.children;
      } else {
        node.isLeaf = true;
      }
    })
  };
  loop(treeData);
  setLeaf(children);
  return children;
}

/**
 * 从节点树上获取指定key的节点的所有child
 */

function post(req, res) {

  // 模仿网络延迟以及IO延迟
  if (ENABLE_FAKE_IO_DELAY) {
    sleep.sleep(1);
  }

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null
  };

  try {

    if (req.body.key) {
      const key = req.body.key;
    } else {
      throw {
        name: 'MISSING_KEY',
        message: '请求参数中缺少key'
      };
    }

    debug(`Open database file: template_tree.json`);
    const db = low(`${__dirname}/ctrl_data/template_tree.json`);

    // 为啥isEmpty返回的是Boolean对象?
    if (!db.isEmpty().valueOf()) {
      var data = db.value();
      debug('body: %s', JSON.stringify(data));
      resObj.data = getChildOfNode(data, key);
    } else {
      throw {
        name: 'JSON_DB_NOT_FOUND',
        message: '对应该类型的数据表JSON文件不存在，请检查api/mocks/ctrl_data/目录'
      };
    }

  } catch (e) {
    var msg = e.message;
    switch (e.name) {
      case 'MISSING_KEY':
        break;
      case 'JSON_DB_NOT_FOUND':
        break;
      default:
        msg = `未知错误：${msg}`;
        break;
    }
    resObj.success = false;
    resObj.message = msg;
  }

  res.json(resObj);
}
