import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}> 
        <Stack.Screen name="product/[id]" options={{animation: 'slide_from_left'}} />
        <Stack.Screen name="checkout" options={{animation: 'slide_from_right'}} />
        <Stack.Screen name="orderDetails/[orderId]" options={{animation: 'slide_from_right'}} />
        <Stack.Screen name="search" options={{animation: 'slide_from_left'}} />
        <Stack.Screen name="filters" />
        <Stack.Screen name="presc" />
        <Stack.Screen name="locations" />
        <Stack.Screen name="checkDelivery" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="brands" options={{animation: 'slide_from_right'}} />
    </Stack>
  );
}