import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {

  const tabs = [
    { name: 'OPD', icon: 'home-outline', key: 'home' },
    { name: 'Lab Test', icon: 'calendar-outline', key: 'appnList' },
    { name: 'Account', icon: 'person-outline', key: 'profile' },
    // { name: 'Dashboard', icon: 'grid-outline', key: 'bookAppn' },
    // { name: 'Cart', icon: 'settings-outline', key: 'members' },
  ]
  
  const router = useRouter()
  return (
    <Tabs
      tabBar={({ state, descriptors, navigation }: any) => {        
        return (
          <View style={styles.tabBar} className='border-y border-slate-200'>
            {tabs.map((tab, index) => {
              const isFocused = state.routes[state.index]?.name === tab.key;
              const onPress = () => router.push(`/appn/${tab.key}`);

              // const onPress = () => {
              //   const event = navigation.emit({
              //     type: 'tabPress',
              //     target: state.routes[index].key,
              //     canPreventDefault: true,
              //   });
    
              //   if (!isFocused && !event.defaultPrevented) {
              //     navigation.navigate(tab.key);
              //   }
              // };
              
              return (
                <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tabItem} className={`flex-1 py-[10px] ${isFocused ? 'border- border-pink-500' : ''}`}>
                  <Ionicons name={tab.icon} size={18} color={isFocused ? '#e83d82' : '#6e6e6e'} />
                  <Text  style={[ styles.tabText, isFocused && styles.activeText ]}>
                    {tab.name}
                  </Text>
                  {isFocused && <View className="absolute w-full bottom-0 left-0 h-[2px] bg-pink-500"></View>}
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      }
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        animation: 'shift',
        transitionSpec: { animation: 'timing', config: { duration: 250, }, },
      }}
    >
      {/* {tabs.map(tab => (
        <Tabs.Screen
          key={tab.key}
          name={tab.key}
          options={{
            title: tab.name,
            // unmountOnBlur: true,
          }}
        />
      ))} */}
    </Tabs>
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
    // paddingVertical: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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