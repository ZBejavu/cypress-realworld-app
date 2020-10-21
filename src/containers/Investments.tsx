import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import axios from 'axios'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export interface UserSettingsProps {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
  }
  
const Investments: React.FC<UserSettingsProps> = ({authService}) => {
  const [symbolsTable, setSymbolsTable] = useState<symbols[]>([])
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const [orderBy, setOrderBy] = useState<'Name'|'Symbol'|'Open Price'|'Current Price'|'Grwoth'>('Name');
  const [toggleState, setToggleState] = useState<boolean>(false)


  interface financeInfo {
    o: number, // Open price of the day
    h: number, // High price of the day
    l: number, // Low price of the day
    c:number, // Current price
    pc: number // Previous close price
    g: number // Growth
  }

  interface symbols {
    ticker:string;
    name:string;
    financeInfo: financeInfo;
  }
 
 
let initiaFinanceInfo =
{   o: 0,
    h: 0,
    l: 0,
    c: 0,
    pc: 0,
    g: 0
}
    
  const symbols : symbols[] = [
    {ticker:'TSLA' , name: 'Tesla', financeInfo: initiaFinanceInfo},
    {ticker:'MCD' , name: 'McDonalds', financeInfo: initiaFinanceInfo},
    {ticker: 'AMZN', name: 'Amazon', financeInfo: initiaFinanceInfo},
    {ticker: 'FB', name: 'Facebook', financeInfo: initiaFinanceInfo},
    {ticker: 'AAPL', name: 'Apple', financeInfo: initiaFinanceInfo},
    {ticker: 'UAL', name: 'United Airlines', financeInfo: initiaFinanceInfo},
    {ticker: 'INTC', name: 'Inter Corporation', financeInfo: initiaFinanceInfo},
    {ticker: 'Pins', name: 'Pinterest', financeInfo: initiaFinanceInfo},
    {ticker: 'NFLX', name: 'Netflix', financeInfo: initiaFinanceInfo},
    {ticker: 'RCL', name: 'Royal Caribbean Group', financeInfo: initiaFinanceInfo}
  ]

  const fetchData = async () => {
  let dataTable : symbols[] = symbols.slice();
  for (let item of dataTable){
    const { data } : any = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${item.ticker}&token=bu86r5748v6ufhqjbl10`);
    item.financeInfo = data;
    item.financeInfo.g = Number((data.c / data.o).toFixed(3))
  }
  setSymbolsTable(dataTable);
  }; 


  useEffect(() => { 
    fetchData();
    const financeInterval = setInterval(fetchData, 600000);
    return () => clearInterval(financeInterval);
  }, []);


const HeadCells = ['Name', 'Symbol', 'Open Price', 'Current Price', 'Grwoth']

  const handleRequestSort = (property: any) => () => { 
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setToggleState(!toggleState)
  }

useEffect(() => {
// למה לעזאזל זה לא עובד
console.log(order,orderBy) 
const sortTable = () => {
let sortedTable = symbolsTable.sort((a:symbols, b:symbols): number => {
if(order === 'desc'){
  switch(orderBy){
  case 'Name':
 if (a.name.toUpperCase() < b.name.toUpperCase()){
return -1;
 } else return 1;
 case 'Symbol':
 if (a.ticker.toUpperCase() < b.ticker.toUpperCase()){
return -1;
 } else return 1;
 case 'Open Price':
 return b.financeInfo.o - a.financeInfo.o;
 case 'Current Price':
 return b.financeInfo.c - a.financeInfo.c;
  case 'Grwoth':
 return b.financeInfo.g - a.financeInfo.g;
default:
  return 1;
  }
} else {
  switch(orderBy){
  case 'Name':
 if (b.name.toUpperCase() < a.name.toUpperCase()){
return -1;
 } else return 1;
 case 'Symbol':
 if (b.ticker.toUpperCase() < a.ticker.toUpperCase()){
return -1;
 } else return 1;
 case 'Open Price':
 return a.financeInfo.o - b.financeInfo.o;
 case 'Current Price':
 return a.financeInfo.c - b.financeInfo.c;
  case 'Grwoth':
 return a.financeInfo.g - b.financeInfo.g;
default:
  return 1;
}}
})
setSymbolsTable(sortedTable)
}; sortTable();
}, [toggleState])

  return (
    <div>
        <h1>Welcome to the Stock Investment Page</h1>
        <TableContainer>
          <Table>
        <TableHead>
          <TableRow>
        {HeadCells.map(cell => {
        return (
        <TableCell
        sortDirection={orderBy === cell ? order : false}
        >
        <TableSortLabel
        active={orderBy === cell}
        direction={orderBy === cell ? order : 'asc'}
        onClick={handleRequestSort(cell)}
        >
        {cell}
            </TableSortLabel>
        </TableCell>
        )})}


          </TableRow>
        {symbolsTable.map(e => {

        return (
<TableRow>
<TableCell>{e.name}</TableCell>
<TableCell>{e.ticker}</TableCell>
<TableCell>{e.financeInfo.o}</TableCell>
<TableCell>{e.financeInfo.c}</TableCell>
<TableCell>{e.financeInfo.g}</TableCell>
</TableRow>
        )
        
})}
        </TableHead>
        </Table>
        </TableContainer>
    </div>
  );
};
  
  export default Investments;

