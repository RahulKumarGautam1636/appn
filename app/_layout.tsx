import { SplashScreen, Stack } from "expo-router";
import { KeyboardAvoidingView, StatusBar, useColorScheme } from "react-native";
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import store from "@/src/store/store";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { blur } from "@/constants";

export default function RootLayout() {
  const theme = useColorScheme();
  const isDark = false;
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';

  // const router = useRouter();

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

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <SafeAreaView className={`flex-1 ${blur && 'opacity-10'}`}>
            <KeyboardAvoidingView className="flex-1">
              <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? 'light-content' : 'dark-content'} />
              {/* <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" /> */}
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appn/tabs" options={{ headerShown: false, animation: 'slide_from_left' }} />
                <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_left' }} />
                <Stack.Screen name="appn/appnList" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="search" options={{ headerShown: false, animation: 'slide_from_left' }} />
                <Stack.Screen name="members" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appn/cart" options={{ headerShown: false, animation: 'slide_from_left' }} />
                <Stack.Screen name="testDetail" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="testList" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appn/clinic/[compId]" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appn/doctor/[id]" options={{ headerShown: false, animation: 'slide_from_left' }} />


                {/* <Stack.Screen name="shop" options={{ headerShown: false, animation: 'slide_from_right' }} /> */}
                <Stack.Screen name="shop/tabs" options={{ headerShown: false, animation: 'slide_from_right' }} />
              </Stack>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
