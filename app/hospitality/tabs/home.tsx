import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, Bell, MapPin, ChevronDown, Heart, ShoppingCart, Home, Calendar, User } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Image } from 'react-native';
import { getFrom, GridLoader, ProductCard } from '@/src/components/utils';
import { getRequiredFields } from '@/src/components/utils/shared';
import { BASE_URL } from '@/src/constants';

const RetaurantHome = () => {

  const categories = [
    { name: 'Chicken', icon: '🍗' },
    { name: 'Rice', icon: '🍚' },
    { name: 'Burger', icon: '🍔' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Coffee', icon: '☕' },
    { name: 'Boba', icon: '🧋' },
    { name: 'Salad', icon: '🥗' },
    { name: 'Punjabi', icon: '🍛' }
  ];

  const restaurants = [
    { name: 'Spice Garden', distance: '1.2 km', time: '5 mins', image: '🍛' },
    { name: 'Burger Planet', distance: '2.0 km', time: '8 mins', image: '🍔' },
    { name: 'Sushi World', distance: '0.8 km', time: '3 mins', image: '🍣' }
  ];

  // const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const compCode = useSelector((state: RootState) => state.compCode);
  const user = useSelector((state: RootState) => state.user);
  const company = useSelector((state: RootState) => state.company.info);
  const appData = useSelector((state: RootState) => state.appData);

  const [searchTerm, setSearchTerm] = useState({query: '', filterTerm: 'All', filterId: ''});
  const [autoCompleteList, setAutoCompleteList] = useState({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}}); 
  // const [searchResultsActive_1, setSearchResultsActive_1] = useState(false);

  useEffect(() => {
    let controller = new AbortController();
    const getSearchResult = async (companyCode, term, signal) => {                      
        if (!companyCode) return alert('no companyCode received');                  
        const res = await getFrom(`${BASE_URL}/api/item/Get?CID=${companyCode}&SearchStr=${term.query}&LOCID=${appData.location.LocationId}`, {}, setAutoCompleteList, signal);
        // const res = await getFrom(`${baseUrl}/api/Item/GetItemFilter?CID=${companyCode}&LOCID=${appData.location.LocationId}&SearchStr=${term.query}&CategoryIdList=${term.filterId}&SubCategoryIdList&MFGList&SortBy&ExcludeOutOfStock`, {}, setAutoCompleteList, signal);
        if (res) {                                                                    
            let requiredFields = getRequiredFields(res.data.itemMasterCollection);
            setAutoCompleteList(pre => ({ ...pre, loading: false, data: {itemMasterCollection: requiredFields }}));
        } else {
            console.log('No data received');
        }
    }  

    const timer = setTimeout(() => {
        if (searchTerm.query.length === 0) return setAutoCompleteList({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
        getSearchResult(compCode, searchTerm, controller.signal);  
    }, 1000);

    return () => {
        clearTimeout(timer);
        controller.abort();
    };
  }, [searchTerm, compCode, appData.location.LocationId])

  
  const handleSearchInput = (text: string) => {
      setSearchTerm(pre => ({...pre, query: text}));
      // setListActive(true); 
  }

  return (
    <ScrollView contentContainerClassName="bg-slate-100 relative pb-20">
      <View className="pb-32">
        <View className="p-4">
          {isLoggedIn ? 
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center gap-4">
                {/* <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" /> */}
                <Image className='shadow-lg rounded-full' source={require('@/assets/images/user.png')} style={{ width: 35, height: 35 }} />
                <View>
                  <Text className="text-sm font-semibold mb-1">{user.Name}</Text>
                  <View className="flex flex-row items-center">
                    <MapPin size={14} color="#EF4444" />
                    <Text className="text-xs text-gray-500 ml-1">{(user.UserType).toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}, {user.GenderDesc}, {user.Age} Years</Text>
                    <ChevronDown size={16} color="#6B7280" className="ml-1" />
                  </View>
                </View>
              </View>
              <View className="relative">
                <Bell size={24} color="#1F2937" />
                <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </View>
            </View>
            :
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center gap-4">
                {/* <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" /> */}
                <Image className='rounded-full' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${company.LogoUrl}` }} style={{ width: 35, height: 35 }} />
                <View>
                  <Text className="text-sm font-semibold mb-1">{company.COMPNAME.length > 27 ? company.COMPNAME.substr(0, 27) + '..' : company.COMPNAME}</Text>
                  <View className="flex flex-row items-center">
                    <MapPin size={14} color="#EF4444" />
                    <Text className="text-xs text-gray-500 ml-1">{!company.CATCHLINE.length ? 'Order food online.' : company.CATCHLINE.length > 32 ? company.CATCHLINE.substr(0, 32) + '..' : company.CATCHLINE}</Text>
                    <ChevronDown size={16} color="#6B7280" className="ml-1" />
                  </View>
                </View>
              </View>
              <View className="relative">
                <Bell size={24} color="#1F2937" />
                <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </View>
            </View>
          }

          <View className="flex flex-row items-center bg-white rounded-2xl px-4 py-2">
            <Search size={20} color="#9CA3AF" />
            <TextInput onChangeText={(text) => handleSearchInput(text)} value={searchTerm.query} placeholder="Search Food, Drink, Restaurant, etc." className="flex-1 ml-2 text-sm bg-transparent outline-none placeholder-gray-400" />
            <View className="w-2 h-2 bg-red-500 rounded-full" />
          </View>

          <View className="">
            {(() => {
                if (autoCompleteList.loading) {
                    return <GridLoader containerClass='mt-4 gap-3 flex-col' classes='h-24' count={4} />;
                } else if (searchTerm.query.length && !autoCompleteList.data.itemMasterCollection.length) {
                    return (
                        <View className="text-center py-10">
                            <Search className="w-14 h-14 text-gray-300 mx-auto mb-2" />
                            <Text className="text-gray-600 font-semibold text-sm">No items found</Text>
                        </View>
                    )
                } else if (autoCompleteList.data.itemMasterCollection.length) {
                    return (
                        <View className="my-4 gap-2">
                            {autoCompleteList.data.itemMasterCollection.map((item) => <ProductCard data={item} key={item.LocationItemId} />)}    
                            {/* <SearchListCard data={item} handleActive={searchResultsActive_1} /> */}
                        </View>
                    )
                }
            })()}
          </View>

        </View>
        
        <View className="flex flex-row overflow-x-auto px-4 mb-5 gap-3">
          <View className="min-w-[256px] bg-red-500 rounded-2xl p-4 relative">
            <Text className="text-white text-lg font-bold mb-1">Get Special Discount</Text>
            <Text className="text-white text-2xl font-bold mb-1">Up to 90%</Text>
            <TouchableOpacity className="bg-white rounded-full px-5 py-1.5 ml-auto font-semibold text-xs">
              <Text className='text-gray-700 text-sm'>Order Now</Text> 
            </TouchableOpacity>
            <Text className="absolute -right-8 -bottom-4 text-6xl">🍕</Text>
          </View>
          
          <View className="min-w-[256px] bg-blue-500 rounded-2xl p-4 relative overflow-hidden">
            <Text className="text-white text-lg font-bold mb-1">Get Special</Text>
            <Text className="text-white text-2xl font-bold mb-1">Up to</Text>
            <TouchableOpacity className="bg-white rounded-full px-5 py-1.5 ml-auto font-semibold text-xs">
              <Text className='text-gray-700 text-sm'>Order Now</Text> 
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4">
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-900">Popular Dishes</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              <Text>View All</Text>
            </TouchableOpacity>
          </View>
          <View className='gap-3 flex-col'>
            <FoodItemCard />
            <FoodItemCard />
            <FoodItemCard />
          </View>
        </View>

        <View className="px-4 mb-3 mt-6">
          <View className="flex flex-row justify-between items-center mb-5">
            <Text className="text-base font-bold text-gray-900">Select food by category</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              <Text>View All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index}
                className="flex flex-col items-center hover:opacity-80 transition mb-4"
                style={{width: '20%'}}
              >
                <View className="w-16 h-16 bg-white rounded-2xl flex flex-row items-center justify-center mb-2">
                  <Text className="text-3xl">{category.icon}</Text>
                </View>
                <Text className="text-xs text-gray-700 text-center">{category.name}</Text>
              </TouchableOpacity>
            ))}

            {/* <View className="flex-row flex-wrap justify-between">
              {brandLogos.map((brand, index) => (
                <TouchableOpacity key={index} className="items-center mb-4" style={{width: '20%'}}>
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
          </View>
        </View>

        <View className="px-4 mb-5">
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-900">Top rated restaurant near you</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              <Text>View All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row overflow-x-auto gap-3 scrollbar-hide">
            {restaurants.map((restaurant, index) => (
              <View key={index} className="min-w-[144px]">
                <View className="w-36 h-36 bg-gray-200 rounded-2xl mb-2 flex flex-row items-center justify-center relative">
                  <Text className="text-6xl">{restaurant.image}</Text>
                  <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex flex-row items-center justify-center transition">
                    <Heart size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <Text className="font-semibold text-sm text-gray-900">{restaurant.name}</Text>
                <Text className="text-xs text-gray-500">{restaurant.distance}  {restaurant.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* <View className="px-4 mb-5">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-base font-bold text-gray-900">Explore More 456 Restaurants</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              View All
            </TouchableOpacity>
          </View>
        </View> */}
      </View>

      {/* <TouchableOpacity className="fixed bottom-24 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex flex-row items-center justify-center shadow-lg transition">
        <ShoppingCart size={24} color="white" />
      </TouchableOpacity> */}
    </ScrollView>
  );
}

export default RetaurantHome;

function FoodItemCard() {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-3">
          <Text className="text-2xl">🍱</Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base mb-1">
            DAL FRY
          </Text>
          
          <View className="flex-row items-center mb-1">
            <Text className="text-red-600 font-bold text-lg">₹150</Text>
            <Text className="text-gray-400 line-through text-sm ml-2">₹150</Text>
            <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
              <Text className="text-green-700 font-semibold text-xs">Save ₹10</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
            <Text className="text-green-600 text-xs font-medium">Available</Text>
          </View>
        </View>
      </View>

      <View className="items-end ml-3">
        <View className="bg-orange-50 px-3 py-1 rounded-full mb-2">
          <Text className="text-orange-600 text-xs font-semibold">Canteen</Text>
        </View>

        <TouchableOpacity className="bg-orange-500 px-6 py-2.5 rounded-lg active:bg-orange-600">
          <Text className="text-white font-bold text-sm">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}