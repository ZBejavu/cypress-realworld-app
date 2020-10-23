import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton, MenuItem, Select } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Link as RouterLink, useRouteMatch, Route } from "react-router-dom";

export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const Investments: React.FC<UserSettingsProps> = ({ authService }) => {
  const [financeDataTable, setFinanceDataTable] = useState<FinanceData[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<
    "symbol" | "companyName" | "iexRealtimePrice" | "previousClose" | "growth"
  >("companyName");
  const [companyToCompare, setCompanyToCompare] = useState<string[]>([]);

  console.log("CompanyToCompare", companyToCompare);

  /* Represents the information we want to display in the table below */
  interface FinanceData {
    symbol: string;
    companyName: string;
    iexRealtimePrice: number;
    previousClose: number;
    growth: number;
  }

  // console.log("api", process.env.API_KEY);

  const fetchData = async () => {
    let dataTable: FinanceData[] = [];
    const { data } = await axios.get(
      `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&token=pk_d9db58af65374520ace4898a24532312&symbols=TSLA,MCD,AMZN,FB,AAPL,UAL,INTC,Pins,NFLX,RCL`
    );
    /* data gets us the "quote" object requested from the api. "...batch?types=quote..." */
    for (const [key, value] of Object.entries<any>(data)) {
      /* Destructuring the actual information from the api and updating the table */
      let { symbol, companyName, iexRealtimePrice, previousClose }: FinanceData = value.quote;
      let growth: number = Number((iexRealtimePrice / previousClose).toFixed(3));
      dataTable.push({ symbol, companyName, iexRealtimePrice, previousClose, growth });
    }
    setFinanceDataTable(dataTable);
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

  return (
    <div>
      <h1>Welcome to the Stock Investment Page</h1>
      <select
        multiple
        value={companyToCompare}
      >
        {HeadCells.map((object) => (
          <option
            key={object.id}
            value={object.label}
            onClick={(e) => setCompanyToCompare([...companyToCompare, object.label])}
          >
            {object.label}
          </option>
          // <MenuItem key={company.symbol} value={company.companyName}>
          //   {company.companyName}
          // </MenuItem>
        ))}
      </select>
      <button>Compare</button>
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
            {sortFinanceData(financeDataTable, getComparator(order, orderBy)).map((e) => {
              return (
                <TableRow style={{ background: "white" }}>
                  <TableCell>
                    <RouterLink>
                    <Button style={{ fontSize: "14px" }} size="small" color="primary">
                      Trade
                    </Button>
                    </RouterLink>
                  </TableCell>
                  <TableCell>{e.companyName}</TableCell>
                  <TableCell>{e.symbol}</TableCell>
                  <TableCell>{e.previousClose}</TableCell>
                  <TableCell>{e.iexRealtimePrice}</TableCell>
                  <TableCell
                    style={{
                      color:
                        e.iexRealtimePrice > e.previousClose
                          ? "green"
                          : e.iexRealtimePrice < e.previousClose
                          ? "red"
                          : "black",
                    }}
                  >
                    <i
                      className={
                        e.iexRealtimePrice > e.previousClose
                          ? "fas fa-caret-up"
                          : e.iexRealtimePrice < e.previousClose
                          ? "fas fa-caret-down"
                          : ""
                      }
                    />{" "}
                    {e.growth}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableHead>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Investments;
