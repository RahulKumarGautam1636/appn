import { Entypo, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { myColors } from '@/src/constants';
import { useDispatch, useSelector } from 'react-redux';
import { dumpCart, setLogin, setUser } from '@/src/store/slices/slices';
import { useState } from 'react';
import { Registeration } from '../../login';
import { MyModal } from '@/src/components';
import { RootState } from '@/src/store/store';
import { GradientBG } from '@/src/components/utils';


const Profile = () => {

    const user = useSelector((state: RootState) => state.user);
    const [personalInfoActive, setPersonalInfoActive] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(setLogin(false)); 
        dispatch(setUser({}))
        dispatch(dumpCart())
    }

    return (
        <>
        <MyModal customClass={'bg-white'} modalActive={personalInfoActive} onClose={() => setPersonalInfoActive(false)} child={
            <ScrollView>
                <Registeration isModal={true} />
            </ScrollView>
        } />
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <GradientBG>
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
                        <Image className='shadow-md shadow-gray-300 rounded-full me-3' source={require('./../../../assets/images/user.png')} style={{ width: 80, height: 80 }} />
                        <View>
                            <Text className="font-PoppinsSemibold text-slate-800 text-[15px] mb-2">{user.Name}</Text>
                            <View className='flex-row gap-2 mb-1'>
                                <FontAwesome5 name="calendar-check" size={15} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{user.Age} Year,   {user.GenderDesc}</Text>
                            </View>
                            <View className='flex-row gap-2'>
                                <FontAwesome5 name="phone" size={13} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-800 text-[12px]">{user.RegMob1}</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View className='flex-row justify-between border-y border-gray-300 border-solid'>
                        <View className='items-center flex-1 border-r border-gray-300'>
                            <Link href={'/testList'}>
                                <View className='items-center p-4'>
                                    <Text className="font-PoppinsBold text-blue-600 text-[18px] mb-0">2</Text>
                                    <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Members</Text>
                                </View>
                            </Link>
                        </View>
                        <View className='items-center flex-1'>
                            <Link href={'/appn/appnList'}>
                                <View className='items-center p-4'>
                                    <Text className="font-PoppinsBold text-blue-600 text-[18px] mb-0">6</Text>
                                    <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Orders</Text>
                                </View>
                            </Link>
                        </View>
                    </View> */}
                </View>
                <View className='m-4 gap-3'>
                    <Pressable onPress={() => setPersonalInfoActive(true)}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5 items-center'>
                            <FontAwesome name="user" size={24} color={myColors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Personal Details</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Pressable>                
                    <Link href={'/shop/tabs/orders'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5 items-center'>
                            <FontAwesome5 name="gift" size={22} color={myColors.primary[500]} style={{width: 26}} />
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">My Orders</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                    {/* <Link href={'#'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5'>
                            <Ionicons name="flask" size={22} color={myColors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Patient History</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link> */}
                    <Link href={'/members'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5'>
                            <FontAwesome5 name="users" size={20} color={myColors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Members</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                    {/* <Link href={'/login'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5'>
                            <FontAwesome5 name="history" size={20} color={myColors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Patient History</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link> */}
                    {/* <Link href={'#'}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5'>
                            <FontAwesome5 name="headset" size={20} color={myColors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Get Support</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link> */}
                    <Link href={'/shop/tabs/home'} onPress={handleLogout}>
                        <View className='flex-row gap-4 w-full bg-white rounded-lg shadow-sm p-5'>
                            <Entypo name="log-out" size={20} color={myColors.primary[500]} style={{width: 26}}/>
                            <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Logout</Text>
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </Link>
                </View>
            </GradientBG>
        </ScrollView>
        </>
    )
}

export default Profile;