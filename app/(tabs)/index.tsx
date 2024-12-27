import { View, Text,StyleSheet,Dimensions,FlatList } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';


const wallets = [
    { id: '1', type: 'Cash', amount: '150,000', icon: 'cash-outline' },
    { id: '2', type: 'Bank', amount: '250,000', icon: 'card-outline' },
    { id: '3', type: 'Savings', amount: '450,000', icon: 'wallet-outline' },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 10;


export default function Home() {

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
                data={wallets}
                renderItem={renderWalletCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
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



})