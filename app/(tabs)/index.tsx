import { View, Text,StyleSheet,Dimensions,FlatList, TouchableOpacity, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import walletLists from '@/constants/wallets';
import AddTransactionModal from '../modals/AddTransacations';
import AddTransferModal from '../modals/AddTrasnferModal';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import categoriesList from '@/constants/categories';
import { useAppContext } from '@/context/AppContext';
import { Wallet, Transaction, Category, BudgetTracking } from '@/assets/types';


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
    const [BudgetArray, setBudgetArray]=useState<Category[]>([]);
    const [BudgetTracking, setBudgetTracking]=useState<BudgetTracking[]>([]);
    const [selectedBudget, setSelectedBudget] = useState<number>();
    const [budgetAmount, setBudgetAmount] = useState('');
    const { wallets, setWallets, transactions, setTransactions, categories, setCategories } = useAppContext();


    const [budgets, setBudgets] = useState<{ [key in BudgetKey]: { total: number; spent: number, category_id: number } }>({
 
    }); 
    const [loading, setLoading]= useState<boolean>(false);
 

    const createDatabase = async () => {
        const dbPath = `${FileSystem.documentDirectory}sys.db`;
        const db = await SQLite.openDatabaseAsync(dbPath);
        try {
            await db.execAsync(`
                PRAGMA journal_mode = WAL;
            
                CREATE TABLE IF NOT EXISTS wallets (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                    user_id INTEGER NOT NULL, 
                    name VARCHAR(255) NOT NULL, 
                    balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
                    icon TEXT,                
                    color TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    FOREIGN KEY (user_id) REFERENCES users(user_id)  
                );
            
                CREATE TABLE IF NOT EXISTS transactions (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,  
                    wallet_id INTEGER NOT NULL,  
                    category_id INTEGER,                    
                    type TEXT CHECK(type IN ('deposit', 'withdrawal', 'transfer')) NOT NULL,  
                    amount DECIMAL(10, 2) NOT NULL,               
                    description VARCHAR(255),                    
                    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                    transfer_to_wallet_id INTEGER,        
                    is_deleted BOOLEAN DEFAULT FALSE,            
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    FOREIGN KEY (wallet_id) REFERENCES wallets(ID),  
                    FOREIGN KEY (transfer_to_wallet_id) REFERENCES wallets(ID),  
                    FOREIGN KEY (category_id) REFERENCES categories(ID)
                 );
            
                CREATE TABLE IF NOT EXISTS categories (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    budgeted BOOLEAN DEFAULT FALSE,  
                    budget_limit DECIMAL(10, 2),    
                    start_date DATE NOT NULL,                 
                    end_date DATE NOT NULL,
                    icon TEXT,                
                    color TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    type TEXT CHECK(type IN ('expense', 'income')) NOT NULL 
                    );

                CREATE TABLE IF NOT EXISTS budget_Tracking (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    next_rest TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                    amount_spent DECIMAL(10, 2),    
                    budget_limit DECIMAL(10, 2),    
                    category_id INTEGER,                   
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(ID)
                );
    
            `);

            const defaultStartDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
            const defaultEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]; // One year from now

            // Function to insert categories if they don't already exist
            const insertCategoriesIfNotExists = async () => {
                for (const category of categoriesList) {
                    // Check if the category already exists
                    const existingCategory = await db.getAllAsync(`SELECT * FROM categories WHERE name = ?`, [category.name]);
                    const doesItExist = existingCategory.length === 0;
                    if (doesItExist) {
                        await db.runAsync(`
                            INSERT INTO categories (name, icon, color, type, start_date, end_date)
                            VALUES (?, ?, ?, ?, ?, ?);
                        `, [category.name, category.icon, category.color, category.type, defaultStartDate, defaultEndDate]);
                    }
                }
            };

            // Function to insert wallets if they don't already exist
            const insertWalletsIfNotExists = async () => {
                for (const wallet of walletLists) {
                    // Check if the wallet already exists
                    const existingWallet = await db.getAllAsync(`SELECT * FROM wallets WHERE name = ?`, [wallet.type]);
                    const doesItExist = existingWallet.length === 0;
                    if (doesItExist) {
                        await db.runAsync(`
                            INSERT INTO wallets (user_id, name, balance, icon, color)
                            VALUES (?, ?, ?, ?, ?);
                        `, [1, wallet.type, parseFloat(wallet.amount.replace(/,/g, '')), wallet.icon, wallet.color]);
                     }
                }
            };

            // Call the functions to insert categories and wallets
            await insertCategoriesIfNotExists();
            await insertWalletsIfNotExists();

        } catch (error) {
            console.error('Error inserting :', error);
        }

 
    }

    
    const getData = async () => {
        try {
            const dbPath = `${FileSystem.documentDirectory}sys.db`;
            const db = await SQLite.openDatabaseAsync(dbPath);
            const walletData: Wallet[] = await db.getAllAsync('SELECT * FROM wallets');
            const transactionData: Transaction[] = await db.getAllAsync('SELECT * FROM transactions');
            const categoriesData: Category[] = await db.getAllAsync('SELECT * FROM categories');
            const BudgetTrackingData: BudgetTracking[] = await db.getAllAsync('SELECT * FROM budget_Tracking');

            setWallets(walletData);
            setTransactions(transactionData);
            setCategories(categoriesData);      
            setBudgetTracking(BudgetTrackingData);
 

            const filteredCategories = categoriesData.filter(category => category.budgeted === 1);
            setBudgetArray(filteredCategories);
 
        } catch (error) {
            console.error('Error opening database:', error);
        }
    }         
    const formatTransactionDate = (dateString: string): string => {
        // Create a Date object from the input string
        const date = new Date(dateString);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            console.error("Invalid date format:", dateString);
            return ""; // Return an empty string or handle the error as needed
        }
        // Format the date to "DD MMM"
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const calculateBudgets = async () => {
        const dbPath = `${FileSystem.documentDirectory}sys.db`;
        const db = await SQLite.openDatabaseAsync(dbPath);
        const updatedBudgets: { [key: string]: { total: number; spent: number; category_id: number } } = {}; // Temporary object to hold updated budgets
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        for (const budget of BudgetArray) { // Use for...of to handle async operations correctly
            // Find the last matching tracker without modifying the original array
            const lastMatchingTracker = BudgetTracking.slice().reverse().find(item => item.id === budget.ID); 
            let totalSpent = 0; // Initialize total spent for the current budget

            // Calculate total spent for the current budget
            for (const transaction of transactions) {
                const categoryId = transaction.category_id; // Get the category ID from the transaction
                
                // Check if the transaction category matches the current budget ID
                if (categoryId === budget.ID) {
                    totalSpent += transaction.amount; // Accumulate the spent amount
                }
            }

            // Update the temporary object with the budget details
            updatedBudgets[budget.name] = {
                total: budget.budget_limit,
                spent: totalSpent,
                category_id: budget.ID
            };
 
           
        
            // Check if next_rest matches today's date
            if (lastMatchingTracker) {
                // Parse the next_rest date
                const nextRestDate = new Date(lastMatchingTracker.next_rest);
                
                // Calculate the number of days until the next Monday
                const daysUntilNextMonday = (8 - nextRestDate.getDay()) % 7; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                
                // Add the days to get the next Monday
                nextRestDate.setDate(nextRestDate.getDate() + daysUntilNextMonday);
                
                try {
                    await db.runAsync(`
                        INSERT INTO budget_Tracking (next_rest, amount_spent, budget_limit, created_at)
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP);
                    `, [nextRestDate.toISOString(), totalSpent, budget.budgetLimit]); // Use the updated next_rest date
                } catch (error) {
                    console.error('Error inserting into budget_Tracking:', error);
                }
            }
        }

        setBudgets(prevBudgets => ({
            ...prevBudgets,
            ...updatedBudgets, // Merge the updated budgets into the existing state
        }));
    };
    
 
    useEffect(()=>{

        const initializeDatabase = async () => {
            setLoading(true)
            await createDatabase();
            await getData();
            await calculateBudgets();
            setLoading(false)
        };

        initializeDatabase();
      },[])

      useEffect(()=>{
        calculateBudgets();
      },[budgets])


    const getBalance = () => {
        if (transactions.length === 0) {
            return 0;
        } else {
            const totalBalance = transactions.reduce((accumulator, transaction) => {
                const amount = transaction.amount ? String(transaction.amount).replace(/,/g, '') : '0';
                return accumulator + parseFloat(amount);
            }, 0);

            return totalBalance;
        }
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

        // Format the total monthly expense
        return formatAmount(totalMonthlyExpense);
    };

    // Function to format the amount
    const formatAmount = (amount: number): string => {
        if (amount === 0) return "0"; // Handle zero case
        const absAmount = Math.abs(amount);
        const formattedAmount = (absAmount / 1000).toFixed(0); // Divide by 1000 and round to nearest integer
        return `${formattedAmount}K`; // Append 'K' for thousands
    };

     const renderWalletCard = ({ item }: { item: Wallet }) => (
        <View style={styles.walletBox}>
          <View style={styles.walletContent}>
            <View style={styles.walletLeft}>
              <Text style={styles.walletTitle}>{item.name}</Text>
              <Text style={styles.walletAmount}>Fcfa {item.balance}</Text>
            </View>
            <View style={styles.walletIcon}>
              <Ionicons name={item.icon} size={24} color={Colors.CharcoalGray} />
            </View>
          </View>
        </View>
      );

      const getCateIcon = (ID:string) => {
        const category = categories.find((category) => category.ID.toString() === ID);
        return category ? category.icon : "help-circle-outline"; 
    };

    const filteredTransactions = transactions.filter(transaction => transaction.type !== 'transfer'); // Filter out transfers

    const renderTransactionCard = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
                <View style={[
                    styles.transactionIcon,
                    { backgroundColor: Number(item.amount) > 0 ? '#e8f5e9' : '#ffebee' } // Positive amount = green, Negative amount = red
                ]}>
                    <Ionicons 
                        name={getCateIcon(item.category_id.toString())} 
                        size={20} 
                        color={Number(item.amount) > 0 ? '#2e7d32' : '#c62828'} // Positive amount = green icon, Negative amount = red icon
                        />
                </View>
                <View>
                    <Text style={styles.transactionTitle}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{formatTransactionDate(item.transaction_date)}</Text>
                </View>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: Number(item.amount)  > 0 ? '#2e7d32' : '#c62828' }
            ]}>
                {item.amount}
            </Text>
        </TouchableOpacity>
    );

    const handleBudgetDelete = async ()=>{
        
    }

    const handleBudgetUpdate = async () => {
        console.log("Budget update clicked");
 
        const dbPath = `${FileSystem.documentDirectory}sys.db`;
        const db = await SQLite.openDatabaseAsync(dbPath);

        try {
            // Update the budget limit for the selected category
            const result = await db.runAsync(`
                UPDATE categories
                SET budget_limit = ?
                WHERE ID = ?;
            `, [budgetAmount, selectedBudget]);
 
            console.log("Budget updated successfully");

            // Update the categories state
            setCategories(prevCategories => {
                return prevCategories.map(category => 
                    category.ID === selectedBudget ? { ...category, budget_limit: budgetAmount } : category
                );
            });

            // Update the budget array similarly
            setBudgetArray(prevBudgetArray => {
                return prevBudgetArray.map(budget => 
                    budget.ID === selectedBudget ? { ...budget, budget_limit: budgetAmount } : budget
                );
            });

            // Provide user feedback
            Alert.alert("Success", "Budget updated successfully.");
            setIsBudgetModalVisible(false);
 
        } catch (error) {
            console.error("Error updating budget:", error);
            Alert.alert("Error", "Failed to update budget. Please try again.");
        } 
    };
  return (
    <ScrollView style={styles.container}>
         
        <View style={{padding:10}}>
            <View style={styles.HeaderLeft}>Y
                <Text style={{fontSize:20, fontWeight:'500', color:Colors.CharcoalGray }}>Total Balance</Text>
                {loading ? (
                    <Text style={{fontSize:28, fontWeight: '700'}}>Loading...</Text>
                ) : (
                    <Text style={{fontSize:28, fontWeight: '700'}}>Fcfa {getBalance()}</Text>
                )}
                <View style={styles.smallBoxContainer}>
                    <View style={styles.smallBox}>
                        {loading ? (
                            <Text style={styles.smallBoxText}>Loading...</Text>
                        ) : (
                            <Text style={styles.smallBoxText}>Fcfa {monthlyExpense()}</Text>
                        )}
                    </View>
                    <Text style={styles.smallBoxText}>monthly expense &gt;</Text>            
                </View>
            </View>
            {/* Replace the single wallet box with FlatList */}
            <FlatList
                data={wallets}
                renderItem={renderWalletCard}
                keyExtractor={(item) => item.ID.toString()}
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
                    onPress={ () =>{ setIsTransferModal(true) }}      
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
                    {
                        loading ? (
                            <Text style={styles.loadingMessage}>Loading Transactions...</Text>
                        ) : (
                            transactions.length === 0 ? (
                                <Text style={styles.noTransactionsMessage}>No Transactions Available</Text>
                            ) : (
                                <FlatList
                                    data={filteredTransactions}
                                    keyExtractor={(item) => item.ID ? item.ID.toString() : Math.random().toString()} 
                                    renderItem={renderTransactionCard}
                                    showsVerticalScrollIndicator={false}
                                    style={styles.transactionsList}
                                    nestedScrollEnabled={true}
                                />
                            )
                        )
                    }
                </View>
            </View>
        
            {
                !loading&&(
                    <>
                        <AddTransactionModal
                            visible={isAddTransactions}
                            onClose={() => setIsAddTransactions(false)}
                            setTransactions={setTransactions}
                            transactions={transactions}
                            categories={categories}
                            setCategories={setCategories}
                        />

                        <AddTransferModal
                            visible={isTransferModal}
                            onClose={() => setIsTransferModal(false)}
                            wallets={walletLists}
                        />
        
                    </>
                    
                )
            }

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
                                        setSelectedBudget(budgets[key].category_id);
                                        setIsBudgetModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.editBudgetButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.budgetDetails}>
                                <View style={styles.budgetDetail}>
                                    <Ionicons name="cash-outline" size={20} color={Colors.BrightRed} />
                                    <Text style={styles.budgetAmount}>Total: ₦{budget.total}</Text>
                                </View>
                                <View style={styles.budgetDetail}>
                                    <Ionicons name="arrow-up-outline" size={20} color={Colors.BrightGreen} />
                                    <Text style={styles.budgetAmount}>Spent: ₦{budget.spent}</Text>
                                </View>
                                <View style={styles.budgetDetail}>
                                    <Ionicons name="arrow-down-outline" size={20} color={Colors.BrightBlue} />
                                    <Text style={styles.budgetAmount}>Remaining: ₦{remaining}</Text>
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
                                    Edit  
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
                                            handleBudgetUpdate('update'); // Update existing budget

                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>Save Changes</Text>
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
    loadingMessage: {
        fontSize: 18,
        color: '#888', // Adjust color as needed
        textAlign: 'center',
        marginTop: 20, // Add some margin for better spacing
    },
    noTransactionsMessage: {
        fontSize: 18,
        color: '#888', // Adjust color as needed
        textAlign: 'center',
        marginTop: 20, // Add some margin for better spacing
    },
})