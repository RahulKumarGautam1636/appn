import { myColors } from "@/src/constants";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Alert, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "@/src/store/slices/slices";
import { ShoppingCart, Home, Calendar, User } from "lucide-react-native";

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn)
  const dispatch = useDispatch();

  const tabs = [
    { name: 'Home', icon: 'home', key: 'home' },                                        
    { name: 'Tables', icon: 'calendar', key: 'tables' },                                 
    { name: 'Account', icon: 'person', key: 'account' },
    { name: 'Category', icon: 'grid', key: 'categories' },
    { name: 'Cart', icon: 'cart', key: 'checkout' },
  ];

  const lab = useSelector((i: RootState) => i.cart);
  const cart = Object.values(lab);


  const tabHistory = useRef<string[]>([]);                      // Keep track of tab history

  useEffect(() => {                                             // 👇 Whenever route changes, track tab changes
    const currentSegment = segments[segments.length - 1];
    if (!currentSegment) return;

    const tabKeys = tabs.map(t => t.key);
    if (tabKeys.includes(currentSegment)) {
      const last = tabHistory.current[tabHistory.current.length - 1];
      if (last !== currentSegment) {
        tabHistory.current.push(currentSegment);
      }
    }
  }, [segments]);

  return (
    <> 
      <Tabs 
        tabBar={({ state, descriptors, navigation }: any) => {
            return (
                    <>
                        <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />   
                        <View className="flex flex-row justify-between items-center bg-white border-t border-gray-200 px-6 py-3">
                            {/* <TouchableOpacity onPress={() => router.push('/')} style={styles.tabItem} className={`flex-1 py-[10px]`} >
                            <Ionicons name='arrow-back' size={20} color='#6e6e6e' />
                                <Text style={[styles.tabText]}>Back</Text>
                            </TouchableOpacity> */}
                            {tabs.map((tab, index) => {
                            const isFocused = state.routes[state.index]?.name === tab.key;
                            const onPress = () => {
                                if (tab.key === 'account' || tab.key === 'orders') {
                                  if (!isLoggedIn) return dispatch(setModal({name: 'LOGIN', state: true}))
                                }
                                if (tab.key === 'categories') return router.push(`/hospitality/orderPrint?id=1234`);
                                router.push(`/hospitality/tabs/${tab.key}`);
                                const last = tabHistory.current[tabHistory.current.length - 1];     // Add manually to history
                                if (last !== tab.key) {
                                  tabHistory.current.push(tab.key);
                                }
                            };

                            return (
                                // <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tabItem} className={`flex-1 py-[10px]`} >
                                //     <Ionicons name={isFocused ? tab.icon : tab.icon+'-outline'} size={18} color={isFocused ? myColors.primary[500] : '#6e6e6e'} />
                                //     <Text style={[styles.tabText, isFocused && styles.activeText]}>
                                //     {tab.name}
                                //     </Text>
                                //     {tab.key === 'cart' && cart.length ? (
                                //     <View className="absolute top-[8%] right-[20%] h-[16px] w-[16px] justify-center items-center bg-emerald-600 rounded-full">
                                //         <Text className="text-white text-[10px] font-PoppinsMedium">{cart.length}</Text>
                                //     </View>
                                //     ) : null}
                                //     {isFocused && (
                                //     <View className="absolute w-full bottom-0 left-0 h-[2px] bg-primary-500 rounded-tl-full rounded-tr-full"></View>
                                //     )}
                                // </TouchableOpacity>

                                <TouchableOpacity key={tab.name} onPress={onPress} className="flex flex-col items-center">
                                    <Ionicons name={isFocused ? tab.icon : tab.icon+'-outline'} size={22} color={isFocused ? '#EF4444' : '#6e6e6e'} />
                                    <Text className={`text-xs mt-1 font-semibold ${isFocused ? 'text-red-500' : 'text-gray-400'}`}>{tab.name}</Text>
                                </TouchableOpacity>
                            );
                            })}
                        </View>

                        {/* <View className="flex flex-row justify-between items-center bg-white border-t border-gray-200 px-6 py-3">
                            <TouchableOpacity className="flex flex-col items-center">
                                
                                <Text className="text-xs text-red-500 mt-1 font-semibold">Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
                                
                                <Text className="text-xs text-gray-400 mt-1">Book Table</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
                                
                                <Text className="text-xs text-gray-400 mt-1">Category</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
                                
                                <Text className="text-xs text-gray-400 mt-1">Cart</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
                                
                                <Text className="text-xs text-gray-400 mt-1">Profile</Text>
                            </TouchableOpacity>
                        </View> */}
                    </>
            )}
        }
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          animation: 'shift',
          transitionSpec: {
            animation: 'timing',
            config: { duration: 250 },
          },
        }}
      >
      <Tabs.Screen name="home" />
        <Tabs.Screen name="cart" />
        <Tabs.Screen name="orders" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="categories" />
      </Tabs>
    </>
  );
}

