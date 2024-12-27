import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native';
import Header from '../../components/Headers';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarBackground: ()=>( 
                <BlurView
                  intensity={100}
                  style={{
                    flex:1,
                    backgroundColor:'rgba(0,0,0,0.001)',
                  }}
                />
      ),
        tabBarStyle:{
          backgroundColor:'transparent',
          position:'absolute',
          bottom:0,
          left:0,
          right:0,
         }

  
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          header: ()=> <Header/>,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          title: 'Wallets',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


// Add styles at the bottom of the file
const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    marginRight: 10,
  },
  iconButton: {
    marginHorizontal: 8,
    padding: 4,
  },
});
