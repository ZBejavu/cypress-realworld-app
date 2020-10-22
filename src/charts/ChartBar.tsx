import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData } from "./ChartsInterface";
import { State } from "./ChartsInterface";

interface Props {
  data: ChartData
}

const ChartBar: React.FC<Props> = ({ data }) => {
console.log(data);

  const state : State = {
    labels: data.labels,
    datasets: data.rawData
  }
  return (
    <>
      <Bar
        data={state}
        options={{
          title: {
            display: true,
            text: data.title,
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </>
  );
}

export default ChartBar;