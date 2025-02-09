import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { Category, Transaction } from '@/assets/types';
 
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

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};


export default function ReportsScreen() {
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState(monthlyData.budget.toString());
  const [categorySummary, setCategorySummary] = useState<{ [key: string]: { totalAmount: number; color: string; icon: string } }>({});  
  const [monthlyTrends, setMonthlyTrends] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    expenses: new Array(12).fill(0),
    income: new Array(12).fill(0),
});  const {  transactions, categories } = useAppContext();


    // Function to format the amount
    const formatAmount = (amount: number): string => {
      if (amount === 0) return "0"; // Handle zero case
      const absAmount = Math.abs(amount);
      const formattedAmount = (absAmount / 1000).toFixed(0); // Divide by 1000 and round to nearest integer
      return `${formattedAmount}K`; // Append 'K' for thousands
  };

  
  const monthlyExpense = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January, 11 = December)
      const currentYear = currentDate.getFullYear();
          // Filter transactions to include only expenses from the current month
      const monthlyExpenses = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.transaction_date); // Assuming transaction_date is in a valid format
          return (
              transaction.type === 'withdrawal' && // Assuming 'withdrawal' indicates an expense
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
          );
          });
      // Calculate the total monthly expenses
      const totalMonthlyExpense = monthlyExpenses.reduce((accumulator, transaction) => {
          let amount = transaction.amount;

          // Check if amount is defined and is a string
          if (typeof amount === 'string') {
              return accumulator + parseFloat(amount.replace(/,/g, '')); // Remove commas and convert to float
          } else if (typeof amount === 'number') {
              return accumulator + amount; // If it's already a number, just add it
          } else {
              console.warn(`Invalid amount for transaction: ${JSON.stringify(transaction)}`); // Log the invalid transaction
              return accumulator; // Skip this transaction
          }
      }, 0);

      // Format the total monthly expense
      return formatAmount(totalMonthlyExpense);
  };

  const getBalance = () => {
    if (transactions.length === 0) {
        return 0;
    } else {
        const justTransaction = transactions.filter(transaction => transaction.type !== 'transfer'); 

        const totalBalance = justTransaction.reduce((accumulator, transaction) => {
            const amount = transaction.amount ? String(transaction.amount).replace(/,/g, '') : '0';
            return accumulator + parseFloat(amount);
        }, 0);

        return totalBalance;
    }
  };

  const monthlyIncome = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January, 11 = December)
    const currentYear = currentDate.getFullYear();

    // Filter transactions to include only income from the current month
    const monthlyIncomes = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date); // Assuming transaction_date is in a valid format
        return (
            transaction.type === 'deposit' && // Assuming 'deposit' indicates an income
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );
    });

    // Calculate the total monthly income
    const totalMonthlyIncome = monthlyIncomes.reduce((accumulator, transaction) => {
        // Check if transaction.amount is defined and is a string
        const amount = transaction.amount;
        if (typeof amount === 'string') {
            return accumulator + parseFloat(amount.replace(/,/g, '')); // Remove commas and convert to float
        } else if (typeof amount === 'number') {
            return accumulator + amount; // If it's already a number, just add it
        } else {
            console.warn(`Invalid amount for transaction: ${JSON.stringify(transaction)}`); // Log the invalid transaction
            return accumulator; // Skip this transaction
        }
    }, 0);

    // Format the total monthly income
    return formatAmount(totalMonthlyIncome);
  };

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

  const categorizeTransactions = (transactions: Array<Transaction>, categories: Array<Category>) => {
    // Initialize an object to hold the categorized data
    const categorizedData: { [key: string]: { totalAmount: number; color: string; icon: string } } = {};

    // Iterate through each transaction
    transactions.forEach(transaction => {
        const categoryId = transaction.category_id; // Assuming each transaction has a category_id
        const amount = parseFloat(transaction.amount); // Convert amount to a number

        // Find the category details using the category ID
        const category = categories.find(cat => cat.ID === categoryId);

        if (category) {
            // If the category is found, initialize or update the categorized data
            if (!categorizedData[category.name]) {
                categorizedData[category.name] = {
                    totalAmount: 0,
                    color: category.color, // Assuming category has a color property
                    icon: category.icon,   // Assuming category has an icon property
                };
            }

            // Update the total amount for the category
            categorizedData[category.name].totalAmount += amount;
        }
    });

    setCategorySummary(categorizedData);
  };

  const calculateMonthlyTrends = (transactions: Array<Transaction>) => {
    // Initialize an array to hold the total income and expenses for each month
    const monthlyTrends = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        expenses: new Array(12).fill(0), // Initialize expenses for each month
        income: new Array(12).fill(0),    // Initialize income for each month
    };

    // Iterate through each transaction
    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.transaction_date); // Assuming transaction_date is in a valid format
        const month = transactionDate.getMonth(); // Get the month (0-indexed)

        // Check the type of transaction and update the corresponding monthly total
        if (transaction.type === 'withdrawal') { // Assuming 'withdrawal' indicates an expense
            const amount = (transaction.amount); // Convert amount to a number
            monthlyTrends.expenses[month] += amount; // Add to the corresponding month's expenses
        } else if (transaction.type === 'deposit') { // Assuming 'deposit' indicates income
            const amount = (transaction.amount); // Convert amount to a number
            monthlyTrends.income[month] += amount; // Add to the corresponding month's income
        }
    });

    return monthlyTrends;
};

useEffect(() => {
  const trends = calculateMonthlyTrends(transactions);
  setMonthlyTrends(trends);
  categorizeTransactions(transactions,categories);
  console.log(categories)


}, [transactions])

  return (
    <ScrollView style={styles.container}>
      {/* Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewCards}>
          <View style={[styles.overviewCard, { backgroundColor: Colors.lightGreen }]}>
            <Text style={styles.overviewLabel}>Income</Text>
            <Text style={styles.overviewAmount}>F{monthlyIncome().toLocaleString()}</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: Colors.lightRed }]}>
            <Text style={styles.overviewLabel}>Expenses</Text>
            <Text style={styles.overviewAmount}>F  {monthlyExpense().toLocaleString()}</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: Colors.lightBlue }]}>
            <Text style={styles.overviewLabel}>Net Balance</Text>
            <Text style={styles.overviewAmount}>F  {monthlyData.netBalance.toLocaleString()}</Text>
          </View>
        </View>
      </View>



      {/* Trends Chart */}
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income vs Expenses Trend</Text>
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

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.categoriesList}>
            {Object.entries(categorySummary).length > 0 ? (
                Object.entries(categorySummary).map(([categoryName, data], index) => (
                    <View key={index} style={styles.categoryItem}>
                        <View style={[styles.categoryIcon, { backgroundColor: data.color }]}>
                            <Ionicons name={data.icon} size={24} color="white" />
                        </View>
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryName}>{categoryName}</Text>
                            <Text style={styles.categoryAmount}>
                                ₦{data.totalAmount.toLocaleString()}
                            </Text>
                        </View>
                        <Text style={styles.categoryPercentage}>
                            {Math.round((data.totalAmount / monthlyData.expenses) * 100)}%
                        </Text>
                    </View>
                ))
            ) : (
                <Text>No categories available.</Text> // Fallback message if no categories are present
            )}
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
    marginLeft:-20,
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
