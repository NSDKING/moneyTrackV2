import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Wallet } from '@/assets/types';
import { useAppContext } from '@/context/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;
 

export default function WalletsScreen() {
    const { wallets, setWallets, transactions, setTransactions } = useAppContext();
    

      const renderWalletCard = ({ item }: { item: Wallet }) => (
        console.log():
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
    
    return (
        <ScrollView style={styles.container}>
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
        marginTop:15,
    },
});