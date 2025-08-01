import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
import Modals from '../src/components/modals';
import Init from '@/src/components/init';
import ButtonPrimary from '@/src/components';
import { TouchableOpacity } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
// import ButtonPrimary from './components';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from './store/store';

export default function App() {

  // const dispatch = useDispatch();
  // const count = useSelector((state: RootState) => state.counter.value);
  // const [loading, setLoading] = useState(true);
  const router = useRouter();
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Init />
          {/* <View className='flex-1 w-full items-center justify-center p-5 gap-4'>
              <ButtonPrimary title='OPEN OPD' onPress={() => router.push('./appn/tabs/home')} active={true} classes='rounded-2xl w-full' textClasses='tracking-widest' />
              <ButtonPrimary title='OPEN PHARMACY' onPress={() => router.push('./shop/home')} active={true} classes='rounded-2xl w-full' textClasses='tracking-widest' />
          </View> */}

          <View className="relative gap-4 flex-row items-center justify-center py-[6rem]">
              <Image source={require('../assets/images/login-bg.png')} className="absolute inset-0 w-full" resizeMode="cover" />
              <Image className='' source={require('../assets/images/logo.png')} style={{ width: 75, height: 65 }} />
              <View>
                  <Text className="font-PoppinsSemibold text-blue-800 text-[38px] leading-none mb-2 pt-3">Healthify</Text>
                  <Text className="font-Poppins text-gray-600 text-[13px]">Healthcare at it's best.</Text>
              </View>
          </View>
          <View className='flex-1 bg-white px-6 pt-8'>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-3xl font-bold text-gray-800">Our Services</Text>
            </View>
            <View className="space-y-4 gap-4">
              <TouchableOpacity onPress={() => router.push('./appn/tabs/opd')} className="flex-row items-center justify-between bg-slate-100 border border-gray-200 p-5 rounded-xl">
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
              <TouchableOpacity onPress={() => router.push('./shop/tabs/home')} className="flex-row items-center justify-between bg-slate-100 border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-red-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="capsules" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Book Medicine</Text>
                    <Text className="text-gray-400 text-lg">45 mins</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between bg-slate-100 border border-gray-200 p-5 rounded-xl">
                <View className="flex-row items-center">
                  <View className="bg-yellow-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                    <FontAwesome6 name="carrot" size={33} color="white" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold text-xl mb-2">Buy Groceries</Text>
                    <Text className="text-gray-400 text-lg">1 hour 15 mins</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
              </TouchableOpacity>
            </View>
          </View>
          <Modals />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

