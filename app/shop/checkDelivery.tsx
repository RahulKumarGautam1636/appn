import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useEffect, useState } from 'react';
import { getFrom } from '@/src/components/utils';
import { BASE_URL } from '@/constants';

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

    const renderLocationList = (data: any) => {
        if (data.loading) {
            return <Text>Loading..</Text>;
        } else if (data.err.status) {
            return <div className='text-center my-5'><h2 className="text-danger mark">An error occured, please try again later. Error code: <span className='text-dark'>{data.err.msg}</span></h2></div>;
        } else if (data.data === 0) {
            setDeliverable(false);
            return <p className='text-danger mb-0 mt-2'>Now we have no service in this PIN - We will be available in your area very soon.</p>;
        } else {
            closeModal();
            setDeliverable(true);
            return;
        }
    } 
    
    return (
        <ScrollView contentContainerClassName='bg-white min-h-full p-4'>
            <View className=''>
                <View className='justify-between flex-row py-4 items-center'>
                    <Pressable className='flex-row items-center gap-3' onPress={closeModal}>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Department</Text>
                    </Pressable>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View>
                </View>
                <View className='mt-2 gap-4 realtive'>
                    <Text className='text-3xl'>Delivery Checking</Text>
                    {renderLocationList(locationList)}
                </View>
            </View>
        </ScrollView>
    )
}

export default CheckDelivery;