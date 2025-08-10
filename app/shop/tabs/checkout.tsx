import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Entypo, Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary, { LinkBtn } from '@/src/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { CartCard } from '@/src/components/utils';

const Checkout = () => {

  const location = useSelector((i: RootState) => i.appData.location);
  const user = useSelector((i: RootState) => i.user);
  const cart = useSelector((i: RootState) => i.cart);
  const cartItems = Object.values(cart);           

  const cartItemsValueList = cartItems.map(item => item.count * item.SRate);                    
  const cartSubtotal = cartItemsValueList.reduce((total, num) => total + num, 0).toFixed(2);           

  const cartItemsMRPList = cartItems.map(item => item.count * item.ItemMRP);                    
  const grossTotal = cartItemsMRPList.reduce((total, num) => total + num, 0).toFixed(2);  
  
  const cartItemsDiscountList = cartItems.map(item => ((item.ItemMRP * item.DiscountPer) / 100) * item.count);                  
  const discountTotal = cartItemsDiscountList.reduce((total, num) => total + num, 0).toFixed(2);  

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
              <Text className="text-base font-medium text-black">{user.Name}</Text>
              <TouchableOpacity onPress={() => {}} className="">
                <FontAwesome name="pencil" size={20} color={colors.blue[500]} />
              </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-3  mb-1">
            <FontAwesome6 name="phone-volume" size={12} color={colors.orange[500]} />
            <Text className="text-gray-600">{user.RegMob1}</Text>
          </View>
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Address Details</Text>
      <View className='bg-white rounded-3xl px-4 py-2 shadow-sm border-b border-gray-200'>
          <View className='justify-between flex-row px-1 py-[0.9rem] items-start gap-4'>
              <View className='flex-row items-center gap-3'>
                  <Text className="text-slate-600 font-bold text-[12px] items-center leading-5">Address :</Text>
              </View>
              <Text className="text-slate-700 text-[12px] ml-auto leading-5 flex-1 text-right">{user.Address2}, {user.Address}, {user.City}, {user.StateName}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-y border-gray-100'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">Pin Code :</Text>
              <Text className="text-[12px] text-slate-700">{user.Pin}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem]'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">{user.Email ? 'E-mail' : 'Phone Number'} :</Text>
              <Text className="text-[12px] text-slate-700">{user.Email ? user.Email : user.RegMob1}</Text>
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
                <Text className="text-base font-medium text-black">{location.LocationName}</Text>
            </View>
            <View className="flex-row items-center gap-3  mb-1">
              <Text numberOfLines={1} className="text-gray-600 text-sm">{location.Address}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Your Order List</Text>
      <View className='gap-3'>
        {cartItems.map((item) => (<CartCard data={item} key={item.LocationItemId} />))}
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
            <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Service Charge</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">+ 58.88</Text>
            </View>
            <View className='flex-row gap-3 px-5 py-4'>
                <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Payable Amount</Text>
                <Text className="font-PoppinsSemibold text-[13px] text-slate-700">₹ {cartSubtotal}</Text>
            </View>
        </View>
        <View className="bg-indigo-500 rounded-2xl p-5 mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-indigo-400 rounded-full items-center justify-center mr-4"> 
              <Feather name="upload" size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-white mb-2">Please Attach your prescription.</Text>
              <Text className="text-sm text-gray-100">In order to place your order.</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="chevron-right" size={23} color="white" />
          </TouchableOpacity>
        </View>
        <View className="">
            <View className="flex-row justify-between items-center mt-2 mb-4">
                <Text className="text-md text-gray-600 font-semibold">Grand Total</Text>
                <Text className="text-2xl font-bold text-sky-800">₹ {cartSubtotal}</Text>
            </View>
            {/* <ButtonPrimary title='PLACE ORDER' isLoading={false} active={true} classes='flex-1 !rounded-2xl !bg-gray-700' /> */}
            <LinkBtn href={'/shop/tabs/orders'} title='VIEW ORDERS' isLoading={false} active={true} classes='flex-1 !rounded-2xl !bg-gray-700' />
        </View>
    </ScrollView>
  );
};

export default Checkout;