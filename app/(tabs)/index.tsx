import { View, Text,StyleSheet,Dimensions,FlatList, TouchableOpacity, Platform } from 'react-native';
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


export default function Home() {
    const [isAddTransactions, setIsAddTransactions] = useState(false);
    const [isTransferModal, setIsTransferModal] = useState(false);

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
  return (
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
                <FlatList
                data={transactionsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
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
                )}
                showsVerticalScrollIndicator={false}
                style={styles.transactionsList}
            />
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
        </View>
  );
}

const styles = StyleSheet.create({
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
    transactionsList: {
        maxHeight: 350,
    },
    transactionsListExpanded: {
        maxHeight: '100%',
    },
 
})