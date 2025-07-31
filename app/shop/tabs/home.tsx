import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

const CatCard = ({ data }: any) => {
  return (
    <TouchableOpacity className="items-center bg-white rounded-xl shadow-lg overflow-hidden">
      <Image className='' source={{uri: data}} style={{ width: 135, height: 100 }} />
      <Text className="text-sm text-gray-600 border-t w-full text-center border-gray-100 py-2">Garments</Text>
    </TouchableOpacity>
  )
}

const ShoppingAppScreen = () => {
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

  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <ScrollView className="flex-1 bg-purple-50">   
      <View className="bg-purple-100 pt-5 pb-5 px-5">        
        <View className="flex-row justify-between items-center mb-5">
          <View className="flex-row items-center gap-3">
            <Image className='shadow-lg rounded-full' source={require('../../../assets/images/user.png')} style={{ width: 40, height: 40 }} />
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
        <View className="bg-white rounded-full px-4 py-[0.42rem] flex-row items-center mb-5">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search..." 
            className="flex-1 ml-3 text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
          <Feather name="sliders" size={20} color="#9CA3AF" />
        </View>
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
      <View className="bg-purple-600 rounded-2xl mx-5 p-5 mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-purple-400 rounded-full items-center justify-center mr-4">
            <Feather name="upload" size={20} color="#ffffff" />
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
      <View className="flex-1 px-5 mb-4">
        <View className="flex-row justify-between items-center mb-4">
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
        <ScrollView contentContainerClassName="flex-row gap-3 pb-3" horizontal showsHorizontalScrollIndicator={false}>
          {brands.map((brand, index) => (
            <TouchableOpacity key={index} className="items-center justify-center">
              <View className="bg-white rounded-full items-center justify-center mb-3 shadow-sm border-b-2 border-gray-200 p-4">
                <Image className='' resizeMode='contain' source={{uri: `https://pharma.takehome.live/assets/img/ePharma/brands-logo/${brand}`}} style={{ width: 75, height: 75 }} />
              </View>
              <Text className="text-sm text-gray-600 text-center">{brand.slice(0, 18)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>       
      </View>
      <View className="flex-1 border-y border-gray-200">
        <ScrollView contentContainerClassName="flex-row p-5" horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
              <CategoryButton
                key={category}
                title={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
          ))}
        </ScrollView>
      </View>
      <View>
        <View className="flex-row justify-between items-center mt-5 mb-4 px-5">
          <Text className="text-lg font-bold text-gray-800">Pharmacy</Text>
          <TouchableOpacity>
            <Text className="text-purple-600 font-medium">See All</Text>
          </TouchableOpacity>
        </View> 
        <View className='flex-row flex-wrap'>
          {[1, 2, 3, 4].map(i => (
            <View key={i} className='items-start w-[50%] bg-white p-3 border border-gray-100'>
              <View className='items-center justify-center w-full p-4 rounded-xl bg-slate-100'>
                <Image className='shadow-lg rounded-full' source={require('../../../assets/images/user.png')} style={{ width: 100, height: 100 }} />
              </View>
              <View className='flex-1 items-start mt-3'>
                <Text className="text-[1rem] font-semibold text-gray-900 mb-2">Fujifilm Camera</Text>
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

export default ShoppingAppScreen;

const categories = ['All', 'Clothes', 'Shoes', 'Bags', 'Electronics', 'Alls', 'Clothess', 'Shoess', 'Bagss', 'Electronicss'];
const CategoryButton = ({ title, isSelected, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className={`px-4 py-[0.7rem] mx-1 rounded-full border transition-colors ${ isSelected ? 'bg-blue-500 border-blue-600 ' : 'bg-white border-gray-200' }`}>
    <Text className={`text-[0.95rem] font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>{title}</Text>
  </TouchableOpacity>
);

let brands = [
  "Abbott Healthcare Pvt. Ltd..png",
  "Abbott India Limited(Novo Nordisk).png",
  "Adonis Laboratories Pvt. Ltd..png",
  "Ajanta Pharma Limited.png",
  "Alcon Laboratories (India) Pvt. Ltd..png",
  "Allen Laboratories Ltd..png",
  "Allergan India Pvt. Ltd..png",
  "Alteus Biogenics Pvt.Ltd..png",
  "Bayer Pharmaceuticals Pvt Ltd.png",
  "Becton Dickinson India Pvt. Ltd..png",
  "Beiersdorf India Pvt. Ltd..png",
  "Cadila Pharmaceuticals Limited.png",
  "Cipla Ltd..png",
  "Corona Remedies Private. Limited. (H).png",
  "Dabur India Ltd..png",
  "Dr. Reddy's Laboratories Ltd..png",
  "Duckbill Drugs Pvt. Ltd..png",
  "Glaxo Smithkline Asia Pvt. Ltd..png",
  "Glenmark Pharmaceuticals Ltd..png",
  "Hegde & Hegde Pharmaceutical LLP.png",
  "Himalayan Organics.png",
  "Icpa Health Products Limited.png",
  "Indchemic Life Sciences.png",
  "Indchemie Health Specialities Pvt..png",
  "Indoco Remedies Ltd..png",
  "Intas Pharmaceuticals Ltd..png",
  "Ipca Laboratories Ltd..png",
  "Lupin Ltd..png",
  "Macleods Pharmaceuticals Ltd..png",
  "Mankind Pharma Ltd..png",
  "Med Manor Organics Pvt. Ltd.png",
  "Micro Labs Limited.png",
  "NOVO NORDISK.png",
  "Pfizer Limited.png",
  "Procter & Gamble Health Ltd..png",
  "Raptakos Brett & Co. Ltd.png",
  "Reckitt Benckiser (India) Pvt. Ltd.png",
  "Roche Diabetes Care India Pvt Ltd.png",
  "Sanofi India Limited..png",
  "Sentiss Pharma.png",
  "Sharnay Food Products.png",
  "Sheth Brothers.png",
  "Shine Pharmaceuticals Limited.png",
  "Strassenburg Pharmaceuticals Ltd.png",
  "Sun Pharmaceutical Ind.Ltd.png",
  "Torrent Pharmaceuticals Ltd.png",
  "Universal Nutriscience Private Limited.png",
  "White & Trust Pharmaceuticals (India) Pvt. Ltd..png",
  "Win Medicare Pvt. Ltd..png",
  "Zandu.png",
  "Zuventus Healthcare Ltd..png",
  "Zydus Healthcare Limited.png",
  "Zydus Wellness Limited.png",
]
