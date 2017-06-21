# ssc-dev-server

ssc-dev-server是一个基于Express.js，为Web前端开发提供轻量化开发环境的Web服务器。
让Web前端开发人员不再需要连接后端服务器，或者等待后端服务修复bug。

## 特性

- 基础（基本）档案
  - 支持查询（query），添加（save），保存（save），以及删除（delete）
  - 支持一键初始化/重置数据库
- 参照查询
- 会计平台
- 支持通过Swagger spec来定义API，并生成API文档（swagger-ui）
- 支持模拟高网络延迟/高IO延迟，方便前端做异常处理
- 支持请求结果中包含错误信息，方便前端做异常处理

## 如何使用

先下载并安装

```
git clone https://github.com/yyssc/ssc-dev-server.git
cd ssc-dev-server
npm install
```

启动服务器

```
npm start
DEBUG=swagger*,ssc* npm start # 显示调试信息
```

## Production server

- Start web server `pm2 start devBackendServer.js`
- Stop web server `pm2 stop devBackendServer`
- Start web server with JSON `pm2 start app.json`

## 在线服务（内网）

http://api.yyssc.org

```
curl -X POST -d doctype=dept http://api.yyssc.org/ficloud/ficloud_pub/initgrid
```

## Mock API with swagger

### echo.yaml

测试用

### swagger.yaml

Edit API with [Swagger Editor](http://editor.swagger.io/), and export to `src/swagger/swagger.yaml`

Test API with cURL

```
curl -X POST -H "Content-Type: application/json" -d '{
  "pk_doctype": "string1",
  "condition": "string",
  "paras": [],
  "fields": [],
  "begin": 0,
  "max": 10
}' "http://localhost:3008/plat/basedoc/qrybd"
```

View generated API docs with Swagger UI: https://xxd3vin.github.io/swagger-ui/?url=https://raw.githubusercontent.com/yyssc/ssc30-admin/master/src/swagger/swagger.yaml

### 基础档案 basedoc.yaml

Edit API with [Swagger Editor](http://editor.swagger.io/), and export to `src/swagger/basedoc.yaml`

Test API with cURL

```
curl -X GET "http://localhost:3008/plat/basedoc/qrybd?id=1"
```

View generated API docs with Swagger UI: https://xxd3vin.github.io/swagger-ui/?url=https://raw.githubusercontent.com/yyssc/ssc30-admin/master/src/swagger/swagger.yaml

## 接口列表

- 友报账
  - 基础档案 `basedoc.yaml`
- 友账表
  - 基础档案 `yzb_basedoc.yaml`
    - 转换规则定义
  - 实体映射 `outerEntityTree.yaml`

## 调试

```
vim ./node_modules/swagger-node-runner/fittings/swagger_router.js
```

```js
        try {
          var ctrlObj = require(controllerPath)
          controller = dependencies && typeof ctrlObj === 'function' ? ctrlObj(dependencies) : ctrlObj
          controllerFunctionsCache[controllerName] = controller;
          debug('controller found', controllerPath);
          break;
        } catch (err) {
          debug('xxdebug', err); // 添加这行，运行之后如果controller报错了，可以在terminal中看到
          if (!mockMode && i === controllersDirs.length - 1) {
            return cb(err);
          }
          debug('controller not in', controllerPath);
        }
```

https://github.com/theganyo/swagger-node-runner

## 添加新的controller dir

```
vim swagger/default.yaml
```

往`mockControllersDirs`字段添加新的目录

```yaml
    _router:
      mockControllersDirs: [ api/mocks, api/mocks/ybb ]
```