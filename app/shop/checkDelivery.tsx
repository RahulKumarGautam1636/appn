import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useEffect, useState } from 'react';
import { getFrom } from '@/src/components/utils';
import { BASE_URL } from '@/constants';
import { X } from 'lucide-react-native';
import { MyModal } from '@/src/components';
import { Registeration } from '../login';

const CheckDelivery = ({ setDeliverable, closeModal }: any) => {

    const compCode = useSelector((i: RootState) => i.compCode);
    const user = useSelector((i: RootState) => i.user);
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId);

    const [location, setLocation] = useState({ Pin: user.Pin });
    const [locationList, setLocationList] = useState({loading: true, data: '', err: {status: false, msg: ''}});
    
    useEffect(() => {      
        if (!location.Pin.length || location.Pin.length < 6) {
            alert('Your Pin Code is Invalid Please change your Pin Code.');
            closeModal();
            return;
        } else if (!locationId) {
            alert('Please select a location before placing orders.'); 
            closeModal();
            return;
        }
        const getServiceLocations = async () => {
            const res = await getFrom(`${BASE_URL}/api/Location/Get?CID=${compCode}&LocationId=${locationId}&PinCode=${location.Pin}`, {}, setLocationList);            // using useCallback to avoid esling warning about useEffect dependencies.
            if (res) {
                setLocationList(res);   
            }
        }
        setTimeout(() => {
            getServiceLocations();
        }, 1000);

    }, [location.Pin, locationId])

    useEffect(() => {
        if (location.Pin !== user.Pin) setLocation({ Pin: user.Pin });
    }, [user.Pin])

    useEffect(() => {
        if (!locationList.loading && !locationList.err.status) {
            if (locationList.data === 0) {
                setDeliverable(false);
            } else {
                setDeliverable(true);
                closeModal();
            }
        }
    }, [locationList]);

    // const renderLocationList = (data: any) => {
    //     if (data.loading) {
    //         return <Text>Loading..</Text>;
    //     } else if (data.err.status) {
    //         return <View className='text-center my-5'><Text className="text-danger mark">An error occured, please try again later. Error code: {data.err.msg}</Text></View>;
    //     } else if (data.data === 0) {
    //         setDeliverable(false);
    //         return <Text className='text-danger mb-0 mt-2'>Now we have no service in this PIN - We will be available in your area very soon.</Text>;
    //     } else {
    //         closeModal();
    //         setDeliverable(true);
    //         return;
    //     }
    // } 

    const [personalInfoActive, setPersonalInfoActive] = useState(false);
    
    return (
        <>
            <MyModal customClass={'bg-white'} modalActive={personalInfoActive} onClose={() => setPersonalInfoActive(false)} child={
                <ScrollView>
                    <Registeration isModal={true} />
                </ScrollView>
            } />
             <ScrollView contentContainerClassName='bg-white min-h-full p-4'>
            <View className=''>
                <View className='justify-between flex-row py-4 items-center border-b border-gray-200 mb-4'>
                    <Pressable className='flex-row items-center gap-3 mr-auto' onPress={closeModal}>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Please Note</Text>
                    </Pressable>
                    {/* <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View> */}
                    <Pressable onPress={closeModal}>
                        <Ionicons name="close" size={24} color="black" />
                    </Pressable>
                </View>
                <View className="bg-white rounded-t-3xl min-h-96 mt-3">
                    {/* <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-lg font-semibold text-gray-900">
                        Please Select a Service Location
                        </Text>
                        <TouchableOpacity className="p-1">
                        <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View> */}

                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2">
                        Pincode / Zip <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                        placeholder="Enter pincode"
                        value="741235"
                        keyboardType="numeric"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-red-500 text-sm leading-5">
                        Now we have no service in this PIN - We will be available in your area very soon.
                        </Text>
                    </View>

                    <View className="bg-gray-50 rounded-lg p-4">
                        <View className="flex-row items-center pb-4 mb-4 border-b border-gray-200">
                        <View className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                            <Text className="text-white text-xs font-bold">!</Text>
                        </View>
                        <Text className="text-gray-900 font-medium">WHAT YOU CAN DO !</Text>
                        </View>

                        <View className="gap-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-gray-700 flex-1">Change your address</Text>
                            <TouchableOpacity className="bg-blue-100 px-4 py-2 rounded-md" onPress={() => setPersonalInfoActive(true)}>
                            <Text className="text-blue-600 font-medium">Change Address</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className="text-gray-700 flex-1">Change the area</Text>
                            <TouchableOpacity className="bg-blue-100 px-4 py-2 rounded-md" onPress={() => {}}>
                            <Text className="text-blue-600 font-medium">Change Area</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </View>
                {/* {renderLocationList(locationList)} */}
            </View>
        </ScrollView>
        </>
       
    )
}

export default CheckDelivery;
