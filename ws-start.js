const Service = require('node-windows').Service;
const path = require('path');
const config = require('./config/config');
var env = process.env["NODE_ENV"];

if(!env) {
  env = 'local';
}

console.log(`Running environment: ${env}`);
const scriptPath = path.join(__dirname, 'src/server.js');
console.log(`Service path: ${scriptPath}`);

const svc = new Service({
  name: 'Image-chart-service',
  description: 'Generates chart as an image',
  script: scriptPath,
  env: {
    name: "PORT",
    value: config.port
  }
});

if (env === 'prod' || 'dev') {
  svc.user.domain = config.user.domain;
  svc.user.account = config.user.account;
  svc.user.password = config.user.password;
}

svc.on('start', () => {
  console.log('Service started');
});

svc.start();