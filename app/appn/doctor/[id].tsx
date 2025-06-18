import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonPrimary from '@/app/components';
// import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/constants';
import { getFrom } from '@/app/components/utils';


const Booking = () => {

    // const { id } = useLocalSearchParams();
    const { appnData, doctor } = useSelector((i: RootState) => i.appnData)
    const selectedCompany = useSelector((i: RootState) => i.companies).selected
    const [selectedDate, setSelectedDate] = useState(appnData.selectedAppnDate);
    // const [filterdates, setFilterDates] = useState({dates: getDatesArray(new Date(), 5), activeDate: new Date().toLocaleDateString('en-TT')});
    const [dateTabsList, setDateTabsList] = useState({loading: true, data: [], err: {status: false, msg: ''}});
    const [dateSlotsList, setDateSlotsList] = useState({loading: true, data: [], err: {status: false, msg: ''}});

    useEffect(() => {
        console.log(selectedDate, '----------------------------------------')
        setSelectedDate(appnData.selectedAppnDate);
    }, [appnData.selectedAppnDate, doctor.PartyCode])

    useEffect(() => {
        if (!selectedCompany.EncCompanyId) return;
        getDateTabsList(selectedCompany.EncCompanyId, doctor.PartyCode, selectedDate);
        return () => {                                                               
                // setSelectedSlot(null);                             // Reset selected date slot whenever selected doctor changes.                
                setDateSlotsList(pre => {
                return {...pre, loading: true};                       // set dateSlotsList to loading phase.
            });                                                       // Or can also remove Dep. array to reset it on every render.
        }                                                                              
    },[doctor.PartyCode, selectedCompany.EncCompanyId, selectedDate]) 
    
    console.log(selectedDate)

    async function getDateTabsList(companyCode: string, doctorId: number, choosenDate: string) {

        const res = await getFrom(`${BASE_URL}/api/AppSchedule/Get?CID=${companyCode}&DID=${doctorId}`, {}, setDateTabsList);
        if (res) {
            setTimeout(() => {
                setDateTabsList(res);
                if (doctor.PartyCode) {
                    if (!res.data.length) return alert('No slots found');
                    let isDateAvailable = res.data.find((i: any) => i.SDateStr === choosenDate);
                    console.log(isDateAvailable);            
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
                        return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">Loading...</Text>
                    } else if (dateTabsList.err.status) {
                        return;
                    } else {
                        return dateTabsList.data.slice(0, 5).map((i: any) => <DayBtn key={i.SDateStr} date={i.Day} day={i.DName.substring(0, 3)} active={i.SDateStr === selectedDate} handleActive={() => setSelectedDate(i.SDateStr)} />)
                    }
                })()}
                {/* {filterdates.dates.map((i: any) => <DayBtn data={i} activeDate={filterdates.activeDate} handleActive={setFilterDates} />)} */}
                {/* <DayBtn day='Tue' date='11'/>
                <DayBtn day='Tue' date='12' active/>
                <DayBtn day='Wed' date='13'/>
                <DayBtn day='hur' date='14'/>
                <DayBtn day='Fri' date='15'/>
                <DayBtn day='Sat' date='16'/>
                <DayBtn day='Sun' date='17'/> */}
            </View>
            <View className='py-5 px-4 pb-2 bg-white shadow-md shadow-gray-300 mt-4'>
                <View className='justify-start flex-row flex-wrap' style={{columnGap: '3.5%'}}>
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
        </ScrollView>
    )
}

export default Booking;

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    }
});

const SlotBtn = ({ time, active }: any) => {
    return (
        <View className={`border-2 rounded-lg px-3 py-1 mb-3 ${active ? 'bg-pink-50 border-pink-400' : 'bg-gray-50 border-gray-300'}`} style={{width: '17.1%'}}>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-pink-500' : 'text-gray-500'}`}>{time}</Text>
            <Text className={`font-Poppins text-[11px] leading-5 text-center ${active ? 'text-pink-500' : 'text-gray-500'}`}>AM</Text>
        </View>
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


 