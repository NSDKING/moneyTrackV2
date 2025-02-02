import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { RenderWalletCardProps } from '@/assets/types';

 
const RenderWalletCard: React.FC<RenderWalletCardProps> = ({ item, onPress }) => (
    <TouchableOpacity style={styles.walletBox} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.walletContent}>
            <View style={styles.walletLeft}>
                <Text style={styles.walletTitle}>{item.name}</Text>
                <Text style={styles.walletAmount}>Fcfa {item.balance.toFixed(2)}</Text>
            </View>
            <View style={styles.walletIcon}>
                <Ionicons name={item.icon} size={24} color={Colors.CharcoalGray} />
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
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
        width: '100%',
        marginHorizontal: 10,
        marginBottom: 15,
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
        marginBottom: 4,
        fontWeight: '500',
    },
    walletAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.CharcoalGray,
    },
    walletIcon: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 50,
    },
});

export default RenderWalletCard;
