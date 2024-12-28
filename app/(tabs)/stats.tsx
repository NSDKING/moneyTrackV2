import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sample data - replace with your actual data
const monthlyData = {
  income: 1500000,
  expenses: 900000,
  netBalance: 600000,
  budget: 1200000, // Current budget
  categories: [
    { name: 'Food', amount: 300000, color: '#FF6B6B', icon: 'restaurant' },
    { name: 'Transport', amount: 200000, color: '#4ECDC4', icon: 'car' },
    { name: 'Shopping', amount: 250000, color: '#45B7D1', icon: 'cart' },
    { name: 'Bills', amount: 150000, color: '#96CEB4', icon: 'receipt' },
  ],
  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    expenses: [800000, 850000, 900000, 850000, 900000, 950000],
    income: [1200000, 1300000, 1400000, 1450000, 1500000, 1500000],
  },
};

export default function ReportsScreen() {
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState(monthlyData.budget.toString());

  const handleBudgetUpdate = () => {
    const budgetValue = parseFloat(newBudget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }
    monthlyData.budget = budgetValue; // Update the budget
    setIsBudgetModalVisible(false);
    setNewBudget(budgetValue.toString());
  };

  return (
    <ScrollView style={styles.container}>
      {/* Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewCards}>
          <View style={[styles.overviewCard, { backgroundColor: Colors.lightGreen }]}>
            <Text style={styles.overviewLabel}>Income</Text>
            <Text style={styles.overviewAmount}>₦{monthlyData.income.toLocaleString()}</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: Colors.lightRed }]}>
            <Text style={styles.overviewLabel}>Expenses</Text>
            <Text style={styles.overviewAmount}>₦{monthlyData.expenses.toLocaleString()}</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: Colors.lightBlue }]}>
            <Text style={styles.overviewLabel}>Net Balance</Text>
            <Text style={styles.overviewAmount}>₦{monthlyData.netBalance.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Budget Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget</Text>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Current Budget: ₦{monthlyData.budget.toLocaleString()}</Text>
          <TouchableOpacity
            style={styles.editBudgetButton}
            onPress={() => setIsBudgetModalVisible(true)}
          >
            <Text style={styles.editBudgetButtonText}>Edit Budget</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trends Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income vs Expenses Trend</Text>
        <LineChart
          data={{
            labels: monthlyData.trends.labels,
            datasets: [
              {
                data: monthlyData.trends.expenses,
                color: () => Colors.BrightRed,
              },
              {
                data: monthlyData.trends.income,
                color: () => Colors.green,
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
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.categoriesList}>
          {monthlyData.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={`${category.icon}-outline`} size={24} color="white" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>
                  ₦{category.amount.toLocaleString()}
                </Text>
              </View>
              <Text style={styles.categoryPercentage}>
                {Math.round((category.amount / monthlyData.expenses) * 100)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Budget Edit Modal */}
      <Modal visible={isBudgetModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Budget</Text>
            <TextInput
              style={styles.modalInput}
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="numeric"
              placeholder="Enter new budget"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleBudgetUpdate}>
              <Text style={styles.modalButtonText}>Update Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsBudgetModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: Colors.CharcoalGray,
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  overviewCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: Colors.CharcoalGray,
  },
  overviewAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.CharcoalGray,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.CharcoalGray,
  },
  editBudgetButton: {
    backgroundColor: Colors.BrightRed,
    padding: 10,
    borderRadius: 8,
  },
  editBudgetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoriesList: {
    gap: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.CharcoalGray,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.CharcoalGray,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.CharcoalGray,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: 300,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: Colors.BrightRed,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
