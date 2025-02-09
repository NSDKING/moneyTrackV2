datasets: [
    {
        data: monthlyTrends.expenses,
        color: (opacity = 1) => rgba(255, 0, 0, ${opacity}), // Red for expenses
        strokeWidth: 3, // Adjust line thickness
        // Add point styles
        pointRadius: 5,
        pointHoverRadius: 7,
    },
    {
        data: monthlyTrends.income,
        color: (opacity = 1) => rgba(0, 255, 0, ${opacity}), // Green for income
        strokeWidth: 3, // Adjust line thickness
        // Add point styles
        pointRadius: 5,
        pointHoverRadius: 7,
    },
],

const data = {
    labels: monthlyTrends.labels,
    datasets: [
        {
            data: monthlyTrends.expenses,
            color: (opacity = 1) => rgba(255, 0, 0, ${opacity}), // Red for expenses
            strokeWidth: 3, // Adjust line thickness
            // Add point styles
            pointRadius: 5,
            pointHoverRadius: 7,
        },
        {
            data: monthlyTrends.income,
            color: (opacity = 1) => rgba(0, 255, 0, ${opacity}), // Green for income
            strokeWidth: 3, // Adjust line thickness
            // Add point styles
            pointRadius: 5,
            pointHoverRadius: 7,
        },
    ],
  };