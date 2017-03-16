# ssc-dev-server

SSC 3.0 后台管理 本地调试用伪造服务器

## Prepare

```
npm install
```

## 启动服务器

```
npm start
```

## Mock API with swagger

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

### basedoc.yaml

Edit API with [Swagger Editor](http://editor.swagger.io/), and export to `src/swagger/basedoc.yaml`

Test API with cURL

```
curl -X GET "http://localhost:3008/plat/basedoc/qrybd?id=1"
```

View generated API docs with Swagger UI: https://xxd3vin.github.io/swagger-ui/?url=https://raw.githubusercontent.com/yyssc/ssc30-admin/master/src/swagger/swagger.yaml
