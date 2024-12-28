import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

interface HeaderProps {
    onNotePress: () => void;
}



const Header = ({ onNotePress }: HeaderProps) => {
 const { top } = useSafeAreaInsets();
  
 
 return (
   <BlurView intensity={90} tint="light" style={[styles.container, { paddingTop: top }]}>
     <View style={styles.headerContent}>
       {/* Logo */}
       <View style={styles.logoContainer}>
         <Text style={styles.logoText}>MoneyTrack</Text>
       </View>
        {/* Action Buttons */}
        
        {/**
       <View style={styles.actionButtons}>
        <TouchableOpacity 
            style={styles.iconButton}
            onPress={onNotePress}
        >
            <Ionicons name="create-outline" size={24} color={Colors.dark} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="scan-outline" size={24} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
   
       </View>
         */}
 
     </View>
   </BlurView>
 );
}
const styles = StyleSheet.create({
 container: {
   borderBottomWidth: 1,
   borderBottomColor: Colors.lightGray,
 },
 headerContent: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingHorizontal: 16,
   paddingVertical: 12,
 },
 logoContainer: {
   flex: 1,
 },
 logoText: {
   fontSize: 20,
   fontWeight: 'bold',
   color: Colors.dark,
 },
 actionButtons: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 12,
 },
 iconButton: {
   width: 40,
   height: 40,
   borderRadius: 20,
   backgroundColor: Colors.lightGray,
   justifyContent: 'center',
   alignItems: 'center',
 },
})

export default Header;