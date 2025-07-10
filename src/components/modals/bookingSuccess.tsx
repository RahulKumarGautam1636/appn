import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";
import Heart from '../../../assets/icons/success.svg';
import ButtonPrimary from "..";
import { useRouter } from "expo-router";
import { myColors } from "@/constants";

const BookingSuccess = ({ doctor, bookingData, clinic }: any) => {
  const router = useRouter()
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
        {/* <View className='justify-between flex-row px-4 pt-1 items-center'>
            <View className='flex-row items-center gap-3'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Patient Details</Text>
            </View>
        </View> */}
        <View className='bg-white rounded-3xl p-5 m-4 shadow-md shadow-gray-400'>
          <View className='flex-row items-center'>
              <Image className='shadow-md rounded-lg me-3' source={require('../../../assets/images/doctor.jpg')} style={{ width: 40, height: 40 }} />
              <View>
                  <Text className="font-PoppinsBold text-[14px]">{doctor.Name}</Text>
                  <Text className="font-Poppins text-gray-500 text-[11px]">{doctor.SpecialistDesc}</Text>
              </View>
              <FontAwesome name="check" size={20} color='#16a34a' className="ms-auto" />
          </View>
          <View className="p-4 bg-gray-100 my-4 rounded-xl gap-6">
            <View className='flex gap-3 flex-row'>
                <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} />
                <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">{bookingData.AppointDate}</Text>
            </View>
            <View className='flex gap-3 flex-row'>
                <FontAwesome5 name="clock" size={17} color={myColors.primary[500]} />
                <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">{bookingData.AppTime}</Text>
            </View>
          </View>
          <View className='flex-row items-center mb-4 gap-4'>
              {/* <View className="bg-primary-500 py-[11px] px-[10px] rounded-full shadow-lg"> */}
                {/* <FontAwesome6 name="hospital-wide" size={35} color='#ec4899' /> */}
                <FontAwesome5 name="hospital" size={35} color={myColors.primary[500]} />
              {/* </View> */}
              <View className="flex-1">
                  <Text className="font-PoppinsSemibold text-[14px]">{clinic.COMPNAME}</Text>
                  <Text className="font-Poppins text-gray-500 text-[11px]" numberOfLines={1}>{clinic.ADDRESS}</Text>
              </View>
          </View>
          <ButtonPrimary title='View Appointments' onPress={() => router.push('/appn/appnList')} classes='!h-[46px] bg-white border border-gray-400 mt-2' textClasses='text-[14px]' />
        </View>
        {/* <View className='justify-between flex-row px-4 pt-1 items-center'>
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
                    <FontAwesome name="pencil" size={18} color="#6b7280" />
                </View>
            </View>

            <View className='flex-row gap-3 p-4'>
              <FontAwesome5 name="clock" size={17} color="#000" />
              <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-8">08:30 AM</Text>
              <FontAwesome5 name="calendar-alt" size={17} color="#000" />
              <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">17 Feb, 2024</Text>
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
              <Text className="font-PoppinsMedium text-[14px]">Southern California Hospital</Text>
              <Text className="font-PoppinsSemibold text-slate-500 text-[11px] my-1">08:30 AM - 12:00 PM</Text>
              <Text className="font-Poppins text-gray-500 text-[11px]" numberOfLines={1}>Ramnagar Kalitala Road, Ranaghat, Nadia</Text>
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
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">$ 200</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-PoppinsSemibold text-gray-500 text-[13px]">Booking Fees</Text>
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">$ 200</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-PoppinsSemibold text-gray-500 text-[13px]">Promo Applied</Text>
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">$ 200</Text>
            </View>
          </View>
          <View className='justify-between flex-row p-4 items-center border-t border-gray-300'>
              <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">Total Payable</Text>
              <Text className="font-PoppinsSemibold text-gray-700 text-[14px] leading-5">$ 210</Text>
          </View>
        </View>
        <ButtonPrimary title='Confirm Booking' active={true} onPress={() => {}} classes='mx-4 mb-4' /> */}
      </View>
    </ScrollView>
  )
}

export default BookingSuccess;