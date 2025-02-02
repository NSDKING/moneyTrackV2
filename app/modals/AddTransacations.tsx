import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { AddTransactionModalProps, Transaction } from '@/assets/types';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTransactionModal({ visible, onClose, setTransactions, transactions, categories }: AddTransactionModalProps) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isExpense, setIsExpense] = useState(true);
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const router = useRouter();

    const insertTransaction = async (walletId: number, categoryId: number | null, type: 'deposit' | 'withdrawal' | 'transfer', amount: number, description: string, transferToWalletId: number | null, transactionDate: string) => {
        try {
            const dbPath = `${FileSystem.documentDirectory}sys.db`;
            const db = await SQLite.openDatabaseAsync(dbPath);

            await db.runAsync(`
               INSERT INTO transactions (wallet_id, category_id, type, amount, description, transaction_date, transfer_to_wallet_id)
               VALUES (?, ?, ?, ?, ?, ?, ?);
           `, [walletId, categoryId, type, amount, description, transactionDate, transferToWalletId]);

            const transactionData = await db.getAllAsync('SELECT * FROM transactions');
        } catch (error) {
            console.error('Error inserting transaction:', error);
        }
    }

    const getType = () => {
       return isExpense ? 'withdrawal' : 'deposit';
    };

    const handleSubmit = () => {
        // Validate inputs
        if (!title || !amount || !selectedCategory) {
            console.error("Please fill in all fields.");
            return;
        }

        // Create a new transaction object
        const newTransaction: Transaction = {
            ID: Number((transactions.length + 1)), // Generate a new ID (or use a better method)
            amount: Number(isExpense ? `-${amount}` : amount), // Convert amount to a number
            category_id: Number(selectedCategory),
            description: title,
            type: getType(), // Assuming getType() returns the correct type
            wallet_id: 1,
            transaction_date: transactionDate.toISOString(), // Add the date field
        };

        try {
            // Insert the transaction into the database
            insertTransaction(1, Number(selectedCategory), getType(), Number(isExpense ? `-${amount}` : amount), title, null, transactionDate.toISOString());

            // Update the transactions state
            setTransactions([...transactions, newTransaction]);

            console.log("Transaction added successfully:", newTransaction);
        } catch (error) {
            console.error("Error adding transaction:", error);
        }

        // Reset form and close modal
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setSelectedCategory('');
        setIsExpense(true);
        setTransactionDate(new Date());
    };

    // Function to filter categories based on isExpense
    const filteredCategories = categories.filter(category => 
        (isExpense && category.type === 'expense') || 
        (!isExpense && category.type === 'income')
    );

 

    const handleOpenSettings = () => {
        if (categories) {
            onClose();
            router.push({
                pathname: '/ManageCategories',
                params: { categories: JSON.stringify(categories) },
            });
        } else {
            console.warn('Categories are not defined');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add Transaction</Text>
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
                                <Ionicons 
                                    name="remove-circle-outline" 
                                    size={24} 
                                    color={isExpense ? 'white' : Colors.CharcoalGray} 
                                />
                                <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                                onPress={() => setIsExpense(false)}
                            >
                                <Ionicons 
                                    name="add-circle-outline" 
                                    size={24} 
                                    color={!isExpense ? 'white' : Colors.CharcoalGray} 
                                />
                                <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Amount Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Amount</Text>
                            <TextInput
                                style={styles.input}
                                value={amount}
                                onChangeText={setAmount}
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
                                    style={[styles.categoryButton, Number(selectedCategory) === category.ID && { backgroundColor: category.color }]}
                                    onPress={() => setSelectedCategory(category.ID.toString())}
                                >
                                    <Ionicons 
                                        name={category.icon} 
                                        size={24} 
                                        color={Number(selectedCategory) === category.ID ? 'white' : Colors.lightRed} 
                                    />
                                    <Text style={[styles.categoryText, Number(selectedCategory) === category.ID && { color: 'white' }]}>{category.name}</Text>
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
                            <Text style={styles.submitButtonText}>Add Transaction</Text>
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
        color:'white',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.CharcoalGray,
        marginBottom: 20,
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
    walletsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    walletButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    walletButtonActive: {
        backgroundColor: Colors.BrightRed,
    },
    walletText: {
        color: Colors.CharcoalGray,
        fontWeight: '500',
    },
    walletTextActive: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: Colors.BrightRed,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 30,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    noteInput: {
        height: 100,
        textAlignVertical: 'top',
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
    },
    addCategoryButton: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        marginRight: 10,
    },
    addCategoryText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '500',
        color: 'green',
    },
});