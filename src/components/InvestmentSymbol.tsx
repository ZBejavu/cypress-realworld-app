
import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton } from "@material-ui/core";
import { User } from "../models";
import {
  useParams
} from "react-router-dom";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import axios from "axios";

export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const InvestmentSymbol: React.FC<UserSettingsProps> = ({ authService }) => {
const [symbolData, setSymbolData] = useState(null)

let tickerId = useParams()

useEffect(() => {
  const fetchData = async () => {
    const { data } = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${tickerId}/batch?types=quote&token=pk_5f8efe0e7fa24952b30e15e2ec890afe`
    );
      setSymbolData(data);
    };
    fetchData();
}, [])


  return (
 <div>hi</div>
  );
};

export default InvestmentSymbol;