import { myColors, SRC_URL } from "@/constants"
import { Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { Image, Text, TouchableOpacity, View, StyleSheet, Pressable, findNodeHandle, UIManager, KeyboardAvoidingView, Dimensions, Platform } from "react-native"
import Heart from '../../assets/icons/departments/heart.svg';
import Loader from '../../assets/images/loader.svg';
import { Link } from "expo-router";
import { setAppnData, setCompanies, setDepts, setMembers, setModal } from "@/src/store/slices/slices";

import React, { useRef, useState } from 'react';
import Modal, { ReactNativeModal } from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from "@/src/store/store";

// import MapView, { Marker } from 'react-native-maps';


import { useEffect } from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  withDelay
} from 'react-native-reanimated';
import AppnDetail from "@/app/appnDetail";


export default function ButtonPrimary({ title, onPress, isLoading, active, classes, textClasses, onClick }: any) {

  return (
    <TouchableOpacity onPressOut={onClick} className={`p-4 items-center justify-center rounded-full shadow-sm shadow-gray-700 ${classes} ${(active && !isLoading) ? 'bg-primary-500' : 'bg-gray-300'}`} onPress={onPress}>
      {isLoading ? 
      <SvgLoader /> : 
      <Text className={`font-PoppinsSemibold ${textClasses} ${(active && !isLoading) ? 'text-white' : 'text-slate-500'}`}>{title}</Text>
      }
    </TouchableOpacity>
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
    <View className={`items-center p-[13px] rounded-xl shadow-lg ${active ? 'border border-primary-500 bg-primary-50' : 'bg-white'}`}>
      <View className="flex-row gap-4">
        <Image className='shadow-lg rounded-xl' src={`${SRC_URL}/Content/CompanyLogo/${data.LogoUrl}`} style={{ width: 65, height: 65 }} />
        <TouchableOpacity onPress={handleSelect} className="flex-1 min-w-0">  
            <Text className="font-PoppinsSemibold text-sky-800 text-[13px]" numberOfLines={0} style={{flexShrink: 1, flexWrap: 'wrap'}}>{data.COMPNAME}</Text>
            <View className='mt-1 gap-2 flex-row items-center'>
                <FontAwesome5 name="clock" size={12} color="gray" />
                <Text className="text-slate-600 font-PoppinsSemibold text-[11px] leading-5">08:00 AM &nbsp;-&nbsp; 9:30 AM</Text>
            </View>
            <View className='mt-1 gap-2 flex-row items-center'>
                <FontAwesome5 name="map-marker-alt" size={12} color="gray" />
                <Text className="text-gray-500 font-PoppinsMedium text-[11px] leading-5" numberOfLines={1} style={{flexShrink: 1, flexWrap: 'wrap', flex: 1}}>{data.ADDRESS}</Text>
            </View>
        </TouchableOpacity>
      </View>
      {details &&<View className="flex-row gap-2 mt-5">
        <TouchableOpacity className={`py-2 items-center rounded-xl flex-1 ${active ? 'bg-gray-400' : 'bg-sky-500'}`} onPress={handleSelect}>
          <Text className="text-white font-Poppins">{active ? 'Selected' : 'Select Clinic'}</Text>
        </TouchableOpacity>
        <View className="py-2 bg-primary-500 items-center rounded-xl flex-1">
          <Link href={`/appn/clinic/${data.CompanyId}`} onPress={() => dispatch(setModal({name: 'COMPANIES', state: false }))}>
              <Text className="text-white font-Poppins">View Details</Text>
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
    <TouchableOpacity onPress={() => dispatch(setDepts({selected: data}))} className={`flex-row px-4 py-2 rounded-full self-start shadow-md shadow-gray-300 ${active ? 'bg-primary-500' : 'bg-white'}`}>
      <Text className={`font-PoppinsMedium text-[12px] ${active ? 'text-white' : 'text-gray-500'}`}>{data.Description}</Text>
    </TouchableOpacity>
  )
}

export const Card_1 = ({ data, selectedDate, docCompId='' }: any) => {

  const dispatch = useDispatch();

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
      <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg w-full'>
          <Image className='shadow-lg rounded-xl' source={require('../../assets/images/doctor.jpg')} style={{ width: 70, height: 70 }} />
          <View className='flex-1'>
              <Text className="font-PoppinsSemibold text-sky-800 text-[14px]">{data.Name}</Text>
              <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[8px]" numberOfLines={1}>{data.SpecialistDesc}</Text>
              <Text className="font-PoppinsMedium text-gray-800 text-[11px]">⭐ 4.9 
                  &nbsp;<Text className='text-gray-500'>(2435 Reviews)</Text>
              </Text>
          </View>
          <View className='justify-between items-end'>
              <Ionicons name="arrow-forward-outline" size={20} color="#64748b" className='text-slate-500'/>
              <Text className="font-PoppinsSemibold text-primary-600 text-[12px]">₹600/hr</Text>
          </View>
      </View>
    </Link>
  )
}

export const Card_2 = ({ data, index, active }: any) => {

  const dispatch = useDispatch()

  const [dropdown, setDropdown] = useState(false);

  const Dropdown = () => {
    return (
      <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
          <TouchableOpacity className='flex-row gap-3 p-4 border-b border-gray-300' >
            <FontAwesome5 name="flask" size={17} color={myColors.primary[500]} />
            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>View Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex-row gap-3 p-4 border-b border-gray-300'>
            <FontAwesome6 name="calendar-alt" size={17} color={myColors.primary[500]} />
            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex-row gap-3 p-4'>
            <Ionicons name="flask" size={17} color={myColors.primary[500]}/>
            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>Book Lab Tests</Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <TouchableOpacity onPress={() => {dispatch(setMembers({ selectedMember: data })); dispatch(setModal({ name: 'MEMBERS', state: false }))}}>
      <View className='flex-row gap-4 bg-white p-[13px] rounded-xl shadow-lg w-full'>
        <Image className='shadow-lg rounded-xl' source={require('../../assets/images/doctor.jpg')} style={{ width: 70, height: 70 }} />
        <View className='flex-1'>
            <Text className="font-PoppinsSemibold text-sky-800 text-[14px]">{data.MemberName}</Text>
            <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[8px]" numberOfLines={1}>{data.RelationShipWithHolder}</Text>
            <Text className="font-PoppinsMedium text-gray-800 text-[11px]">
                &nbsp;<Text className='text-gray-500'>{data.Age} Years,   {data.GenderDesc}</Text>
            </Text>
        </View>
        <View className='justify-between items-end'>
          <TouchableOpacity onPress={() => setDropdown(true)} >
            <Entypo name="dots-three-horizontal" size={20} color="#64748b" />
          </TouchableOpacity>
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
      <TouchableOpacity onPress={() => handleActive((pre: any) => ({...pre, activeDate: data.date}))} className='gap-3 flex-1 text-center items-center'>
          <Text className={`font-PoppinsMedium pt-4 text-[12px] ${active ? 'text-gray-600' : 'text-gray-400'}`}>{day}</Text>
          <View className={`items-center justify-center h-11 w-12 rounded-lg shadow-sm shadow-gray-400 ${active ? 'bg-primary-500' : 'bg-white'}`}>
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


export const Card_3 = ({ data }: any) => {
  const dispatch = useDispatch();
  return (
    <>
      {/* <Link href={`/appn/appnDetail/${data.}`}> */}
        <TouchableOpacity onPress={() => dispatch(setModal({name: 'APPN_DETAIL', state: true, data: data}))} className='flex-row gap-1 p-4 bg-white rounded-xl shadow-md shadow-gray-400 w-full'>
          <Image className='shadow-md shadow-gray-400 rounded-full me-3' source={require('./../../assets/images/doctor.jpg')} style={{ width: 60, height: 60 }} />
          <View className='flex-1'>
            <Text className="font-PoppinsSemibold text-sky-700 text-[15px] mb-3">{data.AppointmentTo}</Text>
            <View className='flex-row gap-3 mb-[7px]'>
                <FontAwesome5 name="clock" size={15} color="#075985" />
                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{new Date(data.NextAppDate).toLocaleDateString('en-TT')},    {data.NextAppTime}</Text>
            </View>
            <View className='flex-row gap-3'>
                <FontAwesome name="user-o" size={15} color="#075983" />    
                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{data.PartyName}</Text>
            </View>
            <View className='flex-row px-4 py-2 rounded-full mt-4 bg-sky-400 self-start'>
                <Text className="font-PoppinsMedium text-[12px] text-white">Clinic Consultation</Text>
            </View>
          </View>
          <Feather name="chevron-right" className='my-auto' size={30} color='#ec4899' />
        </TouchableOpacity>
      {/* </Link> */}
      {/* <ReactNativeModal
        isVisible={active}
        onBackdropPress={() => setActive(false)}
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
        // customBackdrop={<View style={{flex: 1}} />
      >
        <AppnDetail data={data} handleOpen={setActive} />
      </ReactNativeModal> */}
    </>
  )
}


export const MyModal = ({ modalActive, child, name, customClass, onClose }: any) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(setModal(name))
    }
  }

  return (
    <ReactNativeModal
      isVisible={modalActive}
      onBackdropPress={handleClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.3}
      useNativeDriver
      coverScreen={true}
      avoidKeyboard={true}
      animationInTiming={500}
      style={{margin: 0, flex: 1, height: '100%', alignItems: undefined, justifyContent: 'center'}}
      // deviceHeight={height}
      // customBackdrop={<View style={{flex: 1}} />
    >
      <KeyboardAvoidingView className="flex-1">
        <View style={styles.modal}>
          {React.cloneElement(child, { name: name, modalActive: modalActive })}
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', height: '100%', margin: 0 },
});



export const MapComponent = () => {
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
  
    return 
    // (
    //   <MapView
    //     style={{ flex: 1 }}
    //     initialRegion={{
    //       latitude: 28.6139,
    //       longitude: 77.2090,
    //       latitudeDelta: 0.05,
    //       longitudeDelta: 0.05,
    //     }}
    //   >
    //     <Marker
    //       coordinate={{ latitude: 28.6139, longitude: 77.2090 }}
    //       title="New Delhi"
    //     />
    //   </MapView>
    // );
  }
}



