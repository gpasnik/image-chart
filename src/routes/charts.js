const express = require('express');
const uuid = require('uuid/v1');
const chartGenerator = require('../modules/phantom/chartGenerator');
const router = express.Router();

/* GET custom chart. */
router.get('/custom', async (req, res, next) => {
    if(!req.query.data){
        next(new Error('Chart data is missing'));
        return;
    }

    let data = JSON.parse(req.query.data);
    console.log(JSON.stringify(data));
    res.render('chart', {chartConfig: data});
});

/* GET line chart. */
router.get('/line.base', async (req, res, next) => {
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

    res.render('line-chart', {chartConfig: data});
});

/* GET line chart. */
router.get('/line', async (req, res, next) => {
    if(!req.query.data){
        next(new Error('Chart data is missing'));
        return;
    }

    let data = JSON.parse(req.query.data);
    console.log(JSON.stringify(data));
    res.render('line-chart', {chartConfig: data});
});

/* GET bar chart. */
router.get('/bar', async (req, res, next) => {
    if(!req.query.data){
        next(new Error('Chart data is missing'));
        return;
    }

    let data = JSON.parse(req.query.data);
    console.log(JSON.stringify(data));
    res.render('bar-chart', {chartConfig: data});
});

/* POST custom chart */
router.post('/custom', async (req, res, next) => {
    let fileName = uuid();
    let jsonBody = JSON.stringify(req.body);
    console.log(typeof jsonBody);
    let chart = await chartGenerator.createCustomChart(fileName, req.body);
    if(!chart){
        next(new Error('Error occured, cannot generate a chart'));
        return;
    }

    res.json({base64: chart});
});

/* POST linear chart. */
router.post('/line', async (req, res, next) => {
    let fileName = uuid();
    let jsonBody = JSON.stringify(req.body);
    console.log(jsonBody);
    let encodedData = Buffer.from(jsonBody).toString('base64');
    let chart = await chartGenerator.createLineChart(fileName, encodedData);
    if(!chart){
        next(new Error('Error occured, cannot generate a chart'));
        return;
    }

    res.json({base64: chart});
});

/* POST linear chart. */
/* obsolete, will be removed with next deployment*/
router.post('/linear', async (req, res, next) => {
    let fileName = uuid();
    let jsonBody = JSON.stringify(req.body);
    console.log(jsonBody);
    let encodedData = Buffer.from(jsonBody).toString('base64');
    let chart = await chartGenerator.createLineChart(fileName, encodedData);
    if(!chart){
        next(new Error('Error occured, cannot generate a chart'));
        return;
    }

    res.json({base64: chart});
});

/* POST bar chart */
router.post('/bar', async (req, res, next) => {
    let fileName = uuid();
    let jsonBody = JSON.stringify(req.body);
    console.log(jsonBody);
    let encodedData = Buffer.from(jsonBody).toString('base64');
    let chart = await chartGenerator.createBarChart(fileName, encodedData);
    if(!chart){
        next(new Error('Error occured, cannot generate a chart'));
        return;
    }

    res.json({base64: chart});
});

module.exports = router;