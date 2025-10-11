import { Entypo, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { hasAccess, myColors } from '@/src/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setUser } from '@/src/store/slices/slices';
import { useState } from 'react';
import { Registeration } from '../../login';
import { MyModal } from '@/src/components';
import { RootState } from '@/src/store/store';
import { GradientBG } from '@/src/components/utils';
import colors from 'tailwindcss/colors';


const Profile = () => {

    const user = useSelector((state: RootState) => state.user);
    const compCode = useSelector((state: RootState) => state.compCode);
    const [personalInfoActive, setPersonalInfoActive] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()
    
    return (
        <>
        <MyModal customClass={'bg-white'} modalActive={personalInfoActive} onClose={() => setPersonalInfoActive(false)} child={
            <ScrollView>
                <Registeration isModal={true} closeEdit={() => setPersonalInfoActive(false)} />
            </ScrollView>
        } />
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            {/* <GradientBG> */}
                <View className='bg-white'>
                    <View className='justify-between flex-row p-4 items-center'>
                        <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Profile</Text>
                        </Pressable>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Feather name="heart" size={20} color='black' />
                            <Feather name="share-2" size={20} color='black' />
                        </View>
                    </View>
                    <View className='flex-row gap-4 p-[13px] items-center mb-2'>
                        <Image className='shadow-md shadow-gray-300 rounded-full me-3' source={require('./../../../assets/images/user.png')} style={{ width: 78, height: 78 }} />
                        <View>
                            <Text className="font-PoppinsSemibold text-[#075985] text-[15px] mb-2">{user.Name}</Text>
                            <View className='flex-row gap-2 mb-[8px]'>
                                <FontAwesome5 name="clock" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{user.Age} Year,   {user.GenderDesc}</Text>
                            </View>
                            <View className='flex-row gap-2'>
                                <FontAwesome5 name="shield-alt" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{user.UserType}</Text>
                            </View>
                        </View>
                    </View>
                    {hasAccess("labtest", compCode) ? <View className='flex-row justify-between border-y border-gray-300 border-solid'>
                        <View className='items-center flex-1 border-r border-gray-300'>
                            <Link href={'/appn/testList'}>
                                <View className='items-center p-4'>
                                    <Text className="font-PoppinsBold text-blue-600 text-[18px] mb-0">7</Text>
                                    <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Lab Tests</Text>
                                </View>
                            </Link>
                        </View>
                        <View className='items-center flex-1'>
                            <Link href={'/appn/appnList'}>
                                <View className='items-center p-4'>
                                    <Text className="font-PoppinsBold text-blue-600 text-[18px] mb-0">15</Text>
                                    <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Appointments</Text>
                                </View>
                            </Link>
                        </View>
                    </View> : null}
                </View>
                <View className='m-4 gap-3'>
                    <Pressable onPress={() => setPersonalInfoActive(true)}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px] items-center'>
                            <FontAwesome name="user" size={24} color={colors.teal[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Personal Information</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Pressable>                
                    <Link href={'/appn/appnList'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px] items-center'>
                            <FontAwesome5 name="calendar-alt" size={22} color={colors.pink[500]} style={{width: 26}} />
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Appointments</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                    {hasAccess("labtest", compCode) ? <Link href={'/appn/testList'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px]'>
                            <Ionicons name="flask" size={22} color={colors.purple[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Lab Tests</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link> : null}
                    <Link href={'/members'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px]'>
                            <FontAwesome5 name="users" size={20} color={colors.orange[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Members</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                    {/* <Link href={'/login'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px]'>
                            <FontAwesome5 name="history" size={20} color={colors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Patient History</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link> */}
                    <Link href={'/appn/tabs/opd'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px]'>
                            <FontAwesome5 name="headset" size={20} color={colors.fuchsia[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Get Support</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                    <Link href={'/appn/tabs/opd'} onPress={() => {dispatch(setLogin(false)); dispatch(setUser({}))}}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-[15px]'>
                            <Entypo name="log-out" size={20} color={colors.cyan[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Logout</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                </View>
            {/* </GradientBG> */}
        </ScrollView>
        </>
    )
}

export default Profile;