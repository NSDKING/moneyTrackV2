import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Define the Transaction type
type Transaction = {
    amount: number;
    description: string;
    date: string;
};

// Define the Wallet type
type Wallet = {
    name: string;
    balance: number;
    transactions: Transaction[];
};

// Define the Wallets type
type Wallets = {
    mainWallet: {
        balance: number;
        transactions: Transaction[];
    };
    otherWallets: Wallet[];
};

// Sample data for wallets and transactions
const initialWallets: Wallets = {
    mainWallet: {
        balance: 50000,
        transactions: [
            { amount: 5000, description: 'Grocery Purchase', date: '12/10/2024' },
            { amount: 10000, description: 'Transfer to Savings', date: '11/10/2024' },
        ],
    },
    otherWallets: [
        { name: 'Bank Wallet', balance: 20000, transactions: [] },
        { name: 'Savings Wallet', balance: 15000, transactions: [] },
        { name: 'Travel Wallet', balance: 10000, transactions: [] },
    ],
};

export default function WalletsScreen() {
    const [wallets, setWallets] = useState<Wallets>({
        mainWallet: {
            balance: 50000,
            transactions: [
                { amount: 5000, description: 'Grocery Purchase', date: '12/10/2024' },
                { amount: 10000, description: 'Transfer to Savings', date: '11/10/2024' },
            ],
        },
        otherWallets: [
            { name: 'Bank Wallet', balance: 20000, transactions: [] },
            { name: 'Savings Wallet', balance: 15000, transactions: [] },
            { name: 'Travel Wallet', balance: 10000, transactions: [] },
        ],
    });
    const [isAddMoneyModalVisible, setIsAddMoneyModalVisible] = useState(false);
    const [isWithdrawMoneyModalVisible, setIsWithdrawMoneyModalVisible] = useState(false);
    const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
    const [isViewTransactionsModalVisible, setIsViewTransactionsModalVisible] = useState(false);
    const [transferAmount, setTransferAmount] = useState('');
    const [selectedFromWallet, setSelectedFromWallet] = useState('mainWallet');
    const [selectedToWallet, setSelectedToWallet] = useState('Savings Wallet');
    const [selectedWalletTransactions, setSelectedWalletTransactions] = useState([]);

    const handleAddMoney = (amount: number) => {
        const updatedWallets = { ...wallets };
        updatedWallets.mainWallet.balance += amount;
        setWallets(updatedWallets);
        setIsAddMoneyModalVisible(false);
    };

    const handleWithdrawMoney = (amount: number) => {
        const updatedWallets = { ...wallets };
        if (updatedWallets.mainWallet.balance >= amount) {
            updatedWallets.mainWallet.balance -= amount;
            setWallets(updatedWallets);
            setIsWithdrawMoneyModalVisible(false);
        } else {
            Alert.alert('Insufficient Funds', 'You do not have enough balance to withdraw this amount.');
        }
    };

    const handleTransferFunds = (amount: number) => {
        const updatedWallets = { ...wallets };
        if (selectedFromWallet === 'mainWallet') {
            if (updatedWallets.mainWallet.balance >= amount) {
                updatedWallets.mainWallet.balance -= amount;
                const toWalletIndex = updatedWallets.otherWallets.findIndex(wallet => wallet.name === selectedToWallet);
                if (toWalletIndex !== -1) {
                    updatedWallets.otherWallets[toWalletIndex].balance += amount;
                    updatedWallets.otherWallets[toWalletIndex].transactions.push({
                        amount,
                        description: `Transfer from Main Wallet`,
                        date: new Date().toLocaleDateString(),
                    });
                }
            } else {
                Alert.alert('Insufficient Funds', 'You do not have enough balance to transfer this amount.');
            }
        } else {
            const fromWalletIndex = updatedWallets.otherWallets.findIndex(wallet => wallet.name === selectedFromWallet);
            if (fromWalletIndex !== -1 && updatedWallets.otherWallets[fromWalletIndex].balance >= amount) {
                updatedWallets.otherWallets[fromWalletIndex].balance -= amount;
                const toWalletIndex = updatedWallets.otherWallets.findIndex(wallet => wallet.name === selectedToWallet);
                if (toWalletIndex !== -1) {
                    updatedWallets.otherWallets[toWalletIndex].balance += amount;
                    updatedWallets.otherWallets[toWalletIndex].transactions.push({
                        amount,
                        description: `Transfer from ${selectedFromWallet}`,
                        date: new Date().toLocaleDateString(),
                    });
                }
            } else {
                Alert.alert('Insufficient Funds', 'You do not have enough balance to transfer this amount.');
            }
        }

        setWallets(updatedWallets);
        setIsTransferModalVisible(false);
        setTransferAmount('');
    };

    const handleViewTransactions = (wallet) => {
        setSelectedWalletTransactions(wallet.transactions);
        setIsViewTransactionsModalVisible(true);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Wallets</Text>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color={Colors.CharcoalGray} />
                </TouchableOpacity>
            </View>

            {/* Main Wallet Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Main Wallet (Cash Wallet)</Text>
                <Text style={styles.walletBalance}>Balance: ₦{wallets.mainWallet.balance.toLocaleString()}</Text>
                <Text style={styles.recentActivityTitle}>Recent Activity:</Text>
                {wallets.mainWallet.transactions.map((transaction, index) => (
                    <Text key={index} style={styles.transaction}>
                        - ₦{transaction.amount.toLocaleString()} - {transaction.description} - {transaction.date}
                    </Text>
                ))}
                <View style={styles.walletActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsAddMoneyModalVisible(true)}>
                        <Text style={styles.actionButtonText}>Add Money</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsWithdrawMoneyModalVisible(true)}>
                        <Text style={styles.actionButtonText}>Withdraw Money</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Other Wallets Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other Wallets</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {wallets.otherWallets.map((wallet: Wallet, index: number) => (
                        <View key={index} style={styles.walletCard}>
                            <View style={styles.walletHeader}>
                                <Ionicons name="wallet-outline" size={24} color={Colors.BrightRed} />
                                <Text style={styles.walletName}>{wallet.name}</Text>
                            </View>
                            <Text style={styles.walletBalance}>₦{wallet.balance.toLocaleString()}</Text>
                            <TouchableOpacity style={styles.actionButton} onPress={() => handleViewTransactions(wallet)}>
                                <Text style={styles.actionButtonText}>View Transactions</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllButtonText}>View All Wallets</Text>
                </TouchableOpacity>
            </View>

            {/* Transfer Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transfer Funds</Text>
                <Text style={styles.transferLabel}>From:</Text>
                <TextInput
                    style={styles.transferInput}
                    value={selectedFromWallet}
                    onChangeText={setSelectedFromWallet}
                />
                <Text style={styles.transferLabel}>To:</Text>
                <TextInput
                    style={styles.transferInput}
                    value={selectedToWallet}
                    onChangeText={setSelectedToWallet}
                />
                <Text style={styles.transferLabel}>Amount:</Text>
                <TextInput
                    style={styles.transferInput}
                    value={transferAmount}
                    onChangeText={setTransferAmount}
                    keyboardType="numeric"
                    placeholder="₦____"
                />
                <TouchableOpacity 
                    style={styles.transferButton} 
                    onPress={() => handleTransferFunds(parseFloat(transferAmount))}
                >
                    <Text style={styles.transferButtonText}>Transfer</Text>
                </TouchableOpacity>
            </View>

            {/* Add Money Modal */}
            <Modal
                visible={isAddMoneyModalVisible}
                animationType="slide"
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={() => setIsAddMoneyModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Add Money</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="numeric"
                                    placeholder="Enter amount"
                                    onChangeText={(text) => handleAddMoney(parseFloat(text))}
                                />
                                <TouchableOpacity 
                                    style={styles.modalButton} 
                                    onPress={() => setIsAddMoneyModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Withdraw Money Modal */}
            <Modal
                visible={isWithdrawMoneyModalVisible}
                animationType="slide"
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={() => setIsWithdrawMoneyModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Withdraw Money</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="numeric"
                                    placeholder="Enter amount"
                                    onChangeText={(text) => handleWithdrawMoney(parseFloat(text))}
                                />
                                <TouchableOpacity 
                                    style={styles.modalButton} 
                                    onPress={() => setIsWithdrawMoneyModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Transfer Modal */}
            <Modal
                visible={isTransferModalVisible}
                animationType="slide"
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={() => setIsTransferModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Transfer Funds</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="numeric"
                                    placeholder="Enter amount"
                                    onChangeText={setTransferAmount}
                                />
                                <TouchableOpacity 
                                    style={styles.modalButton} 
                                    onPress={() => handleTransferFunds(parseFloat(transferAmount))}
                                >
                                    <Text style={styles.modalButtonText}>Transfer</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* View Transactions Modal */}
            <Modal
                visible={isViewTransactionsModalVisible}
                animationType="slide"
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={() => setIsViewTransactionsModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Transactions</Text>
                                {selectedWalletTransactions.length > 0 ? (
                                    selectedWalletTransactions.map((transaction, index) => (
                                        <Text key={index} style={styles.transaction}>
                                            - ₦{transaction.amount.toLocaleString()} - {transaction.description} - {transaction.date}
                                        </Text>
                                    ))
                                ) : (
                                    <Text>No transactions available.</Text>
                                )}
                                <TouchableOpacity 
                                    style={styles.modalButton} 
                                    onPress={() => setIsViewTransactionsModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.CharcoalGray,
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
    walletBalance: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.CharcoalGray,
    },
    recentActivityTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 10,
        color: Colors.CharcoalGray,
    },
    transaction: {
        fontSize: 14,
        color: Colors.CharcoalGray,
    },
    walletActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: Colors.BrightRed,
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    walletCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginRight: 15, // Space between cards
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        width: 150, // Fixed width for uniformity
        alignItems: 'center',
    },
    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    walletName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.CharcoalGray,
        marginLeft: 10,
    },
    viewAllButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    viewAllButtonText: {
        color: Colors.BrightRed,
        fontWeight: '600',
    },
    transferLabel: {
        fontSize: 16,
        marginTop: 10,
        color: Colors.CharcoalGray,
    },
    transferInput: {
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
    },
    transferButton: {
        backgroundColor: Colors.BrightRed,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    transferButtonText: {
        color: 'white',
        fontWeight: '600',
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
    modalButton: {
        backgroundColor: Colors.BrightRed,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});