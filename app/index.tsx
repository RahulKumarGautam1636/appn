import { Link, Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';
import { TouchableOpacity } from 'react-native';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { TAKEHOME_AGRO, TAKEHOME_PHARMA, TAKEHOME_SURGICAL } from '@/src/constants';
import { dumpCart, resetSiteProducts, setCompCode, setLocation, setLogin, setModal, setPrescription, setUser } from '@/src/store/slices/slices';


// import '@formatjs/intl-getcanonicallocales/polyfill';
// import '@formatjs/intl-locale/polyfill';
// import '@formatjs/intl-datetimeformat/polyfill';
// import '@formatjs/intl-datetimeformat/locale-data/en';    // base English
// import '@formatjs/intl-datetimeformat/locale-data/en-TT'; // Trinidad & Tobago

export default function App() {

  const router = useRouter();
  // console.log(new Date("0001-01-01T00:00:00").toLocaleDateString('en-TT'));
  

  const { vType, status, error } = useSelector((i: RootState) => i.company)
  const dispatch = useDispatch();
 
  // useEffect(() => {
  //   if (vType === 'ErpHospital') {
  //     router.push('/appn/tabs/opd')
  //   }
  // }, [vType])

  const handleSelect = (comanyCode: string) => {
    dispatch(setCompCode(comanyCode))
    dispatch(setLocation({ LocationId: 0 }));

    dispatch(setLogin(false));   
    dispatch(setUser({}))
    dispatch(dumpCart())
    // dispatch(resetSiteProducts())
    dispatch(setPrescription({ required: false }))

    router.push('./shop/tabs/home')
  }

  if (status === 'loading') {
    return <View><Text>Loading..</Text></View>
  } else if (error) {
    return <View><Text>An Error Occured.</Text></View>
  } else if (status === 'succeeded') {
    if (vType === 'ErpPharma' || vType === 'agro' || vType === 'ErpManufacturing') {
      return (
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <SafeAreaView className="flex-1">
              {/* <Init /> */}
              
              <ScrollView contentContainerClassName='bg-slate-100 min-h-full relative'>
              {/* <View className="relative gap-4 flex-row items-center justify-center py-[6rem]">
                  <Image source={require('../assets/images/login-bg.png')} className="absolute inset-0 w-full" resizeMode="cover" />
                  <Image className='' source={require('../assets/images/logo.png')} style={{ width: 75, height: 65 }} />
                  <View>
                      <Text className="font-Poppins text-gray-600 text-[13px]">Healthcare at it's best.</Text>
                      <Text className="font-Poppins text-gray-600 text-[13px]">Simplifying Your Searches</Text>
                  </View>
              </View> */}
              <Link href={'/login'} className='absolute top-3 right-3 z-40'>
                  <View className="gap-2 flex-row items-center bg-white p-2 rounded-full shadow-sm">
                      <Ionicons name="enter" size={25} color='#3b82f6' className='text-blue-500' />
                      <Text className='font-PoppinsMedium leading-5 text-slate-700'>Login </Text>
                  </View>
              </Link>
              <View className="relative gap-4 items-center justify-center py-[2rem] bg-white">
                <Image className='' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/752.jpeg` }} style={{ width: 200, height: 190 }} />    
                {/* <Image className='' source={require('../assets/images/logo.png')} style={{ width: 200, height: 190 }} />    TAKEHOME */}
                {/* <View className='items-center'>
                    <Text className="font-GlittherSyavinafree text-blue-800 text-[48px] mb-2 leading-[42px]">TakeHome</Text>
                    <Text className="font-Poppins text-gray-600 text-[13px]">Simplifying Your Searches</Text>
                </View> */}
              </View>
              <View className='flex-1 px-4 py-5 bg-slate-100'>
                {/* <Image source={require('../assets/images/login-bg.png')} className="absolute inset-0 w-full" resizeMode="contain" /> */}
                {/* <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-3xl font-bold text-gray-800">Our Services</Text>
                </View> */}
                <View className="gap-4">
                  {/* <TouchableOpacity onPress={() => handleSelect('KHLqDFK8CUUxe1p1EotU3g==')} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                    <View className="flex-row items-center">
                      <View className="bg-red-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                        <FontAwesome6 name="capsules" size={33} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-xl mb-2">Book Medicine</Text>
                        <Text className="text-green-600 text-lg font-semibold">Active</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={30} color='gray' />
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => handleSelect(TAKEHOME_PHARMA)} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                    <View className="flex-row items-center">
                      <View className="bg-red-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                        <FontAwesome6 name="capsules" size={33} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-xl mb-2">Book Medicine</Text>
                        <Text className="text-green-600 text-lg font-semibold">Active</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={30} color='gray' />
                  </TouchableOpacity>
                  {/* onPress={() => router.push('./appn/tabs/opd')} */}
                  {/* <TouchableOpacity onPress={() => router.push('./appn/tabs/opd')} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                    <View className="flex-row items-center">
                      <View className="bg-blue-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                        <FontAwesome6 name="user-doctor" size={33} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-xl mb-2">Book Appointments</Text>
                        <Text className="text-gray-400 text-lg">1 hour 30 mins</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={30} color='gray' />
                  </TouchableOpacity> */}
                  
                  <TouchableOpacity onPress={() => handleSelect(TAKEHOME_AGRO)} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                    <View className="flex-row items-center">
                      <View className="bg-yellow-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                        <FontAwesome6 name="carrot" size={33} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-xl mb-2">Agro & Groceries</Text>
                        <Text className="text-green-500 text-lg font-semibold">Active</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={30} color='gray' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelect(TAKEHOME_SURGICAL)} className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                    <View className="flex-row items-center">
                      <View className="bg-blue-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                        <FontAwesome6 name="user-doctor" size={33} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-xl mb-2">Surgicals</Text>
                        <Text className="text-green-500 text-lg font-semibold">Active</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={30} color='gray' />
                  </TouchableOpacity>
                  {/* <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 p-5 rounded-xl">
                    <View className="flex-row items-center">
                      <View className="bg-teal-500 w-[4.8rem] h-[4.8rem] rounded-2xl items-center justify-center mr-4">
                        <FontAwesome6 name="shirt" size={33} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-xl mb-2">Garments & Fashion</Text>
                        <Text className="text-rose-500 text-lg font-semibold">Coming soon..</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={30} color='gray' />
                  </TouchableOpacity> */}
                </View>
              </View>
              </ScrollView>
            </SafeAreaView>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      );
    } 
    else if (vType === 'ErpHospital') {
      return <Redirect href="/appn/tabs/opd" />;
    }
    else {
      return <View className='flex-1 items-center justify-center bg-gray-200'><Text className='text-xl'>ROOT PAGE</Text></View>;
    }
  } else {
    return <View className='flex-1 items-center justify-center bg-gray-200'><Text className='text-xl'>ROOT PAGE ERROR</Text></View>;
  }
}


// import { Pressable } from 'react-native';
// import { router } from 'expo-router';
// import { ChevronRight, Menu, Search, ShoppingCart } from 'lucide-react-native';


// export default function App() {

//   const user = useSelector((i: RootState) => i.user);
//   const location = useSelector((i: RootState) => i.appData.location);
//   const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
//   const dispatch = useDispatch();
//   const company = useSelector((state: RootState) => state.company.info);

//   return (
//     <ScrollView className="flex-1 bg-purple-50">   
//       <View className="bg-purple-100 p-3 !pb-2">
//       {isLoggedIn ? 
//           <View className="gap-3 flex-row items-center mb-5">
//               <Image className='shadow-lg rounded-full' source={require('../assets/images/user.png')} style={{ width: 40, height: 40 }} />
//               <View>
//                   <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">{user.Name}</Text>
//                   <Text className="font-Poppins text-gray-600 text-[11px]">{(user.UserType).toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}, {user.GenderDesc}, {user.Age} Years</Text>
//               </View>
//               <View className="flex-row ml-auto">
//                 <Link href={'/shop/tabs/profile'} className="mr-4">
//                   <Feather name="bell" size={24} color="#2563eb" />
//                 </Link>
//                 <Link href={'/shop/tabs/orders'}>
//                   <Feather name="gift" size={24} color="#2563eb" />
//                 </Link>
//               </View>
//           </View> :
//           <View className="gap-3 flex-row items-center mb-5">
//               <Image className='rounded-lg' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${company.LogoUrl}` }} resizeMode='contain' style={{ width: 40, height: 40 }} />
//               <View className='mr-auto'>
//                   {/* <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Healthify</Text>
//                   <Text className="font-Poppins text-gray-600 text-[11px]">Healthcare at it's best.</Text> */}
//                 <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">TakeHome</Text>
//                 <Text className="font-Poppins text-gray-600 text-[11px]">Simplifying Your Searches</Text>
//               </View>
//               <Link href={'/login'}>
//                   <View className="gap-2 flex-row items-center bg-white p-2 rounded-full shadow-lg">
//                       <Ionicons name="enter" size={25} color='#3b82f6' className='text-blue-500' />
//                       <Text className='font-PoppinsMedium leading-5 text-slate-700'>Login </Text>
//                   </View>
//               </Link>
//           </View>
//         }
//         <Pressable onPress={() => router.push('/shop/search')}>
//           <View className="bg-white rounded-2xl px-4 py-[0.42rem] flex-row items-center mb-2 pointer-events-none">
//             <Feather name="search" size={20} color="#9CA3AF" />
//             <TextInput placeholder="Search..." readOnly className="flex-1 ml-3 text-gray-700" placeholderTextColor="#9CA3AF" />
//             <Feather name="sliders" size={20} color="#9CA3AF" />
//           </View>
//         </Pressable>
//       </View>
//       <NewPage />
//     </ScrollView>
//   )
// }


// function NewPage() {
//   const [activeTab, setActiveTab] = useState('home');

//   // Sample data
//   const categories = [
//     { id: 1, name: 'Mobiles', icon: '📱' },
//     { id: 2, name: 'Fashion', icon: '👕' },
//     { id: 3, name: 'Home & Kitchen', icon: '🏠' },
//     { id: 4, name: 'Beauty', icon: '💄' },
//     { id: 5, name: 'Sports', icon: '⚽' },
//     { id: 6, name: 'Electronics', icon: '🎧' },
//     { id: 7, name: 'Books', icon: '📚' },
//     { id: 8, name: 'Toys', icon: '🎮' },
//   ];

//   const topDeals = [
//     { id: 1, title: 'Wireless Headphones', discount: '40% OFF', price: '₹999', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop' },
//     { id: 2, title: 'Smart Watch', discount: '30% OFF', price: '₹2999', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop' },
//     { id: 3, title: 'Phone Case', discount: '50% OFF', price: '₹299', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop' },
//   ];

//   const trendingProducts = [
//     { id: 1, name: 'Summer Collection', discount: 'Up to 60% OFF', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
//     { id: 2, name: 'Tech Deals', discount: 'Up to 50% OFF', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop' },
//     { id: 3, name: 'New or Used Vehicles', discount: 'Starting ₹299', image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&h=200&fit=crop' },
//   ];

//   const featuredBrands = [
//     { id: 1, name: 'Brand1', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop' },
//     { id: 2, name: 'Brand2', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop' },
//     { id: 3, name: 'Brand3', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=80&h=80&fit=crop' },
//     { id: 4, name: 'Brand4', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop' },
//     { id: 5, name: 'Brand6', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop' },
//     { id: 6, name: 'Brand5', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop' },
//   ];

//   const specialOffers = [
//     { id: 1, title: 'Laptops', discount: 'Up to 45% OFF', price: 'Starting ₹7,999', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
//     { id: 2, title: 'Tablets', discount: 'Starting ₹7,999', price: '', image: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGFibGV0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
//     { id: 3, title: 'Mobiles', discount: 'Starting ₹8,999', price: '', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
//   ];

//   const CategoryItem = ({ item }) => (
//     <TouchableOpacity className="items-center mr-4">
//       <View className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center mb-2">
//         <Text className="text-2xl">{item.icon}</Text>
//       </View>
//       <Text className="text-xs text-center font-medium">{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const DealCard = ({ item }) => (
//     <View className="bg-white rounded-lg overflow-hidden mr-3 shadow-sm" style={{ width: 140 }}>
//       <Image
//         source={{ uri: item.image }}
//         className="w-full h-32 bg-gray-300"
//       />
//       <View className="p-2">
//         <Text className="text-xs font-bold text-red-600 mb-1">{item.discount}</Text>
//         <Text className="text-xs font-semibold">{item.title}</Text>
//         <Text className="text-lg font-bold text-gray-800 mt-1">{item.price}</Text>
//       </View>
//     </View>
//   );

//   const TrendingCard = ({ item }) => (
//     <View className="bg-white rounded-lg overflow-hidden mr-3 shadow-sm" style={{ width: 180 }}>
//       <Image
//         source={{ uri: item.image }}
//         className="w-full h-32 bg-gray-300"
//       />
//       <View className="p-3">
//         <Text className="font-semibold text-sm mb-1">{item.name}</Text>
//         <Text className="text-xs font-bold text-red-600">{item.discount}</Text>
//       </View>
//     </View>
//   );

//   const BrandItem = ({ item }) => (
//     <TouchableOpacity className="items-center mr-3">
//       <Image
//         source={{ uri: item.image }}
//         className="w-16 h-16 rounded-full bg-gray-200"
//       />
//       <Text className="text-xs text-center mt-1 font-medium">{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const SpecialOfferCard = ({ item }) => (
//     <View className="bg-white rounded-lg overflow-hidden mr-3 shadow-sm" style={{ width: 160 }}>
//       <Image
//         source={{ uri: item.image }}
//         className="w-full h-24 bg-gray-300"
//       />
//       <View className="p-2">
//         <Text className="font-semibold text-sm">{item.title}</Text>
//         <Text className="text-xs font-bold text-red-600 mt-1">{item.discount}</Text>
//         {item.price && <Text className="text-xs text-gray-600">{item.price}</Text>}
//       </View>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       {/* <View className="bg-white px-4 pt-3 pb-3 border-b border-gray-200">
//         <View className="flex-row items-center justify-between mb-3">
//           <TouchableOpacity>
//             <Menu size={24} color="#000" />
//           </TouchableOpacity>
//           <Text className="text-lg font-bold text-blue-600">ShopHub</Text>
//           <TouchableOpacity>
//             <ShoppingCart size={24} color="#000" />
//           </TouchableOpacity>
//         </View>
//         <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
//           <Search size={18} color="#666" />
//           <Text className="flex-1 ml-2 text-gray-500 text-sm">Search products...</Text>
//         </View>
//       </View> */}

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Top Banner */}
//         <View className="bg-purple-600 mx-3 mt-3 rounded-lg overflow-hidden items-center justify-center">
//           <Image source={{ uri: 'https://res.cloudinary.com/dmse11kmn/image/upload/Shopify/mainBanners/main-6.jpg' }} className="w-full h-32" />
//           {/* <Text className="text-white text-lg font-bold">FLASH SALE 70% OFF</Text>
//           <Text className="text-white text-xs mt-1">Limited Time Offer</Text> */}
//         </View>

//         {/* Category Bar */}
//         <View className="mt-4 px-4">
//           <View className="flex-row justify-between items-center mb-3">
//             <Text className="text-lg font-bold">Categories</Text>
//             <TouchableOpacity>
//               <Text className="text-blue-600 text-sm font-semibold">View All</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {categories.map(cat => (
//               <CategoryItem key={cat.id} item={cat} />
//             ))}
//           </ScrollView>
//         </View>

//          <DealsCards />

//         {/* Men's Wear Banner */}
//         <View className="bg-gray-700 mx-4 mt-4 rounded-xl overflow-hidden h-28 items-center justify-center">
//           <Image source={{ uri: 'https://res.cloudinary.com/dmse11kmn/image/upload/Shopify/mainBanners/main-9.jpg' }} className="w-full h-32" />
//         </View>

//         {/* Specialist Stores */}
//         <View className="mt-4 px-4">
//           <Text className="text-lg font-bold mb-3">Specialist Stores</Text>
//           <View className="flex-row flex-wrap" style={{columnGap: '4%'}}>
//             {['Pharma', 'Insurance', 'Gifting', 'Diwali'].map((store, idx) => (
//               <TouchableOpacity key={idx} className="min-w-[48%] bg-white rounded-lg p-3 items-center justify-center border border-gray-200 mb-3">
//                 <Text className="text-sm font-semibold text-center">{store}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Top Deals on Tech */}
//         <View className="mt-2 px-4">
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-lg font-bold">Top Deals on Tech</Text>
//             <TouchableOpacity>
//               <Text className="text-blue-600 text-sm font-semibold">See more</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView horizontal contentContainerClassName='py-1' showsHorizontalScrollIndicator={false}>
//             {topDeals.map(deal => (
//               <DealCard key={deal.id} item={deal} />
//             ))}
//           </ScrollView>
//         </View>

//         {/* Featured Brands */}
//         <View className="mt-3 px-4">
//           <View className="flex-row justify-between items-center mb-3">
//             <Text className="text-lg font-bold">Featured Brands</Text>
//             <TouchableOpacity>
//               <Text className="text-blue-600 text-sm font-semibold">View all</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {featuredBrands.map(brand => (
//               <BrandItem key={brand.id} item={brand} />
//             ))}
//           </ScrollView>
//         </View>

//         {/* Trending Today */}
//         <View className="mt-4 px-4">
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-lg font-bold">Trending Today</Text>
//             <TouchableOpacity>
//               <Text className="text-blue-600 text-sm font-semibold">View all</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView horizontal contentContainerClassName='py-1' showsHorizontalScrollIndicator={false}>
//             {trendingProducts.map(product => (
//               <TrendingCard key={product.id} item={product} />
//             ))}
//           </ScrollView>
//         </View>

//         {/* Special Offers */}
//         <View className="mt-3 px-4 mb-3">
//           <Text className="text-lg font-bold mb-2">Special Offers</Text>
//           <ScrollView contentContainerClassName='py-1' horizontal showsHorizontalScrollIndicator={false}>
//             {specialOffers.map(offer => (
//               <SpecialOfferCard key={offer.id} item={offer} />
//             ))}
//           </ScrollView>
//         </View>

//         {/* Newsletter Banner */}
//         <View className="bg-blue-600 mx-4 rounded-lg p-4 mb-4 items-center">
//           <Text className="text-white font-bold">Get 10% OFF</Text>
//           <Text className="text-white text-xs mt-1">Subscribe to our newsletter</Text>
//           <TouchableOpacity className="bg-white rounded-lg px-4 py-2 mt-3">
//             <Text className="text-blue-600 font-semibold text-sm">Subscribe Now</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </View>
//   );
// };


// const DealsCards = () => {
//   const techDeals = [
//     {
//       id: 1,
//       title: 'Poco X7 5G',
//       price: 'From ₹13,999',
//       image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
//     },
//     {
//       id: 2,
//       title: 'Refrigerators',
//       price: 'From ₹8,999*',
//       image: 'https://media.istockphoto.com/id/525125897/photo/home-appliances-set-of-household-kitchen-technics.webp?a=1&b=1&s=612x612&w=0&k=20&c=FVBwYuBp4rOmppG957Y1OGQlLfz2o7jKKitGcNVNc8Q=',
//     },
//     {
//       id: 3,
//       title: 'Chromebook',
//       price: 'Starts ₹7,999*',
//       image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop',
//     },
//   ];

//   const fashionDeals = [
//     {
//       id: 1,
//       title: "Men's Sports Shoes",
//       discount: 'Min. 70% OFF',
//       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
//     },
//     {
//       id: 2,
//       title: 'Wrist Watches',
//       discount: 'Min. 90% OFF',
//       image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&h=200&fit=crop',
//     },
//     {
//       id: 3,
//       title: "Men's Slippers & Flip Flops",
//       discount: 'Min. 70% OFF',
//       image: 'https://images.unsplash.com/photo-1603218183500-7e1d62c3c679?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNsaXBwZXJzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500',
//     },
//     {
//       id: 4,
//       title: "Women's Flats",
//       discount: 'Min. 50% OFF',
//       image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop',
//     },
//   ];

//   const TechDealCard = ({ item }) => (
//     <View className="flex-1 bg-white rounded-lg overflow-hidden mr-2 items-center justify-center">
//       <Image
//         source={{ uri: item.image }}
//         className="w-full h-24 bg-gray-300"
//       />
//       <View className="w-full p-2 items-center">
//         <Text className="text-xs font-semibold text-center">{item.title}</Text>
//         <Text className="text-xs font-bold text-gray-700 mt-1">{item.price}</Text>
//       </View>
//     </View>
//   );

//   const FashionDealItem = ({ item }) => (
//     <View className="flex-1 bg-white rounded-lg overflow-hidden">
//       <Image
//         source={{ uri: item.image }}
//         className="w-full h-28 bg-gray-300"
//       />
//       <View className="p-2">
//         <Text className="text-xs font-semibold">{item.title}</Text>
//         <Text className="text-xs font-bold text-red-600 mt-1">{item.discount}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View className="bg-gray-50">
//       {/* Top Deals on Tech */}
//       <View className="bg-rose-500 mx-4 mt-4 rounded-xl overflow-hidden p-4 shadow-lg">
//         <View className="flex-row justify-between items-center mb-4">
//           <Text className="text-white font-bold text-base">Top deals on Tech</Text>
//           <View className="bg-yellow-300 px-2 py-1 rounded flex-row items-center">
//             <Text className="text-xs font-bold text-red-600">BIG BANG DEALS</Text>
//             <TouchableOpacity>
//               <ChevronRight size={18} color="red" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View className="flex-row gap-2">
//           {techDeals.map(deal => (
//             <TechDealCard key={deal.id} item={deal} />
//           ))}
//         </View>
//       </View>

//       {/* Fashion's Top Deals */}
//       <View className="bg-teal-600 mx-4 mt-4 rounded-xl overflow-hidden p-4 shadow-lg">
//         <View className="flex-row justify-between items-center mb-4">
//           <Text className="text-white font-bold text-base">Fashion's Top Deals</Text>
//           <TouchableOpacity className="flex-row items-center">
//             <Text className="text-sm mr-1 font-bold text-white">VIEW ALL</Text>
//             <ChevronRight size={20} color="white" />
//           </TouchableOpacity>
//         </View>

//         <View className="flex-row flex-wrap gap-3">
//           {fashionDeals.map(deal => (
//             <View key={deal.id} className="flex-1 min-w-[calc(50%-6px)]">
//               <FashionDealItem item={deal} />
//             </View>
//           ))}
//         </View>
//       </View>
//     </View>
//   );
// };

