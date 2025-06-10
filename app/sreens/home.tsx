import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Image, StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {

    const [loaded, error] = useFonts({
        'Space-Mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
        'Poppins': require('../../assets/fonts/Poppins-Regular.ttf')
    });

    // useEffect(() => {
    //     if (loaded || error) {
    //         SplashScreen.hideAsync();
    //     }
    // }, [loaded, error]);

    return (
        <View style={styles.screen} className="bg-slate-100 p-4">
            <View className="justify-between flex-row rounded-lg" style={styles.greet}>
                <View className="flex-col">
                    <Text className="font-bold text-gray-600 text-[16px]" style={{fontFamily: 'Space-Mono'}}>Rahul Kumar</Text>
                    <Text className="font-bold text-gray-600 text-[16px] font-Poppins" style={{fontFamily: 'Poppins'}}>Rahul Kumar</Text>
                    {/* <Text className="font-bold text-gray-800 text-[20px]" style={{fontFamily: 'Space-Mono'}}>
                        Jayden Smith&nbsp;
                        <Entypo name="hand" size={25} color="#F8C233" />
                    </Text> */}
                </View>
                <View className="gap-3 flex-row items-center">
                    <View className="bg-white p-3 rounded-full">
                        <FontAwesome name="bell" size={20} color="orangered" />
                    </View>
                    <Image source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                </View>
            </View>

        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
},
greet: {
    // backgroundColor: 'teal',
}
});