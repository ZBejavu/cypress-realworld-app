import React, { useState } from 'react'
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Interpreter } from "xstate";
import Charts from '../charts/Charts';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minHeight: 800,
        minWidth: 800,
        transform: 'translateZ(0)',
        // The position fixed scoping doesn't work in IE 11.
        // Disable this demo to preserve the others.
        '@media all and (-ms-high-contrast: none)': {
            display: 'none',
        },
    },
    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: '45vw',
        height: '55vh',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


export interface Props {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>
    chartData: any[]
  }

  interface chartData {
    date: string; 
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
    changeOverTime: number;
  }

let colors: string[] = ['red', 'blue', 'green', 'yellow', 'pink', 'brown', 'orange', 'violet', 'maroon', 'cyan','purple','black'];

const Chart: React.FC<Props> = ({ authService, chartData}) => {
const [days, setDays] = useState<number>(30)
const classes = useStyles();


    const rawData = chartData
    .slice(chartData.length-1 - days, days)
    .map((day, i) => {
        return (
            {
                label: day.date,// name of the line (one or two words)
                backgroundColor: colors[i],//raw color
                borderColor: 'black',//use the same as background color
                fill: false, // change the line chart
                data: chartData.slice(chartData.length-1 - days, days).map(day => day.close )
            }
        )
    })

    const dates = rawData && rawData.map(day => day.label)

    const data = {
        labels: dates, //dates, // array of values for x axis (strings)
        title: 'Stocks - Close Prices', // title for the chart
        rawData: rawData
    }


      return (
        <div>
            <div className={classes.paper}>
            <Charts chartTypes={[0,1]} data={data} />
            </div>
        </div>
    )
}

export default Chart
