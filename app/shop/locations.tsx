import { Feather, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native";
import { RootState } from "@/src/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getFrom, GridLoader } from "@/src/components/utils";
import { BASE_URL } from "@/src/constants";
import { useEffect, useState } from "react";
import { dumpCart, setLocation, setModal } from "@/src/store/slices/slices";
import colors from "tailwindcss/colors";

function Locations() {
    const { Area: selectedArea, LocationId: locationId } = useSelector((state: RootState) => state.appData.location);
    
    const compCode = useSelector((state: RootState) => state.compCode);
    const [searchKey, setSearchKey] = useState({query: '', filterBy: 'INTDOCT'});

    //   -------------------- Area -------------------------------------------------------------------------------------------------------------------------------------------------

    const [autoCompleteList2, setAutoCompleteList2] = useState({loading: false, data: {LocationMasterList: []}, err: {status: false, msg: ''}}); 
    const [area, setArea] = useState('');
    const businessTypeId = useSelector((i: RootState) => i.appData.businessType.CodeId)

    useEffect(() => {
        const getAreaResult = async (companyCode: string, key: string, businessType: string) => {                  
            if (!companyCode) return alert('no companyCode received');                  
            if (!businessType) return console.log('No Business type id recieved.');                  
            const res = await getFrom(`${BASE_URL}/api/Location/Get?CID=${companyCode}&SearchStr=${key}&BusinessTypeId=${businessType}`, {}, setAutoCompleteList2);
            if (res) {                                                                   
                setAutoCompleteList2(res);
                if (!locationId) {                   
                    getServiceLocations(res.data.LocationMasterList[0]?.Area)
                }
            } else {
                console.log('No data received');
            }
        }  
        const timer = setTimeout(() => {
            //   if (area.length < 1) return;
            getAreaResult(compCode, area, businessTypeId);                                       //  to initially populate area.                  
        }, 500);
        return () => clearTimeout(timer);
    }, [area, compCode, businessTypeId])

    //   -------------------- Area -------------------------------------------------------------------------------------------------------------------------------------------------

    const [locationList, setLocationList] = useState({loading: true, data: {LocationMasterList: []}, err: {status: false, msg: ''}});
    const dispatch = useDispatch();

    useEffect(() => {
        if (!selectedArea) return;
        getServiceLocations(selectedArea)
    }, [businessTypeId])

    const handleSelect = (i: any) => {
        let item = { Address: i.Address, StateDesc: i.StateDesc, StateCode: i.StateCode, PIN: i.PIN, Area: i.Area, LocationId: i.LocationId, LocationName: i.LocationName };
        dispatch(dumpCart())
        dispatch(setLocation(item));
        dispatch(setModal({ name: 'LOCATIONS', state: false }));
    }

    // useEffect(() => {
        const getServiceLocations = async (query: string) => {                                              // &BusinessTypeId=${businessTypeId}
            const res = await getFrom(`${BASE_URL}/api/Location/Get?CID=${compCode}&Area=${query}&SearchStr=`, {}, setLocationList);            // using useCallback to avoid esling warning about useEffect dependencies.
            if (res) {              
                setLocationList(res);   
            }
        }
        // getServiceLocations();
    // }, [area])

    const renderLocationList = (data: any) => {
        if (data.loading) {
            return <GridLoader />;
        } else if (data.err.status) {
            return <View className='text-center my-5'><Text className="text-rose-500">An error occured, please try again later. Error code: <Text className='text-dark'>{data.err.msg}</Text></Text></View>;
        } else if (data.data.LocationMasterList.length === 0) {
            return <View className="px-6 bg-white py-6 rounded-lg shadow-sm"><Text className='text-rose-500 mt-2 text-center leading-8'>Now we have no service in this PIN - We will be available in your area very soon.</Text></View>;
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
            <TouchableOpacity onPress={() => handleSelect({ ...data, area: area })} className={`bg-white border-gray-200 border-b flex-row gap-4 items-center justify-between shadow-sm p-4 rounded-xl`}>
                <View className="flex-row items-start flex-1 gap-4">
                    <View className="bg-blue-500 w-[3rem] h-[3.2rem] rounded-2xl items-center justify-center">
                        <FontAwesome6 name="user-doctor" size={23} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-800 font-semibold text-[1rem] leading-6 mb-2">{data.LocationName}</Text>
                        <Text className="text-gray-500 text-sm">{(data.Address).trim()}</Text>
                    </View>
                </View>
                {data.LocationId === locationId ? 
                <View className="flex-row items-center gap-2 p-[0.6rem] bg-fuchsia-100 rounded-full">
                    <FontAwesome5 name="check" size={18} color={colors.fuchsia[500]} />
                </View>
                :
                <Feather name={'chevron-right'} size={30} color='gray' />}
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className="p-4">
                <View className='relative'>
                    <TouchableOpacity  onPress={() => dispatch(setModal({name: 'LOCATIONS', state: false}))} className="absolute z-50 top-[13px] left-4">
                        <Ionicons name="arrow-back-outline" size={22} color="#3b82f6" />
                    </TouchableOpacity>
                    <View className='z-10'>
                        <TextInput value={area} onChangeText={(text) => setArea(text)} placeholder='Search Doctors..' className='bg-white pl-[3.5rem] pr-4 py-[1.1rem] rounded-full shadow-md shadow-blue-500' />
                    </View>
                    <Feather className='absolute z-50 top-[4px] right-[3px] bg-primary-500 py-[10px] px-[11px] rounded-full items-center' name="sliders" size={21} color="#fff" />
                </View>
                {autoCompleteList2.data.LocationMasterList.length ? <><Text className="py-5 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Top Searches</Text>
                <View className="flex-wrap flex-row gap-[9px]">
                    {autoCompleteList2.data.LocationMasterList.map((item: any, index: number) => {
                        return (
                            <TouchableOpacity onPress={() => getServiceLocations(item.Area)} className={`flex-row px-4 py-2 rounded-2xl self-start border border-slate-300 ${(item.Area)?.toLowerCase() === selectedArea?.toLowerCase() ? 'bg-slate-600' : 'bg-[#e4f0ff]'}`} key={index}>
                                <Text className={`font-PoppinsMedium text-[12px] ${(item.Area)?.toLowerCase() === selectedArea?.toLowerCase() ? 'text-white' : 'text-sky-700'}`}>{item.Area}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View></> : null}
                <Text className="pt-5 pb-2 font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5 mt-2">Select Your Location</Text>
                <View className='mt-3'>
                    {renderLocationList(locationList)}
                </View>
            </View>
        </ScrollView>
    )
}

export default Locations;