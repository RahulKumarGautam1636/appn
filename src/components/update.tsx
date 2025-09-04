// // components/UpdateBanner.tsx
// import { useEffect, useState } from 'react';
// import * as Updates from 'expo-updates';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// export default function UpdateBanner() {
//   const [updateAvailable, setUpdateAvailable] = useState(false);

//   useEffect(() => {
//     const checkForUpdates = async () => {
//       try {
//         const update = await Updates.checkForUpdateAsync();
//         if (update.isAvailable) {
//           await Updates.fetchUpdateAsync();
//           setUpdateAvailable(true);
//         }
//       } catch (e) {
//         console.error('Error checking for updates:', e);
//       }
//     };

//     checkForUpdates();
//   }, []);

//   if (!updateAvailable) return null;

//   return (
//     <View style={styles.banner}>
//       <Text style={styles.text}>A new update is available.</Text>
//       <TouchableOpacity onPress={() => Updates.reloadAsync()}>
//         <Text style={styles.button}>Restart</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   banner: {
//     position: 'absolute',
//     top: 0, // Change to 'bottom: 0' if you want it at the bottom
//     width: '100%',
//     backgroundColor: '#2b2b2b',
//     padding: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   button: {
//     color: '#4dd0e1',
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
// });
