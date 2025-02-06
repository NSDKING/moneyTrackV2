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
   Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Wallet } from '@/assets/types';

interface AddTransferModalProps {
   visible: boolean;
   onClose: () => void;
   wallets: Array<Wallet>;
}

export default function AddTransferModal({ visible, onClose, wallets }: AddTransferModalProps) {
   const [amount, setAmount] = useState('');
   const [sourceWallet, setSourceWallet] = useState<string | null>(null);
   const [destinationWallet, setDestinationWallet] = useState<string | null>(null);
   const [note, setNote] = useState('');
   const [transactionDate, setTransactionDate] = useState(new Date());
   const [showDatePicker, setShowDatePicker] = useState(false);

   const insertTransaction = async (walletId: string, categoryId: number | null, type: 'deposit' | 'withdrawal' | 'transfer', amount: number, description: string, transferToWalletId: string | null, transactionDate: string) => {
       try {
           const dbPath = `${FileSystem.documentDirectory}sys.db`;
           const db = await SQLite.openDatabaseAsync(dbPath);

           await db.runAsync(`
               INSERT INTO transactions (
                   wallet_id, 
                   category_id, 
                   type, 
                   amount, 
                   description, 
                   transaction_date, 
                   transfer_to_wallet_id,
                   created_at
               )
               VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
           `, [walletId, categoryId, type, amount, description, transactionDate, transferToWalletId]);
        } catch (error) {
           console.error('Error inserting transaction:', error);
       }
   };

   const handleSubmit = async () => {
       // Validate inputs
       if (!amount || !sourceWallet || !destinationWallet) {
           Alert.alert("Validation Error", "Please fill in all fields.");
           return;
       }
       if (sourceWallet === destinationWallet) {
           Alert.alert("Validation Error", "You cannot transfer to the same wallet.");
           return;
       }

       // Insert transactions for both wallets
       await insertTransaction(sourceWallet, null, 'transfer', parseFloat(amount), note, destinationWallet, transactionDate.toISOString());
       await insertTransaction(destinationWallet, null, 'transfer', parseFloat(amount), note, null, transactionDate.toISOString());

       resetForm();
       onClose();
   };

   const resetForm = () => {
       setAmount('');
       setSourceWallet(null);
       setDestinationWallet(null);
       setNote('');
       setTransactionDate(new Date());
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
                       <Text style={styles.headerTitle}>Transfer Money</Text>
                       <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                           <Ionicons name="close" size={24} color={Colors.CharcoalGray} />
                       </TouchableOpacity>
                   </View>
                   <ScrollView style={styles.form}>
                       {/* Amount Input */}
                       <View style={styles.inputContainer}>
                           <Text style={styles.label}>Amount</Text>
                           <TextInput
                               style={styles.input}
                               value={amount}
                               onChangeText={setAmount}
                               keyboardType="numeric"
                               placeholder="0.0000"
                           />
                       </View>
                       {/* Source Wallet Selection */}
                       <Text style={styles.label}>From Wallet</Text>
                       <ScrollView 
                           horizontal
                           showsHorizontalScrollIndicator={false}
                           style={styles.walletsContainer}
                           contentContainerStyle={styles.walletsContentContainer}
                       >
                           {wallets.map((wallet) => (
                               <TouchableOpacity
                                   key={wallet.ID}
                                   style={[styles.walletButton, sourceWallet === wallet.ID && styles.walletButtonActive]}
                                   onPress={() => setSourceWallet(wallet.ID)}
                               >
                                   <Text style={[styles.walletText, sourceWallet === wallet.ID && styles.walletTextActive]}>
                                       {wallet.name}
                                   </Text>
                                   <Text style={[styles.walletAmount, sourceWallet === wallet.ID && styles.walletTextActive]}>
                                       {wallet.balance}
                                   </Text>
                               </TouchableOpacity>
                           ))}
                       </ScrollView>
                       {/* Transfer Icon */}
                       <View style={styles.transferIconContainer}>
                           <Ionicons name="arrow-down" size={24} color={Colors.CharcoalGray} />
                       </View>
                       {/* Destination Wallet Selection */}
                       <Text style={styles.label}>To Wallet</Text>
                       <ScrollView 
                           horizontal
                           showsHorizontalScrollIndicator={false}
                           style={styles.walletsContainer}
                           contentContainerStyle={styles.walletsContentContainer}
                       >
                           {wallets.map((wallet) => (
                               <TouchableOpacity
                                   key={wallet.ID}
                                   style={[styles.walletButton, destinationWallet === wallet.ID && styles.walletButtonActive]}
                                   onPress={() => setDestinationWallet(wallet.ID)}
                               >
                                   <Text style={[styles.walletText, destinationWallet === wallet.ID && styles.walletTextActive]}>
                                       {wallet.name}
                                   </Text>
                                   <Text style={[styles.walletAmount, destinationWallet === wallet.ID && styles.walletTextActive]}>
                                       {wallet.balance}
                                   </Text>
                               </TouchableOpacity>
                           ))}
                       </ScrollView>
                       {/* Date Picker */}
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
                       {/* Note Input */}
                       <View style={styles.inputContainer}>
                           <Text style={styles.label}>Note (Optional)</Text>
                           <TextInput
                               style={[styles.input, styles.noteInput]}
                               value={note}
                               onChangeText={setNote}
                               placeholder="Add a note"
                               multiline
                           />
                       </View>
                       {/* Submit Button */}
                       <TouchableOpacity 
                           style={styles.submitButton}
                           onPress={handleSubmit}
                       >
                           <Text style={styles.submitButtonText}>Transfer Money</Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.CharcoalGray,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
    },
    noteInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    walletsContainer: {
        marginBottom: 20,
    },
    walletsContentContainer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 5,
    },
    walletButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        minWidth: 120,
        marginRight: 10,
    },
    walletButtonActive: {
        backgroundColor: Colors.BrightRed,
    },
    walletText: {
        color: Colors.CharcoalGray,
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 5,
    },
    walletAmount: {
        color: Colors.CharcoalGray,
        fontSize: 14,
    },
    walletTextActive: {
        color: 'white',
    },
    transferIconContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: Colors.BrightRed,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
}); 