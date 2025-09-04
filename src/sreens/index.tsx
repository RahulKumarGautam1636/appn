// // App.js
// import { Ionicons } from '@expo/vector-icons';
// import React, { useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import AppnList from '../sreens/appnList';
// import './../globals.css';
// import AppnPreview from './../sreens/appnPreview';
// import BookAppn from './../sreens/bookAppn';
// import BookingSuccess from './../sreens/bookingSuccess';
// import HomeScreen from './../sreens/home';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('Home');  

//   const renderScreen = () => {
//     switch (activeTab) {
//       case 'Home':
//         return <HomeScreen />;
//       case 'Profile':
//         return <BookingSuccess />;
//       case 'Settings':
//         return <AppnPreview />;
//       case 'Appointment':
//         return <BookAppn />;
//       case 'Dashbaord':
//         return <AppnList />;
//     }
//   };

//   return (
//     <GestureHandlerRootView>
//       <SafeAreaProvider>
//         <SafeAreaView className="flex-1">
//           <View style={styles.content}>
//             {renderScreen()}
//           </View>
//           <View style={styles.tabBar} className='border-t border-slate-200'>
//             {[
//               { name: 'Home', icon: 'home-outline' },
//               { name: 'Profile', icon: 'person-outline' },
//               { name: 'Settings', icon: 'settings-outline' },
//               { name: 'Appointment', icon: 'calendar-outline' },
//               { name: 'Dashbaord', icon: 'grid-outline' },
//             ].map((tab) => (
//               <TouchableOpacity key={tab.name} onPress={() => setActiveTab(tab.name)} style={styles.tabItem} >
//                 <Ionicons name={tab.icon} size={18} color={activeTab === tab.name ? '#e83d82' : '#6e6e6e'} />
//                 <Text  style={[ styles.tabText, activeTab === tab.name && styles.activeText ]}>
//                   {tab.name}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f6f8',
//   },
//   content: {
//     flex: 1,
//   },
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 0,
//     // elevation: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     backgroundColor: '#fff'
//   },
//   tabItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabText: {
//     fontSize: 10,
//     color: '#6e6e6e',
//     marginTop: 4,
//   },
//   activeText: {
//     color: '#e83d82',
//     fontWeight: 'bold',
//   },
// });


import { Text } from 'react-native';

export default function() {
    return (
        <Text>Screen Index</Text>
    )
}