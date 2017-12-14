const Service = require('node-windows').Service;
const path = require('path');
const env = process.env["NODE_ENV_DUPA"];
const config = require('./config/config');

if(!env) {
  env = 'local';
}

const svc = new Service({
  name: 'Image-chart service',
  description: 'Generates chart as an image',
  script: path.join(__dirname, 'src/server.js'),
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

svc.on('install', () =>{
  console.log('Service installed');
  svc.start();
});

svc.on('alreadyinstalled',function(){
  console.log('Service is already installed.');
});

svc.on('start', () => {
  console.log('Service started');
});

svc.install();