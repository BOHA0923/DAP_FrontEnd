#!/usr/bin/env node

const { classify } = require('@angular-devkit/core/src/utils/strings');
const {ts, SourceFile} = require('typescript');
const {tsquery} = require('@phenomnomnominal/tsquery');
const fs = require('fs');
const {Linter} = require('tslint');
const path = require('path');

function insertComponentToRoutingModule(_routingFile, _componentFile) {
  const routingFile = path.join(process.cwd(), _routingFile);

  const codeText = fs.readFileSync(routingFile, 'utf-8');

  const sourceFile = tsquery.ast(codeText);
  const routerVariableNode = _findRouteVariableNode(sourceFile);
  if (routerVariableNode) {
    // 路由的變數名稱如：routes
    const routesVariable = routerVariableNode.escapedText;

    // 找到路由變數Routes
    const routes = _findRoutesNode(sourceFile, routesVariable);
    if (routes.length === 0) return;

    // 取得最後一個路由配置Route
    const lastRoute = tsquery(routes[0], 'ObjectLiteralExpression:last-child');
    if (lastRoute.length === 0) return;

    // 取得最後一個路由Routes的縮排
    const {character} = sourceFile.getLineAndCharacterOfPosition(lastRoute[0].getStart());

    // 取得要插入的字串
    const fix = _getRouteConfig(character, _componentFile);

    // 插入route
    let result = _insertRoute(codeText, fix, lastRoute[0].getEnd());

    // 插入import
    result = _insertImports(result, sourceFile, _componentFile);

    // 回寫檔案
    fs.writeFileSync(_routingFile, result, 'utf-8');

    console.log('\x1b[32m%s\x1b[0m', `修改 ${_routingFile} 加入 ${_componentFile}路由`);
  }
}

function _getComponentName(file) {
  const mainFileName = path.basename(file).replace(path.extname(file), '').replace(/[\.]/g, '-', '-');
  if (mainFileName) {
    return classify(mainFileName);
  }
  return null;
}

function _getRoutePathName(file) {
  return path.basename(file).replace(path.extname(file), '').replace(/\.component/, '');
}

function _getNameWithoutExtName(file) {
  let _file = file;
  if (_file.startsWith('.') !== 0) {
    _file = './' + _file;
  }
  return _file.replace(path.extname(_file), '').replace(/\\/g, '/');
}

function _insertImports(codeText, sourceFile, _componentFile) {
  const componentName = _getComponentName(_componentFile);
  const importsNodes = tsquery(sourceFile, 'ImportDeclaration');
  if (importsNodes.length === 0) return;
  const importNode = importsNodes[importsNodes.length - 1];

  const insert = '\nimport { ' + componentName + ' } from \''+ _getNameWithoutExtName(_componentFile) +'\';\n';
  return _insertText(codeText, importNode.getEnd(), insert);
}

function _insertText(source, startPoint, text) {
  return source.substring(0, startPoint) + text + source.substring(startPoint);
}

function _insertRoute(codeText, text, startIndex) {
  return _insertText(codeText, startIndex, text);
}

function _findRouteVariableNode(sourceFile) {
  const importsNode = tsquery(sourceFile, 'PropertyAssignment:has(Identifier[name="imports"]):has(CallExpression:has(PropertyAccessExpression:has(Identifier[name="RouterModule"])):has(Identifier[name="forChild"]))');
  if (importsNode.length === 1) {
    const routerVariableNode = tsquery(importsNode[0], 'CallExpression:has(Identifier[name="RouterModule"]) > Identifier');
    if (routerVariableNode.length === 1) {
      return routerVariableNode[0];
    }
  }
  return null;
}

function _findRoutesNode(sourceFile, routesName) {
  return tsquery(sourceFile, 'VariableDeclaration:has(Identifier[name="' + routesName + '"]) > ArrayLiteralExpression');
}

function _getRouteConfig(character, _componentFile) {
  const componentName = _getComponentName(_componentFile);
  const path = _getRoutePathName(_componentFile);
  let text = ',\n{' +
    '\n  path: \''+ path +'\',' +
    '\n  component: ' + componentName +
    '\n}';
  return text.replace(/\n/g, `\n${' '.repeat(character)}`)+'\n';
}

function _findExportVariable(sourceFile) {
  const nodes = tsquery.query(sourceFile, 'VariableStatement:has(ExportKeyword):has(ArrayLiteralExpression)');
  if (nodes.length > 0) {
    const programViarable = nodes[0];
    return programViarable;
  }
  return null;
}

function _existAssignment(sourceFile, id) {
  return tsquery.query(sourceFile, `PropertyAssignment:has(StringLiteral[value='${id}'])`).length > 0;
}


function insertProgramOrMenuModel(name, modelPath, parentName, type) {
  const fullPath = path.join(process.cwd(), modelPath);
  const codeText = fs.readFileSync(fullPath, 'utf-8');
  const sourceFile = tsquery.ast(codeText);
  const variable = _findExportVariable(sourceFile);
  let template = '';
  switch (type) {
    case 'program':
      template = `{ 'id': '${name}', 'module': 'root', 'type': '', 'routerLink', '/${parentName}/${name}' }`;
      break;
    case 'menu':
      template = `{ 'id': '${name}', 'type': 'program', 'iconClass': 'dwType:chrome', 'programId': '${name}' }`;
  }

  if (_existAssignment(variable, name)) {
    console.log("\x1b[32m%s\x1b[0m", `[${name}] 已存在於 ${modelPath}`);
    return;
  }

  const arrayLiteralExpression = tsquery.query(variable, 'ArrayLiteralExpression');
  if (arrayLiteralExpression.length > 0) {
    let resultText = codeText;
    const programs = tsquery.query(arrayLiteralExpression[0], 'ObjectLiteralExpression:last-child');
    // 補到最後一個
    if (programs.length > 0) {
      const program = programs[0];
      const {character} = sourceFile.getLineAndCharacterOfPosition(program.getStart());
      let result =  '';
      if (codeText[program.getEnd()] !== ',') {
        result = ',\n' + result;
      }else {
        result = '\n' + result;
      }
      result = result + ' '.repeat(character) + template;
      resultText = _insertText(codeText, program.getEnd(), result);
    } else {
      // 加入到空Array中
      const emptyArray = arrayLiteralExpression[0];
      const result = `\n  ${template}\n`;
      resultText = _insertText(codeText, emptyArray.getStart() + 1, result);
    }
    fs.writeFileSync(modelPath, resultText, 'utf-8');
    console.log("\x1b[32m%s\x1b[0m", `修改 ${modelPath}`);
  }
}

exports = module.exports = {};
exports.insertComponentToRoutingModule = insertComponentToRoutingModule;
exports.insertProgramOrMenuModel = insertProgramOrMenuModel;
