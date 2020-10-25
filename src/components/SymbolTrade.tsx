import React, {useState, useEffect} from 'react'
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import axios from "axios";
import { Investment } from '../models/investment'

export interface Props {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>
    quote: Quote
  }

interface Quote {
symbol:string;
companyName:string;
primaryExchange:string;
calculationPrice:string;
open:number|null;
openTime:number|null;
openSource:string;
close:number|null;
closeTime:number|null;
closeSource:string;
high:number|null;
highTime:number|null;
highSource:string;
low:number|null;
lowTime:number|null;
lowSource:string;
latestPrice:number;
latestSource:string;
latestTime:string;
latestUpdate:number;
latestVolume:number;
iexRealtimePrice:null;
iexRealtimeSize:null;
iexLastUpdated:null;
delayedPrice:number;
delayedPriceTime:number;
oddLotDelayedPrice:number;
oddLotDelayedPriceTime:number;
extendedPrice:number;
extendedChange:number;
extendedChangePercent:number;
extendedPriceTime:number;
previousClose:number;
previousVolume:number;
change: number;
changePercent:number;
volume:number;
iexMarketPercent:null;
iexVolume:null;
avgTotalVolume:number;
iexBidPrice:null;
iexBidSize:null;
iexAskPrice:null;
iexAskSize:null;
iexOpen:null;
iexOpenTime:null;
iexClose:number|null;
iexCloseTime:number|null;
marketCap:number;
peRatio:number;
week52High:number;
week52Low:number;
ytdChange:number;
lastTradeTime:number;
isUSMarketOpen:false;
}

const SymbolTrade: React.FC<Props> = ({ authService, quote}) => {
  const [investment, SetInvestment] = useState<Investment|null>(null);
  const [authState, sendAuth] = useService(authService);
  const [amount, setAmount] = useState<number>(0)

const currentUser = authState?.context?.user;

useEffect(() => {
    const fetchData = async () => {
    if (quote) {
    const { data } = await axios.get(
      `http://localhost:3001/investments/invest/${quote.symbol}/${currentUser?.id}`
    );
    SetInvestment(data)
    }}; fetchData();
}, [quote])



const buyStock = async (amount: number) => {
if(quote.iexRealtimePrice) {
await axios.post(
      `http://localhost:3001/investments/invest/${quote.symbol}/${currentUser?.id}`, {
  bidPrice: quote.iexRealtimePrice,
  amount: amount,
  balance: currentUser?.balance as number - amount
      }
    );
    }
}

const sellStock = async () => {
if(quote.iexRealtimePrice) {
const { data } = await axios.delete(
      `http://localhost:3001/investments/invest/${quote.symbol}/${currentUser?.id}`
    )
let currentAmount = data.amount * (quote.iexRealtimePrice as unknown as number)
let currentBalance = currentUser?.balance as number + currentAmount
await axios.patch(
      `http://localhost:3001/investments/invest/${currentBalance}/${currentUser?.id}`
    )
}
}

const updateStock = async (investment: Investment, amount: number) => {
let updatedAmount = amount + ((investment.amount / investment.bidPrice) * (quote.iexRealtimePrice as unknown as number));
if(quote.iexRealtimePrice) {
await axios.patch(
      `http://localhost:3001/investments/invest/${quote.symbol}/${currentUser?.id}`, {
  bidPrice: quote.iexRealtimePrice,
  amount: updatedAmount,
  balance: currentUser?.balance as number - amount
      }
    );
}
}

      return (
<form>
<input onChange={(event) => setAmount(Number(event.target.value))} placeholder="search symbol"/>
<button onClick={() => buyStock(amount)}>Buy</button>
<button onClick={() => sellStock()}>Sell</button>
<button onClick={() => updateStock(investment as Investment, amount)}>Update</button>
</form>
    )
}

export default SymbolTrade
