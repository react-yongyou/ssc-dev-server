const util = require('util');
const utils = require('./utils');

module.exports = {
  post: post
};

const tpl = {};

tpl.dept = function (basedoc) {
  basedoc.data.head = [
    utils.string('部门编码'),
    utils.string('部门名称'),
    utils.ref('所属上级'),
    utils.ref('部门主管'),
    utils.boolean('企业'),
    utils.string('备注')
  ];
  basedoc.data.body = [
    {'id': 3, 'cols': [
      {'value': `263X2016111400000081`},
      {'value': '部门1'},
      {'value': '上级1'},
      {'value': '主管1'},
      {'value': true},
      {value: '备注1'}
    ]},
    {'id': 1, 'cols': [
      {'value': 'D32016091200000022'},
      {'value': '部门2'},
      {'value': '上级2'},
      {'value': '主管2'},
      {'value': false},
      {value: '备注2'}
    ]},
    {'id': 2, 'cols': [
      {'value': '263X2016083000000025'},
      {'value': '部门3'},
      {'value': '上级3'},
      {'value': '主管3'},
      {'value': true},
      {value: '备注3'}
    ]}
  ];
};

tpl.renyuan = function (basedoc) {
  basedoc.fields = [
    utils.string('员工编码'),
    utils.string('员工姓名'),
    utils.enum('性别'),
    utils.string('移动电话'),
    utils.string('电子邮件'),
    utils.ref('所属部门'),
    utils.enum('职位状态'),
    utils.ref('角色'),
    utils.string('备注'),
    utils.ref('银行帐户'),
    utils.string('所属银行'),
    utils.string('开户行'),
    utils.string('银行账户'),
    utils.string('账户名称'),
    utils.boolean('默认账户'),
    utils.enum('有效')
  ];
  basedoc.body = [
    utils.row(1, ['zhangsanf', '张三', 'male']),
    utils.row(2, ['lisif', '李四', 'female']),
  ];
};

tpl.xiangmu = function (basedoc) {
  basedoc.fields = [
    utils.string('项目类别编码'),
    utils.string('项目类别名称')
  ];
  basedoc.body = [
    utils.row(1, ['263X2016083000000025', '项目类别A']),
    utils.row(2, ['263X2016083000000030', '项目类别B'])
  ];
};

tpl.feiyongxiangmu = function (basedoc) {
  basedoc.fields = [
    utils.string('费用项目类别编码'),
    utils.string('费用项目类别名称')
  ];
  basedoc.body = [
    utils.row(1, ['D32016091200000022', '费用项目类别A']),
    utils.row(2, ['D32016091200000033', '费用项目类别B'])
  ];
};

function post(req, res) {
  const doctype = req.body.doctype;
  const basedoc = {
    "success": true,
    "message": null,
    "data": {
      "head": [],
      "body": []
    }
  };
  if (tpl[doctype]) {
    tpl[doctype](basedoc);
  } else {
    basedoc.success = false;
    basedoc.message = '未知的基础档案类型';
  }
  res.json(basedoc);
}

/*
    "fields": [
      {
        "key": "string",
        "lable": "字符",
        "datatype": 0,
        "length": 40
      },
      {
        "key": "integer",
        "lable": "整型",
        "datatype": 1
      },
      {
        "key": "double",
        "lable": "数字",
        "datatype": 2,
        "length": 28,
        "digit": 8
      },
      {
        "key": "date",
        "lable": "日期",
        "datatype": 3
      },
      {
        "key": "datetime",
        "lable": "时间",
        "datatype": 8
      },
      {
        "key": "boolean",
        "lable": "布尔",
        "datatype": 4
      },
      {
        "key": "enum",
        "lable": "枚举",
        "datatype": 6,
        "data": [
          {
            "key": "male",
            "value": "男"
          },
          {
            "key": "female",
            "value": "女"
          }
        ]
      },
      {
        "key": "ref",
        "lable": "参照",
        "datatype": 5,
        "refinfo": "G001ZM0000BASEDOC0000DEPT000000000000000"
      },
      {
        "key": "text",
        "lable": "文本域",
        "datatype": 9,
        "length": 4000
      }
    ],
*/
