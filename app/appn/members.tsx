import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, View } from "react-native";
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { Card_2 } from '../components';
import { useRouter } from 'expo-router';

const Members = () => {
    const { membersList, selectedMember } = useSelector((state: RootState) => state.members);
    const router = useRouter();
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full p-4'>
            <View className=''>
                <View className='justify-between flex-row py-4 items-center'>
                    <Pressable className='flex-row items-center gap-3' onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Members</Text>
                    </Pressable>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View>
                </View>
                <View className='mt-2 gap-4 realtive'>
                    {membersList.map((member: any, index: number) => <Card_2 data={member} index={index} key={index} selectedDate={'01/05/2025'} />)}
                </View>
            </View>
        </ScrollView>
    )
}

export default Members;