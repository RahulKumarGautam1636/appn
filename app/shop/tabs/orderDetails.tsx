import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary from '@/src/components';
import { OrderCard } from '@/src/components/utils';

const Orders = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Werolla Cardigans',
      color: 'Gray',
      size: 'M',
      price: 385.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Suga Leather Shoes',
      color: 'Brown',
      size: '40',
      price: 375.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Vinta Headphone',
      color: 'Black',
      size: '',
      price: 360.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Zonia Super Watch',
      color: 'Silver',
      size: '',
      price: 850.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const ColorIndicator = ({ color }) => {
    const colorMap = {
      'Gray': '#6B7280',
      'Brown': '#8B4513',
      'Black': '#000000',
      'Silver': '#C0C0C0'
    };
    
    return (
      <View 
        className="w-3 h-3 rounded-full mr-1" 
        style={{ backgroundColor: colorMap[color] || '#6B7280' }}
      />
    );
  };

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">Your Orders</Text>
        </View>
      </View>
      <View className='gap-3'>
        {cartItems.map((item) => (
          <OrderCard data={item} />
        ))}
      </View>
      </ScrollView>
  );
};

export default Orders;