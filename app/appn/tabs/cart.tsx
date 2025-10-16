import ButtonPrimary, { MyModal } from '@/src/components';
import { BannerCarousel, NoContent, num } from '@/src/components/utils';
import { addToCart, dumpCart, removeFromCart, setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { myColors } from '@/src/constants';
import { LabCartCard } from '@/src/components/cards';
import Checkout from '@/app/appn/checkout';
import { useEffect, useState } from 'react';
import Heart from '../../../assets/icons/success.svg';
import colors from 'tailwindcss/colors';

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

    const [success, setSuccess] = useState(false);
    const viewOrders = () => {
        setSuccess(false);
        setCheckout(false);
        router.push('/appn/testList');
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
                                    <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">Lab Tests</Text>
                                </View>
                                <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">{itemsLength} Items</Text>
                            </View>

                            <View className='flex-row gap-3 p-4'>
                                <Text className="font-PoppinsSemibold text-white text-[13px] mr-auto">Booking Date</Text>
                                <FontAwesome5 name="calendar-alt" size={17} color={`#fff`} />
                                <Text className="font-PoppinsSemibold text-white text-[13px]">{new Date().toLocaleDateString('en-TT')}</Text>
                            </View>
                        </View> 
                        <View className='justify-between flex-row pt-1 items-center'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-5">Cart Contents</Text>
                            </View>
                        </View>
                        {labTests.length ? <View className='gap-4 realtive mt-4'>
                            {labTests.map((i: any) => (<LabCartCard data={i} key={i.LocationItemId} />))}
                        </View> : <NoContent label='Your Cart is Empty' containerClass='py-8' />}
                        <View className='bg-white mt-4 rounded-2xl shadow-lg border-b-2 border-gray-300'>
                            <View className='flex-row gap-4 w-full p-4 items-center'>
                                <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pr-4'>
                                    <TextInput placeholderTextColor={colors.gray[400]} placeholder='Search Lab Tests..' className='text-gray-700 py-4 items-start px-5 flex-1' />
                                    <Feather className='' name="search" size={24} color={myColors.primary[500]} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mx-4 mt-1 mb-3">Cart Summary</Text>
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
            <MyModal modalActive={checkout} name='CHECKOUT' onClose={() => setCheckout(false)} child={<Checkout handleClose={setCheckout} setSuccess={setSuccess} />} />
            <MyModal modalActive={success} name='SUCCESS' onClose={() => setSuccess(false)} child={<BookingSuccess handleClose={viewOrders} />} />
        </>
    )
}

export default Cart;

const BookingSuccess = ({ handleClose }: any) => {
  const selectedMember = useSelector((i: RootState) => i.members.selectedMember)
  const clinic = useSelector((i: RootState) => i.companies.selected)
  const lab = useSelector((i: RootState) => i.cart)
  const labTests = Object.values(lab);
  const dispatch = useDispatch();

  useEffect(() => {   
    return () => dispatch(dumpCart());
  }, [])
  return (
    <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
      <View className=''>
        {/* <View className='justify-between flex-row p-4 items-center'>
            <View className='flex-row items-center gap-3'>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
              <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Review & Pay</Text>
            </View>
            <View className="gap-3 flex-row items-center ml-auto">
                <Feather name="heart" size={20} color='black' />
                <Feather name="share-2" size={20} color='black' />
            </View>
        </View> */}
        <View className="px-4 mb-1 items-center">
          <Heart height={250} />
          <Text className="font-PoppinsSemibold text-gray-800 text-[18px] text-center">Thanks, Your Booking has Confirmed.</Text>
          <Text className="font-Poppins text-gray-600 text-[13px] text-center mt-2">Please check your Email for details.</Text>
        </View>
        <View className='bg-white rounded-3xl p-5 m-4 shadow-md shadow-gray-400'>
          <View className='flex-row items-center'>
              <Image className='shadow-md rounded-lg me-3' source={require('../../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
              <View>
                  <Text className="font-PoppinsBold text-[14px]">{selectedMember.MemberName}</Text>
                  <Text className="font-Poppins text-gray-500 text-[11px]">{selectedMember.RelationShipWithHolder || 'Patient'},  {selectedMember.Age} years,  {selectedMember.GenderDesc}</Text>
              </View>
              <FontAwesome name="check" size={20} color='#16a34a' className="ms-auto" />
          </View>
          <View className="p-4 bg-gray-100 my-6 rounded-xl gap-6">

            {labTests.map((i: any) => (
                // <View key={i.LocationItemId} className='flex-row gap-2 w-full px-5 py-4 border-b border-gray-200 items-center'>
                //     <Text className="font-PoppinsMedium text-gray-500 text-[13px] mr-auto leading-6 flex-1 pr-4">{i.Description}  X  {i.count}</Text>
                //     <FontAwesome name="rupee" size={13} color="#2563eb" />
                //     <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-5">{num(i.SRate * i.count)}</Text>
                // </View>

                <View key={i.LocationItemId} className='flex gap-3 flex-row'>
                    <Ionicons name={'flask'} size={17} color={colors.orange[500]} />
                    <Text className="font-Poppins text-gray-700 text-[13px] me-auto leading-5 flex-1" numberOfLines={1}>{i.Description}</Text>
                    <Text className="font-Poppins text-gray-700 text-[13px] leading-5">{i.testDate}</Text>
                </View>
            ))}

            
          </View>
          <View className='flex-row items-center mb-4 gap-4'>
            <FontAwesome5 name="hospital" size={35} color={myColors.primary[500]} />
            <View className="flex-1">
                <Text className="font-PoppinsSemibold text-[14px]">{clinic.COMPNAME}</Text>
                <Text className="font-Poppins text-gray-500 text-[11px]" numberOfLines={1}>{clinic.ADDRESS}</Text>
            </View>
          </View>
          <ButtonPrimary title='View Appointments' onPress={handleClose} classes='!h-[46px] bg-white border border-gray-400 mt-2' textClasses='text-[14px]' />
        </View>
      </View>
    </ScrollView>
  )
}