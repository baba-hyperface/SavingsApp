import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
export const DonutChart = ({ savingsData }) => {
  if (!savingsData || savingsData.length === 0) {
    return <div style={{fontSize: '20px', color: "#aaa", marginTop: "30px", marginLeft: "20px"}}>No savings plans available.</div>;
  }
  const activePots = savingsData.filter(item => item.potStatus); 
  if (activePots.length === 0) {
    return <div style={{fontSize: '20px', color: "#aaa", marginTop: "30px", marginLeft: "20px"}}>No saving plans available</div>;
  }
  const data = {
    labels: activePots.map((item) => item.potPurpose),  
    datasets: [
      {
        data: activePots.map((item) => item.currentBalance),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],  
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],  
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '7%', 
  };
  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Overall Savings Distribution</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};
