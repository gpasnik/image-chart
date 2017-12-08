const phantom = require('phantom');
const fs = require('fs');

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
    let instance = await phantom.create();
    let page = await instance.createPage();
    let status = await page.open(`http://localhost:3000/charts/linear?data=${data}`);
    console.log(`Status: ${status}`);
    let render = await page.render(destinationPath);
    console.log('Chart rendered');
    await instance.exit();

    let base64File = base64Encode(destinationPath);
    removeFile(destinationPath);

    return base64File;
  }
};

module.exports = chartGenerator;