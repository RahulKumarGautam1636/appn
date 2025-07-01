import ButtonPrimary from '@/src/components';
import { BannerCarousel, num } from '@/src/components/utils';
import { addToCart, removeFromCart, setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { myColors } from '@/constants';

const Cart = ({}: any) => {
    const dispatch = useDispatch()
    const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);
    const router = useRouter()
    const lab = useSelector((i: RootState) => i.cart).lab
    const labTests = Object.values(lab);
                                                            
    const itemsLength = labTests.length;
    let itemsValue = labTests.map((i: any) => i.SRate * i.count);
    let cartTotal = itemsLength !== 0 ? itemsValue.reduce((total, item) => total+item).toFixed(2) : '00';

    return (
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

                    <View className='bg-white mb-4 rounded-2xl shadow-md shadow-gray-400'>
                        <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Lab Tests</Text>
                            </View>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">{itemsLength} Items</Text>
                        </View>

                        <View className='flex-row gap-3 p-4'>
                            <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Booking Date</Text>
                            <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} />
                            <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">26/06/2025</Text>
                        </View>
                    </View> 
                    <View className='bg-primary-500 mb-4 rounded-2xl shadow-md shadow-primary-700 overflow-hidden'>
                        {/* <View className='justify-between flex-row px-5 pt-2 pb-[5] items-center border-b border-primary-300'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-white text-[14px] items-center leading-5">Clinics</Text>
                            </View>
                            <Pressable onPress={() => {}} className="gap-3 flex-row items-center ml-auto">
                                <Text className="font-Poppins text-white text-[12px] leading-4">2 more clinics</Text>
                                <Feather name="chevron-down" size={24} color='#fff' />
                            </Pressable>
                        </View> */}

                        <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                            <View className='flex-1'>
                                <Text className="font-PoppinsSemibold text-[15px] text-white">{selectedCompany.COMPNAME}</Text>
                                <View className='mt-2 '>
                                    <View className='flex gap-3 flex-row items-center'>
                                        <FontAwesome5 name="clock" size={14} color="#fff" />
                                        <Text className="font-PoppinsMedium text-gray-100 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                                    </View>
                                    <View className='flex gap-3 flex-row items-center mt-2'>
                                        <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />
                                        <Text className="font-Poppins text-gray-100 text-[11px] leading-5" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                                    </View>
                                </View>
                            </View>
                            <Link href={`/appn/clinic/${selectedCompany.CompanyId}`} className='px-[9px] py-[9px] bg-primary-400 rounded-full'>
                                <Feather name="chevron-right" size={24} color="#fff" className=''  />
                            </Link>
                        </View>
                    </View>
                    {labTests.length ? <View className='gap-4 realtive mb-4'>
                        {labTests.map((i: any) => (
                            <View className='bg-white rounded-2xl shadow-lg' key={i.ItemId}>
                                <View className='p-4'>
                                    <Text className="font-PoppinsSemibold text-sky-800">{i.Description}</Text>
                                    <View className='flex-row gap-4 items-end justify-between w-full mt-[6px]'>
                                        <View>
                                            <Text className="text-gray-500 text-sm font-PoppinsMedium">{i.CategoryName}</Text>
                                            <View className='flex-row gap-4 items-center mt-1'>
                                                <Text className="mt-2 text-[13px] text-blue-600 font-PoppinsSemibold leading-5"><FontAwesome name="rupee" size={13} color="#2563eb" /> {i.SRate}</Text>
                                                <Text className="text-red-700 opacity-65 mt-2 text-sm font-PoppinsSemibold leading-5">X  {i.count}</Text>
                                            </View>
                                        </View>
                                        <View className='flex-row gap-4 items-center'>
                                            <View className='px-[10px] py-[8px] bg-gray-100 rounded-full justify-between gap-4 ml-auto flex-row shadow-sm shadow-gray-500'>
                                                <TouchableOpacity onPress={() => dispatch(addToCart({type: 'lab', item: {...i, count: i.count - 1}}))}>
                                                    <Feather name="minus" size={16} color="#6b7280" />
                                                </TouchableOpacity>
                                                <Text className='leading-6 font-PoppinsSemibold'>{i.count}</Text>
                                                <TouchableOpacity onPress={() => dispatch(addToCart({type: 'lab', item: {...i, count: i.count + 1}}))}>
                                                    <Feather name="plus" size={16} color="#6b7280" />
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity onPress={() => dispatch(removeFromCart({type: 'lab', item: i}))}>
                                                <Feather name="trash-2" size={19} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View className='flex-row w-full p-4 border-t border-gray-200 items-center'>
                                    <Text className="font-PoppinsMedium text-slate-700 text-[14px] leading-6 mr-auto">Test Date :</Text>
                                    <Text className="font-PoppinsMedium text-slate-500 text-[14px] leading-6 mr-2">25/08/2025</Text>
                                    <Feather name="chevron-down" size={22} color='gray' />
                                </View> 
                            </View>
                        ))}
                    </View> : ''}
                    <View className='bg-white mb-4 rounded-2xl shadow-lg shadow-gray-400'>
                        <View className='flex-row gap-4 w-full p-4 border-b border-gray-200 items-center'>
                            <View className='relative w-full'>
                                <TextInput placeholder='Add More Tests..' className='z-10 bg-[#ebecef] py-4 items-start px-5 rounded-2xl shadow-sm shadow-gray-500 w-full' />
                                <Feather className='absolute z-50 top-[12px] right-4' name="search" size={22} color={myColors.primary[500]} />
                            </View>
                        </View>
                    </View>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[17px]">Order Summary</Text>
                    
                    <View className='bg-white mt-3 rounded-2xl shadow-lg shadow-gray-400'>
                        {labTests.map((i: any) => (
                            <View key={i._id} className='flex-row gap-2 w-full px-5 py-4 border-b border-gray-200 items-center'>
                                <Text className="font-PoppinsMedium text-gray-500 text-[13px] mr-auto leading-6 flex-1 pr-4">{i.Description}  X  {i.count}</Text>
                                <FontAwesome name="rupee" size={13} color="#2563eb" />
                                <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-5">{num(i.SRate * i.count)}</Text>
                            </View>
                        ))}
                        {/* <View className='flex-row gap-2 w-full p-5 border-b border-gray-200 items-center'>
                            <Text className="font-PoppinsMedium text-gray-500 text-[14px] mr-auto leading-3">Appointments  X  2</Text>
                            <FontAwesome name="rupee" size={13} color="#2563eb" />
                            <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-5">560</Text>
                        </View>
                        <View className='flex-row gap-2 w-full p-5 border-b-2 border-slate-300 items-center'>
                            <Text className="font-PoppinsMedium text-gray-500 text-[14px] mr-auto leading-3">Appointments  X  2</Text>
                            <FontAwesome name="rupee" size={13} color="#2563eb" />
                            <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-5">560</Text>
                        </View> */}

                        <View className='flex-row gap-2 w-full p-5 items-center'>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mr-auto leading-3">Order Total</Text>
                            <FontAwesome name="rupee" size={13} color="#2563eb" />
                            <Text className="font-PoppinsSemibold text-slate-800 text-[14px] leading-5">{cartTotal}</Text>
                        </View>
                    </View>
                    <ButtonPrimary title='Book Lab Test' isLoading={false} active={true} onPress={() => {}} classes='mt-4' />
                </View>
            </View>
        </ScrollView>
    )
}


export default Cart;