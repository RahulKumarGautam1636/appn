import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ButtonPrimary from '../components';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AppnList = () => {

    // const isFocused = useIsFocused();
    // const translateX = useSharedValue(width); 

    // const animatedStyle = useAnimatedStyle(() => ({
    //     transform: [{ translateX: translateX.value }],
    // }));

    // useEffect(() => {
    //     if (isFocused) {
    //     translateX.value = width;
    //     translateX.value = withTiming(0, { duration: 500 });
    //     }
    // }, [isFocused]);

    return (
        // <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100'>
                <View className='bg-white'>
                    <View className='justify-between flex-row p-4 items-center'>
                        <Link href={'/login'}>
                            <View className='flex-row items-center gap-3'>
                                <Ionicons name="arrow-back-outline" size={24} color="black" />
                                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment Details</Text>
                            </View>
                        </Link>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Feather name="heart" size={20} color='black' />
                            <Feather name="share-2" size={20} color='black' />
                        </View>
                    </View>
                    <View className='flex-row gap-4 p-[13px]'>
                        <Image className='' source={require('../../assets/images/doctor.jpg')} style={{ width: 80, height: 80 }} />
                        <View>
                            <Text className="font-PoppinsSemibold text-sky-800 text-[15px] mb-2">Dr. Amelia Emma</Text>
                            <View className='flex-row gap-2'>
                                <FontAwesome name="graduation-cap" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">Gynacologist</Text>
                            </View>
                            <View className='flex-row gap-2'>
                                <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-800 text-[12px]">Qualification Level</Text>
                            </View>
                        </View>
                    </View>
                    <View className='flex-row justify-between p-4 border-y border-gray-300 border-solid'>
                        <View className='items-center flex-1'>
                            <Feather name="phone-call" size={24} className='mb-2' color="#ec4899" />
                            <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Call</Text>
                        </View>
                        <View className='items-center flex-1 border-x border-gray-300'>
                            <MaterialCommunityIcons name="message-text-outline" size={24} className='mb-2' color="#ec4899" />
                            <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Message</Text>
                        </View>
                        <View className='items-center flex-1'>
                            <Feather name="video" size={24} className='mb-2' color="#ec4899" />
                            <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Video</Text>
                        </View>
                    </View>
                </View>
                <View className='justify-between flex-row px-4 pt-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Patient Details</Text>
                </View>
            </View>
            <View className='bg-white rounded-3xl p-5 m-4 shadow-md shadow-gray-400'>
            <View className='flex-row items-center'>
                <Image className='shadow-lg rounded-full me-3' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                <View>
                    <Text className="font-PoppinsBold text-[14px]">Abhinandan Shaw</Text>
                    <Text className="font-Poppins text-gray-500 text-[11px]">Myself</Text>
                </View>
                <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" />
            </View>
            <View className='py-3 px-4 bg-gray-100 mt-4 rounded-xl flex gap-3 flex-row'>
                <FontAwesome6 name="hourglass-half" size={17} color="gray" />
                <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">28 Years</Text>
                <FontAwesome name="user" size={17} color="gray" />
                <Text className="font-Poppins text-gray-500 text-[13px] leading-5">Male</Text>
            </View>
            <Text className="text-sm pt-4 text-gray-500 leading-6">
                <Text className="text-pink-500">Appointment Note: </Text>
                Patient note of his medical history patient note of his medical history.
            </Text>
            </View>
            <View className='justify-between flex-row px-4 pt-1 pb-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment</Text>
                </View>
            </View>
            <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
                <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Reference No.</Text>
                    </View>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] ml-auto leading-5">S444512</Text>
                </View>

                <View className='flex-row gap-3 p-4'>
                <Text className="font-PoppinsSemibold text-slate-700 text-[14px] mr-auto">Status</Text>
                <FontAwesome name="check" size={17} color="#16a34a" />
                <Text className="font-PoppinsSemibold text-green-600 text-[14px]">Confirmed</Text>
                </View>
            </View>
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
                <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Time & Date</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <FontAwesome name="pencil" size={18} color="#6b7280" />
                    </View>
                </View>

                <View className='flex-row gap-3 p-4'>
                <FontAwesome5 name="clock" size={17} color="#000" />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-8">08:30 AM</Text>
                <FontAwesome5 name="calendar-alt" size={17} color="#000" />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">17 Feb, 2024</Text>
                </View>
            </View>
            <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Clinic Details</Text>
                </View>
            </View>

            <View className='flex-row items-center gap-4 pl-5 pr-4 pt-3 pb-4'>
                <View className='flex-1'>
                <Text className="font-PoppinsMedium text-[14px]">Southern California Hospital</Text>
                <Text className="font-PoppinsSemibold text-slate-500 text-[11px] my-1">08:30 AM - 12:00 PM</Text>
                <Text className="font-Poppins text-gray-500 text-[11px]" numberOfLines={1}>Ramnagar Kalitala Road, Ranaghat, Nadia</Text>
                </View>
                <Feather name="chevron-right" size={24} color="gray" className='ml-auto' />
            </View>
            </View>
            <View className='justify-between flex-row px-4 pt-5 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Payment</Text>
                </View>
            </View>
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Bill Details</Text>
                </View>
            </View>

            <View className='gap-2 p-4'>
                <View className="flex-row justify-between items-center">
                <Text className="font-PoppinsSemibold text-gray-500 text-[12px]">Total Amount</Text>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">$ 200</Text>
                </View>
                <View className="flex-row justify-between items-center">
                <Text className="font-PoppinsSemibold text-gray-500 text-[12px]">Payment Status</Text>
                <Text className="font-PoppinsSemibold text-green-600 text-[13px]">
                    <FontAwesome name="check" size={17} color="#16a34a" />  Paid
                </Text>
                </View>
                <View className="flex-row justify-between items-center">
                <Text className="font-PoppinsSemibold text-gray-500 text-[12px]">Payment Method</Text>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">$ 200</Text>
                </View>
                <View className="flex-row justify-between items-center">
                <Text className="font-PoppinsSemibold text-gray-500 text-[12px]">Reference No.</Text>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">S000451</Text>
                </View>
            </View>
            {/* <View className='justify-between flex-row p-4 items-center border-t border-gray-300'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">Total Payable</Text>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">$ 210</Text>
            </View> */}
            </View>
            <View className='flex-row gap-2 p-4 bg-white'>
                <ButtonPrimary title='Reschedule' active={false} onPress={() => {}} classes='flex-1 py-3' textClasses='text-gray-800' />
                <ButtonPrimary title='Cancel' active={true} onPress={() => {}} classes='flex-1 py-3' />
            </View>
            </ScrollView>
        // </Animated.View>
    )
}

export default AppnList;

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});

const DayBtn = ({ day, date, active }: any) => {
    return (
        <View className='gap-3 flex-1 text-center items-center'>
            <Text className={`font-PoppinsMedium pt-4 text-[12px] ${active ? 'text-gray-600' : 'text-gray-400'}`}>{day}</Text>
            <View className={`items-center justify-center h-11 w-12 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-pink-500' : 'bg-white'}`}>
                <Text className={`font-PoppinsMedium text-gray-600 text-[13px] leading-5 ${active ? 'text-white' : ''}`}>{date}</Text>
            </View>
        </View>
    )
} 

const SlotBtn = ({ time, active }: any) => {
    return (
        <View className={`border-2 rounded-lg px-3 py-1 mb-3 ${active ? 'bg-pink-50 border-pink-400' : 'bg-gray-50 border-gray-300'}`} style={{width: '17.1%'}}>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-pink-500' : 'text-gray-500'}`}>{time}</Text>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-pink-500' : 'text-gray-500'}`}>AM</Text>
        </View>
    )
}



 