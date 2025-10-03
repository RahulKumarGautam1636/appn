import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, Platform, FlatList } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { CatCard, escape, getFallbackImg, getFrom, GridLoader, ProductCard, windowWidth } from '@/src/components/utils';
import { Link, router } from 'expo-router';
import { setModal } from '@/src/store/slices/slices';
import colors from 'tailwindcss/colors';
import { Pressable } from 'react-native-gesture-handler';
import { BASE_URL, TAKEHOME_AGRO, TAKEHOME_PHARMA, TAKEHOME_SURGICAL } from '@/src/constants';

const web = Platform.OS === 'web';

const ShoppingAppScreen = () => {
  
  const { products: productsData, categories: categoriesData } = useSelector((i: RootState) => i.siteData);
  const user = useSelector((i: RootState) => i.user);
  const location = useSelector((i: RootState) => i.appData.location);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const dispatch = useDispatch();
  const company = useSelector((state: RootState) => state.company.info);

  useEffect(() => {
    if (location.LocationId) return;
    setTimeout(() => {
      dispatch(setModal({ name: 'LOCATIONS', state: true }))
    }, 1000);
  }, [location.LocationId])

  const [showLastOrder, setShowLastOrder] = useState(true);

  return (
    <ScrollView className="flex-1 bg-purple-50">   
      <View className="bg-purple-100 pt-5 pb-5 px-5">
      {isLoggedIn ? 
          <View className="gap-3 flex-row items-center mb-5">
              <Image className='shadow-lg rounded-full' source={require('../../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
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
          <View className="gap-3 flex-row items-center mb-5">
              <Image className='rounded-lg' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${company.LogoUrl}` }} resizeMode='contain' style={{ width: 40, height: 40 }} />
              <View className='mr-auto'>
                  {/* <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Healthify</Text>
                  <Text className="font-Poppins text-gray-600 text-[11px]">Healthcare at it's best.</Text> */}
                <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">TakeHome</Text>
                <Text className="font-Poppins text-gray-600 text-[11px]">Simplifying Your Searches</Text>
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
        {/* <View className="flex-row justify-around py-4 bg-white rounded-2xl">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="gift" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Garments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center mb-2">
              <Feather name="percent" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Surgicals</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="play" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Electronics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-red-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="shopping-bag" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Grocery</Text>
          </TouchableOpacity>
          
        </View> */}
      </View>
      {isLoggedIn && showLastOrder ? <View className='px-5 mt-3 mb-[-0.5rem]'>
        <LastOrder locationId={location.LocationId} handleShow={setShowLastOrder} isLoggedIn={isLoggedIn} userPartyCode={user.PartyCode} />
      </View> : null}
      <View className='pt-5 pb-5'>
        <View className="flex-row justify-between items-center mb-4 px-5">
          <Text className="text-lg font-bold text-gray-800">Featured Categories</Text>
          <Link href={'/shop/tabs/categories'}>
            <Text className="text-purple-600 font-medium">See All</Text>
          </Link>
        </View>
        <CategoriesSlider categoriesData={categoriesData} />
      </View>
      {/* <TouchableOpacity onPress={() => dispatch(setModal({name: 'PRESC', state: true}))} className="bg-purple-600 rounded-2xl mx-5 p-5 mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-purple-400 rounded-full items-center justify-center mr-4">
            <Feather name="upload" size={20} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-white mb-2">Upload your prescription.</Text>
            <Text className="text-sm text-gray-100">Get medicines delivered your doorstep.</Text>
          </View>
        </View>
        <View>
          <Feather name="chevron-right" size={23} color="white" />
        </View>
      </TouchableOpacity> */}
      <View className="mb-2">
        <View className="flex-row justify-between items-center mb-4 px-5 ">
          <Text className="text-lg font-bold text-gray-800">Top Brands</Text>
          <Link href={`/shop/brands`}>
            <Text className="text-purple-600 font-medium">See All</Text>
          </Link>
        </View>
        {/* <View className="flex-row flex-wrap justify-between">
          {brandLogos.map((brand, index) => (
            <TouchableOpacity key={index} className="items-center mb-4" style={{width: '18%'}}>
              <View className="w-14 h-14 bg-white rounded-full items-center justify-center mb-2 shadow-sm">
                <MaterialIcons 
                  name={brand.icon} 
                  size={24} 
                  color={brand.color || '#374151'} 
                />
              </View>
              <Text className="text-xs text-gray-600 text-center">{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
        <BrandsSlider productsData={productsData} />    
      </View>
      <ProductSection mainCategories={categoriesData.LinkCategoryList} productsData={productsData} />
    </ScrollView>
  );
};

export default ShoppingAppScreen;

// const CategoryButton = ({ title, isSelected, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} className={`px-4 py-[0.7rem] rounded-2xl border transition-colors ${ isSelected ? 'bg-blue-500 border-blue-600 ' : 'bg-white border-gray-200' }`}>
//     <Text className={`text-[0.95rem] font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>{title}</Text>
//   </TouchableOpacity>
// );

const CategoriesSlider = memo(({ categoriesData }: any) => {
  if (categoriesData.loading) {
    return <GridLoader classes='h-[118px] w-[138px] rounded-xl' containerClass='flex-row gap-3 m-4' />;
  } else if (categoriesData.error) {
    return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{categoriesData.error}</Text>;
  } else {
    return (
      <ScrollView contentContainerClassName="flex-row justify-between gap-3 px-5 py-1" horizontal showsHorizontalScrollIndicator={false}>
        {categoriesData.LinkCategoryList.map((i: any, n: number) => (<CatCard data={i} key={n} />))}
      </ScrollView>
    )
  }
})

const urlSource = {
  [TAKEHOME_PHARMA]: 'pharma',
  [TAKEHOME_AGRO]: 'agro',
  [TAKEHOME_SURGICAL]: 'snj'
}

const BrandsSlider = memo(({ productsData }: any) => {
  const compCode = useSelector((i: RootState) => i.compCode);
  if (productsData.loading) {
      return <GridLoader classes='h-[100px] w-[100px] !rounded-full' containerClass='flex-row gap-3 mx-5 mb-3' />;
  } else if (productsData.error) {
      return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{productsData.error}</Text>;
  } else {
    return (
      <ScrollView contentContainerClassName="flex-row gap-3 px-5 " horizontal showsHorizontalScrollIndicator={false}>
        {productsData.ItemBrandList?.slice(0, 50).map((brand, index) => (
          // <CategoryButton key={index} title={brand.Text} isSelected={false} onPress={() => {}}/>
          <Link href={`/shop/filters/?head=${escape(brand.Text).swap}&brands=${brand.Text}`} key={index} >
            <View className="items-center justify-center">
            <View className="bg-white rounded-full items-center justify-center mb-3 border-b-2 border-gray-200 p-4">
              <MyImage srcLink={`https://${urlSource[compCode]}.takehome.live/assets/img/ePharma/brands-logo/${brand.Text.trim()}.png`} resizeMode='contain' style={{ width: 75, height: 75 }} />
              {/* <Image className='' resizeMode='contain' source={{uri: `https://${urlSource[compCode]}.takehome.live/assets/img/ePharma/brands-logo/${brand.Text.trim()}.png`}} style={{ width: 75, height: 75 }} /> */}
            </View>
            <Text className="text-sm text-gray-600 text-center">{brand.Text.slice(0, 18)}</Text>
            </View>
          </Link>
        ))}
      </ScrollView>
    )
  }
})

const MyImage = (props: any) => {
  const [error, setError] = useState(false);
  return (
    <Image { ...props } onError={() => setError(true)} source={error ? {uri: getFallbackImg()} : {uri: props?.srcLink}} />
  )
}

const ProductSection = memo(({ mainCategories, productsData }: any) => {
  const deviceWidth = web ? document.documentElement.clientWidth : windowWidth;
  const renderProductSection = useCallback((data: any, parentId: number) => {
    const productCategoryItems = data.itemMasterCollection.filter((i: any) => i.Category === parentId).slice(0, 8);   
    const parentCategoryName = mainCategories.filter((i: any) => i.Parent === parentId)[0]?.ParentDesc;
      // console.log('Category section rerendered.');
    // const subLinks = categoriesData.LinkSubCategoryList.filter((i: any) => parentId === i.Parent);
    if (data.loading) {
      return <GridLoader classes='h-[45px] w-[100px] rounded-xl' containerClass='flex-row gap-3 m-5' />;
    } else if (data.error) {
      return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold">{data.error}</Text>;
    } else if (!productCategoryItems.length) {
      return;
    } else {
      return (
        <View>
          <View className="flex-row justify-between items-center pt-4 pb-3 px-5">
            <Text className="text-lg font-bold text-gray-800">{parentCategoryName}</Text>
            <Link href={`/shop/filters/?head=${escape(parentCategoryName).swap}&catVal=${parentId}`}>
              <Text className="text-purple-600 font-medium">See All</Text>
            </Link>
          </View> 
          <View>
            <FlatList
              data={productCategoryItems.slice(0.3)}
              keyExtractor={(item) => item.LocationItemId.toString()}
              className=""
              contentContainerClassName="flex-row"
              scrollEnabled={true}
              horizontal
              renderItem={({item}: any) => (<ProductCard parent='Home' data={item} width={deviceWidth / 2} />)}
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
  }, [mainCategories, productsData])

  return (
    <FlatList
        data={mainCategories}
        renderItem={({ item }) =>  (
          <View>
            {renderProductSection(productsData, parseInt(item.Parent))}
          </View>
        )}
        keyExtractor={(item) => item.Parent.toString()}
        className=""
        contentContainerClassName=""
        scrollEnabled={false}
    />
  )
})



const LastOrder = memo(({ locationId, userPartyCode, isLoggedIn, handleShow }: any) => {
  
    const [myOrderData, setMyOrderData] = useState({ loading: false, data: { OrderList: [] }, err: { status: false, msg: '' } });
    const compCode = useSelector((i: RootState) => i.compCode);  
  
    const getMyOrders = useCallback(async (partyCode: string, locationId: string) => {
        if (!partyCode) return alert('An Error Occured. Error Code 006');
        const res = await getFrom(`${BASE_URL}/api/Pharma/GetOrderList?CID=${compCode}&PID=${partyCode}&Type=${'active'}&LOCID=${locationId}`, {}, setMyOrderData);
        if (res) {
            setMyOrderData(res);
        } else {
            console.log('No data received');
        }
    }, [])                                                           
  
    useEffect(() => {
        if (!isLoggedIn) return;
        getMyOrders(userPartyCode, locationId);
    }, [compCode, getMyOrders, isLoggedIn, userPartyCode, locationId])
  
    const renderTabs = (data: any) => {
        if (data.loading) {
            return null; 
        } else if (data.err.status) {
            return null; 
        } else if (data.data.OrderList.length === 0) {
            return null;
        } else {
            return data.data.OrderList.slice(0,1).map(order => {
                return (
                  <TouchableOpacity onPress={() => router.push(`/shop/orderDetails/${order.BillId}?pane=${'active'}`)} className='w-full'>
                    <View className='flex justify-between items-center flex-row'>
                      <Text className="font-PoppinsSemibold text-gray-800 text-[16px] leading-[23px] mt-2">Your Last Order</Text>
                      <Pressable onPress={() => handleShow(false)}>
                        <Text className="text-purple-600 font-medium">Close</Text>
                      </Pressable>
                    </View>
                    <View className='bg-blue-500 rounded-3xl p-5 my-3'>
                      <View className='flex-row'>
                        <Image className='shadow-lg rounded-full me-3' source={require('../../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
                        <View className='flex-1'>
                            <Text className="font-PoppinsBold text-white text-[14px]" numberOfLines={1}>{order.CashPartyName}</Text>
                            <Text className="font-Poppins text-gray-200 text-[11px] items-center"><FontAwesome6 name="phone-volume" size={12} color="white" />  {order.CashPartyMobile}</Text>
                        </View>
                        <View className="bg-blue-400 py-[11px] px-[13px] rounded-full shadow-lg ms-auto">
                            <FontAwesome name="arrow-right" size={20} color='#fff' />
                        </View>
                      </View>
                      <View className='p-4 bg-blue-400 mt-4 rounded-2xl flex gap-3 flex-row'>
                        <FontAwesome5 name="rupee-sign" size={15} color="#fff" />
                        <Text className="font-Poppins text-gray-100 text-[13px] leading-5 me-auto">{parseFloat(order.Amount).toFixed(2)}</Text>
                        <FontAwesome5 name="calendar-alt" size={15} color="#fff" />
                        <Text className="font-Poppins text-gray-100 text-[13px] leading-5">{new Date(order.VchDate).toLocaleDateString('en-TT')}</Text>
                      </View>
                      <View className='flex-row gap-2 mt-3'>
                        <Text className="font-semibold text-gray-200 text-[11px] whitespace-nowrap">Address : </Text>
                        <Text className="font-Poppins text-gray-200 text-[11px] flex-wrap flex-1">{order.PartyAddress}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
            })
        }
    }
    return renderTabs(myOrderData);
})