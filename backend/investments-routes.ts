import express from "express";
const router = express.Router();

import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";
import {
  uniqBy,
  map,
  sample,
  reject,
  includes,
  orderBy,
  flow,
  flatMap,
  curry,
  take,
  get,
  constant,
  filter,
  inRange,
  remove,
} from "lodash/fp";
import { isWithinInterval } from "date-fns";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import Fuse from "fuse.js";
import { Quote, News, Chart } from "../src/models/stockmarket";
import { SmSchema } from "../src/models/db-schema";
import axios from "axios";
import { v4 } from "uuid";
import shortid from "shortid";
import { Investment } from "../src/models/investment";
import { updateUserById } from './database'

require("dotenv").config();

const STOCKS = "stocks";
const INVESTMENTS = "investments";
const CHART = "chart";
const NEWS = "news";
const QUOTE = "quote";

const databaseFile = path.join(__dirname, "../data/stockmarket.json");
const adapter = new FileSync<SmSchema>(databaseFile);

const db = low(adapter);

router.get("/stocks", (req, res) => {
  const stocks = db.get(STOCKS).value();
  res.status(200);
  res.json(stocks);
});

router.get("/stocks/:symbol", async (req, res) => {
  let { symbol } = req.params;
  symbol = symbol.toUpperCase();
  try {
    const stock = db
      .get(STOCKS)
      .find({ quote: { symbol: symbol } })
      .value();
    if (stock) {
      return res.status(200).json(stock);
    }
    const { data } = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${symbol}/batch?types=quote,news,chart&token=${process.env.api_TOKEN}`
    );
    db.get(STOCKS).push(data).write();
    res.status(200).json({ stock: db.get(symbol) });
  } catch (error) {
    res.json(error);
  }
});

router.get("/invest/:symbol/:userId", (req, res) => {
try{
    const { symbol, userId } = req.params;
  const investment = db.get(INVESTMENTS).find({ symbol, userId }).value();
  return res.status(200).json(investment);
} catch {
  return res.status(200).json({investment: false})
}
});

router.post("/invest/:symbol/:userId", (req, res) => {
  const { bidPrice, amount, balance } = req.body;
  const { symbol, userId } = req.params;
try{
    const investment: Investment = {
    id: shortid(),
    uuid: v4(),
    userId: userId,
    symbol: symbol,
    bidPrice: bidPrice,
    date: new Date().getTime(),
    amount: amount,
  };
  db.get(INVESTMENTS).push(investment).write();
  updateUserById(userId, { balance })
  return res.status(200).json({ success: true });
} catch(err) { console.log(err)}
});

router.delete("/invest/:symbol/:userId", (req, res) => {
  const { symbol, userId } = req.params;
  const investment = db.get(INVESTMENTS).find({ symbol, userId }).value();
  db.get(INVESTMENTS).remove({ symbol, userId }).write();
  // add to balance
  return res.status(200).json({amount: investment.amount / investment.bidPrice});
});


router.patch("/invest/:symbol/:userId", (req, res) => {
  const { bidPrice, amount, balance } = req.body;
  const { symbol, userId } = req.params;
  let date = new Date().getTime();
  db
  .get(INVESTMENTS)
  .find({ symbol, userId })
  .assign({ bidPrice, amount, date}) // client
  .write();
  updateUserById(userId, { balance })
  return res.status(200).json({ updated: true });
});

// interval fetch data from API

async function getChartData(){ // per 10 stocks = 100 messages a day
const stocks = db.get(STOCKS).value();
for (let stock of stocks){
if(stock.chart[stock.chart.length - 1].date.substr(8,2) !== new Date().getUTCDate().toString()){
const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${stock.quote.symbol}/batch?types=chart&chartLast=1&range=1m&token=${process.env.api_TOKEN}`)
if(stock.chart[stock.chart.length - 1].date !== data.date){
db.get(STOCKS).find({ quote: { symbol: stock.quote.symbol } }).get(CHART).push(data.chart).write();
}}}
}

async function getNewsData(){ // per 10 stocks = 200 messages a day
const stocks = db.get(STOCKS).value();
for (let stock of stocks){
const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${stock.quote.symbol}/batch?types=news&token=${process.env.api_TOKEN}`)
db.get(STOCKS).find({ quote: { symbol: stock.quote.symbol } }).assign(data).write();
}}

async function getQuoteData(){ // per 10 stocks - 80 messages a day
const stocks = db.get(STOCKS).value();
for (let stock of stocks){
const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${stock.quote.symbol}/batch?types=quote&token=${process.env.api_TOKEN}`)
db.get(STOCKS).find({ quote: { symbol: stock.quote.symbol } }).assign(data).write();
}
}

// getQuoteData()
// setInterval(getQuoteData, 1000 * 60 * 60 * 3); 
// getNewsData()
// setInterval(getNewsData, 1000 * 60 * 60 * 12);  
// getChartData()
// setInterval(getChartData, 1000 * 60 * 60 * 24); 

/*



router.get("/stocks/webhook", (req, res) => {
const event = req.body
const { data } = req.body
const { iexRealtimePrice, previousClose, latestPrice } = data
  const stock = getOneStock(event);
  // not a real function ---  stock.quote.update({ iexRealtimePrice, previousClose, latestPrice })
  res.status(200);
  res.json({ stock });
});


*/

export default router;
