import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { MonthlyTrends } from '@/assets/types'; // Ensure you import the correct type

type BarChartProps = {
  labels: Array<string>;  // Assign type to the props correctly
  data: Array<any>;  // Assign type to the props correctly
};

const BarChart: React.FC<BarChartProps> = ({ labels, data }) => {
  // Bar chart height will be proportional to the maximum expense/income value
  const adjustedData = data.map(value => value < 0 ? 1000    : value);
  
  const maxValue = Math.max(...adjustedData);
  // Create a render function for the individual bars
  const renderBar = ({ item, index }: { item: string; index: number }) => {
    const Height = (data[index] / maxValue) * 100; // Proportional height based on max value
     
    return (
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              height: Height,
              backgroundColor: 'green', 
            },
          ]}
        />
 
        <Text style={styles.label}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={labels}
        horizontal={true}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderBar}
        contentContainerStyle={styles.carousel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems:'center',
    justifyContent: 'flex-end',
    width: 50,
    marginRight:10,
  },
  bar: {
    width: 35,  
    borderRadius: 11,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    
  },
});

export default BarChart;
