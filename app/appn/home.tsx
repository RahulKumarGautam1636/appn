import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { getCompanies, getDepartments, getMembers } from '../store/slices/slices';
import { CompCard, DeptCard, Card_1, DayBtn, getDatesArray } from '../components';
import { BASE_URL } from '@/constants';
import { getFrom } from '../components/utils';


const HomeScreen = () => {

    const dispatch = useDispatch();
    const compCode = useSelector((state: RootState) => state.compCode);
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const user = useSelector((state: any) => state.user);
    const { list, selected, status, error } = useSelector((state: RootState) => state.companies);
    const depts = useSelector((state: RootState) => state.depts);
    const [doctors, setDoctors] = useState({loading: true, data: {PartyMasterList: [], CompanyMasterList: []}, err: {status: false, msg: ''}})
    const [filterdates, setFilterDates] = useState({dates: getDatesArray(new Date(), 5), activeDate: new Date().toLocaleDateString('en-TT')});

    useEffect(() => {
        dispatch(getCompanies({ companyCode: compCode, userId: user.UserId ? user.UserId : 14701 }));
        dispatch(getMembers(compCode, user.UserId, user.MemberId));
    }, [user.UserId, compCode])

    useEffect(() => {
        dispatch(getDepartments({ companyCode: compCode }));
    }, [compCode])

    useEffect(() => {
        let controller = new AbortController();
        const getDoctors = async (companyCode: string, subCode: string, activeDate: string) => {
            if (!companyCode || subCode === ''  || !activeDate) return;
            const res = await getFrom(`${BASE_URL}/api/Values/Get?CID=${companyCode}&type=INTDOCT&prefixText=&Specialist=${subCode}&Sdate=${activeDate}&Area=&Pin=&LowerFeesRange=&UpperFeesRange=`, {}, setDoctors, controller.signal);                                                        
            if (res) {
                setTimeout(() => {
                    setDoctors(pre => ({loading: false, data: {...pre.data, PartyMasterList: res.data}, err: {status: false, msg: ''}}));
                }, 500)
            }                                                                                                   
        } 
        getDoctors(selected.EncCompanyId, depts.selected?.SubCode, '18/06/2025');  
        return () => controller.abort();
    }, [selected.EncCompanyId, depts.selected?.SubCode])

    return (
        <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100 '>
            <View className='p-4'>
                {isLoggedIn ? 
                    <View className="gap-3 flex-row items-center">
                        <Image className='shadow-lg rounded-full' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                        <View>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">{user.Name}</Text>
                            <Text className="font-Poppins text-gray-600 text-[11px]">{user.GenderDesc}, {user.Age} Years</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <View className="bg-white p-3 rounded-full shadow-lg">
                                <FontAwesome name="bell" size={20} color='#3b82f6' className='text-blue-500'/>
                            </View>
                        </View>
                    </View> :
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
                }
                <View className='relative my-3'>
                    <Feather className='absolute z-50 top-[13px] left-4' name="search" size={22} color='gray' />
                    <View className='z-10'>
                        <TextInput placeholder='Search Doctors..' className='bg-white pl-[3.3rem] pr-4 py-4 rounded-full shadow-lg shadow-blue-500' />
                    </View>
                    <Feather className='absolute z-50 top-[3px] right-[3px] bg-pink-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                </View>
                <Text className="font-PoppinsBold text-gray-800 text-[16px] leading-[23px] mt-2">Upcoming Schedule (3)</Text>
                <View className='bg-pink-500 rounded-3xl p-5 my-3'>
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
                {(() => {
                    if (depts.status === 'loading') {
                        return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">Loading...</Text>
                    } else if (depts.error) {
                        return;
                    } else {
                        return (
                            <View className='py-3'>
                                <ScrollView horizontal={true} contentContainerClassName='items-start flex-row gap-4' showsHorizontalScrollIndicator={false}>
                                    {depts.list.map((dept: any) => {
                                        return <DeptCard data={dept} key={dept.SubCode} />
                                    })}
                                </ScrollView>
                            </View>
                        )
                    }
                })()}
                
                {(() => {
                    if (status === 'loading') {
                        return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">Loading...</Text>
                    } else if (error) {
                        return;
                    } else {
                        return (
                            <ScrollView horizontal={true} contentContainerClassName='py-3 px-[2] gap-4' showsHorizontalScrollIndicator={false}>
                                {list.map((i: any) => <CompCard data={i} key={i.EncCompanyId} active={selected?.EncCompanyId === i.EncCompanyId}/>)}
                            </ScrollView>
                        )
                    }
                })()}

                {/* <Text className="font-PoppinsBold text-gray-800 text-[16px] leading-[23px] mt-3">Upcoming Schedule (3)</Text>
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
                </View> */}
                <View className='px-2 pb-1 flex-row justify-around'>
                    {filterdates.dates.map((i: any) => <DayBtn data={i} key={i.date} activeDate={filterdates.activeDate} handleActive={setFilterDates} />)}
                    {/* <DayBtn day='Tue' date='11'/>
                    <DayBtn day='Tue' date='12' active/>
                    <DayBtn day='Wed' date='13'/>
                    <DayBtn day='hur' date='14'/>
                    <DayBtn day='Fri' date='15'/>
                    <DayBtn day='Sat' date='16'/>
                    <DayBtn day='Sun' date='17'/> */}
                </View>
                <View className='justify-between flex-row py-3'>
                    <Text className="font-PoppinsBold text-gray-800 text-[16px] leading-[23px] mt-3">Popular Doctors (3)</Text>
                    <Text className="font-PoppinsMedium text-pink-600 text-[16px] leading-[23px] mt-3">See All</Text>
                </View> 
                <View className='mt-2 gap-4'>
                    {doctors.data.PartyMasterList.map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} selectedDate={filterdates.activeDate} />)}
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