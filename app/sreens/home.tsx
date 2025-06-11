import { Entypo } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import Search from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Heart from '../../assets/icons/departments/heart.svg';


const HomeScreen = () => {


    return (
        <View style={styles.screen} className="bg-slate-100 p-4">
            <View className="justify-between flex-row" style={styles.greet}>
                <View className="flex-col ">
                    <Text className="font-PoppinsBold text-gray-500 text-[16px] leading-[23px]">Hello!</Text>
                    <Text className="font-PoppinsBold text-gray-800 text-[18px]">
                        Jayden Smith&nbsp;
                        <Entypo name="hand" size={25} color="#F8C233" />
                    </Text>
                </View>
                <View className="gap-3 flex-row items-center">
                    <View className="bg-white p-3 rounded-full shadow-lg">
                        <FontAwesome name="bell" size={20} color='#3b82f6' className='text-blue-500'/>
                    </View>
                    <Image className='shadow-lg rounded-full' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                </View>
            </View>
            <View className='relative my-3'>
                <Feather className='absolute z-50 top-[13px] left-4' name="search" size={22} color='gray' />
                <View className='z-10'>
                    <TextInput placeholder='Search Doctors..' className='bg-white pl-[3.3rem] pr-4 py-4 rounded-full shadow-lg shadow-blue-500' />
                </View>
                {/* <Ionicons className='absolute z-50 top-[13px] right-4' name="filter" size={24} color="black" /> */}
                {/* <FontAwesome6 name="sliders" size={24} color="black" /> */}
                <Feather className='absolute z-50 top-[3px] right-[3px] bg-pink-600 p-[10px] rounded-full items-center' name="sliders" size={21} color="#fff" />
            </View>
            <View>
                <View>
                    {/* <Image className='shadow-lg rounded-full' source={require('../../assets/icons/departments/heart.svg')} style={{ width: 40, height: 40 }} /> */}
                    <Heart width={24} height={24} />
                    <Text>Cardiology</Text>
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