import React, { memo, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, Bell, MapPin, ChevronDown, Heart, ShoppingCart, Home, Calendar, User, Wallet, Calendar1, CalendarCheck, CalendarDays, Ellipsis, Plus, List } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Image } from 'react-native';
import { getFrom, getRandomColor, GridLoader, ProductCard, sumByKey } from '@/src/components/utils';
import { getRequiredFields } from '@/src/components/utils/shared';
import { BASE_URL, myColors } from '@/src/constants';
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import Svg, { Path } from "react-native-svg";
import { Link, router } from 'expo-router';
import { setCompanies, setDepartment } from '@/src/store/slices/slices';
import { MyModal, sortByCount } from '@/src/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from "@/src/components/utils/dayjs";

const RetaurantHome = () => {

  // const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const compCode = useSelector((state: RootState) => state.compCode);
  const user = useSelector((state: RootState) => state.user);
  const company = useSelector((state: RootState) => state.company.info);
  const appData = useSelector((state: RootState) => state.appData);
  const selectedCompany = useSelector((state: RootState) => state.companies.selected);

  const [searchTerm, setSearchTerm] = useState({query: '', filterTerm: 'All', filterId: ''});
  const [autoCompleteList, setAutoCompleteList] = useState({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}}); 
  // const [searchResultsActive_1, setSearchResultsActive_1] = useState(false);

  const [locationDropdown, setLocationDropdown] = useState(false);
  const dispatch = useDispatch();
  const companyLocations = user?.UserCompList2?.filter(((i: any) => i.CompanyId === selectedCompany.CompanyId));
  const [selectedDate, setSelectedDate] = useState({ active: false, value: dayjs() })

  const LocationDropdown = () => {
    return (
      <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
        {companyLocations?.map((i: any, n: number) => (
            <TouchableOpacity key={i.LocationId} className={`flex-row gap-3 p-4 ${n === (companyLocations.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {dispatch(setCompanies({ selected: i })); setLocationDropdown(false)}}>
                <MaterialCommunityIcons name={i.LocationId === selectedCompany.LocationId ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={23} color={myColors.primary[500]} />
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.LocationName}</Text>
            </TouchableOpacity>
        ))}
      </View>
    )
  }

  useEffect(() => {
    let controller = new AbortController();
    const getSearchResult = async (companyCode, term, signal) => {                      
        if (!companyCode) return alert('no companyCode received');                  
        const res = await getFrom(`${BASE_URL}/api/item/Get?CID=${companyCode}&SearchStr=${term.query}&LOCID=${appData.location.LocationId}`, {}, setAutoCompleteList, signal);
        // const res = await getFrom(`${baseUrl}/api/Item/GetItemFilter?CID=${companyCode}&LOCID=${appData.location.LocationId}&SearchStr=${term.query}&CategoryIdList=${term.filterId}&SubCategoryIdList&MFGList&SortBy&ExcludeOutOfStock`, {}, setAutoCompleteList, signal);
        if (res) {                                                                    
            let requiredFields = getRequiredFields(res.data.itemMasterCollection);
            setAutoCompleteList(pre => ({ ...pre, loading: false, data: {itemMasterCollection: requiredFields }}));
        } else {
            console.log('No data received');
        }
    }  

    const timer = setTimeout(() => {
        if (searchTerm.query.length === 0) return setAutoCompleteList({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
        getSearchResult(compCode, searchTerm, controller.signal);  
    }, 1000);

    return () => {
        clearTimeout(timer);
        controller.abort();
    };
  }, [searchTerm, compCode, appData.location.LocationId])

  
  const handleSearchInput = (text: string) => {
      setSearchTerm(pre => ({...pre, query: text}));
      // setListActive(true); 
  }

  // NEW WORK ---------------------------------------------------------------------------------------------------

  const [stats, setStats] = useState({loading: false, data: {PatientRegList: []}, err: {status: false, msg: ''}});   

  useEffect(() => {
    let controller = new AbortController();
    const getSearchResult = async (user, company, signal) => {                      
        if (!user.UserId || !company.CompanyId) return;   
        console.log(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=${selectedDate.value.format("DD/MM/YYYY")}&dttoStr=${selectedDate.value.format("DD/MM/YYYY")}`);                      
        const res = await getFrom(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=${selectedDate.value.format("DD/MM/YYYY")}&dttoStr=${selectedDate.value.format("DD/MM/YYYY")}`, {}, setStats, signal);
        if (res) {  
          let arr: any = []
          res.data.PatientRegList.forEach((item: any) => {
            let sortedStages = sortByCount(item.LinkStageList, 'OpportunityCnt');
            arr.push({ ...item, LinkStageList: sortedStages });
          });
          setStats(pre => ({ ...res, data: {PatientRegList: arr }}));
        } else {
            console.log('No data received');
        }
    }  
    getSearchResult(user, selectedCompany, controller.signal);
    return () => controller.abort();
  }, [user.UserId, selectedCompany.CompanyId, selectedCompany.LocationId, selectedDate.value])
  
  const renderStats = () => {
    if (stats.loading) {
        return <GridLoader containerClass='p-4 gap-3' classes='h-24 flex-1 rounded-2xl' count={4} />;
    } else if (!stats.data.PatientRegList.length) {
        return (
            <View className="text-center py-10">
                <Search className="w-14 h-14 text-gray-300 mx-auto mb-2" />
                <Text className="text-gray-600 font-semibold text-sm">No items found</Text>
            </View>
        )
    } else if (stats.data.PatientRegList.length) {
        return (
            <ScrollView horizontal contentContainerClassName="px-2 py-4">
                {stats.data.PatientRegList.map((item, index) => <StatCard data={item} key={index} index={index} />)}    
            </ScrollView>
        )
    }
  }

  const renderDepartments = () => {
    if (stats.loading) {
        return <GridLoader containerClass='gap-3 flex-col px-4' classes='h-24' count={4} />;
    } else if (!stats.data.PatientRegList.length) {
        return (
            <View className="text-center py-10">
                <Search className="w-14 h-14 text-gray-300 mx-auto mb-2" />
                <Text className="text-gray-600 font-semibold text-sm">No items found</Text>
            </View>
        )
    } else if (stats.data.PatientRegList.length) {
        return (
            <View className='gap-1 flex-col'>
                {stats.data.PatientRegList.map((item, index) => <DepartmentCard data={item} key={index} index={index} />)}    
            </View>
        )
    }
  }

  return (
    <ScrollView contentContainerClassName="bg-slate-100 relative">
      <View className="">
        <View className="p-4 bg-sky-900">
          {isLoggedIn ? 
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center gap-4">
                {/* <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" /> */}
                <View className='shadow-lg rounded-full'>
                  <Image className='' source={require('@/assets/images/user.png')} style={{ width: 35, height: 35 }} />
                </View>
                <View>
                  <Text className="text-sm font-semibold mb-1 text-white">{user.Name}</Text>
                  <View className="flex flex-row items-center">
                    <MapPin size={14} color="#EF4444" />
                    <Text className="text-xs text-gray-200 ml-1">{(user.UserType).toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}, {user.GenderDesc}, {user.Age} Years</Text>
                    <ChevronDown size={16} color="#6B7280" className="ml-1" />
                  </View>
                </View>
              </View>
              <View className="relative">
                <Bell size={24} color="#fff" />
                <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
              </View>
            </View>
            :
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center gap-4">
                {/* <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" /> */}
                <Image className='rounded-full' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${company.LogoUrl}` }} style={{ width: 35, height: 35 }} />
                <View>
                  <Text className="text-sm font-semibold mb-1">{company.COMPNAME.length > 27 ? company.COMPNAME.substr(0, 27) + '..' : company.COMPNAME}</Text>
                  <View className="flex flex-row items-center">
                    <MapPin size={14} color="#EF4444" />
                    <Text className="text-xs text-gray-500 ml-1">{!company.CATCHLINE.length ? 'Order food online.' : company.CATCHLINE.length > 32 ? company.CATCHLINE.substr(0, 32) + '..' : company.CATCHLINE}</Text>
                    <ChevronDown size={16} color="#6B7280" className="ml-1" />
                  </View>
                </View>
              </View>
              <View className="relative">
                <Bell size={24} color="#1F2937" />
                <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </View>
            </View>
          }

          <View className="flex flex-row items-center bg-white/10 rounded-2xl px-4 py-1.5">
            <Search size={20} color="#d1d5db" />
            <TextInput onChangeText={(text) => handleSearchInput(text)} value={searchTerm.query} placeholderTextColor={colors.gray[300]} placeholder="Search Appointments.." className="flex-1 ml-2 text-sm bg-transparent outline-none text-white" />
            <View className="w-2 h-2 bg-red-500 rounded-full" />
          </View>

          <View className="">
            {(() => {
                if (autoCompleteList.loading) {
                    return <GridLoader containerClass='mt-4 gap-3 flex-col' classes='h-24' count={4} />;
                } else if (searchTerm.query.length && !autoCompleteList.data.itemMasterCollection.length) {
                    return (
                        <View className="text-center py-10">
                            <Search className="w-14 h-14 text-gray-300 mx-auto mb-2" />
                            <Text className="text-gray-600 font-semibold text-sm">No items found</Text>
                        </View>
                    )
                } else if (autoCompleteList.data.itemMasterCollection.length) {
                    return (
                        <View className="my-4 gap-2">
                            {autoCompleteList.data.itemMasterCollection.map((item) => <ProductCard data={item} key={item.LocationItemId} />)}    
                            {/* <SearchListCard data={item} handleActive={searchResultsActive_1} /> */}
                        </View>
                    )
                }
            })()}
          </View>

        </View>
        {/* <BalanceCard selectedCompany={selectedCompany} locations={user.UserCompList2}/> */}
        <View className="w-full items-center bg-sky-900 px-4 pb-4">
          <View className="w-full flex-row items-center justify-between bg-sky-900 rounded-2xl">
            <View className="flex-row items-center rounded-xl gap-3">

              <TouchableOpacity className="bg-white/20 rounded-xl py-2 px-3.5" onPress={() => setSelectedDate((pre) => ({...pre, value: pre.value.subtract(1, 'day')}))}>
                <FontAwesome6 name="caret-left" size={18} color="white" />
              </TouchableOpacity>
              {/* <View className="bg-white/20 rounded-lg p-2">
                <CalendarDays size={18} color="white" />
              </View> */}
              <Pressable onPress={() => setSelectedDate((pre) => ({...pre, active: true}))}>
                <Text className="text-gray-300 text-xs">Select Date</Text>
                <Text className="text-white font-semibold text-base tracking-wider">
                  {dayjs(selectedDate.value).format("DD MMM YYYY")}
                </Text>
              </Pressable>
              <TouchableOpacity className="bg-white/20 rounded-xl py-2 px-3.5" onPress={() => setSelectedDate((pre) => ({...pre, value: pre.value.add(1, 'day')}))}>
                {/* <CalendarDays size={18} color="white" /> */}
                <FontAwesome6 name="caret-right" size={18} color="white" />
              </TouchableOpacity>

              {selectedDate.active ? <DateTimePicker value={selectedDate.value.toDate()} mode="date" display="default" onChange={(e, date) => setSelectedDate({ active: false, value: dayjs(date) })} minimumDate={new Date()} /> : null}
            </View>
            <TouchableOpacity onPress={() => setLocationDropdown(true)} className="bg-white/20 px-4 py-2 rounded-xl min-w-20 justify-between flex-row items-center gap-3">
              <Text className="text-white text-sm font-medium">{selectedCompany.LocationName}</Text>
              <Text className="text-white text-sm font-medium">▼</Text>
            </TouchableOpacity>
          </View>
          <MyModal modalActive={locationDropdown} onClose={() => setLocationDropdown(false)} child={<LocationDropdown />} />
        </View>

        <View className="bg-white">
          {renderStats()}
        </View>

        {/* <ScrollView horizontal contentContainerClassName="px-2 py-4 bg-white">
          {['fuchsia','amber','violet','pink','green','blue','purple','orange'].map((brand, index) => (
            <TouchableOpacity key={index} className="items-center" style={{width: 70}}>
              <View className={`w-14 h-14 bg-${brand}-50 rounded-2xl items-center justify-center mb-2.5`}>
                <Text className={`text-${brand}-600 font-bold text-lg`}>{index}</Text>
              </View>
              <Text className="text-sm text-gray-600 text-center">Sales & Marketing</Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}
        <View className="flex flex-row justify-between items-center pt-5 px-4 pb-4">
          <Text className="text-lg font-bold text-gray-900">Departments</Text>
          <TouchableOpacity className="text-red-500 font-semibold hover:text-red-600">
            <Text className='font-semibold text-gray-500'>View All</Text>
          </TouchableOpacity>
        </View>

        <View className="">
          {renderDepartments()}
        </View>
      </View>
    </ScrollView>
  );
}

export default RetaurantHome;

function FoodItemCard() {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-3">
          <Text className="text-2xl">🍱</Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base mb-1">
            DAL FRY
          </Text>
          
          <View className="flex-row items-center mb-1">
            <Text className="text-red-600 font-bold text-lg">₹150</Text>
            <Text className="text-gray-400 line-through text-sm ml-2">₹150</Text>
            <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
              <Text className="text-green-700 font-semibold text-xs">Save ₹10</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
            <Text className="text-green-600 text-xs font-medium">Available</Text>
          </View>
        </View>
      </View>

      <View className="items-end ml-3">
        <View className="bg-orange-50 px-3 py-1 rounded-full mb-2">
          <Text className="text-orange-600 text-xs font-semibold">Canteen</Text>
        </View>

        <TouchableOpacity className="bg-orange-500 px-6 py-2.5 rounded-lg active:bg-orange-600">
          <Text className="text-white font-bold text-sm">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// const BalanceCard = ({ selectedCompany, locations }: any) => {

//   const [locationDropdown, setLocationDropdown] = useState(false);
//   const dispatch = useDispatch();
//   const companyLocations = locations.filter(((i: any) => i.CompanyId === selectedCompany.CompanyId));
//   const [selectedDate, setSelectedDate] = useState({ active: false, value: new Date() })

//   const LocationDropdown = () => {
//     return (
//       <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
//         {companyLocations?.map((i: any, n: number) => (
//             <TouchableOpacity key={i.LocationId} className={`flex-row gap-3 p-4 ${n === (companyLocations.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {dispatch(setCompanies({ selected: i })); setLocationDropdown(false)}}>
//                 <MaterialCommunityIcons name={i.LocationId === selectedCompany.LocationId ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={23} color={myColors.primary[500]} />
//                 <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.LocationName}</Text>
//             </TouchableOpacity>
//         ))}
//       </View>
//     )
//   }
  
//   return (
//     <View className="w-full items-center bg-sky-900 px-4 pb-4">
//       <View className="w-full flex-row items-center justify-between bg-sky-900 rounded-2xl">
//         <View className="flex-row items-center rounded-xl">
//           <View className="bg-white/20 rounded-lg p-2 mr-3">
//             <CalendarDays size={18} color="white" />
//           </View>
//           <Pressable onPress={() => setSelectedDate((pre) => ({...pre, active: true}))}>
//             <Text className="text-gray-300 text-xs">Balance</Text>
//             <Text className="text-white font-semibold text-base">
//               $ 124.5
//             </Text>
//           </Pressable>
//           {selectedDate ? <DateTimePicker value={selectedDate.value} mode="date" display="default" onChange={(e, date) => setSelectedDate({ active: false, value: date })} minimumDate={new Date()} /> : null}
//         </View>
//         <TouchableOpacity onPress={() => setLocationDropdown(true)} className="bg-white/20 px-4 py-2 rounded-xl min-w-20 justify-between flex-row items-center gap-3">
//           <Text className="text-white text-sm font-medium">{selectedCompany.LocationName}</Text>
//           <Text className="text-white text-sm font-medium">▼</Text>
//         </TouchableOpacity>
//       </View>
//       <MyModal modalActive={locationDropdown} onClose={() => setLocationDropdown(false)} child={<LocationDropdown />} />
//     </View>
//   );
// };


const WaveIcon = ({ color }) => (
  <Svg width={52} height={22} viewBox="0 0 52 22">
    <Path
      d="M2 11 Q8 4, 14 11 Q20 18, 26 11 Q32 4, 38 11 Q44 18, 50 11"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const cards = [
  { count: 5,  label: "Today",    bg: "bg-purple-100", wave: "#9B7FE8" },
  { count: 7,  label: "Schedule", bg: "bg-orange-100",  wave: "#E8926A" },
  { count: 3,  label: "Projects", bg: "bg-teal-100",    wave: "#5BC4B0" },
  { count: 15, label: "All Task", bg: "bg-green-100",   wave: "#4DC98A" },
];

const StatCard = memo(({ index, data }: any) => {
  // let bgColor = getRandomColor(index, '50');
  // let textColor = getRandomColor(index, '600');
  let count = sumByKey(data.LinkStageList, 'OpportunityCnt')
  return (
    <TouchableOpacity className="items-center" style={{width: 75}}>
      <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-2.5 bg-sky-50`}
        // style={{backgroundColor: bgColor}}
      >
        <Text className={`font-bold text-lg text-sky-600`}
          // style={{color: textColor}}
        >{count}</Text>
      </View>
      <Text className="text-sm text-gray-600 text-center tracking-tight capitalize" numberOfLines={2}>{data.Department.toLowerCase()}</Text>
    </TouchableOpacity>
  )
})

const DepartmentCard = memo(({ index, data }: any) => {
  let count = sumByKey(data.LinkStageList, 'OpportunityCnt')
  const dispatch = useDispatch();
  return (
    <View className='bg-white'>
      <View className="flex flex-row items-center px-4 pt-4 gap-4">
        <Text className="text-base font-bold text-gray-700">{data.Department}</Text>
        <TouchableOpacity className="bg-fuchsia-50 px-3 py-1.5 rounded-full">
        <Text className="text-fuchsia-600 text-xs font-semibold">{count} Total</Text>
        </TouchableOpacity>
        <Link className='ml-auto' href={'/hospitality/department'} onPress={() => dispatch(setDepartment({ current: data, stage: {} }))}>
          <View className="bg-gray-100 px-2 py-1.5 rounded-full">
            <List size={18} color={colors.blue[500]} />
            {/* <Ellipsis size={18} color={colors.blue[500]} /> */}
          </View>
        </Link>
        <TouchableOpacity onPress={() => {dispatch(setDepartment({ current: data, stage: {} })); router.push('/hospitality/regForm')}} className="bg-gray-100 px-2 py-1.5 rounded-full">
          <Plus size={18} color={colors.blue[500]} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerClassName="p-4 gap-3" horizontal>
        {data.LinkStageList.map((item, n) => (
          <DeptStatCard key={n} data={item} index={n} department={data} />
        ))}
      </ScrollView>
    </View>
  )
})

const DeptStatCard = ({ data, bg="bg-gray-100", wave="#9B7FE8", index, department }: any) => {
  // let bgColor = getRandomColor(col, index, '100');
  let waveColor = getRandomColor(index)['500'];
  const dispatch = useDispatch();
  return (
    <Link onPress={() => dispatch(setDepartment({ current: department, stage: data }))} href={'/hospitality/department'} className='rounded-2xl p-4 min-w-40 bg-gray-100'>
      <View className={`w-full`}>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-3xl font-bold text-gray-900">{data.OpportunityCnt}</Text>
          <WaveIcon color={waveColor} />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 font-medium">{data.LinkDescription}</Text>
          {/* <Text className="text-gray-400 text-lg">›</Text> */}
        </View>
      </View>
    </Link>
  );
}
