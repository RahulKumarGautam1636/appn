import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ButtonPrimary from "../../src/components";
import { setModal } from "@/src/store/slices/slices";
import { useDispatch } from "react-redux";
import { myColors } from '@/constants';

const AppnPreview = ({ handleClose, handleConfirmation, doctor={}, bookingData={}, clinic={}, member={}, bookAppn }: any) => {
  
  const dispatch = useDispatch();
  
  return (
    <ScrollView contentContainerClassName='bg-slate-100 min-h-full' 
    // keyboardShouldPersistTaps="handled"
    >
      <View className='flex-1'>
        <View className='justify-between flex-row p-4 items-center'>
              {/* <Link href={'/appn/bookingSuccess'}> */}
              <TouchableOpacity onPress={() => handleClose(false)}>
                <View className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Review & Pay</Text>
                </View>
              </TouchableOpacity>
              {/* </Link> */}
              <View className="gap-3 flex-row items-center ml-auto">
                  <Feather name="heart" size={20} color='black' />
                  <Feather name="share-2" size={20} color='black' />
              </View>
        </View>
        <View className="p-4 items-center">
          <Image className='shadow-lg rounded-full' source={require('../../assets/images/doctor.jpg')} style={{ width: 100, height: 100 }} />
          <Text className="font-PoppinsSemibold text-gray-800 text-[18px] pt-5">{doctor.Name}</Text>
          <Text className="font-Poppins text-gray-600 text-[13px]">{doctor.SpecialistDesc}</Text>
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
            <Text className="text-primary-500 font-Poppins leading-6">Note: </Text>
            You can submit patient details, old prescription, and test reports in the drop link.
          </Text>
           <ButtonPrimary title='Change Patient' onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} classes='!h-[46px] bg-sky-50 border-dashed border border-blue-500 mt-1' textClasses='text-sm' />
        </View>
        <View className='justify-between flex-row px-4 pt-1 items-center'>
            <View className='flex-row items-center gap-3'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment</Text>
            </View>
        </View>
        <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Time & Date</Text>
                </View>
                <View className="gap-3 flex-row items-center ml-auto">
                    {/* <Feather name="chevron-down" size={24} color='#6b7280' /> */}
                    <FontAwesome name="pencil" size={18} color="#6b7280" />
                </View>
            </View>

            <View className='flex-row gap-3 p-4'>
              <FontAwesome5 name="clock" size={17} color={myColors.primary[500]} />
              <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">{bookingData.AppTime}</Text>
              <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} />
              <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">{bookingData.AppointDate}</Text>
            </View>
        </View>
        <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
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
        </View>
        <View className='justify-between flex-row px-4 pt-4 items-center'>
            <View className='flex-row items-center gap-3'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Payment</Text>
            </View>
        </View>
        <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
          <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
            <View className='flex-row items-center gap-3'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Bill Details</Text>
            </View>
          </View>

          <View className='gap-2 p-4'>
            <View className="flex-row justify-between">
              <Text className="font-PoppinsSemibold text-gray-500 text-[13px]">Consultation Fees</Text>
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 200</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-PoppinsSemibold text-gray-500 text-[13px]">Platform Fees</Text>
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 10</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-PoppinsSemibold text-gray-500 text-[13px]">Promo Applied</Text>
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">N/A</Text>
            </View>
          </View>
          <View className='justify-between flex-row p-4 items-center border-t border-gray-300'>
              <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">Total Payable</Text>
              <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">₹ 210</Text>
          </View>
        </View>
        <ButtonPrimary title='Confirm Booking' active={true} onPress={handleConfirmation} classes='mx-4 mb-4' />
      </View>
    </ScrollView>
  )
}

export default AppnPreview;