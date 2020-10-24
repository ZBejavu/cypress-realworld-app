export interface Stock {
  news: News[];
  chart: Chart[];
  quote: Quote
};

export interface News{
datetime: number,
headline: string,
source: string,
url: string,
related: string,
image: string,
lang: string,
hasPaywall: boolean
}

export interface Chart {
date: string; 
close: number;
open: number; 
high: number;
low: number;
uopen: number; 
uclose: number;
uhigh: number;
ulow: number;
change: number;
label: string;
changeOverTime: number;
}

export interface Quote {
companyName:string,
primaryExchange:string,
calculationPrice:string,
open:number|null,
openTime:number|null,
openSource:string,
close:number|null,
closeTime:number|null,
closeSource:string,
high:number|null,
highTime:number|null,
highSource:string,
low:number|null,
lowTime:number|null,
lowSource:string,
latestPrice:number,
latestSource:string,
latestTime:string,
latestUpdate:number,
latestVolume:number,
iexRealtimePrice:null,
iexRealtimeSize:null,
iexLastUpdated:null,
delayedPrice:number,
delayedPriceTime:number,
oddLotDelayedPrice:number,
oddLotDelayedPriceTime:number,
extendedPrice:number,
extendedChange:number,
extendedChangePercent:number,
extendedPriceTime:number,
previousClose:number,
previousVolume:number,
change: number,
changePercent:number,
volume:number,
iexMarketPercent:null,
iexVolume:null,
avgTotalVolume:number,
iexBidPrice:null,
iexBidSize:null,
iexAskPrice:null,
iexAskSize:null,
iexOpen:null,
iexOpenTime:null,
iexClose:number|null,
iexCloseTime:number|null,
marketCap:number,
peRatio:number,
week52High:number,
week52Low:number,
ytdChange:number,
lastTradeTime:number,
isUSMarketOpen:false
}
