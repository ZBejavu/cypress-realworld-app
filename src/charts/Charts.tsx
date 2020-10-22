
import React, { useState } from 'react';
import ChartBar from './ChartBar';
import ChartLine from './ChartLine';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TimelineIcon from '@material-ui/icons/Timeline';
import './charts.css';
import { ChartData } from './ChartsInterface';

interface Props {
    chartTypes: number[];
    data: ChartData;
}

interface ChartsData {
    Line:ChartData;
    Bar:ChartData; 
}

const Charts: React.FC<Props> = ({ chartTypes, data }) => {
    const [chartType, setChartType] = useState<number>(chartTypes[0])

    const chartsData : ChartsData = {
        Line: data,
        Bar: data,
    }

    function selectChart() {
        switch (chartType) {
            case 0:
                return <ChartBar data={chartsData.Bar} />
            case 1:
                return <ChartLine data={chartsData.Line} />
            default:
                return <ChartBar data={chartsData.Bar} />
        }
    }

    return (
        <div className="chartComponent">
            <div className="chart">
                {
                    selectChart()
                }
            </div>
            {
                typeof chartTypes !== 'number' &&
                <BottomNavigation
                    value={chartType}
                    onChange={(event, newValue) => {
                        setChartType(newValue);
                    }}
                    showLabels
                    className={'chartNavBar'}
                >
                    {
                        (chartTypes.includes(0) && chartTypes.length > 1) &&
                        <BottomNavigationAction label="Bar" icon={<EqualizerIcon />} />
                    }
                    {
                        (chartTypes.includes(1) && chartTypes.length > 1) &&
                        <BottomNavigationAction label="Line" icon={<TimelineIcon />} />
                    }
                </BottomNavigation>
            }
        </div>
    );
}

export default Charts;