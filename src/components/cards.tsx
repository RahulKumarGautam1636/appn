import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../store/slices/slices";
import { RootState } from "../store/store";

export default function LabCard({ data }: any) {

    const dispatch = useDispatch();
    const lab = useSelector((i: RootState) => i.cart).lab
    const labTests = Object.values(lab);
    const isAdded = labTests.find((i: any) => i._id === data._id);

    return (
        <TouchableOpacity key={data.ItemId} onPress={() => dispatch(addToCart({type: 'lab', item: data}))} className="flex-row items-start gap-4 bg-white rounded-2xl shadow-lg p-4">
            <View className="mt-1 uppercase h-[45px] w-[45px] items-center justify-center rounded-xl bg-primary-500">
                <Ionicons name={'flask'} size={21} color={'#fff'} />
            </View>
            <View className='mr-auto flex-1'>
                <Text className="font-PoppinsSemibold text-sky-800" numberOfLines={1}>{data.Description}</Text>
                <Text className="text-gray-500 mt-1 text-sm font-PoppinsMedium">{data.CategoryName}</Text>
                <View className='flex-row gap-4 items-end mt-1'>
                    <Text className="mt-2 text-[13px] text-blue-600 font-PoppinsSemibold leading-5"><FontAwesome name="rupee" size={13} color="#2563eb" /> {data.SRate}</Text>
                    <Text className="text-red-700 opacity-65 mt-2 text-sm font-PoppinsMedium leading-5 line-through"><FontAwesome name="rupee" size={13} color="#b91c1c" /> {data.ItemMRP}</Text>
                </View>
            </View>
            {isAdded ?
            <Ionicons name="cart" className='p-[10px] bg-sky-100 rounded-full my-auto' size={21} color="#3b82f6" /> :
            <Ionicons name="cart-outline" className='p-[10px] bg-sky-50 rounded-full my-auto' size={21} color="#3b82f6" />}
            
        </TouchableOpacity>
    )
}