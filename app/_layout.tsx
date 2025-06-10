import { Stack } from "expo-router";
// import { SafeAreaView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // <SafeAreaView>
      <Stack>
        <Stack.Screen name="Home" options={{ headerShown: false}} />
        {/* <Stack.Screen name="movie/[id]" options={{ headerShown: false}} /> */}
      </Stack>
    // </SafeAreaView>
  );
}
