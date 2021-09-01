/**
 * 範例：
 * npm run gmc --
 *   --name service-doc
 *   --service true
 *   --folder implementation/programs/crs
 *   --parent-module crs.module.ts
 *   --routing true
 *   --route-name service-doc
 *   --components service-doc-list,service-doc-modify
 *
 * 參數說明：
 *   --name          模組名稱。
 *   --service       創建同名的service
 *   --no-service    不創建servcie
 *   --folder        基礎工作目錄，在此目錄下建立新的模組目錄及相關檔案。
 *   --parent-module 上層模組名稱。
 *   --routing       是否建立路由模組。
 *   --route-name    路由名稱，在上層模組內建立loadChildren配置，依賴`--parentModule`參數。
 *   --components    在新模組下建立組件，以逗號分隔多個組件名稱。
 */


const program = require("commander");
const {spawnSync} = require("child_process");
const fs = require("fs");
const path = require("path");
const {insertComponentToRoutingModule, insertProgramOrMenuModel} = require("./parse-routes");
const APP_ROOT = process.cwd();
const I18N_PATH = "src/assets/i18n";
const LANGUAGES = ["en_US", "zh_CN", "zh_TW"];

const program_model_path = "src/app/implementation/program-info/model/program.model.ts";
const menu_model_path = "src/app/implementation/menu/model/menu.model.ts";

program
  .version("0.0.1")
  .description("產生模組與組件")
  .requiredOption("--name <name>", "模組名稱")
  .requiredOption("--folder <folder>", "工作路徑")
  .requiredOption("--parent-module <parentModule>", "上層模組檔案名稱")
  .option("--route-name [routeName]", "路由名稱")
  .option("--components [components]", "組件", (value)=>value.split(","), [])
  .option("--routing", "是否生成路由模組", true)
  .option("--service", "是否生成服務", true)
  .option("--no-service", "不生成服務", true)
  // .option("--dry-run", "預覽變更", true)
  // .option("--no-dry-run", "直接運行")
  .parse(process.argv);

const {name, folder, parentModule, routeName, components, routing, dryRun, service} = program;

let genModuleCmd = "npm run ng generate module --"

if (name) {
  genModuleCmd += ` ${name}`;
} else {
  console.log("\x1b[31m%s\x1b[0m", `請提供模組名稱 --name [模組名稱]`);
  process.exit();
}

if (folder) {
  if (fs.existsSync(path.join(APP_ROOT, folder))) {
    genModuleCmd += ` --path ${folder}`;
  } else {
    console.log("\x1b[31m%s\x1b[0m", `指定的--folder [${folder}]不存在。`);
    process.exit();
  }
}

if (parentModule) {
  genModuleCmd += ` --module ${parentModule}`;
}

if (routeName) {
  if (!parentModule) {
    console.log("\x1b[31m%s\x1b[0m", `請提供上層模組檔案名稱 --parent-module [上層模組檔案名稱]`);
    process.exit();
  }
  genModuleCmd += ` --route ${routeName}`;
}

let genModuleCmdDry = genModuleCmd;
if (dryRun) {
  genModuleCmdDry += ` --dry-run`;
}

// 創建module
const genModuleProcess = spawnSync(genModuleCmdDry, {stdio: [process.stdin, process.stdout, process.stderr], shell: true});

if (genModuleProcess.status === 0) {

  // 創建components
  const componentBaseFolder = combinePath(folder, name);

  for (let index in components) {
    const componentName = components[index];
    const genComponentCmd = generateComponentCommand(componentName, name, componentBaseFolder, routing, true);
    const genComponentProcess = spawnSync(genComponentCmd, {
      stdio: [process.stdin, process.stdout, process.stderr],
      shell: true
    });
    if (genComponentProcess.status !== 0) {
      process.exit(1);
    }
    createI18nFile(componentName);

    const routingFile = path.join(folder, name, name + "-routing.module.ts");
    const componentFile = path.join(componentName, componentName + ".component.ts");

    insertComponentToRoutingModule(routingFile, componentFile);

    insertProgramOrMenuModel(componentName, menu_model_path, name, 'menu');

    insertProgramOrMenuModel(componentName, program_model_path, name, 'program');
  }

  // 創建service
  if (service) {
    const serviceFolder = path.join(folder, name).replace(/\\/g, "/");
    const genServiceCmd = `npm run ng generate service ${name} -- --path ${serviceFolder}`;
    const genServiceProcess = spawnSync(genServiceCmd, {stdio: [process.stdin, process.stdout, process.stderr], shell: true});
    if (genServiceProcess.status !== 0) {
      process.exit(1);
    }
  }
}

function generateComponentCommand(name, module, path, routing, dryRun) {
  let command = `npm run ng generate component ${name} -- --path ${path}`;
  if (module) {
    command += ` --module ${module}.module.ts`;
  }
  return command;
}

/**
 * windows環境下，ng g c --path無法接受反斜線路徑
 */
function combinePath(path1, path2) {
  return path1 + (path2.startsWith("/") ? "" : "/") + path2;
}

function createI18nFile(name) {
  for (const index in LANGUAGES) {
    const lang = LANGUAGES[index];
    const i18nPath = path.join(APP_ROOT, I18N_PATH, lang, name) + ".json";
    if (!fs.existsSync(i18nPath)) {
      fs.writeFile(i18nPath, "{}", function(err){
        if (err) {
          console.log("\x1b[31m%s\x1b[0m", `建立 [${i18nPath}] 失敗!`);
        } else {
          console.log("\x1b[32m%s\x1b[0m", `建立 ${i18nPath}`);
        }
      });
    }
  }
}
