import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { AntDesign, Feather, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import ButtonPrimary, { MyModal } from '@/src/components';
import { escape, getFrom, GridLoader, ProductCard } from '@/src/components/utils';
import { BASE_URL, myColors } from '@/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import colors from 'tailwindcss/colors';


const FilterPage = () => {
  const [showFilters, setShowFilters] = useState(false);

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  // const [productsList, setProductsList] = useState({loading: true, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});

    const [searchText, setSearchText] = useState('');
    const [hideOutOfStock, setHideOutOfStock] = useState(false);
    const router = useRouter()
  
    // ------------------------------------------------------------------------------------
    
    let { head, subHead, page, catVal, subCatVal, brands, sortBy, query, hideOutStock } = useGlobalSearchParams();
    const selectedCompany = useSelector((i : RootState) => i.companies.selected)
    const locationId = useSelector((i : RootState) => i.appData.location.LocationId)
    const { categories: siteCategories, products: siteProducts } = useSelector((i : RootState) => i.siteData)
    // const siteBrands = siteProducts.ItemBrandList;
  
    catVal = catVal || '';
    subCatVal = subCatVal || '';
    brands = brands ? escape(brands).unswap : '';
    sortBy = sortBy || 'NameASC';
    query = query || ''
    hideOutStock = hideOutStock || 'N';
    const filterCategoryName = head ? escape(head).unswap : '';                            // head and subHead are used only to show heading on first load of filterpage.
    const filterSubCategoryName = subHead ? escape(subHead).unswap : '';
    const currPage = page || '1';
    const [productsList, setProductsList] = useState({loading: true, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
    const [hasMore, setHasMore] = useState(true);  
  
    console.log("catVal--", catVal, "subCatVal--", subCatVal, "brands--", brands, "sortBy--", sortBy, "query--", query, "hideOutOfStock--", hideOutOfStock, "filterCategoryName--", filterCategoryName, "filterSubCategoryName--", filterSubCategoryName, "page--", page);
    console.log(productsList.data);
    
  
    const makeFilterRequest = async (reset: boolean, signal) => {
  
      // if (!selectedCompany.EncCompanyId) return console.log('No selected company EncCompanyId found.');         // labtest also uses this page so we using selectedCompany instead of compcode.
      try {
          const res = await getFrom(`${BASE_URL}/api/Item/GetItemFilterPaging?CID=${selectedCompany.EncCompanyId}&SearchStr=${query}&CategoryIdList=${catVal}&SubCategoryIdList=${subCatVal}&MFGList=${brands}&LOCID=${locationId}&SortBy=${sortBy}&ExcludeOutOfStock=${hideOutStock}&PageNo=${currPage}&PageSize=20`, {}, setProductsList, signal);  
          if (res) {
              if (!res.data.itemMasterCollection.length) {
                  setProductsList(pre => ({...pre, loading: false})); 
                  setHasMore(false)
                  return;
              }
              if (reset) {
                  setProductsList({loading: false, data: { itemMasterCollection: res.data.itemMasterCollection }, err: {status: false, msg: ''}})
              } else {
                  setProductsList(pre => ({...res, data: { itemMasterCollection: [...pre.data.itemMasterCollection, ...res.data.itemMasterCollection] }}))
              }
          } else {
              setHasMore(false);            
              alert('Something went wrong. Please try later.');
          } 
      } catch (error) {
          setHasMore(false);            
          alert('An Error occured. Please try later.');
          console.log(error);
      }
    }
  
    useEffect(() => {
      let controller = new AbortController();
      setProductsList({loading: true, data: {itemMasterCollection: []}, err: {status: false, msg: ''}})
      makeFilterRequest(true, controller.signal);
      return () => controller.abort();
    }, [locationId, siteCategories.LinkCategoryList, siteCategories.LinkSubCategoryList, siteProducts.ItemBrandList, catVal, subCatVal, brands, sortBy, query, hideOutStock])
  
  
    // useEffect(() => {  
    //   if (currPage == '1') return;
    //   makeFilterRequest(false);
    // }, [currPage])
  
    const [filters, setFilters] = useState({ categories: [], subCategories: [], brands: [], seartTerm: '', outOfStock: 'N' }); 
    const [sortBySelected, setSortBySelected] = useState({ name: 'Name (A - Z)', id: 2, value: 'NameASC'}); 
    const [sortByOpen, setSortByOpen] = useState(false);
    let visibleCount = 5;
  
    console.log(filters)
    
    const [maxItems, setMaxItems] = useState({ categories: visibleCount, subCategories: visibleCount, brands: visibleCount });
  
    useEffect(() => {
      // if (siteData.isLoading) return;
      let categories = insertStatus(siteCategories.LinkCategoryList, 'Parent', catVal);
      let subCategories = insertStatus([...new Map(siteCategories.LinkSubCategoryList.map(item => [item['CategoryId'], item])).values()], 'CategoryId', subCatVal);
      let brandsList = insertStatus(siteProducts.ItemBrandList, 'Value', brands);
      const selectedSortBy = sortByOptions.find(i => i.value === sortBy);
      setSortBySelected(selectedSortBy);
      setFilters({ categories: categories, subCategories: subCategories, brands: brandsList, seartTerm: query, outOfStock: hideOutStock });
    }, [siteCategories.LinkCategoryList, siteCategories.LinkSubCategoryList, catVal, subCatVal, brands, query, hideOutStock, sortBy])   
  
    const insertStatus = (arr=[], idName: string, activeCategoryIds: string) => {
      let activeCategoryIdList = activeCategoryIds.split(',');
      if (activeCategoryIdList) {
          return arr.map((i: any) => (activeCategoryIdList.includes((i[idName]).toString())) ? { ...i, isSelected: true } : { ...i, isSelected: false });
      }
      return arr.map((i: any) => ({ ...i, isSelected: false }));
    }
  
    const handleSelect = (catName: string, catIdName: string, item: any) => {
      let allFilterData = { ...filters };
      let targetCategory = allFilterData[catName];
      let toggleIsSelected = targetCategory.map((i: RootState) => i[catIdName] === item[catIdName] ? { ...i, isSelected: !i.isSelected} : i);
      setFilters(pre => ({ ...pre, [catName]: toggleIsSelected }));
    }
  
    const getSelectedItems = (keyName: string, idName: string) => {
      let selectedItems = filters[keyName].filter((i: any) => i.isSelected === true);
      let itemsString = selectedItems.map((i: any) => i[idName]).join(',');
      return itemsString;
    }
  
    const handleFilters = (sortBy: string) => {
      let selectedCategories = getSelectedItems('categories', 'Parent');
      let selectedSubCategories = getSelectedItems('subCategories', 'CategoryId');
      let selectedBrands = getSelectedItems('brands', 'Value');
      // let newQueryString = { ...queryString, catVal: selectedCategories, subCatVal: selectedSubCategories, brands: selectedBrands, sortBy: sortBy, query: searchTerm, page: '1', hideOutStock: hideOutOfStockItems };
      // let parsed = qs.stringify(newQueryString);
      // history.push(`?${parsed}`);
      console.log(`/shop/filters/?brands=${selectedBrands}&catVal=${selectedCategories}&head=Tablets&hideOutStock=Y&page=1&query=&sortBy=${sortBy}&subCatVal=${selectedSubCategories}`);
      router.push(`/shop/filters/?brands=${selectedBrands}&catVal=${selectedCategories}&head=Tablets&hideOutStock=Y&page=1&query=&sortBy=${sortBy}&subCatVal=${selectedSubCategories}`)
    }
  
    const handleFilterForm = () => {
      // setHeading({ heading: 'Filtered Products', subHeading: '' });
      handleFilters(sortBySelected.value);
      // setFilterActive(false);
    }
  
    const renderCategory = (keyName: string, idName: string, textName: string) => filters[keyName].slice(0, maxItems[keyName]).map((i: any) => {
      return (
        <TouchableOpacity key={i[idName]} onPress={() => handleSelect(keyName, idName, i)} className="flex-row items-center mb-4">
          <View className={`w-5 h-5 border-2 rounded mr-3 ${ i.isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400 bg-transparent' }`}>
            {i.isSelected && (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            )}
          </View>
          <Text className="text-gray-700">{i[textName]}</Text>
        </TouchableOpacity>
      )
    });
  
    const handleShowAll = (name: string) => {
      if (maxItems[name] === 5) return setMaxItems(pre => ({ ...pre, [name]: filters[name].length }));
      setMaxItems(pre => ({ ...pre, [name]: 5 }));
    }
  
    const renderCount = (catName: string) => {
      if (filters[catName].length < 5) return;
      let hiddenItems = filters[catName].length - maxItems[catName];
      return (
          <TouchableOpacity onPress={() => handleShowAll(catName)} className="flex-row items-center mt-2 justify-center bg-white rounded-lg py-4 shadow-sm border-b border-gray-200" >
            <Text className="text-blue-500 font-medium"> {hiddenItems === 0 ? '' : hiddenItems} {hiddenItems === 0 ? 'Show less' : 'more'} </Text>
            <Ionicons name={hiddenItems === 0 ? "chevron-up" : "chevron-down"} size={16} color="#3B82F6" className="ml-1"/>
          </TouchableOpacity>
      )
    }
    const uncheckAll = (arr=[]) => arr.map((i: any) => ({ ...i, isSelected: false }));  
    const clearAll = () => {
      let categories = uncheckAll(siteCategories.LinkCategoryList);
      let subCategories = uncheckAll([...new Map(siteCategories.LinkSubCategoryList.map(item => [item['CategoryId'], item])).values()]);
      let brands  = uncheckAll(siteProducts.ItemBrandList);
      setFilters({ categories: categories, subCategories: subCategories, brands: brands, seartTerm: '', outOfStock: 'N' });
      setSortBySelected({ name: 'Name (A - Z)', id: 2, value: 'NameASC'});
    }
  
    const renderSelectedItemButtons = (catName, idName, textName) => {
      let selectedCategories = filters[catName].filter(i => i.isSelected === true);
      return selectedCategories.map((i: any) => (
        <View key={i[idName]} className="flex-row items-center bg-gray-200 rounded-full px-3 py-1">
          <TouchableOpacity onPress={() => handleSelect(catName, idName, i)} className="mr-2" >
            <Ionicons name="close" size={16} color="#666" />
          </TouchableOpacity>
          <Text className="text-gray-700 text-sm">{i[textName]}</Text>
        </View>
      ))
    }
  

  const SortByDropdown = ({ handler }: any) => {
    return (
        <ScrollView contentContainerClassName='flex-1 justify-center'>
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
                {sortByOptions.map((i: any, n: number) => (
                    <TouchableOpacity key={i.id} className={`flex-row gap-3 p-4 ${n === (sortByOptions.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => handler({ id: i.id, name: i.name, value: i.value })}>
                        <FontAwesome6 name="location-dot" size={20} color={myColors.primary[500]} />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
  }
  
  const handleSortBy = (item) => {
    setSortBySelected(item); 
    setSortByOpen(false);
    handleFilters(item.value);
  }
  

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">Filter Products</Text>
          </TouchableOpacity>
      </View>
      <View className='flex-row justify-between px-5 mt-4 mb-3'>
        <Text className='text-[1.05rem] font-PoppinsSemibold'>{filterCategoryName}</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Feather name="filter" size={20} color={colors.slate[600]} />
        </TouchableOpacity>
      </View>

      <View className='flex-row gap-2 items-center justify-between p-5 bg-white border-y border-gray-200'>
        <View className='flex-row gap-4 items-center'>
          <Feather name="grid" size={20} color={colors.sky[600]} />
          <FontAwesome name="list-ul" size={20} color={colors.slate[700]} />
        </View>
        <Pressable onPress={() => setSortByOpen(true)} className='flex-row gap-3 items-center'>
          <Text className=''>Sort By : ({sortBySelected.name})</Text>
          <AntDesign name="caretdown" size={17} color='black' />
        </Pressable>
        <MyModal modalActive={sortByOpen} onClose={() => setSortByOpen(false)} child={<SortByDropdown handler={(item: any) => handleSortBy(item)} />} />
      </View>
      {productsList.loading ? <GridLoader /> :
      <View className='flex-row flex-wrap'>
        {productsList.data.itemMasterCollection.map((item, index) => <ProductCard data={item} width={'50%'} key={item.LocationItemId} />)}
      </View>}
      {showFilters ? 
      <View className='absolute z-40 inset-0 bg-purple-50'>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-800">ADVANCE FILTERS</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)} className="p-1">
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5">
          <View className="mt-5">
            <View className="bg-white rounded-2xl px-4 py-[0.42rem] flex-row items-center pointer-events-none">
              <Feather name="search" size={20} color="#9CA3AF" />
              <TextInput className="flex-1 ml-3 text-gray-700" placeholder="Search..." placeholderTextColor="#9CA3AF" value={searchText} onChangeText={setSearchText} />
              <Feather name="sliders" size={20} color="#9CA3AF" />
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">SELECTED CATEGORIES</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {renderSelectedItemButtons('categories', 'Parent', 'ParentDesc')}
              {renderSelectedItemButtons('subCategories', 'CategoryId', 'CategoryDesc')}
              {renderSelectedItemButtons('brands', 'Value', 'Text')} 
            </View>

            {/* {selectedCategories.length > 0 && ( */}
              <TouchableOpacity onPress={() => clearAll()} className="self-start">
                <View className="flex-row items-center bg-gray-200 rounded-full px-3 py-1">
                  <Ionicons name="close" size={16} color="#666" className="mr-2" />
                  <Text className="text-gray-700 text-sm">Clear All</Text>
                </View>
              </TouchableOpacity>
            {/* )} */}
          </View>

          <View className="mt-6">
            <TouchableOpacity onPress={() => setHideOutOfStock(!hideOutOfStock)} className="flex-row items-center"                                    > 
              <View className={`w-5 h-5 border-2 border-gray-400 rounded mr-3 ${hideOutOfStock ? 'bg-transparent' : 'bg-transparent'}`}>
                {hideOutOfStock && (
                  <View className="w-full h-full items-center justify-center">
                    <View className="w-2 h-2 bg-gray-600 rounded-sm" />
                  </View>
                )}
              </View>
              <Text className="text-gray-700">Hide out of stock items</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">CATEGORIES</Text>
            {renderCategory('categories', 'Parent', 'ParentDesc')}
            {renderCount('categories')}
          </View>
          <View className="mt-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">Sub Categories</Text>
            {renderCategory('subCategories', 'CategoryId', 'CategoryDesc')}
            {renderCount('subCategories')}
          </View>
          <View className="mt-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">BRANDS</Text>
            {renderCategory('brands', 'Value', 'Text')}
            {renderCount('brands')}
          </View>

          <View className="flex-row justify-between items-center pt-4 pb-3 px-5 bg-white">
            <Text className="text-lg font-bold text-gray-800">Similar Products</Text>
            <TouchableOpacity>
              <Text className="text-purple-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>         

        </ScrollView>

        <View className="px-5 pb-5 pt-3 border-t border-gray-200">
          <ButtonPrimary title={'Apply Filters'} onClick={handleFilterForm} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-gray-700' />
        </View>
      </View> : null}
    </ScrollView>
  );
};

export default FilterPage;


const sortByOptions = [
  { name: 'Name (A - Z)', id: 2, value: 'NameASC'},
  { name: 'Name (Z - A)', id: 3, value: 'NameDESC'},
  { name: 'Price (Low > High)', id: 4, value: 'PriceASC'},
  { name: 'Price (High > Low)', id: 5, value: 'PriceDESC'},
]



