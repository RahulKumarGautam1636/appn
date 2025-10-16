import { Feather, Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { Card_1 } from "../src/components";
import { RootState } from "@/src/store/store";
import { useSelector } from "react-redux";
import { getFrom, GridLoader } from "../src/components/utils";
import { BASE_URL, defaultId, zero } from "@/src/constants";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

function MainSearch() {
    // const depts = useSelector((state: RootState) => state.depts);
    const compCode = useSelector((state: RootState) => state.compCode);
    const [doctors, setDoctors] = useState({loading: false, data: {PartyMasterList: [], CompanyMasterList: []}, err: {status: false, msg: ''}}); 
    const [searchKey, setSearchKey] = useState({query: 'roha', filterBy: 'INTDOCT'});

    const topSearches = ['Asif', 'Rohan', 'Banerjee', 'Sinha', 'Das', 'Roy', 'Rohit']
    const router = useRouter();

    useEffect(() => {
        const getSearchResult = async (companyCode: string, key: { filterBy: string, query: string}) => {                      
        if (!companyCode) return alert('no companyCode received');                  
        const res = await getFrom(`${BASE_URL}/api/search/Get?CID=${companyCode}&Type=${key.filterBy}&SearchString=${key.query}`, {}, setDoctors);
        if (res) {          
            setDoctors(res);
        } else {
            console.log('No data received');
        }
        }  
        const timer = setTimeout(() => {
        if (searchKey.query.length < 2) return;
        if (compCode === defaultId) {
            getSearchResult(zero, searchKey);                 // search every company if default company compCode.
        } else {
            getSearchResult(compCode, searchKey);             // search only the current company if not default company compCode.
        }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchKey, zero, compCode])

    const renderDoctors = (data: any) => {
        if (data.loading) return <GridLoader />
        if (searchKey.filterBy === 'INTDOCT') {
            return (
                <FlatList
                    data={data.data.PartyMasterList.slice(0, 35)}
                    renderItem={({ item }) =>  <Card_1 data={item} selectedDate={''} />}
                    keyExtractor={(item) => item.PartyCode.toString()}
                    className="overflow-visible"
                    contentContainerClassName="gap-4"
                    scrollEnabled={false}
                />
            )
        }
    }

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className="p-4">
                <View className='relative'>
                    <TouchableOpacity onPress={() => router.back()} className="absolute z-50 top-[13px] left-4">
                        <Ionicons name="arrow-back-outline" size={22} color="#3b82f6" />
                    </TouchableOpacity>
                    <View className='z-10'>
                        <TextInput placeholderTextColor={'#6b7280'} value={searchKey.query} onChangeText={(text) => setSearchKey(pre => ({...pre, query: text }))} placeholder='Search Doctors..' className='bg-white pl-[3.5rem] pr-4 py-[1.1rem] rounded-full shadow-md shadow-blue-500' />
                    </View>
                    <Feather className='absolute z-50 top-[4px] right-[3px] bg-primary-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                </View>
                <Text className="py-5 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Top Searches</Text>
                <View className="flex-wrap flex-row gap-[9px]">
                    {topSearches.map((item: any, index: number) => {
                        return (
                            <TouchableOpacity onPress={() => setSearchKey(pre => ({...pre, query: item}))} className={`flex-row px-4 py-2 rounded-2xl self-start border border-slate-300 bg-[#e4f0ff]`} key={index}>
                                <Text className={`font-PoppinsMedium text-[12px] text-sky-700`}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Text className="pt-5 pb-2 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5 mt-2">Popular Doctors</Text>
                <View className='mt-2'>
                    {renderDoctors(doctors)}
                </View>
            </View>
        </ScrollView>
    )
}

export default MainSearch;