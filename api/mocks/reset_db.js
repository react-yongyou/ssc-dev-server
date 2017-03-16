const low = require('lowdb');

const utils = require('./utils');
const getBaseDocTypes = require('../../src/constants/BaseDocTypes');

// 获取npm参数
// npm run db:reset -- dept
// npm run db:reset -- all
tableName = process.argv[2];

// 重置数据库表
const resetTable = tableName => {console.log(tableName)
  // 从t_dept_init.json读出默认数据，写入t_dept.json中
  var db = low(`${__dirname}/db_data/t_${tableName}_init.json`);
  db.write(`${__dirname}/db_data/t_${tableName}.json`);
};

if (!tableName) {
  console.log('[ERROR] 需要指定一个表名，或者指定all来重置所有表！');
} else if (tableName === 'all') {
  console.log('初始化所有表！');
  getBaseDocTypes().forEach(o => resetTable(o.id));
} else {
  console.log(`初始化${tableName}表！`);
  resetTable(tableName);
}
