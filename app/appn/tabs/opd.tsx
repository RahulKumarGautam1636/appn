import { Ionicons } from '@expo/vector-icons';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useEffect, useState } from 'react';
import { setModal } from '@/src/store/slices/slices';
import { CompCard, DeptCard, Card_1, DayBtn, getDatesArray, mmDDyyyyDate } from '@/src/components';
import { BASE_URL, defaultId } from '@/src/constants';
import { formatted, getFrom, GridLoader, ListLoader, NoContent } from '@/src/components/utils';
import colors from 'tailwindcss/colors';


const HomeScreen = () => {

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const compCode = useSelector((state: RootState) => state.compCode);
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
        <ScrollView contentContainerClassName='min-h-full bg-slate-100 relative'>
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
                                <Link href={'/appn/tabs/profile'}>
                                    <View className="bg-white p-3 rounded-full shadow-lg">
                                        <FontAwesome name="bell" size={20} color='#3b82f6' className='text-blue-500'/>
                                    </View>
                                </Link>
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
                    {compCode === defaultId || list.length > 1 ? <View>
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
                    </View> : null}
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
                                if (doctorTab === 'all_date') {
                                    return otherDayDoctors.data.PartyMasterList.length ? otherDayDoctors.data.PartyMasterList.slice(0, 20).map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} />) : <NoContent label='No Doctors Found' imgClass='h-[170]'containerClass='mt-12'/>;
                                } else {
                                    return (    
                                        <>
                                            {doctors.data.PartyMasterList.length ? doctors.data.PartyMasterList.map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} selectedDate={filterdates.activeDate} />) : <Text className='p-4 bg-rose-200/50 text-red-500 leading-5 text-center mt-6 rounded-lg font-PoppinsSemibold'>No Doctors Found for Selected Date</Text>}
                                            {otherDayDoctors.data.PartyMasterList.length ? <>
                                                <View className='justify-between flex-row items-end p-4 bg-blue-200/50 mt-3 rounded-xl'>
                                                    <Text className="font-PoppinsSemibold text-blue-600 text-[16px] leading-[23px]">All Available Doctors</Text>
                                                    <FontAwesome name="arrow-down" size={20} color={colors.blue[600]} />
                                                </View> 
                                                {otherDayDoctors.data.PartyMasterList.slice(0, 20).map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} />)}
                                            </> : null}
                                        </>
                                    )
                                }
                            }
                        })()}
                    </View>
                </View>
            {/* </GradientBG> */}
        </ScrollView>
    )
}

<<<<<<< HEAD
export default HomeScreen;
=======
export default HomeScreen;



// import React, { useState } from 'react';
// import { ArrowLeft, Camera, Calendar, Mail, ChevronDown } from 'lucide-react-native';
// import { Button, Text, TextInput, View } from 'react-native';
// import ButtonPrimary from '@/src/components';

// const ProfileForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     nickname: '',
//     dateOfBirth: '',
//     email: '',
//     phoneNumber: '',
//     gender: ''
//   });

//   const [showGenderDropdown, setShowGenderDropdown] = useState(false);

//   const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleGenderSelect = (gender) => {
//     handleInputChange('gender', gender);
//     setShowGenderDropdown(false);
//   };

//   const handleContinue = () => {
//     console.log('Form Data:', formData);
//     // Handle form submission here
//   };

//   return (
//     <View className="flex flex-col h-screen bg-white">
//       {/* Header */}
//       <View className="flex items-center px-4 pt-12 pb-6">
//         <ButtonPrimary className="mr-4">
//           <ArrowLeft size={24} color="#000" />
//         </ButtonPrimary>
//         <Text className="text-xl font-semibold text-black">Fill Your Profile</Text>
//       </View>

//       {/* Scrollable Content */}
//       <View className="flex-1 overflow-y-auto px-4">
//         {/* Profile Picture Section */}
//         <View className="flex items-center justify-center mb-8">
//           <View className="relative">
//             <View className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
//               <View className="w-16 h-16 bg-gray-300 rounded-full" />
//             </View>
//             <ButtonPrimary className="absolute bottom-0 right-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
//               <Camera size={20} color="#fff" />
//             </ButtonPrimary>
//           </View>
//         </View>

//         {/* Form Fields */}
//         <View className="space-y-4">
//           {/* Full Name */}
//           <View>
//             <TextInput
//               className="w-full bg-gray-50 rounded-lg px-4 py-4 text-base text-black placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={(e) => handleInputChange('fullName', e.target.value)}
//             />
//           </View>

//           {/* Nickname */}
//           <View>
//             <TextInput
//               className="w-full bg-gray-50 rounded-lg px-4 py-4 text-base text-black placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
//               placeholder="Nickname"
//               value={formData.nickname}
//               onChange={(e) => handleInputChange('nickname', e.target.value)}
//             />
//           </View>

//           {/* Date of Birth */}
//           <View className="relative">
//             <TextInput
//               className="w-full bg-gray-50 rounded-lg px-4 py-4 pr-12 text-base text-black placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
//               placeholder="Date of Birth"
//               value={formData.dateOfBirth}
//               onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
//               type="date"
//             />
//             <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
//               <Calendar size={20} color="#9CA3AF" />
//             </View>
//           </View>

//           {/* Email */}
//           <View className="relative">
//             <TextInput
//               className="w-full bg-gray-50 rounded-lg px-4 py-4 pr-12 text-base text-black placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
//               placeholder="Email"
//               value={formData.email}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               type="email"
//             />
//             <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
//               <Mail size={20} color="#9CA3AF" />
//             </View>
//           </View>

//           {/* Phone Number */}
//           <View className="relative">
//             <View className="flex bg-gray-50 rounded-lg">
//               <View className="flex items-center px-4 py-4 border-r border-gray-200">
//                 <View className="w-6 h-4 mr-2 rounded-sm overflow-hidden">
//                   <View className="w-full h-1/3 bg-red-500" />
//                   <View className="w-full h-1/3 bg-white" />
//                   <View className="w-full h-1/3 bg-blue-500" />
//                 </View>
//                 <ChevronDown size={16} color="#9CA3AF" />
//               </View>
//               <TextInput
//                 className="flex-1 px-4 py-4 text-base text-black placeholder-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none"
//                 placeholder="Phone Number"
//                 value={formData.phoneNumber}
//                 onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
//                 type="tel"
//               />
//             </View>
//           </View>

//           {/* Gender Dropdown */}
//           <View className="relative">
//             <ButtonPrimary
//               className="w-full bg-gray-50 rounded-lg px-4 py-4 flex items-center justify-between text-left"
//               onClick={() => setShowGenderDropdown(!showGenderDropdown)}
//             >
//               <Text className={`text-base ${formData.gender ? 'text-black' : 'text-gray-400'}`}>
//                 {formData.gender || 'Gender'}
//               </Text>
//               <ChevronDown size={20} color="#9CA3AF" />
//             </ButtonPrimary>

//             {showGenderDropdown && (
//               <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 z-10 shadow-lg">
//                 {genderOptions.map((option, index) => (
//                   <ButtonPrimary
//                     key={index}
//                     className="w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
//                     onClick={() => handleGenderSelect(option)}
//                   >
//                     <Text className="text-base text-black">{option}</Text>
//                   </ButtonPrimary>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>
//       </View>

//       {/* Continue Button */}
//       <View className="px-4 pb-8 pt-4">
//         <ButtonPrimary
//           className="w-full bg-gray-800 rounded-full py-4 text-center hover:bg-gray-700 transition-colors"
//           onClick={handleContinue}
//         >
//           <Text className="text-white text-lg font-semibold">Continue</Text>
//         </ButtonPrimary>
//       </View>
//     </View>
//   );
// };

// export default ProfileForm;
>>>>>>> ec088461a890c7ce3a78859fec02681ab5faa94c
