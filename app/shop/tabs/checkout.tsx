import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Entypo, Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary from '@/src/components';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Werolla Cardigans',
      color: 'Gray',
      size: 'M',
      price: 385.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Suga Leather Shoes',
      color: 'Brown',
      size: '40',
      price: 375.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Vinta Headphone',
      color: 'Black',
      size: '',
      price: 360.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Zonia Super Watch',
      color: 'Silver',
      size: '',
      price: 850.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">Chckout</Text>
        </View>
      </View>
      <View className="bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200 flex-row items-center gap-4">
        <View className='w-[4rem] h-[4rem] bg-purple-50 shadow-sm rounded-2xl items-center justify-center'>
          {/* <FontAwesome6 name="location-arrow" size={34} color={colors.purple[600]} /> */}
          <Ionicons name="person" size={31} color={colors.purple[600]} />
        </View>
        <View className="flex-1">
          <View className='justify-between flex-row mb-2'>
              <Text className="text-base font-medium text-black">Sameer Singh</Text>
              <TouchableOpacity onPress={() => {}} className="">
                <FontAwesome name="pencil" size={20} color={colors.blue[500]} />
              </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-3  mb-1">
            <FontAwesome6 name="phone-volume" size={12} color={colors.orange[500]} />
            <Text className="text-gray-600">70032909820</Text>
          </View>
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Address Details</Text>
      <View className='bg-white rounded-3xl px-4 py-2 shadow-sm border-b border-gray-200'>
          <View className='justify-between flex-row px-1 py-[0.9rem] items-start gap-4'>
              <View className='flex-row items-center gap-3'>
                  <Text className="text-slate-600 font-bold text-[12px] items-center leading-5">Address :</Text>
              </View>
              <Text className="text-slate-700 text-[12px] ml-auto leading-5 flex-1 text-end">Labonya Apartment, Flat No. GA, Chittaranjan Park, B-1/312, Kalyani,</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-y border-gray-100'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">Pin Code :</Text>
              <Text className="text-[12px] text-slate-700">741235</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem]'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">E-mail :</Text>
              <Text className="text-[12px] text-slate-700">ssameer7071@gmail.com</Text>
          </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Service Location</Text>
      <View className='bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200'>
        <View className="flex-row items-center gap-4">
          <View className='w-[4rem] h-[4rem] bg-pink-50 shadow-sm rounded-2xl items-center justify-center'>
            {/* <FontAwesome6 name="location-arrow" size={34} color={colors.purple[600]} /> */}
            <Entypo name="location" size={31} color={colors.pink[600]} />
          </View>
          <View className="flex-1">
            <View className='justify-between flex-row mb-2'>
                <Text className="text-base font-medium text-black">Healthbuddy Kalyani Pharmacy</Text>
            </View>
            <View className="flex-row items-center gap-3  mb-1">
              <Text numberOfLines={1} className="text-gray-600 text-sm">B-07/08(S), B-7, Ward No-10, Ground Floor Central Park, Kalyani-Nadia 741235</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Your Order List</Text>
      <View className='gap-3'>
        {cartItems.map((item) => (
          <View key={item.id} className="flex-row items-center bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200">
            <Image 
              source={{ uri: item.image }}
              className="w-[5.5rem] h-[5.5rem] rounded-2xl bg-gray-200 mr-4"
              resizeMode="cover"
            />
            
            <View className="flex-1">
                <View className='justify-between flex-row mb-2'>
                    <Text className="text-base font-medium text-black">{item.name}</Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)} className="">
                        <Ionicons name="trash-outline" size={20} color={colors.rose[500]} />
                    </TouchableOpacity>
                </View>
              
              <View className="flex-row items-center mb-3">
                <Text className="text-sm text-gray-600 mr-3">₹ 362.50</Text>
                  <View className="w-1 h-1 bg-gray-400 rounded-full mr-3" />
                  <Text className="text-sm text-gray-600">Pack : 10 Tab</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-black">₹ {item.price.toFixed(2)}</Text>
                
                <View className="flex-row items-center bg-gray-100 rounded-2xl">
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} className="w-9 h-9 items-center justify-center">
                    <Ionicons name="remove" size={16} color="#666" />
                  </TouchableOpacity>
                  
                  <Text className="mx-2 text-base font-medium text-black">{item.quantity}</Text>
                  
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} className="w-9 h-9 items-center justify-center">
                    <Ionicons name="add" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
        <View className='bg-white rounded-3xl shadow-sm my-4 border-b border-gray-200'>
            <View className='justify-between flex-row px-5 py-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-500 text-[13px] items-center leading-5">Cart Subtotal</Text>
                </View>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px] ml-auto leading-5">702.64</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Service Charge</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">+ 58.88</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Payable Amount</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">₹ 643.76</Text>
            </View>
        </View>
        <View className="bg-indigo-500 rounded-2xl p-5 mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-indigo-400 rounded-full items-center justify-center mr-4"> 
              <Feather name="upload" size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-white mb-2">Attach your prescription.</Text>
              <Text className="text-sm text-gray-100">To place your order.</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="chevron-right" size={23} color="white" />
          </TouchableOpacity>
        </View>
        <View className="">
            <View className="flex-row justify-between items-center mt-2 mb-4">
                <Text className="text-md text-gray-600">Grand Total</Text>
                <Text className="text-2xl font-bold text-sky-800">₹ {totalPrice.toFixed(2)}</Text>
            </View>
            
            <ButtonPrimary title='PLACE ORDER' isLoading={false} active={true} classes='flex-1 !rounded-2xl !bg-gray-700' />
        </View>
    </ScrollView>
  );
};

export default Cart;