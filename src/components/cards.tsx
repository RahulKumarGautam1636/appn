import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, removeFromCart } from "../store/slices/slices";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { mmDDyyyyDate } from ".";
import colors from "tailwindcss/colors";

export default function LabCard({ data, testDate, classes }: any) {

    const dispatch = useDispatch();
    // const lab = useSelector((i: RootState) => i.cart)
    // const labTests = Object.values(lab);
    // const isAdded = labTests.find((i: any) => i.LocationItemId === data.LocationItemId);
    const isAdded = useSelector((i: RootState) => Object.values(i.cart).some((x : any) => x.LocationItemId === data.LocationItemId));
    const handleAdd = () => {
        if (isAdded) {
            dispatch(removeFromCart(data.LocationItemId));
        } else {
            dispatch(addToCart({...data, testDate: testDate}));
        }
    }   

    return (
        <TouchableOpacity key={data.ItemId} onPress={handleAdd} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-lg border-b-2 border-gray-300 p-3 ${classes}`}>
            <View className="mt-1 uppercase h-[40px] w-[40px] items-center justify-center rounded-xl bg-fuchsia-600">
                <Ionicons name={'flask'} size={19} color={'#fff'} />
            </View>
            <View className='mr-auto flex-1'>
                <Text className="font-PoppinsSemibold text-sky-800 leading-6 text-[12px]">{data.Description}</Text>
                <Text className="text-gray-500 mt-[4px] text-[11px] font-PoppinsMedium">{data.CategoryName}</Text>
                <View className='flex-row gap-3 items-end mt-[5px]'>
                    <Text className="mt-1.5 text-[12px] text-blue-600 font-PoppinsSemibold leading-4"><FontAwesome name="rupee" size={12} color="#2563eb" /> {data.SRate}</Text>
                    <Text className="text-red-700 opacity-65 mt-1.5 text-[12px] font-PoppinsMedium leading-4 line-through"><FontAwesome name="rupee" size={12} color="#b91c1c" /> {data.ItemMRP}</Text>
                </View>
            </View>
            {/* {isAdded ?
            <Ionicons name="cart" className='p-[9px] bg-sky-100 rounded-full my-auto' size={19} color={colors.sky[500]} /> :
            <Ionicons name="cart-outline" className='p-[9px] bg-sky-50 rounded-full my-auto' size={19} color={colors.sky[500]} />} */}
            
            {isAdded ?
            <View className='px-3 py-[7px] bg-sky-500 rounded-lg my-auto'>
                <Text className="text-white">Remove</Text>
            </View> :
            <View className='px-4 py-[7px] bg-sky-100 rounded-lg my-auto'>
                <Text className="text-sky-500">Add</Text>
            </View>}
            
        </TouchableOpacity>
    )
}

export const LabCartCard = ({ data }: any) => {
    const dispatch = useDispatch()
    const [date, setDate] = useState({ active: false, value: new Date()});

    const [day, month, year] = data.testDate.split('/').map(Number);
    let parsedActiveDate = new Date(year, month - 1, day);
    let formattedDate = new Date(parsedActiveDate);

    useEffect(() => {
        setDate(pre => ({...pre, value: formattedDate}))
    }, [])

    return (
        <View className='bg-white rounded-2xl shadow-lg border-b-2 border-gray-300' key={data.ItemId}>
            <View className='p-4'>
                <Text className="font-PoppinsSemibold text-sky-800">{data.Description}</Text>
                <View className='flex-row gap-4 items-end justify-between w-full mt-[6px]'>
                    <View>
                        <Text className="text-gray-500 text-sm font-PoppinsMedium">{data.CategoryName}</Text>
                        <View className='flex-row gap-4 items-center mt-1'>
                            <Text className="mt-2 text-[13px] text-blue-600 font-PoppinsSemibold leading-5"><FontAwesome name="rupee" size={13} color="#2563eb" /> {data.SRate}</Text>
                            <Text className="text-red-700 opacity-65 mt-2 text-sm font-PoppinsSemibold leading-5">X  {data.count}</Text>
                        </View>
                    </View>
                    <View className='flex-row gap-4 items-center'>
                        <View className='px-[10px] py-[8px] bg-gray-100 rounded-full justify-between gap-4 ml-auto flex-row shadow-sm shadow-gray-500'>
                            <TouchableOpacity onPress={() => {if (data.count !== 1) dispatch(addToCart({...data, count: data.count - 1}))}}>
                                <Feather name="minus" size={16} color="#6b7280" />
                            </TouchableOpacity>
                            <Text className='leading-6 font-PoppinsSemibold'>{data.count}</Text>
                            <TouchableOpacity onPress={() => dispatch(addToCart({...data, count: data.count + 1}))}>
                                <Feather name="plus" size={16} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => dispatch(removeFromCart(data.LocationItemId))}>
                            <Feather name="trash-2" size={19} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Pressable onPress={() => setDate(pre => ({...pre, active: true}))} className='flex-row w-full p-4 border-t border-gray-200 items-center'>
                <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-6 mr-auto">Test Date :</Text>
                <Text className="font-PoppinsMedium text-slate-500 text-[13px] leading-6 mr-2">{new Date(date.value).toLocaleDateString('en-TT')}</Text>
                <Feather name="chevron-down" size={22} color='gray' />
                {date.active ? <DateTimePicker value={date.value} mode="date" display="default" onChange={(e, d) => setDate({active: false, value: d})} /> : null}
            </Pressable> 
        </View>
    )
}