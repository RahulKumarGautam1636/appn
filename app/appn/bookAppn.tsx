import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ButtonPrimary from '../../src/components';
// import MyBottomSheet from '../components/bottomSheet';



// import { GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';
// import TestCard from '../components/bottomSheet';


const BookAppn = () => {


    // const offset = useSharedValue({ x: 0, y: 0 });
    // const start = useSharedValue({ x: 0, y: 0 });
    // const popupPosition = useSharedValue({ x: 0, y: 0 });
    // const popupAlpha = useSharedValue(0);

    // const animatedStyles = useAnimatedStyle(() => {
    //     return {
    //     transform: [
    //         { translateX: offset.value.x },
    //         { translateY: offset.value.y },
    //     ],
    //     };
    // });

    // const animatedPopupStyles = useAnimatedStyle(() => {
    //     return {
    //     transform: [
    //         { translateX: popupPosition.value.x },
    //         { translateY: popupPosition.value.y },
    //     ],
    //     opacity: popupAlpha.value,
    //     };
    // });

    // const dragGesture = Gesture.Pan()
    //     .onStart((_e) => {
    //     popupAlpha.value = withTiming(0);
    //     })
    //     .onUpdate((e) => {
    //     offset.value = {
    //         x: e.translationX + start.value.x,
    //         y: e.translationY + start.value.y,
    //     };
    //     })
    //     .onEnd(() => {
    //     start.value = {
    //         x: offset.value.x,
    //         y: offset.value.y,
    //     };
    //     });

    // const longPressGesture = Gesture.LongPress().onStart((_event) => {
    //     popupPosition.value = { x: offset.value.x, y: offset.value.y };
    //     popupAlpha.value = withTiming(1);
    // });

    // const composed = Gesture.Race(dragGesture, longPressGesture);


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
                    <Image className='' source={require('@/assets/images/doctor.jpg')} style={{ width: 80, height: 80 }} />
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
            <View className='px-4 flex-row gap-2 justify-between bg-white border-b-2 border-gray-300'>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center border-b-2 border-primary-600">Schedule</Text>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">About</Text>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Clinics</Text>
                <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Reviews</Text>
            </View>

            {/* <View className='justify-between flex-row px-4 pt-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Clinics</Text>
                </View>
                <View className="gap-3 flex-row items-center ml-auto">
                    <Feather name="chevron-left" size={24} color='#6b7280' />
                    <Feather name="chevron-right" size={24} color='#6b7280' />
                </View>
            </View>
            <View>
                <ScrollView horizontal={true} contentContainerClassName='p-4 gap-4' showsHorizontalScrollIndicator={false}>
                    {[1,2,3,4].map(i => (
                        <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg' key={i}>
                            <Image className='shadow-lg rounded-xl' source={require('@/assets/images/doctor.jpg')} style={{ width: 65, height: 65 }} />
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
            </View> */}

            {/* <View className='bg-white m-4 rounded-xl shadow-md shadow-gray-300'>
                <View className='justify-between flex-row px-4 py-3 items-center border-b border-gray-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Clinics</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Text className="font-Poppins text-gray-600 text-[12px] leading-5">2 more clinics</Text>
                        <Feather name="chevron-down" size={24} color='#6b7280' />
                    </View>
                </View>

                <View className='flex-row items-center gap-4 p-4'>
                    <Feather name="sun" size={20} color="#fff" className='px-[9px] py-[9px] bg-orange-400 rounded-full' />
                    <View className='flex-1'>
                        <Text className="font-PoppinsMedium text-[14px]">Southern California Hospital</Text>
                        <Text className="font-PoppinsSemibold text-slate-500 text-[11px]">08:30 AM - 12:00 PM</Text>
                        <Text className="font-Poppins text-gray-500 text-[11px]" numberOfLines={1}>Ramnagar Kalitala Road, Ranaghat, Nadia</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="gray" className='ml-auto' />
                </View>
            </View> */}

            <View className='bg-primary-500 m-3 mb-4 rounded-3xl shadow-md shadow-primary-700 overflow-hidden'>
                <View className='justify-between flex-row px-5 pt-2 pb-[5] items-center border-b border-primary-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">Clinics</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        {/* <Feather name="chevron-left" size={24} color='#6b7280' /> */}
                        <Text className="font-Poppins text-white text-[12px] leading-4">2+ clinics</Text>
                        <Feather name="chevron-down" size={24} color='#fff' />
                    </View>
                </View>

                <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                    {/* <Feather name="sun" size={26} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full' /> */}
                    {/* <FontAwesome5 name="hospital" size={60} color="#fff" className='px-1' /> */}
                    <View className='flex-1'>
                        <Text className="font-PoppinsSemibold text-[15px] text-white">Southern California Hospital</Text>
                        {/* <Text className="font-PoppinsSemibold text-gray-200 text-[11px] mt-1">08:30 AM - 12:00 PM</Text> */}
                        <View className='mt-2 '>
                            <View className='flex gap-3 flex-row items-center'>
                                {/* <FontAwesome5 name="calendar-alt" size={17} color="#fff" />
                                <Text className="font-Poppins text-gray-100 text-[13px] me-auto leading-5">June 12, 2025</Text> */}
                                <FontAwesome5 name="clock" size={14} color="#fff" />
                                <Text className="font-PoppinsMedium text-gray-100 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                            </View>
                            <View className='flex gap-3 flex-row items-center mt-2'>
                                {/* <FontAwesome5 name="calendar-alt" size={17} color="#fff" />
                                <Text className="font-Poppins text-gray-100 text-[13px] me-auto leading-5">June 12, 2025</Text> */}
                                <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />
                                {/* <MaterialCommunityIcons name="map-marker-outline" size={14} color="#fff" /> */}
                                <Text className="font-Poppins text-gray-100 text-[11px] leading-5" numberOfLines={1}>Ramnagar Kalitala Road, Ranaghat, Nadia</Text>
                            </View>
                        </View>
                        {/* <Text className="font-Poppins text-slate-100 text-[11px] mt-2" numberOfLines={1}>Ramnagar Kalitala Road, Ranaghat, Nadia</Text> */}
                    </View>
                    <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full'  />
                </View>
            </View>


            <View className='justify-between flex-row px-4 pt-1 items-center'>
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
            <View className='py-5 px-4 pb-2 bg-white shadow-md shadow-gray-300 mt-4'>
                {/* <View className='flex-row items-center gap-3 border-b border-gray-300 pb-3'>
                    <Feather name="sun" size={20} color="#fff" className='px-[9px] py-[9px] bg-orange-400 rounded-full' />
                    <View>
                        <Text className="font-PoppinsBold text-[14px]">Morning</Text>
                        <Text className="font-Poppins text-gray-500 text-[11px]">08:30 AM - 12:00 PM</Text>
                    </View>
                    <Feather name="chevron-up" size={24} color="gray" className='ml-auto' />
                </View> */}
                <View className='justify-start flex-row flex-wrap' style={{columnGap: '3.5%', 
                    // rowGap: '6.5%'
                    }}>
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
            <ButtonPrimary title='Book Appointment' active={true} onPress={() => {}} classes='m-4' />
            {/* <MyBottomSheet /> */}

            {/* <Animated.View>
                <Popup style={animatedPopupStyles} />
                <GestureDetector gesture={composed}>
                    <TestCard style={animatedStyles} />
                </GestureDetector>
            </Animated.View> */}

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
            <View className={`items-center justify-center h-11 w-12 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-primary-500' : 'bg-white'}`}>
                <Text className={`font-PoppinsMedium text-gray-600 text-[13px] leading-5 ${active ? 'text-white' : ''}`}>{date}</Text>
            </View>
        </View>
    )
} 

const SlotBtn = ({ time, active }: any) => {
    return (
        <View className={`border-2 rounded-lg px-3 py-1 mb-3 ${active ? 'bg-primary-50 border-primary-400' : 'bg-gray-50 border-gray-300'}`} style={{width: '17.1%'}}>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time}</Text>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>AM</Text>
        </View>
    )
}



 