"use strict";

module.exports = {
  getDocTypeFromQueryPath: getDocTypeFromQueryPath,
  getDocTypeFromSavePath: getDocTypeFromSavePath,
  getDocTypeFromDeletePath: getDocTypeFromDeletePath,
  row: row,
  pagination: pagination,
  makeid: makeid,
  string: $string,
  boolean: $boolean,
  ref: $ref,
  enum: $enum
};

function runRegex(path, regex) {
  var m;
  if ((m = regex.exec(path)) !== null) {
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      //console.log(`Found match, group ${groupIndex}: ${match}`);
    });
    return m[1];
  }
}

// input `/dept/query` output `dept`
function getDocTypeFromQueryPath(path) {
  return runRegex(path, /\/(.*)\/query/);
}

function getDocTypeFromSavePath(path) {
  return runRegex(path, /\/(.*)\/save/);
}

function getDocTypeFromDeletePath(path) {
  return runRegex(path, /\/(.*)\/delete/);
}

function row(id, cols) {
  return {
    id: id,
    cols: cols.map(col => ({value: col}))
  };
}

/**
 * 输入整个数据库表中的所有数据，然后做分页
 * @param db_table 需要进行分页的数据。例子：
 * ```json
 * {
 *   body: [
 *     {id: 'u11', name: 'A11', email: 'a1@test.com'},
 *     {id: 'u22', name: 'A22', email: 'a1@test.com'}
 *   ]
 * }
 * ```
 * @param begin 分页其实的index
 * @param itemPerPage 每页显示的数量
 *
 *
 *
 */
function pagination(fullArr, begin, itemPerPage) {
  return fullArr.slice(begin, begin + itemPerPage);
}

function makeid(length) {
  length = length || 5;
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 字符
function $string(id, name, size) {
  size = size || 40;
  return {
    "id": id,
    "lable": name,
    "datatype": 0,
    "length": size
  };
}

// 布尔
function $boolean(id, name) {
  return {
    "id": id,
    "lable": name,
    "datatype": 4
  };
}

// 参照
function $ref(id, name) {
  return {
    "id": id,
    "lable": name,
    "datatype": 5,
    refinfo: "G001ZM0000BASEDOC0000DEPT000000000000000"
  };
}

// 枚举
function $enum(id, name) {
  return {
    "id": id,
    "lable": name,
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
  };
}
