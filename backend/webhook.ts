import express from "express";
const router = express.Router();

/*

const Request = require('request-promise-native');
function connect() {
    Request({
        method: 'POST',
        url: 'https://cloud.iexapis.com/stable/rules/create',
        json: {
            token: '{YOUR_API_TOKEN}',
            ruleSet: 'UAL, TSLA, RCL, PINS, NFLX, MCD, INTC, FB, AAPL, AMZN',
            type: 'any',
            ruleName: 'My Rule',
            conditions: [
                ['changePercent','>',5],
                ['latestPrice','<',100]
            ],
            outputs: [
                {
                    frequency: 10800,
                    method: 'url',
                    to: 'Webhook'
                }
            ],
            additionalKeys: ['iexRealtimePrice, 'previousClose', 'latestPrice']
        },
    }).then((body) => {
        console.log(body);
    }).catch((err) => {
        console.log("Error in request", err);
    });
}

connect();

*/

export default router;