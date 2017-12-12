const phantom = require('phantom');
const fs = require('fs');
const phantomPool = require('phantom-pool');

const pool = phantomPool({
  max: 10, 
  min: 2,
  // how long a resource can stay idle in pool before being removed 
  idleTimeoutMillis: 10000,
  // maximum number of times an individual resource can be reused before being destroyed
  maxUses: 15,
  phantomArgs: [['--ignore-ssl-errors=true', '--disk-cache=true'], {
    logLevel: 'info',
  }], // arguments passed to phantomjs-node directly, default is `[]`. For all opts, see https://github.com/amir20/phantomjs-node#phantom-object-api 
});

var base64Encode = (path) => {
  let file = fs.readFileSync(path);

  return Buffer.from(file).toString('base64');
};

var removeFile = (path) => {
  fs.unlinkSync(path);
};

var chartGenerator = {
  createChart: async (filename, data) => {
    if (!data)
      return;
    let destinationPath = `output/${filename}.png`;
    console.time('chart-render');
    await pool.use(async (instance) => {
      let page = await instance.createPage();
      let status = await page.open(`http://localhost:3000/charts/linear.base?data=${data}`);
      console.log(`Status: ${status}`);
      let render = await page.render(destinationPath);
      console.log('Chart rendered');
    });
    console.timeEnd('chart-render');

    let base64File = base64Encode(destinationPath);
    removeFile(destinationPath);

    return base64File;
  }
};

module.exports = chartGenerator;