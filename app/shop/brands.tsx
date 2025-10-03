import { CatCard, escape, GridLoader } from "@/src/components/utils";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router";
import { useRouter } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux";


const Categories = () => {
    const router = useRouter();
    const { products } = useSelector((i: RootState) => i.siteData);
    return (
        <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
            <View className="flex-row items-center justify-between border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
                <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
                <Text className="text-lg font-semibold text-black">Top Brands</Text>
                </TouchableOpacity>
            </View>

            <View className='pt-5'>
                {(() => {
                    if (products.loading) {
                        return <GridLoader classes='h-[118px] w-[138px] rounded-xl' containerClass='flex-row gap-3 m-4' />;
                    } else if (products.error) {
                        return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{products.error}</Text>;
                    } else {
                    return (
                        <View className="justify-between">
                            {products.ItemBrandList.map((i, n) => (
                                <Link href={`/shop/filters/?head=${escape(i.Text).swap}&brands=${i.Text}`} className="w-full mb-3 shadow-sm">
                                    <View key={n} className="items-center justify-center p-4 bg-white w-full">
                                        {/* <View className="bg-white rounded-full items-center justify-center mb-3 border-b-2 border-gray-200 p-4">
                                            <Image
                                            className='' 
                                            resizeMode='contain' 
                                            source={{uri: `https://pharma.takehome.live/assets/img/ePharma/brands-logo/${i.Text.trim()}.png`}} 
                                            style={{ width: 75, height: 75 }} 
                                            />
                                        </View> */}
                                        <Text className="text-lg text-gray-600 text-center">{i.Text.slice(0, 18)}</Text>
                                    </View>
                                </Link>
                            ))}
                        </View>
                    )
                    }
                })()}
            </View>
        </ScrollView>
    )
}

export default Categories;


