import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton, MenuItem, Select } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Link as RouterLink, useRouteMatch, Route } from "react-router-dom";
import CompareModal from '../components/CompareModal';


export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const Investments: React.FC<UserSettingsProps> = ({ authService }) => {
  const [financeDataTable, setFinanceDataTable] = useState<FinanceData[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<
    "symbol" | "companyName" | "iexRealtimePrice" | "previousClose" | "growth"
  >("companyName");
  const [companyLastMonthStock, setCompanyLastMonthStock] = useState<FinanceDataChart[]>([]);
  const [companyToCompare, setCompanyToCompare] = useState<FinanceDataChart[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, SetSearch] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false)

  let match = useRouteMatch();

  console.log("CompanyToCompare", companyToCompare);

  /* Represents the information we want to display in the table below */
  interface FinanceData {
    symbol: string;
    companyName: string;
    iexRealtimePrice: number;
    latestPrice: number;
    previousClose: number;
    growth: number;
    isUSMarketOpen: boolean;
  }

  interface FinanceDataChart {
    name: string;
    chart: any[]
  }

  // console.log("api", process.env.API_KEY);

  const fetchData = async () => {
    let dataTable: FinanceData[] = [];
    let chartsData: FinanceDataChart[] = [];
    const { data } = await axios.get(
    `http://localhost:3001/investments/stocks`
    );
    console.log(data);
    
    /* data gets us the "quote" object requested from the api. "...batch?types=quote..." */
    for (let stock of data) {
      /* Destructuring the actual information from the api and updating the table */
      let { symbol, companyName, iexRealtimePrice, previousClose, latestPrice, isUSMarketOpen }: FinanceData = stock.quote;
      let growth: number = Number((isUSMarketOpen ? iexRealtimePrice : latestPrice / previousClose * 100 - 100).toFixed(3));
      dataTable.push({ symbol, companyName, iexRealtimePrice, previousClose, growth, latestPrice, isUSMarketOpen });
    }
    for (let stock of data) {
      let object : FinanceDataChart = {
        name: stock.quote.companyName,
        chart: stock.chart
      }
      chartsData.push(object);
    }
    setFinanceDataTable(dataTable);
    setCompanyLastMonthStock(chartsData);
  };

  // console.log(financeDataTable);

  /* Should be replaced using a 'webhook' - currently sends the above GET request every 6 seconds */
  useEffect(() => {
    fetchData();
    const financeInterval: NodeJS.Timeout = setInterval(fetchData, 600000);
    return () => clearInterval(financeInterval);
  }, []);

  const HeadCells = [
    { id: "symbol", label: "Symbol" },
    { id: "companyName", label: "Name" },
    { id: "previousClose", label: "Previous Close" },
    { id: "iexRealtimePrice", label: "Current Price" },
    { id: "growth", label: "Grwoth" },
  ];

  const handleRequestSort = (property: any) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(a: any, b: any, orderBy: string) {
    if (b[orderBy] > a[orderBy]) {
      return -1;
    }
    if (b[orderBy] < a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order: "asc" | "desc", orderBy: string) {
    return order === "desc"
      ? (a: FinanceData, b: FinanceData) => descendingComparator(a, b, orderBy)
      : (a: FinanceData, b: FinanceData) => -descendingComparator(a, b, orderBy);
  }

  function sortFinanceData(array: FinanceData[], comparator: any) {
    const sortedArray = array.map((el: any, index: any) => [el, index]);
    sortedArray.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return sortedArray.map((el: any) => el[0]);
  }

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

    const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <div>
      <h1>Welcome to the Stock Investment Page</h1>
      <input onChange={(event) => SetSearch(event.target.value)} placeholder="search symbol"/>
      <RouterLink to={`${match.url}/${search}`}>
         <button>
            Search
         </button>
      </RouterLink>
      <TableContainer>
        <Table size="small" style={{ border: "1px solid #DDDDDD" }}>
          <TableHead>
            <TableRow style={{ background: "#f1f1f1" }}>
              <TableCell>Action</TableCell>
              {HeadCells.map((cell) => {
                return (
                  <TableCell key={cell.id} sortDirection={orderBy === cell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === cell.id}
                      direction={orderBy === cell.id ? order : "asc"}
                      onClick={handleRequestSort(cell.id)}
                    >
                      {cell.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
            {sortFinanceData(financeDataTable, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((e) => {
              return (
                <TableRow style={{ background: "white" }}>
                  <TableCell>
                    <RouterLink to={`${match.url}/${e.symbol}`}>
                    <Button style={{ fontSize: "14px" }} size="small" color="primary">
                      Trade
                    </Button>
                    </RouterLink>
                  </TableCell>
                  <TableCell>{e.symbol}</TableCell>
                  <TableCell>{e.companyName}</TableCell>
                  <TableCell>{e.previousClose}</TableCell>
                  <TableCell>{e.isUSMarketOpen ? e.iexRealtimePrice : e.latestPrice + ' - Closed'}</TableCell>
                  <TableCell
                    style={{
                      color:
                        e.isUSMarketOpen ? e.iexRealtimePrice : e.latestPrice > e.previousClose
                          ? "green"
                          : e.isUSMarketOpen ? e.iexRealtimePrice : e.latestPrice < e.previousClose
                          ? "red"
                          : "black",
                    }}
                  >
                    <i
                      className={
                        e.isUSMarketOpen ? e.iexRealtimePrice : e.latestPrice > e.previousClose
                          ? "fas fa-caret-up"
                          : e.isUSMarketOpen ? e.iexRealtimePrice : e.latestPrice < e.previousClose
                          ? "fas fa-caret-down"
                          : ""
                      }
                    />{" "}
                    {e.growth}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableHead>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={financeDataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      <h2>Compare last month companies stocks</h2>
      <select
        multiple
        size = {10}
      >
        {companyLastMonthStock.map((object) => (
          <option
            key={object.name}
            value={object.name}
            onClick={() => setCompanyToCompare([...companyToCompare, object])}
          >
            {object.name}
          </option>
        ))}
      </select>
      {
        companyToCompare[0] && companyToCompare.map(company=>{
          return(
          <label> {`${company.name} `} </label>
          )
        })
      }
      {
        companyToCompare[0] && <button onClick={()=>setOpenModal(true)}>Compare</button>
      }
      {
        companyToCompare[0] && <CompareModal companyToCompare={companyToCompare} setCompanyToCompare={setCompanyToCompare} openModal={openModal} setOpenModal={setOpenModal} />
      }
    </div>
  );
};

export default Investments;
