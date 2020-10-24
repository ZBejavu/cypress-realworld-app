import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
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
  const transactionAverage = allTransactions!== undefined && allTransactions[0][0] !== 'initial' ? allTransactions.map((transactions:any) => transactions[2]) : [0];
  const data : ChartData =  {
    labels: labels, // array of values for x axis (strings)
    title: 'Total Transaction Amount', // title for the chart
    rawData: [
      {
        label: 'Amount',// name of the line (one or two words)
        backgroundColor: 'blue',//raw color
        borderColor: 'blue',//use the same as background color
        fill: false, // change the line chart
        data: dataProperty // array of values for Y axis (numbers)
      }
        // you can add as many object as you wand, each one will a different line with different color
    ]
  }
  const averageData : ChartData =  {
    labels: labels, // array of values for x axis (strings)
    title: 'Average amount per transaction', // title for the chart
    rawData: [
      {
        label: 'Average',// name of the line (one or two words)
        backgroundColor: 'red',//raw color
        borderColor: 'red',//use the same as background color
        fill: false, // change the line chart
        data: transactionAverage // array of values for Y axis (numbers)
      }
        // you can add as many object as you wand, each one will a different line with different color
    ]
  }

  return (
    <div>
      <h1>Welcome To The Manager Page</h1>
      {allUsers.map((user, i) => {
        return <div key={i}>{user.username}</div>;
      })}
    <div style={{display:'flex'}}>
      <Charts chartTypes={[0,1]} data = {data}/>
      <Charts chartTypes={[0,1]} data = {averageData}/>
    </div>
    </div>
  );
};

export default ManagerTab;