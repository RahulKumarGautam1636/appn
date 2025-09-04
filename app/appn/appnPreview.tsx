import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ButtonPrimary, { mmDDyyyyDate } from "../../src/components";
import { setModal } from "@/src/store/slices/slices";
import { useDispatch } from "react-redux";
import { myColors } from '@/constants';
import { Link } from "expo-router";
import { formatted, GradientBG } from "@/src/components/utils";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import colors from "tailwindcss/colors";

const AppnPreview = ({ handleClose, handleConfirmation, doctor={}, bookingData={}, clinic={}, member={}, bookAppn }: any) => {
  
  const dispatch = useDispatch();
  const [day, month, year] = bookingData.AppointDate.split('/').map(Number);
  let parsedActiveDate = new Date(year, month - 1, day);
  let formattedDate = new Date(parsedActiveDate).toDateString();

  const [remarks, setRemarks] = useState('');
  
  return (
    <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
      <GradientBG>
        <View className='flex-1'>
          <View className='justify-between flex-row p-4 items-center'>
              <TouchableOpacity onPress={() => handleClose(false)}>
                <View className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Review & Confirm</Text>
                </View>
              </TouchableOpacity>
              <View className="gap-3 flex-row items-center ml-auto">
                  <Feather name="heart" size={20} color='black' />
                  <Feather name="share-2" size={20} color='black' />
              </View>
          </View>
          {/* <View className="p-4 items-center">
            <Image className='shadow-lg rounded-full' source={require('../../assets/images/doctor.jpg')} style={{ width: 100, height: 100 }} />
            <Text className="font-PoppinsSemibold text-gray-800 text-[18px] pt-5">{doctor.Name}</Text>
            <Text className="font-Poppins text-gray-600 text-[13px]">{doctor.SpecialistDesc}</Text>
          </View> */}
          <View className='flex-row gap-4 px-4 pt-4 pb-5 mx-4 mb-4 rounded-3xl bg-white shadow-md shadow-gray-400'>
              <Image className='' source={require('./../../assets/images/doctor.jpg')} style={{ width: 80, height: 80 }} />
              <View>
                  <Text className="font-PoppinsSemibold text-sky-800 text-[15px] mb-2">{doctor.Name}</Text>
                  <View className='flex-row gap-2'>
                      <FontAwesome name="graduation-cap" size={15} color="#075985" />
                      <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{doctor.SpecialistDesc}</Text>
                  </View>
                  <View className='flex-row gap-2 mt-1'>
                      <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                      <Text className="font-PoppinsMedium text-gray-800 text-[12px]">{doctor.Qualification}</Text>
                  </View>
              </View>
          </View>
          <View className='justify-between flex-row px-4 pt-1 items-center'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Patient Details</Text>
              </View>
          </View>
          <View className='bg-white rounded-3xl p-5 m-4 shadow-md shadow-gray-400'>
            <View className='flex-row items-center'>
                <Image className='shadow-lg rounded-full me-3' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                <View>
                  <Text className="font-PoppinsBold text-[14px]">{member.MemberName}</Text>
                  <Text className="font-Poppins text-gray-500 text-[11px]">{member.RelationShipWithHolder}</Text>
                </View>
                {/* <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" /> */}
                <Pressable onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} className="ms-auto">
                  <FontAwesome name="refresh" size={24} color="#2563eb"/>
                </Pressable>
            </View>
            <View className='py-3 px-4 bg-gray-100 mt-4 rounded-xl flex gap-3 flex-row'>
                <MaterialIcons name="av-timer" size={17} color="#000" />
                <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">{member.Age} Years</Text>
                <Ionicons name="male-female" size={17} color="#000" />
                <Text className="font-Poppins text-gray-500 text-[13px] leading-5">{member.GenderDesc}</Text>
            </View>
            <Text className="text-sm py-3 text-gray-500">
              <Text className="text-primary-500 font-Poppins leading-6">Address : </Text>
              {member.Address}
            </Text>
            <ButtonPrimary title='Change Patient' onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} classes='!h-[43px] bg-sky-50 border-dashed border border-blue-500 mt-1' textClasses='text-sm' />
          </View>
          <View className='justify-between flex-row px-4 pt-1 items-center'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment</Text>
              </View>
          </View>
          <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
              <View className='justify-between flex-row p-4 items-center'>
                  <View className='flex-row items-center gap-3'>
                      <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Time & Date</Text>
                  </View>
                  <View className="gap-3 flex-row items-center ml-auto">
                      {/* <Feather name="chevron-down" size={24} color='#6b7280' /> */}
                      <FontAwesome name="pencil" size={18} color="#6b7280" />
                  </View>
              </View>

              <View className='flex-row gap-3 p-4 border-y border-gray-300'>
                <FontAwesome5 name="clock" size={17} color={colors.fuchsia[500]} />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto tracking-wider">{bookingData.AppTime}</Text>
                <FontAwesome5 name="calendar-alt" size={17} color={colors.orange[500]} />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px] tracking-wider">{formattedDate}</Text>
              </View>
              
              <View className='flex-row gap-3 p-4'>
                  <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pl-4'>
                    <MaterialCommunityIcons name="clipboard-text-multiple-outline" size={24} color={colors.blue[500]} className="pr-4" />
                    <TextInput value={remarks} placeholderTextColor={colors.gray[400]} onChangeText={(text) => setRemarks(text)} placeholder='Appointment Remarks' multiline numberOfLines={4} textAlignVertical="top" className='text-gray-700 py-4 items-start px-5 flex-1 border-l border-gray-300 h-24' />
                  </View>
              </View>
          </View>
          <View className='justify-between flex-row px-4 pt-1 items-center'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Clinic Details</Text>
              </View>
          </View>
          {/* <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Clinic Details</Text>
              </View>
            </View>
            <View className='flex-row items-center gap-4 pl-5 pr-4 pt-3 pb-4'>
              <View className='flex-1'>
                <Text className="font-PoppinsMedium text-[14px]">{clinic.COMPNAME}</Text>
                <Text className="font-PoppinsSemibold text-slate-500 text-[11px] my-1">08:30 AM - 12:00 PM</Text>
                <Text className="font-Poppins text-gray-500 text-[11px]" numberOfLines={1}>{clinic.ADDRESS}</Text>
              </View>
              <Feather name="chevron-right" size={24} color="gray" className='ml-auto' />
            </View>
          </View> */}
          <View className='bg-primary-500 m-4 rounded-3xl overflow-hidden'>
              <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                  <View className='flex-1'>
                      <Text className="font-PoppinsSemibold text-[15px] text-white">{clinic.COMPNAME}</Text>
                      <View className='mt-2 '>
                          <View className='flex gap-3 flex-row items-center'>
                              <FontAwesome5 name="clock" size={14} color="#fff" />
                              <Text className="font-PoppinsMedium text-gray-100 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                          </View>
                          <View className='flex gap-3 flex-row items-center mt-2'>
                              <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />
                              <Text className="font-Poppins text-gray-100 text-[11px] leading-5" numberOfLines={1}>{clinic.ADDRESS}</Text>
                          </View>
                      </View>
                  </View>
                  <Link href={`/appn/clinic/${clinic.CompanyId}`}>
                      <View>
                          <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full'  />
                      </View>
                  </Link>
              </View>
          </View>
          <View className='justify-between flex-row px-4 my-1 items-center'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Payment Details</Text>
              </View>
          </View>
          <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-5 items-center border-b border-gray-300'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Bill Details</Text>
              </View>
            </View>

            <View className='gap-2 px-5 py-4'>
              <View className="flex-row justify-between">
                <Text className="font-PoppinsMedium text-gray-600 text-[13px]">Consultation Fees</Text>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 200</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-PoppinsMedium text-gray-600 text-[13px]">Platform Fees</Text>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 10</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-PoppinsMedium text-gray-600 text-[13px]">Promo Applied</Text>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">N/A</Text>
              </View>
            </View>
            <View className='justify-between flex-row p-5 items-center border-t border-gray-300'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">Total Payable</Text>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">₹ 210</Text>
            </View>
          </View>
          <ButtonPrimary title='Confirm Booking' active={true} onPress={handleConfirmation} classes='mx-4 mb-4' />
        </View>
      </GradientBG>
    </ScrollView>
  )
}

export default AppnPreview;