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


const getAllStocks = () => db.value();
const getOneStock = (stock:string) => db.get(stock).value();

router.get("/stocks", (req, res) => {
  const stocks = getAllStocks();
  res.status(200);
  res.json({ stocks });
});

router.get("/stocks/:symbol", (req, res) => {
const { symbol } = req.params
  const stock = getOneStock(symbol.toUpperCase());
  res.status(200);
  res.json({ stock });
});

router.get("/stocks/:symbol", (req, res) => {
const { symbol } = req.params
  const stock = getOneStock(symbol.toUpperCase());
  res.status(200);
  res.json({ stock });
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
