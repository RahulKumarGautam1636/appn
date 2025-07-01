import { SplashScreen, Stack } from "expo-router";
import { KeyboardAvoidingView, StatusBar, useColorScheme } from "react-native";
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import store from "@/src/store/store";
import { useEffect } from "react";
import { useFonts } from "expo-font";

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
          <SafeAreaView className="flex-1">
            <KeyboardAvoidingView className="flex-1 opacity-10">
              <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? 'light-content' : 'dark-content'} />
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appn" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appnList" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="search" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="members" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="appn/cart" options={{ headerShown: false, animation: 'slide_from_right' }} />
                {/* <Stack.Screen name="movie/[id]" options={{ headerShown: false}} /> */}
              </Stack>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
