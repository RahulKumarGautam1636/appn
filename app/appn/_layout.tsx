import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}> {/* <= important! */}
        <Stack.Screen name="appn/tabs" options={{animation: 'slide_from_left'}} />
        <Stack.Screen name="appn/profile" options={{animation: 'slide_from_right'}} />
        <Stack.Screen name="appn/appnList" options={{animation: 'slide_from_left'}} />
        <Stack.Screen name="appn/addMember" options={{animation: 'slide_from_right'}} />
        <Stack.Screen name="appn/cart" options={{animation: 'slide_from_left'}} />
        <Stack.Screen name="appn/testDetail" />
        <Stack.Screen name="appn/testList" options={{animation: 'slide_from_right'}} />
        <Stack.Screen name="appn/clinic/[compId]" options={{animation: 'slide_from_right'}} />
        <Stack.Screen name="appn/doctor/[id]" />
        <Stack.Screen name="appn/account" options={{animation: 'slide_from_right'}} />
    </Stack>
  );
}