import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";


const BookAppn = () => {


    return (
        <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100'>
            <View className='bg-white'>
                <View className='justify-between flex-row p-4 items-center'>
                    <View className='flex-row items-center gap-3'>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">General Doctors</Text>
                    </View>
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
                <View className='flex-row justify-around p-4 border-y border-gray-300 border-solid'>
                    <View className='items-center flex-1'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mb-1">14 Years</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Experience</Text>
                    </View>
                    <View className='items-center flex-1 border-x border-gray-300'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mb-1">2566</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Patients</Text>
                    </View>
                    <View className='items-center flex-1'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mb-1">⭐ 4.5k</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Reviews</Text>
                    </View>
                </View>
            </View>
            <View className='px-4 flex-row gap-2 justify-around bg-white border-b-2 border-gray-300'>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center border-b-2 border-pink-600">Schedule</Text>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">About</Text>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Clinics</Text>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Reviews</Text>
            </View>
            <View className='justify-between flex-row px-4 pt-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    {/* <Ionicons name="arrow-back-outline" size={24} color="black" /> */}
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Today's Schedule</Text>
                </View>
                <View className="gap-3 flex-row items-center ml-auto">
                    <Feather name="chevron-left" size={24} color='#6b7280' />
                    <Feather name="chevron-right" size={24} color='#6b7280' />
                </View>
            </View>
            <View className='px-2 pb-1 flex-row justify-around'>
                <DayBtn day='Tue' date='11'/>
                <DayBtn day='Tue' date='12' active/>
                <DayBtn day='Wed' date='13'/>
                <DayBtn day='hur' date='14'/>
                <DayBtn day='Fri' date='15'/>
                <DayBtn day='Sat' date='16'/>
                <DayBtn day='Sun' date='17'/>
            </View>
            {/* <View className='justify-between flex-row p-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Choose Schedule Time</Text>
                </View>
            </View> */}
            <View className='p-4 bg-white rounded-xl shadow-md shadow-gray-300 mt-4'>
                {/* <View className='flex-row items-center gap-3 border-b border-gray-300 pb-3'>
                    <Feather name="sun" size={20} color="#fff" className='px-[9px] py-[9px] bg-orange-400 rounded-full' />
                    <View>
                        <Text className="font-PoppinsBold text-[14px]">Morning</Text>
                        <Text className="font-Poppins text-gray-500 text-[11px]">08:30 AM - 12:00 PM</Text>
                    </View>
                    <Feather name="chevron-up" size={24} color="gray" className='ml-auto' />
                </View> */}
                <View className='justify-start flex-row flex-wrap gap-3'>
                    <SlotBtn time='08:30' />
                    <SlotBtn time='09:00' />
                    <SlotBtn time='09:30' active />
                    <SlotBtn time='10:00' />
                    <SlotBtn time='10:30' />
                    <SlotBtn time='11:00' />
                    <SlotBtn time='11:30' />
                    <SlotBtn time='12:00' />
                    <SlotBtn time='04:00' />
                    <SlotBtn time='04:30' />
                    <SlotBtn time='05:00' />
                    <SlotBtn time='05:30' />
                </View>
            </View>
        </ScrollView>
    )
}

export default BookAppn;

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
        <View className={`border-2 rounded-lg px-3 py-1 flex-1 ${active ? 'bg-pink-50 border-pink-400' : 'bg-gray-50 border-gray-300'}`}>
            <Text className={`font-Poppins leading-6 text-sm text-center ${active ? 'text-pink-500' : 'text-gray-600'}`}>{time}</Text>
        </View>
    )
}