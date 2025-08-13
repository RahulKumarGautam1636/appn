import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { Card_1 } from "@/src/components";
import { RootState } from "@/src/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getFrom, GridLoader } from "@/src/components/utils";
import { BASE_URL, defaultId, zero } from "@/constants";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { setLocation, setModal } from "@/src/store/slices/slices";

function Locations() {
    // const depts = useSelector((state: RootState) => state.depts);
    const compCode = useSelector((state: RootState) => state.compCode);
    const [doctors, setDoctors] = useState({loading: false, data: {PartyMasterList: [], CompanyMasterList: []}, err: {status: false, msg: ''}}); 
    const [searchKey, setSearchKey] = useState({query: 'roha', filterBy: 'INTDOCT'});

    const topSearches = ['Asif', 'Rohan', 'Banerjee', 'Sinha', 'Das', 'Roy', 'Rohit']
    const router = useRouter();

    // useEffect(() => {
    //     const getSearchResult = async (companyCode: string, key: { filterBy: string, query: string}) => {                      
    //     if (!companyCode) return alert('no companyCode received');                  
    //     const res = await getFrom(`${BASE_URL}/api/search/Get?CID=${companyCode}&Type=${key.filterBy}&SearchString=${key.query}`, {}, setDoctors);
    //     if (res) {
    //         // console.log(res);            
    //         setDoctors(res);
    //     } else {
    //         console.log('No data received');
    //     }
    //     }  
    //     const timer = setTimeout(() => {
    //     if (searchKey.query.length < 2) return;
    //     console.log(compCode, defaultId);
    //     if (compCode === defaultId) {
    //         getSearchResult(zero, searchKey);                 // search every company if default company compCode.
    //     } else {
    //         getSearchResult(compCode, searchKey);             // search only the current company if not default company compCode.
    //     }
    //     }, 500);
    //     return () => clearTimeout(timer);
    // }, [searchKey, zero, compCode])

    // const renderDoctors = (data: any) => {
    //     if (data.loading) return <GridLoader />
    //     if (searchKey.filterBy === 'INTDOCT') {
    //         return (
    //             <FlatList
    //                 data={data.data.PartyMasterList.slice(0, 35)}
    //                 renderItem={({ item }) =>  <Card_1 data={item} selectedDate={''} />}
    //                 keyExtractor={(item) => item.PartyCode.toString()}
    //                 className="overflow-visible"
    //                 contentContainerClassName="gap-4"
    //                 scrollEnabled={false}
    //             />
    //         )
    //     }
    // }


    // ------------------------------------------------------

    const [locationList, setLocationList] = useState({loading: true, data: {LocationMasterList: []}, err: {status: false, msg: ''}});
    const area = 'Kalyani' // modals.LOCATION_MODAL.data;
    const dispatch = useDispatch();

    const handleSelect = (i: any) => {
        // let cartItems = getTotalCartItems(cart);
        // if (cartItems) {
        //     if (getConfirmation(`Changing Location will remove the Products in your cart and wishlist.`) === false) return; 
        // }
        // cartAction('EMPTY_CART', {}, '');
        // wishlistAction('EMPTY_WISHLIST', {}, '');
        let item = { Address: i.Address, StateDesc: i.StateDesc, StateCode: i.StateCode, PIN: i.PIN, Area: i.Area, LocationId: i.LocationId, LocationName: i.LocationName };
        dispatch(setLocation(item));
        dispatch(setModal({ name: 'LOCATIONS', state: false }));
        // localStorage.setItem(`userLocation_${compCode}`, JSON.stringify(item));
    }

    useEffect(() => {
        const getServiceLocations = async () => {
            const res = await getFrom(`${BASE_URL}/api/Location/Get?CID=${compCode}&Area=${area}&SearchStr=`, {}, setLocationList);            // using useCallback to avoid esling warning about useEffect dependencies.
            if (res) {              
                setLocationList(res);   
            }
        }
        getServiceLocations();
    }, [])

    const renderLocationList = (data: any) => {
        if (data.loading) {
            return <GridLoader />;
        } else if (data.err.status) {
            return <div className='text-center my-5'><h2 className="text-danger mark">An error occured, please try again later. Error code: <span className='text-dark'>{data.err.msg}</span></h2></div>;
        } else if (data.data.LocationMasterList.length === 0) {
            return <p className='text-danger mb-0 mt-2'>Now we have no service in this PIN - We will be available in your area very soon.</p>;
        } else {
            // return <AutoComplete name='location-list' customClass='location-list' list={locationList.data.LocationMasterList} children={<LocationCard handleSelect={handleSelect} selectedLocation={globalData.location.LocationId} />} keyName={'LocationId'} itemName='Location(s) in the selected area.' closeIcon={false}/>
            return (
                <FlatList
                    data={locationList.data.LocationMasterList}
                    renderItem={({ item }) =>  <LocationCard data={item} handleSelect={handleSelect}/>}
                    keyExtractor={(item) => item.LocationId.toString()}
                    className="overflow-visible"
                    contentContainerClassName="gap-4"
                    scrollEnabled={false}
                />
            )
        }
    } 
    
    const LocationCard = ({ data, handleSelect }: any) => {
        return (
            <TouchableOpacity onPress={() => handleSelect(data)} className="flex-row gap-4 items-center justify-between bg-white border-b shadow-sm border-gray-200 p-4 rounded-xl">
                <View className="flex-row items-start flex-1 gap-4">
                    <View className="bg-blue-500 w-[3rem] h-[3rem] rounded-2xl items-center justify-center">
                        <FontAwesome6 name="user-doctor" size={23} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-800 font-semibold text-[1rem] leading-6 mb-2">{data.LocationName}</Text>
                        <Text className="text-gray-400 text-sm">{(data.Address).trim()}</Text>
                    </View>
                </View>
                <Feather name="chevron-right" size={30} color='gray' />
            </TouchableOpacity>
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
                        <TextInput value={searchKey.query} onChangeText={(text) => setSearchKey(pre => ({...pre, query: text }))} placeholder='Search Doctors..' className='bg-white pl-[3.5rem] pr-4 py-[1.1rem] rounded-full shadow-md shadow-blue-500' />
                    </View>
                    <Feather className='absolute z-50 top-[4px] right-[3px] bg-primary-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                </View>
                {/* <Text className="py-5 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Top Searches</Text>
                <View className="flex-wrap flex-row gap-[9px]">
                    {topSearches.map((item: any, index: number) => {
                        return (
                            <TouchableOpacity onPress={() => setSearchKey(pre => ({...pre, query: item}))} className={`flex-row px-4 py-2 rounded-2xl self-start border border-slate-300 bg-[#e4f0ff]`} key={index}>
                                <Text className={`font-PoppinsMedium text-[12px] text-sky-700`}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View> */}
                <Text className="pt-5 pb-2 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5 mt-2">Select Your Location</Text>
                <View className='mt-3'>
                    {renderLocationList(locationList)}
                </View>
            </View>
        </ScrollView>
    )
}

export default Locations;