# 数据库数据目录

`t_dept.json` 对应SQL中一个表，其中`t_dept.head`相当于字段定义，`t_dept.body`
相当于表中的数据

`t_dept_init.json`包含了初始一个表的默认数据，默认数据除了包含字段定义，也包含
了一部分表数据，也就是初始化之后，不用创建新数据就能在页面看到一些默认数据。

通过`npm run db:reset -- all`来初始化所有表

通过`npm run db:reset -- dept`来初始化指定的`dept`表。

我们假定`dept`这个表名既是json文件名，也是
[http://git.yonyou.com/sscplatform/fc_doc/blob/master/basedoc]中的markdown文件
名。

## 文件说明

t_doctype.json - 档案类型查询接口`/ficloud/ficloud_pub/querydoctype`接口返回的全部数据，尚不清楚服务器端对应的数据库结构
