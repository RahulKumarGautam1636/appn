import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary, { MyModal } from '@/src/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, myColors } from '@/src/constants';
import { GridLoader, OrderItemCard, PreviewImage, getFrom, getStatusIcon, num, wait } from '@/src/components/utils';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import OrderReturn from '@/src/components/modals/orderReturn';

const OrderStatus = () => {

  const router = useRouter();

  const [orders, setOrders] = useState({ loading: false, data: { OrderList: [{AlreadyReturnDetailsList: []}] }, err: { status: false, msg: '' } });
  const { orderId, pane } = useGlobalSearchParams();

  const compCode = useSelector((i: RootState) => i.compCode);
  const user = useSelector((i: RootState) => i.user);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);  
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(1);
  const [orderReturn, setOrderReturn] = useState({ active: false, type: '', orderData: {} });
  
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
  }, [compCode, isLoggedIn, user.PartyCode, locationId, reload])

  const order = orders.data.OrderList[0];

  let orderS = order?.EnqFollowUpList?.map((i: any) => (
    { title: i.Tag + ' ' + i.Remarks, date: new Date(i.NextAppDate).toDateString() + '    ' + i.NextAppTime, icon: getStatusIcon(i.Tag), completed: true }
  ))

  // const getMyOrders2 = async (partyCode, id, locId) => {    // Need to call inside cancelOrder() hence Duplicating getMyOrders to avoid useEffect dependency warnings.
  //   const res = await getFrom(`${BASE_URL}/api/Pharma/GetOrderDetails?CID=${compCode}&ORDERID=${id}&PID=${partyCode}&Type=${'active'}&LOCID=${locId}`, {}, setOrders);
  //   if (res) {
  //     setOrders(res);
  //   } else {
  //     console.log('No data received');
  //   }
  // } 

  const cancelOrder = async (id: number) => {
    setLoading(true);
    await wait(2000);
    const res = await axios.get(`${BASE_URL}/api/Pharma/Get?id=${id}`, {});
    setLoading(false);
    if (res) {
      alert('Order Cancelled Successfully.');
      setReload(reload + 1)                       // Reload / Recall getMyOrders to get cancelled update. Not using pane to avoid navigation history entry.
    }
  }

  let firstPresc = order.EnclosedDocObj?.EnclosedDocList[0];
  let filePath = firstPresc?.FilePath;
  let fileName = firstPresc?.FileName;
  let imgUrl = `${filePath}/${fileName}` || 'no_image_url'
  const [preveiw, setPreview] = useState(false);

  // RETURNS -------------------------------------------------------------------------
  
  let isAlreadySubmitted = order?.AlreadyReturnDetailsList?.length;
  let pickupProgress = order?.AlreadyReturnDetailsList[0]?.EnqFollowUpList;
  let isRequestApproved = pickupProgress?.length;

  let productItems; 

  if (isAlreadySubmitted) { 
      productItems = order?.AlreadyReturnDetailsList || [];  
  } else {
      productItems = order?.SalesReturnDetailsList || [];  
  }

  // let total = productItems.reduce((total, i) => total + (parseFloat(i.NetRateS * parseFloat(i.BillQty))), 0).toFixed(2);

  let orderRturnStages = pickupProgress?.map((i: any) => (
      { title: i.Tag + ' ' + i.Remarks, date: new Date(i.NextAppDate).toDateString() + '    ' + i.NextAppTime, icon: getStatusIcon(i.Tag), completed: true }
  ))

  // RETURNS -------------------------------------------------------------------------

  return (
    <>
      <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
        
        <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
            <Text className="text-lg font-semibold text-black">Order Details</Text>
          </TouchableOpacity>
        </View>
        {orders.loading ? <GridLoader /> : <>
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
          <View className='bg-white rounded-3xl px-4 py-2 shadow-sm border-b border-gray-200'>
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
                  <Text className="text-[13px] text-slate-700 flex-1 text-right">{order.LocationName}</Text>
              </View>
              <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                  <Text className="text-slate-600 font-bold text-[13px] mr-auto">Delivery Address :</Text>
                  <Text className="text-[13px] text-slate-700 flex-1 text-right">{order.PartyAddress}</Text>
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
          
          {fileName ? <>
          <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Your Prescription</Text>
          <MyModal modalActive={preveiw} onClose={() => setPreview(false)} name='PRESC_PREVIEW' child={<PreviewImage url={imgUrl} />} />
          <TouchableOpacity onPress={() => setPreview(true)} className="bg-white rounded-2xl border-b border-gray-200 p-5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 gap-4">
              <Image source={{ uri: imgUrl }} className="w-14 h-14 rounded-xl border border-gray-100" resizeMode="cover" />
              <View className="flex-1">
                <Text className="font-semibold text-indigo-500 mb-2">{order.VchNo}.png</Text>
                <Text className="text-sm text-gray-500">Image</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="chevron-right" size={23} color="gray" />
            </TouchableOpacity>
          </TouchableOpacity></> : null}
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
          <Text className='text-[1.05rem] mb-3 font-PoppinsSemibold'>Delivery Status</Text>
          <View className="bg-white shadow-sm border-b border-gray-200 rounded-3xl py-6 pl-5 pr-6 mb-3">           
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

          {isAlreadySubmitted ? <>
              <Text className='text-[1.05rem] mb-3 mt-1 font-PoppinsSemibold'>Return Status</Text>
              <TouchableOpacity className={`${isRequestApproved ? 'bg-green-500' : 'bg-orange-500'} rounded-2xl p-5 flex-row items-center justify-between mb-4`}>
                  <View className="flex-row items-center flex-1">
                      <View className={`${isRequestApproved ? 'bg-green-400' : 'bg-orange-400'} w-12 h-12 rounded-full items-center justify-center mr-4`}> 
                          <Feather name="check" size={24} color="#ffffff" />
                      </View>
                      <View className="flex-1">
                      <Text className="font-semibold text-white leading-7">Your Return Request is {"\n"}{isRequestApproved ? 'APPROVED' : 'WAITING FOR APPROVAL'}</Text>
                      {/* <Text className="text-sm text-gray-100">In order to place your order.</Text> */}
                      </View>
                  </View>
              </TouchableOpacity>
          </> : ''}
          {orderRturnStages?.length ? <>
              <View className="bg-white shadow-sm border-b border-gray-200 rounded-3xl py-6 pl-5 pr-6 mb-3">           
                  <View className="relative gap-5">
                      {orderRturnStages?.map((step, index) => (
                      <View key={index} className="flex-row items-start">
                          {index < orderRturnStages?.length - 1 && (<View className={`absolute left-4 top-8 w-0.5 h-12 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}/>)}
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
              </View>
          </> : null}




          <View className="flex-row gap-4 mt-1">
              <ButtonPrimary title='CLOSE' isLoading={false} onClick={() => router.back()} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-gray-700' />
              {(pane === 'completed' && !isAlreadySubmitted) ? <ButtonPrimary title='RETURN' onClick={() => setOrderReturn({active: true, type: 'order', orderData: order})} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-red-600' /> : null}
              {order.ApprovalStatus === 'Y' || order.OrderStatus === 'CANCELLED' ? null : <ButtonPrimary title='CANCEL' onClick={() => cancelOrder(order.BillId)} isLoading={loading} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-red-600' />}
          </View>
        </>}
      </ScrollView>
      <MyModal modalActive={orderReturn.active} name='ORDER_RETURN' child={<OrderReturn order={orderReturn} setOrderReturn={setOrderReturn} orderS={orderS} />} />
    </>
  );
};


export default OrderStatus;