import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card_3, CompCard, MyModal } from '../../src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, defaultId } from '@/src/constants';
import { getFrom, ListLoader, NoContent } from '../../src/components/utils';
import { setModal } from '@/src/store/slices/slices';
import { ChevronDown, Stethoscope, Users } from 'lucide-react-native';


const AppnList = ({ memberId }: any) => {

    const router = useRouter();
    const user = useSelector((i: RootState) => i.user);
    const compCode = useSelector((i: RootState) => i.compCode);
    const [active, setActive] = useState('ENQ');
    const { selected, list } = useSelector((i: RootState) => i.companies);
    const [appData, setAppnData] = useState({loading: false, data: {PartyFollowupList: []}, err: {status: false, msg: ''}}); 
    const [report, setReport] = useState('');

    useEffect(() => {
        const getAppnData = async (query: string, userId: string, companyId: string) => {
            if (user.UserId > 1) {
              const res = await getFrom(`${BASE_URL}/api/Appointment/Get?id=${userId}&CID=${companyId}&Type=${query}&CatType=OPD&MemberId=${memberId || '0'}`, {}, setAppnData);
              if (res) {
                setTimeout(() => {
                  setAppnData(res);            
                }, 400)
              }
            }
        }
        getAppnData(active, user.UserId, selected.EncCompanyId);
    }, [active, user.UserId, selected.EncCompanyId])

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
    // const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);

    return (
        <>
          {memberId ? null : <View className='justify-between flex-row p-4 items-center bg-slate-100'>
              <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
                  <Ionicons name="arrow-back-outline" size={24} color="black" />
                  <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Appointments</Text>
              </Pressable>
              <View className="gap-3 flex-row items-center ml-auto">
                  <Feather name="heart" size={20} color='black' />
                  <Feather name="share-2" size={20} color='black' />
              </View>
          </View>}
          <ScrollView contentContainerClassName='bg-slate-100'>                
            {compCode === defaultId ? <>
              <View className='px-4'>
                  {/* {memberId ? null : <View className=''>
                      <View className='bg-primary-500 mb-4 rounded-2xl shadow-sm shadow-gray-400'>
                          <View className='justify-between flex-row p-[13px] items-center border-b border-primary-300'>
                              <View className='flex-row items-center gap-3'>
                                  <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">Appointments</Text>
                              </View>
                              <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">{appData.data.PartyFollowupList.length} Items</Text>
                          </View>

                          <View className='flex-row gap-3 p-[13px]'>
                              <Text className="font-PoppinsSemibold text-white text-[13px] mr-auto">Next Appointment</Text>
                              <FontAwesome5 name="calendar-alt" size={17} color={`#fff`} />
                              <Text className="font-PoppinsSemibold text-white text-[13px]">Not Found</Text>
                          </View>
                      </View> 
                  </View>} */}
                  {list.length > 1 ? <View>
                      <View className='justify-between flex-row pt-1 items-center'>
                          <View className='flex-row items-center gap-2'>
                              <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-4">Select Clinic</Text>
                          </View>
                          <View className="gap-2 flex-row items-center ml-auto">
                              {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                              <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                              <Pressable onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))}>
                                  <Text className="font-PoppinsMedium text-primary-600 text-[13px] leading-[20px]">View All</Text>
                              </Pressable>
                          </View>
                      </View>
                      <ScrollView horizontal={true} contentContainerClassName='py-2 px-[2] gap-3 mb-2' showsHorizontalScrollIndicator={false}>
                          {list.map((i: any) => <CompCard data={i} key={i.EncCompanyId} active={selected?.EncCompanyId === i.EncCompanyId}/>)}
                      </ScrollView>
                  </View> : null}
              </View>
            </> : null}
            <View className='bg-white'>
                <View className='flex-row justify-between border-y border-gray-200 border-solid p-4 bg-white gap-3'>
                    <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'PENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('PENQ')}>
                        <Text className={`font-PoppinsMedium text-[13px] ${active === 'PENQ' ? 'text-white' : ''}`}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'ENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('ENQ')}>
                        <Text className={`font-PoppinsMedium text-[13px] ${active === 'ENQ' ? 'text-white' : ''}`}>Today</Text>                        
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'UENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('UENQ')}>
                        <Text className={`font-PoppinsMedium text-[13px] ${active === 'UENQ' ? 'text-white' : ''}`}>Upcoming</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className='p-3 gap-4'>
                {renderAppnData(appData)}
            </View>
          </ScrollView>
        </>
    )
}

export default AppnList;



