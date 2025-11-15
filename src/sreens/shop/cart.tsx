import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary, { LinkBtn } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { addToCart, dumpCart, removeFromCart, setModal } from '@/src/store/slices/slices';
import { CartCard, NoContent } from '@/src/components/utils';
import { useRouter } from 'expo-router';

const Cart = () => {
  const cart = useSelector((i: RootState) => i.cart);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const dispatch = useDispatch();
  const cartItems = Object.values(cart);
  const router = useRouter()              

  const cartItemsValueList = cartItems.map(item => item.count * item.SRate);                    
  const cartSubtotal = cartItemsValueList.reduce((total, num) => total + num, 0).toFixed(2);           

  const cartItemsMRPList = cartItems.map(item => item.count * item.ItemMRP);                    
  const grossTotal = cartItemsMRPList.reduce((total, num) => total + num, 0).toFixed(2);  
  
  const cartItemsDiscountList = cartItems.map(item => ((item.ItemMRP * item.DiscountPer) / 100) * item.count);                  
  const discountTotal = cartItemsDiscountList.reduce((total, num) => total + num, 0).toFixed(2);  

  const handleCheckout = () => {
    if (!isLoggedIn) {
      dispatch(setModal({name: 'LOGIN', state: true}))
    } else {
      router.push('/shop/checkout')
    }
  }

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
      <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.push('/shop/tabs/home')} className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">My Cart</Text>
        </TouchableOpacity>
      </View>
      {cartItems.length ? <>
        <View className='gap-3'>
          {cartItems.map((data) => <CartCard data={data} key={data.LocationItemId} />)}
        </View>
        <View className='bg-white rounded-3xl shadow-sm my-4 border-b border-gray-200'>
            <View className='justify-between flex-row px-5 py-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-500 text-[13px] items-center leading-5">Gross Amount</Text>
                </View>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px] ml-auto leading-5">{grossTotal}</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Less Discount</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">- {discountTotal}</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Payable Amount</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">₹ {cartSubtotal}</Text>
            </View>
        </View>
        <View className="">
          <View className="flex-row justify-between items-center mt-2 mb-4">
              <Text className="font-semibold text-md text-gray-600">Grand Total :</Text>
              <Text className="text-2xl font-bold text-sky-800">₹ {cartSubtotal}</Text>
          </View>
          <ButtonPrimary onClick={handleCheckout} title='CHECKOUT' active={true} classes='flex-1 !rounded-2xl !bg-gray-700' />
        </View>
      </> : <NoContent label='Your Cart is Empty' containerClass='flex-1' imgClass='h-[200px] mb-5'/>}
    </ScrollView>
  );
};

export default Cart;