import { View, Text,StyleSheet,Dimensions,FlatList, TouchableOpacity, Platform, Modal, TextInput, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import transactionsList from '@/constants/transactions';
import { useState } from 'react';
import walletLists from '@/constants/wallets';
import AddTransactionModal from '../modals/AddTransacations';
import AddTransferModal from '../modals/AddTrasnferModal';
  
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;

const initialBudgets = {
    food: { total: 2000, spent: 800 },
    transport: { total: 1000, spent: 300 },
    goingOut: { total: 1500, spent: 600 },
};

export default function Home() {
    const [isAddTransactions, setIsAddTransactions] = useState(false);
    const [isTransferModal, setIsTransferModal] = useState(false);
    const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgets, setBudgets] = useState(initialBudgets);

     const renderWalletCard = ({ item }) => (
        <View style={styles.walletBox}>
          <View style={styles.walletContent}>
            <View style={styles.walletLeft}>
              <Text style={styles.walletTitle}>{item.type}</Text>
              <Text style={styles.walletAmount}>Fcfa {item.amount}</Text>
            </View>
            <View style={styles.walletIcon}>
              <Ionicons name={item.icon} size={24} color={Colors.CharcoalGray} />
            </View>
          </View>
        </View>
      );

    const renderTransactionCard = ({item}) =>(
        <TouchableOpacity style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
                <View style={[
                    styles.transactionIcon,
                    { backgroundColor: item.amount.includes('+') ? '#e8f5e9' : '#ffebee' }
                ]}>
                    <Ionicons 
                        name={item.icon} 
                        size={20} 
                        color={item.amount.includes('+') ? '#2e7d32' : '#c62828'} 
                    />
                </View>
                <View>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: item.amount.includes('+') ? '#2e7d32' : '#c62828' }
            ]}>
                {item.amount}
            </Text>
        </TouchableOpacity>
    );
  return (
    <ScrollView style={styles.container}>
         
        <View style={{padding:10}}>
            <View style={styles.HeaderLeft}>
                <Text style={{fontSize:20, fontWeight:'500', color:Colors.CharcoalGray }}>Total Balance</Text>
                <Text style={{fontSize:28, fontWeight:'700'}}>Fcfa 150,000</Text>
                <View style={styles.smallBoxContainer}>
                    <View style={styles.smallBox}>
                    <Text style={styles.smallBoxText}>Fcfa 15k</Text>
                    </View>
                    <Text style={styles.smallBoxText}>monthly expense &gt;</Text>            
                </View>
            </View>
            {/* Replace the single wallet box with FlatList */}
            <FlatList
                data={walletLists}
                renderItem={renderWalletCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
            />

            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => setIsAddTransactions(true)}
                >
                    <View style={styles.actionButtonContent}>
                        <Ionicons name="add-circle-outline" size={24} color={Colors.CharcoalGray} />
                        <Text style={styles.actionButtonText}>Add Transaction</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => setIsTransferModal(true)}
                >
                    <View style={styles.actionButtonContent}>
                        <Ionicons name="swap-horizontal-outline" size={24} color={Colors.CharcoalGray} />
                        <Text style={styles.actionButtonText}>Transfer</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.transactionsContainer}>
                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={transactionsList}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransactionCard}
                        showsVerticalScrollIndicator={false}
                        style={styles.transactionsList}
                        nestedScrollEnabled={true}
                    />
                </View>
            </View>
        
            <AddTransactionModal
                visible={isAddTransactions}
                onClose={() => setIsAddTransactions(false)}
            />

            <AddTransferModal
                    visible={isTransferModal}
                    onClose={() => setIsTransferModal(false)}
                    wallets={walletLists}
            />

            {/* Budget Section */}
            <View style={styles.transactionsContainer}>
                <Text style={styles.sectionTitle}>Budgets</Text>
                {Object.keys(budgets).map((key) => {
                    const budget = budgets[key];
                    const remaining = budget.total - budget.spent;
                    const spentPercentage = (budget.spent / budget.total) * 100;

                    return (
                        <View key={key} style={styles.budgetItem}>
                            <View style={styles.budgetHeader}>
                                <Text style={styles.budgetName}>{key.charAt(0).toUpperCase() + key.slice(1)} Budget</Text>
                                <TouchableOpacity 
                                    style={styles.editBudgetButton} 
                                    onPress={() => {
                                        setSelectedBudget(key);
                                        setIsBudgetModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.editBudgetButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.budgetDetails}>
                                <View style={styles.budgetDetail}>
                                    <Ionicons name="cash-outline" size={20} color={Colors.BrightRed} />
                                    <Text style={styles.budgetAmount}>Total: ₦{budget.total.toLocaleString()}</Text>
                                </View>
                                <View style={styles.budgetDetail}>
                                    <Ionicons name="arrow-up-outline" size={20} color={Colors.BrightGreen} />
                                    <Text style={styles.budgetAmount}>Spent: ₦{budget.spent.toLocaleString()}</Text>
                                </View>
                                <View style={styles.budgetDetail}>
                                    <Ionicons name="arrow-down-outline" size={20} color={Colors.BrightBlue} />
                                    <Text style={styles.budgetAmount}>Remaining: ₦{remaining.toLocaleString()}</Text>
                                </View>
                            </View>
                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { width: `${spentPercentage}%` }]} />
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Budget Edit Modal */}
            <Modal
                visible={isBudgetModalVisible}
                animationType="slide"
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={() => setIsBudgetModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>
                                    {selectedBudget ? `Edit ${selectedBudget.charAt(0).toUpperCase() + selectedBudget.slice(1)} Budget` : 'Create New Budget'}
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={budgetAmount}
                                    onChangeText={setBudgetAmount}
                                    keyboardType="numeric"
                                    placeholder="Enter amount"
                                />
                                <View style={styles.modalActions}>
                                    <TouchableOpacity 
                                        style={styles.modalButton} 
                                        onPress={() => {
                                            if (selectedBudget) {
                                                handleBudgetUpdate('update'); // Update existing budget
                                            } else {
                                                handleBudgetUpdate('create'); // Create new budget
                                            }
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>{selectedBudget ? 'Save Changes' : 'Save Budget'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.modalButton} 
                                        onPress={() => {
                                            if (selectedBudget) {
                                                handleBudgetDelete(selectedBudget as BudgetKey); // Delete budget
                                            }
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>Delete</Text>
                                    </TouchableOpacity>
    
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>

    </ScrollView>


  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
    HeaderLeft:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 13,
        padding: 2,
        marginTop:15,
    },
    smallBox:{
        backgroundColor:Colors.BrightRed,
        height:25,
        width:75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
    },
    smallBoxText:{
        textAlign: 'center',
        color:Colors.CharcoalGray,
        fontSize:18,
        fontWeight:'500',
    },
    smallBoxContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },

    carouselContainer: {
        paddingHorizontal: SPACING,
        paddingVertical: 20,
        marginTop:15,
    },
    walletBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: CARD_WIDTH,
        marginHorizontal: SPACING / 2,
    },
    walletContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletLeft: {
        flex: 1,
    },
    walletTitle: {
        fontSize: 16,
        color: Colors.CharcoalGray,
        marginBottom: 8,
        fontWeight: '500',
    },
    walletAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.CharcoalGray,
    },
    walletIcon: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 50,
    },

    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 20,
        gap: 10,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 11,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.CharcoalGray,
    },

    transactionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
               ...Platform.select({
           ios: {
               transition: 'all 0.3s ease',
           },
           android: {
               // Android doesn't support CSS transitions
           },
       }),
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        ...Platform.select({
            ios: {
                transition: 'all 0.3s ease',
            },
            android: {
                // Android doesn't support CSS transitions
            },
        }),
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    transactionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.CharcoalGray,
    },
    seeAllButton: {
        color: Colors.BrightRed,
        fontSize: 14,
        fontWeight: '500',
    },
    transactionsList: {
        maxHeight: 350, // Adjust this value based on your needs
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.CharcoalGray,
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 13,
        color: '#666',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    transactionsContainerExpanded: {
        flex: 1,
        maxHeight: '80%', // Adjust this value as needed
    },
 
    transactionsListExpanded: {
        maxHeight: '100%',
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
    budgetItem: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    budgetName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.CharcoalGray,
    },
    editBudgetButton: {
        backgroundColor: Colors.BrightRed,
        padding: 5,
        borderRadius: 5,
    },
    editBudgetButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    budgetDetails: {
        marginTop: 10,
    },
    budgetDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    budgetAmount: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.CharcoalGray,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: Colors.BrightRed,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    progressContainer: {
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.BrightRed, // Change this to a color that fits your theme
        borderRadius: 10,
    },
})