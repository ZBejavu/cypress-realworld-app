import React from "react";
import { Button, Grid } from "@material-ui/core";
import { User } from "../models";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";

export interface UserSettingsProps {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
  }
  
  const ManagerTab: React.FC<UserSettingsProps> = ({authService}) => {
  
    return (
     <div>
         <h1>Welcome To The Manager Page</h1>
     </div>
    );
  };
  
  export default ManagerTab;