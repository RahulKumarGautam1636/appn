import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
import Modals from '../src/components/modals';
import Init from '@/src/components/init';
import ButtonPrimary from '@/src/components';
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
          <View className='flex-1 w-full items-center justify-center p-5'>
              <ButtonPrimary title='OPEN APP' onPress={() => router.push('/appn/home')} active={true} classes='rounded-2xl w-full' textClasses='tracking-widest' />
          </View>
          <Modals />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
