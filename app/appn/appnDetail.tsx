import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '@/src/store/slices/slices';
import { myColors } from '@/src/constants';
import { RootState } from '@/src/store/store';
import { GradientBG } from '@/src/components/utils';
import { MyModal } from '@/src/components';
import InvoicePreview from '@/app/appn/bill';
import { useState } from 'react';
import Prescription from './prescription';
// import { Link } from 'expo-router';
// import ButtonPrimary from '@/src/components';
// import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// import { useEffect } from 'react';
// import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AppnDetail = ({ data, handleOpen }: any) => {

    const dispatch = useDispatch();
    const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);
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

    const [bill, setBill] = useState(false);
    const [presc, setPresc] = useState(false);

    return (
        <>
        <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100'>
            <GradientBG>
            <View className='bg-white'>
                <View className='justify-between flex-row p-4 items-center'>
                    {/* <Link href={'/login'}> */}
                        <Pressable onPress={() => dispatch(setModal({name: 'APPN_DETAIL', state: false}))} className='flex-row items-center gap-3'>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment Details</Text>
                        </Pressable>
                    {/* </Link> */}
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View>
                </View>
                <View className='flex-row gap-4 p-[13px]'>
                    <Image className='' source={require('../../assets/images/doctor.jpg')} style={{ width: 80, height: 80 }} />
                    <View>
                        <Text className="font-PoppinsSemibold text-sky-800 text-[15px] mb-2">{data.AppointmentTo}</Text>
                        <View className='flex-row gap-2'>
                            <FontAwesome name="graduation-cap" size={15} color="#075985" />
                            <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{data.DocQualification}</Text>
                        </View>
                        <View className='flex-row gap-2'>
                            <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                            <Text className="font-PoppinsMedium text-gray-800 text-[12px]">{data.DocSpecialistDesc}</Text>
                        </View>
                    </View>
                </View>
                <View className='flex-row justify-between p-4 border-y border-gray-300 border-solid'>
                    <View className='items-center flex-1'>
                        <Feather name="phone-call" size={24} className='mb-2' color={myColors.primary[500]} />
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Call</Text>
                    </View>
                    <View className='items-center flex-1 border-x border-gray-300'>
                        <MaterialCommunityIcons name="message-text-outline" size={24} className='mb-2' color={myColors.primary[500]} />
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Message</Text>
                    </View>
                    <View className='items-center flex-1'>
                        <Feather name="video" size={24} className='mb-2' color={myColors.primary[500]} />
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
                    <Text className="font-PoppinsBold text-[14px]">{data.PartyName}</Text>
                    <Text className="font-Poppins text-gray-500 text-[11px]">Myself</Text>
                </View>
                <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" />
            </View>
            <View className='py-3 px-4 bg-gray-100 mt-4 rounded-xl'>
                <View className='gap-3 flex-row'>
                    <FontAwesome name="user" size={17} color="gray" />
                    <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">28 Years, &nbsp;&nbsp; Male</Text>
                    {/* <FontAwesome name="user" size={17} color="gray" /> */}
                    {data.UHID ? <><FontAwesome5 name="info-circle" size={17} color="gray" />
                    <Text className="font-Poppins text-gray-500 text-[13px] leading-5">MRD : {data.UHID}</Text></> : null}
                </View>
                {/* <View className='gap-3 flex-row mt-4'>
                    <FontAwesome6 name="hourglass-half" size={17} color="gray" />
                    <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">28 Years</Text>
                    <FontAwesome name="user" size={17} color="gray" />
                    <Text className="font-Poppins text-gray-500 text-[13px] leading-5">Male</Text>
                </View> */}
            </View>
            <Text className="text-sm pt-4 text-gray-500 leading-6">
                <Text className="text-primary-500">Appointment Note : </Text>
                Prescriptions, Reports and Documents added by Patient will apear here.
            </Text>
            </View>
            <View className='justify-between flex-row px-4 pt-1 pb-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment</Text>
                </View>
            </View>
            <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
                {/* <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Reference No.</Text>
                    </View>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] ml-auto leading-5">{data.TranNo}</Text>
                </View> */}
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Department</Text>
                    <Text className="font-PoppinsSemibold text-[14px] text-slate-600">{data.DeptName}</Text>
                </View>
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Reference No.</Text>
                    <Text className="font-PoppinsSemibold text-[14px] text-slate-600">{data.TranNo}</Text>
                </View>
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Status</Text>
                    <FontAwesome name="check" size={17} color={data.IsAppConfirmed === 'Y' ? '#00ad44' : '#009efb'} />
                    <Text className="font-PoppinsSemibold text-[14px]" style={{color: data.IsAppConfirmed === 'Y' ? '#00ad44' : '#009efb'}}>{ data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Booked' }</Text>
                </View>
                <View className='flex-row gap-3 p-4'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Service Status</Text>
                    <FontAwesome name="check" size={17} color={data.Status === 'Y' ? '#00ad44' : '#f29101'} />
                    <Text className="font-PoppinsSemibold text-[14px]" style={{color: data.Status === 'Y' ? '#00ad44' : '#f29101'}}>{ data.Status === 'Y' ? 'Done' : 'Pending' }</Text>
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
                <FontAwesome5 name="clock" size={17} color={myColors.primary[500]} />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">{data.NextAppTime}</Text>
                <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">{new Date(data.NextAppDate).toLocaleDateString('en-TT')}</Text>
                </View>
            </View>
            <View className='justify-between flex-row px-4 pt-1 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Clinic Details</Text>
                </View>
            </View>
            <View className='bg-primary-500 mb-[1.15rem] rounded-3xl shadow-md shadow-primary-700 overflow-hidden m-4'>
                <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                    <View className='flex-1'>
                        <Text className="font-PoppinsSemibold text-[15px] text-white" numberOfLines={1}>{selectedCompany.COMPNAME}</Text>
                        <View className='mt-[10px]'>
                            <View className='flex gap-3 flex-row items-center'>
                                <FontAwesome5 name="clock" size={14} color="#fff" />
                                <Text className="font-PoppinsMedium text-gray-100 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                            </View>
                            <View className='flex gap-3 flex-row items-center mt-2'>
                                <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />
                                <Text className="font-Poppins text-gray-100 text-[11px] leading-5" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                            </View>
                        </View>
                    </View>
                    <Link href={`/appn/clinic/${selectedCompany.CompanyId}`}>
                        <View>
                            <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full'  />
                        </View>
                    </Link>
                </View>
            </View>
            <View className='justify-between flex-row px-4 pt-1 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Payment</Text>
                </View>
            </View>
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-4 pl-5 items-center border-b border-gray-300'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Bill Details</Text>
                </View>
            </View>

            <View className='gap-3 px-5 py-4'>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Booking Fee</Text>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 200</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Platform Fee</Text>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 10</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Total Amount</Text>
                    <Text className="font-PoppinsSemibold text-blue-600 text-[13px]">₹ 210</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Payment Status</Text>
                    <Text className="font-PoppinsSemibold text-green-600 text-[13px]">
                        <FontAwesome name="check" size={17} color="#16a34a" />  Paid
                    </Text>
                </View>
                {/* <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsSemibold text-gray-500 text-[12px]">Payment Method</Text>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">ONLINE / UPI</Text>
                </View> */}
            </View>
            <View className='justify-between flex-row p-4 items-center border-t border-gray-300'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px]">Payment Method</Text>
                <Text className="font-PoppinsSemibold text-purple-600 text-[14px]">ONLINE / UPI</Text>
            </View>
            </View>
            {/* <View className='flex-row gap-2 p-4 bg-white'>
                <ButtonPrimary title='Reschedule' active={false} onPress={() => {}} classes='flex-1 py-3' textClasses='text-gray-800' />
                <ButtonPrimary title='Cancel' active={true} onPress={() => {}} classes='flex-1 py-3' />
            </View> */}
            <View className='flex-row justify-between border-y border-gray-300 border-solid p-4 bg-white gap-2'>
                <TouchableOpacity onPress={() => setBill(true)} className={`items-center flex-1 py-3 rounded-lg ${!data.BillId ? 'bg-slate-200 pointer-events-none' : 'bg-green-500'}`}>
                    <Text className={`font-PoppinsMedium ${!data.BillId ? 'text-gray-500' : 'text-white'}`}>Bill</Text>                        
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPresc(true)} className={`items-center flex-1 py-3 rounded-lg ${!data.PrescriptionId ? 'bg-slate-200 pointer-events-none' : 'bg-blue-500'}`}>
                    <Text className={`font-PoppinsMedium ${!data.PrescriptionId ? 'text-gray-500' : 'text-white'}`}>Prescription</Text>
                </TouchableOpacity>
                {data.IsAppConfirmed !== 'Y' ? <TouchableOpacity className={`items-center flex-1 py-3 rounded-lg bg-red-500`}>
                    <Text className={`font-PoppinsMedium text-white`}>Cancel</Text>
                </TouchableOpacity> : null}
            </View>
            </GradientBG>
        </ScrollView>
        <MyModal modalActive={bill} onClose={() => setBill(false)}  name='BILL' child={<InvoicePreview />} />
        <MyModal modalActive={presc} onClose={() => setPresc(false)}  name='BILL' child={<Prescription id={data.PrescriptionId} />} />
        </>
    )
}

export default AppnDetail;

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});



 