import axios, { GenericAbortSignal } from "axios";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback, Dimensions, Image, Text, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from "react-native-reanimated-carousel";

export const getFrom = async (queryUrl: any, params: any, setStateName: any, signal: GenericAbortSignal) => {
  
  setStateName((preValue: any) => {
    return {...preValue, loading: true};
  })
  try {
    const res = await axios.get(queryUrl, { params: params, signal: signal });
    if (res.status === 200) {
      return {loading: false, data: res.data, err: {status: false, msg: ''}};
    } else if (res.status === 500) {
      setStateName((preValue: any) => {
        return {...preValue, loading: false, err: {status: true, msg: res.status}};
      })
      return false;
    }
  } catch (error: any) {
    console.log(error);
    if (error.code === 'ERR_CANCELED') return false;           // return early if request aborted to prevent loading: false.
    setStateName((preValue: any) => {
      return {...preValue, loading: false, err: {status: true, msg: error.message}};
    })
    return false;
  }
}


export const ListLoader = ({ classes='h-[91px]', count=4, containerClass='gap-3 mb-6' }) => {
  return (
    <View className={`flex flex-column justify-between overflow-hidden ${containerClass}`}>
      {Array.from(Array(count).keys()).map(i => (<View className={`${classes} w-full bg-gray-200`} key={i}></View>))}
      {/* <Text>Loading...</Text> */}
    </View>
  )
}

export const GridLoader = ({ classes='h-[120px] flex-1', count=6, containerClass='gap-3', style={} }) => {

  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className={`flex justify-between overflow-hidden ${containerClass}`}>
      {Array.from(Array(count).keys()).map(i => (<Animated.View className={`${classes} bg-gray-300`} key={i} style={[styles.skeleton, style, { opacity }]} />))}
    </View>
  )
}


const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 12
  },
});


export const NoContent = ({ label='No Items Found.', imgClass='h-[150]', textClass='text-gray-500 text-[16px] ', containerClass='pt-3 pb-5' }: any) => {
  return (
    <View className={`justify-center items-center ${containerClass}`}>
      <Image className={`max-w-full ${imgClass}`} source={require('../../assets/images/no_content.png')} resizeMode="contain" />
      <Text className={`font-PoppinsBold leading-[23px] mt-2 ${textClass}`}>{label}</Text>
    </View>
  )
}


export function withAutoUnmount(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const [isMounted, setIsMounted] = useState(true);

    useFocusEffect(
      useCallback(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
      }, [])
    );

    if (!isMounted) return null;

    return <Component {...props} />;
  };
}


const { width } = Dimensions.get("window");

const banners = [
  { id: 1, image: require("../../assets/images/banner-card-1.jpg") },
  { id: 2, image: require("../../assets/images/banner-card-2.jpg") },
  { id: 3, image: require("../../assets/images/banner-card-3.jpg") },
];

export const BannerCarousel = () => {
  return (
    <View className="mt-4">
      <Carousel
        loop
        width={width}
        height={178}
        autoPlay={true}
        data={banners}
        pagingEnabled={true}
        scrollAnimationDuration={2500}
        renderItem={({ item }) => {
          return <View className="px-4 justify-center items-center"><Image source={item.image} className="w-full h-[175px] rounded-xl border border-gray-300" /></View>
        }}
      />
    </View>
  );
}

export const getRequiredFields = (list, compCode: number) => {
  // let { globalData } = store.getState();

  return list.map((i: any) => ({ 
    PTR: i.PTR,
    AutoId: i.AutoId,
    Category: i.Category, 
    CategoryName: i.CategoryName, 
    SubCategoryId: i.SubCategoryId,
    CompanyId: i.CompanyId,
    Description: i.Description, 
    DepartmentId: i.DepartmentId,
    Discount: i.Discount,
    DiscountPer: i.DiscountPer,
    ItemId: i.ItemId, 
    ItemMRP: i.ItemMRP, 
    PackSizeId: i.PackSizeId,
    ItemPackSizeList: i.ItemPackSizeList, 
    SRate: i.SRate, 
    StockQty: i.StockQty, 
    GroupName: i.GroupName, 
    Parent: i.Parent, 
    ParentDesc: i.ParentDesc, 
    Technicalname: i.Technicalname,
    sv_CostId: i.sv_CostId, 
    itemmstr: i.itemmstr, 
    LocationId: compCode, 
    ManufacturBY: i.ManufacturBY,
    Unit: i.Unit,
    UnitName: i.UnitName,
    IsVisible: i.IsVisible, 
    ItemCode: i.ItemCode, 
    ItemImageURL: i.ItemImageURL,    
    CGST: i.CGST,
    SGST: i.SGST,
    IGST: i.IGST, 
    CGSTRATE: i.CGSTRATE, 
    SGSTRATE: i.SGSTRATE,
    IGSTRATE: i.IGSTRATE, 
    Specification: i.Specification || '', 

    _id: compCode + '_' + i.ItemId,
    count: 1,
  }));
}

export const num = (n: any) => parseFloat(n.toFixed(2));

export const createDate = (days: any, months: any, years: any) => {
  var date = new Date(); 
  date.setDate(date.getDate() - days);
  date.setMonth(date.getMonth() - months);
  date.setFullYear(date.getFullYear() - years);  
  return date.toLocaleDateString('en-TT');
  // return date.toISOString().substr(0, 10);    
}

export const getDuration = (date: any) => {

  // let [byears, bmonths, bdays] = date ? date.split('-') : new Date().toLocaleDateString('en-CA').split('-');
  // let [years, months, days] = new Date().toLocaleDateString('en-CA').split('-');
  let [bdays, bmonths, byears] = date ? date.split('/') : new Date().toLocaleDateString('en-TT').split('/');
  let [days, months, years] = new Date().toLocaleDateString('en-TT').split('/');
  
  var by = Number.parseFloat(byears),
      bm = Number.parseFloat(bmonths),
      bd = Number.parseFloat(bdays),
      ty = Number.parseFloat(years),
      tm = Number.parseFloat(months),
      td = Number.parseFloat(days);

  if (td < bd) {
    days = (td - bd + 30);
    tm = tm - 1;
  } else {
    days = (td - bd);
  }

  if (tm < bm) {
    months = (tm - bm + 12);
    ty = ty - 1;
  } else {
    months = (tm - bm)
  }
  years = (ty - by);
  return { 
    years: years ? years : 0,
    months: months ? months : 0,
    days: days ? days : 0 
  }
}

export const formatted = (date: string) => {
  if (!date) return;
  let formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long'
  }).format(new Date(date));
  return formattedDate;
}

export const GradientBG = ({ children }: any) => {
  return (
    <ImageBackground
        imageStyle={{opacity: 0.6}}
        source={require('../../assets/images/glass-bg.png')}
        resizeMode="cover"
        className='flex-1'
    >
      {children}
    </ImageBackground>
  )
}