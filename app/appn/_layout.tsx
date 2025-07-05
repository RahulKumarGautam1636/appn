import { myColors } from "@/constants";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();

  const tabs = [
    { name: 'OPD', icon: 'home-outline', key: 'home' },
    { name: 'Lab Test', icon: 'flask', key: 'lab' },
    { name: 'Account', icon: 'person-outline', key: 'profile' },
    { name: 'Cart', icon: 'settings-outline', key: 'cart' },
  ];

  const lab = useSelector((i: RootState) => i.cart).lab;
  const cart = Object.values(lab);

  // Keep track of tab history
  const tabHistory = useRef<string[]>([]); 
  // 👇 Whenever route changes, track tab changes
  useEffect(() => {
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

  // Handle hardware back button
  useEffect(() => {
    const onBackPress = () => {
      if (tabHistory.current.length > 1) {
        // Remove current tab
        tabHistory.current.pop();
        const previousTab = tabHistory.current[tabHistory.current.length - 1];
        if (previousTab) {
          router.push(`/appn/${previousTab}`);
          return true; // prevent default
        }
      }
      return false; // allow default back behavior (exit app)
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return (
    <Tabs
      tabBar={({ state, descriptors, navigation }: any) => {
        return (
          <View style={styles.tabBar} className='border-y border-slate-200'>
            {tabs.map((tab, index) => {
              const isFocused = state.routes[state.index]?.name === tab.key;
              const onPress = () => {
                router.push(`/appn/${tab.key}`);

                // Add manually to history
                const last = tabHistory.current[tabHistory.current.length - 1];
                if (last !== tab.key) {
                  tabHistory.current.push(tab.key);
                }
              };

              return (
                <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tabItem} className={`flex-1 py-[10px] ${isFocused ? 'border-b border-primary-500' : ''}`} >
                  <Ionicons name={tab.icon} size={18} color={isFocused ? myColors.primary[500] : '#6e6e6e'} />
                  <Text style={[styles.tabText, isFocused && styles.activeText]}>
                    {tab.name}
                  </Text>
                  {tab.key === 'cart' && cart.length ? (
                    <View className="absolute top-[8%] right-[20%] h-[16px] w-[16px] justify-center items-center bg-emerald-600 rounded-full">
                      <Text className="text-white text-[10px] font-PoppinsMedium">{cart.length}</Text>
                    </View>
                  ) : null}
                  {isFocused && (
                    <View className="absolute w-full bottom-0 left-0 h-[2px] bg-primary-500"></View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
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
