import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Transaction, Wallet } from '@/assets/types';
import { useAppContext } from '@/context/AppContext';
import EditTransactionModal from '../modals/EditTransactionModal';
import AddTransferModal from '../modals/AddTrasnferModal';
 
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;

export default function WalletsScreen() {
    const { wallets, setWallets, transactions, setTransactions, categories } = useAppContext();
    const [currentWallet, setCurrentWallet] = useState<Wallet | null>(wallets[0]);
    const [isEditTransactionModalVisible, setIsEditTransactionModalVisible] = useState(false);
    const [isTransferModal, setIsTransferModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const flatListRef = useRef<FlatList<Wallet>>(null);

    const getCateIcon = (ID: string) => {
        const category = categories.find((category) => category.ID.toString() === ID);
        return category ? category.icon : "help-circle-outline"; 
    };

    useEffect(()=>{
 
        console.log("currentWallet")
        console.log(currentWallet)
    },[transactions])

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

    const openEditTransactionModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditTransactionModalVisible(true);
    };

    const renderWalletCard = ({ item }: { item: Wallet }) => (
        <TouchableOpacity 
            style={styles.walletBox} 
         >
            <View style={styles.walletContent}>
                <View style={styles.walletLeft}>
                    <Text style={styles.walletTitle}>{item.name}</Text>
                    <Text style={styles.walletAmount}>Fcfa {item.balance}</Text>
                </View>
                <View style={styles.walletIcon}>
                    <Ionicons name={item.icon} size={24} color={Colors.CharcoalGray} />
                </View>
            </View>
        </TouchableOpacity>
    );

    const handleScroll = (event: any) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.floor(contentOffset.x / (CARD_WIDTH + SPACING)); // Calculate the index of the current wallet
        if (index >= 0 && index < wallets.length) {
            setCurrentWallet(wallets[index]); // Update the current wallet based on the index
        }
    };


    const renderTransactionCard = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.transactionItem} onPress={() => openEditTransactionModal(item)}>
            <View style={styles.transactionLeft}>
                <View style={[
                    styles.transactionIcon,
                    { backgroundColor: Number(item.amount) > 0 ? '#e8f5e9' : '#ffebee' }
                ]}>
  
                </View>
                <View>
                    <Text style={styles.transactionTitle}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{formatTransactionDate(item.transaction_date)}</Text>
                </View>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: Number(item.amount) > 0 ? '#2e7d32' : '#c62828' }
            ]}>
                {item.amount}
            </Text>
        </TouchableOpacity>
    );

    const filteredTransactions = currentWallet 
        ? transactions.filter(transaction => transaction.wallet_id === currentWallet.ID) 
        : [];

    return (
        <ScrollView style={styles.container}>
   

            <FlatList
                ref={flatListRef}
                data={wallets}
                renderItem={renderWalletCard}
                keyExtractor={(item) => item.ID.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
                onScroll={handleScroll}

            />

            <TouchableOpacity 
                style={styles.actionButton} 
                onPress={ () =>{ setIsTransferModal(true) }}      
            >
                <View style={styles.actionButtonContent}>
                    <Ionicons name="swap-horizontal-outline" size={24} color={Colors.CharcoalGray} />
                    <Text style={styles.actionButtonText}>Transfer</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.transactionsContainer}>
                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>there is no transfer here</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        filteredTransactions.length === 0 ?  (
                            <View style={styles.noTransactionsContainer}>
                                <Ionicons name="alert-circle-outline" size={24} color={Colors.CharcoalGray} />
                                <Text style={styles.noTransactionsText}>No transactions available for this wallet.</Text>
                                <Text style={styles.transactionsSubtitle}>You can add a new transaction to get started!</Text>
                            </View>
                        ) : (
                            transactions.length === 0 ? (
                                <Text style={styles.loadingMessage}>Loading Transactions...</Text>
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
 

            <EditTransactionModal
                visible={isEditTransactionModalVisible}
                onClose={() => {
                    setIsEditTransactionModalVisible(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
            />
            <AddTransferModal
                visible={isTransferModal}
                onClose={() => setIsTransferModal(false)}
                wallets={wallets}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 8,

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
    carouselContainer: {
        paddingHorizontal: SPACING,
        paddingVertical: 20,
        marginTop: 15,
    },
    transactionsList: {
        maxHeight: 350,
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
    noTransactionsContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noTransactionsText: {
        fontSize: 16,
        color: Colors.CharcoalGray,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '500',
    },
    transactionsSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    loadingMessage: {
        fontSize: 18,
        color: '#888', 
        textAlign: 'center',
        marginTop: 20,  
    },
    noTransactionsMessage: {
        fontSize: 18,
        color: '#888',  
        textAlign: 'center',
        marginTop: 20, 
    },
    transactionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        marginTop:80,
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
    actionButton: {
        marginTop:25,
        flex: 1,
        width:300,
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
        alignSelf: 'center', // Center the button horizontally

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
});