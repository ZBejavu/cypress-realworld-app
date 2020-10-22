import React from 'react'
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Interpreter } from "xstate";

export interface Props {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>
    chartData: chartData
  }

  interface chartData {
    [index:number]:
    {date: string; 
    open: number; 
    close: number;
    high: number;
    low: number;
    uopen: number; 
    uclose: number;
    uhigh: number;
    ulow: number;
    change: number;
    label: string;
    changeOverTime: number;}
  }

const Chart: React.FC<Props> = ({ authService, chartData}) => {

      return (
        <div>
            <h1>my chart</h1>

        </div>
    )
}

export default Chart
