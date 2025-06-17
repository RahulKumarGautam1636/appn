import { Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";
import ButtonPrimary from "../components";
import { Link } from "expo-router";

const AppnPreview = () => {
  return (
    <ScrollView contentContainerClassName='bg-slate-100 min-h-screen'>
      <View className='bg-slate-100 flex-1'>
        <View className='justify-between flex-row p-4 items-center'>
              <Link href={'/appn/bookingSuccess'}>
                <View className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Review & Pay</Text>
                </View>
              </Link>
              <View className="gap-3 flex-row items-center ml-auto">
                  <Feather name="heart" size={20} color='black' />
                  <Feather name="share-2" size={20} color='black' />
              </View>
        </View>
        <View className="p-4 items-center">
          <Image className='shadow-lg rounded-full' source={require('../../assets/images/user.png')} style={{ width: 100, height: 100 }} />
          <Text className="font-PoppinsSemibold text-gray-800 text-[18px] pt-5">Dr. Kevin Leon</Text>
          <Text className="font-Poppins text-gray-600 text-[13px]">Gynacologist</Text>
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
                  <Text className="font-PoppinsBold text-[14px]">Abhinandan Shaw</Text>
                  <Text className="font-Poppins text-gray-500 text-[11px]">Myself</Text>
              </View>
              <FontAwesome name="chevron-down" size={20} color='gray' className="ms-auto" />
          </View>
          <View className='py-3 px-4 bg-gray-100 mt-4 rounded-xl flex gap-3 flex-row'>
              <FontAwesome5 name="calendar-alt" size={17} color="#000" />
              <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">28 Years</Text>
              <FontAwesome5 name="clock" size={17} color="#000" />
              <Text className="font-Poppins text-gray-500 text-[13px] leading-5">Male</Text>
          </View>
          <Text className="text-sm py-3 text-gray-500">
            <Text className="text-pink-500">Note: </Text>
            You can submit patient details, old prescription, and test reports in the drop link.
          </Text>
          <ButtonPrimary title='Click to upload prescription' classes='p-[10px] bg-white border border-gray-400 border-dashed' textClasses='text-sm' />
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
        <ButtonPrimary title='Confirm Booking' active={true} onPress={() => {}} classes='mx-4 mb-4' />
      </View>
    </ScrollView>
  )
}

export default AppnPreview;