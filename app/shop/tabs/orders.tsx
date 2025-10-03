import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary from '@/src/components';
import { getFrom, GridLoader, NoContent, OrderCard } from '@/src/components/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL } from '@/src/constants';
import { useRouter } from 'expo-router';

const Orders = () => {

  const initTab = 'active';
  const [tabActive, setTabActive] = useState(initTab);
  const router = useRouter();

  const [orders, setOrders] = useState({ loading: false, data: { OrderList: [] }, err: { status: false, msg: '' } });
  // const [returnActive, setReturnActive] = useState(false);
  // const [orderReturn, setOrderReturn] = useState({ type: '', orderData: {} });

  const compCode = useSelector((i: RootState) => i.compCode);
  const user = useSelector((i: RootState) => i.user);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  // const { userRegType } = useSelector((i: RootState) => i.appData);
  // const b2bMode = userRegType.CodeValue === 'Retailer';
  // const [invoice, setInvoice] = useState({ id: '', isActive: false });

  const getMyOrders = useCallback(async (partyCode, locId) => {
      const res = await getFrom(`${BASE_URL}/api/Pharma/GetOrderList?CID=${compCode}&PID=${partyCode}&Type=${tabActive}&LOCID=${locId}`, {}, setOrders);
      if (res) {
        setOrders(res);
      } else {
        console.log('No data received');
      }
  }, [tabActive])                                                               // Adding tabActive as dependency will call getMyOrders whenever tabActive is changed with current tab name.

  useEffect(() => {
      if (!isLoggedIn) return;
      getMyOrders(user.PartyCode, locationId);
  }, [compCode, getMyOrders, isLoggedIn, user.PartyCode, locationId])

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100 p-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">Your Orders</Text>
        </TouchableOpacity>
      </View>
      <View className='bg-white'>
          <View className='flex-row justify-between border-y border-gray-200 border-solid p-4 bg-white gap-2'>
              <TouchableOpacity className={`items-center flex-1 py-3 rounded-lg ${tabActive === 'active' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setTabActive('active')}>
                  <Text className={`font-PoppinsMedium ${tabActive === 'active' ? 'text-white' : ''}`}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`items-center flex-1 py-3 rounded-lg ${tabActive === 'completed' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setTabActive('completed')}>
                  <Text className={`font-PoppinsMedium ${tabActive === 'completed' ? 'text-white' : ''}`}>Completed</Text>                        
              </TouchableOpacity>
              <TouchableOpacity className={`items-center flex-1 py-3 rounded-lg ${tabActive === 'cancelled' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setTabActive('cancelled')}>
                  <Text className={`font-PoppinsMedium ${tabActive === 'cancelled' ? 'text-white' : ''}`}>Cancelled</Text>
              </TouchableOpacity>
          </View>
      </View>
      <View className='p-4'>
        <View className='gap-3'>
          {(() => {
            if (orders.loading) {
              return <GridLoader />;
            } else if (orders.err.status) {
              return null;
            } else if (!orders.data.OrderList.length) {
              return <NoContent label='No Orders Found' containerClass='pt-8' imgClass='h-[200px] mb-5'/>;
            } else {
              return orders.data.OrderList.map(order => <OrderCard data={order} tab={tabActive} key={order.BillId} />)
            }
          })()}
        </View>
      </View>
      </ScrollView>
  );
};

export default Orders;
