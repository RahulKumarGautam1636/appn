import { BASE_URL, defaultId, hasAccess } from '@/src/constants';
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
import colors from 'tailwindcss/colors';

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
                <View className='p-3'>

                    {compCode === defaultId || companyList.length > 1 ? <View className='mb-2'>
                        <View className='justify-between flex-row items-center mb-1'>
                            <View className='flex-row items-center gap-2'>
                                <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-4">Select Clinic</Text>
                            </View>
                            <View className="gap-2 flex-row items-center ml-auto">
                                {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                                <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                                <Pressable onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))}>
                                    <Text className="font-PoppinsMedium text-primary-600 text-[14px] leading-[20px]">View All</Text>
                                </Pressable>
                            </View>
                        </View>
                        <ScrollView horizontal={true} contentContainerClassName='py-2 px-[2] gap-3' showsHorizontalScrollIndicator={false}>
                            {companyList.map((i: any) => <CompCard data={i} key={i.EncCompanyId} active={selectedCompany?.EncCompanyId === i.EncCompanyId}/>)}
                        </ScrollView>
                    </View> : null}
                    
                    {/* <View className='justify-between flex-row items-center mb-2'>
                        <View className='flex-row items-center gap-2'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-4">Select Clinic</Text>
                        </View>
                        <Pressable onPress={() => dispatch(setModal({ name: 'COMPANIES', state: true }))} className="gap-2 flex-row items-center ml-auto">
                            <Text className="font-PoppinsMedium text-sky-700 text-[12px] leading-4">{companyList.length} more clinics</Text>
                            <Feather name="chevron-down" size={22} color='#0369a1' />
                        </Pressable>
                    </View>

                    <View className='bg-primary-500 mb-[0.9rem] rounded-2xl shadow-md shadow-primary-700 overflow-hidden'>
                        <View className='flex-row items-center gap-3 pl-4 pr-3 pb-4 pt-3 bg-primary-500 '>
                            <View className='flex-1'>
                                <Text className="font-PoppinsSemibold text-[13px] text-white" numberOfLines={1}>{selectedCompany.COMPNAME}</Text>
                                <View className='mt-[8px]'>
                                    <View className='flex gap-2 flex-row items-center'>
                                        <FontAwesome5 name="clock" size={12} color="#fff" />
                                        <Text className="font-PoppinsMedium text-gray-100 text-[10px] leading-4">08:30 AM - 12:00 PM</Text>
                                    </View>
                                    <View className='flex gap-2 flex-row items-center mt-1.5'>
                                        <FontAwesome5 name="map-marker-alt" size={12} color="#fff" />
                                        <Text className="font-Poppins text-gray-100 text-[10px] leading-4" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                                    </View>
                                </View>
                            </View>
                            <Link href={`/appn/clinic/${selectedCompany.CompanyId}`}>
                                <View>
                                    <Feather name="chevron-right" size={22} color="#fff" className='px-[8px] py-[8px] bg-primary-400 rounded-full'  />
                                </View>
                            </Link>
                        </View>
                    </View> */}
                    
                    <View className='bg-white mb-3 rounded-2xl shadow-lg border-b-2 border-gray-300'>
                        <View className='flex-row w-full px-4 py-[13px] border-b border-gray-200 items-center'>
                            <FontAwesome5 name="calendar-alt" size={19} color={myColors.primary[500]} />
                            <Text className="font-PoppinsMedium text-slate-500 text-[13px] leading-5 ml-3 mr-auto">Select Date:</Text>
                            <Pressable onPress={() => setDate(pre => ({...pre, active: true}))}>
                                <Text className="font-PoppinsMedium text-sky-700 text-[13px] leading-5 mr-2">{new Date(date.value).toLocaleDateString('en-TT')}</Text>
                            </Pressable>
                            {date.active ? <DateTimePicker value={date.value} mode="date" display="default" onChange={(e, d) => setDate({active: false, value: d})} /> : null}
                            <Feather name="chevron-down" size={20} color='gray' />
                        </View>               
                        <View className='flex-row gap-3 w-full p-3 items-center'>
                            <View className='w-full items-center flex-row rounded-2xl shadow-sm shadow-gray-500 bg-[#ebecef] pr-3'>
                                <TextInput placeholderTextColor={colors.gray[400]} value={searchItem.name} onChangeText={(text) => setSearchItem(pre => ({...pre, name: text }))} placeholder='Search Lab Tests..' className='text-gray-700 text-[13px] py-3 items-start px-4 flex-1' />
                                <Feather className='' name="search" size={22} color={myColors.primary[500]} />
                            </View>
                        </View>
                    </View>
                    <View className='justify-between flex-row pt-1 pb-4 items-center'>
                        <View className='flex-row items-center gap-2'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-4">Popular Tests</Text>
                        </View>
                        <View className="gap-2 flex-row items-center ml-auto">
                            {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                            <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                            <Text className="font-PoppinsMedium text-primary-600 text-[14px] leading-[20px]">View All</Text>
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
                // <View>
                //     <Text className='font-PoppinsMedium my-3'>{parentCategoryName}</Text>
                    <View className='gap-3'>        {/* flex-row flex-wrap */}
                        {productCategoryItems.map((i: any) => <LabCard key={i.LocationItemId} data={i} testDate={(dateValue).toLocaleDateString('en-TT')} />)}   {/* classes={'min-w-80'} */} 
                    </View>
                // </View>
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