const express = require('express');
const uuid = require('uuid/v1');
const chartGenerator = require('../modules/phantom/chartGenerator');
const router = express.Router();

/* GET linear chart. */
router.get('/linear.base', async (req, res, next) => {
    if(!req.query.data){
        next(new Error('Chart data is missing'));
        return;
    }

    let encodeddata = req.query.data;
    console.log(encodeddata);
    let jsonData = Buffer.from(encodeddata, 'base64').toString();
    console.log(jsonData);
    let data = JSON.parse(jsonData);
    console.log(data);

    res.render('chart', {chartConfig: data});
});

/* GET linear chart. */
router.get('/linear', async (req, res, next) => {
    if(!req.query.data){
        next(new Error('Chart data is missing'));
        return;
    }

    let data = JSON.parse(req.query.data);
    console.log(JSON.stringify(data));
    res.render('chart', {chartConfig: data});
});

/* POST linear chart. */
router.post('/linear', async (req, res, next) => {
    let fileName = uuid();
    let jsonBody = JSON.stringify(req.body);
    console.log(jsonBody);
    let encodedData = Buffer.from(jsonBody).toString('base64');
    let chart = await chartGenerator.createChart(fileName, encodedData);
    if(!chart){
        next(new Error('Error occured, cannot generate a chart'));
        return;
    }

    res.json({base64: chart});
});

module.exports = router;