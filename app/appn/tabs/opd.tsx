import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useEffect, useState } from 'react';
import { getCompanies, getDepartments, getMembers, setModal } from '@/src/store/slices/slices';
import { CompCard, DeptCard, Card_1, DayBtn, getDatesArray, mmDDyyyyDate } from '@/src/components';
import { BASE_URL } from '@/src/constants';
import { formatted, getFrom, GridLoader, ListLoader, NoContent } from '@/src/components/utils';


const HomeScreen = () => {

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const user = useSelector((state: any) => state.user);
    const company = useSelector((state: RootState) => state.company.info);
    const { list, selected, status, error } = useSelector((state: RootState) => state.companies);
    const depts = useSelector((state: RootState) => state.depts);
    const [doctors, setDoctors] = useState({loading: true, data: {PartyMasterList: [], CompanyMasterList: []}, err: {status: false, msg: ''}})
    const [otherDayDoctors, setOtherDayDoctors] = useState({loading: true, data: {PartyMasterList: [], CompanyMasterList: []}, err: {status: false, msg: ''}})
    const [filterdates, setFilterDates] = useState({dates: getDatesArray(new Date(), 30), activeDate: new Date().toLocaleDateString('en-TT')})
    const [appnData, setAppnData] = useState({loading: false, data: {PartyFollowupList: []}, err: {status: false, msg: ''}});
    const [doctorTab, setDoctorTab] = useState('active_date')

    useEffect(() => {
        let controller = new AbortController();
        const getDoctors = async (companyCode: string, subCode: string, activeDate: string) => {
            if (!companyCode || subCode === undefined  || !activeDate) return;
            const res = await getFrom(`${BASE_URL}/api/Values/Get?CID=${companyCode}&type=INTDOCT&prefixText=&Specialist=${subCode}&Sdate=${activeDate}&Area=&Pin=&LowerFeesRange=&UpperFeesRange=`, {}, setDoctors, controller.signal);                                                        
            if (res) {
                setTimeout(() => {
                    setDoctors(pre => ({loading: false, data: {...pre.data, PartyMasterList: res.data}, err: {status: false, msg: ''}}));
                }, 500)
            }                                                                                                   
        } 
        getDoctors(selected.EncCompanyId, depts.selected?.SubCode, filterdates.activeDate);  
        return () => controller.abort();
    }, [selected.EncCompanyId, depts.selected?.SubCode, filterdates.activeDate])

    useEffect(() => {
        let controller = new AbortController();
        const getOtherDayDoctors = async (companyCode: string, subCode: string) => {
            if (!companyCode || subCode === undefined) return;
            const res = await getFrom(`${BASE_URL}/api/Values/GetAllDoctors?CID=${companyCode}&SID=${subCode}`, {}, setOtherDayDoctors, controller.signal);                                                        
            if (res) {
                setTimeout(() => {
                    setOtherDayDoctors(pre => ({loading: false, data: {...pre.data, PartyMasterList: res.data}, err: {status: false, msg: ''}}));
                }, 500)
            }                                                                                                   
        } 
        getOtherDayDoctors(selected.EncCompanyId, depts.selected?.SubCode);  
        return () => controller.abort();
    }, [selected.EncCompanyId, depts.selected?.SubCode])

    useEffect(() => {
        const getAppnData = async (query: string, userId: string, companyId: string) => {
            if (user.UserId > 1) {
              const res = await getFrom(`${BASE_URL}/api/Appointment/Get?id=${userId}&CID=${companyId}&Type=${query}&CatType=OPD&MemberId=${'0'}`, {}, setAppnData);
              if (res) {
                if (!res.data.PartyFollowupList.length) {
                    const res2 = await getFrom(`${BASE_URL}/api/Appointment/Get?id=${userId}&CID=${companyId}&Type=${'UENQ'}&CatType=OPD&MemberId=${'0'}`, {}, setAppnData); {
                        if (res2) setAppnData(res2);
                    }
                } else {
                    setAppnData(res);            
                }
              }
            }
        }
        if (!isLoggedIn) return;
        getAppnData('ENQ', user.UserId, selected.EncCompanyId);
    }, [user.UserId, selected.EncCompanyId, isLoggedIn])

    const renderAppnData = (data: any) => {

        if (data.loading) {
            return <ListLoader classes='h-[140px]' count={1}/>
        } else if (data.err.status) {
            return;
        } else if (data.data.PartyFollowupList.length === 0) {
            return;
        } else {
            let firstAppn = data.data.PartyFollowupList[0];
            return (
                <TouchableOpacity onPress={() => dispatch(setModal({name: 'APPN_DETAIL', state: true, data: firstAppn}))}>
                    <Text className="font-PoppinsSemibold text-gray-800 text-[16px] leading-[23px] mt-2">Upcoming Schedule</Text>
                    <View className='bg-primary-500 rounded-3xl p-5 my-3'>
                        <View className='flex-row'>
                            <Image className='shadow-lg rounded-full me-3' source={require('../../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                            <View className='flex-1'>
                                <Text className="font-PoppinsBold text-white text-[14px]" numberOfLines={1}>{firstAppn.AppointmentTo}</Text>
                                <Text className="font-Poppins text-gray-200 text-[11px]">{firstAppn.DocSpecialistDesc}</Text>
                            </View>
                            <View className="bg-primary-400 py-[11px] px-[13px] rounded-full shadow-lg ms-auto">
                                <FontAwesome name="arrow-right" size={20} color='#fff' />
                            </View>
                        </View>
                        <View className='p-4 bg-primary-400 mt-4 rounded-2xl flex gap-3 flex-row'>
                            <FontAwesome5 name="calendar-alt" size={17} color="#fff" />
                            <Text className="font-Poppins text-gray-100 text-[13px] me-auto leading-5">{new Date(firstAppn.NextAppDate).toLocaleDateString('en-TT')}</Text>
                            <FontAwesome5 name="clock" size={17} color="#fff" />
                            <Text className="font-Poppins text-gray-100 text-[13px] leading-5">{firstAppn.NextAppTime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    const [day, month, year] = filterdates.activeDate.split('/').map(Number);
    let parsedActiveDate = new Date(year, month - 1, day);
    let formattedDate = formatted(parsedActiveDate);

    return (
        <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100 relative'>
            {/* <GradientBG> */}
                <View className='p-4'>
                    {isLoggedIn ? 
                        <View className="gap-3 flex-row items-center">
                            <Image className='shadow-lg rounded-full' source={require('../../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                            <View>
                                <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">{user.Name}</Text>
                                <Text className="font-Poppins text-gray-600 text-[11px]">{(user.UserType).toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}, {user.GenderDesc}, {user.Age} Years</Text>
                            </View>
                            <View className="gap-3 flex-row items-center ml-auto">
                                <View className="bg-white p-3 rounded-full shadow-lg">
                                    <FontAwesome name="bell" size={20} color='#3b82f6' className='text-blue-500'/>
                                </View>
                            </View>
                        </View> :
                        <View className="gap-3 flex-row items-center">
                            <Image className='rounded-full' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${company.LogoUrl}` }} style={{ width: 40, height: 40 }} />
                            <View className='mr-auto flex-1'>
                                <Text className="font-PoppinsSemibold text-gray-800 text-[16px]" numberOfLines={1}>{company.COMPNAME}</Text>
                                <Text className="font-Poppins text-gray-600 text-[11px]" numberOfLines={1}>{company.CATCHLINE}</Text>
                            </View>
                            {/* <TouchableOpacity onPress={() => dispatch(setModal({ name: 'LOGIN', state: true }))}> */}
                            <Link href={'/login'}>
                                <View className="gap-2 flex-row items-center bg-white p-2 rounded-full shadow-lg">
                                    <Ionicons name="enter" size={25} color='#3b82f6' className='text-blue-500' />
                                    <Text className='font-PoppinsMedium leading-5 text-slate-700'>Login </Text>
                                </View>
                            </Link>
                            {/* </TouchableOpacity> */}
                        </View>
                    }
                    <View className='relative my-3 w-full'>
                        <Feather className='absolute z-50 top-[12px] left-4' name="search" size={22} color='gray' />
                        <Link href={'/search'}>
                            <View className='z-10 w-full pointer-events-none'>
                                <TextInput placeholder='Search Doctors..' className='bg-white pl-[3.3rem] pr-4 py-[1.1rem] rounded-full shadow-lg shadow-blue-500' />
                            </View>
                        </Link>
                        <Feather className='absolute z-50 top-[4px] right-[3px] bg-primary-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                    </View>
                    {isLoggedIn && renderAppnData(appnData)}
                    <View className='justify-between flex-row pt-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Clinic</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                            <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                            <Pressable onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))}>
                                <Text className="font-PoppinsMedium text-primary-600 text-[15px] leading-[23px]">View All</Text>
                            </Pressable>
                        </View>
                    </View>
                    
                    {(() => {
                        if (status === 'loading') {
                            return <GridLoader classes='h-[90px] w-[200px]' containerClass='flex-row gap-3 my-3' />
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
                    <View className='justify-between flex-row pt-2 pb-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Department</Text>
                        </View>
                        <TouchableOpacity onPress={() => dispatch(setModal({name: 'DEPTS', state: true}))} className="gap-3 flex-row items-center ml-auto">
                            {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                            <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                            <Text className="font-PoppinsMedium text-primary-600 text-[15px] leading-[23px]">View All</Text>
                        </TouchableOpacity>
                    </View>
                    {(() => {
                        if (depts.status === 'loading') {
                            return <GridLoader classes='h-[65px] w-[65px] rounded-full' containerClass='flex-row gap-3 my-4' style={{borderRadius: '100%'}} />;
                        } else if (depts.error) {
                            return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{depts.error}</Text>;
                        } else {
                            return (
                                <View className='mt-4'>
                                    <ScrollView horizontal={true} contentContainerClassName='items-start flex-row gap-2 pt-1 pb-3' showsHorizontalScrollIndicator={false}>
                                        {depts.list.map((dept: any) => {
                                            return <DeptCard data={dept} key={dept.SubCode} active={depts?.selected.SubCode === dept.SubCode}/>
                                        })}
                                    </ScrollView>
                                </View>
                            )
                        }
                    })()}

                    {/* <Text className="font-PoppinsBold text-gray-800 text-[16px] leading-[23px] mt-3">Upcoming Schedule (3)</Text>
                    <View className='bg-primary-500 rounded-3xl p-5 mt-4'>
                        <View className='flex-row'>
                            <Image className='shadow-lg rounded-full me-3' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                            <View>
                                <Text className="font-PoppinsBold text-white text-[14px]">Prof. Dr. Logan Mason</Text>
                                <Text className="font-Poppins text-gray-200 text-[11px]">Orthopedic Consultation</Text>
                            </View>
                            <View className="bg-primary-400 py-[11px] px-[13px] rounded-full shadow-lg ms-auto">
                                <FontAwesome name="arrow-right" size={20} color='#fff' />
                            </View>
                        </View>
                        <View className='py-3 px-4 bg-primary-400 mt-4 rounded-2xl flex gap-3 flex-row '>
                            <FontAwesome5 name="calendar-alt" size={17} color="#fff" />
                            <Text className="font-Poppins text-gray-100 text-[13px] me-auto leading-5">June 12, 2025</Text>
                            <FontAwesome5 name="clock" size={17} color="#fff" />
                            <Text className="font-Poppins text-gray-100 text-[13px] leading-5">9:30 AM</Text>
                        </View>
                    </View> */}
                    <View className='justify-between flex-row pt-2 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Date</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Feather name="chevron-left" size={24} color='#6b7280' />
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </View>
                    <View className='flex-row justify-around'>
                        <ScrollView horizontal={true} contentContainerClassName='items-start flex-row gap-4 pb-1' showsHorizontalScrollIndicator={false}>
                            {filterdates.dates.map((i: any) => <DayBtn data={i} key={i.date} activeDate={filterdates.activeDate} handleActive={setFilterDates} />)}
                        </ScrollView>
                    </View>
                    <View className='justify-between flex-row py-3 items-end'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[16px] leading-[23px] mt-3">Available Doctors</Text>
                        {/* <Text className="font-PoppinsMedium text-primary-600 text-[15px] leading-[23px] mt-3">View All</Text> */}
                        <View className='rounded-full flex-row shadow-sm shadow-gray-300'>
                            <TouchableOpacity onPress={() => setDoctorTab('active_date')}>
                                <Text className={`text-[13px] leading-[23px] px-3 py-1 rounded-tl-2xl rounded-bl-2xl ${doctorTab === 'active_date' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{formattedDate}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setDoctorTab('all_date')}>
                                <Text className={`text-[13px] leading-[23px] px-3 py-1 rounded-tr-2xl rounded-br-2xl ${doctorTab === 'all_date' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>Other Days</Text>
                            </TouchableOpacity>
                            {/* <Text className="font-PoppinsMedium text-white text-[15px] leading-[23px]">All</Text> */}
                        </View>
                    </View> 
                    <View className='mt-2 gap-4'>
                        {(() => {
                            if (doctors.loading) {
                                return <GridLoader />
                            } else if (doctors.err.status) {
                                return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{doctors.err.msg}</Text>
                            } else if (!doctors.data.PartyMasterList.length) {
                                return <NoContent label='No Doctors Found' />;
                            } else {
                                if (doctorTab === 'active_date') {
                                    return doctors.data.PartyMasterList.map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} selectedDate={filterdates.activeDate} />)
                                } else {
                                    return otherDayDoctors.data.PartyMasterList.slice(0, 20).map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} />)
                                }
                            }
                        })()}
                    </View>
                </View>
            {/* </GradientBG> */}
        </ScrollView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});