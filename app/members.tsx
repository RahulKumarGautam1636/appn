import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { Card_2 } from '../src/components';
import { useRouter } from 'expo-router';
import { setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Members = ({ modalActive }: any) => {
    const { membersList, selectedMember } = useSelector((state: RootState) => state.members);
    
    const dispatch = useDispatch();
    const router = useRouter();
    const handleBack = () => {
        if (modalActive) {
            dispatch(setModal({ name: 'MEMBERS', state: false }));
        } else {
            router.back();
        }
    }
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full p-4'>
            <View className=''>
                <View className='justify-between flex-row pt-2 pb-4 items-center'>
                    <Pressable className='flex-row items-center gap-3' onPress={handleBack}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Members</Text>
                    </Pressable>
                    <TouchableOpacity className={`flex-row gap-3 items-center py-[0.68rem] px-5 rounded-lg bg-blue-500`} onPress={() => dispatch(setModal({ name: 'ADD_MEMBER', state: true }))}>
                        <Feather name="plus" size={20} color='white' />
                        <Text className={`font-PoppinsMedium text-white leading-6`}>Add New</Text>
                    </TouchableOpacity>
                </View>
                <View className='mt-2 gap-4 realtive'>
                    {membersList.map((member: any, index: number) => (
                        <Animated.View entering={FadeInDown.delay(index * 200).springify()}>
                            <Card_2 active={member.MemberId === selectedMember.MemberId} data={member} index={index} key={index} selectedDate={'01/05/2025'} />
                        </Animated.View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default Members;