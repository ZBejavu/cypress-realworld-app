
import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { httpClient } from "../utils/asyncUtils";
import Charts from "../charts/Charts";
import { ChartData } from "../charts/ChartsInterface";


const data : ChartData = {
  labels: ['January', 'February', 'March','April', 'May'], // array of values for x axis (strings)
  title: 'test', // title for the chart
  rawData: [
    {
      label: 'data1',// name of the line (one or two words)
      backgroundColor: 'red',//raw color
      borderColor: 'red',//use the same as background color
      fill: false, // change the line chart
      data: [65, 59, 80, 81, 56], // array of values for Y axis (numbers)
    },
    {
      label: 'data2',// name of the line (one or two words)
      backgroundColor: 'green',//raw color
      borderColor: 'green',//use the same as background color
      fill: false, // change the line chart
      data: [25, 55, 90, 81, 16], // array of values for Y axis (numbers)
    }
      // you can add as many object as you wand, each one will a different line with different color
  ]
}

export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const ManagerTab: React.FC<UserSettingsProps> = ({ authService }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const users = await httpClient.get("http://localhost:3001/users/all");
    console.log(users.data.results);
    setAllUsers(users.data.results);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Welcome To The Manager Page</h1>
      {allUsers.map((user, i) => {
        return <div key={i}>{user.username}</div>;
      })}

      <Charts chartTypes={[0,1]} data = {data}/>
    </div>
  );
};

export default ManagerTab;
