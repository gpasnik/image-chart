const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'Image-chart service',
  description: 'Generates chart as an image',
  script: path.join(__dirname, 'src/server.js')
});

svc.on('stop', () => {
  console.log('Service stopped');
});

svc.on('uninstall', () => {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

svc.uninstall();