import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Transaction, Wallet } from '@/assets/types';
import { useAppContext } from '@/context/AppContext';
import EditTransactionModal from './modals/EditTransactionModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;

export default function WalletsScreen() {
    const { wallets, setWallets, transactions, setTransactions, categories } = useAppContext();
    const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
    const [isEditTransactionModalVisible, setIsEditTransactionModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const flatListRef = useRef<FlatList<Wallet>>(null);

    const getCateIcon = (ID: string) => {
        const category = categories.find((category) => category.ID.toString() === ID);
        return category ? category.icon : "help-circle-outline"; 
    };

    useEffect(()=>{
        console.log(transactions)
        console.log('transactions')
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
            onPress={() => setCurrentWallet(item)}
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
        const index = Math.floor(contentOffset.x / (CARD_WIDTH + SPACING));
        if (index >= 0 && index < wallets.length) {
            setCurrentWallet(wallets[index]);
        }
    };

    const renderTransactionCard = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.transactionItem} onPress={() => openEditTransactionModal(item)}>
            <View style={styles.transactionLeft}>
                <View style={[
                    styles.transactionIcon,
                    { backgroundColor: Number(item.amount) > 0 ? '#e8f5e9' : '#ffebee' }
                ]}>
                    <Ionicons 
                        name={getCateIcon(item.category_id.toString())} 
                        size={20} 
                        color={Number(item.amount) > 0 ? '#2e7d32' : '#c62828'}
                    />
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
                scrollEventThrottle={16}
            />

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.ID ? item.ID.toString() : Math.random().toString()} 
                renderItem={renderTransactionCard}
                showsVerticalScrollIndicator={false}
                style={styles.transactionsList}
                nestedScrollEnabled={true}
            />

            <View style={{ flex: 1 }}>
                {
                    filteredTransactions.length === 0 ?  (
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

            <EditTransactionModal
                visible={isEditTransactionModalVisible}
                onClose={() => {
                    setIsEditTransactionModalVisible(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
});