import axios, { GenericAbortSignal } from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback, Dimensions, Image, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store/store";

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




