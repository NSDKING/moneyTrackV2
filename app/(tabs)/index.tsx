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
                    <Text style={styles.smallBoxText}>monthly expense &gt;</Text>            
            </View>
        </View>

        <View style={styles.walletBox}>
            <Text style={styles.walletTitle}>Cash</Text>
            <Text style={styles.walletAmount}>$5000</Text>
        </View>

        <View>
            <Text>Transactions</Text>
        </View>

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

    walletBox:{
        backgroundColor: '#fff', // or any color you prefer
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // for Android shadow
        alignSelf: 'center', // Center horizontally
        marginVertical: 20,
        width: '80%', // or specific width like 300
        // Add styling for the content inside
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    walletTitle:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    walletAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
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
    }

})