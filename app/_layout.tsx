import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";

export default function RootLayout() {
  const theme = useColorScheme();
  const isDark = false;
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack>
        <Stack.Screen name="appn/index" options={{ headerShown: false}} />
        <Stack.Screen name="index" options={{ headerShown: false}} />
        <Stack.Screen name="login" options={{ headerShown: false}} />
        {/* <Stack.Screen name="movie/[id]" options={{ headerShown: false}} /> */}
      </Stack>
    </>
  );
}
