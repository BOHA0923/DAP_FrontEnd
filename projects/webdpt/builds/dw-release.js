/**
 * 發版
 * 1. 檢查Git Tag
 * 2. 更新版號：system.config.ts和package.json
 * 3. Git 自動化：commit和Tag
 *
 * @usageNotes node projects\webdpt\builds\dw-release.js "3.0.0.1000"
 */


var fs = require('fs');
var readline = require('readline');
const path = require('path');
var exec = require('child_process').exec;

if (process.argv.length !== 3) {
  console.log('請輸入版號，例如：node projects\\webdpt\\builds\\dw-release.js "3.0.0.1000"');
  process.exit(0);
}

var args = process.argv.slice(2);
var argVersion = args[0];
var verArr = argVersion.split('.');
if (verArr.length < 4) {
  console.error('錯誤：', '請檢查版號格式"' + argVersion + '"');
  process.exit(0);
}

var majorVer = verArr[0].toString() + '.' + verArr[1].toString(); // 大版號
var minorVer = verArr[2].toString(); // 小版號
var dockerBuildPlantformVer = majorVer + '.' + minorVer; // Docker平台版號，只到小版號，不支持patch版號

var patchVer = null; // patch版號
if (verArr.length === 4) {
  patchVer = verArr[3].toString();
}

// 週期
var termSupport = 'STS'; // STS：雲端, LTS：地端
if (patchVer !== null) {
  if (parseInt(patchVer) < 1000) {
    termSupport = 'LTS';
  }

  var termSupportVersion = majorVer + '.' + minorVer + '+' + termSupport + '.' + patchVer;
} else {
  var termSupportVersion = argVersion;
}


checkTag(argVersion).then(
  (chk) => {
    updateVersionProcess(argVersion, termSupportVersion).then(
      (versionResult) => {
        // 週期定義雲端或地端
        termDefine().then(
          () => {
            gitProcess().then(
              () => {
                console.log('成功');
              }, (error) => {
                console.error('錯誤：', error);
              }
            );
          }, (error) => {
            console.error('錯誤：', error);
          }
        );
      }, (error) => {
        console.error('錯誤：', error);
      }
    );
  }, (error) => {
    console.error('錯誤：', error);
  }
);

/**
 * 檢查Git Tag
 *
 * @param tagVersion Tag版號
 */
function checkTag(tagVersion) {
  console.log('檢查Git Tag-------------------');
  return new Promise((resolve, reject) => {
    var command = 'git tag';
    console.log(command);
    exec(command,
      (error, stdout, stderr) => {
        if (stdout) {
          taglist = stdout.toString().split('\n');
          for (i = 0; i < taglist.length; i++) {
            if (taglist[i] === tagVersion) {
              reject('Git Tag 已存在' + tagVersion);
            }
          }

          resolve('success');
        }

        if (stderr) {
          console.error(`${stderr}`);
          reject(stderr);
        }

        if (error !== null) {
          console.error(`exec error: ${error}`);
          reject(error);
        }

        // return callback(error, stdout, stderr);
      }
    );
  });
}

/**
 * 更新 Dockerfile 1.平台版號
 */
function updateDockerfile() {
  return new Promise((resolve, reject) => {
    try {
      // 檔案：./Makefile
      var pathDir = path.join('.');
      var pathDir = path.join('projects', 'webdpt', 'docker-ci', 'env-install');
      var file = path.join(pathDir, 'Makefile');

      // 建立檔案讀取資料流
      var inputStream = fs.createReadStream(file);
      inputStream.on('error', function (error) { // try catch 無法攔截此錯誤，所以要自行判斷
        reject(error);
      });

      // 將讀取資料流導入 Readline 進行處理
      var lineReader = readline.createInterface({ input: inputStream });
      var newData = [];

      lineReader.on('line', function (lineStr) {
        var newStr = lineStr;

        // newStr = PLATFORM_VERSION=<platform_version>
        if (newStr.indexOf('PLATFORM_VERSION=') !== -1) {
          newStr = 'PLATFORM_VERSION=' + dockerBuildPlantformVer;
        }

        newData.push(newStr);
      }).on('close', () => {
        var content = '';
        newData.forEach(
          item => {
            content = content + item + '\n';
          }
        );

        fs.writeFileSync(
          file,
          content,
          { encoding: 'utf8' }
        );

        console.log('Dockerfile DAP version:' + argVersion, ',file:' + file);
        resolve('success');
      });
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * 更新版號
 *
 * @param file 檔案
 * @param version 版號
 */
function updateVersion(file, version) {
  return new Promise((resolve, reject) => {
    try {
      var quotes = '\''; // 字串引號
      if (file.indexOf('.json') !== -1) {
        quotes = '"';
      }

      // 建立檔案讀取資料流
      var inputStream = fs.createReadStream(file);
      inputStream.on('error', function (error) { // try catch 無法攔截此錯誤，所以要自行判斷
        reject(error);
      });

      // 將讀取資料流導入 Readline 進行處理
      var lineReader = readline.createInterface({ input: inputStream });
      var newData = [];

      lineReader.on('line', function (lineStr) {
        var newStr = lineStr;

        // newStr = '"version": "3.0.0+STS.1000",'
        // newStr = 'dwVersion: '3.0.0.1000','
        if (newStr.indexOf('"version"') !== -1 || newStr.indexOf('dwVersion') !== -1) {
          var keyValue = newStr.split(':');
          newStr = keyValue[0] + ': ' + quotes + '' + version + '' + quotes + ',';
        }

        newData.push(newStr);
      }).on('close', () => {
        var content = '';
        newData.forEach(
          item => {
            content = content + item + '\n';
          }
        );

        fs.writeFileSync(
          file,
          content,
          { encoding: 'utf8' }
        );

        console.log('version:' + version, ',file:' + file);
        resolve('success');
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 更新版號自動化
 *
 * @param argVersion
 * @param termSupportVersion
 * @returns
 */
function updateVersionProcess(argVersion, termSupportVersion) {
  return new Promise((resolve, reject) => {
    console.log('更新版號自動化-------------------');
    // projects\webdpt\framework\config\system.config.ts
    var pathDir = path.join('projects', 'webdpt', 'framework', 'config');
    var pathFile = path.join(pathDir, 'system.config.ts');
    updateVersion(pathFile, argVersion).then(
      (systemConfigSuccess) => {
        // package.json
        pathDir = path.join('projects', 'webdpt', 'framework');
        pathFile = path.join(pathDir, 'package.json');
        updateVersion(pathFile, termSupportVersion).then(
          (frameworkPackageSuccess) => {
            pathDir = path.join('projects', 'webdpt', 'components'); // v3.0.0
            pathFile = path.join(pathDir, 'package.json');
            updateVersion(pathFile, termSupportVersion).then(
              (componentsPackageSuccess) => {
                pathDir = path.join('projects', 'webdpt', 'analytics');
                pathFile = path.join(pathDir, 'package.json');
                updateVersion(pathFile, termSupportVersion).then(
                  (analyticsPackageSuccess) => {
                    pathDir = path.join('projects', 'webdpt', 'programs');
                    pathFile = path.join(pathDir, 'package.json');
                    updateVersion(pathFile, termSupportVersion).then(
                      (programsPackageSuccess) => {
                        pathDir = path.join('projects', 'showcase-app');
                        pathFile = path.join(pathDir, 'package.json');
                        updateVersion(pathFile, termSupportVersion).then(
                          (showcasePackageSuccess) => {
                            updateDockerfile().then(
                              (DockerfileSuccess) => {
                                resolve('success');
                              }, (error) => {
                                reject(error);
                              }
                            );
                          }, (error) => {
                            reject(error);
                          }
                        );
                      }, (error) => {
                        reject(error);
                      }
                    );
                  }, (error) => {
                    reject(error);
                  }
                );
              }, (error) => {
                reject(error);
              }
            );
          }, (error) => {
            reject(error);
          }
        );
      }, (error) => {
        reject(error);
      }
    );
  })
}

/**
 * 週期定義雲端或地端
 * 改src\assets\api.dev.json 是否為多租戶multiTenant
 */
function termDefine() {
  return new Promise((resolve, reject) => {
    try {
      // 檔案：./Makefile
      var pathDir = path.join('.');
      var pathDir = path.join('src', 'assets');
      var file = path.join(pathDir, 'api.dev.json');

      // 建立檔案讀取資料流
      var inputStream = fs.createReadStream(file);
      inputStream.on('error', function (error) { // try catch 無法攔截此錯誤，所以要自行判斷
        reject(error);
      });

      // 將讀取資料流導入 Readline 進行處理
      var lineReader = readline.createInterface({ input: inputStream });
      var newData = [];

      lineReader.on('line', function (lineStr) {
        var newStr = lineStr;

        if (newStr.indexOf('"multiTenant"') !== -1) {
          if (termSupport === 'STS') {
            newStr = '  "multiTenant": "true"';
          } else if (termSupport === 'LTS') {
            newStr = '  "multiTenant": "false"';
          }
        }

        newData.push(newStr);
      }).on('close', () => {
        var content = '';
        newData.forEach(
          item => {
            content = content + item + '\n';
          }
        );

        fs.writeFileSync(
          file,
          content,
          { encoding: 'utf8' }
        );

        console.log('週期定義雲端或地端：' + termSupport);
        resolve('success');
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 執行指令
 *
 * @param command 指令
 * @param callback 回調函式
 */
function execCmd(command, callback) {
  console.log(command);

  exec(command,
    (error, stdout, stderr) => {
      if (stdout) {
        console.log(`${stdout}`);
      }

      if (stderr) {
        console.error(`${stderr}`);
      }

      if (error !== null) {
        console.error(`exec error: ${error}`);
      }

      return callback(error, stdout, stderr);
    }
  );
}

/**
 * Git 自動化
 *
 */
function gitProcess() {
  return new Promise((resolve, reject) => {
    console.log('Git 自動化：commit和Tag-------------------');
    var gitCmd = 'git add --all';
    execCmd(gitCmd, function (errorGitAdd, stdoutGitAdd, stderrGitAdd) {
      if (errorGitAdd) {
        reject(errorGitAdd);
      } else if (stderrGitAdd) {
        reject(stderrGitAdd);
      } else {
        gitCmd = 'git commit -m "release(' + argVersion + ')"';
        execCmd(gitCmd, function (errorGitCommit, stdoutGitCommit, stderrGitCommit) {
          if (errorGitCommit) {
            reject(errorGitCommit);
          } else if (stderrGitCommit) {
            reject(stderrGitCommit);
          } else {
            gitCmd = 'git tag -a ' + argVersion + ' -m "release(' + argVersion + ')"';
            execCmd(gitCmd, function (errorGitTag, stdoutGitTag, stderrGitTag) {
              if (errorGitTag) {
                reject(errorGitTag);
              } else if (stderrGitTag) {
                reject(stderrGitTag);
              } else {
                resolve('success');
              }
            });
          }
        });
      }
    });
  });
}
