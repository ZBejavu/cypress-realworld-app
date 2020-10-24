import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Table , TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";
import { User, Transaction} from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { httpClient } from "../utils/asyncUtils";
import Charts from "../charts/Charts";
import { ChartData } from "../charts/ChartsInterface";


export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}
//type transactionData = [string, number];

const ManagerTab: React.FC<UserSettingsProps> = ({ authService }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTransactions, setAllTransactions] = useState<any>([[]]);
  const fetchUsers = async () => {
    const users = await httpClient.get("http://localhost:3001/users/all");
    const transactions = await httpClient.get("http://localhost:3001/manager/allYearsTransactions"); 
    console.log('users',users.data.results);
    setAllUsers(users.data.results);
    console.log('transactions',transactions.data.results);
    setAllTransactions(transactions.data.results);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const dataProperty = allTransactions!== undefined && allTransactions[0][0] !== 'initial' ? allTransactions.reverse().map((transactions:any) => transactions[1]) : [0];
  const labels = allTransactions!== undefined && allTransactions[0][0] !== 'initial' ? allTransactions.map((transactions:any) => transactions[0]) : ['label'];
  const data : ChartData =  {
    labels: labels, // array of values for x axis (strings)
    title: 'Transactions per Month', // title for the chart
    rawData: [
      {
        label: 'amount',// name of the line (one or two words)
        backgroundColor: 'blue',//raw color
        borderColor: 'blue',//use the same as background color
        fill: false, // change the line chart
        data: dataProperty // array of values for Y axis (numbers)
      },
        // you can add as many object as you wand, each one will a different line with different color
    ]
  }
  
  const usersName : string[] = allUsers !== undefined ? allUsers.map((user:User) => `${user.firstName} ${user.lastName}`) : [''];
  const usersBalance : number[] = allUsers !== undefined ? allUsers.map((user:User) => user.balance) : [0] ; 

  const usersData : ChartData =  {
    labels: usersName, // array of values for x axis (strings)
    title: 'Users Balance', // title for the chart
    rawData: [
      {
        label: 'amount',// name of the line (one or two words)
        backgroundColor: 'green',//raw color
        borderColor: 'black',//use the same as background color
        fill: false, // change the line chart
        data: usersBalance // array of values for Y axis (numbers)
      },
        // you can add as many object as you wand, each one will a different line with different color
    ]
  }
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();

  return (
    <div>
      <h1>Welcome To The Manager Page</h1>
      <div>
        <Charts chartTypes={[0,1]} data = {data}/>
      </div>
      <br/>
      <div>
        <Charts chartTypes={[0]} data = {usersData}/>
      </div>
      <br/>

      <h3>Users Details</h3>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allUsers.map((user) => (
            <TableRow key={user.firstName}>
              <TableCell component="th" scope="row">
              {`${user.firstName} ${user.lastName}`}
              </TableCell>
              <TableCell align="right">{user.phoneNumber}</TableCell>
              <TableCell align="right">{user.email}</TableCell>
              <TableCell align="right">{user.username}</TableCell>
              <TableCell align="right">{user.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default ManagerTab;