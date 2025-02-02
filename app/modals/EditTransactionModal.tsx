import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { EditTransactionModalProps, Transaction } from '@/assets/types';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppContext } from '@/context/AppContext';

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ visible, onClose, transaction }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState<number | string>(''); // Allow empty string for initial state
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isExpense, setIsExpense] = useState(true);
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { categories, setTransactions } = useAppContext();

    const router = useRouter();

    useEffect(() => {
        if (transaction) {
            setTitle(transaction.description);
            setAmount(transaction.amount.toString());
            setSelectedCategory(transaction.category_id);
            setIsExpense(transaction.type === 'withdrawal');
            setTransactionDate(new Date(transaction.transaction_date));
        }
     }, [transaction]);

    const finalAmount = () => {
        const parsedAmount = Number(amount);

        // Validate the amount
        if (isNaN(parsedAmount)) {
            Alert.alert("Validation Error", "Please enter a valid amount.");
            return 0; // Return a default value or handle as needed
        }

        if (getType() === "withdrawal") {
            return parsedAmount < 0 ? parsedAmount : -parsedAmount; // Return negative for withdrawals
        } else if (getType() === "deposit") {
            if (parsedAmount < 0) {
                Alert.alert("Validation Error", "Deposit amount must be positive.");
                return 0; // Return a default value or handle as needed
            }
            return parsedAmount; // Return positive for deposits
        }

        return 0; // Default return value if type is not recognized
    };

    const updateTransaction = async () => {
        if (!transaction) return;

        try {
            const dbPath = `${FileSystem.documentDirectory}sys.db`;
            const db = await SQLite.openDatabaseAsync(dbPath);
            
            await db.runAsync(`
                UPDATE transactions
                SET category_id = ?, 
                    type = ?, 
                    amount = ?, 
                    description = ?, 
                    transaction_date = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE ID = ?;
            `, [selectedCategory, getType(), finalAmount(), title, transactionDate.toISOString(), transaction.ID]);
            // Update the local state to reflect the changes
            
            setTransactions(prevTransactions => 
                prevTransactions.map(t => 
                    t.ID === transaction.ID 
                        ? { 
                            ...t, 
                            category_id: selectedCategory !== null ? selectedCategory : 0,
                            type: getType(), 
                            amount: finalAmount(), 
                            description: title, 
                            transaction_date: transactionDate.toISOString() 
                          } 
                        : t
                )
                
            );
 
            Alert.alert("Success", "Transaction updated successfully.");
            onClose();
        } catch (error) {
            console.error('Error updating transaction:', error);
            Alert.alert("Error", "Failed to update transaction. Please try again.");
        }
    };

    const getType = () => {
        return isExpense ? 'withdrawal' : 'deposit';
    };

    const handleSubmit = () => {
        if (!title || !amount || !selectedCategory) {
            Alert.alert("Validation Error", "Please fill in all fields.");
            return;
        }
        updateTransaction();
    };

    const handleOpenSettings = () => {
        onClose();
        router.push({
            pathname: '/ManageCategories',
            params: { categories: JSON.stringify(categories) },
        });
    };

        // Function to filter categories based on isExpense
    const filteredCategories = categories.filter(category => 
        (isExpense && category.type === 'expense') || 
        (!isExpense && category.type === 'income')
    );


    const deleteTransaction = async () => {
        if (!transaction) return;
         try {
            const dbPath = `${FileSystem.documentDirectory}sys.db`;
            const db = await SQLite.openDatabaseAsync(dbPath);
             await db.runAsync(`
                UPDATE transactions
                SET is_deleted = TRUE
                WHERE ID = ?;
            `, [transaction.ID]);
             // Remove the transaction from the local state
            setTransactions(prevTransactions => 
                prevTransactions.filter(t => t.ID !== transaction.ID)  
            );
             Alert.alert("Success", "Transaction deleted successfully.");
            onClose();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            Alert.alert("Error", "Failed to delete transaction. Please try again.");
        }
    };
    
     

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Edit Transaction</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.CharcoalGray} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.form}>
                        {/* Transaction Type Toggle */}
                        <View style={styles.typeToggle}>
                            <TouchableOpacity 
                                style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                                onPress={() => setIsExpense(true)}
                            >
                                <Ionicons name="remove-circle-outline" size={24} color={isExpense ? 'white' : Colors.CharcoalGray} />
                                <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                                onPress={() => setIsExpense(false)}
                            >
                                <Ionicons name="add-circle-outline" size={24} color={!isExpense ? 'white' : Colors.CharcoalGray} />
                                <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Amount Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Amount</Text>
                            <TextInput
                                style={styles.input}
                                value={amount.toString()}
                                onChangeText={text => setAmount(text)}
                                keyboardType="numeric"
                                placeholder="0.00"
                            />
                        </View>
                        {/* Title Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Transaction title"
                            />
                        </View>
                        {/* Date Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Transaction Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                <Text>{transactionDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={transactionDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setTransactionDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </View>
                        {/* Category Selection */}
                        <Text style={styles.label}>Category</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesContainer}
                        >
                            {filteredCategories.map((category) => (
                                <TouchableOpacity
                                    key={category.ID}
                                    style={[styles.categoryButton, selectedCategory === category.ID && { backgroundColor: category.color }]}
                                    onPress={() => setSelectedCategory(category.ID)}
                                >
                                    <Ionicons 
                                        name={category.icon} 
                                        size={24} 
                                        color={selectedCategory === category.ID ? 'white' : Colors.lightRed} 
                                    />
                                    <Text style={[styles.categoryText, selectedCategory === category.ID && { color: 'white' }]}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                            {/* Plus Button to add new category */}
                            <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
                                <Ionicons name="settings-outline" size={24} color="blue" />
                                <Text style={styles.settingsText}>Settings</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        {/* Submit Button */}
                        <TouchableOpacity 
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Update Transaction</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                           style={styles.deleteButton}
                           onPress={deleteTransaction}
                       >
                           <Text style={styles.deleteButtonText}>Delete Transaction</Text>
                       </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
        paddingHorizontal: 20,
        height: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.CharcoalGray,
    },
    closeButton: {
        padding: 5,
    },
    form: {
        flex: 1,
    },
    typeToggle: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    typeButtonActive: {
        backgroundColor: Colors.BrightRed,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    typeButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    typeButtonTextActive: {
        color: 'white',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.CharcoalGray,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
    },
    categoriesContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    categoryButton: {
        padding: 15,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        minWidth: 100,
    },
    categoryText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '500',
    },
    settingsButton: {
        padding: 15,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        minWidth: 100,
    },
    settingsText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '500',
        color: 'blue',
    },
    submitButton: {
        backgroundColor: Colors.BrightRed,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EditTransactionModal;