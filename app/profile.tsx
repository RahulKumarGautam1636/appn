import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { Image, ScrollView, Text, View } from "react-native";


const Profile = () => {

    const user = {
        Name: 'Emma Phillips',
        Age: 35,
        GenderDesc: 'Female',
        Qualification: 'Gynacologist',
        LabTests: 7,
        Appontments: 15,

    }
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className='bg-white'>
                <View className='justify-between flex-row p-4 items-center'>
                    <View className='flex-row items-center gap-3'>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Profile</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View>
                </View>
                <View className='flex-row gap-4 p-[13px] items-center mb-2'>
                    <Image className='shadow-md shadow-gray-300 rounded-full me-3' source={require('./../assets/images/user.png')} style={{ width: 80, height: 80 }} />
                    <View>
                        <Text className="font-PoppinsSemibold text-slate-800 text-[15px] mb-2">{user.Name}</Text>
                        <View className='flex-row gap-2'>
                            <FontAwesome name="graduation-cap" size={15} color="#075985" />
                            <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{user.Age} Year,   {user.GenderDesc}</Text>
                        </View>
                        {/* <View className='flex-row gap-2'>
                            <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                            <Text className="font-PoppinsMedium text-gray-800 text-[12px]">{user.Qualification}</Text>
                        </View> */}
                    </View>
                </View>
                <View className='flex-row justify-between border-y border-gray-300 border-solid'>
                    <View className='items-center flex-1 border-r border-gray-300 p-4'>
                        <Text className="font-PoppinsBold text-sky-600 text-[18px] mb-0">7</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Lab Tests</Text>
                    </View>
                    {/* <View className='items-center flex-1 '>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mb-1">2566</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Patients</Text>
                    </View> */}
                    <View className='items-center flex-1 p-4'>
                        <Text className="font-PoppinsBold text-sky-600 text-[18px] mb-0">15</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Appointments</Text>
                    </View>
                </View>
            </View>
            <View className='bg-white m-3 rounded-lg shadow-lg shadow-gray-400'>
                <Link href={'/'}>
                    <View className='flex-row gap-4 w-full p-5 border-b border-gray-200 items-center'>
                        <FontAwesome name="user" size={24} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Personal Information</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>                
                <Link href={'/'}>
                    <View className='flex-row gap-4 w-full p-5 border-b border-gray-200 items-center'>
                        <FontAwesome6 name="calendar-alt" size={22} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Appointments</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>
                <Link href={'/'}>
                    <View className='flex-row gap-4 w-full p-5 border-b border-gray-200'>
                        <Ionicons name="flask" size={22} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Lab Tests</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>
                <Link href={'/appn/members'}>
                    <View className='flex-row gap-4 w-full p-5 border-b border-gray-200'>
                        <FontAwesome5 name="users" size={20} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Members</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>
                <Link href={'/'}>
                    <View className='flex-row gap-4 w-full p-5 border-b border-gray-200'>
                        <FontAwesome5 name="history" size={20} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Patient History</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>
                <Link href={'/'}>
                    <View className='flex-row gap-4 w-full p-5 border-b border-gray-200'>
                        <FontAwesome5 name="headset" size={20} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Get Support</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>
                <Link href={'/'}>
                    <View className='flex-row gap-4 w-full p-5'>
                        <Entypo name="log-out" size={20} color="#ec4899" style={{width: 26}}/>
                        <Text className="font-PoppinsMedium text-slate-700 text-[14px] mr-auto">Logout</Text>
                        <Feather name="chevron-right" size={24} color='#6b7280' />
                    </View>
                </Link>
            </View>
        </ScrollView>
    )
}

export default Profile;