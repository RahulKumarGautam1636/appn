import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";

import {
  ArrowLeft,
  Bell,
  Calendar,
  Phone,
  MapPin,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import colors from "tailwindcss/colors";

const appointments = [
  {
    id: 1,
    name: "Neeraj Pandey",
    phone: "9307487225",
    gender: "Male",
    region: "Uttar Pradesh",
    remarks: "Customer hotel discussion done price list done anisha",
    scheduledDate: "14 Feb 03:05 PM",
    loggedTime: "15:44",
    loggedDate: "12 Feb",
    assignedTo: "SONALI",
    status: "reschedule",
    avatar: "NP",
    avatarColor: "#6366f1",
  },
  {
    id: 2,
    name: "Sunil Puri",
    phone: "9838021339",
    gender: "Male",
    region: "Uttar Pradesh",
    remarks: "Call not received",
    scheduledDate: "15 Feb 11:00 AM",
    loggedTime: "15:40",
    loggedDate: "12 Feb",
    assignedTo: "RAHUL",
    status: "pending",
    avatar: "SP",
    avatarColor: "#f59e0b",
  },
];

const statusConfig = {
  reschedule: {
    label: "Reschedule",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
};

const cardColor = 'blue';


export default function MarketingSalesPage() {
  const [activeView, setActiveView] = useState("Day");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View className="flex-1 bg-slate-200">
      {/* Header */}
      <View className="bg-indigo-900 px-5 pt-6 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Pressable className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center">
              <ArrowLeft size={18} color="white" />
            </Pressable>

            <View>
              <Text className="text-white/60 text-[11px] tracking-widest">
                GBOOKS INFOTECH
              </Text>
              <Text className="text-white text-lg font-bold">
                Marketing & Sales
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <Pressable className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center">
              <Bell size={18} color="white" />
            </Pressable>

            <View className="w-9 h-9 rounded-full bg-indigo-400 items-center justify-center">
              <Text className="text-white font-bold">A</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-violet-300 text-xl font-bold">39</Text>
            <Text className="text-white/60 text-xs">Total</Text>
          </View>

          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-green-300 text-xl font-bold">12</Text>
            <Text className="text-white/60 text-xs">Calls Done</Text>
          </View>

          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-yellow-300 text-xl font-bold">19</Text>
            <Text className="text-white/60 text-xs">Pending</Text>
          </View>
        </View>

        {/* <Pressable className="bg-indigo-500 rounded-xl py-3 items-center mt-4">
          <Text className="text-white font-semibold">+ New Appointment</Text>
        </Pressable> */}
      </View>

      {/* Search */}
      <View className="bg-white px-4 pt-4 pb-2 border-b border-gray-300">
        <View className="flex-row items-center bg-slate-100 rounded-xl px-3 py-1 mb-4 border border-gray-200">
          <TextInput
            placeholder="Search appointments..."
            className="flex-1 text-sm"
          />
        </View>

        {/* Day Week Month */}
        <View className="flex-row gap-2 mb-4">
          {["Day", "Week", "Month"].map((v) => (
            <Pressable
              key={v}
              onPress={() => setActiveView(v)}
              className={`flex-1 py-2 rounded-lg items-center border
                ${
                  activeView === v
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-200"
                }`}
            >
              <Text
                className={`text-sm font-semibold
                ${activeView === v ? "text-white" : "text-slate-500"}`}
              >
                {v}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Date */}
        <View className="flex-row items-center justify-between mb-2">
          <ChevronLeft size={20} color="#6366f1" />

          <View className="flex-row items-center gap-2">
            <Calendar size={16} color="#6366f1" />
            <Text className="font-semibold">12 Feb 2026</Text>
          </View>

          <ChevronRight size={20} color="#6366f1" />
        </View>
      </View>

      {/* Cards */}
      <ScrollView contentContainerClassName="px-3 py-3 gap-3">
        {appointments.map((appt) => {

          const sc = statusConfig[appt.status];

          const cardStyle = {
            borderTop: colors[cardColor][500],
            avatarBg: colors[cardColor][100],
            avatarText: colors[cardColor][600],
            remarksBorder: colors[cardColor][100],
            remarksBg: colors[cardColor][50],
          }

          return (
            <View
              key={appt.id}
              className={`bg-white rounded-2xl border-t-[3px] p-4 shadow-sm`}
              style={{ borderColor: cardStyle.borderTop }}
            >
              {/* Header */}
              <View className="flex-row items-center mb-3">
                <View className={`w-11 h-11 rounded-xl items-center justify-center mr-3`} style={{ backgroundColor: cardStyle.avatarBg }}>
                  <Text className={`font-bold`} style={{ color: cardStyle.avatarText }}>
                    {appt.avatar}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="font-bold text-slate-900">{appt.name}</Text>

                  <View className="flex-row items-center gap-1 mt-1">
                    <Phone size={12} color="#64748b" />
                    <Text className="text-xs text-slate-500">{appt.phone}</Text>
                  </View>
                </View>

                <View className="bg-slate-100 rounded-lg px-2 py-1">
                  <Text className="text-xs font-bold">{appt.loggedDate}</Text>
                  <Text className="text-[10px] text-slate-500">
                    {appt.loggedTime}
                  </Text>
                </View>
              </View>

              {/* Tags */}
              <View className="flex-row items-center gap-2 mb-3">
                <View className="bg-slate-100 px-2 py-1 rounded">
                  <Text className="text-xs">{appt.gender}</Text>
                </View>

                <View className="bg-slate-100 px-2 py-1 rounded flex-row items-center gap-1">
                  <MapPin size={10} color="#475569" />
                  <Text className="text-xs">{appt.region}</Text>
                </View>

                <View
                  className={`ml-auto px-2 py-1 rounded border ${sc.bg} ${sc.border}`}
                >
                  <Text className={`text-xs font-semibold ${sc.text}`}>
                    {sc.label}
                  </Text>
                </View>
              </View>

              {/* Remarks */}
              <View className={`rounded-lg p-3 mb-3 border`} style={{ borderColor: cardStyle.remarksBorder, backgroundColor: cardStyle.remarksBg }}>
                <Text className="text-[10px] text-slate-900 font-medium uppercase mb-1">
                  Remarks
                </Text>
                <Text className="text-sm text-slate-600">{appt.remarks}</Text>
              </View>

              {/* Schedule */}
              <View className="flex-row items-center gap-2 mb-3">
                <Calendar size={14} color="#6366f1" />
                <Text className="text-[0.8rem]">
                  Date :{" "}
                  <Text className="text-indigo-600 font-semibold text-[0.8rem]">
                    {appt.scheduledDate}
                  </Text>
                </Text>
              </View>

              {/* Bottom */}
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-slate-100 rounded-lg px-3 py-2 flex-row items-center gap-2">
                  <Text className="font-bold">{appt.assignedTo[0]}</Text>
                  <Text className="text-sm font-semibold text-slate-600">
                    {appt.assignedTo}
                  </Text>
                </View>

                <Pressable className="bg-orange-500 px-4 py-2 rounded-lg">
                  <Text className="text-white text-xs font-semibold">
                    Call Now
                  </Text>
                </Pressable>

                <Pressable className="w-9 h-9 rounded-lg bg-slate-100 items-center justify-center">
                  <Pencil size={14} color="#64748b" />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}