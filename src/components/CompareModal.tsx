import React from 'react';
import Charts from '../charts/Charts';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import { ChartData } from "./ChartsInterface";
// import { State } from "./ChartsInterface";

interface FinanceDataChart {
    name: string;
    chart: any[]
}

interface Props {
    companyToCompare: FinanceDataChart[];
    openModal: boolean;

}

let colors: string[] = ['red', 'blue', 'green', 'yellow', 'pink', 'brown', 'orange', 'violet', 'maroon', 'cyan'];

const useStyles = makeStyles((theme) => ({
    root: {
        height: 800,
        flexGrow: 1,
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
        width: '80vw',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const CompareModal: React.FC<Props> = ({ companyToCompare, openModal }) => {
    const classes = useStyles();

    const rawData = companyToCompare.map((company, i) => {
        return (
            {
                label: company.name,// name of the line (one or two words)
                backgroundColor: colors[i],//raw color
                borderColor: colors[i],//use the same as background color
                fill: false, // change the line chart
                data: company.chart.map(chart => chart.close),
            }
        )
    })

    const dates = companyToCompare[0] && companyToCompare[0].chart.map(chart => chart.date)

    const data = {
        labels: dates, // array of values for x axis (strings)
        title: 'Stocks Comparison', // title for the chart
        rawData: rawData
    }

    return (
        <div>
            <Modal
                // disablePortal
                // disableEnforceFocus
                // disableAutoFocus
                open={openModal}
                // onClose = {handleClose}
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={classes.modal}
            >
                <div className={classes.paper}>
                    <Charts chartTypes={[0,1]} data={data} />
                </div>
            </Modal>
        </div>
    );
}

export default CompareModal;

