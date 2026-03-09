import React, { memo, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, Bell, MapPin, ChevronDown, Heart, ShoppingCart, Home, Calendar, User, Wallet, Calendar1, CalendarCheck, CalendarDays, Ellipsis } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Image } from 'react-native';
import { getFrom, GridLoader, ProductCard, sumByKey } from '@/src/components/utils';
import { getRequiredFields } from '@/src/components/utils/shared';
import { BASE_URL } from '@/src/constants';
import { MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import Svg, { Path } from "react-native-svg";
import { Link } from 'expo-router';

const RetaurantHome = () => {

  // const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const compCode = useSelector((state: RootState) => state.compCode);
  const user = useSelector((state: RootState) => state.user);
  const company = useSelector((state: RootState) => state.company.info);
  const appData = useSelector((state: RootState) => state.appData);

  const [searchTerm, setSearchTerm] = useState({query: '', filterTerm: 'All', filterId: ''});
  const [autoCompleteList, setAutoCompleteList] = useState({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}}); 
  // const [searchResultsActive_1, setSearchResultsActive_1] = useState(false);

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
        const res = await getFrom(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=${'03/03/2026'}&dttoStr=${'03/03/2026'}`, {}, setStats, signal);
        if (res) {                                                                   
            setStats(pre => ({ ...res, data: {PatientRegList: res.data.PatientRegList }}));
        } else {
            console.log('No data received');
        }
    }  
    getSearchResult(user, company, controller.signal);
    return () => controller.abort();
  }, [user.UserId, company.CompanyId])
  
  const renderStats = () => {
    if (stats.loading) {
        return <GridLoader containerClass='mt-4 gap-3 px-4' classes='h-24' count={1} />;
    } else if (!stats.data.PatientRegList.length) {
        return (
            <View className="text-center py-10">
                <Search className="w-14 h-14 text-gray-300 mx-auto mb-2" />
                <Text className="text-gray-600 font-semibold text-sm">No items found</Text>
            </View>
        )
    } else if (stats.data.PatientRegList.length) {
        return (
            <ScrollView horizontal contentContainerClassName="px-2 py-4 bg-white">
                {stats.data.PatientRegList.map((item, index) => <StatCard data={item} key={index} index={index} />)}    
            </ScrollView>
        )
    }
  }

  const renderDepartments = () => {
    if (stats.loading) {
        return <GridLoader containerClass='mt-4 gap-3 flex-col px-4' classes='h-24' count={4} />;
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
        <BalanceCard />

        <View className="">
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


const BalanceCard = () => {
  return (
    <View className="w-full items-center bg-sky-900 px-4 pb-4">
      <View className="w-full flex-row items-center justify-between bg-sky-900 rounded-2xl">
        <View className="flex-row items-center rounded-xl">
          <View className="bg-white/20 rounded-lg p-2 mr-3">
            <CalendarDays size={18} color="white" />
          </View>
          <View>
            <Text className="text-gray-300 text-xs">Balance</Text>
            <Text className="text-white font-semibold text-base">
              $ 124.5
            </Text>
          </View>
        </View>
        <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-xl min-w-20 justify-between flex-row items-center">
          <Text className="text-white text-sm font-medium">HO</Text>
          <Text className="text-white text-sm font-medium">▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


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
  // let bgColor = getRandomColor(col, index, '50');
  // let textColor = getRandomColor(col, index, '600');
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
      <Text className="text-sm text-gray-600 text-center tracking-tight" numberOfLines={2}>{data.Department}</Text>
    </TouchableOpacity>
  )
})

const DepartmentCard = memo(({ index, data }: any) => {
  let count = sumByKey(data.LinkStageList, 'OpportunityCnt')
  return (
    <View className='bg-white'>
      <View className="flex flex-row items-center px-4 pt-4 gap-4">
        <Text className="text-base font-bold text-gray-700">{data.Department}</Text>
        <TouchableOpacity className="bg-fuchsia-50 px-3 py-1.5 rounded-full">
        <Text className="text-fuchsia-600 text-xs font-semibold">{count} Total</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-100 px-2 py-1.5 rounded-full ml-auto">
          <Ellipsis size={18} color={colors.blue[500]} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerClassName="p-4 gap-3" horizontal>
        {data.LinkStageList.map((item, n) => (
          <DeptStatCard key={n} data={item} index={n} />
        ))}
      </ScrollView>
    </View>
  )
})

const DeptStatCard = ({ data, bg="bg-gray-100", wave="#9B7FE8", index }: any) => {
  let bgColor = getRandomColor(col, index, '100');
  let waveColor = getRandomColor(col, index, '500');
  return (
    <Link href={'/hospitality/department'} className='rounded-2xl p-4 min-w-40 bg-gray-100'>
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


export const col = {
  "red": {
      "50": "#fef2f2",
      "100": "#fee2e2",
      "200": "#fecaca",
      "300": "#fca5a5",
      "400": "#f87171",
      "500": "#ef4444",
      "600": "#dc2626",
      "700": "#b91c1c",
      "800": "#991b1b",
      "900": "#7f1d1d",
      "950": "#450a0a"
  },
  "orange": {
      "50": "#fff7ed",
      "100": "#ffedd5",
      "200": "#fed7aa",
      "300": "#fdba74",
      "400": "#fb923c",
      "500": "#f97316",
      "600": "#ea580c",
      "700": "#c2410c",
      "800": "#9a3412",
      "900": "#7c2d12",
      "950": "#431407"
  },
  "amber": {
      "50": "#fffbeb",
      "100": "#fef3c7",
      "200": "#fde68a",
      "300": "#fcd34d",
      "400": "#fbbf24",
      "500": "#f59e0b",
      "600": "#d97706",
      "700": "#b45309",
      "800": "#92400e",
      "900": "#78350f",
      "950": "#451a03"
  },
  "yellow": {
      "50": "#fefce8",
      "100": "#fef9c3",
      "200": "#fef08a",
      "300": "#fde047",
      "400": "#facc15",
      "500": "#eab308",
      "600": "#ca8a04",
      "700": "#a16207",
      "800": "#854d0e",
      "900": "#713f12",
      "950": "#422006"
  },
  "lime": {
      "50": "#f7fee7",
      "100": "#ecfccb",
      "200": "#d9f99d",
      "300": "#bef264",
      "400": "#a3e635",
      "500": "#84cc16",
      "600": "#65a30d",
      "700": "#4d7c0f",
      "800": "#3f6212",
      "900": "#365314",
      "950": "#1a2e05"
  },
  "green": {
      "50": "#f0fdf4",
      "100": "#dcfce7",
      "200": "#bbf7d0",
      "300": "#86efac",
      "400": "#4ade80",
      "500": "#22c55e",
      "600": "#16a34a",
      "700": "#15803d",
      "800": "#166534",
      "900": "#14532d",
      "950": "#052e16"
  },
  "emerald": {
      "50": "#ecfdf5",
      "100": "#d1fae5",
      "200": "#a7f3d0",
      "300": "#6ee7b7",
      "400": "#34d399",
      "500": "#10b981",
      "600": "#059669",
      "700": "#047857",
      "800": "#065f46",
      "900": "#064e3b",
      "950": "#022c22"
  },
  "teal": {
      "50": "#f0fdfa",
      "100": "#ccfbf1",
      "200": "#99f6e4",
      "300": "#5eead4",
      "400": "#2dd4bf",
      "500": "#14b8a6",
      "600": "#0d9488",
      "700": "#0f766e",
      "800": "#115e59",
      "900": "#134e4a",
      "950": "#042f2e"
  },
  "cyan": {
      "50": "#ecfeff",
      "100": "#cffafe",
      "200": "#a5f3fc",
      "300": "#67e8f9",
      "400": "#22d3ee",
      "500": "#06b6d4",
      "600": "#0891b2",
      "700": "#0e7490",
      "800": "#155e75",
      "900": "#164e63",
      "950": "#083344"
  },
  "sky": {
      "50": "#f0f9ff",
      "100": "#e0f2fe",
      "200": "#bae6fd",
      "300": "#7dd3fc",
      "400": "#38bdf8",
      "500": "#0ea5e9",
      "600": "#0284c7",
      "700": "#0369a1",
      "800": "#075985",
      "900": "#0c4a6e",
      "950": "#082f49"
  },
  "blue": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
      "950": "#172554"
  },
  "indigo": {
      "50": "#eef2ff",
      "100": "#e0e7ff",
      "200": "#c7d2fe",
      "300": "#a5b4fc",
      "400": "#818cf8",
      "500": "#6366f1",
      "600": "#4f46e5",
      "700": "#4338ca",
      "800": "#3730a3",
      "900": "#312e81",
      "950": "#1e1b4b"
  },
  "violet": {
      "50": "#f5f3ff",
      "100": "#ede9fe",
      "200": "#ddd6fe",
      "300": "#c4b5fd",
      "400": "#a78bfa",
      "500": "#8b5cf6",
      "600": "#7c3aed",
      "700": "#6d28d9",
      "800": "#5b21b6",
      "900": "#4c1d95",
      "950": "#2e1065"
  },
  "purple": {
      "50": "#faf5ff",
      "100": "#f3e8ff",
      "200": "#e9d5ff",
      "300": "#d8b4fe",
      "400": "#c084fc",
      "500": "#a855f7",
      "600": "#9333ea",
      "700": "#7e22ce",
      "800": "#6b21a8",
      "900": "#581c87",
      "950": "#3b0764"
  },
  "fuchsia": {
      "50": "#fdf4ff",
      "100": "#fae8ff",
      "200": "#f5d0fe",
      "300": "#f0abfc",
      "400": "#e879f9",
      "500": "#d946ef",
      "600": "#c026d3",
      "700": "#a21caf",
      "800": "#86198f",
      "900": "#701a75",
      "950": "#4a044e"
  },
  "pink": {
      "50": "#fdf2f8",
      "100": "#fce7f3",
      "200": "#fbcfe8",
      "300": "#f9a8d4",
      "400": "#f472b6",
      "500": "#ec4899",
      "600": "#db2777",
      "700": "#be185d",
      "800": "#9d174d",
      "900": "#831843",
      "950": "#500724"
  },
  "rose": {
      "50": "#fff1f2",
      "100": "#ffe4e6",
      "200": "#fecdd3",
      "300": "#fda4af",
      "400": "#fb7185",
      "500": "#f43f5e",
      "600": "#e11d48",
      "700": "#be123c",
      "800": "#9f1239",
      "900": "#881337",
      "950": "#4c0519"
  },
  "lightBlue": {
      "50": "#f0f9ff",
      "100": "#e0f2fe",
      "200": "#bae6fd",
      "300": "#7dd3fc",
      "400": "#38bdf8",
      "500": "#0ea5e9",
      "600": "#0284c7",
      "700": "#0369a1",
      "800": "#075985",
      "900": "#0c4a6e",
      "950": "#082f49"
  },
}

export const getRandomColor = (colors, index, shade) => {
  const keys = Object.keys(colors);
  if (index) {
    index = index >= keys.length ? (index % keys.length) : index
  } else {
    index = getRandomInt(0, keys.length-1)
  }
  const selectColor = colors[keys[index]][shade];  
  return selectColor;
}

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};