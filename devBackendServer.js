/* eslint-disable no-console, no-process-exit */

const path = require('path');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const SwaggerExpress = require('swagger-express-mw');

const app = express();
app.use(compression());
// 反向代理中间件需要在body-parser之前处理请求，否则会导致请求hang up
// 需求修改了，请求需要跨域，所以取消反向代理
// app.use(require('./server/routes/aliyun')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// var upload = multer(); // for parsing multipart/form-data

app.use('/', express.static(path.join(__dirname + '/client')));
app.use('/swagger/basedoc.yaml',
  express.static(path.join(__dirname, 'swagger', 'basedoc.yaml')));

app.use(require('./server/routes/fakeApiArch')());
app.use(require('./server/routes/fakeApiRole')());
app.use(require('./server/routes/fakeApiPermission')());
app.use(require('./server/routes/fakeApiArchSetting')());
app.use(require('./server/routes/fakeApiNCSync')());

// Create a mock API with swagger

// 基础档案
const swaggerConfig = {
  // Runner props
  // swagger: 'swagger/swagger.yaml', // 全部API
  swagger: 'swagger/basedoc.yaml', // 仅有基础档案API
  // config props
  appRoot: __dirname,  // required config
  configDir: 'swagger', // TODO: should move to api/swagger
  mockControllersDirs: 'api/mocks' // TODO: config not work for swagger-node-runner
};

// 参照
const referSwaggerConfig = {
  swagger: 'swagger/refer.yaml',
  appRoot: __dirname,
  configDir: 'swagger',
  mockControllersDirs: 'api/mocks'
};

// 模板映射
const mappingTemplateSwaggerConfig = {
  swagger: 'swagger/mappingTemplate.yaml',
  appRoot: __dirname,
  configDir: 'swagger',
  mockControllersDirs: 'api/mocks'
};

// 外部数据建模
const outerEntityTreeSwaggerConfig = {
  swagger: 'swagger/outerEntityTree.yaml',
  appRoot: __dirname,
  configDir: 'swagger',
  mockControllersDirs: 'api/mocks'
};

SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

SwaggerExpress.create(referSwaggerConfig, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

SwaggerExpress.create(mappingTemplateSwaggerConfig, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

SwaggerExpress.create(outerEntityTreeSwaggerConfig, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

var swaggerConfigs = [
  {
    swagger: 'swagger/echo.yaml',
    appRoot: __dirname,
    configDir: 'swagger',
    mockControllersDirs: 'api/mocks'
  },
  {
    swagger: 'swagger/entity.yaml',
    appRoot: __dirname,
    configDir: 'swagger',
    mockControllersDirs: 'api/mocks'
  },
  {
    swagger: 'swagger/template.yaml',
    appRoot: __dirname,
    configDir: 'swagger',
    mockControllersDirs: 'api/mocks'
  },
  {
    swagger: 'swagger/yzb_basedoc.yaml',
    appRoot: __dirname,
    configDir: 'swagger',
    mockControllersDirs: 'api/mocks'
  },
  {
    swagger: 'swagger/echart.yaml',
    appRoot: __dirname,
    configDir: 'swagger',
    mockControllersDirs: 'api/mocks'
  }
];

swaggerConfigs.forEach(config => {
  SwaggerExpress.create(config, (err, swaggerExpress) => {
    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);
  });
});

const port = process.env.PORT || 3009;
const ip = process.env.IP || '127.0.0.1';

app.listen(port, ip, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Development backend server is listening at http://%s:%s', ip, port);
});
