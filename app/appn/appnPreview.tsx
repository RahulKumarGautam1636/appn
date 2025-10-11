import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ButtonPrimary, { mmDDyyyyDate } from "../../src/components";
import { setModal } from "@/src/store/slices/slices";
import { useDispatch, useSelector } from "react-redux";
import { myColors } from '@/src/constants';
import { Link } from "expo-router";
import { formatted, GradientBG } from "@/src/components/utils";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import colors from "tailwindcss/colors";
import { RootState } from "@/src/store/store";

const AppnPreview = ({ handleClose, handleConfirmation, doctor={}, bookingData={}, clinic={}, member={}, remarks, setRemarks, loading }: any) => {
  
  const dispatch = useDispatch();
  const [day, month, year] = bookingData.AppointDate.split('/').map(Number);
  let parsedActiveDate = new Date(year, month - 1, day);
  let formattedDate = new Date(parsedActiveDate).toDateString();
  const prescription = useSelector((i: RootState) => i.appData.prescription);
  
  return (
      <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
          <GradientBG>
              <View className='flex-1'>
              <View className='justify-between flex-row p-3 items-center'>
                  <TouchableOpacity onPress={() => handleClose(false)}>
                      <View className='flex-row items-center gap-2'>
                          <Ionicons name="arrow-back-outline" size={22} color="black" />
                          <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-4">Review & Confirm</Text>
                      </View>
                  </TouchableOpacity>
                  <View className="gap-2 flex-row items-center ml-auto">
                      <Feather name="heart" size={18} color='black' />
                      <Feather name="share-2" size={18} color='black' />
                  </View>
              </View>
              {/* <View className="p-4 items-center">
                  <Image className='shadow-lg rounded-full' source={require('../../assets/images/doctor.jpg')} style={{ width: 100, height: 100 }} />
                  <Text className="font-PoppinsSemibold text-gray-800 text-[18px] pt-5">{doctor.Name}</Text>
                  <Text className="font-Poppins text-gray-600 text-[13px]">{doctor.SpecialistDesc}</Text>
              </View> */}
              <View className='flex-row gap-3 px-3 pt-3 pb-4 mx-3 mb-3 rounded-3xl bg-white shadow-sm shadow-gray-400'>
                  <Image className='' source={require('./../../assets/images/doctor.jpg')} style={{ width: 70, height: 70 }} />
                  <View className="flex-1">
                      <Text className="font-PoppinsSemibold text-sky-800 text-[13px] mb-1.5" numberOfLines={1}>{doctor.Name}</Text>
                      <View className='flex-row gap-2'>
                          <FontAwesome name="graduation-cap" size={13} color="#075985" />
                          <Text className="font-PoppinsMedium text-gray-600 text-[11px] mb-[5px]">{doctor.SpecialistDesc}</Text>
                      </View>
                      <View className='flex-row gap-2 mt-1'>
                          <FontAwesome5 name="stethoscope" size={13} color="#075985" />
                          <Text className="font-PoppinsMedium text-gray-800 text-[11px]">{doctor.Qualification}</Text>
                      </View>
                  </View>
              </View>
              <View className='justify-between flex-row px-3 py-2 items-center'>
                  <View className='flex-row items-center gap-2'>
                      <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-4">Patient Details</Text>
                  </View>
              </View>
              <View className='bg-white rounded-3xl p-4 m-3 shadow-sm shadow-gray-400'>
                  <View className='flex-row items-center'>
                      <Image className='shadow-lg rounded-full me-4' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                      <View>
                      <Text className="font-PoppinsSemibold text-[14px]">{member.MemberName}</Text>
                      <Text className="font-Poppins text-gray-500 text-[12px]">{member.RelationShipWithHolder}</Text>
                      </View>
                      {/* <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" /> */}
                      <Pressable onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} className="ms-auto">
                      <FontAwesome name="refresh" size={22} color="#2563eb"/>
                      </Pressable>
                  </View>
                  <View className='p-3 bg-gray-100 mt-3 rounded-xl flex gap-2 flex-row'>
                      <MaterialIcons name="av-timer" size={15} color="#000" />
                      <Text className="font-Poppins text-gray-500 text-[12px] me-auto leading-4">{member.Age} Years</Text>
                      <Ionicons name="male-female" size={15} color="#000" />
                      <Text className="font-Poppins text-gray-500 text-[12px] leading-4">{member.GenderDesc}</Text>
                  </View>
                  <View className="flex-row py-2.5 gap-2">
                    <Text className="text-primary-500 font-Poppins leading-5 text-[12px]">Address : </Text>
                    <Text className="text-[12px] text-gray-500 flex-1 leading-5">{member.Address}</Text>
                  </View>

                  <View className="gap-3 flex-row mt-1">
                  {prescription.file.name ? null : <ButtonPrimary title='Add Prescription' onPress={() => dispatch(setModal({name: 'PRESC', state: true}))} classes='!h-[38px] bg-orange-50 border-dashed border border-orange-300 flex-1' textClasses='text-[12px]' />}
                  <ButtonPrimary title='Change Patient' onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} classes='!h-[38px] bg-sky-50 border-dashed border border-blue-300 flex-1' textClasses='text-[12px]' />
                  </View>
              </View>
              {prescription.file.name ? 
              <View className="mx-3 mb-3 mt-1">
                  <View className='justify-between flex-row items-center mb-3'>
                      <View className='flex-row items-center gap-2'>
                          <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-4">Your Prescription</Text>
                      </View>
                  </View>
                  <TouchableOpacity onPress={() => dispatch(setModal({name: 'PRESC', state: true}))} className="bg-white rounded-2xl border-b border-gray-200 p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 gap-3">
                      {prescription.file.fileType === 'image' ? <Image source={{ uri: prescription.file.uri }} className="w-12 h-12 rounded-xl border border-gray-100" resizeMode="cover" /> : null}
                      <View className="flex-1">
                      <Text className="font-semibold text-indigo-500 mb-1.5 text-[13px]">{prescription.file.name}</Text>
                      <Text className="text-[12px] text-gray-500">{prescription.file.fileType}</Text>
                      </View>
                  </View>
                  <TouchableOpacity>
                      <Feather name="chevron-right" size={21} color="gray" />
                  </TouchableOpacity>
                  </TouchableOpacity>
              </View> : null}
              <View className='justify-between flex-row px-3 py-2 items-center'>
                  <View className='flex-row items-center gap-2'>
                      <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-4">Time & Date</Text>
                  </View>
              </View>
              <View className='bg-white m-3 rounded-3xl shadow-sm shadow-gray-400'>
                  

                  <View className='flex-row gap-2 pb-3 pt-4 px-4 border-b border-gray-200 items-center'>
                      <FontAwesome5 name="clock" size={15} color={colors.fuchsia[500]} />
                      <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto tracking-wider leading-6">{bookingData.AppTime}</Text>
                      <FontAwesome5 name="calendar-alt" size={15} color={colors.orange[500]} />
                      <Text className="font-PoppinsSemibold text-slate-500 text-[13px] tracking-wider leading-6">{formattedDate}</Text>
                  </View>
                  
                  <View className='flex-row gap-2 p-3.5'>
                      <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pl-3'>
                          <MaterialCommunityIcons name="clipboard-text-multiple-outline" size={22} color={colors.blue[500]} className="pr-3" />
                          <TextInput value={remarks} placeholderTextColor={colors.gray[400]} onChangeText={(text) => setRemarks(text)} placeholder='Appointment Remarks' multiline numberOfLines={4} textAlignVertical="top" className='text-gray-700 text-[13px] py-3 items-start px-4 flex-1 border-l border-gray-50 h-20' />
                      </View>
                  </View>
              </View>
              <View className='justify-between flex-row px-3 py-2 items-center'>
                  <View className='flex-row items-center gap-2'>
                      <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-4">Clinic Details</Text>
                  </View>
              </View>
              {/* <View className='bg-white mx-4 rounded-3xl shadow-sm shadow-gray-400'>
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
              <View className='bg-primary-500 m-3 rounded-3xl overflow-hidden'>
                  <View className='flex-row items-center gap-3 pl-4 pr-3 pb-4 pt-3 bg-primary-500 '>
                      <View className='flex-1'>
                          <Text className="font-PoppinsSemibold text-[13px] text-white">{clinic.COMPNAME}</Text>
                          <View className='mt-1.5 '>
                              <View className='flex gap-2 flex-row items-center'>
                                  <FontAwesome5 name="clock" size={12} color="#fff" />
                                  <Text className="font-PoppinsMedium text-gray-100 text-[10px] leading-4">08:30 AM - 12:00 PM</Text>
                              </View>
                              <View className='flex gap-2 flex-row items-center mt-1.5'>
                                  <FontAwesome5 name="map-marker-alt" size={12} color="#fff" />
                                  <Text className="font-Poppins text-gray-100 text-[10px] leading-4" numberOfLines={1}>{clinic.ADDRESS}</Text>
                              </View>
                          </View>
                      </View>
                      <Link href={`/appn/clinic/${clinic.CompanyId}`}>
                          <View>
                              <Feather name="chevron-right" size={22} color="#fff" className='px-[8px] py-[8px] bg-primary-400 rounded-full'  />
                          </View>
                      </Link>
                  </View>
              </View>
              <View className='justify-between flex-row px-3 py-2 items-center'>
                  <View className='flex-row items-center gap-2'>
                      <Text className="font-PoppinsSemibold text-gray-800 text-[14px] items-center leading-4">Payment Details</Text>
                  </View>
              </View>
              <View className='bg-white m-3 rounded-3xl shadow-sm shadow-gray-400'>
                  <View className='justify-between flex-row p-4 items-center border-b border-gray-200'>
                  <View className='flex-row items-center gap-2'>
                      <Text className="font-PoppinsSemibold text-gray-800 text-[13px] items-center leading-4">Bill Details</Text>
                  </View>
                  </View>

                  <View className='gap-2 px-4 py-3'>
                  <View className="flex-row justify-between">
                      <Text className="font-PoppinsMedium text-gray-600 text-[12px]">Consultation Fees</Text>
                      <Text className="font-PoppinsSemibold text-slate-700 text-[12px]">₹ 200</Text>
                  </View>
                  <View className="flex-row justify-between">
                      <Text className="font-PoppinsMedium text-gray-600 text-[12px]">Platform Fees</Text>
                      <Text className="font-PoppinsSemibold text-slate-700 text-[12px]">₹ 10</Text>
                  </View>
                  <View className="flex-row justify-between">
                      <Text className="font-PoppinsMedium text-gray-600 text-[12px]">Promo Applied</Text>
                      <Text className="font-PoppinsSemibold text-slate-700 text-[12px]">N/A</Text>
                  </View>
                  </View>
                  <View className='justify-between flex-row p-4 items-center border-t border-gray-200'>
                      <Text className="font-PoppinsSemibold text-gray-700 text-[13px] leading-4">Total Payable</Text>
                      <Text className="font-PoppinsSemibold text-gray-700 text-[13px] leading-4">₹ 210</Text>
                  </View>
              </View>
              <ButtonPrimary title='Confirm Booking' isLoading={loading} active={true} onPress={handleConfirmation} classes='mx-3 mb-4 mt-1' />
              </View>
          </GradientBG>
      </ScrollView>
  )
}

export default AppnPreview;