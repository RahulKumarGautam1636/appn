import ButtonPrimary, { MyModal } from '@/src/components';
import { BannerCarousel, NoContent, num } from '@/src/components/utils';
import { addToCart, removeFromCart, setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { myColors } from '@/constants';
import { LabCartCard } from '@/src/components/cards';
import Checkout from '../../checkout';
import { useState } from 'react';

const Cart = ({}: any) => {
    const lab = useSelector((i: RootState) => i.cart)
    const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn)
    const labTests = Object.values(lab)
    const dispatch = useDispatch()
    const [checkout, setCheckout] = useState(false)
    const router = useRouter();
                                                            
    const itemsLength = labTests.length;
    let itemsValue = labTests.map((i: any) => i.SRate * i.count);
    let cartTotal = itemsLength !== 0 ? itemsValue.reduce((total, item) => total+item).toFixed(2) : '00';

    const handleCheckout = () => {
        if (!isLoggedIn) return dispatch(setModal({name: 'LOGIN', state: true}))
        if (!itemsLength) return alert('Please add some items to your cart before making order.')
        setCheckout(true)
    }
    
    return (
        <>
            <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
                <View className=''>
                    <View className='p-4'>
                        <Pressable onPress={() => router.back()} className='justify-between flex-row pb-4 items-center'>
                            <View className='flex-row items-center gap-3'>
                                <Ionicons name="arrow-back-outline" size={24} color="black" />
                                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Cart</Text>
                            </View>
                            <View className="gap-3 flex-row items-center ml-auto">
                                <Feather name="heart" size={20} color='black' />
                                <Feather name="share-2" size={20} color='black' />
                            </View>
                        </Pressable> 

                        <View className='bg-primary-500 mb-4 rounded-2xl shadow-md shadow-gray-400'>
                            <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                                <View className='flex-row items-center gap-3'>
                                    <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">Lab Tests</Text>
                                </View>
                                <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">{itemsLength} Items</Text>
                            </View>

                            <View className='flex-row gap-3 p-4'>
                                <Text className="font-PoppinsSemibold text-white text-[14px] mr-auto">Booking Date</Text>
                                <FontAwesome5 name="calendar-alt" size={17} color={`#fff`} />
                                <Text className="font-PoppinsSemibold text-white text-[14px]">26/06/2025</Text>
                            </View>
                        </View> 
                        <View className='justify-between flex-row pt-1 items-center'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Cart Contents</Text>
                            </View>
                        </View>
                        {labTests.length ? <View className='gap-4 realtive mt-4'>
                            {labTests.map((i: any) => (<LabCartCard data={i} key={i.LocationItemId} />))}
                        </View> : <NoContent label='Your Cart is Empty' containerClass='py-8' />}
                        <View className='bg-white mt-4 rounded-2xl shadow-lg border-b-2 border-gray-300'>
                            <View className='flex-row gap-4 w-full p-4 items-center'>
                                <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pr-4'>
                                    <TextInput placeholder='Search Lab Tests..' className='text-gray-700 py-4 items-start px-5 flex-1' />
                                    <Feather className='' name="search" size={24} color={myColors.primary[500]} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] mx-4 mt-1 mb-3">Cart Summary</Text>
                    <View className='bg-white shadow-sm shadow-gray-400'>
                        {labTests.map((i: any) => (
                            <View key={i.LocationItemId} className='flex-row gap-2 w-full px-5 py-4 border-b border-gray-200 items-center'>
                                <Text className="font-PoppinsMedium text-gray-500 text-[13px] mr-auto leading-6 flex-1 pr-4">{i.Description}  X  {i.count}</Text>
                                <FontAwesome name="rupee" size={13} color="#2563eb" />
                                <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-5">{num(i.SRate * i.count)}</Text>
                            </View>
                        ))}
                        <View className='flex-row gap-2 w-full p-5 items-center'>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mr-auto leading-3">Cart Total</Text>
                            <FontAwesome name="rupee" size={13} color="#2563eb" />
                            <Text className="font-PoppinsSemibold text-slate-800 text-[14px] leading-5">{cartTotal}</Text>
                        </View>
                    </View>
                    <ButtonPrimary title='CHECKOUT' isLoading={false} active={true} onPress={handleCheckout} classes='m-4' />
                </View>
            </ScrollView>
            <MyModal modalActive={checkout} name='CHECKOUT' onClose={() => setCheckout(false)} child={<Checkout handleClose={setCheckout} />} />
        </>
    )
}


export default Cart;