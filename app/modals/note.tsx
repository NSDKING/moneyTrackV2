import React, { useState } from 'react';
import { 
   Modal, 
   View, 
   Text, 
   StyleSheet, 
   TouchableOpacity, 
   TextInput,
   KeyboardAvoidingView,
   Platform,
   Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

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
       maxHeight: '80%',
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
       gap: 8,
       paddingVertical: 10,
       borderRadius: 8,
   },
   typeButtonActive: {
       backgroundColor: Colors.BrightRed,
   },
   typeButtonText: {
       color: Colors.CharcoalGray,
       fontWeight: '500',
   },
   typeButtonTextActive: {
       color: 'white',
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
       marginTop: 20,
       marginBottom: 30,
   },
   submitButtonText: {
       color: 'white',
       fontSize: 16,
       fontWeight: '600',
   },
});

interface NoteModalProps {
   visible: boolean;
   onClose: () => void;
   wallets: Array<{ id: string; type: string; }>;
}

export default function NoteModal({ visible, onClose, wallets }: NoteModalProps) {
   const [note, setNote] = useState('');
   const [amount, setAmount] = useState('');
   const [selectedWallet, setSelectedWallet] = useState('');
   const [isExpense, setIsExpense] = useState(true);
    // Function to parse the note and extract amount
   const parseNote = (text: string) => {
       // Match patterns like "100" or "100.00"
       const amountMatch = text.match(/\d+(\.\d{1,2})?/);
       if (amountMatch) {
           setAmount(amountMatch[0]);
           // Remove the amount from the note
           setNote(text.replace(amountMatch[0], '').trim());
       } else {
           setNote(text);
       }
   };
    const handleSubmit = () => {
       if (!note || !amount || !selectedWallet) {
           Alert.alert('Error', 'Please fill in all fields');
           return;
       }
        // Create transaction object
       const newTransaction = {
           id: Date.now().toString(),
           title: note,
           amount: isExpense ? `-${amount}` : amount,
           date: new Date().toISOString(),
           walletId: selectedWallet,
           // You might want to add category based on keywords in the note
           category: 'uncategorized',
           icon: isExpense ? 'remove-circle-outline' : 'add-circle-outline'
       };
        console.log(newTransaction);
       // Here you would add the transaction to your database
       
       resetForm();
       onClose();
   };
    const resetForm = () => {
       setNote('');
       setAmount('');
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
                       <Text style={styles.headerTitle}>Quick Note</Text>
                       <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                           <Ionicons name="close" size={24} color={Colors.CharcoalGray} />
                       </TouchableOpacity>
                   </View>
                    {/* Type Toggle */}
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
                           <Text style={[
                               styles.typeButtonText,
                               isExpense && styles.typeButtonTextActive
                           ]}>Expense</Text>
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
                           <Text style={[
                               styles.typeButtonText,
                               !isExpense && styles.typeButtonTextActive
                           ]}>Income</Text>
                       </TouchableOpacity>
                   </View>
                    {/* Note Input */}
                   <View style={styles.inputContainer}>
                       <Text style={styles.label}>Quick Note</Text>
                       <TextInput
                           style={[styles.input, styles.noteInput]}
                           value={note}
                           onChangeText={parseNote}
                           placeholder="Enter note with amount (e.g., 'Coffee 5.50')"
                           multiline
                           autoFocus
                       />
                   </View>
 
                    {/* Submit Button */}
                   <TouchableOpacity 
                       style={styles.submitButton}
                       onPress={handleSubmit}
                   >
                       <Text style={styles.submitButtonText}>Add Transaction</Text>
                   </TouchableOpacity>
               </View>
           </KeyboardAvoidingView>
       </Modal>
   );
}