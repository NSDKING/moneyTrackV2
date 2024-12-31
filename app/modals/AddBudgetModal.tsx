import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { AddBudgetModalProps } from '@/assets/types';

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ visible, onClose, selectedCategory }) => {
    const [budgetAmount, setBudgetAmount] = useState<number>(0);

    const handleBudgetAmountChange = (value: string) => {
        const numericValue = parseFloat(value);
        setBudgetAmount(isNaN(numericValue) ? 0 : numericValue);
    };

    const insertBudgetTracking = async (categoryId: string, budgetLimit: number, amountSpent: number) => {
        try {
            const dbPath = `${FileSystem.documentDirectory}sys.db`;
            const db = await SQLite.openDatabaseAsync(dbPath);

            // Get the current date
            const now = new Date();

            // Calculate the next Monday
            const nextMonday = new Date(now);
            const daysUntilNextMonday = (8 - now.getDay()) % 7; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            nextMonday.setDate(now.getDate() + daysUntilNextMonday);

            await db.runAsync(`
                INSERT INTO budget_Tracking (next_rest, amount_spent, budget_limit, category_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            `, [nextMonday.toISOString(), amountSpent, budgetLimit, categoryId]);

            console.log('Budget tracking entry inserted successfully');
        } catch (error) {
            console.error('Error inserting budget tracking entry:', error);
            Alert.alert("Database Error", "Failed to insert budget tracking entry.");
        }
    };

    const handleSubmit = () => {
        if (!selectedCategory || budgetAmount === null) {
            Alert.alert("Validation Error", "Please select a category and enter a budget amount.");
            return;
        }

        const amount = budgetAmount;
        if (isNaN(amount) || amount <= 0) {
            Alert.alert("Validation Error", "Please enter a valid budget amount.");
            return;
        }

        insertBudgetTracking(selectedCategory, budgetAmount, 0);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setBudgetAmount(0);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerTitle}>Set Budget</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Budget Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={budgetAmount.toString()}
                            onChangeText={handleBudgetAmountChange}
                            keyboardType="numeric"
                            placeholder="Enter budget amount"
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Set Budget</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.CharcoalGray,
        marginBottom: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        color: Colors.CharcoalGray,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.CharcoalGray,
        marginBottom: 8,
    },
    categoryButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
    },
    categoryButtonActive: {
        backgroundColor: Colors.BrightRed,
    },
    categoryButtonText: {
        color: Colors.CharcoalGray,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: Colors.BrightRed,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddBudgetModal;
