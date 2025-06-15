// App.js
import { useFonts } from 'expo-font';
import { Link, SplashScreen, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';

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
          router.navigate('/login')
      }
  }, [loaded, error]);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Text className=''>INDEX PAGE</Text>
          <Link className='text-[3rem]' href={'/appn'}>Index</Link>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
