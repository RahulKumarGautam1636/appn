import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TextInput, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const HealthDashboard = () => {
  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-lg font-semibold">9:41</Text>
        <View className="flex-row items-center space-x-1">
          <View className="flex-row">
            <View className="w-1 h-1 bg-black rounded-full mx-0.5" />
            <View className="w-1 h-1 bg-black rounded-full mx-0.5" />
            <View className="w-1 h-1 bg-black rounded-full mx-0.5" />
            <View className="w-1 h-1 bg-gray-400 rounded-full mx-0.5" />
          </View>
          <Feather name="wifi" size={16} color="black" />
          <View className="w-6 h-3 border border-black rounded-sm">
            <View className="w-4 h-2 bg-black rounded-sm m-0.5" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Date */}
        <Text className="text-gray-600 text-sm mb-4">SAT, 25 FEB 2025</Text>

        {/* User Profile */}
        <View className="bg-white rounded-2xl p-4 mb-6 flex-row items-center">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold">Hello, Isabell</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-orange-500 font-medium">87% Healthy</Text>
              <View className="bg-orange-100 px-2 py-1 rounded-full ml-2">
                <Text className="text-orange-600 text-xs font-medium">Pro Member</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">1</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-xl p-3 mb-6 flex-row items-center">
          <TextInput 
            placeholder="Search here..."
            className="flex-1 text-gray-600"
            placeholderTextColor="#9CA3AF"
          />
          <Feather name="search" size={20} color="#9CA3AF" />
        </View>

        {/* Browse by Specializations */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Browse by Specializations</Text>
            <Text className="text-blue-500 font-medium">See All</Text>
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 bg-pink-500 rounded-xl items-center justify-center mb-2">
                <Feather name="heart" size={24} color="white" />
              </View>
              <Text className="text-xs text-gray-600">Heart</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 bg-orange-400 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="accessibility" size={24} color="white" />
              </View>
              <Text className="text-xs text-gray-600">Bone</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 bg-green-500 rounded-xl items-center justify-center mb-2">
                <FontAwesome5 name="apple-alt" size={20} color="white" />
              </View>
              <Text className="text-xs text-gray-600">Nutrition</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="local-hospital" size={24} color="white" />
              </View>
              <Text className="text-xs text-gray-600">Tooth</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 bg-purple-500 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="coronavirus" size={24} color="white" />
              </View>
              <Text className="text-xs text-gray-600">Disease</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 bg-red-400 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="medical-services" size={20} color="white" />
              </View>
              <Text className="text-xs text-gray-600">Sur...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Overview */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Health Overview</Text>
          
          <View className="flex-row mb-4">
            {/* Heart Rate */}
            <View className="flex-1 bg-white rounded-2xl p-4 mr-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Heart Rate</Text>
                <Feather name="heart" size={16} color="#EF4444" />
              </View>
              <Text className="text-2xl font-bold mb-2">97 <Text className="text-sm font-normal text-gray-500">bpm</Text></Text>
              <View className="h-8 flex-row items-end">
                {[20, 30, 25, 35, 30, 40, 35, 30].map((height, index) => (
                  <View 
                    key={index}
                    className="flex-1 bg-pink-200 rounded-t mx-0.5"
                    style={{ height: height }}
                  />
                ))}
              </View>
            </View>

            {/* Blood Pressure */}
            <View className="flex-1 bg-white rounded-2xl p-4 ml-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Blood Pressure</Text>
                <View className="w-4 h-4 bg-purple-500 rounded-full" />
              </View>
              <Text className="text-2xl font-bold mb-2">112 <Text className="text-sm font-normal text-gray-500">mmHg</Text></Text>
              <View className="h-8 flex-row items-end">
                {[25, 20, 30, 35, 25, 40, 30, 35].map((height, index) => (
                  <View 
                    key={index}
                    className="flex-1 bg-purple-200 rounded-t mx-0.5"
                    style={{ height: height }}
                  />
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row">
            {/* Weight */}
            <View className="flex-1 bg-white rounded-2xl p-4 mr-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Weight</Text>
                <MaterialIcons name="monitor-weight" size={16} color="#6B7280" />
              </View>
              <Text className="text-2xl font-bold mb-2">97 <Text className="text-sm font-normal text-gray-500">lbs</Text></Text>
              <View className="h-8 flex-row items-end">
                {[30, 25, 20, 35, 25, 30, 35, 25].map((height, index) => (
                  <View 
                    key={index}
                    className="flex-1 bg-gray-200 rounded-t mx-0.5"
                    style={{ height: height }}
                  />
                ))}
              </View>
            </View>

            {/* Nutrition */}
            <View className="flex-1 bg-white rounded-2xl p-4 ml-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Nutrition</Text>
                <FontAwesome5 name="apple-alt" size={14} color="#10B981" />
              </View>
              <Text className="text-2xl font-bold mb-2">158 <Text className="text-sm font-normal text-gray-500">mg</Text></Text>
              <View className="h-8 flex-row items-end">
                {[20, 35, 25, 30, 40, 25, 35, 30].map((height, index) => (
                  <View 
                    key={index}
                    className="flex-1 bg-green-200 rounded-t mx-0.5"
                    style={{ height: height }}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Doctors Near You */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Doctors Near You (55)</Text>
            <TouchableOpacity>
              <Feather name="more-horizontal" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl p-4">
            <View className="flex-row items-center">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face' }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-semibold text-base">Dr. Mikasa Yellow</Text>
                <Text className="text-gray-600 text-sm">Orthopedic</Text>
                <Text className="text-gray-500 text-xs mt-1">8:01am</Text>
              </View>
              <TouchableOpacity>
                <Feather name="chevron-right" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-black rounded-t-3xl px-4 py-3 flex-row justify-around items-center">
        <TouchableOpacity className="items-center">
          <Feather name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center bg-green-500 p-3 rounded-2xl">
          <MaterialIcons name="bar-chart" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="message-square" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="calendar" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HealthDashboard;