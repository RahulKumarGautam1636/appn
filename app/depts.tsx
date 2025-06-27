import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { Card_2 } from '../src/components';
import { useRouter } from 'expo-router';
import { setDepts, setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';

const Depts = ({ deptsList, onSelect, handleBack }: any) => {
    
    return (
        <ScrollView contentContainerClassName='bg-white min-h-full p-4'>
            <View className=''>
                <View className='justify-between flex-row py-4 items-center'>
                    <Pressable className='flex-row items-center gap-3' onPress={handleBack}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Department</Text>
                    </Pressable>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View>
                </View>
                <View className='mt-2 gap-4 realtive'>
                    {deptsList.map((i: any) => (
                        <TouchableOpacity key={i.SubCode} onPress={() => onSelect(i)} className="flex-row items-center gap-4 bg-slate-100 shadow-sm border border-purple-200 rounded-lg p-4">
                            <View className="uppercase h-11 w-11 items-center justify-center rounded-full bg-purple-500">
                                <Text className='text-white font-PoppinsMedium'>{(i.Description).substr(0, 2)}</Text>
                            </View>
                            <View>
                                <Text className="text-md font-semibold">{i.Description}</Text>
                                {/* <Text className="text-gray-500 mt-1"></Text> */}
                            </View>
                            <Feather name="chevron-right" className='ml-auto' size={24} color='#6b7280' />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default Depts;


export const DeptsModal = ({ modalActive }: any) => {

    const dispatch = useDispatch();
    // const router = useRouter();
    const depts = useSelector((i: RootState) => i.depts);
    const handleBack = () => {
        // if (modalActive) {
            dispatch(setModal({ name: 'DEPTS', state: false }));
        // } else {
        //     router.back();
        // }
    }

    const onSelect = (i: any) => {
        dispatch(setDepts({selected: i})); 
        handleBack();
    }

    return <Depts deptsList={depts.list} onSelect={onSelect} handleBack={handleBack} />
}