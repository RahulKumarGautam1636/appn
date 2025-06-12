import { Stack } from "expo-router";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const theme = useColorScheme();
  const isDark = false;
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
        {/* <Stack.Screen name="movie/[id]" options={{ headerShown: false}} /> */}
      </Stack>
    </>
  );
}
