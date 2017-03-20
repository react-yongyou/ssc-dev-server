# ssc-dev-server

nc-dev-server是一个基于Express.js，为Web前端开发提供轻量化开发环境的Web服务器。
让Web前端开发人员不再需要连接后端服务器，或者等待后端服务修复bug。

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
