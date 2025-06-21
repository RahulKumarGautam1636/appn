import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Provider } from 'react-redux';
import store from "./store/store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const theme = useColorScheme();
  const isDark = false;
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <SafeAreaView className="flex-1">
            <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? 'light-content' : 'dark-content'} />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="appn" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
              {/* <Stack.Screen name="movie/[id]" options={{ headerShown: false}} /> */}
            </Stack>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
