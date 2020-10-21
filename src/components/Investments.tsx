import React from "react";
import { Button, Grid } from "@material-ui/core";
import { User } from "../models";

export interface UserSettingsProps {
    userProfile: User;
    updateUser: Function;
  }
  
  const Investments: React.FC<UserSettingsProps> = ({ userProfile, updateUser }) => {
  
    return (
     <div>
         <h1>Hello Investor</h1>
     </div>
    );
  };
  
  export default Investments;