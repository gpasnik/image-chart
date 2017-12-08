const express = require('express');
const uuid = require('uuid/v1');
const chartGenerator = require('../modules/phantom/chartGenerator');
const router = express.Router();

var randomScalingFactor = () => Math.random() * (10);

var chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Impressions",
            backgroundColor: "#cc3300",
            borderColor: "#cc3300",
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
            fill: false,
        }, {
            label: "Clicks",
            fill: false,
            backgroundColor: "#3399ff",
            borderColor: "#3399ff",
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
        }]
    };

/* GET linear chart. */
router.get('/linear', async (req, res, next) => {
    if(!!req.query.data){
        let encodeddata = req.query.data;
        console.log(encodeddata);
        let jsonData = Buffer.from(encodeddata, 'base64').toString(); //atob(encodeddata);
        console.log(jsonData);
        let data = JSON.parse(jsonData);
        console.log(data);

        res.render('chart', {chartData: data});
        return;
    }
    
    res.status(400).send('Chart data is missing');
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

router.get('/test', async (req, res, next) => {
    let fileName = uuid();
    let jsonData = JSON.stringify(chartData);
    let encodeddata = Buffer.from(jsonData).toString('base64');
    let chart = await chartGenerator.createChart(fileName, encodeddata);
    if(!chart){
        next(new Error('Error occured, cannot generate a chart'));
        return;
    }

    res.json({base64: chart});
});

module.exports = router;