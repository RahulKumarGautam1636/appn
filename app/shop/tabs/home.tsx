import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, Platform, FlatList } from 'react-native';
import { Feather, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { GridLoader, ProductCard, windowWidth } from '@/src/components/utils';
import { Link, router } from 'expo-router';
import { setModal } from '@/src/store/slices/slices';
import colors from 'tailwindcss/colors';
import { Pressable } from 'react-native-gesture-handler';

const CatCard = ({ data }: any) => {
  return (
    <TouchableOpacity className="items-center bg-white rounded-xl shadow-lg overflow-hidden">
      <Image className='' source={{uri: data.ImageURL}} style={{ width: 135, height: 100 }} />
      <Text className="text-sm text-gray-600 border-t w-full text-center border-gray-100 py-2">{data.ParentDesc}</Text>
    </TouchableOpacity>
  )
}

const web = Platform.OS === 'web';

const ShoppingAppScreen = () => {
  
  const deviceWidth = web ? document.documentElement.clientWidth : windowWidth;
  const [selectedCategory, setSelectedCategory] = useState('Pharmacy');
  const { products: productsData, categories: categoriesData } = useSelector((i: RootState) => i.siteData);
  const user = useSelector((i: RootState) => i.user);
  const location = useSelector((i: RootState) => i.appData.location);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const dispatch = useDispatch();

  const renderProductSection = (data: any, parentId: number) => {
    const productCategoryItems = data.itemMasterCollection.filter((i: any) => i.Category === parentId).slice(0, 8);   
    const parentCategoryName = categoriesData.LinkCategoryList.filter((i: any) => i.Parent === parentId)[0]?.ParentDesc;
    // const subLinks = categoriesData.LinkSubCategoryList.filter((i: any) => parentId === i.Parent);
    if (data.loading) {
      return <GridLoader classes='h-[45px] w-[100px] rounded-xl' containerClass='flex-row gap-3 m-5' />;
    } else if (data.error) {
      return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{data.error}</Text>;
    } else {
      return (
        <View>
          <View className="flex-row justify-between items-center pt-4 pb-3 px-5">
            <Text className="text-lg font-bold text-gray-800">{parentCategoryName}</Text>
            <TouchableOpacity>
              <Text className="text-purple-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View> 
          <View>
            <FlatList
              data={productCategoryItems.slice(0.3)}
              keyExtractor={(item) => item.LocationItemId.toString()}
              className=""
              contentContainerClassName="flex-row"
              scrollEnabled={true}
              horizontal
              renderItem={({item}: any) => (<ProductCard data={item} width={deviceWidth / 2} />)}
            />
            <View className='flex-row justify-center gap-4 py-3 bg-white'>
              <View className='h-2 w-2 bg-gray-500 rounded-full'></View>
              <View className='h-2 w-2 bg-gray-300 rounded-full'></View>
              <View className='h-2 w-2 bg-gray-300 rounded-full'></View>
            </View>
          </View>
        </View>
      
      // <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='flex-row'>
      //   {productCategoryItems.slice(0, 5).map((product: any) => (
      //     <View key={product.LocationItemId} className={`items-start bg-white p-4 border border-gray-100`} style={{width: deviceWidth / 2 }}>
      //       <View className='items-center justify-center w-full p-4 rounded-xl bg-gray-100 border border-gray-100'>
      //         <Image className='shadow-sm' source={{uri: product.ItemImageURL}} style={{ width: 100, height: 140 }} />
      //       </View>
      //       <View className='flex-1 items-start mt-3'>
      //         <Text className="text-[1rem] font-semibold text-gray-900 mb-2">{product.Description.slice(0, 15)}</Text>
      //         <View className='flex-row gap-4'>
      //           <Text className="text-[0.92rem] font-semibold text-green-700">550.23</Text>
      //           <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">250.60</Text>
      //         </View>
      //         {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}
      //         <View className='justify-between flex-row items-center w-full'>
      //           <View className='px-3 py-[0.4rem] bg-slate-100 shadow-sm rounded-xl mt-2' >
      //             <Text className='text-gray-700 text-[0.8rem]'>10 Tab</Text>
      //           </View>
      //           {/* <View className=''> */}
      //             <Ionicons name='cart-outline' className='mt-2' size={22} color='#0ea5e9' />
      //           {/* </View> */}
      //         </View>
      //       </View>
      //     </View>
      //   ))}
      // </ScrollView>



        // Version 2
        // <View key={i}>
        //   <View className="flex-row justify-between items-center pt-4 pb-3 px-5 bg-white border-t border-gray-100">
        //     <Text className="text-lg font-bold text-gray-800">Pharmacy</Text>
        //     <TouchableOpacity>
        //       <Text className="text-purple-600 font-medium">See All</Text>
        //     </TouchableOpacity>
        //   </View> 
        //   <View>
        //     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='flex-row'>
        //       {[1, 2, 3, 4].map(i => (
        //         <View key={i} className={`items-start bg-white p-4 border border-gray-100`} style={{width: cardWidth}}>
        //           <View className='items-center justify-center w-full p-4 rounded-xl bg-slate-100'>
        //             <Image className='shadow-lg rounded-full' source={require('../../../assets/images/user.png')} style={{ width: 100, height: 140 }} />
        //           </View>
        //           <View className='flex-1 items-start mt-3'>
        //             <Text className="text-[1rem] font-semibold text-gray-900 mb-2">Fujifilm Camera</Text>
        //             <View className='flex-row gap-4'>
        //               <Text className="text-[0.92rem] font-semibold text-green-700">550.23</Text>
        //               <Text className="text-[0.75rem] mt-[2px] font-medium text-rose-500 mb-2 line-through">250.60</Text>
        //             </View>
        //             {/* <Text className="text-[0.8rem] font-medium text-rose-500 mb-2">In Stock</Text> */}
        //             <View className='justify-between flex-row items-center w-full'>
        //               <View className='px-3 py-[0.4rem] bg-slate-100 shadow-sm rounded-xl mt-2' >
        //                 <Text className='text-gray-700 text-[0.8rem]'>10 Tab</Text>
        //               </View>
        //               {/* <View className=''> */}
        //                 <Ionicons name='cart-outline' className='mt-2' size={22} color='#0ea5e9' />
        //               {/* </View> */}
        //             </View>
        //           </View>
        //         </View>
        //       ))}
        //     </ScrollView>
        //     <View className='flex-row justify-center gap-4 py-3 bg-white'>
        //       <View className='h-2 w-2 bg-gray-500 rounded-full'></View>
        //       <View className='h-2 w-2 bg-gray-300 rounded-full'></View>
        //       <View className='h-2 w-2 bg-gray-300 rounded-full'></View>
        //     </View>
        //   </View>
        // </View>
      )
      
    }
  }  

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
                <TouchableOpacity className="mr-4">
                  <Feather name="bell" size={24} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="settings" size={24} color="#2563eb" />
                </TouchableOpacity>
              </View>
          </View> :
          <View className="gap-3 flex-row items-center mb-5">
              <Image className='rounded-full' source={require('../../../assets/images/logo.png')} style={{ width: 40, height: 40 }} />
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
            <TextInput 
              placeholder="Search..." 
              readOnly
              className="flex-1 ml-3 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
            <Feather name="sliders" size={20} color="#9CA3AF" />
          </View>
        </Pressable>
        <View className='flex-row justify-between mb-3 items-center gap-12'>
          <Text className='text-[12px] text-gray-600 font-medium'>Service provider : </Text>
          <TouchableOpacity onPress={() => dispatch(setModal({ name: 'LOCATIONS', state: true }))} className='flex-row justify-end gap-2 items-center flex-1'>
            <FontAwesome6 name="location-pin" size={12} color={colors.purple[600]} />
            <Text className="text-gray-700 text-[12px]" numberOfLines={1}>{location.LocationName}</Text>
            <Ionicons name="caret-down" size={20} color={colors.orange[500]} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-around py-4 bg-white rounded-2xl">
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
          
        </View>
      </View>
      <View className='py-5'>
        <View className="flex-row justify-between items-center mb-4 px-5">
          <Text className="text-lg font-bold text-gray-800">Featured Categories</Text>
          <Link href={'/'}>
            <Text className="text-purple-600 font-medium">See All</Text>
          </Link>
        </View>
        {(() => {
          if (categoriesData.loading) {
              return <GridLoader classes='h-[118px] w-[138px] rounded-xl' containerClass='flex-row gap-3 m-4' />;
          } else if (categoriesData.error) {
              return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{categoriesData.error}</Text>;
          } else {
            return (
              <ScrollView contentContainerClassName="flex-row justify-between gap-3 px-5 py-1" horizontal showsHorizontalScrollIndicator={false}>
                {categoriesData.LinkCategoryList.map((i, n) => (<CatCard data={i} key={n} />))}
              </ScrollView>
            )
          }
        })()}
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
      <View className="flex-1 mb-4">
        <View className="flex-row justify-between items-center mb-4 px-5 ">
          <Text className="text-lg font-bold text-gray-800">Top Brands</Text>
          <TouchableOpacity>
            <Text className="text-purple-600 font-medium">See All</Text>
          </TouchableOpacity>
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
        {(() => {
          if (productsData.loading) {
              return <GridLoader classes='h-[100px] w-[100px] !rounded-full' containerClass='flex-row gap-3 mx-5 mb-3' />;
          } else if (productsData.error) {
              return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{categoriesData.error}</Text>;
          } else {
            return (
              <ScrollView contentContainerClassName="flex-row gap-3 pb-3 px-5 " horizontal showsHorizontalScrollIndicator={false}>
                {productsData.ItemBrandList.map((brand, index) => (
                  <TouchableOpacity key={index} className="items-center justify-center">
                    <View className="bg-white rounded-full items-center justify-center mb-3 border-b-2 border-gray-200 p-4">
                      <Image 
                        className='' 
                        resizeMode='contain' 
                        source={{uri: `https://pharma.takehome.live/assets/img/ePharma/brands-logo/${brand.Text.trim()}.png`}} 
                        style={{ width: 75, height: 75 }} 
                      />
                    </View>
                    <Text className="text-sm text-gray-600 text-center">{brand.Text.slice(0, 18)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )
          }
        })()}     
          

      </View>
      {/* <View className="flex-1 border-y border-gray-200">
        {(() => {
          if (categoriesData.loading) {
              return <GridLoader classes='h-[45px] w-[100px] rounded-xl' containerClass='flex-row gap-3 m-5' />;
          } else if (categoriesData.error) {
              return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{categoriesData.error}</Text>;
          } else {
            return (
              <ScrollView contentContainerClassName="flex-row p-5 items-center" horizontal showsHorizontalScrollIndicator={false}>
                {categoriesData.LinkCategoryList.map((category) => (
                    <CategoryButton
                      key={category.Value}
                      title={category.Text}
                      isSelected={selectedCategory === category.Text}
                      onPress={() => setSelectedCategory(category.Text)}
                    />
                ))}
              </ScrollView>
            )
          }
        })()}
      </View> */}
      <FlatList
          data={categoriesData.LinkCategoryList}
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
    </ScrollView>
  );
};

export default ShoppingAppScreen;

const CategoryButton = ({ title, isSelected, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className={`px-4 py-[0.7rem] mx-1 rounded-full border transition-colors ${ isSelected ? 'bg-blue-500 border-blue-600 ' : 'bg-white border-gray-200' }`}>
    <Text className={`text-[0.95rem] font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>{title}</Text>
  </TouchableOpacity>
);

// const brandLogos = [
//   { name: 'Nike', icon: 'checkroom' },
//   { name: 'Macy\'s', icon: 'star', color: '#dc2626' },
//   { name: 'Levi\'s', icon: 'straighten', color: '#dc2626' },
//   { name: 'Adidas', icon: 'sports-soccer' },
//   { name: 'Chanel', icon: 'diamond' },
//   { name: 'Pepsi', icon: 'local-drink', color: '#2563eb' },
//   { name: 'Starbucks', icon: 'local-cafe', color: '#059669' },
//   { name: 'Puma', icon: 'pets' },
//   { name: 'Ferrari', icon: 'directions-car', color: '#dc2626' },
//   { name: 'Dell', icon: 'computer', color: '#2563eb' },
// ];


