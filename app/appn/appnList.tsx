import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card_3 } from '../../src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { BASE_URL, myColors } from '@/constants';
import { getFrom, ListLoader, NoContent } from '../../src/components/utils';
import { setModal } from '@/src/store/slices/slices';


const AppnList = () => {

    const router = useRouter();
    const user = useSelector((i: RootState) => i.user);
    const [active, setActive] = useState('ENQ');
    const { selected } = useSelector((i: RootState) => i.companies);
    const [appData, setAppnData] = useState({loading: false, data: {PartyFollowupList: []}, err: {status: false, msg: ''}});
    // const user = {
    //     Name: 'Dr. Theressa Wahler',
    //     Age: '08:30 AM,    23/05/2025',
    //     GenderDesc: 'Female',
    //     Qualification: 'Gynacologist',
    //     LabTests: 7,
    //     Appontments: 15,

    // }   

    useEffect(() => {
        const getAppnData = async (query: string, userId: string, companyId: string) => {
            if (user.UserId > 1) {
              const res = await getFrom(`${BASE_URL}/api/Appointment/Get?id=${userId}&CID=${companyId}&Type=${query}&CatType=OPD&MemberId=${'0'}`, {}, setAppnData);
              if (res) {
                setTimeout(() => {
                  setAppnData(res);            
                }, 400)
              }
            }
        }
        getAppnData(active, user.UserId, selected.EncCompanyId);
    }, [active, user.UserId, selected.EncCompanyId])

    // const getLabData = async (query, userId = user.UserId, companyId = user.selectedCompany.EncCompanyId) => {
    //     if (user.UserId > 1) {
    //       const res = await getFrom(`${BASE_URL}/api/Appointment/Get?id=${userId}&CID=${companyId}&Type=${query}&CatType=INVESTIGATION&MemberId=${'0'}`, {}, setLabData);
    //       if (res) {
    //         setTimeout(() => {
    //           setLabData(res);            
    //         }, 400)
    //       }
    //     }
    // }

    const renderAppnData = (data: any) => {

        if (data.loading) {
            return <ListLoader classes='h-[120px]'/>
        } else if (data.err.status) {
            return;
        } else if (data.data.PartyFollowupList.length === 0) {
            return <NoContent imgClass='h-[200] mt-5' label='No Appointments Found'/>
        } else {
            return data.data.PartyFollowupList.map((item: any) => <Card_3 data={item} key={item.AutoId} />)
        }
    }

    const dispatch = useDispatch();
    const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>                
            <View className='justify-between flex-row p-4 items-center'>
                <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Appointments</Text>
                </Pressable>
                <View className="gap-3 flex-row items-center ml-auto">
                    <Feather name="heart" size={20} color='black' />
                    <Feather name="share-2" size={20} color='black' />
                </View>
            </View>

            <View className='px-4 pt-1'>
                <View className=''>
                    <View className='bg-primary-500 mb-4 rounded-2xl shadow-md shadow-gray-400'>
                        <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">Lab Tests</Text>
                            </View>
                            <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">{appData.data.PartyFollowupList.length} Items</Text>
                        </View>

                        <View className='flex-row gap-3 p-4'>
                            <Text className="font-PoppinsSemibold text-white text-[14px] mr-auto">Booking Date</Text>
                            <FontAwesome5 name="calendar-alt" size={17} color={`#fff`} />
                            <Text className="font-PoppinsSemibold text-white text-[14px]">26/06/2025</Text>
                        </View>
                    </View> 
                </View>
                <View className='justify-between flex-row items-center mb-3'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Clinic</Text>
                    </View>
                    <Pressable onPress={() => dispatch(setModal({ name: 'COMPANIES', state: true }))} className="gap-2 flex-row items-center ml-auto">
                        <Text className="font-PoppinsMedium text-sky-700 text-[13px] leading-4">{companyList.length} more clinics</Text>
                        <Feather name="chevron-down" size={24} color='#0369a1' />
                    </Pressable>
                </View>
                <View className='bg-white mb-[1.15rem] rounded-2xl shadow-md shadow-gray-400 overflow-hidden'>
                    <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4'>
                        <View className='flex-1'>
                            <Text className="font-PoppinsSemibold text-[15px]" numberOfLines={1}>{selectedCompany.COMPNAME}</Text>
                            <View className='mt-2'>
                                <View className='flex gap-3 flex-row items-center'>
                                    <FontAwesome5 name="clock" size={14} color="gray" />
                                    <Text className="font-PoppinsMedium text-slate-500 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                                </View>
                                <View className='flex gap-3 flex-row items-center mt-2'>
                                    <FontAwesome5 name="map-marker-alt" size={14} color="gray" />
                                    <Text className="font-Poppins text-slate-500 text-[11px] leading-5" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                                </View>
                            </View>
                        </View>
                        <Link href={`/appn/clinic/${selectedCompany.CompanyId}`}>
                            <View>
                                <Feather name="chevron-right" size={24} color="gray" className='px-[9px] py-[9px] bg-blue-50 shadow-sm rounded-full'  />
                            </View>
                        </Link>
                    </View>
                </View>
            </View>
            <View className='bg-white'>
                <View className='flex-row justify-between border-y border-gray-200 border-solid p-4 bg-white gap-2'>
                    <TouchableOpacity className={`items-center flex-1 p-3 rounded-lg ${active === 'PENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('PENQ')}>
                        <Text className={`font-PoppinsMedium ${active === 'PENQ' ? 'text-white' : ''}`}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 p-3 rounded-lg ${active === 'ENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('ENQ')}>
                        <Text className={`font-PoppinsMedium ${active === 'ENQ' ? 'text-white' : ''}`}>Today</Text>                        
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 p-3 rounded-lg ${active === 'UENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('UENQ')}>
                        <Text className={`font-PoppinsMedium ${active === 'UENQ' ? 'text-white' : ''}`}>Upcoming</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className='p-3 gap-4'>
                {renderAppnData(appData)}
            </View>
            
        </ScrollView>
    )
}

export default AppnList;