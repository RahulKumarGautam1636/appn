import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ShoppingCart, ChevronDown, ArrowLeft } from "lucide-react-native";
import { B2BProductCompareCard } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { setModal } from '@/src/store/slices/slices';
import { filterUnique, getFrom, NoContent, num } from '@/src/components/utils';
import { useRouter } from 'expo-router';
import { BASE_URL } from "@/src/constants";
import colors from "tailwindcss/colors";
import { getRequiredFields } from "@/src/components/utils/shared";

// export default function B2BCart() {
  
//   const cart = useSelector((i: RootState) => i.cart);
//   const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
//   const dispatch = useDispatch();
//   const cartList = Object.values(cart);
//   const router = useRouter()   
//   const [collapseIndex, setCollapseIndex] = useState([]);                                  

//   const handleCheckout = () => {
//     if (!isLoggedIn) {
//       dispatch(setModal({name: 'LOGIN', state: true}))
//     } else {
//       router.push('/shop/checkout')
//     }
//   }

//   const uniqueLocations = filterUnique(cartList, 'LocationId');
//   const cartArrayLength = cartList.length;                   

//   return (
//     <ScrollView className="flex-1 bg-gray-100">
//       <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
//         <View className="flex-row items-center gap-2">
//           <ShoppingCart size={20} color="#4B5563" />
//           <Text className="text-base font-medium text-gray-700">Your Cart</Text>
//         </View>

//         <View className="flex-row items-center gap-2">
//           <Text className="text-base font-medium text-gray-700">{cartArrayLength} Items</Text>
//         </View>
//       </View>

//       {!cartArrayLength ? <NoContent label='Your Cart is Empty' containerClass='flex-1 mt-20' imgClass='h-[200px] mb-5'/> : 
//         <>
//           {
//             uniqueLocations.map((i: any, n: number) => (
//               <View className="" key={i.LocationItemId}>
//                 <TouchableOpacity className="w-full bg-cyan-500 px-4 py-3 flex-row items-center justify-between" onPress={() => {
//                   setCollapseIndex((pre: any) => {
//                     if (pre.includes(n)) {
//                       return pre.filter((a: number) => a !== n)
//                     }
//                     return [...pre, n];
//                   })
//                 }}>
//                   <Text className="text-white text-sm font-semibold leading-5">Distributor</Text>
//                   <View className="flex-1 flex-row justify-end gap-2">
//                     <Text className="text-white text-sm font-semibold leading-5">{i.LocationName}</Text>
//                     <ChevronDown size={20} color="white" style={{ transform: [{ rotate: !collapseIndex.includes(n) ? "0deg" : "-90deg" }] }} />
//                   </View>
//                 </TouchableOpacity>

//                 {!collapseIndex.includes(n) && (
//                   <View className="bg-white">
                    
//                     {(() => {
//                         let cartItems = cartList.filter(x => x.LocationId === i.LocationId)

//                         const cartItemsValueList = cartItems.map(item => item.count * item.PTR);                      
//                         const cartSubtotal = num(cartItemsValueList.reduce((total, num) => total + num, 0));    
                        
//                         const cartItemsMRPValueList = cartItems.map(item => item.count * item.ItemMRP);                      
//                         const cartMRPtotal = num(cartItemsMRPValueList.reduce((total, num) => total + num, 0)); 

//                         const cartItemsDiscount = cartItems.map(item => ((item.PTR * item.count) * (item.DiscountPer / 100 )));                      
//                         const cartDiscount = num(cartItemsDiscount.reduce((total, num) => total + num, 0)); 

//                         const cartItemsGSTValueList = cartItems.map(i => {
//                           let taxbleAmt = num((i.count * i.PTR)- ((i.count * i.PTR) * (i.DiscountPer / 100 )));
//                           let cgst = num(taxbleAmt * (i.CGSTRATE / 100));
//                           let sgst = num(taxbleAmt * (i.SGSTRATE / 100));
//                           return num(sgst + cgst);
//                         }); 
                                        
//                         const cartGSTtotal = num(cartItemsGSTValueList.reduce((total, num) => total + num, 0));  
//                         const grandTotal = num(cartSubtotal - cartDiscount + cartGSTtotal); 

//                         return (
//                           <>
//                             {cartItems.map((i, n): any => <B2BCartCard data={i} key={n}/>)}
//                             <View className="bg-white p-4">
//                               <View className="flex-row justify-between py-2">
//                                 <Text className="text-gray-700">Total MRP</Text>
//                                 <Text className="text-gray-800 font-medium">{cartMRPtotal}</Text>
//                               </View>

//                               <View className="flex-row justify-between py-2">
//                                 <Text className="text-blue-600 font-medium">Total PTR</Text>
//                                 <Text className="text-blue-600 font-bold">{cartSubtotal}</Text>
//                               </View>

//                               <View className="flex-row justify-between py-2">
//                                 <Text className="text-gray-700">Distributor Discount</Text>
//                                 <Text className="text-gray-800 font-medium">- {cartDiscount}</Text>
//                               </View>

//                               <View className="flex-row justify-between py-2">
//                                 <Text className="text-gray-700">Total GST</Text>
//                                 <Text className="text-gray-800 font-medium">+ {cartGSTtotal}</Text>
//                               </View>

//                               <View className="flex-row justify-between border-t border-gray-300 mt-2 py-3">
//                                 <Text className="text-gray-900 font-bold text-base">Order value*</Text>
//                                 <Text className="text-gray-900 font-bold text-base">₹ {grandTotal}</Text>
//                               </View>
//                               <View className="bg-white border-t border-gray-300 pt-4">
//                                 <TouchableOpacity onPress={() => router.push(`/shop/checkout?LOCID=${i.LocationId}`)} className="w-full bg-gray-700 py-4 rounded">
//                                   <Text className="text-white text-center text-base font-bold tracking-wide">Checkout</Text>
//                                 </TouchableOpacity>
//                               </View>
//                             </View>
//                           </>
//                         )
//                     })()}
//                   </View>
//                 )}
//               </View>
//             ))
//           }
//         </>
//       }
//     </ScrollView>
//   );
// }



export default function CompareProducts({ handleClose, itemId }: any) {

    const [distributers, setDistributers] = useState({loading: true, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
    const businessTypeId = useSelector((i: RootState) => i.appData.businessType.CodeId); 
    const compCode = useSelector((i: RootState) => i.compCode); 
    const dispatch = useDispatch();

    useEffect(() => {
        const getServiceLocations = async (compId: string, itemId: string, bTypeId: string) => {
            if (!compId || !itemId || !bTypeId) return;
            const res = await getFrom(`${BASE_URL}/api/Item/GetItemsFromOtherLocation/?CID=${compId}&ItemId=${itemId}&BusinessTypeId=${bTypeId}`, {}, setDistributers);            // using useCallback to avoid esling warning about useEffect dependencies.
            if (res) {              
                // setDistributers(res);  
                const products = getRequiredFields(res.data.itemMasterCollection);
                setDistributers(({ ...res, data: {itemMasterCollection: products}}));    
            }
        }
        getServiceLocations(compCode, itemId, businessTypeId);
        // setTimeout(() => {
        //     setDistributers({loading: false, data: {products: items}, err: {status: false, msg: ''}});       
        // }, 1000);
    }, [compCode, itemId, businessTypeId])

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity onPress={() => dispatch(setModal({ name: 'COMPARE_PRODUCTS', state: false }))} className="flex-row items-center gap-2">
                    <ArrowLeft size={20} color={colors.pink[600]} />
                    <Text className="text-base font-medium text-gray-700">Compare Products</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-2">
                <Text className="text-base font-medium text-gray-700">Found {distributers.data.itemMasterCollection.length} Sellers</Text>
                </View>
            </View>
            {(() => {
                if (distributers.loading) {
                    return <Text className="text-2xl">Loading...</Text>;
                } else if (distributers.err.status) {
                    return <View><Text className="text-xl">An error occured, please try again later. Error code: <Text className='text-dark'>{distributers.err.msg}</Text></Text></View>;
                } else if (!distributers.data.itemMasterCollection.length) {
                    return <NoContent label='No Distributers Found.' containerClass='mt-20' imgClass='h-[200px] mb-5'/>;
                } else {
                    return distributers.data.itemMasterCollection.map((i: any, n: number) => <B2BProductCompareCard data={i} key={n}/>)
                }
            })()}
        </ScrollView>
    );
}