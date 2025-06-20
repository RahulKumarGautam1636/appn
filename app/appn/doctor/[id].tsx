import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonPrimary from '@/app/components';
// import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/constants';
import { getFrom, GridLoader } from '@/app/components/utils';
import axios from 'axios';
import { setAppnData } from '@/app/store/slices/slices';
import { useRouter } from 'expo-router';
import AppnPreview from '../appnPreview';
import BookingSuccess from '../bookingSuccess';
// import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// import ReactNativeModal from 'react-native-modal';
// const { width, height } = Dimensions.get('window');

// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const Booking = () => {

    // const { id } = useLocalSearchParams();
    const { selectedAppnDate, doctor, companyId } = useSelector((i: RootState) => i.appnData)
    const selectedCompany = useSelector((i: RootState) => i.companies).selected
    const user = useSelector((i: RootState) => i.user)
    const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn)
    const { selectedMember} = useSelector((i: RootState) => i.members)
    const companiesList = useSelector((i: RootState) => i.companies.list)
    const [selectedDate, setSelectedDate] = useState(selectedAppnDate);
    // const [filterdates, setFilterDates] = useState({dates: getDatesArray(new Date(), 5), activeDate: new Date().toLocaleDateString('en-TT')});
    const [dateTabsList, setDateTabsList] = useState({loading: true, data: [], err: {status: false, msg: ''}});
    const [dateSlotsList, setDateSlotsList] = useState({loading: true, data: [], err: {status: false, msg: ''}});
    const [selectedSlot, setSelectedSlot] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
      const [activeCompany, setActiveCompany] = useState({});

    useEffect(() => {
        setSelectedDate(selectedAppnDate);
    }, [selectedAppnDate, doctor.PartyCode])

    useEffect(() => {
        if (!selectedCompany.EncCompanyId) return;
        getDateTabsList(selectedCompany.EncCompanyId, doctor.PartyCode, selectedDate);
        return () => {                                                               
            setSelectedSlot(null);                                            
            setDateSlotsList(pre => ({...pre, loading: true}));                                                       
        }                                                                              
    },[doctor.PartyCode, selectedCompany.EncCompanyId]) 

    async function getDateTabsList(companyCode: string, doctorId: number, choosenDate: string) {

        const res = await getFrom(`${BASE_URL}/api/AppSchedule/Get?CID=${companyCode}&DID=${doctorId}`, {}, setDateTabsList);
        if (res) {
            setTimeout(() => {
                setDateTabsList(res);
                if (doctor.PartyCode) {
                    if (!res.data.length) return alert('No slots found');
                    let isDateAvailable = res.data.find((i: any) => i.SDateStr === choosenDate);            
                    if (isDateAvailable) {
                        getDateSlotsList(doctor.PartyCode, choosenDate);
                    } else {
                        setSelectedDate(res.data[0]?.SDateStr);
                        getDateSlotsList(doctor.PartyCode, res.data[0]?.SDateStr || '');          // Pass first received tab Date (SDateStr) only if it't exist to make a new request for app slots.
                    }                                                                                  // At initial render we don't have any dateTabsList and sDateStr hence replace it with empty strings.
                }  
            },500)                                                                             
        }
    } 

    async function getDateSlotsList(docId: number, sDate: string) {
        if (docId !== null) {         
          const res = await getFrom(`${BASE_URL}/api/AppSchedule/Get?CID=${selectedCompany.EncCompanyId}&DID=${docId}&FDate=${sDate}&TDate=${sDate}`, {}, setDateSlotsList);
          if (res) {
            setTimeout(() => {
              setDateSlotsList(res);
            }, 1000);
          }
        } 
    } 

    const [bookingData, setBookingData] = useState({ AppointDate: '', AppTime: '', TimeSlotId: null, companyId: '' });

    const selectSlot = (AutoId, SDateStr, SInTimeStr, EncCompanyId) => {
        setBookingData(pre => ({...pre, AppointDate: SDateStr, AppTime: SInTimeStr, TimeSlotId: AutoId, companyId: EncCompanyId }))
        // bookingInfoAction({ AppointDate: SDateStr, AppTime: SInTimeStr, TimeSlotId: AutoId, companyId: EncCompanyId });
        setSelectedSlot(AutoId);
    }
    
    const handleDateChange = (i: any) => {
        setSelectedDate(i.SDateStr);
        getDateSlotsList(doctor.PartyCode, i.SDateStr); 
        selectSlot('', '', '', '');
    }

    useEffect(() => {
        if (companiesList.length === 0) return;
        let active = companiesList.find(i => i.EncCompanyId === companyId);   
        if (active) {
            setActiveCompany(active);
        } else {
            setActiveCompany(companiesList[0])
        }    
    }, [companiesList.length])

    const handleBookingFormSubmit = async () => {
        alert('toggle appn stages.')
        toggleConfirmation()
        toggleSuccess()
        // e.preventDefault();
        // if (!bookingData.TimeSlotId) {
        //     alert('Please select a time slot first.');
        //     return;
        // }
        // if (isLoggedIn) {
        //     let appDate = getDateDifference(bookingData.AppointDate);
        //     console.log(appDate);      
        //     if (!selectedMember.MemberId) {
        //     // let productToastData = { msg: 'Added to Cart', product: {name: 'Description', price: 1200}, button: {text: 'Visit Cart', link: '/cartPage'} };
        //     // productToast(productToastData);
        //     // if (getConfirmation(`Book Appointment for ${user.Name}`) === false) return; 
        //     const newbookingData = { 
        //         ...bookingData,
        //         UnderDoctId: doctor.PartyCode,
        //         Salutation: user.Salutation,
        //         Name: user.Name,
        //         EncCompanyId: activeCompany.EncCompanyId,                   
        //         PartyCode: activeCompany.CompUserPartyCode,                 // no CompUserPartyCode
        //         MPartyCode: activeCompany.CompUserMPartyCode,               // no CompUserMPartyCode
        //         RegMob1: user.RegMob1,
        //         Gender: user.Gender,
        //         GenderDesc: user.GenderDesc,
        //         Address: user.Address,
        //         Age: user.Age,
        //         AgeMonth: user.AgeMonth,
        //         AgeDay: user.AgeDay,
        //         State: user.State,
        //         City: user.City,
        //         Pin: user.Pin,
        //         Address2: user.Address2,
        //         AnniversaryDate: user.AnniversaryDate,
        //         Aadhaar: user.Aadhaar,
        //         UserId: user.UserId,
        //         UHID: user.UHID,
        //         MemberId: user.MemberId,
        //         Country: user.Country,
        //         EnqType: 'OPD',
        //         LocationId: 928, // globalData.location.LocationId
        //     }
        //     console.log('user booking');
        //     makeBookingRequest(newbookingData);
        //     } else {
        //         // if (getConfirmation(`Book Appointment for ${selectedMember.MemberName}`) === false) return;
        //         const newbookingData = { 
        //             ...bookingData,
        //             UnderDoctId: doctor.PartyCode,
        //             Salutation: selectedMember.Salutation,
        //             Name: selectedMember.MemberName,
        //             EncCompanyId: activeCompany.EncCompanyId,
        //             PartyCode: selectedMember.CompUserPartyCode,
        //             MPartyCode: selectedMember.CompUserMPartyCode,
        //             RegMob1: selectedMember.Mobile,
        //             Gender: selectedMember.Gender,
        //             GenderDesc: selectedMember.GenderDesc,
        //             Address: selectedMember.Address,
        //             Age: selectedMember.Age,
        //             AgeMonth: selectedMember.AgeMonth,
        //             AgeDay: selectedMember.AgeDay,
        //             State: selectedMember.State,
        //             City: selectedMember.City,
        //             Pin: selectedMember.Pin,
        //             Address2: selectedMember.Landmark,
        //             AnniversaryDate: selectedMember.AnniversaryDate,
        //             Aadhaar: selectedMember.Aadhaar,
        //             UserId: user.UserId,
        //             UHID: selectedMember.UHID,
        //             MemberId: selectedMember.MemberId,
        //             Country: selectedMember.Country,
        //             EnqType: 'OPD',
        //             LocationId: 928, // globalData.location.LocationId
        //         }
        //         console.log('member booking');
        //         makeBookingRequest(newbookingData);
        //     }
        //     // if (activeCompany.EncCompanyId !== userInfo.selectedCompany.EncCompanyId) userInfoAction({ selectedCompany: activeCompany });
        //     setTimeout(() => { router.push(`/appn/appnPreview?tab=appn&day=${appDate}`) }, 2000);
        // } else {
        //     // userInfoAction(bookingData);
        //     router.push(`/login`)
        // }
    }

    const makeBookingRequest = async (params: any) => {
        console.log(params);
        if (!params.UserId) return alert('Something went wrong, try again later. No user Id received: F');
        // loaderAction(true);
        // const res = await axios.post(`${BASE_URL}/api/Appointment/Post`, params);
        // // loaderAction(false);
        // if (res.status === 200) {
        //     try {const status = axios.post(`${process.env.REACT_APP_BASE_URL_}`, params)} catch (error) {}
        //     // setRef({ status: true, data: res.data });
        //     // bookingToast(res.data, { position: "top-center", autoClose: 4000, closeButton: false, className: 'booking-reference-toast' });
        //     // modalAction('APPN_BOOKING_MODAL', false);
        //     const initBookingData = {
        //         selectedAppnDate: "",                                                         
        //         companyId: "", 
        //         doctor: { Name: "", SpecialistDesc: "", Qualification: "", RegMob1: "" }
        //     }
        //     dispatch(setAppnData(initBookingData))            // reset the bookingInfo
        // } else {
        //     alert('Something went wrong, try again later.');
        // }
    }

    const getDateDifference = (date: string) => {
        let x = mmDDyyyyDate(date, '/', '/');
        let appnDate = new Date(x).getDate();
        const currDate = new Date().getDate();
        if (appnDate > currDate) {
            return 'tomorrow';    
        } else if (appnDate < currDate) {     
            return 'yesterday';    
        } else {
            return 'today';      
        }
    } 

    const mmDDyyyyDate = (date: string, currSeperator: string, requiredSeperator: string) => {                 // Convert dd/mm/yyyy to mm/dd/yyyy format because dd/mm/yyyy is not taken as Date() object to create new date.
        if (!date.includes(currSeperator)) return console.log('CurrentSeperator does not exist in received date.');
        const [dd, mm, yyyy] = date.split(currSeperator);
        return mm + requiredSeperator + dd + requiredSeperator + yyyy;                  
    }

    // const translateX = useSharedValue(width); 

    // const animatedStyle = useAnimatedStyle(() => ({
    //     transform: [{ translateX: translateX.value }],
    // }));

    const [confirmation, setConfirmation] = useState(false);
    const [success, setSuccess] = useState(false);

    const toggleConfirmation = () => {
        setConfirmation(false);
        setSuccess(true);
        // if (translateX.value) {
        //     translateX.value = withTiming(0, { duration: 500 });
        // } else {
        //     translateX.value = withTiming(width, { duration: 500 });
        // }
    }

    // const translateX2 = useSharedValue(width); 

    // const animatedStyle2 = useAnimatedStyle(() => ({
    //     transform: [{ translateX: translateX2.value }],
    // }));

    const toggleSuccess = () => {
        // if (translateX2.value) {
        //     translateX2.value = withTiming(0, { duration: 500 });
        // } else {
        //     translateX2.value = withTiming(width, { duration: 500 });
        // }
    }


    return (
        <>
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
                        <Image className='' source={require('./../../../assets/images/doctor.jpg')} style={{ width: 80, height: 80 }} />
                        <View>
                            <Text className="font-PoppinsSemibold text-sky-800 text-[15px] mb-2">{doctor.Name}</Text>
                            <View className='flex-row gap-2'>
                                <FontAwesome name="graduation-cap" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{doctor.SpecialistDesc}</Text>
                            </View>
                            <View className='flex-row gap-2'>
                                <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-800 text-[12px]">{doctor.Qualification}</Text>
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
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center border-b-2 border-pink-600">Schedule</Text>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">About</Text>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Clinics</Text>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Reviews</Text>
                </View>
                <View className='bg-pink-500 m-3 mb-4 rounded-3xl shadow-md shadow-pink-700 overflow-hidden'>
                    <View className='justify-between flex-row px-5 pt-2 pb-[5] items-center border-b border-pink-300'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">Clinics</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Text className="font-Poppins text-white text-[12px] leading-4">2+ clinics</Text>
                            <Feather name="chevron-down" size={24} color='#fff' />
                        </View>
                    </View>

                    <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-pink-500 '>
                        <View className='flex-1'>
                            <Text className="font-PoppinsSemibold text-[15px] text-white">{selectedCompany.COMPNAME}</Text>
                            <View className='mt-2 '>
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
                        <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-pink-400 rounded-full'  />
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
                    {(() => {
                        if (dateTabsList.loading) {
                            return <GridLoader classes='h-[70px] w-[50px]' containerClass='flex-row gap-3 mt-4' />
                        } else if (dateTabsList.err.status) {
                            return;
                        } else {
                            return dateTabsList.data.slice(0, 6).map((i: any) => <DayBtn key={i.SDateStr} date={i.Day} day={i.DName.substring(0, 3)} active={i.SDateStr === selectedDate} handleActive={() => handleDateChange(i)} />)
                        }
                    })()}
                </View>
                <View className='py-5 px-4 pb-2 bg-white shadow-md shadow-gray-300 mt-4'>
                    <View className='justify-start flex-row flex-wrap' style={{
                        columnGap: '3.5%'   // 6 items
                        // columnGap: '5%',    // 4 items
                        // columnGap: '10%',      // 3 items
                    }}>
                        {(() => {
                            if (dateSlotsList.loading) {
                                return <GridLoader classes='h-[50px] w-[17.1%] mb-3' count={10} containerClass='flex-row flex-wrap' />
                            } else if (dateSlotsList.err.status) {
                                return;
                            } else {
                                return dateSlotsList.data.slice(0, 3).map((i: any) => (<SlotBtn key={i.TimeStr} time={i.TimeStr} active={selectedSlot === i.AutoId} handleSelect={() => selectSlot(i.AutoId, i.SDateStr, i.SInTimeStr, i.EncCompanyId)}/>))
                            }
                        })()}
                    </View>
                </View>
                <ButtonPrimary title='Book Appointment' active={true} onPress={() => setConfirmation(true)} classes='m-4' />
            </ScrollView>
            {/* <Animated.View 
                style={[{ flex: 1 }, animatedStyle]} className='absolute z-30 inset-0'
                pointerEvents="box-none"                     
                onStartShouldSetResponder={() => {
                    console.log('Animated View caught touch');
                    return false;
                }}
                > */}

                {/* <ReactNativeModal
                    isVisible={confirmation}
                    onBackdropPress={() => setConfirmation(false)}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDown"
                    backdropOpacity={0.3}
                    useNativeDriver
                    coverScreen={true}
                    style={{backgroundColor: 'white', margin: 0, padding: 0, flex: 1, height: '100%',
                    alignItems: undefined,
                    justifyContent: undefined,
                    }}
                    deviceHeight={height}
                customBackdrop={<View style={{flex: 1}} />}
                >
                    <SafeAreaProvider>
                        <SafeAreaView className='flex-1 justify-start' style={{minHeight: '100%'}}>
                            <AppnPreview bookAppn={handleBookingFormSubmit} handleOpen={toggleConfirmation} doctor={doctor} bookingData={bookingData} clinic={selectedCompany} member={selectedMember} />
                        </SafeAreaView>
                    </SafeAreaProvider>
                </ReactNativeModal> */}

                {/* With in-build modal */}
                {/* <Modal
                    transparent={true}
                    visible={confirmation}
                    animationType="slide"
                    onRequestClose={() => setConfirmation(false)}
                    presentationStyle='overFullScreen'
                >
                    <AppnPreview bookAppn={handleBookingFormSubmit} handleOpen={setConfirmation} doctor={doctor} bookingData={bookingData} clinic={selectedCompany} member={selectedMember} />
                </Modal> */}
                <View className={`absolute inset-0 bg-white ${confirmation ? 'flex pointer-events-auto opacity-100' : 'd-none pointer-events-none opacity-0'}`}>
                    <AppnPreview bookAppn={handleBookingFormSubmit} handleOpen={toggleConfirmation} doctor={doctor} bookingData={bookingData} clinic={selectedCompany} member={selectedMember} />
                </View>
                <View className={`absolute inset-0 bg-white ${success ? 'flex pointer-events-auto opacity-100' : 'd-none pointer-events-none opacity-0'}`}>
                    <BookingSuccess doctor={doctor} bookingData={bookingData} clinic={selectedCompany} />
                </View>
            {/* </Animated.View> */}
            {/* <Animated.View style={[{ flex: 1 }, animatedStyle2]} pointerEvents="box-none" className='absolute z-30 inset-0'> */}
                {/* <BookingSuccess bookAppn={handleBookingFormSubmit} doctor={doctor} bookingData={bookingData} clinic={selectedCompany} member={selectedMember} /> */}
            {/* </Animated.View> */}
        </>
    )
}



export default Booking;

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});

const SlotBtn = ({ time, active, handleSelect }: any) => {
    return (        
        <TouchableOpacity onPress={handleSelect} className={`justify-center border-2 rounded-lg px-3 py-1 mb-3 ${active ? 'bg-pink-50 border-pink-400' : 'bg-gray-50 border-gray-300'}`} style={{
            width: '17.1%'     // 6 items
            // width: '21.25%' // 4 items
            // width: '26.66%'    // 3 items
        }}>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-pink-500' : 'text-gray-500'}`}>{time.split(' ')[0]}</Text>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-pink-500' : 'text-gray-500'}`}>{time.split(' ')[1]}</Text>
        </TouchableOpacity>
    )
}

const DayBtn = ({ date, day, active, handleActive }: any) => {

    return (
        <TouchableOpacity onPress={handleActive} className='gap-3 flex-1 text-center items-center'>
            <Text className={`font-PoppinsMedium pt-4 text-[12px] ${active ? 'text-gray-600' : 'text-gray-400'}`}>{day}</Text>
            <View className={`items-center justify-center h-11 w-12 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-pink-500' : 'bg-white'}`}>
                <Text className={`font-PoppinsMedium text-gray-600 text-[13px] leading-5 ${active ? 'text-white' : ''}`}>{date}</Text>
            </View>
        </TouchableOpacity>
    )
} 


 