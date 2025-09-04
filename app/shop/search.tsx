import { Feather, Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { Card_1 } from "@/src/components";
import { RootState } from "@/src/store/store";
import { useSelector } from "react-redux";
import { ProductCard, getFrom, getRequiredFields, wait, GridLoader } from "@/src/components/utils";
import { BASE_URL, defaultId, zero } from "@/constants";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

function MainSearch() {
    const locationId = useSelector((state: RootState) => state.appData.location.LocationId);
    const compCode = useSelector((state: RootState) => state.compCode);
    const [products, setProducts] = useState({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}}); 
    const [searchTerm, setSearchTerm] = useState({query: '', filterTerm: 'All', filterId: ''});

    const topSearches = ['Tab', 'Calpol', 'Pan', 'Parace', 'Dynap', 'Cap', 'Forte']
    const router = useRouter();

    useEffect(() => {
        let controller = new AbortController();
        const getSearchResult = async (companyCode: string, key, signal) => {                      
            if (!companyCode) return alert('no companyCode received');                  
            const res = await getFrom(`${BASE_URL}/api/item/Get?CID=${companyCode}&SearchStr=${key.query}&LOCID=${locationId}`, {}, setProducts, signal);
            if (res) {                                                                    
                let requiredFields = getRequiredFields(res.data.itemMasterCollection);
                setProducts(pre => ({ ...pre, loading: false, data: {itemMasterCollection: requiredFields }}));
            } else {
                console.log('No data received');
            }
        }  

        const timer = setTimeout(() => {
            if (searchTerm.query.length === 0) return setProducts({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
            getSearchResult(compCode, searchTerm, controller.signal);  
        }, 1000);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchTerm, compCode, locationId])

    const renderProducts = (data: any) => {
        if (data.loading) return <GridLoader />
        return (
            <FlatList
                data={data.data.itemMasterCollection.slice(0, 30)}
                renderItem={({ item }) =>  <ProductCard parent="Search" type="list" data={item} key={item.LocationItemId} />}
                keyExtractor={(item) => item.LocationItemId.toString()}
                className="overflow-visible"
                contentContainerClassName="gap-3"
                scrollEnabled={false}
            />
        )
    }

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className="p-4">
                <View className='relative'>
                    <TouchableOpacity onPress={() => router.back()} className="absolute z-50 top-[13px] left-4">
                        <Ionicons name="arrow-back-outline" size={22} color="#3b82f6" />
                    </TouchableOpacity>
                    <View className='z-10'>
                        <TextInput value={searchTerm.query} onChangeText={(text) => setSearchTerm(pre => ({...pre, query: text }))} placeholder='Search Products...' className='bg-white pl-[3.5rem] pr-4 py-[1.1rem] rounded-full shadow-md shadow-blue-500' />
                    </View>
                    <Feather className='absolute z-50 top-[4px] right-[3px] bg-primary-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                </View>
                <Text className="py-5 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Top Searches</Text>
                <View className="flex-wrap flex-row gap-[9px]">
                    {topSearches.map((item: any, index: number) => {
                        return (
                            <TouchableOpacity onPress={() => setSearchTerm(pre => ({...pre, query: item}))} className={`flex-row px-4 py-2 rounded-2xl self-start border border-slate-300 bg-[#e4f0ff]`} key={index}>
                                <Text className={`font-PoppinsMedium text-[12px] text-sky-700`}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Text className="pt-5 pb-2 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5 mt-2">{products.data.itemMasterCollection.length}  Products Found</Text>
                <View className='mt-2'>
                    {renderProducts(products)}
                </View>
            </View>
        </ScrollView>
    )
}

export default MainSearch;