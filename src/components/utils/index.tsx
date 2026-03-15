import axios, { GenericAbortSignal } from "axios";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, Dimensions, Image, Text, ImageBackground, TouchableOpacity, Pressable, Linking, Alert, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from "react-native-reanimated-carousel";
import { addToCart, dumpCart, removeFromCart, setCompCode, setLocation, setLogin, setModal, setPrescription, setUser, setUserRegType } from "@/src/store/slices/slices";
import store, { RootState } from "@/src/store/store";
import { Link, useRouter } from "expo-router";
import { Feather, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import colors from "tailwindcss/colors";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FileText, Soup } from "lucide-react-native";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { BASE_URL, initReg, isLP, TAKEHOME_AGRO, TAKEHOME_ELECTRONICS, TAKEHOME_GARMENTS, TAKEHOME_PHARMA, TAKEHOME_SURGICAL } from "@/src/constants";
import * as SecureStore from 'expo-secure-store';

export const getFrom = async (queryUrl: any, params: any, setStateName: any, signal?: GenericAbortSignal) => {
  
  setStateName((preValue: any) => {
    return {...preValue, loading: true};
  })
  try {
    const res = await axios.get(queryUrl, { params: params, signal: signal });
    if (res.status === 200) {
      return {loading: false, data: res.data, err: {status: false, msg: ''}};
    } else if (res.status === 500) {
      setStateName((preValue: any) => {
        return {...preValue, loading: false, err: {status: true, msg: res.status}};
      })
      return false;
    }
  } catch (error: any) {
    console.log(error);
    if (error.code === 'ERR_CANCELED') return false;           // return early if request aborted to prevent loading: false.
    setStateName((preValue: any) => {
      return {...preValue, loading: false, err: {status: true, msg: error.message}};
    })
    return false;
  }
}


export const ListLoader = ({ classes='h-[91px]', count=4, containerClass='gap-3 mb-6' }) => {
  return (
    <View className={`flex flex-column justify-between overflow-hidden ${containerClass}`}>
      {Array.from(Array(count).keys()).map(i => (<View className={`${classes} w-full bg-gray-200`} key={i}></View>))}
      {/* <Text>Loading...</Text> */}
    </View>
  )
}

export const GridLoader = ({ classes='h-[120px] flex-1', count=6, containerClass='gap-3', style={} }) => {

  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <div className={`flex justify-between overflow-hidden ${containerClass}`}>
        <style>{`
          .skeleton-box {
            display: inline-block;
            /* height: 1em; */
            position: relative;
            overflow: hidden;
            background-color: #cbd5e1;
          }

          .skeleton-box::after {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              transform: translateX(-100%);
              background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
              -webkit-animation: shimmer 3s infinite;
              animation: shimmer 3s infinite;
              content: "";
          }

          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
        {Array.from(Array(count).keys()).map(i => (<div className={`${classes} skeleton-box`} key={i}></div>))}
      </div>
    )
  }

  return (
    <View className={`flex justify-between overflow-hidden ${containerClass}`}>
      {Array.from(Array(count).keys()).map(i => (<Animated.View className={`${classes} bg-gray-300`} key={i} style={[styles.skeleton, style, { opacity }]} />))}
    </View>
  )
}


const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 12
  },
});


export const NoContent = ({ label='No Items Found.', imgClass='h-[150]', textClass='text-gray-500 text-[16px] ', containerClass='pt-3 pb-5' }: any) => {
  return (
    <View className={`justify-center items-center ${containerClass}`}>
      <Image className={`max-w-full ${imgClass}`} source={require('@/assets/images/no_content.png')} resizeMode="contain" />
      <Text className={`font-PoppinsBold leading-[23px] mt-2 ${textClass}`}>{label}</Text>
    </View>
  )
}


export function withAutoUnmount(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const [isMounted, setIsMounted] = useState(true);

    useFocusEffect(
      useCallback(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
      }, [])
    );

    if (!isMounted) return null;

    return <Component {...props} />;
  };
}


const { width } = Dimensions.get("window");

const banners = [
  { id: 1, image: require("@/assets/images/banner-card-1.jpg") },
  { id: 2, image: require("@/assets/images/banner-card-2.jpg") },
  { id: 3, image: require("@/assets/images/banner-card-3.jpg") },
];

export const BannerCarousel = () => {
  return (
    <View className="mt-4">
      <Carousel
        loop
        width={width}
        height={178}
        autoPlay={true}
        data={banners}
        pagingEnabled={true}
        scrollAnimationDuration={2500}
        renderItem={({ item }) => {
          return <View className="px-4 justify-center items-center"><Image source={item.image} className="w-full h-[175px] rounded-xl border border-gray-300" /></View>
        }}
      />
    </View>
  );
}

export const num = (n: any) => n ? parseFloat(n.toFixed(2)) : 0;

export const createDate = (days: any, months: any, years: any) => {
  var date = new Date(); 
  date.setDate(date.getDate() - days);
  date.setMonth(date.getMonth() - months);
  date.setFullYear(date.getFullYear() - years);  
  return date.toLocaleDateString('en-TT');
  // return date.toISOString().substr(0, 10);    
}

export const getDuration = (date: any) => {

  // let [byears, bmonths, bdays] = date ? date.split('-') : new Date().toLocaleDateString('en-CA').split('-');
  // let [years, months, days] = new Date().toLocaleDateString('en-CA').split('-');
  let [bdays, bmonths, byears] = date ? date.split('/') : new Date().toLocaleDateString('en-TT').split('/');
  let [days, months, years] = new Date().toLocaleDateString('en-TT').split('/');
  
  var by = Number.parseFloat(byears),
      bm = Number.parseFloat(bmonths),
      bd = Number.parseFloat(bdays),
      ty = Number.parseFloat(years),
      tm = Number.parseFloat(months),
      td = Number.parseFloat(days);

  if (td < bd) {
    days = (td - bd + 30);
    tm = tm - 1;
  } else {
    days = (td - bd);
  }

  if (tm < bm) {
    months = (tm - bm + 12);
    ty = ty - 1;
  } else {
    months = (tm - bm)
  }
  years = (ty - by);
  return { 
    years: years ? years : 0,
    months: months ? months : 0,
    days: days ? days : 0 
  }
}

export const formatted = (date: string) => {
  if (!date) return;
  let formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long'
  }).format(new Date(date));
  return formattedDate;
}

export const GradientBG = ({ children, imgStyles={opacity: 0.8}, classes }: any) => {
  return (
    <ImageBackground
        imageStyle={imgStyles}
        source={require('@/assets/images/Glass-BG2.png')}
        resizeMode="cover"
        className={`flex-1 ${classes}`}
    >
      {children}
    </ImageBackground>
  )
}

export const add2Cart = (isAdded, data, computeWithPackSize, dispatch, count=1) => {
  if (data.Category === 24856) return alert('As Government Norms this Product is not to be sold Online - Contact with Service Provider for buying this product.');
  const state = store.getState();
  const location = state.appData.location;
  const locationId = location.LocationId;
  if (!locationId) return alert('Please choose a Location.');
  if (isAdded) return dispatch(removeFromCart(data.LocationItemId));
  dispatch(addToCart({...data, ...computeWithPackSize(), count: count})); 
  // let productToastData = { msg: 'Added to Cart', product: {name: data.Description, price: computeWithPackSize().SRate}, button: {text: 'Visit Cart', link: '/cartPage'} };
  // productToast(productToastData);
}

export const buyNow = (dispatch, data, router, computeWithPackSize, ) => {
  const state = store.getState();
  const locationId = state.appData.location.LocationId;
  if (!locationId) return alert('Please choose a Location.');
  dispatch(dumpCart());
  dispatch(addToCart({...data, ...computeWithPackSize(), count: 1})); 
  router.push('/checkout');
}

export const computeWithPackSize = (data, activePackSize, vType) => {      
  if (vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT') return data;
  if (!activePackSize) {
      return data;     // { ItemMRP: data.ItemMRP, SRate: data.SRate, StockQty: data.StockQty, DiscountPer: data.DiscountPer, PackSizeId: data.PackSizeId };
  } else {
    if (activePackSize.MRP) {
      return { ...data, ItemMRP: activePackSize.MRP, SRate: activePackSize.SRate, StockQty: activePackSize.StockQty, DiscountPer: activePackSize.MRPDisPer, PackSizeId: activePackSize.CodeId, PTR: activePackSize.PTR };  
    } else {
      return data;     // { ItemMRP: data.ItemMRP, SRate: data.SRate, StockQty: data.StockQty, DiscountPer: data.DiscountPer, PackSizeId: data.PackSizeId };
    }
  }
} 


export const ProductCard = ({ data, width='100%', type='grid', parent='' }) => {

  // const compCode = useSelector((i: RootState) => i.compCode);
  // const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  const vType = useSelector((i: RootState) => i.company.vType);
  const isAdded = useSelector((i: RootState) => Object.values(i.cart).some((x : any) => x.LocationItemId === data.LocationItemId));
  // const isAdded = Object.values(cart).find((i: any) => i.LocationItemId === data.LocationItemId)
  const isRestaurant = (vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT');
  const [activePackSize, setPackSize] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  // console.log(`Product card --------------------------- ${parent}`);

  useEffect(() => {
		const packSizeList = data.ItemPackSizeList;
		if (packSizeList && packSizeList?.length) {
			const firstSizeId = packSizeList[0];
			setPackSize(firstSizeId);
		} else {
			setPackSize('');
		}
	},[data])

  const handlePackSize = (i) => {
		if (i.CodeId === packSize().PackSizeId) return;
		setPackSize(i);
	}

  const packSize = () => {      
    return computeWithPackSize(data, activePackSize, vType);
  }

  const packSizeList = data.ItemPackSizeList?.map((i: any) => (
    <TouchableOpacity onPress={() => handlePackSize(i)} key={i.CodeId} className={`px-3 py-[0.4rem] shadow-sm rounded-xl mt-1 mr-1 ${i.CodeId === packSize().PackSizeId ? 'bg-blue-50' : 'bg-slate-100'}`} >
      <Text className={`text-[0.8rem] ${i.CodeId === packSize().PackSizeId ? 'text-blue-600' : 'text-gray-700'}`}>{i.Description}</Text>
    </TouchableOpacity>
  ));

  const handleAdd = (e: any) => {
    e.stopPropagation();
    add2Cart(isAdded, data, packSize, dispatch);
  }

  // const handleBuyNow = () => {
  //   buyNow(data, packSize, dispatch, router);
  // }

  if (isRestaurant) {
    return (
      <View className="flex-row items-center justify-between bg-white rounded-2xl p-3.5 shadow-sm">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-emerald-50 rounded-xl items-center justify-center mr-3 mb-auto border border-emerald-100">
            <Soup size={24} color={colors.emerald[600]} />
          </View>

          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-sm mb-1">{data.Description}</Text>
            
            <View className="flex-row items-center mb-1 gap-1">
              <Text className="text-red-600 font-bold text-sm">₹{packSize().SRate}</Text>
              <Text className="text-gray-400 line-through text-sm ml-2">₹{packSize().ItemMRP}</Text>
              {/* <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                <Text className="text-green-700 font-semibold text-xs">Save ₹10</Text>
              </View> */}
            </View>

            <View className="flex-row items-center mt-0.5">
              <View className="w-2 h-2 bg-gray-500 rounded-full mr-1.5" />
              <Text className="text-gray-600 text-xs font-medium">Canteen</Text>
            </View>
          </View>
        </View>

        <View className="items-end ml-3">
          {/* <View className="bg-orange-50 px-3 py-1 rounded-full mb-2">
            <Text className="text-orange-600 text-xs font-semibold">Canteen</Text>
          </View> */}

          <TouchableOpacity onPress={handleAdd} className="bg-gray-600 px-5 py-1.5 rounded-lg">
            <Text className="text-white font-bold text-sm">{isAdded ? 'Remove' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (type === 'grid') {
    return (
      <TouchableOpacity onPress={() => router.push(`/shop/product/${data.ItemId}`)} style={{width: width }}>
        <View className={`items-start bg-white p-3 border border-gray-100 w-full`}>
          <View className='items-center justify-center w-full p-2 rounded-xl border border-gray-100'>
            <Image className='' resizeMode='contain' source={{uri: data.ItemImageURL}} style={{ width: '100%', height: 140 }} />
          </View>
          <View className='flex-1 items-start mt-3 w-full'>
            <Text className="text-[1rem] font-semibold text-gray-900 mb-2">{data.Description.slice(0, 20)}</Text>
            <View className='flex-row gap-4'>
              <Text className="text-[0.92rem] font-semibold text-sky-600">₹ {packSize().SRate}</Text>
              <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">₹ {packSize().ItemMRP}</Text>
            </View>
            {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}

            <View className="flex-row w-full">
              <View className="flex-1">
                {packSize().StockQty ? <Text className="text-[0.85rem] font-semibold text-green-700 mb-1">In Stock</Text> : <Text className="text-[0.85rem] font-semibold text-orange-500 mb-1">Out of Stock</Text>}
                <View className='flex-row items-center flex-wrap mt-1'>
                  {packSizeList}
                </View>
              </View>
              <TouchableOpacity onPress={handleAdd} className='mt-auto ml-auto'>
                <Ionicons name={`cart${isAdded ? '' : '-outline'}`} size={22} color='#0ea5e9' />
              </TouchableOpacity>
            </View>

            {data.Category === 24856 ? <Text className="text-[0.75rem] font-semibold text-rose-700 mt-2">FOR SALE OVER COUNTER ONLY</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableOpacity onPress={() => router.push(`/shop/product/${data.ItemId}`)} style={{width: width }}>
        <View className={`flex-row items-start bg-white p-4 border border-gray-100 w-full gap-4`}>
          <View className='items-center justify-center p-3 rounded-xl bg-gray-100 border border-gray-100'>
            <Image className='shadow-sm' resizeMode='contain' source={{uri: data.ItemImageURL}} style={{ width: 90, height: 90 }} />
          </View>
          <View className='flex-1 items-start gap-[2px]'>
            <Text className="text-[1rem] font-semibold text-gray-900 mb-2">{data.Description.slice(0, 20)}</Text>
            <View className='flex-row gap-4'>
              <Text className="text-[0.92rem] font-semibold text-sky-600">₹ {packSize().SRate}</Text>
              <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">₹ {packSize().ItemMRP}</Text>
            </View>
            {packSize().StockQty ? 
            <Text className="text-[0.92rem] font-semibold text-green-700 mb-1">In Stock</Text>
            :
            <Text className="text-[0.92rem] font-semibold text-orange-500 mb-1">Out of Stock</Text>}
            {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}
            <View className='flex-row items-center w-full'>
              {packSizeList}
              <View className="flex-row gap-3 ml-auto">
                <TouchableOpacity onPress={handleAdd}>
                  <Ionicons name={`cart${isAdded ? '' : '-outline'}`} className='mt-2' size={22} color='#0ea5e9' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch(setModal({ name: 'COMPARE_PRODUCTS', state: true, data: { itemId: data.ItemId} }))}>
                  <FontAwesome6 name="arrow-right-arrow-left" className='mt-2' size={20} color={colors.orange[600]} />
                </TouchableOpacity>
              </View>
            </View>
            {data.Category === 24856 ? <Text className="text-[0.75rem] font-semibold text-rose-700 mt-2">FOR SALE OVER COUNTER ONLY</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export const escape = (str: string) => ({ swap: str.replace('&', '-'), unswap: str.replace('-', '&') });      // swap and unswap the & char with - to escape the url interference due to & character.

export const CatCard = ({ data, classes, styles }: any) => {
  return (
    // <Link href={`/shop/filters/?brands=Abbott India Limited,Alcon Laboratories(India) Pvt. Ltd.&catVal=23485,23501&head=Pharmacy&hideOutStock=Y&page=1&query=tab&sortBy=NameASC&subCatVal=`}>
    <Link href={`/shop/filters/?head=${escape(data.ParentDesc).swap}&catVal=${data.Parent}&page=1`} className={classes} style={styles}>
      <View className={`items-center bg-white rounded-xl shadow-sm border-b border-gray-200 overflow-hidden w-full`}>
        <Image className='' source={{uri: data.ImageURL}} style={{ width: 135, height: 100 }} resizeMode="contain" />
        <Text className="text-sm text-gray-600 border-t w-full text-center border-gray-100 p-2">{data.ParentDesc}</Text>
      </View>
    </Link>
  )
}

export const CartCard = ({ data, b2bMode=false }: any) => {
  const dispatch = useDispatch();
  const activeItem = data.ItemPackSizeList.find((i: any) => i.CodeId === data.PackSizeId);
  const activePackSize = activeItem ? activeItem.Description : 'N/A';
  return (
    <View key={data.LocationItemId} className="flex-row items-center bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200">
      <Image source={{ uri: data.ItemImageURL }} className="w-[5.5rem] h-[5.9rem] rounded-2xl border border-gray-100 mr-4" resizeMode="cover" />
      <View className="flex-1">
          <View className='justify-between flex-row mb-2'>
              <Text className="text-base font-medium text-sky-800 flex-1">{data.Description}</Text>
              <TouchableOpacity onPress={() => dispatch(removeFromCart(data.LocationItemId))} className="">
                  <Ionicons name="trash-outline" size={20} color={colors.rose[500]} />
              </TouchableOpacity>
          </View>
        
        <View className="flex-row items-center mb-3">
          {/* <ColorIndicator color={data.color} /> */}
          <Text className="text-sm text-gray-600 mr-3">₹ {b2bMode ? data.PTR : data.SRate}</Text>
          {/* {data.size && (
            <> */}
              <View className="w-1 h-1 bg-gray-400 rounded-full mr-3" />
              <Text className="text-sm text-gray-600">Pack : {activePackSize}</Text>
            {/* </>
          )} */}
        </View>
        
        <View className="flex-row items-center justify-between">
          {b2bMode ?  
          <Text className="text-lg font-semibold text-gray-700">₹ {num(data.PTR * data.count)}</Text>
          : 
          <Text className="text-lg font-semibold text-gray-700">₹ {num(data.SRate * data.count)}</Text>}
          
          <View className="flex-row items-center bg-gray-100 rounded-2xl">
            <TouchableOpacity onPress={() => {if (data.count !== 1) dispatch(addToCart({...data, count: data.count - 1}))}} className="w-9 h-9 items-center justify-center">
              <Ionicons name="remove" size={16} color="#666" />
            </TouchableOpacity>
            
            <Text className="mx-2 text-base font-medium text-black">{data.count}</Text>
            
            <TouchableOpacity onPress={() => dispatch(addToCart({...data, count: data.count + 1}))} className="w-9 h-9 items-center justify-center">
              <Ionicons name="add" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export const OrderItemCard = ({ data }: any) => {
  return (
    <View key={data.LocationItemId} className="flex-row items-center bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200">
      <Image source={{ uri: data.ItemImageURL }} className="w-[5.5rem] h-[5.9rem] rounded-2xl border border-gray-100 mr-4" resizeMode="cover" />
      <View className="flex-1">
          <View className='justify-between flex-row mb-2'>
              <Text className="text-base font-medium text-sky-800 flex-1">{data.Description}</Text>
              {/* <TouchableOpacity className="">
                  <Ionicons name="trash-outline" size={20} color={colors.rose[500]} />
              </TouchableOpacity> */}
          </View>
        
        <View className="flex-row items-center mb-3">
          {/* <ColorIndicator color={data.color} /> */}
          <Text className="text-sm text-gray-600 mr-3">₹ {num(data.Amount/data.BillQty)}</Text>
          {/* {data.size && (
            <> */}
              <View className="w-1 h-1 bg-gray-400 rounded-full mr-3" />
              <Text className="text-sm text-gray-600">Pack : {data.PackSizeId ? data.PackSizeDesc : 'No pack size'}</Text>
            {/* </>
          )} */}
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-700">₹ {num(data.Amount)}</Text>
          
          <View className="flex-row items-center bg-gray-100 rounded-2xl py-1">
            {/* <TouchableOpacity className="w-9 h-9 items-center justify-center">
              <Ionicons name="remove" size={16} color="#666" />
            </TouchableOpacity> */}
            
            <Text className="mx-2 text-sm font-medium text-black">QTY :</Text>
            <Text className="mx-2 text-base font-medium text-black">{data.BillQty}</Text>
            
            {/* <TouchableOpacity className="w-9 h-9 items-center justify-center">
              <Ionicons name="add" size={16} color="#666" />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  )
}

export const OrderCard = ({ data, tab }: any) => {

  return (
    <Link href={`/shop/orderDetails/${data.BillId}?pane=${tab}`} className="w-full">
      <View className="bg-white w-full rounded-2xl p-4 shadow-sm border-b border-gray-200">
        {/* Header with airline info and price */}
        <View className="flex-row justify-between items-center pb-4">
          <View className="flex-row items-center gap-3">
            <Feather name="gift" size={21} color={colors.purple[100]} className='bg-gray-600 p-[0.7rem] rounded-full' />
            <View>
              <Text className="text-gray-500 text-sm">ORDER ID</Text>
              <Text className="font-semibold text-[1.05rem] text-gray-800 mt-1">{data.VchNo}</Text>
            </View>
          </View>
          <Feather name="arrow-right" size={24} color={colors.slate[600]} />
        </View>
        <View className="flex-row items-center justify-between mb-4 py-4 px-5 bg-slate-100 rounded-2xl">
          <View className="items-center">
            <Text className="text-gray-500 font-medium text-[0.95rem]">Order Value</Text>
            <Text className="text-[1.1rem] font-semibold text-sky-700 mt-4">₹ {parseFloat(data.Amount).toFixed(2)}</Text>
          </View>
          {/* <Text className="font-semibold text-pink-600 mb-auto my-auto">{} Items</Text> */}
          <View className="items-center">
            <Text className="text-gray-500 font-medium text-[0.95rem]">Order Date</Text>
            <Text className="text-[1.05rem] font-semibold text-sky-700 mt-4">{data.VchDate.slice(0, 10).split('-').reverse().join('-')}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2 py-1">
          <Text className={`text-gray-600 text-[14px] font-semibold`}>Status : </Text>
          <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 mr-auto ${data.ApprovalStatus === 'Y' ? 'bg-green-50' : 'bg-sky-50'}`}>
              <Text className={`text-[13px] font-medium ${data.ApprovalStatus === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{data.ApprovalStatus === 'Y' ? 'Processed' : 'Order Placed'}</Text>
          </View>

          <Text className="text-gray-600 text-[14px] font-semibold">Service : </Text>
          <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 ${data.BillStatus === 'PENDING' ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <Text className={`text-[13px] font-medium ${data.BillStatus === 'PENDING' ? 'text-green-600' : 'text-yellow-600'}`}>{data.BillStatus === 'PENDING' ? 'Closed' : 'Done'}</Text>
          </View>
        </View>
      </View>
    </Link>
  );
};

export function FileUploader({ file, setFile, removeFile }: any) {
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera and Gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      const name = img.fileName || 'image.jpg';
      setFile({
        name: name,
        uri: img.uri,
        type: img.type || 'image/jpeg',
        fileType: 'image',
        extn: '.' + name.split('.').pop(),
      });
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled === false) {   
      const name = result.assets[0].name;
      setFile({
        name: name,
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || 'application/octet-stream',
        fileType: 'document',
        extn: '.' + name.split('.').pop(),
      });
    }
  };

  // const uploadFile = async () => {
  //   if (!file) {
  //     Alert.alert('No file selected');
  //     return;
  //   }
  //   setFile({ file: file });
  // };

  return (
    // <View style={styles2.container}>
    //   <Button title="Pick Image" onPress={pickImage} />
    //   <Button title="Pick PDF/DOCX" onPress={pickDocument} />
    //   {file && <Text style={styles2.fileInfo}>Selected: {file.name}</Text>}
    //   <Button title="Upload File" onPress={uploadFile} />
    // </View>
    <>
      <View className='flex-row gap-4 mb-4'>
        {file.type ? 
          <View className="border border-dashed border-orange-400 rounded-lg p-6 items-center flex-1 relative">
            <TouchableOpacity onPress={removeFile} className="p-2 bg-gray-100 rounded-full absolute top-[1rem] right-[1rem] z-20">
                <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            {file.fileType === 'image' ? 
              <Image source={{ uri: file.uri }} className="w-[6.6rem] h-[7rem] rounded-2xl border border-gray-100 mb-2" resizeMode="cover" />
            : 
              <FileText size={30} color="#F97316" />
            }
            
            <Text style={styles2.fileInfo}>Selected : {file.name}</Text>
          </View> 
          :
        <>
          <TouchableOpacity onPress={pickImage} className="border border-dashed border-orange-400 rounded-lg p-6 items-center flex-1">
            <FileText size={30} color="#F97316" />
            <Text className="text-orange-500 mt-3 text-base">Image</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={pickDocument} className="border border-dashed border-orange-400 rounded-lg p-6 items-center flex-1">
            <FileText size={30} color="#F97316" />
            <Text className="text-orange-500 mt-3 text-base">PDF / DOC</Text>
          </TouchableOpacity> */}
        </>}
      </View>

      {/* <TouchableOpacity onPress={uploadFile} className="bg-blue-500 rounded-lg py-3 items-center">
        <Text className="text-white font-semibold text-base">
          Upload File
        </Text>
      </TouchableOpacity> */}
    </>
  );
}

const styles2 = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  fileInfo: { marginTop: 10, fontSize: 14 },
});

export const convertFileToBase64 = async (uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting file:", error);
    return null;
  }
};

export const  sliceBaseStr = async (str: string) => {
  if (!str) return '';
  let target;
  if (Platform.OS !== 'web') { 
    target = await convertFileToBase64(str);
    return target;
  } else {
    target = str.indexOf('base64,');
    return str.slice(target + 7);
  }
}


export const useFetch = (url: string, isValid: string) => {          // isValid is taken to ensure correct params for API calls.

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    if (isValid) {
      try {
        const res = await fetch(url);
        if (res.status === 500) {            // Status 500 called internal server error is not an error it's a responce.
          setError(true);                    // hence it can't be catched by try catch statement hence handling it mannually.
          return;
        }
        const json = await res.json();
        setData(json);          
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }

  }, [url, isValid]);

  useEffect(() => {
    setLoading(true);
    // setTimeout(() => {                        // turn on Timeout to test Skeleton loading.
      fetchData();
    // }, 5000);
  }, [fetchData]);

  return [data, isLoading, error]
}

export const wait = async (time: number) => await new Promise((resolve) => setTimeout(resolve, time));

export const web = Platform.OS === 'web';
export const windowWidth = Dimensions.get('window').width;

export const getStatusIcon = (title: string) => {
  switch (title) {
    case 'Order Placed':
      return 'file-text';
    case 'Dispatched':
      return 'box';
    case 'Out For Delivery':
      return 'truck';
    case 'Delivered':
      return 'package';
// -------------------------------- Return process.
    case 'Return Started':
      return 'corner-down-left';
    case 'Item Returned':
      return 'log-in';
    case 'Refund Initiated':
      return 'file-text';
    case 'Refund Completed':  
      return 'check-square';
    default:
      return 'circle';
  }
};

export const PreviewImage = ({ url }: any) => {
  return (
    <View className="min-h-full w-full pointer-events-none p-6">
      <Image source={{ uri: url }} className="h-full w-full rounded-xl" resizeMode="contain" />
    </View>
  )
}

export const userLevel = { MARKETBY: 55, SALESPOINT: 56, DOCTOR: 57, PROVIDER: 58, PATIENT: 60, CUSTOMER: 60 }; 

export const uType = { 
  MARKETBY: { title: 'MARKETBY', level: 55, description: 'Marketing Executive'}, 
  SALESPOINT: { title: 'SALESPOINT', level: 56, description: 'Sales Executive'},
  DOCTOR: { title: 'DOCTOR', level: 57, description: 'Doctor'}, 
  PROVIDER: { title: 'PROVIDER', level: 58, description: 'Provider'}, 
  REFERER: { title: 'PROVIDER', level: 58, description: 'Provider'},            // Not a mistake. REFERER is also a provider.
  COLLECTOR: { title: 'COLLECTOR', level: 59, description: 'Collector'},
  POLYCLINIC: { title: 'POLYCLINIC', level: 465464, description: 'Polyclinic'}, 
  
  PATIENT: { title: 'PATIENT', level: 60, description: 'Patient'}, 
  RETAILER: { title: 'RETAILER', level: 60, description: 'Retailer'},
  CUSTOMER: { title: 'CUSTOMER', level: 60, description: 'Customer'},
};

export const useRegType = (type: string) => {
  let { info: compInfo, vType } = store.getState().company;
  let isLoggedIn = store.getState().isLoggedIn;
  const regTypes = useFetch(`${BASE_URL}/api/Values/GetMstAllMaster?CID=${compInfo.CompanyId}&type=RegistrationType&P1=0`, compInfo.CompanyId)[0];
  useEffect(() => {
    if (isLoggedIn || vType !== 'ErpHospital') return;
    if (!regTypes.length) return;
    let regType = regTypes.find(i => i.CodeValue === type);
    if (!regType) {
      alert('Something went wrong. Please try later. Invalid RegType.');
      store.dispatch(setModal({name: 'LOGIN', state: false}));              // store.dispatch(modalAction('LOGIN_MODAL', false, {mode: uType.PATIENT}));
      return;
    }
    store.dispatch(setUserRegType({ CodeId: regType.CodeId, Description: regType.Description, CodeValue: regType.CodeValue }));
  },[regTypes, type])
  return null;
}

export const minDate = "0001-01-01T00:00:00";
export const swapMinDate = (str: string) => str === minDate ? "01/01/1" : new Date(str).toLocaleDateString('en-TT');

export const getFallbackImg = () => {
  const compCode = store.getState().compCode;
  const companies = {
    [TAKEHOME_PHARMA]: 'https://pharma.takehome.live/assets/img/fallback/takeHome-no-image.png',
    [TAKEHOME_ELECTRONICS]: 'https://pharma.takehome.live/assets/img/fallback/takeHome-no-image.png',
    [TAKEHOME_AGRO]: 'https://pharma.takehome.live/assets/img/fallback/takeHome-no-image.png',
    [TAKEHOME_SURGICAL]: 'https://pharma.takehome.live/assets/img/fallback/takeHome-no-image.png',
    [TAKEHOME_GARMENTS]: 'https://pharma.takehome.live/assets/img/fallback/takeHome-no-image.png',
    ['KHLqDFK8CUUxe1p1EotU3g==']: 'https://demo.gbooksindia.in/assets/img/fallback/no-image.png'
  }

  return companies[compCode];
}


export default function MyDropdown({ offsetY=0, offsetX=0, maxHeight=200, isOpen, setOpen, anchorRef, children, dropdownPosition, dropdownClassName='', stickTo='bottom', overlay=false, dataList }: any) {

  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const calculatePosition = () => {
    anchorRef?.current?.measure((fx, fy, width, height, px, py) => {
      setPosition({
        top: py, 
        left: px,
        width: width,
        height: height
      });
    });
  };
 
  React.useEffect(() => {                   // Recalculate position when dropdown opens
    if (isOpen) calculatePosition();
  }, [isOpen]);

  const handleClose = () => {                  // Close dropdown when tapping outside (optional)
    setTimeout(() => setOpen(false), 200);
  };

  let childPosition = stickTo === 'top' ? {top: position.top - maxHeight + offsetY} : {top: (position.top + position.height + offsetY)};
  
  dropdownPosition = { 
    ...childPosition,
    left: (position.left + offsetX), 
    width: position.width, 
    maxHeight: maxHeight, 
    ...dropdownPosition 
  }

  return (
    <>
      <Pressable className={`absolute inset-0 z-[99990] ${overlay ? 'bg-gray-700/25' : ''}`} onPress={() => handleClose()}></Pressable>
        {isOpen && (
          <View className={`absolute rounded-2xl shadow-md border border-stone-200 z-[99999] bg-cyan-700 ${dropdownClassName}`} style={dropdownPosition} >
            <FlatList
              data={dataList}
              keyExtractor={(_, i) => i.toString()}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => children({ data: item })}
            />
          </View>
        )}
    </>
  );
}


export const invalidDate = '0001-01-01T00:00:00'

export const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export const dialCall = async (phoneNumber: string) => {
  if (!phoneNumber || phoneNumber.length < 9) return alert('The Phone Number is Invalid.')
  try {
    await Linking.openURL(`tel:${phoneNumber}`);
  } catch (error) {
    console.error('Error opening dialer:', error);
    Alert.alert('Error', 'Unable to open phone dialer.');
  }
};

export const openWhatsApp = async (phone: string, message: string) => {
  if (!phone || phone.length < 9) return alert('The Phone Number is Invalid.')
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message || '')}`;   // International format, no "+"
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'WhatsApp is not installed on this device');
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    Alert.alert('Error', 'Failed to open WhatsApp');
  }
};

// export const switchSegment = () => {}

export const switchSegment = async (companyId: string, dispatch: any) => {
  let user = store.getState().user;  
  if (user.UserId) {
    dispatch(setModal({ name: 'LOADING', state: true }))
    await makeLoginRequest(user, companyId, dispatch);
    dispatch(dumpCart())
    dispatch(setLocation({ LocationId: 0 }));
    dispatch(setCompCode(companyId))
    dispatch(setModal({ name: 'LOADING', state: false }))
  } else {   
    dispatch(setLogin(false));   
    dispatch(setUser({}))
    dispatch(dumpCart())
    // dispatch(resetSiteProducts())
    // dispatch(setPrescription({ required: false }))
    dispatch(setLocation({ LocationId: 0 }));
    dispatch(setCompCode(companyId))
  }
}


const makeLoginRequest = async (params: any, companyId: any, dispatch: any) => {
    const body = { UserName: params.RegMob1, UserPassword: encodeURIComponent(params.UserPassword), EncCompanyId: companyId };
    const res = await axios.post(`${BASE_URL}/api/UserAuth/CheckCompLogin`, body);
    console.log('Request made :', body);
    const data = res.data[0];
    if (data.Remarks === 'INVALID') {
        // setLoginError({status: true, message: 'The username or password is incorrect.'});
        alert('The username or password is incorrect.')
    } else if (data.Remarks === 'NOTINCOMPANY') {
        console.log(data.UserType);
        
        const existingUser = {             
            Salutation: data.Salutation,
            Name: data.Name,
            EncCompanyId: data.EncCompanyId,
            PartyCode: '',
            RegMob1: data.RegMob1,
            Gender: data.Gender,
            GenderDesc: data.GenderDesc,
            Address: data.Address,
            Age: data.Age,
            AgeMonth: data.AgeMonth,
            AgeDay: data.AgeDay,
            UserPassword: data.UserPassword,               // force to re-enter.
            // UserType: data.UserType,                       // set by modal
            Qualification: data.Qualification,
            SpecialistId: data.SpecialistId,
            UserId: data.UserId,
            PartyId: data.PartyId,
            MemberId: data.MemberId,
        
            State: data.State,
            StateName: data.StateName,
            City: data.City,
            Pin: data.Pin,
            Address2: data.Address2,
        
            DOB: swapMinDate(data.DOB),
            DOBstr: swapMinDate(data.DOB),
            AnniversaryDate: swapMinDate(data.AnniversaryDate),
            AnniversaryDatestr: swapMinDate(data.AnniversaryDate),
            Aadhaar: '',                                        // Not required.
            IsDOBCalculated: 'N',

            UHID: data.UHID,
        
            compName: data.compName ? data.compName : '',
            compAddress: data.compAddress ? data.compAddress : '',
            compState: data.compState ? data.compState : '',
            compPin: data.compPin ? data.compPin : '',
            compPhone1: data.compPhone1 ? data.compPhone1 : '',
            compPhone2: data.compPhone2 ? data.compPhone2 : '',
            compMail: data.compMail ? data.compMail : '',

            RegMob2: data.RegMob2,            // for Business type.
            GstIn: data.GstIn,
            LicenceNo: data.LicenceNo ? data.LicenceNo : '',
            ContactPerson: data.ContactPerson,
            BusinessType: 'B2C',

            UserType: data.UserType,
            UserRegTypeId: data.UserRegTypeId,
            UserLevelSeq: data.UserLevelSeq
        }
        autoLogin({ ...initReg, ...existingUser }, dispatch)

    } else if (!data.UserId || !data.UserType) {
        return alert("Something Went wrong, We can't log you in.");
    } else {
        let userLoginData = {
            Name: data.UserFullName,
            RegMob1: data.RegMob1,
            Email: data.Email,
            UserId: data.UserId,
            UserType: data.UserType,
            PartyCode: data.PartyCode,
            EncCompanyId: data.EncCompanyId,
            Age: data.Age,
            AgeDay: data.AgeDay,
            AgeMonth: data.AgeMonth,
            Gender: data.Gender,
            GenderDesc: data.GenderDesc,
            MPartyCode: data.MPartyCode,
            Address: data.Address,
            Qualification: data.Qualification,
            SpecialistDesc: data.SpecialistDesc,
            State: data.State, 
            StateName: data.StateName,                         
            City: data.City,
            Pin: data.Pin, // '741235'
            Address2: data.Address2,
            UHID: data.UHID,
            MemberId: data.MemberId,
            PartyId: data.PartyId,
            Salutation: data.Salutation,
            UserFullName: data.UserFullName,
            UserPassword: data.UserPassword,
    
            DOB: data.DOB,
            DOBstr: data.DOB,
            AnniversaryDate: data.AnniversaryDate,
            AnniversaryDatestr: data.AnniversaryDate,
            Aadhaar: data.Aadhaar,
            IsDOBCalculated: data.IsDOBCalculated,
    
            compName: data.compName ? data.compName: '',
            compAddress: data.compAddress ? data.compAddress: '',
            compState: data.compState ? data.compState: '',
            compPin: data.compPin ? data.compPin: '',
            compPhone1: data.compPhone1 ? data.compPhone1: '',
            compPhone2: data.compPhone2 ? data.compPhone2: '',
            compMail: data.compMail ? data.compMail: '',

            RegMob2: data.RegMob2,            // for Business type.
            GstIn: data.GstIn,
            LicenceNo: data.LicenceNo ? data.LicenceNo : '',
            ContactPerson: data.ContactPerson,
            BusinessType: 'B2C',

            UnderDoctId: data.UnderDoctId,
            ReferrerId: data.ReferrerId,
            ProviderId: data.ProviderId,
            MarketedId: data.MarketedId,

            UserRegTypeId: data.UserRegTypeId,
            UserLevelSeq: data.UserLevelSeq,
            UserCompList: data.UserCompList[0],
            UserCompList2: isLP ? data.UserCompList : null,
        };
        dispatch(setUser(userLoginData));
        dispatch(setLogin(true));
        console.log('Login Success'); 
    }
}


const autoLogin = async (params: any, dispatch: any) => {
  let status = await makeRegisterationRequest(params);
  if (status) {
      let loginStatus = await refreshUserInfo(params, dispatch);
      if (loginStatus) {
          dispatch(setLogin(true));
      } else {
          dispatch(setUser({}));
          dispatch(setLogin(false));
      }
  }
}

const makeRegisterationRequest = async (params: any) => { 
    // console.log("RegData :", params)   
    // return true;
    try {
        const res = await axios.post(`${BASE_URL}/api/UserReg/Post`, params);     //  { data: ['Y', 456446]}
        if (String(res.data[1]).length > 3) { 
            return true;
        } else {
            alert('Something Went wrong, Please try again later.');
            return false;
        }      
    } catch (err) {
        console.log(err);
        return false;
    }
} 

const refreshUserInfo = async (params: any, dispatch: any) => {
    try {
        const body = { UserName: params.RegMob1, UserPassword: params.UserPassword, EncCompanyId: params.EncCompanyId };
        const res = await axios.post(`${BASE_URL}/api/UserAuth/CheckCompLogin`, body);
        const data = res.data[0];
        
        if (data.Remarks === 'INACTIVE') {
            alert('THIS USER ID IS INACTIVE')
            return false;
        } else if (data.UserId) {
            dispatch(setUser({ ...data, UserCompList: data.UserCompList[0], UserCompList2: isLP ? data.UserCompList : null }));
            return true;
        } else {
            alert('We could not log you in, Please log in again manually.');
            return false;
        }
    } catch (err) {
        alert(err)
        return false;
    }
}


export const Required = ({ classes, size=8 }: any) => {
  return <FontAwesome className={classes} name="star" size={size} color={colors.rose[500]} />
}

export function filterUnique(list: [], fieldName: string) {
  const seen = new Set();
  return list.filter(item => {
    if (!seen.has(item[fieldName])) {
      seen.add(item[fieldName]);
      return true;
    }
    return false;
  });
}


export function groupBy(list = [], key: string) {         // group items by keyname.
  if (!Array.isArray(list) || !key) return {};

  const map = new Map();

  list.forEach(item => {
    const groupKey = item?.[key];
    if (groupKey === undefined || groupKey === null) return;

    if (!map.has(groupKey)) {
      map.set(groupKey, []);
    }

    map.get(groupKey).push(item);
  });

  return Object.fromEntries(map);
}

// get sum of a specific key's value in an arry of objects.
export const sumByKey = (arr: any, key: string) => arr.reduce((sum: any, item: string) => sum + (Number(item?.[key]) || 0), 0);

export const storage = {
  async set(key: string, value: string) {
    if (web) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async get(key: string) {
    if (web) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async remove(key: string) {
    if (web) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const validRegType = (UserRegTypeId: number, warn=true) => {     // Placing this in utils file triggering redux circular reference error.
  const vType = store.getState().company.vType;
  let userRegTypeId = store.getState().appData.userRegType.CodeId; 
  if (vType && vType !== 'ErpPharma') return true;
  if (UserRegTypeId === userRegTypeId) {
    return true;
  } else {
    if (warn) alert('You are not Allowed to log in.');       
    return false; 
  }
}

export const logout = (dispatch: any) => {
  dispatch(setLogin(false)); 
  dispatch(setUser({}));
  storage.remove('user');
}

export const groupMembers = (obj: any) => obj.reduce((acc: any, curr: any) => {
  const key = [
    curr.UnderDoctDesc.trim().toLowerCase(),
    curr.ProviderDesc.trim().toLowerCase(),
    curr.ReferrerDesc.trim().toLowerCase(),
    curr.MarketedDesc.trim().toLowerCase()
  ].join('|');                                                      // make a unique key

  if (!acc[key]) {
    acc[key] = {
      UnderDoctDesc: curr.UnderDoctDesc,
      ProviderDesc: curr.ProviderDesc,
      ReferrerDesc: curr.ReferrerDesc,
      MarketedDesc: curr.MarketedDesc,
      items: []                                                     // store all duplicates here
    };
  }

  acc[key].items.push(curr);
  return acc;
}, {});


export const getCatId = (categories: any, key: string, ) => {
  const category: any = categories.find((i: any) => ((i.ParentDesc).trim()).includes(key));
  const catId = category?.Parent || 0
  return catId;
}

export const getMonthDate = (date: any) => {
  const splitDate = new Date(date).toDateString().split(' ')
  return splitDate[1] + ' ' + splitDate[2]
}

// GET COLOR START 

const colorsList = {
  "red": {
      "50": "#fef2f2",
      "100": "#fee2e2",
      "200": "#fecaca",
      "300": "#fca5a5",
      "400": "#f87171",
      "500": "#ef4444",
      "600": "#dc2626",
      "700": "#b91c1c",
      "800": "#991b1b",
      "900": "#7f1d1d",
      "950": "#450a0a"
  },
  "lightBlue": {
    "50": "#f0f9ff",
    "100": "#e0f2fe",
    "200": "#bae6fd",
    "300": "#7dd3fc",
    "400": "#38bdf8",
    "500": "#0ea5e9",
    "600": "#0284c7",
    "700": "#0369a1",
    "800": "#075985",
    "900": "#0c4a6e",
    "950": "#082f49"
},
"purple": {
  "50": "#faf5ff",
  "100": "#f3e8ff",
  "200": "#e9d5ff",
  "300": "#d8b4fe",
  "400": "#c084fc",
  "500": "#a855f7",
  "600": "#9333ea",
  "700": "#7e22ce",
  "800": "#6b21a8",
  "900": "#581c87",
  "950": "#3b0764"
},
"emerald": {
  "50": "#ecfdf5",
  "100": "#d1fae5",
  "200": "#a7f3d0",
  "300": "#6ee7b7",
  "400": "#34d399",
  "500": "#10b981",
  "600": "#059669",
  "700": "#047857",
  "800": "#065f46",
  "900": "#064e3b",
  "950": "#022c22"
},
"sky": {
  "50": "#f0f9ff",
  "100": "#e0f2fe",
  "200": "#bae6fd",
  "300": "#7dd3fc",
  "400": "#38bdf8",
  "500": "#0ea5e9",
  "600": "#0284c7",
  "700": "#0369a1",
  "800": "#075985",
  "900": "#0c4a6e",
  "950": "#082f49"
},
"pink": {
  "50": "#fdf2f8",
  "100": "#fce7f3",
  "200": "#fbcfe8",
  "300": "#f9a8d4",
  "400": "#f472b6",
  "500": "#ec4899",
  "600": "#db2777",
  "700": "#be185d",
  "800": "#9d174d",
  "900": "#831843",
  "950": "#500724"
},
  "amber": {
      "50": "#fffbeb",
      "100": "#fef3c7",
      "200": "#fde68a",
      "300": "#fcd34d",
      "400": "#fbbf24",
      "500": "#f59e0b",
      "600": "#d97706",
      "700": "#b45309",
      "800": "#92400e",
      "900": "#78350f",
      "950": "#451a03"
  },
  "teal": {
    "50": "#f0fdfa",
    "100": "#ccfbf1",
    "200": "#99f6e4",
    "300": "#5eead4",
    "400": "#2dd4bf",
    "500": "#14b8a6",
    "600": "#0d9488",
    "700": "#0f766e",
    "800": "#115e59",
    "900": "#134e4a",
    "950": "#042f2e"
},
"indigo": {
  "50": "#eef2ff",
  "100": "#e0e7ff",
  "200": "#c7d2fe",
  "300": "#a5b4fc",
  "400": "#818cf8",
  "500": "#6366f1",
  "600": "#4f46e5",
  "700": "#4338ca",
  "800": "#3730a3",
  "900": "#312e81",
  "950": "#1e1b4b"
},
"fuchsia": {
  "50": "#fdf4ff",
  "100": "#fae8ff",
  "200": "#f5d0fe",
  "300": "#f0abfc",
  "400": "#e879f9",
  "500": "#d946ef",
  "600": "#c026d3",
  "700": "#a21caf",
  "800": "#86198f",
  "900": "#701a75",
  "950": "#4a044e"
},
  "yellow": {
      "50": "#fefce8",
      "100": "#fef9c3",
      "200": "#fef08a",
      "300": "#fde047",
      "400": "#facc15",
      "500": "#eab308",
      "600": "#ca8a04",
      "700": "#a16207",
      "800": "#854d0e",
      "900": "#713f12",
      "950": "#422006"
  },
  "lime": {
      "50": "#f7fee7",
      "100": "#ecfccb",
      "200": "#d9f99d",
      "300": "#bef264",
      "400": "#a3e635",
      "500": "#84cc16",
      "600": "#65a30d",
      "700": "#4d7c0f",
      "800": "#3f6212",
      "900": "#365314",
      "950": "#1a2e05"
  },
  "rose": {
    "50": "#fff1f2",
    "100": "#ffe4e6",
    "200": "#fecdd3",
    "300": "#fda4af",
    "400": "#fb7185",
    "500": "#f43f5e",
    "600": "#e11d48",
    "700": "#be123c",
    "800": "#9f1239",
    "900": "#881337",
    "950": "#4c0519"
},
  "green": {
      "50": "#f0fdf4",
      "100": "#dcfce7",
      "200": "#bbf7d0",
      "300": "#86efac",
      "400": "#4ade80",
      "500": "#22c55e",
      "600": "#16a34a",
      "700": "#15803d",
      "800": "#166534",
      "900": "#14532d",
      "950": "#052e16"
  },

  "cyan": {
      "50": "#ecfeff",
      "100": "#cffafe",
      "200": "#a5f3fc",
      "300": "#67e8f9",
      "400": "#22d3ee",
      "500": "#06b6d4",
      "600": "#0891b2",
      "700": "#0e7490",
      "800": "#155e75",
      "900": "#164e63",
      "950": "#083344"
  },
  "blue": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
      "950": "#172554"
  },

  "violet": {
      "50": "#f5f3ff",
      "100": "#ede9fe",
      "200": "#ddd6fe",
      "300": "#c4b5fd",
      "400": "#a78bfa",
      "500": "#8b5cf6",
      "600": "#7c3aed",
      "700": "#6d28d9",
      "800": "#5b21b6",
      "900": "#4c1d95",
      "950": "#2e1065"
  },
  "orange": {
    "50": "#fff7ed",
    "100": "#ffedd5",
    "200": "#fed7aa",
    "300": "#fdba74",
    "400": "#fb923c",
    "500": "#f97316",
    "600": "#ea580c",
    "700": "#c2410c",
    "800": "#9a3412",
    "900": "#7c2d12",
    "950": "#431407"
},

}

export const getRandomColor = (index: number) => {       // exclude the index to get color in seuence.
  const keys = Object.keys(colorsList);
  if (index !== undefined) {
    index = index >= keys.length ? (index % keys.length) : index
  } else {
    index = getRandomInt(0, keys.length-1)
  }
  const selectColor = colorsList[keys[index]];   
  return selectColor;
}

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// GET COLOR ENDS