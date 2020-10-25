import express from "express";
const router = express.Router();

import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";
import { v4 } from "uuid";
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
import shortid from "shortid";
import Fuse from "fuse.js";
import {
Quote,
News,
Chart
} from "../src/models/stockmarket";
import { SmSchema } from "../src/models/db-schema";
import axios from 'axios'

require('dotenv').config();

interface Stock {
  news: News[],
  chart: Chart[],
  quote: Quote
}

const NEWS = "news";
const QUOTE = "quote";
const CHART = "chart";
const STOCKS = "stocks";

const databaseFile = path.join(__dirname, "../data/stockmarket.json");
const adapter = new FileSync<SmSchema>(databaseFile);

const db = low(adapter);

router.get("/stocks", (req, res) => {
  const stocks = db
  .get(STOCKS)
  .value()
  res.status(200);
  res.json(stocks);
});

router.get("/stocks/:symbol", async (req, res) => {
let { symbol } = req.params
symbol = symbol.toUpperCase();
try{
  const stock = db.get(STOCKS).find({quote: {symbol: symbol}}).value();
  if (stock) {
  res.status(200)
  return res.json(stock);
  }
  const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/batch?types=quote,news,chart&token=${process.env.api_TOKEN}`)
  db.get(STOCKS).push(data).write();
  res.status(200).json({stock: db.get(symbol)})
} catch(error) {res.json(error)}
});


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
