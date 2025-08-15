import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary from '@/src/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, myColors } from '@/constants';
import { OrderItemCard, getFrom, num } from '@/src/components/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';

const OrderStatus = () => {
  const orderSteps = [
    {
      title: 'Order Placed',
      date: '19 Dec 2023, 11:25 PM',
      icon: 'clipboard',
      completed: true,
    },
    {
      title: 'Dispatched',
      date: '19 Dec 2023, 12:25 PM',
      icon: 'package',
      completed: true,
    },
    {
      title: 'Out For Delivery',
      date: '19 Dec 2023, 01:05 PM',
      icon: 'truck',
      completed: true,
    },
    {
      title: 'Delivered',
      date: '19 Dec 2023, 06:00 PM',
      icon: 'check-circle',
      completed: false,
    },
  ];

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

  const router = useRouter();

  const [orders, setOrders] = useState({ loading: false, data: { OrderList: [] }, err: { status: false, msg: '' } });
  const { orderId } = useLocalSearchParams();

  const compCode = useSelector((i: RootState) => i.compCode);
  const user = useSelector((i: RootState) => i.user);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);  
  
  useEffect(() => {
    const getMyOrders = async (partyCode, id, locId) => {
      const res = await getFrom(`${BASE_URL}/api/Pharma/GetOrderDetails?CID=${compCode}&ORDERID=${id}&PID=${partyCode}&Type=${'active'}&LOCID=${locId}`, {}, setOrders);
      if (res) {
        setOrders(res);
      } else {
        console.log('No data received');
      }
    }                                                               // Adding tabActive as dependency will call getMyOrders whenever tabActive is changed with current tab name.
    if (!isLoggedIn) return router.push('/');
      getMyOrders(user.PartyCode, orderId, locationId);
  }, [compCode, isLoggedIn, user.PartyCode, locationId])

  const order = orders.data.OrderList[0] || {};

  let orderS = order?.EnqFollowUpList?.map((i: any) => (
    { title: i.Tag + ' ' + i.Remarks, date: new Date(i.NextAppDate).toDateString() + '    ' + i.NextAppTime, icon: getStatusIcon(i.Tag), completed: true }
  ))

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">Order Details</Text>
        </TouchableOpacity>
      </View>
      <View className='bg-white rounded-3xl shadow-sm border-b border-gray-200'>
        <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
            <View className='flex-row items-center gap-3'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Order ID</Text>
            </View>
            <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">{order.VchNo}</Text>
        </View>

        <View className='flex-row gap-3 p-4'>
          {/* <FontAwesome5 name="clock" size={17} color={myColors.primary[500]} /> */}
          <Text className="font-PoppinsSemibold text-slate-700 text-[14px] mr-auto">Order Status</Text>
          {/* <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} /> */}
          {/* <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">
            {new Date(data.NextAppDate).toLocaleDateString('en-TT')}
            In Process{order.OrderStatus}
          </Text> */}
          {order.OrderStatus ? 
            <View className={`px-3 py-[4px] rounded-xl shadow-sm bg-sky-50`}>
                <Text className={`text-[13px] font-medium text-sky-600`}>{order.OrderStatus}</Text>
            </View> :
            <View className={`px-3 py-[4px] rounded-xl shadow-sm ${order.ApprovalStatus === 'Y' ? 'bg-green-50' : 'bg-sky-50'}`}>
                <Text className={`text-[13px] font-medium ${order.ApprovalStatus === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{order.ApprovalStatus === 'Y' ? 'Processed' : 'Order Placed'}</Text>
            </View>
          }
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Deliver To</Text>
      <View className="bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200 flex-row items-center gap-4">
        <View className='w-[4rem] h-[4rem] bg-purple-50 shadow-sm rounded-2xl items-center justify-center'>
          {/* <FontAwesome6 name="location-arrow" size={34} color={colors.purple[600]} /> */}
          <Ionicons name="person" size={31} color={colors.purple[600]} />
        </View>
        <View className="flex-1">
          <View className='justify-between flex-row mb-2'>
              <Text className="text-base font-medium text-black">{order.CashPartyName}</Text>
              <TouchableOpacity onPress={() => {}} className="">
                <Feather name="arrow-right" size={20} color={colors.blue[500]} />
              </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-3  mb-1">
            <FontAwesome6 name="phone-volume" size={12} color={colors.orange[500]} />
            <Text className="text-gray-600">{order.CashPartyMobile}</Text>
          </View>
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Address Details</Text>
      <View className='bg-white rounded-3xl px-4 py-2 shadow-sm0'>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Order ID :</Text>
              <Text className="text-[13px] text-slate-700">{order.VchNo}</Text>
          </View>

          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Order Date :</Text>
              <Text className="text-[13px] text-slate-700">{order?.VchDate?.slice(0, 10)?.split('-').reverse().join('-')}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Payment Method :</Text>
              <Text className="text-[13px] text-slate-700">{order.PaymentMethod}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Order Value :</Text>
              <Text className="text-[13px] text-slate-700">{num(order.Amount)}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Service Location :</Text>
              <Text className="text-[13px] text-slate-700">{order.LocationName}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Delivery Address :</Text>
              <Text className="text-[13px] text-slate-700">{order.PartyAddress}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[13px] mr-auto">Billing Status :</Text>
              <Text className="text-[13px] text-orange-600 font-semibold">{order.ApprovalStatus === 'Y' ? 'PROCESSED' : 'ORDER PLACED'}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem]'>
            <Text className="text-slate-600 font-bold text-[13px] mr-auto">Order Status :</Text>
            {order.OrderStatus ? 
              <Text className="text-[13px] text-green-600 font-semibold">{order.OrderStatus}</Text> :
              <Text className={`text-[13px] font-semibold ${order.ApprovalStatus === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{order.ApprovalStatus === 'Y' ? 'Processed' : 'Order Placed'}</Text>
            }
          </View>
      </View>
      {/* <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Service Location</Text>
      <View className='bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200'>
        <View className="flex-row items-center gap-4">
          <View className='w-[4rem] h-[4rem] bg-pink-50 shadow-sm rounded-2xl items-center justify-center'>
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
      </View> */}
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Your Order List</Text>
      <View className='gap-3'>
        {order?.SalesDetailsList?.map((item, index) => <OrderItemCard data={item} key={index} />)}
      </View>
        <View className='bg-white rounded-3xl shadow-sm my-4 border-b border-gray-200'>
            <View className='justify-between flex-row px-5 py-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-500 text-[13px] items-center leading-5">Cart Subtotal</Text>
                </View>
                <Text className="font-PoppinsSemibold text-slate-700 text-[13px] ml-auto leading-5">{num(order.Amount)}</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Service Charge</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">+ 00.00</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Payable Amount</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">₹ {num(order.Amount)}</Text>
            </View>
        </View>
        {/* <View className="bg-indigo-500 rounded-3xl p-5 flex-row items-center justify-between">
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
        </View> */}
        {order.EnqFollowUpList?.length ? <>
        <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Delivery Status</Text>
        <View className="bg-white shadow-sm border-b border-gray-200 rounded-3xl py-6 pl-5 pr-6">           
            <View className="relative gap-5">
                {/* {orderSteps.map((step, index) => (
                    <View key={index} className="flex-row items-start">
                        {index < orderSteps.length - 1 && (<View className={`absolute left-4 top-8 w-0.5 h-12 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}/>)}
                        <View className={`w-8 h-8 rounded-full items-center justify-center z-10 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}>
                            <Feather name={step.icon} size={16} color={step.completed ? 'white' : '#9CA3AF'} />
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className={`font-semibold text-base mb-[0.4rem] ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.title}
                            </Text>
                            <Text className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                                {step.date}
                            </Text>
                        </View>
                        <View className="my-auto">
                            <Feather name={getStatusIcon(step.title)} size={20} color={step.completed ? '#D97706' : '#9ca3af'} />
                        </View>
                    </View>
                ))} */}
                {orderS?.map((step, index) => (
                  <View key={index} className="flex-row items-start">
                      {index < orderS?.length - 1 && (<View className={`absolute left-4 top-8 w-0.5 h-12 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}/>)}
                      <View className={`w-8 h-8 rounded-full items-center justify-center z-10 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}>
                          <Feather name={step.icon} size={16} color={step.completed ? 'white' : '#9CA3AF'} />
                      </View>
                      <View className="flex-1 ml-4">
                          <Text className={`font-semibold text-base mb-[0.4rem] ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.title}
                          </Text>
                          <Text className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                              {step.date}
                          </Text>
                      </View>
                      <View className="my-auto">
                          <FontAwesome5 name="check" size={18} color={step.completed ? '#D97706' : '#9ca3af'} />
                      </View>
                  </View>
              ))}
            </View>
        </View></> : null}
        <View className="flex-row gap-4 mt-1">
            <ButtonPrimary title='NEED HELP' isLoading={false} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-gray-700' />
            <ButtonPrimary title='CANCEL' isLoading={false} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-red-600' />
        </View>
    </ScrollView>
  );
};

const getStatusIcon = (title) => {
  switch (title) {
    case 'Order Placed':
      return 'file-text';
    case 'Dispatched':
      return 'box';
    case 'Out For Delivery':
      return 'truck';
    case 'Delivered':
      return 'package';
    default:
      return 'circle';
  }
};

export default OrderStatus;