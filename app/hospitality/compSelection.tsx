import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ShoppingCart,  Target,  PenLine,  Megaphone,  MousePointer,  Monitor,  ImagePlay,  TrendingUp,  MapPin,  ChevronDown,  LogOut } from "lucide-react-native";
import { Image } from "react-native";
import { RootState } from "@/src/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, router } from "expo-router";
import { getRandomColor, logout } from "@/src/components/utils";
import { setCompanies } from "@/src/store/slices/slices";

type Service = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  subtitleColor: string;
};

const services: Service[] = [
  {
    id: "ecommerce",
    title: "e-Commerce",
    subtitle: "Build your online store.",
    icon: ShoppingCart,
    bgColor: "bg-indigo-50",
    iconColor: "#6366f1",
    subtitleColor: "text-indigo-500",
  },
  {
    id: "graphic",
    title: "Graphic design",
    subtitle: "Premium design & visuals.",
    icon: MousePointer,
    bgColor: "bg-green-50",
    iconColor: "#22c55e",
    subtitleColor: "text-green-500",
  },
  {
    id: "ads",
    title: "Facebook & Google ads",
    subtitle: "Ads that drive clicks.",
    icon: Target,
    bgColor: "bg-blue-50",
    iconColor: "#3b82f6",
    subtitleColor: "text-blue-500",
  },
  {
    id: "landing",
    title: "Landing pages",
    subtitle: "Attract more clients.",
    icon: Monitor,
    bgColor: "bg-teal-50",
    iconColor: "#14b8a6",
    subtitleColor: "text-teal-500",
  },
  {
    id: "copy",
    title: "Copywriting",
    subtitle: "Words that sell.",
    icon: PenLine,
    bgColor: "bg-orange-50",
    iconColor: "#f97316",
    subtitleColor: "text-orange-500",
  },
  {
    id: "social",
    title: "Social media",
    subtitle: "Content for your brand.",
    icon: ImagePlay,
    bgColor: "bg-pink-50",
    iconColor: "#ec4899",
    subtitleColor: "text-pink-500",
  },
  {
    id: "digital",
    title: "Digital marketing",
    subtitle: "Grow your business online.",
    icon: Megaphone,
    bgColor: "bg-yellow-50",
    iconColor: "#eab308",
    subtitleColor: "text-yellow-600",
  },
  {
    id: "cro",
    title: "CRO",
    subtitle: "Turn more visitors into customers.",
    icon: TrendingUp,
    bgColor: "bg-purple-50",
    iconColor: "#a855f7",
    subtitleColor: "text-purple-500",
  },
];

function CompanyCard({ company, index }: { company: Service, index: Number }) {
  // const Icon = company.icon;

  let randColor = getRandomColor(index);
  const dispatch = useDispatch();

  const handleSelect = (item) => {
    dispatch(setCompanies({ selected: item }))
    router.push("/hospitality/tabs/Lead_Home")
  }

  return (
    <Pressable className="flex-1 m-1.5 rounded-2xl p-4 flex-row items-center gap-4 active:opacity-80 bg-white" android_ripple={{ color: "#f0f0f0", borderless: false }} onPress={() => handleSelect(company)}>
      <View className={`rounded-xl w-14 h-14 items-center justify-center`} style={{ backgroundColor: randColor['50'] }}>
        {/* <Icon size={24} color={company.iconColor} strokeWidth={2} /> */}
        <Text className="text-xl font-bold" style={{color: randColor['600']}}>{company.COMPNAME?.slice(0, 2)}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold leading-tight text-[1rem]" numberOfLines={2}>
          {company.COMPNAME}
        </Text>
        <Text className={`text-sm mt-1.5 font-medium`} numberOfLines={1} style={{color: randColor['600']}}>
          {company.LocationName}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ServicesGrid() {
  const user = useSelector((state: RootState) => state.user);  
  const dispatch = useDispatch();
  return (
    <ScrollView className="flex-1 bg-slate-100" showsVerticalScrollIndicator={false}>
      <View className="p-4 bg-sky-900">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-4">
              {/* <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" /> */}
              <View className='shadow-lg rounded-full'>
                <Image className='' source={require('@/assets/images/user.png')} style={{ width: 35, height: 35 }} />
              </View>
              <View>
                <Text className="text-sm font-semibold mb-1 text-white">{user.Name}</Text>
                <View className="flex flex-row items-center">
                  <MapPin size={14} color="#EF4444" />
                  <Text className="text-xs text-gray-200 ml-1">{(user.UserType)?.toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}, {user.GenderDesc}, {user.Age} Years</Text>
                  <ChevronDown size={16} color="#6B7280" className="ml-1" />
                </View>
              </View>
            </View>
            <Link href='/login' onPress={() => logout(dispatch)}>
              <View className="relative flex flex-row items-center gap-2">
                <LogOut size={22} color="#fff" />
                <Text className="text-sm text-white">Logout</Text>
              {/* <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" /> */}
              </View>
            </Link>
          </View>
      </View>
      <View className="p-2">
        <Text className="text-lg text-slate-400 font-PoppinsSemibold px-2 py-3">Select Company</Text>
        <View>
          {user?.UserCompList2?.map((item, index) => (
            <CompanyCard key={index} company={item} index={index} />
          ))}
          {services.length === 1 && <View className="flex-1 m-1.5" />}
        </View>
      </View>
    </ScrollView>
  );
}
