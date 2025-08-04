import { BASE_URL, myColors } from '@/constants';
import ButtonPrimary from '@/src/components';
import { getFrom } from '@/src/components/utils';
import { RootState } from '@/src/store/store';
import { Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const [productData, setProductData] = useState({loading: false, data: {ImageMasterCollection: [], ItemMaster: {}, itemMasterCollection: []}, err: {status: false, msg: ''}});     
	const [counter, setCounter] = useState(1);
	const [activePackSize, setPackSize] = useState('');
  const { location } = useSelector((state: RootState) => state.appData);
  const locationId = location.LocationId;
  const { id } = useLocalSearchParams();
  const compCode = useSelector((state: RootState) => state.compCode);

  console.log(id);

  // useEffect(() => {
  //   async function getSliderItemImges() {
  //     // loaderAction(true);
  //     const res = await getFrom(`${BASE_URL}/api/Pharma/Get?CID=${compCode}&PID=${id}&LOCID=${locationId}`, {}, setProductData);
  //     if (res) {
  //       setProductData(res); 
  //     } else {
  //       console.log('No data received');
  //     }
  //     // loaderAction(false);
  //   }
  //   getSliderItemImges();
  // },[id, compCode, locationId])

  // useEffect(() => {
	// 	const packSizeList = productData.data.ItemMaster?.ItemPackSizeList;
	// 	if (packSizeList && packSizeList?.length) {
	// 		const firstSizeId = packSizeList[0];
	// 		setPackSize(firstSizeId);
	// 	} else {
	// 		setPackSize('');
	// 	}
	// },[productData.data.ItemMaster])

  // const isAddedToCart = Object.values(cart.pharmacy).filter(i => i.LocationItemId === productData.data.ItemMaster.LocationItemId).length;
	// const isAddedToWishlist = Object.values(wishlist.pharmacy).filter(i => i.LocationItemId === productData.data.ItemMaster.LocationItemId).length;

  return (
    <ScrollView contentContainerClassName='bg-purple-100 min-h-full'>
      {/* Header */}
      <View className="">
        {/* Product Image */}
        <View className="bg-white p-8 items-center border-b border-gray-200">
          <View className="bg-gray-50">
            <TouchableOpacity className="p-2">
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="w-64 h-64 flex-row items-center justify-center mb-6">
            {/* Headphone illustration */}
            <View className="relative">

            </View>
          </View>
          
          {/* Page indicators */}
          <View className="flex-row space-x-2">
            <View className="w-8 h-1 bg-black rounded-full"></View>
            <View className="w-2 h-1 bg-gray-300 rounded-full"></View>
            <View className="w-2 h-1 bg-gray-300 rounded-full"></View>
            <View className="w-2 h-1 bg-gray-300 rounded-full"></View>
          </View>
        </View>

        {/* Product Info */}
        <View className="bg-white p-6 shadow-sm">
          {/* Title and Favorite */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">Vinia Headphone</Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Feather 
                name="heart"
                size={24} 
                color={isFavorite ? "#f43f5e" : "#f43f5e"} 
              />
            </TouchableOpacity>
          </View>

          {/* Rating and Sales */}
          <View className="flex-row items-center mb-6">
            <View className='gap-2 flex-row items-center'>
              <FontAwesome name="rupee" size={19} color="#6b21a8" />
              <Text className="text-[1.3rem] font-bold text-purple-800 mr-4 gap-3 leading-7">240</Text>
              <Text className="text-[1rem] font-semibold line-through text-red-600 mr-4 gap-3">200.25</Text>
            </View>
            <View className='gap-1 flex-row items-center'>
              {/* <Feather name="star" size={16} color="#FCD34D" /> */}

              {/* <Ionicons name="checkmark-circle-sharp" size={24} color='#f97316' /> */}
              {/* <View className='bg-sky-100 rounded-full h-[2rem] w-[1.9rem] justify-center items-center'> */}
                {/* <FontAwesome6 name="check" size={16} color={'#0ea5e9'} /> */}
              {/* </View> */}

              <Text className="text-[1rem] font-semibold text-gray-900 ml-1">25% Off</Text>
            </View>
          </View>
          <View className="flex-row gap-5 items-center border-y border-gray-200 py-5 mb-5">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Pack Size :</Text>
            <View className="flex-row gap-5">
              {[1,2].map((colorOption, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(index)}
                  className={`rounded-2xl flex-row items-center justify-center px-4 py-3 ${
                    selectedColor === index ? 'border border-purple-300 bg-purple-50' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <View className="">
                    <Text className='text-[0.9rem] mb-1'>10 Tabs</Text>
                    <View className='flex-row gap-2 items-end'>
                      <Text className='text-[0.9rem]'>₹ 200</Text>
                      {/* <Text className='line-through text-rose-500 text-sm'>240</Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Description</Text>
            <Text className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
            </Text>
          </View>

          <View className='gap-4'>
            <View className='flex-row gap-4 flex-1 border border-gray-200 p-4 items-center rounded-xl'>
              <View className='h-14  w-14 rounded-xl justify-center items-center bg-teal-100'>
                <FontAwesome name="check" size={26} color={colors.teal[700]} />
              </View>
              <View>
                <Text className="font-medium text-slate-700 text-[12px] mr-auto mb-2">Best Before</Text>
                <Text className="font-medium text-slate-700 text-[14px] mr-auto">May 31 2026</Text>
              </View>
            </View>
            <View className='flex-row gap-4 flex-1 border border-gray-200 p-4 items-center rounded-xl'>
              <View className='h-14  w-14 rounded-xl justify-center items-center bg-fuchsia-100'>
                <FontAwesome name="shield" size={26} color={colors.fuchsia[600]} />
              </View>
              <View>
                <Text className="font-medium text-slate-700 text-[12px] mr-auto mb-2">MFD By.</Text>
                <Text className="font-medium text-slate-700 text-[14px] mr-auto">Zydus Wellness Limited</Text>
              </View>
            </View>
          </View>

          {/* Quantity */}
            {/* <Text className="text-lg font-semibold text-gray-900 mb-3">Quantity</Text> */}
            <View className="flex-row items-center gap-6 justify-between mt-5 mb-1">
              <TouchableOpacity 
                onPress={decrementQuantity}
                className="w-12 h-12 rounded-full border border-gray-200 items-center justify-center"
              >
                <Feather name="minus" size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-gray-900">{quantity}</Text>
              <TouchableOpacity 
                onPress={incrementQuantity}
                className="w-12 h-12 rounded-full border border-gray-200 items-center justify-center"
              >
                <Feather name="plus"  size={20} color="#6B7280" />
              </TouchableOpacity>
              <ButtonPrimary title='ADD TO CART' isLoading={false} active={true} classes='flex-1 !rounded-2xl' />
            </View>

          {/* Price and Add to Cart */}
        </View>

      </View>
      <View>
          <View className='m-4 shadow-sm rounded-2xl overflow-hidden'>
            <Link href={'/appn/appnList'}>
                <View className='flex-row gap-4 w-full bg-white p-5 items-center'>
                    <FontAwesome name="shield" size={22} color={myColors.primary[500]} style={{width: 26}} />
                    <Text className="font-medium text-slate-600 text-[16px] mr-auto">Shipping Details</Text>
                    <Feather name="chevron-right" size={24} color='#6b7280' />
                </View>
            </Link>
            <Pressable onPress={() => {}}>
                <View className='flex-row gap-4 w-full bg-white p-5 items-center border-y border-gray-200'>
                    <FontAwesome name="user" size={24} color={myColors.primary[500]} style={{width: 26}}/>
                    <Text className="font-medium text-slate-600 text-[16px] mr-auto">Return Policy</Text>
                    <Feather name="chevron-right" size={24} color='#6b7280' />
                </View>
            </Pressable>                
            <Link href={'/appn/appnList'}>
                <View className='flex-row gap-4 w-full bg-white p-5 items-center'>
                    <FontAwesome name="shield" size={22} color={myColors.primary[500]} style={{width: 26}} />
                    <Text className="font-medium text-slate-600 text-[16px] mr-auto">Privacy Policy</Text>
                    <Feather name="chevron-right" size={24} color='#6b7280' />
                </View>
            </Link>
        </View>
        <View className="flex-row justify-between items-center pt-4 pb-3 px-5 bg-white">
          <Text className="text-lg font-bold text-gray-800">Similar Products</Text>
          <TouchableOpacity>
            <Text className="text-purple-600 font-medium">See All</Text>
          </TouchableOpacity>
        </View> 
        <View className='flex-row flex-wrap'>
          {[1,2,3,4,5,6].map(item => (
            <View key={item} className={`items-start bg-white p-4 border border-gray-100 w-1/2`}>
              <View className='items-center justify-center w-full p-4 rounded-xl bg-gray-100 border border-gray-100'>
                <Image className='shadow-sm' source={{uri: 'https://admin.takehome.live//Content/ImageMaster/250309141146_1.jpg'}} style={{ width: 100, height: 140 }} />
              </View>
              <View className='flex-1 items-start mt-3'>
                <Text className="text-[1rem] font-semibold text-gray-900 mb-2">{'Glucon D Regular Refill 1 kg'.slice(0, 20)}</Text>
                <View className='flex-row gap-4'>
                  <Text className="text-[0.92rem] font-semibold text-green-700">550.23</Text>
                  <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">250.60</Text>
                </View>
                {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}
                <View className='justify-between flex-row items-center w-full'>
                  <View className='px-3 py-[0.4rem] bg-slate-100 shadow-sm rounded-xl mt-2' >
                    <Text className='text-gray-700 text-[0.8rem]'>10 Tab</Text>
                  </View>
                  {/* <View className=''> */}
                    <Ionicons name='cart-outline' className='mt-2' size={22} color='#0ea5e9' />
                  {/* </View> */}
                </View>
              </View>
            </View>
          ))}

        </View>
      </View>
    </ScrollView>
  );
};

export default ProductPage;