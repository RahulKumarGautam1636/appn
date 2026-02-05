import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { Card_2 } from '../../src/components';
import { useRouter } from 'expo-router';
import { setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { groupMembers, uType } from '@/src/components/utils';

const Members = ({ modalActive }: any) => {
    const { membersList, selectedMember } = useSelector((state: RootState) => state.members);
    
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((i: RootState) => i.user);
    const isPatient = user.UserLevelSeq === uType.PATIENT.level;
    const handleBack = () => {
        if (modalActive) {
            dispatch(setModal({ name: 'MEMBERS', state: false }));
        } else {
            router.back();
        }
    }

    // Member grouping work.
    const primaryUser = membersList.find(i => i.MemberId === user.MemberId);
    const allMembers = membersList.filter(i => i.MemberId !== selectedMember.MemberId);  

    const groupedMembers = groupMembers(allMembers) || {};
    const members = Object.values(groupedMembers); 
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className=''>
                <View className='justify-between flex-row items-center px-4 pt-4 pb-2'>
                    <Pressable className='flex-row items-center gap-3' onPress={handleBack}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Members</Text>
                    </Pressable>
                    <TouchableOpacity className={`flex-row gap-3 items-center py-[0.68rem] px-5 rounded-lg bg-blue-500`} onPress={() => dispatch(setModal({ name: 'ADD_MEMBER', state: true }))}>
                        <Feather name="plus" size={20} color='white' />
                        <Text className={`font-PoppinsMedium text-white leading-6`}>Add New</Text>
                    </TouchableOpacity>
                </View>

                {isPatient ? 
                    <View className='gap-4 realtive px-4 pb-4 pt-2'>
                        {membersList.map((member: any, index: number) => (
                            <Animated.View key={index} entering={FadeInDown.delay(index * 200).springify()}>
                                <Card_2 active={member.MemberId === selectedMember.MemberId} data={member} />
                            </Animated.View>
                        ))}
                    </View>
                    :
                    <View className='gap-2 realtive bg-gray-200'>
                        {primaryUser?.MemberId && (
                        <View className='p-4 bg-white'>
                            <Text className='text-[0.7rem] mb-4 font-semibold px-3 pt-[0.35rem] pb-[0.4rem] bg-orange-50 text-orange-600 mr-auto rounded-xl'>Primary User</Text>
                            <Animated.View entering={FadeInDown.delay(0 * 200).springify()}>
                                <Card_2 active={primaryUser.MemberId === selectedMember.MemberId} data={primaryUser} classes={'border border-gray-200'} />
                            </Animated.View>
                        </View>
                        )}
                        
                        {members.flatMap((i: any, n: number) => {
                            return (
                                <Animated.View key={n} entering={FadeInDown.delay((n + 1) * 200).springify()}>
                                    <View className='p-4 bg-white'>
                                        {/* <Text className='text-[0.7rem] mb-2 font-semibold'>
                                            {user.MemberId == i.MemberId ? 'Primary User' : `CE: ${i.UnderDoctDesc}, PE: ${i.ProviderDesc}, RE: ${i.ReferrerDesc}, ME: ${i.MarketedDesc}`}
                                        </Text> */}
                                        <View className='flex flex-row flex-wrap mb-2'>
                                            <Text className='text-[0.7rem] mb-1.5 me-1.5 font-semibold px-3 pt-[0.35rem] pb-[0.4rem] bg-gray-200/60 text-gray-600 w-fit rounded-xl'>CE: {i.UnderDoctDesc}</Text>
                                            <Text className='text-[0.7rem] mb-1.5 me-1.5 font-semibold px-3 pt-[0.35rem] pb-[0.4rem] bg-gray-200/60 text-gray-600 w-fit rounded-xl'>PE: {i.ProviderDesc}</Text>
                                            <Text className='text-[0.7rem] mb-1.5 me-1.5 font-semibold px-3 pt-[0.35rem] pb-[0.4rem] bg-gray-200/60 text-gray-600 w-fit rounded-xl'>RE: {i.ReferrerDesc}</Text>
                                            <Text className='text-[0.7rem] mb-1.5 me-1.5 font-semibold px-3 pt-[0.35rem] pb-[0.4rem] bg-gray-200/60 text-gray-600 w-fit rounded-xl'>ME: {i.MarketedDesc}</Text>
                                        </View>
                                        {i.items.map((item: any) => (
                                            <Card_2 active={item.MemberId === selectedMember.MemberId} data={item} classes={'border border-gray-200 !shadow-sm'} />
                                        ))}
                                    </View>
                                </Animated.View>
                            )
                        })}
                    </View>
                }
            </View>
        </ScrollView>
    )
}

export default Members;