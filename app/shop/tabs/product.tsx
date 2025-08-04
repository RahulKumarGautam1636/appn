import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);

  const colors = [
    { color: '#000000', name: 'Black' },
    { color: '#6B7280', name: 'Gray' },
    { color: '#4B5563', name: 'Dark Gray' },
    { color: '#92400E', name: 'Brown' },
    { color: '#7C3AED', name: 'Purple' },
    { color: '#C026D3', name: 'Magenta' }
  ];

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <ScrollView contentContainerClassName='bg-gray-50 min-h-screen'>
      <View className="">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-gray-50">
          <TouchableOpacity className="p-2">
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <View className="text-lg font-medium">9:41</View>
          <View className="flex-row items-center space-x-1">
            <View className="flex-row space-x-1">
              <View className="w-1 h-1 bg-black rounded-full"></View>
              <View className="w-1 h-1 bg-black rounded-full"></View>
              <View className="w-1 h-1 bg-black rounded-full"></View>
            </View>
            <View className="ml-2 w-6 h-3 border border-black rounded-sm relative">
              <View className="w-4 h-2 bg-black rounded-sm absolute top-0.5 left-0.5"></View>
            </View>
          </View>
        </View>

        <View className="px-4 pb-4">
          {/* Product Image */}
          <View className="bg-white rounded-2xl p-8 mb-6 flex-row flex-col items-center">
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
          <View className="bg-white rounded-2xl p-6">
            {/* Title and Favorite */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-gray-900">Vinia Headphone</Text>
              <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                <Feather 
                  name="heart"
                  size={24} 
                  color={isFavorite ? "#EF4444" : "#6B7280"} 
                />
              </TouchableOpacity>
            </View>

            {/* Rating and Sales */}
            <View className="flex-row items-center mb-6">
              <View className="text-sm text-gray-600 mr-4">7,474 sold</View>
              <Feather name="star" size={16} color="#FCD34D" />
              <View className="text-sm text-gray-900 ml-1">4.9 (5,389 reviews)</View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-2">Description</Text>
              <Text className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
              </Text>
            </View>

            {/* Color Selection */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Color</Text>
              <View className="flex-row space-x-3">
                {colors.map((colorOption, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-full flex-row items-center justify-center ${
                      selectedColor === index ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                    }`}
                  >
                    <View 
                      className="w-8 h-8 rounded-full relative"
                      style={{ backgroundColor: colorOption.color }}
                    >
                      {selectedColor === index && (
                        <View className="absolute inset-0 flex-row items-center justify-center">
                          <View className="w-3 h-3 rounded-full bg-white"></View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Quantity</Text>
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={decrementQuantity}
                  className="w-10 h-10 rounded-full border border-gray-300 flex-row items-center justify-center hover:bg-gray-50"
                >
                  <Feather name="minus" size={20} color="#6B7280" />
                </TouchableOpacity>
                <View className="text-xl font-semibold mx-8 text-gray-900">{quantity}</View>
                <TouchableOpacity 
                  onPress={incrementQuantity}
                  className="w-10 h-10 rounded-full border border-gray-300 flex-row items-center justify-center hover:bg-gray-50"
                >
                  <Feather name="plus"  size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price and Add to Cart */}
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-gray-600 mb-1">Total price</Text>
                <Text className="text-3xl font-bold text-gray-900">${(720 * quantity).toFixed(2)}</Text>
              </View>
              <TouchableOpacity className="bg-black px-8 py-4 rounded-full flex-row items-center hover:bg-gray-800 transition-colors">
                <Ionicons name="bag-check" size={20} color="white" />
                <View className="text-white font-semibold ml-2">Add to Cart</View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductPage;