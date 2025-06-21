// App.js
import { useFonts } from 'expo-font';
import { Link, SplashScreen, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
// import ButtonPrimary from './components';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from './store/store';

export default function App() {

  const router = useRouter();

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

  useEffect(() => {
      if (loaded || error) {
          SplashScreen.hideAsync();
          // router.navigate('/login')
      }
  }, [loaded, error]);

  // const dispatch = useDispatch();
  // const count = useSelector((state: RootState) => state.counter.value);
  // const [loading, setLoading] = useState(true);
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Text className=''>INDEX PAGE</Text>
          <Link className='text-[3rem]' href={'/'}>Index</Link>
          <Link className='text-[3rem]' href={'/appn'}>Index 1</Link>
          <Link className='text-[3rem]' href={'/appn/appnList'}>Index 2</Link>
          <Link className='text-[3rem]' href={'/appn/appnPreview'}>Index 3</Link>
          <Link className='text-[3rem]' href={'/profile'}>Index 4</Link>
          {/* <ButtonPrimary onClick={() => setLoading(!loading)} isLoading={loading} title='LOGIN' active={true} classes='rounded-2xl' textClasses='tracking-widest' /> */}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
