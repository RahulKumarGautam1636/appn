import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary, { LinkBtn } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { addToCart, dumpCart, removeFromCart } from '@/src/store/slices/slices';
import { CartCard } from '@/src/components/utils';
import { useRouter } from 'expo-router';

const Cart = () => {
  const cart = useSelector((i: RootState) => i.cart);
  const cartItems = Object.values(cart);
  const router = useRouter()
  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     name: 'Werolla Cardigans',
  //     color: 'Gray',
  //     size: 'M',
  //     price: 385.00,
  //     quantity: 1,
  //     image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop'
  //   },
  //   {
  //     id: 2,
  //     name: 'Suga Leather Shoes',
  //     color: 'Brown',
  //     size: '40',
  //     price: 375.00,
  //     quantity: 1,
  //     image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'
  //   },
  //   {
  //     id: 3,
  //     name: 'Vinta Headphone',
  //     color: 'Black',
  //     size: '',
  //     price: 360.00,
  //     quantity: 1,
  //     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
  //   },
  //   {
  //     id: 4,
  //     name: 'Zonia Super Watch',
  //     color: 'Silver',
  //     size: '',
  //     price: 850.00,
  //     quantity: 1,
  //     image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'
  //   }
  // ]);                 

  const cartItemsValueList = cartItems.map(item => item.count * item.SRate);                    
  const cartSubtotal = cartItemsValueList.reduce((total, num) => total + num, 0).toFixed(2);           

  const cartItemsMRPList = cartItems.map(item => item.count * item.ItemMRP);                    
  const grossTotal = cartItemsMRPList.reduce((total, num) => total + num, 0).toFixed(2);  
  
  const cartItemsDiscountList = cartItems.map(item => ((item.ItemMRP * item.DiscountPer) / 100) * item.count);                  
  const discountTotal = cartItemsDiscountList.reduce((total, num) => total + num, 0).toFixed(2);  

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
      <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.push('/shop/tabs/home')} className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">My Cart</Text>
        </TouchableOpacity>
      </View>
      {/* <Pressable onPress={() => dispatch(dumpCart())}>
        <Text className="text-lg font-semibold text-black my-4">Clear All</Text>
      </Pressable> */}
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
          <LinkBtn href={'/shop/checkout'} title='CHECKOUT' classes='flex-1 !rounded-2xl !bg-gray-700' />
        </View>
      </ScrollView>
  );
};

export default Cart;