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
import categoriesList from '@/constants/categories';

 

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    wallets: Array<{ id: string; type: string; }>;
}

export default function AddTransactionModal({ visible, onClose }: AddTransactionModalProps) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [isExpense, setIsExpense] = useState(true);
    const handleSubmit = () => {
        // Validate inputs
        if (!title || !amount || !selectedCategory || !selectedWallet) {
            // Show error message
            return;
        }
        // Create transaction object
        const newTransaction = {
            id: Date.now().toString(),
            title,
            amount: isExpense ? `-${amount}` : amount,
            date: new Date().toISOString(),
            category: selectedCategory,
            walletId: selectedWallet,
            // Add other fields as needed
        };
        // Handle the new transaction (pass to parent or save directly)
        console.log(newTransaction);
        
        // Reset form and close modal
        resetForm();
        onClose();
    };
    const resetForm = () => {
        setTitle('');
        setAmount('');
        setSelectedCategory('');
        setSelectedWallet('');
        setIsExpense(true);
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
                                style={[
                                    styles.typeButton, 
                                    isExpense && styles.typeButtonActive
                                ]}
                                onPress={() => setIsExpense(true)}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    isExpense && styles.typeButtonTextActive
                                ]}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.typeButton, 
                                    !isExpense && styles.typeButtonActive
                                ]}
                                onPress={() => setIsExpense(false)}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    !isExpense && styles.typeButtonTextActive
                                ]}>Income</Text>
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
                        {/* Category Selection */}
                        <Text style={styles.label}>Category</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesContainer}
                        >
                            {categoriesList.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryButton,
                                        selectedCategory === category.id && {
                                            backgroundColor: category.color
                                        }
                                    ]}
                                    onPress={() => setSelectedCategory(category.id)}
                                >
                                    <Ionicons 
                                        name={category.icon} 
                                        size={24} 
                                        color={selectedCategory === category.id ? 'white' : category.color} 
                                    />
                                    <Text style={[
                                        styles.categoryText,
                                        selectedCategory === category.id && { color: 'white' }
                                    ]}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
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
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    typeButtonActive: {
        backgroundColor: 'white',
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
        color: Colors.CharcoalGray,
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
        marginTop: 150,
        marginBottom: 30,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});