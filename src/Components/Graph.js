import Tag from "./Tag";
import NetworthNumber from "./NetworthNumber";

import React from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);


function Graph(props) {
  const historicNetworth = props.historicNetworth.map( hisEle => hisEle.get("networth"));
  
  const historicMonth = props.historicNetworth.map( hisEle => {
    return hisEle.get("date").getMonth() + 1 + "/" + hisEle.get("date").getFullYear()
  });
  
  historicNetworth.push(props.networth)

  // const currentDate = new Date()
  // const currentMonth = currentDate.getMonth() + 1
  // const currentYear = currentDate.getFullYear() 

  
  historicMonth.push("Networth");

  const primaryData = historicNetworth ;
  const labels = historicMonth;
  
  const data = {
    labels: labels,
    labelColor: "#18388C",
    datasets: [
      {
        label: "Networth",
        data: primaryData,
        borderWidth: 1.5, //line width
        backgroundColor: "#18388C",
        lineTension: 0.25, //rounding curves of line
        pointRadius: 3,
        // fill: true
      },
    ],
  };

  const options = {
    layout: {
      padding: 0,
    },
    responsive: true, //graph size
    borderColor: "#18388C", //The line color

    plugins: {
      legend: {
        display: false,
        labels: {
          padding: 5,
        },
      },
    },
  };

  return (
    <div
      className="card"
      style={{
        height: "100%",
        width: "100%",
        margin: "auto",
        padding: "70px 10px 10px 10px",
      }}
    >
      <div
        name="graph text"
        style={{ position: "absolute", top: "10px", left: "70px" }}
      >
        <Tag text="Networth" />
        <NetworthNumber value={props.networth} />
      </div>
      <Chart type="line" data={data} options={options} style={{ bottom: 0 }} />
    </div>
  );
}

export default Graph;
