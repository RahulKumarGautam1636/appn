import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
import Modals from '../src/components/modals';
import { TouchableOpacity } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

export default function App() {

  const router = useRouter();

  const compInfo = useSelector((i: RootState) => i.company.info)
  const logo = `https://erp.gsterpsoft.com/Content/CompanyLogo/${compInfo.LogoUrl}`
  console.log(compInfo);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          {/* <Init /> */}
          
          <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
          {/* <View className="relative gap-4 flex-row items-center justify-center py-[6rem]">
              <Image source={require('../assets/images/login-bg.png')} className="absolute inset-0 w-full" resizeMode="cover" />
              <Image className='' source={require('../assets/images/logo.png')} style={{ width: 75, height: 65 }} />
              <View>
                  <Text className="font-Poppins text-gray-600 text-[13px]">Healthcare at it's best.</Text>
                  <Text className="font-Poppins text-gray-600 text-[13px]">Simplifying Your Searches</Text>
              </View>
          </View> */}
          
          <View className="relative gap-4 items-center justify-center py-[2rem] bg-white">
            <Image className='' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${compInfo.LogoUrl}` }} style={{ width: 200, height: 190 }} />    
            {/* <Image className='' source={require('../assets/images/logo.png')} style={{ width: 200, height: 190 }} />    TAKEHOME */}
            {/* <View className='items-center'>
                <Text className="font-GlittherSyavinafree text-blue-800 text-[48px] mb-2 leading-[42px]">TakeHome</Text>
                <Text className="font-Poppins text-gray-600 text-[13px]">Simplifying Your Searches</Text>
            </View> */}
          </View>
          <View className='flex-1 px-4 py-5 bg-slate-100'>
            {/* <Image source={require('../assets/images/login-bg.png')} className="absolute inset-0 w-full" resizeMode="contain" /> */}
            {/* <View className="flex-row justify-between items-center mb-6">
              <Text className="text-3xl font-bold text-gray-800">Our Services</Text>
            </View> */}
            <View className="space-y-4 gap-4">
              {/* <TouchableOpacity onPress={() => router.push('./shop/tabs/home')} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-red-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="capsules" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Book Medicine</Text>
                    <Text className="text-green-600 text-lg font-semibold">Active</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity> */}
              {/* onPress={() => router.push('./appn/tabs/opd')} */}
              <TouchableOpacity onPress={() => router.push('./appn/tabs/opd')} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-blue-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="user-doctor" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Book Appointments</Text>
                    <Text className="text-gray-400 text-lg">1 hour 30 mins</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity>
              {/* <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-blue-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="user-doctor" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Surgicals</Text>
                    <Text className="text-rose-500 text-lg font-semibold">Coming soon..</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-yellow-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="carrot" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Agro & Groceries</Text>
                    <Text className="text-rose-500 text-lg font-semibold">Coming soon..</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-teal-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="shirt" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Garments & Fashion</Text>
                    <Text className="text-rose-500 text-lg font-semibold">Coming soon..</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity> */}
            </View>
          </View>
          </ScrollView>

          <Modals />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

