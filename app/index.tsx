import { Link } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
import Modals from '../src/components/modals';
import { DatePickerExample } from '@/src/components';
// import ButtonPrimary from './components';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from './store/store';

export default function App() {

  // const dispatch = useDispatch();
  // const count = useSelector((state: RootState) => state.counter.value);
  // const [loading, setLoading] = useState(true);
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Text className=''>INDEX PAGE</Text>
          <Link className='text-[3rem]' href={'/'}>Index</Link>
          <Link className='text-[3rem]' href={'/appn/home'}>Index 1</Link>
          <Link className='text-[3rem]' href={'/appn/cart'}>Index 3</Link>
          <Link className='text-[3rem]' href={'/testList'}>Index 4</Link>
          <Link className='text-[3rem]' href={'/testDetail'}>Index 4</Link>
          <DatePickerExample />
          {/* <ButtonPrimary onClick={() => setLoading(!loading)} isLoading={loading} title='LOGIN' active={true} classes='rounded-2xl' textClasses='tracking-widest' /> */}
          <Modals />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
