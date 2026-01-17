import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, Bell, MapPin, ChevronDown, Heart, ShoppingCart, Home, Calendar, User } from 'lucide-react';

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

  return (
    <View className="max-w-md mx-auto bg-white min-h-screen relative pb-20">
      <View className="overflow-y-auto h-screen pb-32">
        <View className="px-4 pt-12 pb-4 bg-white">
          <View className="flex items-center justify-between mb-4">
            <View className="flex items-center">
              <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
              <View>
                <Text className="text-xs text-gray-500">My Location</Text>
                <View className="flex items-center">
                  <MapPin size={14} color="#EF4444" />
                  <Text className="text-sm font-semibold ml-1">Sukabumi, Indonesia</Text>
                  <ChevronDown size={16} color="#6B7280" className="ml-1" />
                </View>
              </View>
            </View>
            <View className="relative">
              <Bell size={24} color="#1F2937" />
              <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </View>
          </View>

          <View className="flex items-center bg-gray-100 rounded-full px-4 py-3 mb-4">
            <Search size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Search Food, Drink, Restaurant, etc."
              className="flex-1 ml-2 text-sm bg-transparent outline-none placeholder-gray-400"
            />
            <View className="w-2 h-2 bg-red-500 rounded-full" />
          </View>
        </View>

        <View className="flex overflow-x-auto px-4 mb-6 gap-3 scrollbar-hide">
          <View className="min-w-[256px] h-32 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-4 relative overflow-hidden">
            <Text className="text-white text-lg font-bold mb-1">Get Special Discount</Text>
            <Text className="text-white text-2xl font-bold mb-3">Up to 90%</Text>
            <TouchableOpacity className="bg-red-500 hover:bg-red-600 rounded-full px-5 py-2 text-white font-semibold text-xs">
              Order Now
            </TouchableOpacity>
            <View className="absolute -right-8 -bottom-4 text-6xl">🍕</View>
          </View>
          
          <View className="min-w-[256px] h-32 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl p-4 relative overflow-hidden">
            <Text className="text-white text-lg font-bold mb-1">Get Special</Text>
            <Text className="text-white text-2xl font-bold mb-3">Up to</Text>
            <TouchableOpacity className="bg-white hover:bg-gray-100 rounded-full px-5 py-2 text-red-600 font-semibold text-xs">
              Order
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mb-6">
          <View className="flex justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-900">Select food by category</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              View All
            </TouchableOpacity>
          </View>

          <View className="grid grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index}
                className="flex flex-col items-center hover:opacity-80 transition"
              >
                <View className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
                  <Text className="text-3xl">{category.icon}</Text>
                </View>
                <Text className="text-xs text-gray-700 text-center">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 mb-6">
          <View className="flex justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-900">Top rated restaurant near you</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              View All
            </TouchableOpacity>
          </View>

          <View className="flex overflow-x-auto gap-3 scrollbar-hide">
            {restaurants.map((restaurant, index) => (
              <View key={index} className="min-w-[144px]">
                <View className="w-36 h-36 bg-gray-200 rounded-2xl mb-2 flex items-center justify-center relative">
                  <Text className="text-6xl">{restaurant.image}</Text>
                  <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition">
                    <Heart size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <Text className="font-semibold text-sm text-gray-900">{restaurant.name}</Text>
                <Text className="text-xs text-gray-500">{restaurant.distance}  {restaurant.time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-4 mb-6">
          <View className="flex justify-between items-center">
            <Text className="text-base font-bold text-gray-900">Explore More 456 Restaurants</Text>
            <TouchableOpacity className="text-red-500 text-sm font-semibold hover:text-red-600">
              View All
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity className="fixed bottom-24 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition">
        <ShoppingCart size={24} color="white" />
      </TouchableOpacity>

      <View className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <View className="flex justify-between items-center">
          <TouchableOpacity className="flex flex-col items-center">
            <Home size={24} color="#EF4444" />
            <Text className="text-xs text-red-500 mt-1 font-semibold">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
            <Calendar size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 mt-1">Book Table</Text>
          </TouchableOpacity>
          <View className="w-12" />
          <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
            <ShoppingCart size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 mt-1">My Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center hover:opacity-70 transition">
            <User size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 mt-1">Offers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RetaurantHome;