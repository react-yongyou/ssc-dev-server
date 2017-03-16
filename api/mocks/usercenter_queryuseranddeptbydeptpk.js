const debug = require('debug')('ssc:mocks');
const low = require('lowdb');
const utils = require('./utils');

module.exports = {
  post: post
};

function post(req, res) {
  const refCode = req.body.refCode;
  const refType = req.body.refType;
  const rootName = req.body.rootName;

  const doctype = refCode;

  const resObj = {
    __fake_server__: true,
    "success": true,
    "message": null,
  };

  switch(refCode) {
    // user 用户
    case 'user':
      resObj.data = [
        {
          "id": "E6CB6CBE-C701-48EC-A3EB-C823DF8DBEED",
          "isLeaf": "true",
          "name": "测试人员1",
          "pid": "FBA1DBB5-24A2-4A78-A4D5-453F7CC46AA6",
          "code": "02"
        },
        {
          "id": "FBA1DBB5-24A2-4A78-A4D5-453F7CC46AA6",
          "isLeaf": "false",
          "name": "测试人员2",
          "pid": "",
          "code": "03"
        }
      ];
      break;
  }

  res.json(resObj);
}
