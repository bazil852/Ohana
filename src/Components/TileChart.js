import ReactApexChart from "react-apexcharts";
import React, { useState } from "react";

const TileChart = () => {
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        data: [
          {
            x: "BTC",
            y: 6.2,
          },
          {
            x: "ETH",
            y: 0.4,
          },
          {
            x: "ADA",
            y: -1.4,
          },
          {
            x: "BNB",
            y: 2.7,
          },
          {
            x: "USDT",
            y: -0.3,
          },
          {
            x: "ONE",
            y: 5.1,
          },
          {
            x: "ALGO",
            y: -2.3,
          },
          {
            x: "DOGE",
            y: 2.1,
          },
          {
            x: "BUSD",
            y: 0.3,
          },
        ],
      },
    ],

    legend: {
      show: false,
    },
    chart: {
      type: "treemap",
      width: "100%",  // Take full width of the page
      height: "100%", // Adjust based on your page height
    },
    title: {
      text: "Points Heatmap",
      align: 'center',
      style: {
        fontSize: '24px',
        color: 'white',  // For dark theme, keep text white
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ['#fff'],  // White for better contrast on dark backgrounds
      },
      formatter: function (text, op) {
        return [text, op.value];
      },
      offsetY: -4,
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        colorScale: {
          ranges: [
            {
              from: -6,
              to: 0,
              color: "rgba(255, 111, 97, 0.6)",  // Semi-transparent red for less eco-friendly tokens
              name: 'Less eco-friendly',
            },
            {
              from: 0.001,
              to: 6,
              color: "rgba(72, 205, 129, 0.6)",  // Semi-transparent green for eco-friendly tokens
              name: 'Eco-friendly',
            },
          ],
        },
      },
    },
    tooltip: {
      theme: 'dark',  // Tooltip is dark-themed to match the overall style
    },
  });

  const [chartSeries] = useState(chartOptions.series);

  return (
    <div style={{ width: '100%',height:"100vh", backgroundColor: 'transparent' }}>  {/* Dark background for the chart */}
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="treemap"
        height="50%" // Adjust height to take full screen or container
        width="50%"  // Full page width
      />
    </div>
  );
};

export default TileChart;
