// import React, { useRef, useMemo } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';

import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import { Text, View, Image } from "react-native"

// export default function MyBottomSheet() {
//   const sheetRef = useRef(null);
//   const snapPoints = useMemo(() => ['25%', '50%'], []);

//   return (
//     <View style={styles.container}>
//       <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints}>
//         <View style={styles.sheetContent}>
//           <Text>Hello from bottom sheet!</Text>
//         </View>
//       </BottomSheet>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   sheetContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// });



export default function TestCard() {
    return (
        <View className='bg-primary-500 rounded-3xl p-5 mt-4'>
            <View className='flex-row'>
                <Image className='shadow-lg rounded-full me-3' source={require('@/assets/images/user.png')} style={{ width: 40, height: 40 }} />
                <View>
                    <Text className="font-PoppinsBold text-white text-[14px]">Prof. Dr. Logan Mason</Text>
                    <Text className="font-Poppins text-gray-200 text-[11px]">Orthopedic Consultation</Text>
                </View>
                <View className="bg-primary-400 py-[11px] px-[13px] rounded-full shadow-lg ms-auto">
                    {/* <Ionicons size={22} color='#fff' className='text-blue-500' name="videocam-outline" /> */}
                    <FontAwesome name="arrow-right" size={20} color='#fff' />
                </View>
            </View>
            <View className='py-3 px-4 bg-primary-400 mt-4 rounded-2xl flex gap-3 flex-row '>
                <FontAwesome5 name="calendar-alt" size={17} color="#fff" />
                <Text className="font-Poppins text-gray-100 text-[13px] me-auto leading-5">June 12, 2025</Text>
                <FontAwesome5 name="clock" size={17} color="#fff" />
                <Text className="font-Poppins text-gray-100 text-[13px] leading-5">9:30 AM</Text>
            </View>
        </View>
    )
}