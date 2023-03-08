import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const ScatterChart = ({ chartData, options }) => {
  return (
    <div style={{ }}>
      <Scatter data={chartData} options={options}/>
    </div>
  );
};

export default ScatterChart;
