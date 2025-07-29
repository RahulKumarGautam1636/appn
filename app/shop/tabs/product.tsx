import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());

  const categories = ['All', 'Clothes', 'Shoes', 'Bags', 'Electronics'];

  const products = [
    {
      id: 1,
      name: 'Fujifilm Camera',
      price: 550.00,
      rating: 4.6,
      sold: '6,641 sold',
      image: '📷',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Silver Watch',
      price: 875.00,
      rating: 4.8,
      sold: '7,461 sold',
      image: '⌚',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Airtight Microphone',
      price: 345.00,
      rating: 4.8,
      sold: '6,578 sold',
      image: '🎤',
      category: 'Electronics'
    },
    {
      id: 4,
      name: 'Silent Headphones',
      price: 460.00,
      rating: 4.5,
      sold: '5,372 sold',
      image: '🎧',
      category: 'Electronics'
    }
  ];

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const CategoryButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 mx-1 rounded-full border transition-colors ${
        isSelected
          ? 'bg-black border-black text-white'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Text className="text-sm font-medium">{title}</Text>
    </TouchableOpacity>
  );

  const ProductCard = ({ product }) => (
    <View className="w-[48%] bg-gray-50 rounded-2xl Text-4 mb-4 relative hover:shadow-lg transition-shadow">
      {/* Favorite Button */}
      <TouchableOpacity
        onPress={() => toggleFavorite(product.id)}
        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-10 hover:scale-110 transition-transform"
      >
        <Text className={`text-lg ${
          favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'
        }`}>
          {favorites.has(product.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>

      {/* Product Image */}
      <View className="flex items-center justify-center h-24 mb-4">
        <Text className="text-4xl">{product.image}</Text>
      </View>

      {/* Product Info */}
      <Text className="text-lg font-semibold text-gray-900 mb-2">
        {product.name}
      </Text>

      {/* Rating and Sales */}
      <View className="flex items-center mb-3">
        <Text className="text-yellow-500 text-sm">⭐</Text>
        <Text className="text-sm text-gray-600 ml-1 mr-2">
          {product.rating}
        </Text>
        <Text className="text-xs text-gray-500">
          {product.sold}
        </Text>
      </View>

      {/* Price */}
      <Text className="text-xl font-bold text-gray-900">
        ${product.price.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 flex-col min-h-screen bg-white">
      {/* Category Filter */}
      <View className="px-4 py-4">
        <ScrollView className="flex-row overflow-x-auto scrollbar-hide">
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

      {/* Product Grid */}
      <View className="flex-1 px-4 overflow-y-auto">
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProductGrid;