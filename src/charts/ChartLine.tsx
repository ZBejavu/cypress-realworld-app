import React from 'react';
import {Line} from 'react-chartjs-2';
import { ChartData } from "./ChartsInterface";
import { State } from "./ChartsInterface";

interface Props {
  data: ChartData
}

const ChartLine: React.FC<Props> = ({ data }) => {
    const state: State = {
        labels: data.labels ,
        datasets: data.rawData
      }

    return(
      <div>
        <Line
          data={state}
          options={{
            title:{
              display:true,
              text:data.title,
              fontSize:20
            },
            legend:{
              display:true,
              backgroundColor: 'rgba(75,192,192,1)',
              position:'right'
            }
          }}
        />
      </div>
    )
}

export default ChartLine;