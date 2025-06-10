// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './sreens/home';
import './globals.css';
// import { verifyInstallation } from 'nativewind';

const ProfileScreen = () => <View style={styles.screen}><Text>Profile</Text></View>;
const SettingsScreen = () => <View style={styles.screen}><Text>Settings</Text></View>;

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  // verifyInstallation();

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
