import { BASE_URL, hasAccess } from '@/src/constants';
import { CompCard } from '@/src/components';
import { BannerCarousel, getFrom, getRequiredFields, getRequiredFieldsOnly, GradientBG, GridLoader, ListLoader } from '@/src/components/utils';
import { addToCart, setModal } from '@/src/store/slices/slices';
import { RootState } from '@/src/store/store';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { myColors } from '@/src/constants';
import LabCard from '@/src/components/cards';
import DateTimePicker from '@react-native-community/datetimepicker';

const LabTests = ({}: any) => {
    const dispatch = useDispatch()
    const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);
    const compCode = useSelector((state: RootState) => state.compCode);
    const [labData, setLabData] = useState({loading: true, data: {ParentCategoryList: [], LinkSubCategoryList: [], itemMasterCollection: []}, err: {status: false, msg: ''}});
    const [investigationItem, setInvestigationItem] = useState({});
    const [date, setDate] = useState({ active: false, value: new Date()});
    const router = useRouter()
    const [ searchItem, setSearchItem ] = useState({name: ''});

    useFocusEffect(() => {
        if (!hasAccess("labtest", compCode)) {
            router.push('/appn/tabs/opd');
        }
    })

    useEffect(() => {
        const getLabData = async (company: any) => {                
            if (!company.EncCompanyId) return console.log('no companyCode received');                 
            if (!company.LocationId) return console.log('no Loc Id received');     
            const res = await getFrom(`${BASE_URL}/api/Pharma/Get?CID=${company.EncCompanyId}&LOCID=${company.LocationId}&CatType=INVESTIGATION`, {}, setLabData);
            if (res) {              
                const tests = getRequiredFields(res.data.itemMasterCollection, company.LocationId);
                setLabData(pre => ({ ...pre, loading: false, data: { ...res.data, itemMasterCollection: tests }}));        
                setInvestigationItem(res.data.ParentCategoryList[0]);
            } 
        }
        getLabData(selectedCompany);
        setSearchItem({name: ''});
    },[selectedCompany.EncCompanyId])
    
    useEffect(() => {
        const getSearchItems = async (company: any, query: string) => {
            if (!company.EncCompanyId || !investigationItem.Value || !query) return;
            setLabData(pre => ({ ...pre, loading: true }));
            const res = await axios.get(`${BASE_URL}/api/Item/Get?CID=${company.EncCompanyId}&LOCID=${company.LocationId}&SearchStr=${query}&CategoryIdList=${investigationItem.Value}&SubCategoryIdList&MFGList&SortBy&ExcludeOutOfStock`);
            if (res.status === 200) {
                setTimeout(() => {
                    const tests = getRequiredFields(res.data.itemMasterCollection, company.LocationId);
                    setLabData(pre => ({ ...pre, loading: false, data: { ...res.data, itemMasterCollection: tests }}));    // avoid updatating ParentCategoryList field.
                }, [800])
            }                                                                                                   
        }
        const timer = setTimeout(() => {
            if (searchItem.name.length < 1) return;
            getSearchItems(selectedCompany, searchItem.name);              
        }, 800);
        return () => clearTimeout(timer);
    },[searchItem.name, selectedCompany.EncCompanyId])

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <GradientBG>
            <View className=''>
                <BannerCarousel />
                <View className='p-4'>

                    {/* <View className='justify-between flex-row items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Clinic</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Pressable onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))}>
                                <Text className="font-PoppinsMedium text-primary-600 text-[15px] leading-[23px]">View All</Text>
                            </Pressable>
                        </View>
                    </View>                    
                    <ScrollView horizontal={true} contentContainerClassName='pt-3 pb-4 px-[2] gap-4' showsHorizontalScrollIndicator={false}>
                        {companyList.map((i: any) => <CompCard data={i} key={i.EncCompanyId} active={selectedCompany?.EncCompanyId === i.EncCompanyId}/>)}
                    </ScrollView> */}
                    
                    {/* <Text className="font-PoppinsSemibold text-gray-700 text-[16px] mb-2">Book Lab Tests</Text>  */}
                    {/* <TouchableOpacity onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))} className="bg-primary-500 gap-4 rounded-2xl mb-4 p-5 shadow-lg shadow-gray-400">
                        <Text className="font-PoppinsSemibold text-white text-[14px] border-b border-gray-200">Select Clinic</Text>   
                        <View className="gap-4 flex-row items-center justify-between rounded-2xl flex-1">
                            <View className='flex-1'>
                                <Text className="font-PoppinsMedium text-white text-[13px] pt-1 pb-[10px] leading-5" numberOfLines={1}>{selectedCompany.COMPNAME} </Text>
                                <View className='mt-1 gap-2 flex-row items-center'>
                                    <FontAwesome5 name="map-marker-alt" size={12} color="#fff" />
                                    <Text className="text-white font-Poppins text-[11px] leading-5" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                                </View>
                            </View>
                            <View className='px-[9px] py-[9px] bg-primary-400 rounded-full'>
                                <Feather name="chevron-down" size={18} color='#fff' />
                            </View>
                        </View> 
                    </TouchableOpacity> */}

                    <View className='justify-between flex-row items-center mb-3'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Clinic</Text>
                        </View>
                        <Pressable onPress={() => dispatch(setModal({ name: 'COMPANIES', state: true }))} className="gap-2 flex-row items-center ml-auto">
                            <Text className="font-PoppinsMedium text-sky-700 text-[13px] leading-4">{companyList.length} more clinics</Text>
                            <Feather name="chevron-down" size={24} color='#0369a1' />
                        </Pressable>
                    </View>

                    <View className='bg-primary-500 mb-[1.15rem] rounded-2xl shadow-md shadow-primary-700 overflow-hidden'>
                        <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                            <View className='flex-1'>
                                <Text className="font-PoppinsSemibold text-[15px] text-white" numberOfLines={1}>{selectedCompany.COMPNAME}</Text>
                                <View className='mt-[10px]'>
                                    <View className='flex gap-3 flex-row items-center'>
                                        <FontAwesome5 name="clock" size={14} color="#fff" />
                                        <Text className="font-PoppinsMedium text-gray-100 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                                    </View>
                                    <View className='flex gap-3 flex-row items-center mt-2'>
                                        <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />
                                        <Text className="font-Poppins text-gray-100 text-[11px] leading-5" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                                    </View>
                                </View>
                            </View>
                            <Link href={`/appn/clinic/${selectedCompany.CompanyId}`}>
                                <View>
                                    <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full'  />
                                </View>
                            </Link>
                        </View>
                    </View>
                    
                    <View className='bg-white mb-4 rounded-2xl shadow-lg border-b-2 border-gray-300'>
                        <View className='flex-row w-full px-5 py-[16px] border-b border-gray-200 items-center'>
                            <FontAwesome5 name="calendar-alt" size={21} color={myColors.primary[500]} />
                            <Text className="font-PoppinsMedium text-slate-500 text-[14px] leading-6 ml-4 mr-auto">Select Date:</Text>
                            <Pressable onPress={() => setDate(pre => ({...pre, active: true}))}>
                                <Text className="font-PoppinsMedium text-sky-700 text-[14px] leading-6 mr-2">{new Date(date.value).toLocaleDateString('en-TT')}</Text>
                            </Pressable>
                            {date.active ? <DateTimePicker value={date.value} mode="date" display="default" onChange={(e, d) => setDate({active: false, value: d})} /> : null}
                            <Feather name="chevron-down" size={22} color='gray' />
                        </View>               
                        <View className='flex-row gap-4 w-full p-4 items-center'>
                            <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pr-4'>
                                <TextInput value={searchItem.name} onChangeText={(text) => setSearchItem(pre => ({...pre, name: text }))} placeholder='Search Lab Tests..' placeholderTextColor="#9CA3AF" className='text-gray-700 py-4 items-start px-5 flex-1' />
                                <Feather className='' name="search" size={24} color={myColors.primary[500]} />
                            </View>
                        </View>
                    </View>
                    <View className='justify-between flex-row pt-1 pb-4 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Popular Tests</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                            <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                            <Text className="font-PoppinsMedium text-primary-600 text-[15px] leading-[23px]">View All</Text>
                        </View>
                    </View>
                    <RenderLabTest labData={labData} dateValue={date.value} />
                </View>
            </View>
            </GradientBG>
        </ScrollView>
    )
}


export default LabTests;


const RenderLabTest = memo(({ labData, dateValue }: any) => {

    const renderSlider = (data: any, parentId: any) => {    
        const productCategoryItems = data.data.itemMasterCollection.filter((i: any) => i.Category === parentId);   
        const parentCategoryName = data.data.ParentCategoryList.filter((i: any) => i.Value === parentId.toString())[0]?.Text;
        if (data.loading) {
          return <GridLoader />;
        } else if (data.err.status) {
          return;
        } else if (productCategoryItems.length === 0) {
          return;
        } else {
            return (
                <View className='gap-4'>
                    {productCategoryItems.map((i: any) => <LabCard key={i.LocationItemId} data={i} testDate={(dateValue).toLocaleDateString('en-TT')} />)}
                </View>
            ) 
        }
    }

    if (labData.loading) {
        return <GridLoader />;
    } else if (labData.data.ParentCategoryList.length === 0) {
        return <View className='text-center my-5 w-100'><Text className="text-info mark">No Products found !</Text></View>;
    } else {
        return labData.data.ParentCategoryList.map((i: any) => (<View key={i.Value}>{renderSlider(labData, parseInt(i.Value))}</View>))
    }
})