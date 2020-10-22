import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export interface UserSettingsProps {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
  }
  
const Investments: React.FC<UserSettingsProps> = ({authService}) => {
  const [symbolsTable, setSymbolsTable] = useState<symbols[]>([])
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const [orderBy, setOrderBy] = useState<'name'|'symbol'|'o'|'c'|'g'>('name');

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




const HeadCells = [
{id:'name', label: 'Name'},
{id:'ticker', label: 'Symbol'},
{id:'o', label: 'Open Price'},
{id:'c', label: 'Current Price'},
{id:'g', label:'Grwoth'}
]

const handleRequestSort = (property:any) => () => { 
const isAsc = orderBy === property && order === 'asc';
setOrder(isAsc ? 'desc' : 'asc');
setOrderBy(property);    
}


function descendingComparator(a:any, b:any, orderBy:string) {
  if (orderBy.length > 1 ? b[orderBy] < a[orderBy] : b['financeInfo'][orderBy] > a['financeInfo'][orderBy]) {
    return -1;
  }
  if (orderBy.length > 1 ? b[orderBy] > a[orderBy] : b['financeInfo'][orderBy] < a['financeInfo'][orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order:'asc'|'desc', orderBy:string) {
  return order === 'desc'
    ? (a:symbols, b:symbols) => descendingComparator(a, b, orderBy)
    : (a:symbols, b:symbols) => -descendingComparator(a, b, orderBy);
}

function sortSymbols(array:symbols[], comparator:any) {
  const sortedArray = array.map((el:any, index:any) => [el, index]);
  sortedArray.sort((a:any, b:any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return sortedArray.map((el:any) => el[0]);
}

  return (
    <div>
        <h1>Welcome to the Stock Investment Page</h1>
        <TableContainer>
          <Table>
        <TableHead>
          <TableRow>
        <TableCell>Action</TableCell>
        {HeadCells.map(cell => {
        return (
        <TableCell
        sortDirection={orderBy === cell.id ? order : false}
        >
        <TableSortLabel
        active={orderBy === cell.id}
        direction={orderBy === cell.id ? order : 'asc'}
        onClick={handleRequestSort(cell.id)}
        >
        {cell.label}
            </TableSortLabel>
        </TableCell>
        )})}


          </TableRow>
        {sortSymbols(symbolsTable, getComparator(order, orderBy)).map(e => {

        return (
<TableRow>
<TableCell>
<Button style={{fontSize:"14px"}} size="small" color="primary">Trade</Button>
</TableCell>
<TableCell>{e.name}</TableCell>
<TableCell>{e.ticker}</TableCell>
<TableCell>{e.financeInfo.o}</TableCell>
<TableCell>{e.financeInfo.c}</TableCell>
<TableCell
style={{color: e.financeInfo.c >= e.financeInfo.o ? 'green' : 'red'}}>
<i className={e.financeInfo.c >= e.financeInfo.o ? 'fas fa-caret-up' : 'fas fa-caret-down'}/>
{" "}{e.financeInfo.g}
</TableCell>
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

