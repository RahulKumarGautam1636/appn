import { SplashScreen, Stack } from "expo-router";
import { KeyboardAvoidingView, StatusBar } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import store, { RootState } from "@/src/store/store";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { blur, hasAccess } from "@/src/constants";
import Init from "@/src/components/init";
import UpdateBanner from "@/src/components/update";
import Modals from "@/src/components/modals";
import { getCompanyDetails } from "@/src/store/slices/slices";

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const isDark = false;
  const backgroundColor = isDark ? "#000000" : "#FFFFFF";
  const vType = useSelector((state: RootState) => state.company.vType);
  const compCode = useSelector((state: RootState) => state.compCode);
  const locationId = useSelector((state: RootState) => state.appData.location.LocationId);
  const dispatch = useDispatch()

  const [loaded, error] = useFonts({
    "Space-Mono": require("./../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Bold": require("./../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("./../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("./../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("./../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-Medium": require("./../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Semibold": require("./../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("./../assets/fonts/Poppins/Poppins-Thin.ttf"),
    "GlittherSyavinafree": require("./../assets/fonts/GlittherSyavinafree.otf"),
  });

  useEffect(() => {
    dispatch(getCompanyDetails({ compCode: compCode, locationId: locationId }))
  }, [compCode, locationId])

  useEffect(() => {
    if (!vType) return;
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, vType]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaView className={`flex-1 ${blur && "opacity-10"}`}>
      <KeyboardAvoidingView className="flex-1">
        <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? "light-content" : "dark-content"} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="appn/tabs" options={{animation: 'slide_from_left'}} />
            <Stack.Screen name="login" />
            <Stack.Screen name="profile" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="appn/appnList" options={{animation: 'slide_from_left'}} />
            <Stack.Screen name="search" />
            <Stack.Screen name="members" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="appn/cart" options={{animation: 'slide_from_left'}} />
            <Stack.Screen name="appn/testDetail" />
            <Stack.Screen name="appn/testList" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="appn/clinic/[compId]" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="appn/doctor/[id]" />

            <Stack.Screen name="shop/tabs" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="shop/product/[id]" options={{animation: 'slide_from_left'}} />
            <Stack.Screen name="shop/cart" />
            <Stack.Screen name="shop/checkout" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="shop/tabs/categories" options={{animation: 'slide_from_left'}} />
            <Stack.Screen name="shop/tabs/orders" />
            <Stack.Screen name="shop/orderDetails/[orderId]" options={{animation: 'slide_from_right'}} />
            <Stack.Screen name="shop/search" options={{animation: 'slide_from_left'}} />
            <Stack.Screen name="shop/filters" />
            <Stack.Screen name="shop/brands" options={{animation: 'slide_from_right'}} />
          </Stack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LayoutContent />
          <Init />
          <Modals />
          <UpdateBanner />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}



// ---------------------------------------------------------------------------------------------------------------

// import { SplashScreen, Stack } from "expo-router";
// import { KeyboardAvoidingView, StatusBar } from "react-native";
// import { Provider } from 'react-redux';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import store from "@/src/store/store";
// import React, { useEffect } from "react";
// import { useFonts } from "expo-font";
// import { blur } from "@/src/constants";
// import Init from "@/src/components/init";
// import UpdateBanner from "@/src/components/update";
// import Modals from "@/src/components/modals";

// export default function RootLayout() {
//   // const theme = useColorScheme();
//   const isDark = false;
//   const backgroundColor = isDark ? '#000000' : '#FFFFFF';

//   // const router = useRouter();

//   const [loaded, error] = useFonts({
//       'Space-Mono': require('./../assets/fonts/SpaceMono-Regular.ttf'),
//       'Poppins-Bold': require('./../assets/fonts/Poppins/Poppins-Bold.ttf'),
//       'Poppins-ExtraBold': require('./../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
//       'Poppins-ExtraLight': require('./../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
//       'Poppins-Light': require('./../assets/fonts/Poppins/Poppins-Light.ttf'),
//       'Poppins-Medium': require('./../assets/fonts/Poppins/Poppins-Medium.ttf'),
//       'Poppins-Regular': require('./../assets/fonts/Poppins/Poppins-Regular.ttf'),
//       'Poppins-Semibold': require('./../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
//       'Poppins-Thin': require('./../assets/fonts/Poppins/Poppins-Thin.ttf'),
//       'GlittherSyavinafree': require('./../assets/fonts/GlittherSyavinafree.otf'),
//   });

//   useEffect(() => {
//       if (loaded || error) {
//           SplashScreen.hideAsync();
//           // router.navigate('/login')
//       }
//   }, [loaded, error]);

//   return (
//     // <React.StrictMode>
//     <Provider store={store}>
//       <GestureHandlerRootView>
//         <SafeAreaProvider>
//           <SafeAreaView className={`flex-1 ${blur && 'opacity-10'}`}>
//             <KeyboardAvoidingView className="flex-1">
//               <StatusBar backgroundColor={backgroundColor} barStyle={isDark ? 'light-content' : 'dark-content'} />
//               {/* <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" /> */}
//               <Stack>
//                 <Stack.Screen name="index" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="appn/tabs" options={{ headerShown: false, animation: 'slide_from_left' }} />
//                 <Stack.Screen name="login" options={{ headerShown: false }} />
//                 <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="appn/appnList" options={{ headerShown: false, animation: 'slide_from_left' }} />
//                 <Stack.Screen name="search" options={{ headerShown: false }} />
//                 <Stack.Screen name="members" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="appn/cart" options={{ headerShown: false, animation: 'slide_from_left' }} />
//                 <Stack.Screen name="appn/testDetail" options={{ headerShown: false }} />
//                 <Stack.Screen name="appn/testList" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="appn/clinic/[compId]" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="appn/doctor/[id]" options={{ headerShown: false }} />


//                 {/* <Stack.Screen name="shop" options={{ headerShown: false, animation: 'slide_from_right' }} /> */}
//                 <Stack.Screen name="shop/tabs" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="shop/product/[id]" options={{ headerShown: false, animation: 'slide_from_left' }} />
//                 <Stack.Screen name="shop/cart" options={{ headerShown: false }} />
//                 <Stack.Screen name="shop/checkout" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="shop/tabs/categories" options={{ headerShown: false, animation: 'slide_from_left' }} />
//                 <Stack.Screen name="shop/tabs/orders" options={{ headerShown: false }} />
//                 <Stack.Screen name="shop/orderDetails/[orderId]" options={{ headerShown: false, animation: 'slide_from_right' }} />
//                 <Stack.Screen name="shop/search" options={{ headerShown: false, animation: 'slide_from_left' }} />
//                 <Stack.Screen name="shop/filters" options={{ headerShown: false }} />
//                 <Stack.Screen name="shop/brands" options={{ headerShown: false, animation: 'slide_from_right' }} />
//               </Stack>
//               <Init />
//               <Modals />
//               <UpdateBanner />
//             </KeyboardAvoidingView>
//           </SafeAreaView>
//         </SafeAreaProvider>
//       </GestureHandlerRootView>
//     </Provider>
//     // </React.StrictMode>
//   );
// }
