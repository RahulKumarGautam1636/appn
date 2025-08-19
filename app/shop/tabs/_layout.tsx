import { myColors } from "@/constants";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "@/src/store/slices/slices";

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn)
  const dispatch = useDispatch();

  const tabs = [
    // { name: 'Home', icon: 'home', key: 'home' },
    { name: 'Home', icon: 'home', key: 'home' },
    { name: 'Category', icon: 'grid', key: 'categories' },
    { name: 'Account', icon: 'person', key: 'profile' },
    { name: 'Cart', icon: 'cart', key: 'cart' },
    { name: 'Orders', icon: 'gift', key: 'orders' },
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

  useEffect(() => {                                            // Handle hardware back button
    const onBackPress = () => {
      if (tabHistory.current.length > 1) {
        tabHistory.current.pop();                              // Remove current tab
        const previousTab = tabHistory.current[tabHistory.current.length - 1];
        if (previousTab) {
          router.push(`/shop/tabs/${previousTab}`);
          return true;                                         // prevent default
        }
      }
      return false;                                            // allow default back behavior (exit app)
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return (
    <>
       <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />    
      <Tabs tabBar={({ state, descriptors, navigation }: any) => {
        return (
          <View style={styles.tabBar} className='border-y border-slate-200'>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.tabItem} className={`flex-1 py-[10px]`} >
              <Ionicons name='arrow-back' size={20} color='#6e6e6e' />
                <Text style={[styles.tabText]}>
                  Back
                </Text>
            </TouchableOpacity>
            {tabs.map((tab, index) => {
              const isFocused = state.routes[state.index]?.name === tab.key;
              const onPress = () => {
                if (tab.key === 'profile' || tab.key === 'orders') {
                  if (!isLoggedIn) return dispatch(setModal({name: 'LOGIN', state: true}))
                } 
                router.push(`/shop/tabs/${tab.key}`);
                const last = tabHistory.current[tabHistory.current.length - 1];     // Add manually to history
                if (last !== tab.key) {
                  tabHistory.current.push(tab.key);
                }
              };

              return (
                  <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tabItem} className={`flex-1 py-[10px]`} >
                    <Ionicons name={isFocused ? tab.icon : tab.icon+'-outline'} size={18} color={isFocused ? myColors.primary[500] : '#6e6e6e'} />
                    <Text style={[styles.tabText, isFocused && styles.activeText]}>
                      {tab.name}
                    </Text>
                    {tab.key === 'cart' && cart.length ? (
                      <View className="absolute top-[8%] right-[20%] h-[16px] w-[16px] justify-center items-center bg-emerald-600 rounded-full">
                        <Text className="text-white text-[10px] font-PoppinsMedium">{cart.length}</Text>
                      </View>
                    ) : null}
                    {isFocused && (
                      <View className="absolute w-full bottom-0 left-0 h-[2px] bg-primary-500 rounded-tl-full rounded-tr-full"></View>
                    )}
                  </TouchableOpacity>
              );
            })}
          </View>
        )}}
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          animation: 'shift',
          transitionSpec: {
            animation: 'timing',
            config: { duration: 250 },
          },
        }}
      ></Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#6e6e6e',
    marginTop: 4,
  },
  activeText: {
    color: myColors.primary[500],
    fontWeight: 'bold',
  },
});
