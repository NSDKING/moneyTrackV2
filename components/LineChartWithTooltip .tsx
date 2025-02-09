import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

 


const LineChartWithTooltip = ({ monthlyTrends }) => {
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  const data = {
    labels: monthlyTrends.labels,
    datasets: [
      {
        data: monthlyTrends.expenses,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for expenses
        strokeWidth: 3, // Adjust line thickness
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        data: monthlyTrends.income,
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for income
        strokeWidth: 3, // Adjust line thickness
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <View>
  <LineChart
              data={{
                  labels: monthlyTrends.labels,
                  datasets: [
                      {
                          data: monthlyTrends.expenses,
                          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for expenses
                          strokeWidth: 3, // Adjust line thickness
                          // Add point styles
                          pointRadius: 5,
                          pointHoverRadius: 7,
                      },
                      {
                          data: monthlyTrends.income,
                          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for income
                          strokeWidth: 3, // Adjust line thickness
                          // Add point styles
                          pointRadius: 5,
                          pointHoverRadius: 7,
                      },
                  ],
              }}
              width={width - 40}
              height={220}
              chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                      borderRadius: 16,
                  },
                  propsForDots: {
                      r: "6", // Radius of the dots
                      strokeWidth: "2", // Stroke width of the dots
                      stroke: "#fff", // Stroke color of the dots
                  },
                  // Add grid lines
                  propsForHorizontalLines: {
                      strokeDasharray: "", // Solid lines
                      stroke: "#e0e0e0", // Light gray for grid lines
                  },
              }}
              bezier
              style={styles.chart}
          />
   
    </View>
  );
};


export default LineChartWithTooltip;
 
