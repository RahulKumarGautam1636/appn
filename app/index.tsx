// App.js
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import './globals.css';
import HomeScreen from './sreens/home';



const ProfileScreen = () => <View style={styles.screen}><Text>Profile</Text></View>;
const SettingsScreen = () => <View style={styles.screen}><Text>Settings</Text></View>;

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const [loaded, error] = useFonts({
      'Space-Mono': require('./../assets/fonts/SpaceMono-Regular.ttf'),
      'Poppins-Bold': require('./../assets/fonts/Poppins/Poppins-Bold.ttf'),
      'Poppins-ExtraBold': require('./../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
      'Poppins-ExtraLight': require('./../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
      'Poppins-Light': require('./../assets/fonts/Poppins/Poppins-Light.ttf'),
      'Poppins-Medium': require('./../assets/fonts/Poppins/Poppins-Medium.ttf'),
      'Poppins-Regular': require('./../assets/fonts/Poppins/Poppins-Regular.ttf'),
      'Poppins-Semibold': require('./../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
      'Poppins-Thin': require('./../assets/fonts/Poppins/Poppins-Thin.ttf'),
  });

  // useEffect(() => {
  //     if (loaded || error) {
  //         SplashScreen.hideAsync();
  //     }
  // }, [loaded, error]);
  

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Settings':
        return <SettingsScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* <LinearGradient colors={['#4facfe', '#00f2fe']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabBar}> */}
      <View style={styles.tabBar}>
        {[
          { name: 'Home', icon: 'home-outline' },
          { name: 'Profile', icon: 'person-outline' },
          { name: 'Settings', icon: 'settings-outline' },
          { name: 'Appointment', icon: 'calendar-outline' },
          { name: 'Dashbaord', icon: 'grid-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveTab(tab.name)}
            style={styles.tabItem}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.name ? '#e83d82' : '#6e6e6e'}
            />
            <Text 
            style={[
              styles.tabText,
              activeTab === tab.name && styles.activeText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#6e6e6e',
    marginTop: 4,
  },
  activeText: {
    color: '#e83d82',
    fontWeight: 'bold',
  },
});
