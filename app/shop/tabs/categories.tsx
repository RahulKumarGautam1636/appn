import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

const Categories = () => {
    const router = useRouter();
    return (
        <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
        <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
            <Text className="text-lg font-semibold text-black">Categories</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}

export default Categories;


