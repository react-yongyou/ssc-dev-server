var util = require('util');

module.exports = {
  get: get
};

function get(req, res) {
  const basedocs = [
    {
      "name": "部门",
      "id": "bumen"
    },
    {
      "name": "人员",
      "id": "renyuan"
    },
    {
      "name": "项目",
      "id": "xiangmu"
    },
    {
      "name": "费用项目",
      "id": "feiyongxiangmu"
    }
  ];
  res.json(basedocs);
}
