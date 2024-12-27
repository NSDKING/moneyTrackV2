import { View, Text,StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function Home() {
  return (
    <View style={{padding:10}}>
        <View style={styles.HeaderLeft}>
            <Text style={{fontSize:20, fontWeight:'500', color:Colors.CharcoalGray }}>Total Balance</Text>
            <Text style={{fontSize:28, fontWeight:'700'}}>Fcfa 150,000</Text>
            <View style={styles.smallBoxContainer}>
                    <View style={styles.smallBox}>
                        <Text style={styles.smallBoxText}>Fcfa 15k</Text>
                    </View>
                    <Text style={styles.smallBoxText}>monthly expense &gt;</Text>            </View>
            </View>

        <View style={styles.HeaderCard}>
            <Text>Cash</Text>
            <Text>5000</Text>
        </View>

        <View>
            <Text>Transactions</Text>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
    HeaderLeft:{
        
    },

    HeaderCard:{

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
        paddingHorizontal: 10,
    }

})