import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Heart from '../../assets/icons/departments/heart.svg';
import { Link } from 'expo-router';


const HomeScreen = () => {


    return (
        <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100'>
            <View className='p-4'>
                <View className="gap-3 flex-row items-center">
                    <Image className='rounded-full' source={require('../../assets/images/logo.png')} style={{ width: 40, height: 40 }} />
                    <View className='mr-auto'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Healthify</Text>
                        <Text className="font-Poppins text-gray-600 text-[11px]">Healthcare at it's best.</Text>
                    </View>
                    <Link href={'/login'}>
                        <View className="gap-2 flex-row items-center bg-white p-2 rounded-full shadow-lg">
                            <Ionicons name="enter" size={25} color='#3b82f6' className='text-blue-500' />
                            <Text className='font-PoppinsMedium leading-5 text-slate-700'>Login </Text>
                        </View>
                    </Link>
                </View>

                {/* <View className="gap-3 flex-row items-center">
                    <Image className='shadow-lg rounded-full' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                    <View>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Abhinandan Shaw</Text>
                        <Text className="font-Poppins text-gray-600 text-[11px]">Male, 35 Years</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <View className="bg-white p-3 rounded-full shadow-lg">
                            <FontAwesome name="bell" size={20} color='#3b82f6' className='text-blue-500'/>
                        </View>
                    </View>
                </View> */}
                <View className='relative my-3'>
                    <Feather className='absolute z-50 top-[13px] left-4' name="search" size={22} color='gray' />
                    <View className='z-10'>
                        <TextInput placeholder='Search Doctors..' className='bg-white pl-[3.3rem] pr-4 py-4 rounded-full shadow-lg shadow-blue-500' />
                    </View>
                    <Feather className='absolute z-50 top-[3px] right-[3px] bg-pink-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                </View>
                <View className='py-3'>
                    <ScrollView horizontal={true} contentContainerClassName='items-start flex-row gap-4' showsHorizontalScrollIndicator={false}>
                        <View className='items-center shadow-lg'>
                            <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
                                <Heart width={24} height={24} />
                            </View>
                            <Text className='text-[12px]'>Cardiology</Text>
                        </View>
                        <View className='items-center shadow-lg'>
                            <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
                                <Heart width={24} height={24} />
                            </View>
                            <Text className='text-[12px]'>Dentist</Text>
                        </View>
                        <View className='items-center shadow-lg'>
                            <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
                                <Heart width={24} height={24} />
                            </View>
                            <Text className='text-[12px]'>ENT</Text>
                        </View>
                        <View className='items-center shadow-lg'>
                            <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
                                <Heart width={24} height={24} />
                            </View>
                            <Text className='text-[12px]'>Neurology</Text>
                        </View>
                        <View className='items-center shadow-lg'>
                            <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
                                <Heart width={24} height={24} />
                            </View>
                            <Text className='text-[12px]'>Physician</Text>
                        </View>
                        <View className='items-center shadow-lg'>
                            <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
                                <Heart width={24} height={24} />
                            </View>
                            <Text className='text-[12px]'>Optometrist</Text>
                        </View>
                    </ScrollView>
                </View>
                <ScrollView horizontal={true} contentContainerClassName='py-3 px-[2] gap-4' showsHorizontalScrollIndicator={false}>
                    {[1,2,3,4].map(i => (
                        <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg' key={i}>
                            <Image className='shadow-lg rounded-xl' source={require('../../assets/images/doctor.jpg')} style={{ width: 65, height: 65 }} />
                            <View>
                                <Text className="font-PoppinsSemibold text-sky-800 text-[13px]">XYZ Hospitals</Text>
                                <View className='mt-1 flex gap-2 flex-row items-center'>
                                    <FontAwesome5 name="clock" size={12} color="gray" />
                                    <Text className="text-gray-500 font-PoppinsMedium text-[11px] leading-5">08:00 AM &nbsp;-&nbsp; 9:30 AM</Text>
                                </View>
                                <View className='mt-1 flex gap-2 flex-row items-center'>
                                    <FontAwesome5 name="map-marker-alt" size={12} color="gray" />
                                    <Text className="text-gray-500 font-PoppinsMedium text-[11px] leading-5">1145 Ingram Street, OH 4588</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <Text className="font-PoppinsBold text-gray-800 text-[16px] leading-[23px] mt-3">Upcoming Schedule (3)</Text>
                <View className='bg-pink-500 rounded-3xl p-5 mt-4'>
                    <View className='flex-row'>
                        <Image className='shadow-lg rounded-full me-3' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                        <View>
                            <Text className="font-PoppinsBold text-white text-[14px]">Prof. Dr. Logan Mason</Text>
                            <Text className="font-Poppins text-gray-200 text-[11px]">Orthopedic Consultation</Text>
                        </View>
                        <View className="bg-pink-400 py-[11px] px-[13px] rounded-full shadow-lg ms-auto">
                            <FontAwesome name="arrow-right" size={20} color='#fff' />
                        </View>
                    </View>
                    <View className='py-3 px-4 bg-pink-400 mt-4 rounded-2xl flex gap-3 flex-row '>
                        <FontAwesome5 name="calendar-alt" size={17} color="#fff" />
                        <Text className="font-Poppins text-gray-100 text-[13px] me-auto leading-5">June 12, 2025</Text>
                        <FontAwesome5 name="clock" size={17} color="#fff" />
                        <Text className="font-Poppins text-gray-100 text-[13px] leading-5">9:30 AM</Text>
                    </View>
                </View>
                <View className='justify-between flex-row py-3'>
                    <Text className="font-PoppinsBold text-gray-800 text-[16px] leading-[23px] mt-3">Popular Doctors (3)</Text>
                    <Text className="font-PoppinsMedium text-pink-600 text-[16px] leading-[23px] mt-3">See All</Text>
                </View> 
                <View className='mt-2 gap-4'>
                    {[1,2,3,4].map(i => (
                        <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg' key={i}>
                            <Image className='shadow-lg rounded-xl' source={require('../../assets/images/doctor.jpg')} style={{ width: 70, height: 70 }} />
                            <View className='flex-1'>
                                <Text className="font-PoppinsSemibold text-gray-800 text-[14px]">Dr. Amelia Emma</Text>
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[8px]">Gynacologist</Text>
                                <Text className="font-PoppinsMedium text-gray-800 text-[11px]">⭐ 4.9 
                                    &nbsp;<Text className='text-gray-500'>(2435 Reviews)</Text>
                                </Text>
                            </View>
                            <View className='justify-between items-end'>
                                <Ionicons name="arrow-forward-outline" size={20} color="#64748b" className='text-slate-500'/>
                                <Text className="font-PoppinsSemibold text-pink-600 text-[12px]">₹600/hr</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});