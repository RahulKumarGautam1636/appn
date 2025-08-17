import { CatCard, GridLoader } from "@/src/components/utils";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router";
import { useRouter } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux";

const Categories = () => {
    const router = useRouter();
    const { categories: categoriesData } = useSelector((i: RootState) => i.siteData);
    return (
        <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
            <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
                <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
                <Text className="text-lg font-semibold text-black">Featured Categories</Text>
                </TouchableOpacity>
            </View>

            <View className='pt-5'>
                {(() => {
                    if (categoriesData.loading) {
                        return <GridLoader classes='h-[118px] w-[138px] rounded-xl' containerClass='flex-row gap-3 m-4' />;
                    } else if (categoriesData.error) {
                        return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{categoriesData.error}</Text>;
                    } else {
                    return (
                        <View className="flex-row justify-between flex-wrap" style={{columnGap: '5%'}}>
                            {categoriesData.LinkCategoryList.map((i, n) => (<CatCard data={i} key={n} classes='!mb-[1.5rem]' styles={{width: '47.5%'}} />))}
                        </View>
                    )
                    }
                })()}
            </View>
        </ScrollView>
    )
}

export default Categories;


