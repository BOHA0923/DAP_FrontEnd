'use strict';

const fs = require('fs');
const packagePath = './package.json';

fs.readFile(packagePath, ((err, data) => {
  if (err) throw err;
  let packageJson = JSON.parse(data);
  let postInstall = packageJson.scripts.postinstall;
  if (postInstall.indexOf('projects/webdpt/framework') === -1) {
    postInstall = postInstall.replace(' ng-quicksilver ', ' ng-quicksilver projects/webdpt/framework ');
    packageJson.scripts.postinstall = postInstall;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  }
}));
