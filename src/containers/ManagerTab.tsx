
import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { httpClient } from "../utils/asyncUtils";


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
    </div>
  );
};

export default ManagerTab;
