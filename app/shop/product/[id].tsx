import { BASE_URL, myColors } from '@/constants';
import ButtonPrimary, { mmDDyyyyDate } from '@/src/components';
import ProductImagePreview from '@/src/components/previewBox';
import { add2Cart, AddToCartBtn, buyNow, computeWithPackSize, getFrom, getRequiredFields, ProductCard } from '@/src/components/utils';
import { removeFromCart } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import { Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from 'tailwindcss/colors';

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const [productData, setProductData] = useState({loading: false, data: {ImageMasterCollection: [], ItemMaster: {}, itemMasterCollection: []}, err: {status: false, msg: ''}});     
	const [activePackSize, setPackSize] = useState('');
  const { location } = useSelector((state: RootState) => state.appData);
  const locationId = location.LocationId;
  const { id } = useLocalSearchParams();
  const compCode = useSelector((state: RootState) => state.compCode);
  const cart = useSelector((i: RootState) => i.cart);
  const { vType } = useSelector((i: RootState) => i.company);
  const dispatch = useDispatch();
  const product = productData.data.ItemMaster;
  const router = useRouter()

  useEffect(() => {
    async function getSliderItemImges() {
      // loaderAction(true);
      const res = await getFrom(`${BASE_URL}/api/Pharma/GetProductDetails?CID=${compCode}&PID=${id}&LOCID=${locationId}`, {}, setProductData);
      if (res) {
        const mainProduct = getRequiredFields([res.data.ItemMaster]);
        const relatedProducts = getRequiredFields(res.data.itemMasterCollection);
        console.log(mainProduct, relatedProducts);
        setProductData({...res, data: {ImageMasterCollection: res.data.ImageMasterCollection, ItemMaster: mainProduct[0], itemMasterCollection: relatedProducts}}); 
      } else {
        console.log('No data received');
      }
      // loaderAction(false);
    }
    getSliderItemImges();
  },[id, compCode, locationId])

  useEffect(() => {
		const packSizeList = product?.ItemPackSizeList;
		if (packSizeList && packSizeList?.length) {
			const firstSizeId = packSizeList[0];
			setPackSize(firstSizeId);
		} else {
			setPackSize('');
		}
	},[product])

  const isAdded = Object.values(cart).filter(i => i.LocationItemId === product.LocationItemId).length;

  const packSize = () => {      
    return computeWithPackSize(product, activePackSize, vType);
  }

  const handlePackSize = (i: any) => {
		if (i.CodeId === packSize().PackSizeId) return;
		setPackSize(i);
    if (isAdded) return dispatch(removeFromCart(i.LocationItemId));
	}

  const handleAdd = () => {
    add2Cart(isAdded, product, packSize, dispatch, quantity);
  }

  const handleBuyNow = () => {
    buyNow(product, packSize, router, dispatch);
  }

  const input = product?.EXPDate || '';
  const [day, month, year] = input.split("/");
  const date = new Date(`${year}-${month}-${day}`).toDateString().split(' ').slice(1, 4).join(' ');

  const images = [
    { uri: 'https://admin.takehome.live/Content/ImageMaster/856441_2.jpg' },
    { uri: 'https://admin.takehome.live/Content/ImageMaster/250506161756_1.png' },
    { uri: 'https://admin.takehome.live/Content/ImageMaster/860872_2.png' },
  ];

  const images2 = productData.data.ImageMasterCollection.map((i: any) => ({uri: i.ImgURL}));

  return (
    <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
      <View className="">
        <View className="bg-white p-8 items-center relative">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full absolute top-[2rem] left-[2rem] z-20">
              <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <View className="items-start flex-row mb-2">
            <ProductImagePreview images={images2} />
          </View>
          
          {/* <View className="flex-row space-x-2">
            <View className="w-8 h-1 bg-black rounded-full"></View>
            <View className="w-2 h-1 bg-gray-300 rounded-full"></View>
            <View className="w-2 h-1 bg-gray-300 rounded-full"></View>
            <View className="w-2 h-1 bg-gray-300 rounded-full"></View>
          </View> */}
        </View>

        <View className="bg-white px-6 pb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-700">{product.Description}</Text>
            {/* <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Feather 
                name="heart"
                size={24} 
                color={isFavorite ? "#f43f5e" : "#f43f5e"} 
              />
            </TouchableOpacity> */}
          </View>
          <View className="flex-row items-center mb-6 gap-4">
            <View className='gap-5 flex-row items-center'>
              <Text className="text-[1.3rem] font-bold text-purple-800 gap-3 leading-7">₹ {packSize().SRate}</Text>
              <Text className="text-[1rem] font-semibold line-through text-red-600 gap-3">₹ {packSize().ItemMRP}</Text>
              <Text className="text-[1rem] font-semibold text-sky-600 ml-1">{packSize().DiscountPer}% Off</Text>
            </View>
            {/* <Text className="text-[1rem] font-semibold text-green-600 ml-auto">{locationId && !packSize().StockQty ? '' : 'In Stock'}</Text> */}
          </View>
          <View className="flex-row gap-5 items-center border-y border-gray-200 py-5 mb-5">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Pack Size :</Text>
            <View className="flex-row gap-5">
              {product?.ItemPackSizeList?.map((pack) => (
                <TouchableOpacity key={pack.CodeId} onPress={() => handlePackSize(pack)} className={`rounded-2xl flex-row items-center justify-center px-4 py-3 ${ pack.CodeId === packSize().PackSizeId ? 'border border-purple-300 bg-purple-50' : 'bg-gray-50 border border-gray-200' }`}>
                  <View className="">
                    <Text className='text-[0.9rem] mb-1 font-semibold'>{pack.Description}</Text>
                    <View className='flex-row gap-2 items-end'>
                      <Text className='text-[0.9rem]'>₹ {pack.SRate ? pack.SRate : product?.SRate}</Text>
                      {/* <Text className='line-through text-rose-500 text-sm'>240</Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {locationId && !packSize().StockQty ?
              <View className='flex-row ml-auto items-center gap-[0.4rem]'>
                <FontAwesome name="close" size={18}  color={colors.rose[600]} />
                <Text className="text-[1rem] font-semibold text-rose-600 ml-auto">Out of Stock</Text> 
              </View> :
              <View className='items-center flex-row gap-[0.4rem] ml-auto'>
                <FontAwesome name="check" size={18}  color={colors.green[600]} />
                <Text className="text-[1rem] font-semibold text-green-600">In Stock</Text>
              </View>
            }
          </View>
          <View className={`mb-6 ${product?.Technicalname?.length > 30 ? 'gap-2' : 'flex-row items-center gap-4'}`}>
            <Text className="text-lg font-semibold text-gray-900">Description</Text>
            <Text className="text-gray-600 leading-relaxed">
              {product?.Technicalname}
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. */}
            </Text>
          </View>         

          <View className='gap-4'>
            <View className='flex-row gap-4 flex-1 border border-gray-200 bg-slate-50 p-4 items-center rounded-xl'>
              <View className='h-14  w-14 rounded-xl justify-center items-center bg-teal-100'>
                <FontAwesome name="check" size={26} color={colors.teal[700]} />
              </View>
              <View>
                <Text className="font-medium text-gray-500 text-[13px] mr-auto mb-2">Best Before</Text>
                <Text className="font-medium text-slate-700 text-[14px] mr-auto">{date}</Text>
              </View>
            </View>
            <View className='flex-row gap-4 flex-1 border border-gray-200 bg-slate-50 p-4 items-center rounded-xl'>
              <View className='h-14  w-14 rounded-xl justify-center items-center bg-fuchsia-100'>
                <FontAwesome name="shield" size={26} color={colors.fuchsia[600]} />
              </View>
              <View>
                <Text className="font-medium text-gray-500 text-[13px] mr-auto mb-2">MFD By.</Text>
                <Text className="font-medium text-slate-700 text-[14px] mr-auto">{product?.ManufacturBY}</Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-6 justify-between mt-6 mb-1">
            <TouchableOpacity onPress={decrementQuantity} className="w-12 h-12 rounded-full border border-gray-200 items-center justify-center">
              <Feather name="minus" size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-900">{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} className="w-12 h-12 rounded-full border border-gray-200 items-center justify-center">
              <Feather name="plus"  size={20} color="#6B7280" />
            </TouchableOpacity>
            <AddToCartBtn type='type_1' product={product} useAuth={true} qty={packSize().StockQty} addCart={handleAdd} buyNow={buyNow} />
          </View>
        </View>
      </View>
      <View>
        <View className='m-4 shadow-sm rounded-2xl overflow-hidden'>
          <Link href={'/appn/appnList'}>
              <View className='flex-row gap-4 w-full bg-white p-5 items-center'>
                  <FontAwesome name="shield" size={22} color={myColors.primary[500]} style={{width: 26}} />
                  <Text className="font-medium text-slate-600 text-[15px] mr-auto">Shipping Details</Text>
                  <Feather name="chevron-right" size={24} color='#6b7280' />
              </View>
          </Link>
          <Pressable onPress={() => {}}>
              <View className='flex-row gap-4 w-full bg-white p-5 items-center border-y border-gray-200'>
                  <FontAwesome name="user" size={24} color={myColors.primary[500]} style={{width: 26}}/>
                  <Text className="font-medium text-slate-600 text-[15px] mr-auto">Return Policy</Text>
                  <Feather name="chevron-right" size={24} color='#6b7280' />
              </View>
          </Pressable>                
          <Link href={'/appn/appnList'}>
              <View className='flex-row gap-4 w-full bg-white p-5 items-center'>
                  <FontAwesome name="shield" size={22} color={myColors.primary[500]} style={{width: 26}} />
                  <Text className="font-medium text-slate-600 text-[15px] mr-auto">Privacy Policy</Text>
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

          {productData.data.itemMasterCollection.map((data, index) => {
            return (
              <ProductCard data={data} width={'50%'} key={data.LocationItemId} />
              // <Link href={`/shop/product/${data.ItemId}`} className='w-1/2' key={data.LocationItemId}>
              //   <View className={`items-start bg-white p-4 border border-gray-100`}>
              //     <View className='items-center justify-center w-full p-4 rounded-xl bg-gray-100 border border-gray-100'>
              //       <Image className='shadow-sm' resizeMode='contain' source={{uri: data.ItemImageURL}} style={{ width: '100%', height: 140 }} />
              //     </View>
              //     <View className='flex-1 items-start mt-3'>
              //       <Text className="text-[1rem] font-semibold text-gray-900 mb-2">{data.Description.slice(0, 20)}</Text>
              //       <View className='flex-row gap-4'>
              //         <Text className="text-[0.92rem] font-semibold text-green-700">550.23</Text>
              //         <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">250.60</Text>
              //       </View>
              //       {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}
              //       <View className='justify-between flex-row items-center w-full'>
              //         <View className='px-3 py-[0.4rem] bg-slate-100 shadow-sm rounded-xl mt-2' >
              //           <Text className='text-gray-700 text-[0.8rem]'>10 Tab</Text>
              //         </View>
              //         {/* <View className=''> */}
              //           <Ionicons name='cart-outline' className='mt-2' size={22} color='#0ea5e9' />
              //         {/* </View> */}
              //       </View>
              //     </View>
              //   </View>
              // </Link>
            )
          })}

        </View>
      </View>
    </ScrollView>
  );
};

export default ProductPage;