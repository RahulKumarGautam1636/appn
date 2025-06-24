import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card_3 } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { BASE_URL } from '@/constants';
import { getFrom, ListLoader, NoContent } from '../components/utils';


const Profile = () => {

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

    
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className='bg-white'>
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
                <View className='flex-row justify-between border-y border-gray-300 border-solid p-4 bg-white gap-2 mt-2'>
                    <TouchableOpacity className={`items-center flex-1 p-3 rounded-lg ${active === 'PENQ' ? 'bg-pink-500' : 'bg-slate-200'}`} onPress={() => setActive('PENQ')}>
                        <Text className={`font-PoppinsMedium ${active === 'PENQ' ? 'text-white' : ''}`}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 p-3 rounded-lg ${active === 'ENQ' ? 'bg-pink-500' : 'bg-slate-200'}`} onPress={() => setActive('ENQ')}>
                        <Text className={`font-PoppinsMedium ${active === 'ENQ' ? 'text-white' : ''}`}>Today</Text>                        
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 p-3 rounded-lg ${active === 'UENQ' ? 'bg-pink-500' : 'bg-slate-200'}`} onPress={() => setActive('UENQ')}>
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

export default Profile;