import { useEffect } from 'react';
import { blur, hasAccess, SRC_URL } from "@/src/constants"
import { Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { Button, Image, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, BackHandler, Alert, TextInput
// Dimensions, StyleSheet, Pressable, findNodeHandle, UIManager,
} from "react-native";
import { Link, Redirect, router, useRouter } from "expo-router";
import { addToCart, removeFromCart, setAppnData, setCompanies, setDepts, setMembers, setModal, setPrescription } from "@/src/store/slices/slices";
import { stripHtml } from "string-strip-html";
import React, { useState } from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withSequence, withTiming, Easing, interpolate, withDelay } from 'react-native-reanimated';
import { RootState } from "../store/store";
import { num, uType } from "./utils";
import colors from "tailwindcss/colors";
import { popRoute } from "../store/slices/nav";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2 } from 'lucide-react-native';
// import MapView, { Marker } from 'react-native-maps';


export default function ButtonPrimary({ title, onPress, isLoading, active, classes, textClasses, onClick }: any) {

  return (
    <TouchableOpacity onPressOut={onClick} className={`h-[50px] items-center justify-center rounded-full shadow-sm shadow-gray-700 ${classes} ${(active && !isLoading) ? 'bg-primary-500' : 'bg-gray-300'}`} onPress={onPress}>
      {isLoading ? 
      <SvgLoader /> : 
      <Text className={`font-PoppinsSemibold ${textClasses} ${(active && !isLoading) ? 'text-white' : 'text-slate-500'}`}>{title}</Text>
      }
    </TouchableOpacity>
  )
}

export const LinkBtn = ({ title, href, classes, textClasses }: any) => {
  return (
    <Link href={href} className="w-full">
      <View className={`h-[53px] items-center justify-center rounded-full w-full shadow-sm shadow-gray-700 ${classes}`}>
        <Text className={`font-PoppinsSemibold text-white ${textClasses}`}>{title}</Text>
      </View>
    </Link>
  )
}


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleWave = ({ delay = 0, color, cx }: any) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const animation = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.3, 0, 0.7, 1),
        }),
        withTiming(0, {
          duration: 500,
          easing: Easing.bezier(0.3, 0, 0.7, 1),
        })
      ),
      -1
    );

    progress.value = withDelay(delay, animation);
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const scale = interpolate(progress.value, [0, 1], [0, 1]);
    return {
      r: 38 * scale,
    };
  });

  return (
    <G transform={`translate(${cx} 50)`}>
      <AnimatedCircle cx="0" cy="0" r="38" fill={color} 
      animatedProps={animatedProps}
       />
    </G>
  );
};



export const SvgLoader = () => {
  return (
    <View style={{ width: 80, height: 20 }}>
      <Svg width="100%" height="100%" viewBox="0 0 200 100">
        <CircleWave delay={0} color="#abbd81" cx={240} />
        <CircleWave delay={125} color="#f8b26a" cx={145} />
        <CircleWave delay={250} color="#f47e60" cx={50} />
        <CircleWave delay={375} color="#e15b64" cx={-45} />
      </Svg>
    </View>
  );
}



export const CompCard = ({ data, active, details }: any) => {
  const dispatch = useDispatch(); 
  
  const handleSelect = () => {
    if (details) {
      dispatch(setCompanies({selected: data}))
      dispatch(setModal({name: 'COMPANIES', state: false }))
    } else {
      dispatch(setCompanies({selected: data}))
    }
  }
  return (
    <View className={`items-center p-[10px] rounded-xl shadow-lg border-b-2 ${active ? 'border border-primary-500 bg-primary-50' : 'bg-white border-gray-300'}`}>
      <View className="flex-row gap-3">
        <Image className='shadow-md rounded-xl' source={{ uri: `${SRC_URL}/Content/CompanyLogo/${data.LogoUrl}`}} style={{ width: 55, height: 55 }} />
        <TouchableOpacity onPress={handleSelect} className="flex-1 min-w-0">  
            <Text className="font-PoppinsSemibold text-sky-800 text-[12px]" numberOfLines={0} style={{flexShrink: 1, flexWrap: 'wrap'}}>{data.COMPNAME}</Text>
            <View className='mt-1 gap-2 flex-row items-center'>
                <FontAwesome5 name="clock" size={11} color="gray" />
                <Text className="text-slate-600 font-PoppinsSemibold text-[10px] leading-4">08:00 AM &nbsp;-&nbsp; 9:30 AM</Text>
            </View>
            <View className='mt-1 gap-2 flex-row items-center'>
                <FontAwesome5 name="map-marker-alt" size={11} color="gray" />
                <Text className="text-gray-500 font-PoppinsMedium text-[10px] leading-4" numberOfLines={1} style={{flexShrink: 1, flexWrap: 'wrap', flex: 1}}>{data.ADDRESS}</Text>
            </View>
        </TouchableOpacity>
      </View>
      {details &&<View className="flex-row gap-2 mt-4">
        <TouchableOpacity className={`py-1.5 items-center rounded-xl flex-1 border ${active ? 'border-gray-400' : 'border-sky-500'}`} onPress={handleSelect}>
          <Text className={`font-Poppins leading-6 text-[13px] ${active ? 'text-stone-400' : 'text-sky-600'}`}>{active ? 'Selected' : 'Select Clinic'}</Text>
        </TouchableOpacity>
        <View className="py-1.5 bg-primary-500 items-center rounded-xl flex-1">
          <Link href={`/appn/clinic/${data.CompanyId}`} onPress={() => dispatch(setModal({name: 'COMPANIES', state: false }))}>
              <Text className="text-white font-Poppins leading-6 text-[13px]">View Details</Text>
          </Link>
        </View>
      </View>}
    </View>
  )
}

export const DeptCard = ({ data, active }: any) => {
  const dispatch = useDispatch();
  return (
    // <TouchableOpacity onPress={() => dispatch(setDepts({selected: data}))} className='items-center'>
    //     <View className={`p-4 rounded-full mb-2 shadow-lg shadow-gray-300 ${active ? 'border border-primary-500 bg-primary-50' : 'bg-white'}`}>
    //         <Heart width={30} height={30} />
    //     </View>
    //     {data.Description.length > 8 ?
    //       <Text className={`text-[12px] ${active && 'text-primary-500 font-medium'}`}>{(data.Description).slice(0, 13)}..</Text> :
    //       <Text className={`text-[12px] ${active && 'text-primary-500 font-medium'}`}>{data.Description}</Text> 
    //     }
    // </TouchableOpacity>
    <TouchableOpacity onPress={() => dispatch(setDepts({selected: data}))} className={`flex-row px-3 py-1.5 rounded-full self-start shadow-md border-b-2 border-gray-300 ${active ? 'bg-primary-500' : 'bg-white'}`}>
      <Text className={`font-PoppinsMedium text-[11px] ${active ? 'text-white' : 'text-gray-500'}`}>{data.Description}</Text>
    </TouchableOpacity>
  )
}

export const Card_1 = ({ data, selectedDate, docCompId='' }: any) => {

  const dispatch = useDispatch();
  // console.log(`Doctor card Rerendered--------------------------- ${parent}`);

  const handleBooking = () => {
    let doctorData = {
      selectedAppnDate: selectedDate ? selectedDate : '', 
      docCompId: docCompId, 
      // UnderDoctId: data.PartyCode, AppTime: '', TimeSlotId: '', AppointDate: '',
      doctor: data
    }
    dispatch(setAppnData(doctorData))
  }
  
  return (
    <Link href={`/appn/doctor/${data.PartyCode}`} onPress={handleBooking}>
      <View className='flex-row gap-3 bg-white p-[10px] rounded-xl shadow-lg border-b-2 border-gray-300 w-full'>
          <Image className='shadow-lg rounded-xl' source={require('@/assets/images/doctor.jpg')} style={{ width: 60, height: 60 }} />
          <View className='flex-1'>
              <Text className="font-PoppinsSemibold text-sky-800 text-[13px]" numberOfLines={1}>{data.Name}</Text>
              <Text className="font-PoppinsMedium text-gray-700 text-[11px] mb-[6px]" numberOfLines={1}>{data.SpecialistDesc}</Text>
              {/* <Text className="font-PoppinsMedium text-gray-800 text-[11px]">⭐ 4.9 
                  &nbsp;<Text className='text-gray-500'>(2435 Reviews)</Text>
              </Text> */}
              {data.Qualification ? <Text className="font-PoppinsMedium text-gray-500 text-[10px]">{data.Qualification}</Text> : null}
              {stripHtml(data.PrescriptionFooter).result ? <Text className="font-PoppinsMedium text-gray-500 text-[12px] leading-5">{stripHtml(data.PrescriptionFooter).result}</Text> : null}
          </View>
          <View className='justify-between items-end'>
              <Ionicons name="arrow-forward-outline" size={18} color="#64748b" className='text-slate-500'/>
              {data.Rate ? <Text className="font-PoppinsSemibold text-primary-600 text-[11px]">Fee : ₹{data.Rate}</Text> : null}
          </View>
      </View>
    </Link>
  )
}

export const Card_2 = ({ data, active }: any) => {

  const dispatch = useDispatch()
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const isModal = useSelector((i : RootState) => i.modals.MEMBERS.state);
  const vType = useSelector((i : RootState) => i.company.vType);
  const compCode = useSelector((i : RootState) => i.compCode);
  const userLevel = useSelector((i : RootState) => i.user.UserLevelSeq);
  
  const handleTask = (path: string) => {
    dispatch(setMembers({ selectedMember: data }))
    setDropdown(false)
    dispatch(setModal({ name: 'MEMBERS', state: false }))
    if (path) router.push(`/${path}`)
  }

  const handleSelect = () => {
    if (!isModal) return setDropdown(true);
    dispatch(setMembers({ selectedMember: data }))
    dispatch(setModal({ name: 'MEMBERS', state: false }))
    dispatch(setPrescription({ patient: { docName: '', docAddress: '' }, file: { name: '', uri: '', type: '', fileType: '', extn: '' } }));
  }

  const Dropdown = () => {
    return (
      <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400 py-2'>
          <TouchableOpacity onPress={() => {router.push(`/members/${data.MemberId}`); setDropdown(false)}} className='flex-row gap-4 py-4 pl-6 border-b border-gray-300' >
            <FontAwesome5 name="eye" size={17} color={colors.rose[500]} />
            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>View Member</Text>
          </TouchableOpacity>
          {(() => {
            if (vType === 'ErpHospital') {
              return (
                <>
                  <TouchableOpacity onPress={() => {router.push(`/members/${data.MemberId}?mainTab=appns`); setDropdown(false)}} className='flex-row gap-4 py-4 pl-6 border-b border-gray-300' >
                    <FontAwesome5 name="flask" size={17} color={colors.rose[500]} />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>View Bookings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTask('appn/tabs/opd')} className='flex-row gap-4 py-4 pl-6 border-b border-gray-300'>
                    <FontAwesome6 name="calendar-alt" size={17} color={colors.rose[500]} />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>Book Appointment</Text>
                  </TouchableOpacity>
                  {hasAccess("labtest", compCode) ? <TouchableOpacity onPress={() => handleTask('appn/tabs/lab')} className='flex-row gap-4 py-4 pl-6'>
                    <Ionicons name="flask" size={17} color={colors.rose[500]}/>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>Book Lab Tests</Text>
                  </TouchableOpacity> : null}
                </>
              )
            } else if (vType === 'ErpPharma') {
              return (
                <>
                  <TouchableOpacity onPress={() => handleTask('shop/tabs/home')} className='flex-row gap-4 py-4 pl-6'>
                    <FontAwesome5 name="pills" size={17} color={colors.rose[500]}/>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px]">Book Medicines</Text>
                  </TouchableOpacity>
                </>
              )
            }
          })()}
          <TouchableOpacity onPress={() => {dispatch(setModal({ name: 'ADD_MEMBER', state: true, data: {editId: data.MemberId}})); setDropdown(false)}} className='flex-row gap-4 py-4 pl-6 border-t border-gray-300' >
            <FontAwesome5 name="pencil-alt" size={17} color={colors.rose[500]} />
            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>Edit Member</Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <TouchableOpacity onPress={handleSelect}>
      <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg w-full'>
        <Image className='shadow-lg rounded-xl' source={require('@/assets/images/user.png')} style={{ width: 70, height: 70 }} />
        <View className='flex-1'>
            <Text className="font-PoppinsSemibold text-sky-800 text-[14px]">{data.MemberName}</Text>
            <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[8px]" numberOfLines={1}>{userLevel === uType.MARKETBY.level ? 'PATIENT' : data.RelationShipWithHolder}</Text>
            <Text className="font-PoppinsMedium text-gray-800 text-[11px]">
                &nbsp;<Text className='text-gray-500'>{data.Age} Years,   {data.GenderDesc}</Text>
            </Text>
        </View>
        <View className='justify-between items-end'>
          <View>
            <Entypo name="dots-three-horizontal" size={20} color="#64748b" />
          </View>
          {active && <Text className="font-PoppinsSemibold text-green-600 text-[13px]">
            <FontAwesome name="check" size={17} color="#16a34a" />  Selected
          </Text>}
        </View>
          <ReactNativeModal
            isVisible={dropdown}
            onBackdropPress={() => setDropdown(false)}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            backdropOpacity={0.3}
            useNativeDriver
            coverScreen={true}
            style={{margin: 0, flex: 1, height: '100%',
            alignItems: undefined,
            justifyContent: 'center',
            }}
            // deviceHeight={height}
            // customBackdrop={<View style={{flex: 1}} />}
          >
            <Dropdown />
          </ReactNativeModal>
      </View>
    </TouchableOpacity>
  )
}

export const DayBtn = ({ data, activeDate, handleActive }: any) => {
  let day = data.dateStr.split(' ')[0]
  let date = data.dateStr.split(' ')[2];
  let active = data.date === activeDate;
  return (
      <TouchableOpacity onPress={() => handleActive((pre: any) => ({...pre, activeDate: data.date}))} className='gap-2 flex-1 text-center items-center'>
          <Text className={`font-PoppinsMedium pt-3 text-[11px] ${active ? 'text-gray-600' : 'text-gray-400'}`}>{day}</Text>
          <View className={`items-center justify-center h-9 w-10 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-primary-500' : 'bg-white'}`}>
              <Text className={`font-PoppinsMedium text-gray-600 text-[12px] leading-4 ${active ? 'text-white' : ''}`}>{date}</Text>
          </View>
      </TouchableOpacity>
  )
} 

export const mmDDyyyyDate = (date: string, currSeperator: string, requiredSeperator: string): string | void => {                 // Convert dd/mm/yyyy to mm/dd/yyyy format because dd/mm/yyyy is not taken as Date() object to create new date.
  if (!date.includes(currSeperator)) return console.log('CurrentSeperator does not exist in received date.');
  const [dd, mm, yyyy] = date.split(currSeperator);
  return mm + requiredSeperator + dd + requiredSeperator + yyyy;                  
}

export const getDateDifference = (date: string) => {
  let x = mmDDyyyyDate(date, '/', '/');
  let appnDate = new Date(x).getDate();
  const currDate = new Date().getDate();
  if (appnDate > currDate) {
    return 'tomorrow';    
  } else if (appnDate < currDate) {     
    return 'yesterday';    
  } else {
    return 'today';      
  }
}  

export const getDatesArray = function(start: Date, end: number) {
  const endDate = new Date(new Date().setDate(start.getDate() + end));
  for(var arr=[],dt=new Date(start); dt<=new Date(endDate); dt.setDate(dt.getDate()+1)){
      arr.push({dateStr: new Date(dt).toDateString(), date: new Date(dt).toLocaleDateString('en-TT')});
  }
  return arr;
};


export const Card_3 = ({ data }: any) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity onPress={() => dispatch(setModal({name: 'APPN_DETAIL', state: true, data: data}))}>
      <View className="bg-white rounded-xl shadow-md shadow-gray-400">
        <View className='flex-row gap-1 w-full p-3'>
          <Image className='shadow-md shadow-gray-400 rounded-full me-3' source={require('@/assets/images/doctor.jpg')} style={{ width: 60, height: 60 }} />
          <View className='flex-1'>
            <Text className="font-PoppinsSemibold text-sky-700 text-[13px] mb-2">{data.AppointmentTo}</Text>
            <View className='flex-row gap-3 mb-[6px]'>
                <FontAwesome5 name="clock" size={15} color="#075985" />
                <Text className="font-PoppinsMedium text-gray-600 text-[11px]">{new Date(data.NextAppDate).toLocaleDateString('en-TT')},    {data.NextAppTime}</Text>
            </View>
            <View className='flex-row gap-3'>
                <FontAwesome name="user-o" size={15} color="#075983" />    
                <Text className="font-PoppinsMedium text-gray-600 text-[11px]">{data.PartyName}</Text>
            </View>
            {/* <View className='flex-row px-4 py-2 rounded-full mt-4 bg-sky-400 self-start'>
                <Text className="font-PoppinsMedium text-[12px] text-white">Clinic Consultation</Text>
            </View> */}
          </View>
          <Feather name="chevron-right" className='my-auto' size={30} color='#ec4899' />
        </View>
        <View className="flex-row items-center gap-2 border-t border-gray-200 px-4 py-[10px]">
          <Text className={`font-PoppinsMedium text-gray-600 text-[11px]`}>Status : </Text>
          <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 mr-auto ${data.IsAppConfirmed === 'Y' ? 'bg-green-50' : 'bg-sky-50'}`}>
            <Text className={`font-PoppinsMedium text-[11px] ${data.IsAppConfirmed === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Booked'}</Text>
          </View>

          <Text className="font-PoppinsMedium text-gray-600 text-[11px]">Service : </Text>
          <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 ${data.Status === 'Y' ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <Text className={`font-PoppinsMedium text-[11px] ${data.Status === 'Y' ? 'text-green-600' : 'text-yellow-600'}`}>{data.Status === 'Y' ? 'Done' : 'Pending'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const Card_4 = ({ data }: any) => {
  const dispatch = useDispatch();
  return (
    <>
      <View className="bg-white rounded-xl shadow-md shadow-gray-400">
        <TouchableOpacity onPress={() => dispatch(setModal({name: 'TEST_DETAIL', state: true, data: data}))} className='p-3 flex-row gap-1 w-full'>
          <Image className='shadow-md shadow-gray-400 rounded-full me-3' source={require('@/assets/images/user.png')} style={{ width: 60, height: 60 }} />
          <View className='flex-1'>
            <Text className="font-PoppinsSemibold text-sky-700 text-[13px] mb-2">
              {data.PartyName}
            </Text>
            <View className='flex-row gap-3 mb-[6px]'>
                <FontAwesome5 name="clock" size={15} color="#075985" />
                {/* <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{new Date(data.NextAppDate).toLocaleDateString('en-TT')},    {data.NextAppTime}</Text> */}
                <Text className="font-PoppinsMedium text-gray-600 text-[11px]">{data.NextAppDate.split('T')[0] + " "}</Text>
            </View>
            <View className='flex-row gap-3'>
                <FontAwesome name="user-o" size={15} color="#075983" />    
                <Text className="font-PoppinsMedium text-gray-600 text-[11px]">{data.DeptName}</Text>
            </View>
          </View>
          <Feather name="chevron-right" className='my-auto' size={30} color='#ec4899' />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 border-t border-gray-300 px-4 py-[10px]">
          <Text className={`font-PoppinsMedium text-gray-600 text-[11px]`}>Bill : </Text>
          <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 mr-auto ${data.IsAppConfirmed === 'Y' ? 'bg-green-50' : 'bg-sky-50'}`}>
            <Text className={`font-PoppinsMedium text-[11px] ${data.IsAppConfirmed === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Processing'}</Text>
          </View>

          <Text className="font-PoppinsMedium text-gray-600 text-[11px]">Service : </Text>
          <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 ${data.Status === 'Y' ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <Text className={`font-PoppinsMedium text-[11px] ${data.Status === 'Y' ? 'text-green-600' : 'text-yellow-600'}`}>{data.Status === 'Y' ? 'Done' : 'Pending'}</Text>
          </View>
        </View>
      </View>
    </>
  )
}


export const MyModal = ({ modalActive, child, name, customClass, onClose, styles, containerClass }: any) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   alert('Back Pressed')
  //   if (modalActive) {
  //     const backAction = () => {
  //       handleClose();
  //       return true; // prevent default behavior
  //     };
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       backAction
  //     );
  //     return () => backHandler.remove();
  //   }
  // }, [modalActive]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(setModal({name: name, state: false }))
    }
  }

  return (
    <ReactNativeModal
      isVisible={modalActive}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.3}
      useNativeDriver
      coverScreen={true}
      avoidKeyboard={true}
      animationInTiming={500}
      className={customClass}
      style={{margin: 0, flex: 1, height: '100%', opacity: blur ? 0.1 : 1, ...styles }}
      // deviceHeight={height}
      // customBackdrop={<View style={{flex: 1}} />
    >
      <KeyboardAvoidingView className={`flex-1 justify-center ${containerClass}`} pointerEvents="box-none">
        {React.cloneElement(child, { name: name, modalActive: modalActive })}
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};



export const MapComponent = ({ coords }: any) => {
  if (Platform.OS === 'web') {
    return (
      <iframe
        width="100%"
        height="500"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps?q=28.6139,77.2090&hl=es;z=14&output=embed`}
        allowFullScreen
      ></iframe>
    );
  } else {
    // const MapView = require('react-native-maps').default;
    // const Marker = require('react-native-maps').Marker;
  
    return (
      <View className="border border-gray-300 overflow-hidden">
        <Image className="h-[200px] w-full" source={require('@/assets/images/MAP.jpg')} resizeMode="cover" />
      </View>
    )

    // const lat = coords?.lat || 22.595532;
    // const lng = coords?.lng || 88.375243;
    
    // return (
    //   <MapView
    //     style={{ flex: 1 }}
    //     initialRegion={{
    //       latitude: lat,
    //       longitude: lng,
    //       latitudeDelta: 0.05,
    //       longitudeDelta: 0.05,
    //     }}
    //   >
    //     <Marker
    //       coordinate={{ latitude: lat , longitude: lng}}
    //       title="New Delhi"
    //     />
    //   </MapView>
    // );
  }
}

export function DatePickerExample() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // iOS keeps picker visible
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick a date" onPress={showDatePicker} />
      {show && (<DateTimePicker value={date} mode="date" display="default" onChange={onChange} />)}
      <Text style={{ marginTop: 20 }}>Selected: {date.toDateString()}</Text>
    </View>
  );
}

export const Authenticate = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }
  return <>{children}</>;
};


export function useGlobalBackHandler() {
  const history = useSelector((i: RootState) => i.navigation.history);
  const dispatch = useDispatch();

  useEffect(() => {
    const onBackPress = () => {
      if (history.length > 1) {
        dispatch(popRoute());
        const previousRoute = history[history.length - 2];
        router.push(previousRoute);
        return true;
      } else {
        Alert.alert('Exit App', 'Do you want to exit the app?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [history]);
}

export const FullScreenLoading = ({ classes }: any) => {
  return (
    <View className={`${classes} flex-1 bg-white flex items-center justify-center`}>
      <Text className="text-2xl mb-6 font-semibold">Loading...</Text>
      <SvgLoader />
    </View>
  )
}

export const AddToCartBtn = ({ type, product, useAuth, qty, addCart, buyNow, classes, styles }: any) => {

  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  const vType = useSelector((i: RootState) => i.company.vType);
  const cart = useSelector((i: RootState) => i.cart);
  const inCart = Object.values(cart).find(i => i.LocationItemId === product.LocationItemId);
  const isAdded = inCart?.LocationItemId;
  const dispatch = useDispatch();

  let isValid;    
  if (useAuth) isValid = !locationId || qty;
  else isValid = true;
  const isRestaurant = (vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT');

  if (type === 'productCard1') {
      return (
          <>
              {isAdded ? 
                  <View className={`btn btn-outline-primary`}> 
                      <TouchableOpacity onPress={() => {if (inCart.count !== 1) dispatch(addToCart({...inCart, count: inCart.count - 1}))}} className='bx bx-minus align-middle'>-</TouchableOpacity>
                      <Text>{inCart.count} &nbsp;</Text>
                      <TouchableOpacity className='bx bx-plus align-middle' onPress={() => dispatch(addToCart({...inCart, count: inCart.count + 1}))}></TouchableOpacity>
                  </View> :
                  <TouchableOpacity onPress={addCart} className={`btn btn-outline-primary ${isValid ? '' : 'opacity-50 pe-none'}`}>{isAdded ? 'Remove' : 'Add to cart'}</TouchableOpacity> 
              }
              {isRestaurant || <TouchableOpacity onPress={buyNow} className={`btn btn-outline-primary ${isValid ? '' : 'opacity-50 pe-none'}`}>Buy now</TouchableOpacity>}    
          </>
      )
  } else if (type === 'type_1') {
    return (
      <ButtonPrimary title={isAdded ? 'REMOVE' : 'ADD TO CART'} onPress={addCart} isLoading={false} active={true} classes={`flex-1 bg-purple-500 border-r border-gray-200 !rounded-none ${isValid ? '' : 'opacity-50 pointer-events-none'}`} />
    )
  }

}

export const B2BCartCard = ({ data }: any) => {

  const activeItem = data.ItemPackSizeList.find((x: any) => x.CodeId === data.PackSizeId);
  const activePackSize = activeItem ? activeItem.Description : 'N/A';
  const totalMRP = num(data.ItemMRP * data.count)
  const totalPTR = num(data.PTR * data.count)
  // const totalMargin = (parseFloat(totalMRP) - parseFloat(totalPTR)).toFixed(2)
  const itemDiscount = num((data.PTR * data.count) * (data.DiscountPer / 100 ))
  const dispatch = useDispatch();

  return (
    <View key={data.LocationItemId} className="border-b border-gray-200 p-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-base font-medium text-gray-800 flex-1">{data.Description}</Text>

        <View className="bg-blue-50 px-2 py-1 rounded">
          <Text className="text-blue-600 text-xs font-medium">{activePackSize}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600 text-sm">GST: {data.IGSTRATE}%</Text>
        <Text className="text-gray-600 text-sm">Discount: {data.DiscountPer}%</Text>
        <Text className="text-gray-600 text-sm">MRP: ₹ {data.ItemMRP}</Text>
      </View>

      <View className="flex-row items-center mb-3 gap-3">
        <View className="flex-row items-center border border-gray-300 rounded">
          <TouchableOpacity className="px-3 py-2 border-r border-gray-300" onPress={() => dispatch(addToCart({...data, count: data.count + 1}))}>
            <Text className="text-gray-700 font-bold text-xs">▲</Text>
          </TouchableOpacity>

          <TextInput value={String(data.count)} className="px-4 py-2 text-center w-16 text-gray-800" editable={false} />

          <TouchableOpacity className="px-3 py-2 border-l border-gray-300" onPress={() => {if (data.count !== 1) dispatch(addToCart({...data, count: data.count - 1}))}}>
            <Text className="text-gray-700 font-bold text-xs">▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => dispatch(removeFromCart(data.LocationItemId))} className="p-2">
          <Trash2 size={20} color="red" />
        </TouchableOpacity>

        <View className="flex-1" />

        <Text className="text-base font-semibold text-blue-600">PTR: ₹ {data.PTR}</Text>
      </View>

      <View className="bg-gray-100 rounded p-3 flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">Total MRP</Text>
          <Text className="text-sm font-semibold text-gray-800">₹ {totalMRP}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">Total PTR</Text>
          <Text className="text-sm font-semibold text-gray-800">₹ {totalPTR}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">Total Discount</Text>
          <Text className="text-sm font-semibold text-gray-800">₹ {itemDiscount}</Text>
        </View>
      </View>
    </View>
  )
}

export const B2BCOrderCard = ({ data }: any) => {

  return (
    <View key={data.LocationItemId} className="border-b border-gray-200 p-4 bg-white shadow-sm rounded-3xl">
      <View className="flex-row justify-between mb-3">
        <Text className="text-base font-medium text-gray-800 flex-1">{data.Description}</Text>

        <View className="bg-blue-50 px-2 py-1 rounded">
          <Text className="text-blue-600 text-xs font-medium">{data.PackSizeId ? data.PackSizeDesc : 'No pack size'}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600 text-sm">QTY: &nbsp; {data.BillQty}</Text>
        <Text className="text-gray-600 text-sm">Discount: {(data.DiscountText).toFixed(2)}%</Text>
        <Text className="text-gray-600 text-sm">MRP: ₹ {(data.ItemMRP).toFixed(2)}</Text>
      </View>

      {/* <View className="flex-row items-center mb-3 gap-3">
        <View className="flex-row items-center border border-gray-300 rounded">
          <TouchableOpacity className="px-3 py-2 border-r border-gray-300" onPress={() => dispatch(addToCart({...data, count: data.count + 1}))}>
            <Text className="text-gray-700 font-bold text-xs">▲</Text>
          </TouchableOpacity>

          <TextInput value={String(data.count)} className="px-4 py-2 text-center w-16 text-gray-800" editable={false} />

          <TouchableOpacity className="px-3 py-2 border-l border-gray-300" onPress={() => {if (data.count !== 1) dispatch(addToCart({...data, count: data.count - 1}))}}>
            <Text className="text-gray-700 font-bold text-xs">▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => dispatch(removeFromCart(data.LocationItemId))} className="p-2">
          <Trash2 size={20} color="red" />
        </TouchableOpacity>

        <View className="flex-1" />

        <Text className="text-base font-semibold text-blue-600">PTR: ₹ {data.PTR}</Text>
      </View> */}

      <View className="bg-gray-100 rounded p-3 flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">PTR</Text>
          <Text className="text-sm font-semibold text-gray-800">{num(data.Rate)}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">GST</Text>
          <Text className="text-sm font-semibold text-gray-800">+{data.CGST + data.SGST}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">Discount</Text>
          <Text className="text-sm font-semibold text-gray-800">-{num(data.DiscountText)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">Total</Text>
          <Text className="text-sm font-semibold text-gray-800">₹ {num(data.Amount)}</Text>
        </View>
      </View>
    </View>
  )
}