import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonPrimary, { MyModal } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useEffect, useState } from 'react';
import { BASE_URL, BC_ROY } from '@/src/constants';
import { getFrom, GridLoader, withAutoUnmount } from '@/src/components/utils';
import axios from 'axios';
import { setAppnData, setCompanies, setModal } from '@/src/store/slices/slices';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import AppnPreview from '../appnPreview';
import BookingSuccess from '../../../src/components/modals/bookingSuccess';
import ReactNativeModal from 'react-native-modal';
import { stripHtml } from 'string-strip-html';


const Booking = () => {

    const { selectedAppnDate, doctor, docCompId } = useSelector((i: RootState) => i.appnData)
    const user = useSelector((i: RootState) => i.user)
    const compCode = useSelector((i: RootState) => i.compCode)
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId)
    const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn)
    const { selectedMember } = useSelector((i: RootState) => i.members)
    const { list: companiesList, selected: selectedCompany} = useSelector((i: RootState) => i.companies)
    const [selectedDate, setSelectedDate] = useState(selectedAppnDate);
    const [dateTabsList, setDateTabsList] = useState({loading: true, data: [], err: {status: false, msg: ''}});
    const [dateSlotsList, setDateSlotsList] = useState({loading: true, data: [], err: {status: false, msg: ''}});
    const [selectedSlot, setSelectedSlot] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const [activeCompany, setActiveCompany] = useState({});
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        setSelectedDate(selectedAppnDate);
    }, [selectedAppnDate, doctor.PartyCode])

    useEffect(() => {
        if (!selectedCompany.EncCompanyId || !doctor.PartyCode) return;
        getDateTabsList(selectedCompany.EncCompanyId, doctor.PartyCode, selectedDate);
        return () => {                                                               
            setSelectedSlot(null);
            setDateSlotsList({loading: true, data: [], err: {status: false, msg: ''}});                                                                                                  
        }                                                                              
    },[doctor.PartyCode, selectedCompany.EncCompanyId]) 

    async function getDateTabsList(companyCode: string, doctorId: number, choosenDate: string) {

        const res = await getFrom(`${BASE_URL}/api/AppSchedule/Get?CID=${companyCode}&DID=${doctorId}`, {}, setDateTabsList);
        if (res) {
            setTimeout(() => {
                setDateTabsList(res);
                if (doctor.PartyCode) {
                    if (!res.data.length) {
                        setDateSlotsList({loading: false, data: [], err: {status: false, msg: ''}}); 
                        return;
                    }
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
        setSelectedSlot(AutoId);
    }
    
    const handleDateChange = (i: any) => {
        setSelectedDate(i.SDateStr);
        getDateSlotsList(doctor.PartyCode, i.SDateStr); 
        selectSlot('', '', '', '');
    }

    useEffect(() => {
        if (docCompId && selectedCompany.EncCompanyId !== docCompId) {
            let active = companiesList.find(i => i.EncCompanyId === docCompId);
            if (active) {
                dispatch(setCompanies({selected: active}))
                return;
            } else {
                alert("An Error Occured. Error code: 001");
                router.back();
                return;
            }
        }
        if (companiesList.length === 0) return;
        let active = companiesList.find(i => i.EncCompanyId === selectedCompany.EncCompanyId);   
        if (active) {
            setActiveCompany(active);
        } else {
            setActiveCompany(companiesList[0])
        }    
    }, [companiesList.length, selectedCompany.EncCompanyId])

    const handleBookingFormSubmit = async (e: any) => {
        e.preventDefault();
        if (!locationId) return alert('An Error Occured. Error code 002')
        if (!bookingData.TimeSlotId) {
            alert('Please select a time slot first.');
            return;
        }
        if (isLoggedIn) {
            // let appDate = getDateDifference(bookingData.AppointDate);      
            if (!selectedMember.MemberId) {
            // let productToastData = { msg: 'Added to Cart', product: {name: 'Description', price: 1200}, button: {text: 'Visit Cart', link: '/cartPage'} };
            // productToast(productToastData);
            // if (getConfirmation(`Book Appointment for ${user.Name}`) === false) return; 
            const newbookingData = { 
                ...bookingData,
                Salutation: user.Salutation,
                Name: user.Name,
                EncCompanyId: activeCompany.EncCompanyId,                   
                PartyCode: activeCompany.CompUserPartyCode,                 // no CompUserPartyCode
                MPartyCode: activeCompany.CompUserMPartyCode,               // no CompUserMPartyCode
                RegMob1: user.RegMob1,
                Gender: user.Gender,
                GenderDesc: user.GenderDesc,
                Address: user.Address,
                Age: user.Age,
                AgeMonth: user.AgeMonth,
                AgeDay: user.AgeDay,
                State: user.State,
                City: user.City,
                Pin: user.Pin,
                Address2: user.Address2,
                AnniversaryDate: user.AnniversaryDate,
                Aadhaar: user.Aadhaar,
                UserId: user.UserId,
                UHID: user.UHID,
                MemberId: user.MemberId,
                Country: user.Country,
                EnqType: 'OPD',
                LocationId: locationId, 

                UnderDoctId: doctor.PartyCode,  // sales
                ReferrerId: user.ReferrerId,   // refBy
                ProviderId: user.ProviderId,   // provider
                MarketedId: user.MarketedId,   // marketing,
                Remarks: remarks,
            }
            console.log('user booking');
            makeBookingRequest(newbookingData);
            } else {
                // if (getConfirmation(`Book Appointment for ${selectedMember.MemberName}`) === false) return;
                const newbookingData = { 
                    ...bookingData,
                    Salutation: selectedMember.Salutation,
                    Name: selectedMember.MemberName,
                    EncCompanyId: activeCompany.EncCompanyId,
                    PartyCode: selectedMember.CompUserPartyCode,
                    MPartyCode: selectedMember.CompUserMPartyCode,
                    RegMob1: selectedMember.Mobile,
                    Gender: selectedMember.Gender,
                    GenderDesc: selectedMember.GenderDesc,
                    Address: selectedMember.Address,
                    Age: selectedMember.Age,
                    AgeMonth: selectedMember.AgeMonth,
                    AgeDay: selectedMember.AgeDay,
                    State: selectedMember.State,
                    City: selectedMember.City,
                    Pin: selectedMember.Pin,
                    Address2: selectedMember.Landmark,
                    AnniversaryDate: selectedMember.AnniversaryDate,
                    Aadhaar: selectedMember.Aadhaar,
                    UserId: user.UserId,
                    UHID: selectedMember.UHID,
                    MemberId: selectedMember.MemberId,
                    Country: selectedMember.Country,
                    EnqType: 'OPD',
                    LocationId: locationId, 

                    UnderDoctId: doctor.PartyCode,      
                    ReferrerId: selectedMember.ReferrerId,      
                    ProviderId: selectedMember.ProviderId,  
                    MarketedId: selectedMember.MarketedId,      
                    Remarks: remarks,
                }
                console.log('member booking');
                makeBookingRequest(newbookingData);
            }
            // if (activeCompany.EncCompanyId !== userInfo.selectedCompany.EncCompanyId) userInfoAction({ selectedCompany: activeCompany });
            // setTimeout(() => { router.push(`/appn/appnPreview?tab=appn&day=${appDate}`) }, 2000);
        } else {
            // userInfoAction(bookingData);
            router.push(`/login`)
        }
    }

    const makeBookingRequest = async (book: any) => { 
        // console.log(book);
        if (!book.UserId) return alert('Something went wrong, try again later. No user Id received: F');
        setLoading(true);
        const res = await axios.post(`${BASE_URL}/api/Appointment/Post`, book);    // { status: 200 }
        setLoading(false);
        if (res.status === 200) {
            // try {const status = axios.post(`${process.env.REACT_APP_BASE_URL_}`, params)} catch (error) {}
            // setRef({ status: true, data: res.data });
            // bookingToast(res.data, { position: "top-center", autoClose: 4000, closeButton: false, className: 'booking-reference-toast' });
            // modalAction('APPN_BOOKING_MODAL', false);
            handleConfirmation();
            const initBookingData = {
                selectedAppnDate: "", 
                // doctor: { Name: "", SpecialistDesc: "", Qualification: "", RegMob1: "" }
            }
            dispatch(setAppnData(initBookingData))            // reset the bookingInfo
        } else {
            alert('Something went wrong, try again later.');
        }

    }

    // const getDateDifference = (date: string) => {
    //     let x = mmDDyyyyDate(date, '/', '/');
    //     let appnDate = new Date(x).getDate();
    //     const currDate = new Date().getDate();
    //     if (appnDate > currDate) {
    //         return 'tomorrow';    
    //     } else if (appnDate < currDate) {     
    //         return 'yesterday';    
    //     } else {
    //         return 'today';      
    //     }
    // } 

    const [confirmation, setConfirmation] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleConfirmation = () => {
        setConfirmation(false);
        setSuccess(true);
    }

    const handleBooking = () => {
        if (!isLoggedIn) return dispatch(setModal({name: 'LOGIN', state: true}));
        if (!bookingData.TimeSlotId) return alert('Please select a Time slot first.')
        setConfirmation(true);
    }

    const slotReminder = dateSlotsList.data.length % 3;
    const blankSlot = 3 - slotReminder;

    return (
        <>
            <ScrollView contentContainerStyle={styles.screen} contentContainerClassName='bg-slate-100'>
                <View className='bg-white'>
                    <Pressable onPress={() => router.back()} className='justify-between flex-row p-4 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">General Doctors</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Feather name="heart" size={20} color='black' />
                            <Feather name="share-2" size={20} color='black' />
                        </View>
                    </Pressable>
                    <View className='flex-row gap-4 p-[13px]'>
                        <Image className='' source={require('./../../../assets/images/doctor.jpg')} style={{ width: 80, height: 80 }} />
                        <View className='flex-1'>
                            <Text className="font-PoppinsSemibold text-sky-800 text-[15px] mb-2">{doctor.Name}</Text>
                            {doctor.Qualification ? <View className='flex-row gap-2'>
                                <FontAwesome name="graduation-cap" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-800 text-[12px] mb-[6px]">{doctor.Qualification}</Text>
                            </View> : null}
                            {doctor.SpecialistDesc ? <View className='flex-row gap-2'>
                                <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{doctor.SpecialistDesc}</Text>
                            </View> : null}

                            {stripHtml(doctor.PrescriptionFooter).result ? 

                            <View className='flex-row gap-2 mt-1'>
                                <Text className="font-PoppinsMedium text-gray-700 text-[13px] leading-6">{stripHtml(doctor.PrescriptionFooter).result}</Text>
                            </View>
                            // <Text className="font-PoppinsMedium text-gray-500 text-[13px] leading-6"></Text>
                            
                            : null}
                        </View>
                    </View>
                    {compCode === BC_ROY ? null : <View className='flex-row justify-between p-4 border-y border-gray-300 border-solid'>
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
                    </View>}
                </View>
                <View className='px-4 flex-row gap-2 justify-between bg-white border-b-2 border-gray-300'>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center border-b-2 border-primary-600">Schedule</Text>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">About</Text>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Clinics</Text>
                    <Text className="font-PoppinsMedium pt-4 pb-3 text-gray-600 text-[12px] flex-1 text-center">Reviews</Text>
                </View>

                {compCode === BC_ROY ? null : <>
                    <View className='justify-between flex-row items-center px-4 pt-4'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Clinic</Text>
                        </View>
                        <Pressable onPress={() => dispatch(setModal({ name: 'COMPANIES', state: true }))} className="gap-2 flex-row items-center ml-auto">
                            <Text className="font-PoppinsMedium text-sky-700 text-[13px] leading-5">1 more clinics</Text>
                            <Feather name="chevron-down" size={24} color='#0369a1' />
                        </Pressable>
                    </View>
                    <View className='bg-primary-500 mx-3 mt-3 rounded-3xl shadow-md shadow-primary-700 overflow-hidden'>
                        <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                            <View className='flex-1'>
                                <Text className="font-PoppinsSemibold text-[15px] text-white" numberOfLines={1}>{selectedCompany.COMPNAME}</Text>
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
                            <Link href={`/appn/clinic/${selectedCompany.CompanyId}`}>
                                <View>
                                    <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full'  />
                                </View>
                            </Link>
                        </View>
                    </View>
                </>}

                <View className='justify-between flex-row px-4 pt-1 items-center mt-4'>
                    <View className='flex-row items-center gap-3'>
                        {/* <Ionicons name="arrow-back-outline" size={24} color="black" /> */}
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Schedule Appointment</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="chevron-left" size={24} color='#6b7280' />
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </View>
                <View className='px-4'>
                    {(() => {
                        if (dateTabsList.loading) {
                            return <GridLoader classes='h-[70px] w-[50px]' containerClass='flex-row gap-3 mt-4' />
                        } else if (dateTabsList.err.status) {
                            return;
                        } else if (!dateTabsList.data.length) {
                            return <Text className='p-4 border border-rose-500 text-red-500 leading-5 text-center mt-8 rounded-lg font-PoppinsSemibold'>No Schedule Found</Text>
                        } else {
                            return (
                                <ScrollView horizontal={true} contentContainerClassName='gap-4 pb-2' showsHorizontalScrollIndicator={false}>
                                    {dateTabsList.data.map((i: any) => <DayBtn key={i.SDateStr} date={i.Day} day={i.DName.substring(0, 3)} active={i.SDateStr === selectedDate} handleActive={() => handleDateChange(i)} />)}
                                </ScrollView>
                            ) 
                        }
                    })()}
                </View>
                <View className='py-4 px-4 pb-2 bg-white shadow-md shadow-gray-300 mt-4'>
                    <View className='justify-start flex-row flex-wrap' style={{
                        // columnGap: '3.5%'   // 6 items
                        columnGap: '5%',    // 4 items
                        // columnGap: '10%',      // 3 items
                    }}>
                        {(() => {
                            if (dateSlotsList.loading) {
                                return <GridLoader classes='h-[50px] w-[30%] mb-3' count={6} containerClass='flex-row flex-wrap' />
                            } else if (dateSlotsList.err.status) {
                                return;
                            } else {
                                return (
                                    <>
                                        {dateSlotsList.data.map((i: any) => (<SlotBtn key={i.TimeStr} time={i.TimeStr} active={selectedSlot === i.AutoId} handleSelect={() => selectSlot(i.AutoId, i.SDateStr, i.SInTimeStr, i.EncCompanyId)}/>))}
                                        {Array.from(Array(blankSlot).keys()).map(i => (<SlotBtn time={'00:00 PM - 00:00 PM'} blank={true} key={i} />))}
                                    </>
                                )
                            }
                        })()}
                    </View>
                </View>
                {compCode === BC_ROY ? null : <ButtonPrimary title='Book Appointment' active={true} onPress={handleBooking} classes={`m-4 ${compCode === BC_ROY ? 'pointer-events-none' : ''}`} />}
            </ScrollView>
            <ReactNativeModal
                isVisible={confirmation}
                onBackdropPress={() => setConfirmation(false)}
                onBackButtonPress={() => setConfirmation(false)}
                animationIn="fadeInUp"
                animationOut="fadeOutDown"
                backdropOpacity={0.3}
                useNativeDriver
                coverScreen={true}
                style={{margin: 0, flex: 1, height: '100%', alignItems: undefined, justifyContent: 'center', }}
            >   
                {/* <MyModal modalActive={confirmation} name='LOGIN' child={<AppnPreview bookAppn={handleBookingFormSubmit} handleClose={setConfirmation} handleConfirmation={handleBookingFormSubmit} doctor={doctor} bookingData={bookingData} clinic={selectedCompany} member={selectedMember} />} /> */}
                <AppnPreview bookAppn={handleBookingFormSubmit} handleClose={setConfirmation} handleConfirmation={handleBookingFormSubmit} doctor={doctor} bookingData={bookingData} clinic={selectedCompany} member={selectedMember} remarks={remarks} setRemarks={setRemarks} loading={loading} />
            </ReactNativeModal>

            <ReactNativeModal
                isVisible={success}
                onBackdropPress={() => setSuccess(false)}
                onBackButtonPress={() => setSuccess(false)}
                animationIn="fadeInDown"
                animationOut="fadeOutUp"
                backdropOpacity={0.3}
                useNativeDriver
                coverScreen={true}
                style={{margin: 0, flex: 1, height: '100%', alignItems: undefined, justifyContent: 'center', }}
            >
                <View className={`absolute inset-0 bg-white ${success ? 'flex pointer-events-auto opacity-100' : 'd-none pointer-events-none opacity-0'}`}>
                    <BookingSuccess doctor={doctor} bookingData={bookingData} clinic={selectedCompany} />
                </View>
            </ReactNativeModal>
        </>
    )
}



export default withAutoUnmount(Booking);

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});

const SlotBtn = ({ time, active, handleSelect, blank }: any) => {
    console.log(time);
    
    // return (        
    //     <TouchableOpacity onPress={handleSelect} className={`${blank ? 'opacity-60' : ''} justify-center border-2 rounded-lg px-3 py-1 mb-3 ${active ? 'bg-primary-50 border-primary-400' : 'bg-gray-50 border-gray-300'}`} style={{
    //         width: '17.1%'     // 6 items
    //         // width: '21.25%' // 4 items
    //         // width: '26.66%'    // 3 items
    //     }}>
    //         <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time.split(' ')[0]}</Text>
    //         <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time.split(' ')[1]}</Text>
    //     </TouchableOpacity>
    // )
    
    return (        
        <TouchableOpacity onPress={handleSelect} className={`${blank ? 'opacity-60' : ''} flex-row justify-between items-center border-2 rounded-lg px-3 py-1 mb-3 ${active ? 'bg-primary-50 border-primary-400' : 'bg-gray-50 border-gray-300'}`} style={{
            width: '30%'
        }}>
            <View>
                <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] tracking-wider leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time.split(' ')[0]}</Text>
                <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] tracking-wider leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time.split(' ')[1]}</Text>
            </View>
            <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>-</Text>
            <View>
                <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] tracking-wider leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time.split(' ')[3]}</Text>
                <Text className={`${blank ? 'opacity-0' : ''} font-Poppins text-[11px] tracking-wider leading-5 text-center ${active ? 'text-primary-500' : 'text-gray-500'}`}>{time.split(' ')[4]}</Text>
            </View>
        </TouchableOpacity>
    )
}

const DayBtn = ({ date, day, active, handleActive }: any) => {

    return (
        <TouchableOpacity onPress={handleActive} className='gap-3 flex-1 text-center items-center'>
            <Text className={`font-PoppinsMedium pt-4 text-[12px] ${active ? 'text-gray-600' : 'text-gray-400'}`}>{day}</Text>
            <View className={`items-center justify-center h-11 w-12 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-primary-500' : 'bg-white'}`}>
                <Text className={`font-PoppinsMedium text-gray-600 text-[13px] leading-5 ${active ? 'text-white' : ''}`}>{date}</Text>
            </View>
        </TouchableOpacity>
    )
} 


 