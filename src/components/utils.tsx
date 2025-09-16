import axios, { GenericAbortSignal } from "axios";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback, Dimensions, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from "react-native-reanimated-carousel";
import { addToCart, dumpCart, removeFromCart, setPrescription } from "../store/slices/slices";
import store, { RootState } from "../store/store";
import { Link, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import colors from "tailwindcss/colors";
import ButtonPrimary from ".";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FileText } from "lucide-react-native";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

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
      <Image className={`max-w-full ${imgClass}`} source={require('../../assets/images/no_content.png')} resizeMode="contain" />
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
  { id: 1, image: require("../../assets/images/banner-card-1.jpg") },
  { id: 2, image: require("../../assets/images/banner-card-2.jpg") },
  { id: 3, image: require("../../assets/images/banner-card-3.jpg") },
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

export const getRequiredFields = (list=[]) => {
  // let { globalData } = store.getState();

  return list.map((i: any) => ({ 
    PTR: i.PTR,
    AutoId: i.AutoId,
    Category: i.Category, 
    CategoryName: i.CategoryName, 
    SubCategoryId: i.SubCategoryId,
    CompanyId: i.CompanyId,
    Description: i.Description, 
    DepartmentId: i.DepartmentId,
    Discount: i.Discount,
    DiscountPer: i.DiscountPer,
    EXPDate: i.EXPDate,
    ItemId: i.ItemId, 
    ItemMRP: i.ItemMRP, 
    PackSizeId: i.PackSizeId,
    ItemPackSizeList: i.ItemPackSizeList, 
    SRate: i.SRate, 
    StockQty: i.StockQty, 
    GroupName: i.GroupName, 
    Parent: i.Parent, 
    ParentDesc: i.ParentDesc, 
    Technicalname: i.Technicalname,
    sv_CostId: i.sv_CostId, 
    itemmstr: i.itemmstr, 
    LocationId: i.LocationId, 
    ManufacturBY: i.ManufacturBY,
    Unit: i.Unit,
    UnitName: i.UnitName,
    IsVisible: i.IsVisible, 
    ItemCode: i.ItemCode, 
    ItemImageURL: i.ItemImageURL,    
    CGST: i.CGST,
    SGST: i.SGST,
    IGST: i.IGST, 
    CGSTRATE: i.CGSTRATE, 
    SGSTRATE: i.SGSTRATE,
    IGSTRATE: i.IGSTRATE, 
    Specification: i.Specification || '', 

    LocationName: i.LocationName || '',
    LocationItemId: i.LocationItemId,
    count: 1,
  }));
}

export const getCategoryRequiredFieldsOnly = (list) => {

  return list.map(i => ({ 
    Parent: i.Parent,
    ParentDesc: i.ParentDesc,
    Text: i.ParentDesc,
    Value: String(i.Parent),
    ImageURL: i.ImageURL
  }));
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
        source={require('../../assets/images/Glass-BG2.png')}
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
  const locationId = state.appData.location.LocationId;
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
      return { ItemMRP: activePackSize.MRP, SRate: activePackSize.SRate, StockQty: activePackSize.StockQty, DiscountPer: activePackSize.MRPDisPer, PackSizeId: activePackSize.CodeId, PTR: activePackSize.PTR };  
    } else {
      return data;     // { ItemMRP: data.ItemMRP, SRate: data.SRate, StockQty: data.StockQty, DiscountPer: data.DiscountPer, PackSizeId: data.PackSizeId };
    }
  }
} 


export const ProductCard = ({ data, width='100%', type='grid', parent='' }) => {

  // const compCode = useSelector((i: RootState) => i.compCode);
  // const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  const { vType } = useSelector((i: RootState) => i.company);
  const isAdded = useSelector((i: RootState) => Object.values(i.cart).some((x : any) => x.LocationItemId === data.LocationItemId));
  // const isAdded = Object.values(cart).find((i: any) => i.LocationItemId === data.LocationItemId)

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

  const packSizeList = data.ItemPackSizeList?.map(i => (
    <TouchableOpacity onPress={() => handlePackSize(i)} key={i.CodeId} className={`px-3 py-[0.4rem] shadow-sm rounded-xl mt-2 ${i.CodeId === packSize().PackSizeId ? 'bg-blue-50' : 'bg-slate-100'}`} >
      <Text className={`text-[0.8rem] ${i.CodeId === packSize().PackSizeId ? 'text-blue-600' : 'text-gray-700'}`}>{i.Description}</Text>
    </TouchableOpacity>
  ));

  const handleAdd = (e) => {
    e.stopPropagation();
    add2Cart(isAdded, data, packSize, dispatch);
  }

  // const handleBuyNow = () => {
  //   buyNow(data, packSize, dispatch, router);
  // }

  if (type === 'grid') {
    return (
      <TouchableOpacity onPress={() => router.push(`/shop/product/${data.ItemId}`)} style={{width: width }}>
        <View className={`items-start bg-white p-4 border border-gray-100 w-full`}>
          <View className='items-center justify-center w-full p-4 rounded-xl bg-gray-100 border border-gray-100'>
            <Image className='' resizeMode='contain' source={{uri: data.ItemImageURL}} style={{ width: '100%', height: 140 }} />
          </View>
          <View className='flex-1 items-start mt-3'>
            <Text className="text-[1rem] font-semibold text-gray-900 mb-2">{data.Description.slice(0, 20)}</Text>
            <View className='flex-row gap-4'>
              <Text className="text-[0.92rem] font-semibold text-sky-600">₹ {packSize().SRate}</Text>
              <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">₹ {packSize().ItemMRP}</Text>
            </View>
            {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}
            {packSize().StockQty ? 
            <Text className="text-[0.85rem] font-semibold text-green-700 mb-1">In Stock</Text>
            :
            <Text className="text-[0.85rem] font-semibold text-orange-500 mb-1">Out of Stock</Text>}
            <View className='justify-between flex-row items-center w-full'>
              {packSizeList}
              <TouchableOpacity onPress={handleAdd}>
                <Ionicons name={`cart${isAdded ? '' : '-outline'}`} className='mt-2' size={22} color='#0ea5e9' />
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
            <View className='justify-between flex-row items-center w-full'>
              {packSizeList}
              <TouchableOpacity onPress={handleAdd}>
                <Ionicons name={`cart${isAdded ? '' : '-outline'}`} className='mt-2' size={22} color='#0ea5e9' />
              </TouchableOpacity>
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
      <View className={`items-center bg-white rounded-xl shadow-sm border-b border-gray-200 overflow-hidden w-full h-full`}>
        <Image className='' source={{uri: data.ImageURL}} style={{ width: 135, height: 100 }} />
        <Text className="text-sm text-gray-600 border-t w-full text-center border-gray-100 py-2">{data.ParentDesc}</Text>
      </View>
    </Link>
  )
}

export const CartCard = ({ data }: any) => {
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
          <Text className="text-sm text-gray-600 mr-3">₹ {data.SRate}</Text>
          {/* {data.size && (
            <> */}
              <View className="w-1 h-1 bg-gray-400 rounded-full mr-3" />
              <Text className="text-sm text-gray-600">Pack : {activePackSize}</Text>
            {/* </>
          )} */}
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-700">₹ {(data.count * data.SRate).toFixed(2)}</Text>
          
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

export const AddToCartBtn = ({ type, product, useAuth, qty, addCart, buyNow, classes, styles }: any) => {

  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  const vType = useSelector((i: RootState) => i.company.vType);
  const cart = useSelector((i: RootState) => i.cart);
  const inCart = Object.values(cart).find(i => i.LocationItemId === product.LocationItemId);
  const isAdded = inCart?.LocationItemId;
  const dispatch = useDispatch();

  let isValid;    
  if (useAuth) isValid = !locationId || qty;
  else isValid = true;
  const isRestaurant = (vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT');

  if (type === 'productCard1') {
      return (
          <>
              {isAdded ? 
                  <View className={`btn btn-outline-primary`}> 
                      <TouchableOpacity onPress={() => {if (inCart.count !== 1) dispatch(addToCart({...inCart, count: inCart.count - 1}))}} className='bx bx-minus align-middle'>-</TouchableOpacity>
                      <Text>{inCart.count} &nbsp;</Text>
                      <TouchableOpacity className='bx bx-plus align-middle' onPress={() => dispatch(addToCart({...inCart, count: inCart.count + 1}))}></TouchableOpacity>
                  </View> :
                  <TouchableOpacity onPress={addCart} className={`btn btn-outline-primary ${isValid ? '' : 'opacity-50 pe-none'}`}>{isAdded ? 'Remove' : 'Add to cart'}</TouchableOpacity> 
              }
              {isRestaurant || <TouchableOpacity onPress={buyNow} className={`btn btn-outline-primary ${isValid ? '' : 'opacity-50 pe-none'}`}>Buy now</TouchableOpacity>}    
          </>
      )
  } else if (type === 'type_1') {
    return (
      <ButtonPrimary title={isAdded ? 'REMOVE FROM CART' : 'ADD TO CART'} onPress={addCart} isLoading={false} active={true} classes={`flex-1 bg-purple-500 border-r border-gray-200 !rounded-none ${isValid ? '' : 'opacity-50 pointer-events-none'}`} />
    )
  }

}

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