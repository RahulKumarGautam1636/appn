import ButtonPrimary, { getDateDifference } from '@/src/components';
import { BannerCarousel, num, wait } from '@/src/components/utils';
import { addToCart, dumpCart, removeFromCart, setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, myColors } from '@/src/constants';
import { useState } from 'react';
import axios from 'axios';
import colors from 'tailwindcss/colors';

const Checkout = ({ handleClose, handleSuccess }: any) => {
    const { selected } = useSelector((state: RootState) => state.companies);
    const compInfo = useSelector((state: RootState) => state.company.info);
    const { selectedMember } = useSelector((i: RootState) => i.members)
    const router = useRouter()
    const lab = useSelector((i: RootState) => i.cart)
    const labTests = Object.values(lab);
    const dispatch = useDispatch();
    const [bookingData, setBookingData] = useState({ AppointDate: '', AppTime: '', TimeSlotId: null }); 
    const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
    const user = useSelector((i: RootState) => i.user);
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false)
                                                            
    const itemsLength = labTests.length;
    let itemsValue = labTests.map((i: any) => i.SRate * i.count);
    let cartTotal = itemsLength !== 0 ? itemsValue.reduce((total, item) => total+item).toFixed(2) : '00';
    let testDate = itemsLength ? labTests[0].testDate : '';
    let selectedCompany = selected.EncCompanyId === compInfo.EncCompanyId ? compInfo : selected;

    const handleBack = () => {
        if (handleClose) {
            handleClose(false);
        } else {
            router.back()
        }
    }

    let orderList = labTests.map((i: any) => ({                           
        AutoId: i.AutoId,
        ItemId: i.ItemId, 
        BillQty: i.count,
        Rate: (((i.count * i.SRate) - (((i.count * i.SRate * i.IGSTRATE) / (i.IGSTRATE + 100))))/i.count).toFixed(2),
        Amount: i.count * i.SRate,

        DepartmentId: i.DepartmentId,
        SubCategoryId: i.SubCategoryId,

        TranDate: i.testDate,
        TranDateStr: i.testDate
    }))

      const handleBookingFormSubmit = async (e) => {
        e.preventDefault();
        if (!labTests.length) return alert('Your Cart is empty. Please add some Tests in your cart to proceed.')
        if (isLoggedIn) {
          let appDate = getDateDifference(testDate); 
          if (!selectedMember.MemberId) {     
            // if (getConfirmation(`Book Lab Test for ${userInfo.Name} in ${userInfo.selectedCompany.COMPNAME}`) === false) return; 
            const newbookingData = { 
            //   ...bookingInfo,
              Salutation: user.Salutation,
              Name: user.Name,
              EncCompanyId: selectedCompany.EncCompanyId,
              PartyCode: selectedCompany.CompUserPartyCode,          
              MPartyCode: selectedCompany.CompUserMPartyCode,        
              RegMob1: user.RegMob1,
              Gender: user.Gender,
              GenderDesc: user.GenderDesc,
              Address: user.Address,
              Age: user.Age,
              AgeMonth: user.AgeMonth,
              AgeDay: user.AgeDay,
              State: user.State,
              City: user.City,
              Pin: user.Pin,
              Address2: user.Address2,
              AnniversaryDate: user.AnniversaryDate,
              Aadhaar: user.Aadhaar,
              UserId: user.UserId,
              UHID: user.UHID,
              MemberId: user.MemberId,
              Country: user.Country,
              EnqType: 'INVESTIGATION',
              LocationId: selectedCompany.LocationId,
    
              EnquiryDetailsList: orderList,
              EnqDate: testDate,
              EnqDateStr: testDate,
              Doctor: {},
              
              UnderDoctId: user.UnderDoctId,  // sales
              ReferrerId: user.ReferrerId,   // refBy
              ProviderId: user.ProviderId,   // provider
              MarketedId: user.MarketedId,   // marketing,
              Remarks: remarks,
            }
            console.log('user labtest booking');
            makeBookingRequest(newbookingData);
          } else {
            // if (getConfirmation(`Book Lab Test for ${selectedMember.MemberName} in ${userInfo.selectedCompany.COMPNAME}`) === false) return;
            const newbookingData = { 
            //   ...bookingInfo,
              Salutation: selectedMember.Salutation,
              Name: selectedMember.MemberName,
              EncCompanyId: selectedCompany.EncCompanyId,
              PartyCode: selectedMember.CompUserPartyCode,
              MPartyCode: selectedMember.CompUserMPartyCode,
              RegMob1: selectedMember.Mobile,
              Gender: selectedMember.Gender,
              GenderDesc: selectedMember.GenderDesc,
              Address: selectedMember.Address,
              Age: selectedMember.Age,
              AgeMonth: selectedMember.AgeMonth,
              AgeDay: selectedMember.AgeDay,
              State: selectedMember.State,
              City: selectedMember.City,
              Pin: selectedMember.Pin,
              Address2: selectedMember.Landmark,
              AnniversaryDate: selectedMember.AnniversaryDate,
              Aadhaar: selectedMember.Aadhaar,
              UserId: user.UserId,
              UHID: selectedMember.UHID,
              MemberId: selectedMember.MemberId,
              Country: selectedMember.Country,
              EnqType: 'INVESTIGATION',
              LocationId: selectedCompany.LocationId,
    
              EnquiryDetailsList: orderList,
              EnqDate: testDate,
              EnqDateStr: testDate,
              Doctor: {},
              
              UnderDoctId: selectedMember.UnderDoctId,                // sales
              ReferrerId: selectedMember.ReferrerId,   // refBy
              ProviderId: selectedMember.ProviderId,   // provider
              MarketedId: selectedMember.MarketedId,   // marketing,
              Remarks: remarks,
            }
            console.log('member labtest booking');
            makeBookingRequest(newbookingData);
          }
        //   setTimeout(() => { history.push(`/dashboard?tab=lab&day=${appDate}`) }, 2000);
        } else {
        //   userInfoAction(bookingData);
        //   modalAction('LOGIN_MODAL', true, {mode: 'PATIENT'});
            router.push('/login');
        }
    }     
    
    const makeBookingRequest = async (params: any) => {
        // return console.log(params);      
        if (!params.UserId) return alert('Something went wrong, try again later. No user Id received: F');
        try {
            setLoading(true);
            await wait(2000);
            const res = await axios.post(`${BASE_URL}/api/Appointment/Post`, params);   // { status: 200 }
            setLoading(false);
            if (res.status === 200) {       
                // dispatch(dumpCart());
                handleBack();
                handleSuccess(res.data);
            } else {
                alert('Something went wrong, try again later.');
            }
        } catch (error) {
            setLoading(false);
            alert('Something went wrong, try again later.');
            console.log(error);            
        }
       
    } 

    return (
        <View className='bg-slate-100 flex-1'>
            <Pressable onPress={handleBack} className='justify-between flex-row p-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Review & Book</Text>
                </View>
                <View className="gap-3 flex-row items-center ml-auto">
                    <Feather name="heart" size={20} color='black' />
                    <Feather name="share-2" size={20} color='black' />
                </View>
            </Pressable> 
            <ScrollView>
                <View className='px-4 pb-4'>
                    <View className='bg-white mb-4 rounded-2xl shadow-sm shadow-gray-400'>
                        <View className='justify-between flex-row p-4 items-center border-b border-gray-200'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-5">Lab Tests</Text>
                            </View>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-5">{itemsLength} Items</Text>
                        </View>

                        <View className='flex-row gap-3 p-4'>
                            <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Booking Date</Text>
                            <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} />
                            <Text className="font-PoppinsSemibold text-slate-500 text-[13px]">{new Date().toLocaleDateString('en-TT')}</Text>
                        </View>
                    </View> 
                    
                    <View className='justify-between flex-row pt-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-5">Patient Details</Text>
                        </View>
                    </View>
                    <View className='bg-white rounded-3xl p-4 my-4 shadow-sm shadow-gray-400'>
                        <View className='flex-row items-center'>
                            <Image className='shadow-lg rounded-full me-4' source={require('@/assets/images/user.png')} style={{ width: 40, height: 40 }} />
                            <View>
                            <Text className="font-PoppinsSemibold text-[14px]">{selectedMember.MemberName}</Text>
                            <Text className="font-Poppins text-gray-500 text-[12px]">{selectedMember.RelationShipWithHolder}</Text>
                            </View>
                            {/* <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" /> */}
                            <Pressable onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} className="ms-auto">
                            <FontAwesome name="refresh" size={22} color="#2563eb"/>
                            </Pressable>
                        </View>
                        <View className='p-3 bg-gray-100 mt-3 rounded-xl flex gap-2 flex-row'>
                            <MaterialIcons name="av-timer" size={15} color="#000" />
                            <Text className="font-Poppins text-gray-500 text-[12px] me-auto leading-4">{selectedMember.Age} Years</Text>
                            <Ionicons name="male-female" size={15} color="#000" />
                            <Text className="font-Poppins text-gray-500 text-[12px] leading-4">{selectedMember.GenderDesc}</Text>
                        </View>
                        <View className="flex-row py-2.5 gap-2">
                            <Text className="text-primary-500 font-Poppins leading-5 text-[12px]">Address : </Text>
                            <Text className="text-[12px] text-gray-500 flex-1 leading-5">{selectedMember.Address}</Text>
                        </View>

                        <View className="gap-3 flex-row mt-1">
                        {/* {prescription.file.name ? null : <ButtonPrimary title='Add Prescription' onPress={() => dispatch(setModal({name: 'PRESC', state: true}))} classes='!h-[38px] bg-orange-50 border-dashed border border-orange-300 flex-1' textClasses='text-[12px]' />} */}
                        <ButtonPrimary title='Change Patient' onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} classes='!h-[38px] bg-sky-50 border-dashed border border-blue-300 flex-1' textClasses='text-[12px]' />
                        </View>
                    </View>
                    <View className='bg-white rounded-3xl shadow-sm shadow-gray-400 mb-4'>
                        <View className='justify-between flex-row pt-4 px-4 items-center'>
                            <View className='flex-row items-center gap-3'>
                                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Appointment Remarks</Text>
                            </View>
                            <View className="gap-3 flex-row items-center ml-auto">
                                {/* <Feather name="chevron-down" size={24} color='#6b7280' /> */}
                                <FontAwesome name="pencil" size={18} color="#6b7280" />
                            </View>
                        </View>                        
                        <View className='flex-row gap-3 p-4'>
                            <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pl-4'>
                                <MaterialCommunityIcons name="clipboard-text-multiple-outline" size={24} color={colors.blue[500]} className="pr-4" />
                                <TextInput value={remarks} placeholderTextColor={colors.gray[400]} onChangeText={(text) => setRemarks(text)} placeholder='Remarks' multiline numberOfLines={4} textAlignVertical="top" className='text-gray-700 py-4 items-start px-5 flex-1 border-l border-gray-300 h-24' />
                            </View>
                        </View>
                    </View>
                    <View className='justify-between flex-row pt-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-5">Clinic Details</Text>
                        </View>
                    </View>
                    <View className='bg-primary-500 mt-4 rounded-2xl shadow-sm shadow-primary-700 overflow-hidden'>
                        <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                            <View className='flex-1'>
                                <Text className="font-PoppinsSemibold text-[14px] text-white">{selectedCompany.COMPNAME}</Text>
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
                            <Link onPress={() => handleClose(false)} href={`/appn/clinic/${selectedCompany.CompanyId}`} className='px-[9px] py-[9px] bg-primary-400 rounded-full'>
                                <Feather name="chevron-right" size={24} color="#fff" className=''  />
                            </Link>
                        </View>
                    </View> 
                </View>
                <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mx-4 mt-1 mb-3">Order Summary</Text>
                <View className='bg-white shadow-sm shadow-gray-400'>
                    {labTests.map((i: any) => (
                        <View key={i.LocationItemId} className='flex-row gap-2 w-full px-5 py-4 border-b border-gray-200 items-center'>
                            <Text className="font-PoppinsMedium text-gray-500 text-[13px] mr-auto leading-6 flex-1 pr-4">{i.Description}  X  {i.count}</Text>
                            <FontAwesome name="rupee" size={13} color="#2563eb" />
                            <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-5">{num(i.SRate * i.count)}</Text>
                        </View>
                    ))}
                    <View className='flex-row gap-2 w-full p-5 items-center'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[14px] mr-auto leading-3">Order Total</Text>
                        <FontAwesome name="rupee" size={13} color="#2563eb" />
                        <Text className="font-PoppinsSemibold text-slate-800 text-[14px] leading-5">{cartTotal}</Text>
                    </View>
                </View>
            </ScrollView>
            <ButtonPrimary title='Confirm Booking' isLoading={loading} active={true} onPress={handleBookingFormSubmit} classes='m-4' />
        </View>
    )
}


export default Checkout;

