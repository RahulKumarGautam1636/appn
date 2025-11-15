import { Card_2, Card_3 } from "@/src/components";
import { getFrom, ListLoader, NoContent } from "@/src/components/utils";
import { BASE_URL } from "@/src/constants";
import { setModal } from "@/src/store/slices/slices";
import { RootState } from "@/src/store/store";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import AppnList from "../appn/appnList";
import TestList from "../appn/testList";

const MemberDetails = () => {

    const user = useSelector((i: RootState) => i.user);
    const vType = useSelector((i: RootState) => i.company.vType);
    const { membersList } = useSelector((i: RootState) => i.members);
    const [activeTab, setActiveTab] = useState("details");
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const { id } = useLocalSearchParams();
    let { mainTab } = useGlobalSearchParams();
    
    const currentMember = membersList.find((i: any) => i.MemberId == id) || {};

    useEffect(() => {
      if (mainTab) setActiveTab(mainTab);
    }, [])

    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="pb-2 bg-white">
            <View className="justify-between flex-row p-4 items-center">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Member Details</Text>
            </Pressable>
            <View className="gap-3 flex-row items-center ml-auto">
                <Feather name="heart" size={20} color="black" />
                <Feather name="share-2" size={20} color="black" />
            </View>
            </View>
            <View className="flex-row gap-4 p-[13px] items-center">
            <Image className="shadow-md shadow-gray-300 rounded-full me-3" source={require("@/assets/images/user.png")} style={{ width: 78, height: 78 }} />
            <View>
                <Text className="font-PoppinsSemibold text-[#075985] text-[15px] mb-2">{currentMember.MemberName}</Text>
                <View className="flex-row gap-2 mb-[8px]">
                <FontAwesome5 name="clock" size={15} color="#075985" />
                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">
                    {currentMember.Age} Year,  {currentMember.GenderDesc}
                </Text>
                </View>
                <View className="flex-row gap-2">
                <FontAwesome5 name="shield-alt" size={15} color="#075985" />
                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{currentMember.RelationShipWithHolder || user.UserLevelSeq !== 60 ? 'Patient' : 'Member' }</Text>
                </View>
            </View>
            </View>
        </View>

        {/* Tabs */}
        {vType === 'ErpHospital' ? <View className="flex-row bg-white border-y border-gray-200">
          <TouchableOpacity onPress={() => setActiveTab("details")} className={`flex-1 py-3 items-center ${activeTab === "details" ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`font-medium ${activeTab === "details" ? "text-blue-500" : "text-gray-500"}`}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("appns")} className={`flex-1 py-3 items-center ${activeTab === "appns" ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`font-medium ${activeTab === "appns" ? "text-blue-500" : "text-gray-500"}`}>Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("labTests")} className={`flex-1 py-3 items-center ${activeTab === "labTests" ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`font-medium ${activeTab === "labTests" ? "text-blue-500" : "text-gray-500"}`}>Lab Tests</Text>
          </TouchableOpacity>
        </View>: null}

        {/* Content based on active tab */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} colors={["#3b82f6"]} />}>
          {activeTab === "details" && (
            <Animated.View entering={FadeIn.duration(300)} className="p-4">
              {/* Contact Information */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Contact Information</Text>
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm gap-4">
                <MedicalInfoItem icon={<Ionicons name="call-outline" size={18} color="#3b82f6" />} title="Phone Number" value={currentMember.Mobile || "Not Available"} colorClass="bg-blue-100" />
                <MedicalInfoItem icon={<Ionicons name="mail-outline" size={18} color="#3b82f6" />} title="Email Address" value={currentMember.Email || "Not Available"} colorClass="bg-blue-100" />
                <MedicalInfoItem icon={<Ionicons name="location-outline" size={18} color="#3b82f6" />} title="Address" value={`${currentMember.Address}, ${currentMember.City}, ${currentMember.StateDesc} - ${currentMember.Pin}`} colorClass="bg-blue-100" />
              </View>

              {/* Medical Information */}
              <Text className="text-lg font-bold text-gray-800 mb-4">Medical Information</Text>
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm gap-4">
                <View className="flex-row flex-wrap">
                  <View className="w-1/2 pr-2 mb-4">
                    <MedicalInfoItem icon={<MaterialIcons name="bloodtype" size={18} color="#ef4444" />} title="Blood Group" value={currentMember.BloodGroup || "Not Available"} colorClass="bg-red-100" />
                  </View>
                  <View className="w-1/2 pl-2 mb-4">
                    <MedicalInfoItem icon={<Ionicons name="person-outline" size={18} color="#ef4444" />} title="Gender" value={currentMember.GenderDesc || "Not Available"} colorClass="bg-red-100" />
                  </View>
                  <View className="w-1/2 pr-2">
                    <MedicalInfoItem icon={<Ionicons name="calendar-outline" size={18} color="#ef4444" />} title="Date of Birth" value={currentMember.DOB ? new Date(currentMember.DOB).toLocaleDateString() : "Not Available"} colorClass="bg-red-100" />
                  </View>
                  <View className="w-1/2 pl-2">
                    <MedicalInfoItem icon={<Ionicons name="time-outline" size={18} color="#ef4444" />} title="Age" value={currentMember.Age ? `${currentMember.Age} years` : "Not Available"} colorClass="bg-red-100" />
                  </View>
                </View>
              </View>
                <Text className="text-lg font-bold text-gray-800 mb-4">Additional Details</Text>
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm gap-4">
                <MedicalInfoItem icon={<MaterialIcons name="badge" size={18} color="#10b981" />} title="Member ID" value={currentMember.MemberId?.toString() || "Not Available"} colorClass="bg-green-100" />
                <MedicalInfoItem icon={<Ionicons name="heart-outline" size={18} color="#10b981" />} title="Relationship" value={currentMember.RelationShipWithHolder || "Primary"} colorClass="bg-green-100" />
                <MedicalInfoItem icon={<MaterialIcons name="local-hospital" size={18} color="#10b981" />} title="UHID" value={currentMember.UHID || "Not Available"} colorClass="bg-green-100" />
                <MedicalInfoItem icon={<MaterialIcons name="location-city" size={18} color="#10b981" />} title="City" value={`${currentMember.City}, ${currentMember.StateDesc}`} colorClass="bg-green-100" />
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeIn.duration(300)} className={activeTab === "appns" ? '' : 'hidden'}>
            <AppnList memberId={id} />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(300)} className={activeTab === "labTests" ? '' : 'hidden'}>
            <TestList memberId={id} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
}

const MedicalInfoItem = ({ icon, title, value, colorClass = "bg-blue-100" }) => (
  <View className="flex-row items-start">
    <View className={`${colorClass} p-[0.65rem] rounded-lg`}>
      {icon}
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-gray-500 text-xs mb-1">{title}</Text>
      <Text className="text-gray-800 font-medium leading-6">{value || 'Not Available'}</Text>
    </View>
  </View>
);

export default MemberDetails;