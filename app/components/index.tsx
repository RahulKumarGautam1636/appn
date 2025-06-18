import { SRC_URL } from "@/constants"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { Image, Text, TouchableOpacity, View } from "react-native"
import Heart from '../../assets/icons/departments/heart.svg';
import { Link } from "expo-router";
import { useDispatch } from "react-redux";
import { setAppnData } from "../store/slices/slices";

export default function ButtonPrimary({ title, onPress, active, classes, textClasses, onClick }: any) {
  return (
    <TouchableOpacity onPressOut={onClick} className={`p-4 items-center rounded-full shadow-sm shadow-gray-700 ${classes} ${active ? 'bg-pink-500' : 'bg-gray-300'}`} onPress={onPress}>
      <Text className={`font-PoppinsSemibold ${textClasses} ${active ? 'text-white' : 'text-slate-500'}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export const CompCard = ({ data, active }: any) => {
  return (
    <View className={`flex-row gap-4 p-[13px] rounded-xl shadow-lg ${active ? 'border border-pink-500 bg-pink-50' : 'bg-white'}`}>
        {/* <Image className='shadow-lg rounded-xl' source={require('../../assets/images/doctor.jpg')} style={{ width: 65, height: 65 }} /> */}
        <Image className='shadow-lg rounded-xl' src={`${SRC_URL}/Content/CompanyLogo/${data.LogoUrl}`} style={{ width: 65, height: 65 }} />
        <View>
            <Text className="font-PoppinsSemibold text-sky-800 text-[13px]">{data.COMPNAME}</Text>
            <View className='mt-1 flex gap-2 flex-row items-center'>
                <FontAwesome5 name="clock" size={12} color="gray" />
                <Text className="text-gray-500 font-PoppinsMedium text-[11px] leading-5">08:00 AM &nbsp;-&nbsp; 9:30 AM</Text>
            </View>
            <View className='mt-1 flex gap-2 flex-row items-center'>
                <FontAwesome5 name="map-marker-alt" size={12} color="gray" />
                <Text className="text-gray-500 font-PoppinsMedium text-[11px] leading-5">{data.ADDRESS}</Text>
            </View>
        </View>
    </View>
  )
}

export const DeptCard = ({ data }: any) => {
  return (
    <View className='items-center shadow-lg'>
        <View className='p-4 bg-white rounded-full mb-2 shadow-lg'>
            <Heart width={24} height={24} />
        </View>
        {data.Description.length > 8 ?
          <Text className='text-[12px]'>{(data.Description).slice(0, 9)}..</Text> :
          <Text className='text-[12px]'>{data.Description}</Text> 
        }
    </View>
  )
}

export const Card_1 = ({ data, selectedDate }: any) => {

  const dispatch = useDispatch();

  const handleBooking = () => {
    let doctor = {
      appnData: { 
        // UnderDoctId: data.PartyCode, 
        selectedAppnDate: selectedDate ? selectedDate : '', 
        // AppTime: '', TimeSlotId: '', companyId: activeCompanyId, AppointDate: selectedDate 
      },
      doctor: data
    }
    dispatch(setAppnData(doctor))
  }

  return (
    <Link href={`/appn/doctor/${data.PartyCode}`} onPress={handleBooking}>
      <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg w-full'>
          <Image className='shadow-lg rounded-xl' source={require('../../assets/images/doctor.jpg')} style={{ width: 70, height: 70 }} />
          <View className='flex-1'>
              <Text className="font-PoppinsSemibold text-gray-800 text-[14px]">{data.Name}</Text>
              <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[8px]" numberOfLines={1}>{data.SpecialistDesc}</Text>
              <Text className="font-PoppinsMedium text-gray-800 text-[11px]">⭐ 4.9 
                  &nbsp;<Text className='text-gray-500'>(2435 Reviews)</Text>
              </Text>
          </View>
          <View className='justify-between items-end'>
              <Ionicons name="arrow-forward-outline" size={20} color="#64748b" className='text-slate-500'/>
              <Text className="font-PoppinsSemibold text-pink-600 text-[12px]">₹600/hr</Text>
          </View>
      </View>
    </Link>
  )
}

export const DayBtn = ({ data, activeDate, handleActive }: any) => {
  let day = data.dateStr.split(' ')[0]
  let date = data.dateStr.split(' ')[2];
  let active = data.date === activeDate;
  return (
      <TouchableOpacity onPress={() => handleActive((pre: any) => ({...pre, activeDate: data.date}))} className='gap-3 flex-1 text-center items-center'>
          <Text className={`font-PoppinsMedium pt-4 text-[12px] ${active ? 'text-gray-600' : 'text-gray-400'}`}>{day}</Text>
          <View className={`items-center justify-center h-11 w-12 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-pink-500' : 'bg-white'}`}>
              <Text className={`font-PoppinsMedium text-gray-600 text-[13px] leading-5 ${active ? 'text-white' : ''}`}>{date}</Text>
          </View>
      </TouchableOpacity>
  )
} 

export const getDatesArray = function(start: Date, end: number) {
  const endDate = new Date(new Date().setDate(start.getDate() + end));
  for(var arr=[],dt=new Date(start); dt<=new Date(endDate); dt.setDate(dt.getDate()+1)){
      arr.push({dateStr: new Date(dt).toDateString(), date: new Date(dt).toLocaleDateString('en-TT')});
  }
  return arr;
};