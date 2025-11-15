import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ShoppingCart, ChevronDown } from "lucide-react-native";
import { B2BCartCard } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { setModal } from '@/src/store/slices/slices';
import { filterUnique, NoContent, num } from '@/src/components/utils';
import { useRouter } from 'expo-router';

export default function B2BCart() {
  
  const cart = useSelector((i: RootState) => i.cart);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const dispatch = useDispatch();
  const cartList = Object.values(cart);
  const router = useRouter()   
  const [collapseIndex, setCollapseIndex] = useState([]);                                  

  const handleCheckout = () => {
    if (!isLoggedIn) {
      dispatch(setModal({name: 'LOGIN', state: true}))
    } else {
      router.push('/shop/checkout')
    }
  }

  const uniqueLocations = filterUnique(cartList, 'LocationId');
  const cartArrayLength = cartList.length;                   

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center gap-2">
          <ShoppingCart size={20} color="#4B5563" />
          <Text className="text-base font-medium text-gray-700">Your Cart</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="text-base font-medium text-gray-700">{cartArrayLength} Items</Text>
        </View>
      </View>

      {!cartArrayLength ? <NoContent label={'Your Cart is Empty'} containerClass={'mb-0'} /> : 
        <>
          {
            uniqueLocations.map((i: any, n: number) => (
              <>  
                <View className="" key={i.LocationItemId}>
                  <TouchableOpacity className="w-full bg-cyan-500 px-4 py-3 flex-row items-center justify-between" onPress={() => {
                    setCollapseIndex((pre: any) => {
                      if (pre.includes(n)) {
                        return pre.filter((a: number) => a !== n)
                      }
                      return [...pre, n];
                    })
                  }}>
                    <Text className="text-white text-sm font-semibold leading-5">Distributor</Text>
                    <View className="flex-1 flex-row justify-end gap-2">
                      <Text className="text-white text-sm font-semibold leading-5">{i.LocationName}</Text>
                      <ChevronDown size={20} color="white" style={{ transform: [{ rotate: !collapseIndex.includes(n) ? "0deg" : "-90deg" }] }} />
                    </View>
                  </TouchableOpacity>

                  {!collapseIndex.includes(n) && (
                    <View className="bg-white">
                      
                      {(() => {
                          let cartItems = cartList.filter(x => x.LocationId === i.LocationId)

                          const cartItemsValueList = cartItems.map(item => item.count * item.PTR);                      
                          const cartSubtotal = num(cartItemsValueList.reduce((total, num) => total + num, 0));    
                          
                          const cartItemsMRPValueList = cartItems.map(item => item.count * item.ItemMRP);                      
                          const cartMRPtotal = num(cartItemsMRPValueList.reduce((total, num) => total + num, 0)); 

                          const cartItemsDiscount = cartItems.map(item => ((item.PTR * item.count) * (item.DiscountPer / 100 )));                      
                          const cartDiscount = num(cartItemsDiscount.reduce((total, num) => total + num, 0)); 

                          const cartItemsGSTValueList = cartItems.map(i => {
                            let taxbleAmt = num((i.count * i.PTR)- ((i.count * i.PTR) * (i.DiscountPer / 100 )));
                            let cgst = num(taxbleAmt * (i.CGSTRATE / 100));
                            let sgst = num(taxbleAmt * (i.SGSTRATE / 100));
                            return num(sgst + cgst);
                          }); 
                                          
                          const cartGSTtotal = num(cartItemsGSTValueList.reduce((total, num) => total + num, 0));  
                          const grandTotal = num(cartSubtotal - cartDiscount + cartGSTtotal); 

                          return (
                            <>
                              {cartItems.map((i, n): any => <B2BCartCard data={i} key={n}/>)}
                              <View className="bg-white p-4">
                                <View className="flex-row justify-between py-2">
                                  <Text className="text-gray-700">Total MRP</Text>
                                  <Text className="text-gray-800 font-medium">{cartMRPtotal}</Text>
                                </View>

                                <View className="flex-row justify-between py-2">
                                  <Text className="text-blue-600 font-medium">Total PTR</Text>
                                  <Text className="text-blue-600 font-bold">{cartSubtotal}</Text>
                                </View>

                                <View className="flex-row justify-between py-2">
                                  <Text className="text-gray-700">Distributor Discount</Text>
                                  <Text className="text-gray-800 font-medium">- {cartDiscount}</Text>
                                </View>

                                <View className="flex-row justify-between py-2">
                                  <Text className="text-gray-700">Total GST</Text>
                                  <Text className="text-gray-800 font-medium">+ {cartGSTtotal}</Text>
                                </View>

                                <View className="flex-row justify-between border-t border-gray-300 mt-2 py-3">
                                  <Text className="text-gray-900 font-bold text-base">Order value*</Text>
                                  <Text className="text-gray-900 font-bold text-base">₹ {grandTotal}</Text>
                                </View>
                                <View className="bg-white border-t border-gray-300 pt-4">
                                  <TouchableOpacity onPress={() => router.push(`/shop/checkout?LOCID=${i.LocationId}`)} className="w-full bg-gray-700 py-4 rounded">
                                    <Text className="text-white text-center text-base font-bold tracking-wide">Checkout</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </>
                          )
                      })()}
                    </View>
                  )}
                </View>
              </>
            ))
          }
        </>
      }
    </ScrollView>
  );
}


// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Pressable } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import colors from 'tailwindcss/colors';
// import ButtonPrimary, { LinkBtn } from '@/src/components';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/src/store/store';
// import { addToCart, dumpCart, removeFromCart, setModal } from '@/src/store/slices/slices';
// import { CartCard, NoContent } from '@/src/components/utils';
// import { useRouter } from 'expo-router';

// const Cart = () => {
//   const cart = useSelector((i: RootState) => i.cart);
//   const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
//   const dispatch = useDispatch();
//   const cartItems = Object.values(cart);
//   const router = useRouter()              

//   const cartItemsValueList = cartItems.map(item => item.count * item.SRate);                    
//   const cartSubtotal = cartItemsValueList.reduce((total, num) => total + num, 0).toFixed(2);           

//   const cartItemsMRPList = cartItems.map(item => item.count * item.ItemMRP);                    
//   const grossTotal = cartItemsMRPList.reduce((total, num) => total + num, 0).toFixed(2);  
  
//   const cartItemsDiscountList = cartItems.map(item => ((item.ItemMRP * item.DiscountPer) / 100) * item.count);                  
//   const discountTotal = cartItemsDiscountList.reduce((total, num) => total + num, 0).toFixed(2);  

//   const handleCheckout = () => {
//     if (!isLoggedIn) {
//       dispatch(setModal({name: 'LOGIN', state: true}))
//     } else {
//       router.push('/shop/checkout')
//     }
//   }

//   return (
//     <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
//       <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
//         <TouchableOpacity onPress={() => router.push('/shop/tabs/home')} className="flex-row items-center">
//           <Ionicons name="chevron-back" size={24} color="#000" className="mr-2" />
//           <Text className="text-lg font-semibold text-black">My Cart</Text>
//         </TouchableOpacity>
//       </View>
//       {cartItems.length ? <>
//         <View className='gap-3'>
//           {cartItems.map((data) => <CartCard data={data} key={data.LocationItemId} />)}
//         </View>
//         <View className='bg-white rounded-3xl shadow-sm my-4 border-b border-gray-200'>
//             <View className='justify-between flex-row px-5 py-4 items-center'>
//                 <View className='flex-row items-center gap-3'>
//                     <Text className="font-PoppinsSemibold text-gray-500 text-[13px] items-center leading-5">Gross Amount</Text>
//                 </View>
//                 <Text className="font-PoppinsSemibold text-slate-700 text-[13px] ml-auto leading-5">{grossTotal}</Text>
//             </View>
//             <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
//                 <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Less Discount</Text>
//                 <Text className="font-PoppinsSemibold text-[13px] text-slate-700">- {discountTotal}</Text>
//             </View>
//             <View className='flex-row gap-3 px-5 py-4'>
//                 <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Payable Amount</Text>
//                 <Text className="font-PoppinsSemibold text-[13px] text-slate-700">₹ {cartSubtotal}</Text>
//             </View>
//         </View>
//         <View className="">
//           <View className="flex-row justify-between items-center mt-2 mb-4">
//               <Text className="font-semibold text-md text-gray-600">Grand Total :</Text>
//               <Text className="text-2xl font-bold text-sky-800">₹ {cartSubtotal}</Text>
//           </View>
//           <ButtonPrimary onClick={handleCheckout} title='CHECKOUT' active={true} classes='flex-1 !rounded-2xl !bg-gray-700' />
//         </View>
//       </> : <NoContent label='Your Cart is Empty' containerClass='flex-1' imgClass='h-[200px] mb-5'/>}
//     </ScrollView>
//   );
// };

// export default Cart;