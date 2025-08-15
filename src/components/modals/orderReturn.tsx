import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { num, OrderItemCard } from "../utils";
import ButtonPrimary from "..";

const OrderReturn = ({ order, orderS, handleShow }: any) => {
    
    return (
        <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => handleShow(false)} className="flex-row items-center">
                <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
                <Text className="text-lg font-semibold text-black">Return Order</Text>
                </TouchableOpacity>
            </View>
            <View className='bg-white rounded-3xl shadow-sm border-b border-gray-200'>
                <View className='justify-between flex-row p-4 items-center border-b border-gray-200'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Order ID</Text>
                    </View>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">{order.VchNo}</Text>
                </View>
    
                <View className='flex-row gap-3 p-4'>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[14px] mr-auto">Order Total</Text>
                    <Text className={`font-PoppinsSemibold text-sky-600 text-[14px]`}>₹ {num(order.Amount)}</Text>
                </View>
            </View>
            <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Products List</Text>
            <View className='gap-3'>
                {order?.SalesDetailsList?.map((item, index) => <OrderItemCard data={item} key={index} />)}
            </View>
            <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Address Details</Text>
            <View className='bg-white rounded-3xl px-4 py-2 mb-3 shadow-sm border-b border-gray-200'>
                <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                    <Text className="text-slate-600 font-bold text-[13px] mr-auto">Name :</Text>
                    <Text className="text-[13px] text-slate-700 font-medium">{order.CashPartyName}</Text>
                </View>
                <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                    <Text className="text-slate-600 font-bold text-[13px] mr-auto">Address :</Text>
                    <Text className="text-[13px] text-slate-700 font-medium">{order.PartyAddress}</Text>
                </View>
    
                <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                    <Text className="text-slate-600 font-bold text-[13px] mr-auto">Order Total :</Text>
                    <Text className="text-[13px] text-slate-700 font-medium">₹ {num(order.Amount)}</Text>
                </View>
                <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                    <Text className="text-slate-600 font-bold text-[13px] mr-auto">Total Paid :</Text>
                    <Text className="text-[13px] text-orange-600 font-semibold">₹ {num(order.Amount)}</Text>
                </View>
                <View className='flex-row gap-3 px-1 py-[0.9rem]'>
                  <Text className="text-slate-600 font-bold text-[13px] mr-auto">Total Refund :</Text>
                  <Text className="text-[13px] text-green-600 font-semibold">₹ {num(order.Amount)}</Text>
                </View>
            </View>
            {order.EnqFollowUpList?.length ? <>
            <Text className='text-[1.05rem] mb-3 mt-1 font-PoppinsSemibold'>Return Status</Text>
            <View className="bg-white shadow-sm border-b border-gray-200 rounded-3xl py-6 pl-5 pr-6 mb-3">           
                <View className="relative gap-5">
                    {orderS?.map((step, index) => (
                      <View key={index} className="flex-row items-start">
                          {index < orderS?.length - 1 && (<View className={`absolute left-4 top-8 w-0.5 h-12 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}/>)}
                          <View className={`w-8 h-8 rounded-full items-center justify-center z-10 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}>
                              <Feather name={step.icon} size={16} color={step.completed ? 'white' : '#9CA3AF'} />
                          </View>
                          <View className="flex-1 ml-4">
                              <Text className={`font-semibold text-base mb-[0.4rem] ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {step.title}
                              </Text>
                              <Text className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                                  {step.date}
                              </Text>
                          </View>
                          <View className="my-auto">
                              <FontAwesome5 name="check" size={18} color={step.completed ? '#D97706' : '#9ca3af'} />
                          </View>
                      </View>
                  ))}
                </View>
            </View></> : null}
            <View className="flex-row gap-4 mt-1">
                <ButtonPrimary title='SUBMIT REQUEST' isLoading={false} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-gray-700' />
                <ButtonPrimary title='CANCEL' isLoading={false} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-rose-600' />
            </View>
        </ScrollView>
      )
}

export default OrderReturn;