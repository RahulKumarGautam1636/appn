import { Card_2 } from "@/src/components";
import { setModal } from "@/src/store/slices/slices";
import { RootState } from "@/src/store/store";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {

    const user = useSelector((i: RootState) => i.user);
    const { selectedMember, membersList } = useSelector((i: RootState) => i.members);
    const [activeTab, setActiveTab] = useState("profile");
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    let { mainTab } = useGlobalSearchParams();

    useEffect(() => {
      if (mainTab) setActiveTab(mainTab);
    }, [])

    const filteredMembersList = membersList.length ? membersList.filter((i: any) => (i.MemberName.toLowerCase()).includes(searchQuery.toLowerCase())) : []

    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="pb-2 bg-white">
            <View className="justify-between flex-row p-4 items-center">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Account</Text>
            </Pressable>
            <View className="gap-3 flex-row items-center ml-auto">
                <Feather name="edit" size={20} color="black" />
                <Text className={`font-medium text-gray-500`}>Edit</Text>
                {/* <Feather name="share-2" size={20} color="black" /> */}
            </View>
            </View>
            <View className="flex-row gap-4 p-[13px] items-center">
            <Image className="shadow-md shadow-gray-300 rounded-full me-3" source={require("./../../assets/images/user.png")} style={{ width: 78, height: 78 }} />
            <View>
                <Text className="font-PoppinsSemibold text-[#075985] text-[15px] mb-2">{user.Name}</Text>
                <View className="flex-row gap-2 mb-[8px]">
                <FontAwesome5 name="clock" size={15} color="#075985" />
                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">
                    {user.Age} Year, {user.GenderDesc}
                </Text>
                </View>
                <View className="flex-row gap-2">
                <FontAwesome5 name="shield-alt" size={15} color="#075985" />
                <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{user.UserType}</Text>
                </View>
            </View>
            </View>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-y border-gray-200">
          <TouchableOpacity onPress={() => setActiveTab("profile")} className={`flex-1 py-3 items-center ${activeTab === "profile" ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`font-medium ${activeTab === "profile" ? "text-blue-500" : "text-gray-500"}`}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("members")} className={`flex-1 py-3 items-center ${activeTab === "members" ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`font-medium ${activeTab === "members" ? "text-blue-500" : "text-gray-500"}`}>Members</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("history")} className={`flex-1 py-3 items-center ${activeTab === "history" ? "border-b-2 border-blue-500" : ""}`}>
            <Text className={`font-medium ${activeTab === "history" ? "text-blue-500" : "text-gray-500"}`}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} colors={["#3b82f6"]} />}>
          {activeTab === "profile" && (
            <Animated.View entering={FadeIn.duration(300)} className="p-4">
              {/* Contact Information */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Contact Information</Text>
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm gap-4">
                <MedicalInfoItem icon={<Ionicons name="call-outline" size={18} color="#3b82f6" />} title="Phone Number" value={selectedMember.Mobile || "Not Available"} colorClass="bg-blue-100" />
                <MedicalInfoItem icon={<Ionicons name="mail-outline" size={18} color="#3b82f6" />} title="Email Address" value={selectedMember.Email || "Not Available"} colorClass="bg-blue-100" />
                <MedicalInfoItem icon={<Ionicons name="location-outline" size={18} color="#3b82f6" />} title="Address" value={`${selectedMember.Address}, ${selectedMember.City}, ${selectedMember.StateDesc} - ${selectedMember.Pin}`} colorClass="bg-blue-100" />
              </View>

              {/* Medical Information */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Medical Information</Text>
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm gap-4">
                <View className="flex-row flex-wrap">
                  <View className="w-1/2 pr-2 mb-4">
                    <MedicalInfoItem icon={<MaterialIcons name="bloodtype" size={18} color="#ef4444" />} title="Blood Group" value={selectedMember.BloodGroup || "Not Available"} colorClass="bg-red-100" />
                  </View>
                  <View className="w-1/2 pl-2 mb-4">
                    <MedicalInfoItem icon={<Ionicons name="person-outline" size={18} color="#ef4444" />} title="Gender" value={selectedMember.GenderDesc || "Not Available"} colorClass="bg-red-100" />
                  </View>
                  <View className="w-1/2 pr-2">
                    <MedicalInfoItem icon={<Ionicons name="calendar-outline" size={18} color="#ef4444" />} title="Date of Birth" value={selectedMember.DOB ? new Date(selectedMember.DOB).toLocaleDateString() : "Not Available"} colorClass="bg-red-100" />
                  </View>
                  <View className="w-1/2 pl-2">
                    <MedicalInfoItem icon={<Ionicons name="time-outline" size={18} color="#ef4444" />} title="Age" value={selectedMember.Age ? `${selectedMember.Age} years` : "Not Available"} colorClass="bg-red-100" />
                  </View>
                </View>
              </View>

              {/* Additional Information */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Additional Details</Text>
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm gap-4">
                <MedicalInfoItem icon={<MaterialIcons name="badge" size={18} color="#10b981" />} title="Member ID" value={selectedMember.MemberId?.toString() || "Not Available"} colorClass="bg-green-100" />
                <MedicalInfoItem icon={<Ionicons name="heart-outline" size={18} color="#10b981" />} title="Relationship" value={selectedMember.RelationShipWithHolder || "Primary"} colorClass="bg-green-100" />
                <MedicalInfoItem icon={<MaterialIcons name="local-hospital" size={18} color="#10b981" />} title="UHID" value={selectedMember.UHID || "Not Available"} colorClass="bg-green-100" />
                <MedicalInfoItem icon={<MaterialIcons name="location-city" size={18} color="#10b981" />} title="City" value={`${selectedMember.City}, ${selectedMember.StateDesc}`} colorClass="bg-green-100" />
              </View>
            </Animated.View>
          )}

          {activeTab === "members" && (
            <Animated.View entering={FadeIn.duration(300)} className="p-4">
              {/* Search bar */}
              <View className="bg-white rounded-xl mb-4 flex-row items-center px-4 py-[4px] border-2 border-gray-300">
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput placeholder="Search members..." value={searchQuery} onChangeText={setSearchQuery} className="flex-1 ml-2" placeholderTextColor="#9ca3af" />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              <View className="mb-4 flex-row justify-between items-center">
                <Text className="text-gray-700 font-bold text-lg">Members ({membersList.length})</Text>
                <TouchableOpacity onPress={() => dispatch(setModal({ name: "ADD_MEMBER", state: true }))} className="bg-blue-50 rounded-xl p-[12px] flex-row items-center justify-center border border-blue-200">
                    <Ionicons name="add-circle" size={20} color="#3b82f6" />
                    <Text className="text-blue-600 font-medium ml-2 leading-6">Add New Member</Text>
                </TouchableOpacity>
              </View>

              <View className="gap-3">
                {filteredMembersList.length === 0 ? (
                  <View className="bg-white rounded-xl py-14 items-center justify-center">
                    <Ionicons name="people" size={40} color="#d1d5db" />
                    <Text className="text-gray-400 mt-2 text-center">{searchQuery.length > 0 ? "No members match your search" : "No members found"}</Text>
                  </View>
                ) : (
                  filteredMembersList.map((member: any, index: number) => (
                    // <FamilyMemberCard
                    // key={index+"member001"}
                    // member={member}
                    // onPress={() => {}}
                    // />
                    <Card_2 active={member.MemberId === selectedMember.MemberId} data={member} index={index} key={index} />
                  ))
                )}
              </View>
            </Animated.View>
          )}

          {activeTab === "history" && (
            <Animated.View entering={FadeIn.duration(300)} className="p-4">
              <View className="bg-white rounded-xl p-4 mb-4">
                <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activity</Text>
                <View className="bg-gray-50 rounded-lg px-4 py-14 items-center justify-center">
                  <Ionicons name="time-outline" size={45} color="#9ca3af" />
                  <Text className="text-gray-600 text-center my-4 font-semibold">No recent activity available</Text>
                  <Text className="text-gray-400 text-sm text-center">Appointments and medical records will appear here</Text>
                </View>
              </View>
            </Animated.View>
          )}
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

export default Profile;