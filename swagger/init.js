/* eslint-disable no-console, no-process-exit */

// 批量生成所有接口文档
// 使用方法： node init.js
// 然后将输出到命令行的yaml字符串复制到basedoc.yaml中

const getBaseDocTypes = require('../../src/constants/BaseDocTypes');

// id: dept
// name: 部门
function tpl(id, name) {
  // query
  let queryController = 'common_query';
  let queryRequestModel = 'CommonQueryReqModel';
  let queryResponseModel = 'CommonSuccessModel';

  // delete
  let deleteController = 'common_delete';
  let deleteRequestModel = 'CommonDeleteReqModel';
  let deleteResponseModel = 'CommonDeleteSuccessModel';

  // save
  let saveController = 'common_save';
  let saveRequestModel = 'CommonSaveReqModel';
  let saveResponseModel = 'CommonSaveSuccessModel';

  if (id === 'dept') {
    // query
    queryController = 'dept_query';
    queryRequestModel = 'DeptQueryReqModel';
    queryResponseModel = 'SuccessModel';

    // delete
    deleteController = 'dept_delete';
    deleteRequestModel = 'DeptDeleteReqModel';
    deleteResponseModel = 'CommonDeleteSuccessModel';

    // save
    saveController = 'dept_save';
    saveRequestModel = 'DeptSaveReqModel';
    saveResponseModel = 'DeptSaveSuccessModel';
  }

  return `
  /${id}/query:
    x-swagger-router-controller: ${queryController}
    post:
      description: ${name}查询接口
      tags:
        - ${name}
      consumes:
      - application/json
      produces:
      - application/json
      parameters:
        - required: true
          name: body
          in: body
          description: 查询条件
          schema:
            $ref: '#/definitions/${queryRequestModel}'
      responses:
        '200':
          description: Success
          schema:
            $ref: '#/definitions/${queryResponseModel}'
        '404':
          description: Not Found
  /${id}/delete:
    x-swagger-router-controller: ${deleteController}
    post:
      description: ${name}删除接口
      tags:
        - ${name}
      consumes:
      - application/json
      produces:
      - application/json
      parameters:
        - required: true
          name: body
          in: body
          description: ${name}主键
          schema:
            $ref: '#/definitions/${deleteRequestModel}'
      responses:
        '200':
          description: Success
          schema:
            $ref: '#/definitions/${deleteResponseModel}'
        '404':
          description: Not Found
  /${id}/save:
    x-swagger-router-controller: ${saveController}
    post:
      description: ${name}修改接口
      tags:
        - ${name}
      consumes:
      - application/json
      produces:
      - application/json
      parameters:
        - required: true
          name: body
          in: body
          description: ${name}新数据
          schema:
            $ref: '#/definitions/${saveRequestModel}'
      responses:
        '200':
          description: Success
          schema:
            $ref: '#/definitions/${saveResponseModel}'
        '404':
          description: Not Found`;
}

getBaseDocTypes().forEach(
  o => console.log(tpl(o.id, o.name))
);
