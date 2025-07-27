import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar, Image } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

const CatCard = ({ data }: any) => {
  return (
    <TouchableOpacity className="items-center bg-white rounded-xl shadow-sm overflow-hidden">
      <Image className='' source={{uri: data}} style={{ width: 135, height: 100 }} />
      <Text className="text-sm text-gray-600 border-t w-full text-center border-gray-100 py-2">Garments</Text>
    </TouchableOpacity>
  )
}

const ShoppingAppScreen = () => {
  const brandLogos = [
    { name: 'Nike', icon: 'checkroom' },
    { name: 'Macy\'s', icon: 'star', color: '#dc2626' },
    { name: 'Levi\'s', icon: 'straighten', color: '#dc2626' },
    { name: 'Adidas', icon: 'sports-soccer' },
    { name: 'Chanel', icon: 'diamond' },
    { name: 'Pepsi', icon: 'local-drink', color: '#2563eb' },
    { name: 'Starbucks', icon: 'local-cafe', color: '#059669' },
    { name: 'Puma', icon: 'pets' },
    { name: 'Ferrari', icon: 'directions-car', color: '#dc2626' },
    { name: 'Dell', icon: 'computer', color: '#2563eb' },
  ];

  return (
    <ScrollView className="flex-1 bg-purple-50">      
      {/* Header */}
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      <View className="bg-purple-100 pt-5 pb-5 px-5">

        
        <View className="flex-row justify-between items-center mb-5">
          <View className="flex-row items-center gap-3">
            <Image className='shadow-lg rounded-full' source={require('../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
            <View>
              <Text className="text-xs text-gray-600 mb-1">Welcome back</Text>
              <Text className="text-xl font-PoppinsSemibold text-gray-800">Rahul Kumar</Text>
            </View>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="mr-4">
              <Feather name="bell" size={24} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="settings" size={24} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-full px-4 py-[0.42rem] flex-row items-center mb-5">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search..." 
            className="flex-1 ml-3 text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
          <Feather name="sliders" size={20} color="#9CA3AF" />
        </View>

        {/* Category Icons */}
        <View className="flex-row justify-around py-4 bg-white rounded-2xl">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="play" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Garments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-red-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="shopping-bag" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Grocery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="gift" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Medicines</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center mb-2">
              <Feather name="percent" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Property</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className='py-5'>
        <View className="flex-row justify-between items-center mb-4 px-5">
          <Text className="text-lg font-bold text-gray-800">Featured Categories</Text>
          <TouchableOpacity>
            <Text className="text-purple-600 font-medium">See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerClassName="flex-row justify-between gap-3 px-5 py-1" horizontal showsHorizontalScrollIndicator={false}>
          {[
            'https://agro.takehome.live/assets/img/agro/categories/Milk-Ghee.png', 'https://agro.takehome.live/assets/img/agro/categories/Agri-Tools.png',
            'https://admin.takehome.live/Content/Attachments/ProjectDoc/Comp_907/20256415012_Natural%20Juice-112kb.png', 
            'https://agro.takehome.live/assets/img/agro/categories/Tea-Cofee.png', 
            'https://admin.takehome.live/Content/Attachments/ProjectDoc/Comp_752/20256112516_Cream.jpg',
            'https://admin.takehome.live/Content/Attachments/ProjectDoc/Comp_752/20256211335_Schedule-h1-drug-B.jpg'
            ].map((i, n) => (<CatCard data={i} key={n} />))}
          
          {/* <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-red-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="shopping-bag" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Grocery</Text> 
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mb-2">
              <Feather name="gift" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Medicines</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center mb-2">
              <Feather name="percent" size={20} color="white" />
            </View>
            <Text className="text-xs text-gray-600">Property</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </View>

      <View className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Top Brands</Text>
            <TouchableOpacity>
              <Text className="text-purple-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
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
          </View>
        </View>

        {/* Price Compare Banner */}
        <View className="bg-blue-400 rounded-2xl p-4 mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Feather name="upload" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-white mb-2">Upload your prescription.</Text>
              <Text className="text-sm text-gray-100">Get medicines delivered your doorstep.</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="chevron-right" size={23} color="white" />
          </TouchableOpacity>
        </View>

        {/* Product Cards Preview */}
        <View className="flex-row mb-20">
          <View className="w-32 h-32 bg-green-800 rounded-2xl mr-3" />
          <View className="w-32 h-32 bg-gray-400 rounded-2xl" />
        </View>
      </View>
    </ScrollView>
  );
};

export default ShoppingAppScreen;