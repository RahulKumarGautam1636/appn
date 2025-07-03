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
import { LabCartCard } from '@/src/components/cards';

const Cart = ({}: any) => {
    const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);
    const { selectedMember } = useSelector((i: RootState) => i.members)
    const router = useRouter()
    const lab = useSelector((i: RootState) => i.cart).lab
    const labTests = Object.values(lab);
    const dispatch = useDispatch();
                                                            
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
                    <View className='justify-between flex-row pt-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Patient Details</Text>
                        </View>
                    </View>
                    <View className='bg-white rounded-2xl p-5 my-4 shadow-md shadow-gray-400'>
                        <View className='flex-row items-center'>
                            <Image className='shadow-lg rounded-full me-3' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                            <View>
                            <Text className="font-PoppinsBold text-[14px]">{selectedMember.MemberName}</Text>
                            <Text className="font-Poppins text-gray-500 text-[11px]">{selectedMember.RelationShipWithHolder}</Text>
                            </View>
                            {/* <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" /> */}
                            <Pressable onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} className="ms-auto">
                            <FontAwesome name="refresh" size={24} color="#2563eb"/>
                            </Pressable>
                        </View>
                        <View className='py-3 px-4 bg-gray-100 mt-4 rounded-xl flex gap-3 flex-row'>
                            <FontAwesome5 name="calendar-alt" size={17} color="#000" />
                            <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">{selectedMember.Age} Years</Text>
                            <FontAwesome5 name="clock" size={17} color="#000" />
                            <Text className="font-Poppins text-gray-500 text-[13px] leading-5">{selectedMember.GenderDesc}</Text>
                        </View>
                        {/* <Text className="text-sm py-3 text-gray-500">
                        <Text className="text-primary-500 font-Poppins">Note: </Text>
                        You can submit patient details, old prescription, and test reports in the drop link.
                        </Text>
                        <ButtonPrimary title='Add Document' classes='p-[10px] bg-gray-50 border-dashed border border-gray-400 mt-1' textClasses='text-sm' /> */}
                    </View>
                    <View className='justify-between flex-row pt-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Clinic Details</Text>
                        </View>
                    </View>
                    <View className='bg-primary-500 my-4 rounded-2xl shadow-md shadow-primary-700 overflow-hidden'>
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
                    <View className='justify-between flex-row pt-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Cart Contents</Text>
                        </View>
                    </View>
                    {labTests.length ? <View className='gap-4 realtive my-4'>
                        {labTests.map((i: any) => (<LabCartCard data={i} key={i._id} />))}
                    </View> : null}
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