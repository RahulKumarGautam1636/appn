import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, Platform, FlatList } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { CatCard, escape, getFallbackImg, getFrom, GridLoader, ProductCard, switchSegment, windowWidth } from '@/src/components/utils';
import { Link, router } from 'expo-router';
import { setModal } from '@/src/store/slices/slices';
import colors from 'tailwindcss/colors';
import { Pressable } from 'react-native-gesture-handler';
import { BASE_URL, TAKEHOME_AGRO, TAKEHOME_ELECTRONICS, TAKEHOME_GARMENTS, TAKEHOME_PHARMA, TAKEHOME_SURGICAL } from '@/src/constants';
import { getRequiredFields } from '@/src/components/utils/shared';

const web = Platform.OS === 'web';

const Home = () => {
  
  const { categories: categoriesData } = useSelector((i: RootState) => i.siteData);
  const user = useSelector((i: RootState) => i.user);
  const location = useSelector((i: RootState) => i.appData.location);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const compCode = useSelector((i: RootState) => i.compCode);
  const dispatch = useDispatch();
  const company = useSelector((state: RootState) => state.company.info);


  useEffect(() => {
    if (location.LocationId) return;
    setTimeout(() => {
      dispatch(setModal({ name: 'LOCATIONS', state: true }))
    }, 1000);
  }, [location.LocationId])

  const [showLastOrder, setShowLastOrder] = useState(true);

  // --------------------------------------------------------------------------- b2b work

  const [products, setProducts] = useState({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}}); 
  const [searchTerm, setSearchTerm] = useState({query: 'forte', filterTerm: 'All', filterId: ''});

  useEffect(() => {
      let controller = new AbortController();
      const getSearchResult = async (companyCode: string, key, signal) => {                      
          if (!companyCode) return alert('no companyCode received');                  
          const res = await getFrom(`${BASE_URL}/api/item/Get?CID=${companyCode}&SearchStr=${key.query}&LOCID=${location.LocationId}`, {}, setProducts, signal);
          if (res) {                                                                    
              let requiredFields = getRequiredFields(res.data.itemMasterCollection);
              setProducts(pre => ({ ...pre, loading: false, data: {itemMasterCollection: requiredFields }}));
          } else {
              console.log('No data received');
          }
      }  

      const timer = setTimeout(() => {
          if (searchTerm.query.length === 0) return setProducts({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
          getSearchResult(compCode, searchTerm, controller.signal);  
      }, 1000);

      return () => {
          clearTimeout(timer);
          controller.abort();
      };
  }, [searchTerm, compCode, location.LocationId])
  // ---------------------------------------------------------------------------

  return (
    <ScrollView className="flex-1 bg-purple-50">   
      <View className="bg-purple-100 p-4">
      {isLoggedIn ? 
          <View className="gap-3 flex-row items-center mb-4">
              <Image className='rounded-full' source={require('@/assets/images/user.png')} style={{ width: 40, height: 40 }} />
              <View>
                  <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">{user.Name}</Text>
                  <Text className="font-Poppins text-gray-600 text-[11px]">{(user.UserType).toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}, {user.GenderDesc}, {user.Age} Years</Text>
              </View>
              <View className="flex-row ml-auto">
                <Link href={'/shop/tabs/profile'} className="mr-4">
                  <Feather name="bell" size={24} color="#2563eb" />
                </Link>
                <Link href={'/shop/tabs/orders'}>
                  <Feather name="gift" size={24} color="#2563eb" />
                </Link>
              </View>
          </View> :
          <View className="gap-3 flex-row items-center mb-4">
              <Image className='rounded-lg' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${company.LogoUrl}` }} resizeMode='contain' style={{ width: 40, height: 40 }} />
              <View className='mr-auto'>
                  {/* <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Healthify</Text>
                  <Text className="font-Poppins text-gray-600 text-[11px]">Healthcare at it's best.</Text> */}
                <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">{company.COMPNAME}</Text>
                <Text className="font-PoppinsMedium text-gray-600 text-[11px]">{company.CATCHLINE || 'Shopping made easy.'}</Text>
              </View>
              <Link href={'/login'}>
                  <View className="gap-2 flex-row items-center bg-white p-2 rounded-full shadow-lg">
                      <Ionicons name="enter" size={25} color='#3b82f6' className='text-blue-500' />
                      <Text className='font-PoppinsMedium leading-5 text-slate-700'>Login </Text>
                  </View>
              </Link>
          </View>
        }
        <Pressable onPress={() => router.push('/shop/search')}>
          <View className="bg-white rounded-2xl px-4 py-[0.42rem] flex-row items-center mb-2 pointer-events-none">
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput placeholder="Search..." readOnly className="flex-1 ml-3 text-gray-700" placeholderTextColor="#9CA3AF" />
            <Feather name="sliders" size={20} color="#9CA3AF" />
          </View>
        </Pressable>
        <View className='flex-row justify-between items-center gap-12'>  
          {/*mb-3*/}
          <Text className='text-[12px] text-gray-600 font-medium mr-3'>Service provider : </Text>
          <TouchableOpacity onPress={() => dispatch(setModal({ name: 'LOCATIONS', state: true }))} className='flex-row justify-end gap-2 items-center flex-1'>
            <FontAwesome6 name="location-pin" size={12} color={colors.purple[600]} />
            <Text className="text-gray-700 text-[12px]" numberOfLines={1}>{location.LocationId ? location.LocationName : 'Please select a service provider.'}</Text>
            <Ionicons name="caret-down" size={20} color={colors.orange[500]} />
          </TouchableOpacity>
        </View>
      </View>
      {/* {isLoggedIn && location.LocationId && showLastOrder ? <View className='px-4 mt-3 mb-[-0.5rem]'>
        <LastOrder locationId={location.LocationId} compCode={compCode} handleShow={setShowLastOrder} isLoggedIn={isLoggedIn} userPartyCode={user.PartyCode} />
      </View> : null} */}
      <View className='pt-4 pb-4'>
        <View className="flex-row justify-between items-center mb-3 px-4">
          <Text className="text-[16px] font-bold text-gray-800">Featured Categories</Text>
          <Link href={'/shop/tabs/categories'}>
            <Text className="text-purple-600 font-medium">See All</Text>
          </Link>
        </View>
        <CategoriesSlider categoriesData={categoriesData} />
      </View>
      <ProductSection mainCategories={categoriesData.LinkCategoryList} productsData={products} />
    </ScrollView>
  );
};

export default Home;

const CategoriesSlider = memo(({ categoriesData }: any) => {
  if (categoriesData.loading) {
    return <GridLoader classes='h-[118px] w-[138px] rounded-xl' containerClass='flex-row gap-3 m-4' />;
  } else if (categoriesData.error) {
    return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{categoriesData.error}</Text>;
  } else {
    return (
      <ScrollView contentContainerClassName="flex-row justify-between gap-3 px-4 py-1" horizontal showsHorizontalScrollIndicator={false}>
        {categoriesData.LinkCategoryList.map((i: any, n: number) => (<CatCard data={i} key={n} />))}
      </ScrollView>
    )
  }
})

const ProductSection = memo(({ productsData }: any) => {

  if (productsData.loading) {
      return <GridLoader classes='h-[45px] w-[100px] rounded-xl' containerClass='flex-row gap-3 m-4' />;
    } else if (productsData.error) {
      return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold">{productsData.error}</Text>;
    } else if (!productsData.data.itemMasterCollection.length) {
      return;
    } else {
      return (
      <View>
        <View>
          <FlatList
            data={productsData.data.itemMasterCollection.slice(0, 50)}
            keyExtractor={(item) => item.LocationItemId.toString()}
            className=""
            contentContainerClassName="flex-col flex-1"
            scrollEnabled={true}
            horizontal
            renderItem={({item}: any) => (<ProductCard parent='Home' type='list' data={item} />)}
          />
          <View className='flex-row justify-center gap-4 py-3 bg-white'>
            <View className='h-2 w-2 bg-gray-500 rounded-full'></View>
            <View className='h-2 w-2 bg-gray-300 rounded-full'></View>
            <View className='h-2 w-2 bg-gray-300 rounded-full'></View>
          </View>
        </View>
      </View>
    )
  }
})





// const LastOrder = memo(({ locationId, compCode, userPartyCode, isLoggedIn, handleShow }: any) => {
  
//     const [myOrderData, setMyOrderData] = useState({ loading: false, data: { OrderList: [] }, err: { status: false, msg: '' } });   
    
//     const getMyOrders = useCallback(async (companyId: string, partyCode: string, locationId: string) => {
//         if (!partyCode || !locationId) return console.log('An Error Occured. Error Code 006');
//         const res = await getFrom(`${BASE_URL}/api/Pharma/GetOrderList?CID=${companyId}&PID=${partyCode}&Type=${'active'}&LOCID=${locationId}`, {}, setMyOrderData);
//         if (res) {
//             setMyOrderData(res);
//         } else {
//             console.log('No data received');
//         }
//     }, [])                                 

//     useEffect(() => {
//       if (!isLoggedIn) return;
//       getMyOrders(compCode, userPartyCode, locationId);
//     }, [compCode, getMyOrders, isLoggedIn, userPartyCode, locationId])
  
//     const renderTabs = (data: any) => {
//         if (data.loading) {
//             return null; 
//         } else if (data.err.status) {
//             return null; 
//         } else if (data.data.OrderList.length === 0) {
//             return null;
//         } else {
//             return data.data.OrderList.slice(0,1).map(order => {
//                 return (
//                   <TouchableOpacity onPress={() => router.push(`/shop/orderDetails/${order.BillId}?pane=${'active'}`)} className='w-full'>
//                     <View className='flex justify-between items-center flex-row'>
//                       <Text className="text-[16px] font-bold text-gray-800">Your Last Order</Text>
//                       <Pressable onPress={() => handleShow(false)}>
//                         <Text className="text-purple-600 font-medium">Close</Text>
//                       </Pressable>
//                     </View>
//                     <View className='bg-blue-500 rounded-3xl p-5 my-3'>
//                       <View className='flex-row'>
//                         <Image className='shadow-lg rounded-full me-3' source={require('@/assets/images/user.png')} style={{ width: 40, height: 40 }} />
//                         <View className='flex-1'>
//                             <Text className="font-PoppinsBold text-white text-[14px]" numberOfLines={1}>{order.CashPartyName}</Text>
//                             <Text className="font-Poppins text-gray-200 text-[11px] items-center"><FontAwesome6 name="phone-volume" size={12} color="white" />  {order.CashPartyMobile}</Text>
//                         </View>
//                         <View className="bg-blue-400 py-[11px] px-[13px] rounded-full shadow-lg ms-auto">
//                             <FontAwesome name="arrow-right" size={20} color='#fff' />
//                         </View>
//                       </View>
//                       <View className='p-4 bg-blue-400 mt-4 rounded-2xl flex gap-3 flex-row'>
//                         <FontAwesome5 name="rupee-sign" size={15} color="#fff" />
//                         <Text className="font-Poppins text-gray-100 text-[13px] leading-5 me-auto">{parseFloat(order.Amount).toFixed(2)}</Text>
//                         <FontAwesome5 name="calendar-alt" size={15} color="#fff" />
//                         <Text className="font-Poppins text-gray-100 text-[13px] leading-5">{new Date(order.VchDate).toLocaleDateString('en-TT')}</Text>
//                       </View>
//                       <View className='flex-row gap-2 mt-3'>
//                         <Text className="font-semibold text-gray-200 text-[11px] whitespace-nowrap">Address : </Text>
//                         <Text className="font-Poppins text-gray-200 text-[11px] flex-wrap flex-1">{order.PartyAddress}</Text>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 )
//             })
//         }
//     }
//     return renderTabs(myOrderData);
// })