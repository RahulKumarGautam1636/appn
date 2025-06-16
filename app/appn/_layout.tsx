import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// function TabIcon({ focused, icon, title }: any) {
//   if (focused) {
//     return (
//       <ImageBackground
//         source={images.highlight}
//         className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden"
//       >
//         <Image source={icon} tintColor="#151312" className="size-5" />
//         <Text className="text-secondary text-base font-semibold ml-2">
//           {title}
//         </Text>
//       </ImageBackground>
//     );
//   }

//   return (
//     <View className="size-full justify-center items-center mt-4 rounded-full">
//       <Image source={icon} tintColor="#A8B5DB" className="size-5" />
//     </View>
//   );
// }

export default function TabsLayout() {

  const router = useRouter()
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Tabs
            tabBar={({ state, descriptors, navigation }: any) => {
              return (
                <View style={styles.tabBar} className='border-t border-slate-200'>
                  {[
                    { name: 'Home', icon: 'home-outline', key: 'home' },
                    { name: 'Profile', icon: 'person-outline', key: 'appnList' },
                    { name: 'Settings', icon: 'settings-outline', key: 'bookAppn' },
                    { name: 'Appointment', icon: 'calendar-outline', key: 'appnPreview' },
                    { name: 'Dashbaord', icon: 'grid-outline', key: 'bookingSuccess' },
                  ].map((tab, index) => {

                    const isFocused = state.index === index;

                    const onPress = () => {
                      // const event = navigation.emit({
                      //   type: 'tabPress',
                      //   target: tab.key,
                      // });

                      router.push(`/appn/${tab.key}`);
            
                      // if (!isFocused && !event.defaultPrevented) {
                      //   navigation.navigate(tab.name);
                      // }
                    };

                    return (
                      <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tabItem} >
                        <Ionicons name={tab.icon} size={18} color={isFocused ? '#e83d82' : '#6e6e6e'} />
                        <Text  style={[ styles.tabText, isFocused && styles.activeText ]}>
                          {tab.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            }
            screenOptions={{
              tabBarShowLabel: false,
              headerShown: false
              // tabBarItemStyle: {
              //   width: "100%",
              //   height: "100%",
              //   justifyContent: "center",
              //   alignItems: "center",
              // },
              // tabBarStyle: {
                // backgroundColor: "#0F0D23",
                // borderRadius: 50,
                // marginHorizontal: 20,
                // marginBottom: 36,
                // height: 52,
                // position: "absolute",
                // overflow: "hidden",
                // borderWidth: 1,
                // borderColor: "#0F0D23",
                // ...styles.tabBar
              // },
              // tabBarItemStyle: {
              //   ...styles.tabText
              // }
            }}
          >
            {/* <Tabs.Screen
              name="home"
              options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <View style={styles.tabItem} >
                    <Ionicons name='home-outline' size={18} color={focused ? '#e83d82' : '#6e6e6e'} />
                    <Text style={[ styles.tabText, focused && styles.activeText ]}>
                      Home
                    </Text>
                  </View>
                ),
              }}
            />

            {/* <Tabs.Screen
              name="appnList"
              options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <View style={styles.tabItem} >
                    <Ionicons name='person-outline' size={18} color={focused ? '#e83d82' : '#6e6e6e'} />
                    <Text style={[ styles.tabText, focused && styles.activeText ]}>
                      Profile
                    </Text>
                  </View>
                ),
              }}
            />

            <Tabs.Screen
              name="appnPreview"
              options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <View style={styles.tabItem} >
                    <Ionicons name='settings-outline' size={18} color={focused ? '#e83d82' : '#6e6e6e'} />
                    <Text style={[ styles.tabText, focused && styles.activeText ]}>
                      Settings
                    </Text>
                  </View>
                ),
              }}
            />

            <Tabs.Screen
              name="bookAppn"
              options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <View style={styles.tabItem} >
                    <Ionicons name='calendar-outline' size={18} color={focused ? '#e83d82' : '#6e6e6e'} />
                    <Text style={[ styles.tabText, focused && styles.activeText ]}>
                      Appointment
                    </Text>
                  </View>
                ),
              }}
            />

            <Tabs.Screen
              name="bookingSuccess"
              options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <View style={styles.tabItem} >
                    <Ionicons name='grid-outline' size={18} color={focused ? '#e83d82' : '#6e6e6e'} />
                    <Text style={[ styles.tabText, focused && styles.activeText ]}>
                      Dashboard
                    </Text>
                  </View>
                ),
              }}
            /> */}
          </Tabs>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
    paddingVertical: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff'
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
    color: '#e83d82',
    fontWeight: 'bold',
  },
});