import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
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
  Search,
  Minus,
  Plus,
} from "lucide-react-native";
import colors from "tailwindcss/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { mmDDyyyyDate } from "@/src/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL, myColors } from "@/src/constants";
import { getFrom, getMonthDate, GridLoader, groupBy, NoContent } from "@/src/components/utils";
import DateTimePicker from '@react-native-community/datetimepicker';

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

const cardColor = 'sky';


export default function MarketingSalesPage() {
  const [activeView, setActiveView] = useState("Day");
  const [activeTab, setActiveTab] = useState(0);


  // NEW DASHBOARD IMPLEMENTAION
  const { selected: selectedCompany, list: companiesList } = useSelector((i: RootState) => i.companies);
  const [department, setDepartment] = useState({ loading: false, data: { PatientRegList: [], tabs: [] }, err: { status: false, msg: "" } });
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const user = useSelector((i: RootState) => i.user);
  const [selectedStage, setSelectedStage] = useState({});
  const [appointments, setAppointments] = useState({ loading: false, data: { PartyMasterList: [] }, err: { status: false, msg: "" } });

  const [fromDate, setFromDate] = useState(new Date());             // '2026-03-07'
  const [fromDateActive, setFromDateActive] = useState(false);
  const [toDate, setToDate] = useState(new Date(fromDate));
  const [toDateActive, setToDateActive] = useState(false);
  let range = { Day: 1, Week: 7, Month: 30 }
  const [duration, setDuration] = useState('Day');
  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    if (!selectedCompany.EncCompanyId) return;
    let controller = new AbortController();
    getDepartments(controller.signal, user, selectedCompany);
    return () => controller.abort();
  }, [user.UserId, selectedCompany.EncCompanyId]);

  const getDepartments = async (signal, user, company) => {
    if (user.UserId > 1) {
      const res = await getFrom(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=01/03/2026&dttoStr=05/03/2026`, {}, setDepartment, signal);
      if (res) {
        // let onlyOPD = res.data.PatientRegList.filter((i: any) => i.Department.includes('OPD'));
        let uniqueItems = groupBy(res.data.PatientRegList, 'Department');
        const firstStage = res.data.PatientRegList[0]?.LinkStageList[0]
        setSelectedDepartment(res.data.PatientRegList[0]);
        setSelectedStage(firstStage);
        setDepartment({...res, data: {PatientRegList: res.data.PatientRegList, tabs: uniqueItems}});
        // setDepartment(res);
      }
    }
  };

  useEffect(() => {
    if (!selectedDepartment.DeptCategory) return;
    let controller = new AbortController();
    getAppointments(selectedDepartment, user.UserId, selectedCompany, fromDate, toDate, controller.signal);
    return () => controller.abort();
  }, [user.UserId, selectedCompany.CompanyId, selectedDepartment.DeptCategory, fromDate, toDate]);

  const getAppointments = async (dept, userId, company, from, to, signal) => {
    console.log(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${dept.DeptCategory}&ProcedureId=${dept.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date(from).toLocaleDateString('en-TT')}&ToDateStr=${new Date(to).toLocaleDateString('en-TT')}&UserId=${userId}&RootId=0&LevelNo=0&SearchString=${''}&ReportType=${'CURRENTSTATUS'}&SrcUserId=0`);    
    if (user.UserId > 1) {
      const res = await getFrom(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${dept.DeptCategory}&ProcedureId=${dept.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date(from).toLocaleDateString('en-TT')}&ToDateStr=${new Date(to).toLocaleDateString('en-TT')}&UserId=${userId}&RootId=0&LevelNo=0&SearchString=${''}&ReportType=${'CURRENTSTATUS'}&SrcUserId=0`, {}, setAppointments, signal);
      if (res) {
        setAppointments(res);
      }
    }
  };


  let stageItems = appointments.data.PartyMasterList // .filter(((i: any) => i.OpportunityId === selectedStage.AutoId));

  // console.log(department);
  // console.log(stageItems);
  console.log(new Date(fromDate).toLocaleDateString('en-TT'), '================================================================');  

  const handleDate = (type) => {
    let from = fromDate;
    let to2 = toDate;
    let preDate = from // mmDDyyyyDate(from, '/', '/');
    let d = new Date(preDate);
    let a;

    if (firstClick) {
      if (type === 'next') {
        let to = new Date(from);
        setToDate(new Date(to.setDate(to.getDate() + range[duration])));
      } else {
        let to = new Date(to2);
        setFromDate(new Date(to.setDate(to.getDate() - range[duration])));
      }
      setFirstClick(false);
      return;
    }

    if (type === 'next') {
      a = new Date(d.setDate(d.getDate() + range[duration]));  
    } else {
      a = new Date(d.setDate(d.getDate() - range[duration]));
    }

    let to = new Date(a);

    if (range[duration] === 1) {
      setFromDate(a);
      setToDate(a);
      return;
    }
    
    setFromDate(a)
    setToDate(new Date(to.setDate(to.getDate() + range[duration])));
  }

  const [durationDropdown, setDurationDropdown] = useState(false);

  const DurationDropdown = () => {
    return (
      <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
        {Object.keys(range).map((i: any, n: number) => (
            <TouchableOpacity key={i} className={`flex-row gap-3 p-4 ${n === (Object.keys(range).length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setDuration(i); setDurationDropdown(false)}}>
                <MaterialCommunityIcons name={i === duration ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={23} color={myColors.primary[500]} />
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i}</Text>
            </TouchableOpacity>
        ))}
      </View>
    )
  }

  const getFormattedDate = (date: any) => date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const renderAppointments = () => {
    if (appointments.loading) {
        return <GridLoader containerClass='gap-3 m-3' classes='h-[15rem]' count={3} />;
    } else {
      return (
        <FlatList
          data={stageItems}
          keyExtractor={(item, index) => index + "_patient"}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-3 py-3 gap-3"
          renderItem={({item}: any) => (<AppointmentCard appt={item} />)}
          ListEmptyComponent={<NoContent imgClass='h-[200] mt-8 mb-4' />}
        />
      )
    }
  }

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
        {/* <View className="flex-row gap-3">
          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-violet-300 text-xl font-bold">39</Text>
            <Text className="text-white/60 text-xs">Total</Text>
          </View>
          <View className="flex-1 bg-green-500/30 rounded-xl p-3">
            <Text className="text-green-400 text-xl font-bold">12</Text>
            <Text className="text-white/60 text-xs">Calls Done</Text>
          </View>
          <View className="flex-1 bg-yellow-500/30 rounded-xl p-3">
            <Text className="text-yellow-400 text-xl font-bold">18</Text>
            <Text className="text-white/60 text-xs">Pending</Text>
          </View>
        </View> */}

        {/* <Pressable className="bg-indigo-500 rounded-xl py-3 items-center mt-4">
          <Text className="text-white font-semibold">+ New Appointment</Text>
        </Pressable> */}

        {/* Search */}
          <View className="">
            <View className="flex-row gap-3 items-center mb-4">
              <View className="flex-1 flex-row items-center bg-white/10 rounded-xl px-3 py-1">
                <TextInput
                  placeholder="Search Appointments..."
                  className="flex-1 text-sm text-white"
                  placeholderTextColor={colors.gray[300]}
                  />
              </View>
              <Pressable className="w-[3.3rem] h-[3.2rem] rounded-xl bg-orange-500/90 items-center justify-center">
                <Plus size={22} color={'#fff'} />
              </Pressable>
            </View>

            {/* Day Week Month */}
            <View className="flex-row gap-2 mb-4">
              {Object.keys(range).map((v: string) => (
                <Pressable key={v} onPress={() => setDuration(v)} className={`flex-1 py-2 rounded-lg items-center border ${ duration === v ? "bg-indigo-600 border-indigo-600" : "border-slate-400" }`}>
                  <Text className={`text-sm font-semibold ${duration === v ? "text-white" : "text-slate-400"}`}>
                    {v}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Date */}
            <View className="flex-row items-center justify-between">
              <Pressable onPress={() => handleDate('prev')} className="p-1 rounded-lg bg-indigo-500/30">
                <ChevronLeft size={20} color="#fff" />
              </Pressable>
              <View className="flex-row items-center gap-2">
                {range[duration] === 1 ? <Calendar size={16} color="#fff" /> : null}
                <Pressable onPress={() => setFromDateActive(true)}>
                  <Text className="font-semibold text-white">{getFormattedDate(fromDate)}</Text>
                </Pressable>
              </View>
              {range[duration] === 1 ? null : <><Minus size={20} color="#fff" />
              <View className="flex-row items-center gap-2">
                {/* <Calendar size={16} color="#6366f1" /> */}
                <Pressable onPress={() => setToDateActive(true)}>
                  <Text className="font-semibold text-white">{getFormattedDate(toDate)}</Text>
                </Pressable>
              </View></>}
              <Pressable onPress={() => handleDate('next')} className="p-1 rounded-lg bg-indigo-500/30">
                <ChevronRight size={20} color="#fff" />
              </Pressable>
            </View>
            {fromDateActive ? <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e: any, d: any) => {setFromDateActive(false); setFromDate(d); setFirstClick(true);}} /> : null}
            {toDateActive ? <DateTimePicker value={toDate} mode="date" display="default" onChange={(e: any, d: any) => {setToDateActive(false); setToDate(d); setFirstClick(true);}} /> : null}
          </View>
      </View>
      <View>
        <ScrollView horizontal contentContainerClassName="flex-row gap-3 p-3 bg-white">
        {/* <View className="flex-row gap-3 bg-white p-3"> */}
          {selectedDepartment?.LinkStageList?.map((item, index) => (                                                                                                                                         
            <TouchableOpacity className="max-w-[10rem] bg-green-100 rounded-xl p-3 border border-green-200/70" key={index} onPress={() => {setSelectedStage(item)}}>
              <Text className="text-green-600 text-xl font-bold">{item.OpportunityCnt}</Text>
              <Text className="text-gray-800 text-xs" numberOfLines={2}>{item.LinkDescription}</Text>
            </TouchableOpacity>
          ))}

          {/* <View className="flex-1 bg-violet-100 rounded-xl p-3 border border-violet-200/70">
            <Text className="text-violet-600 text-xl font-bold">39</Text>
            <Text className="text-gray-800 text-xs">Total</Text>
          </View>
          <View className="flex-1 bg-green-100 rounded-xl p-3 border border-green-200/70">
            <Text className="text-green-600 text-xl font-bold">12</Text>
            <Text className="text-gray-800 text-xs">Calls Done</Text>
          </View>
          <View className="flex-1 bg-orange-100 rounded-xl p-3 border border-orange-200/70">
            <Text className="text-orange-600 text-xl font-bold">19</Text>
            <Text className="text-gray-800 text-xs">Pending</Text>
          </View> */}
        {/* </View> */}
        </ScrollView>
      </View>


      {/* Cards */}
      {/* <ScrollView contentContainerClassName="px-3 py-3 gap-3"> */}
        {renderAppointments()}
      {/* </ScrollView> */}
    </View>
  );
}

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



const AppointmentCard = ({ appt }) => {
  const sc = statusConfig['reschedule'];

  const cardStyle = {
    borderTop: colors[cardColor][500],
    avatarBg: colors[cardColor][100],
    avatarText: colors[cardColor][600],
    remarksBorder: colors[cardColor][100],
    remarksBg: colors[cardColor][50],
  };

  return (
    <View className={`bg-white rounded-2xl border-t-[3px] p-4 shadow-sm`} style={{ borderColor: cardStyle.borderTop }} >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className={`w-11 h-11 rounded-xl items-center justify-center mr-3`} style={{ backgroundColor: cardStyle.avatarBg }}>
          <Text className={`font-bold`} style={{ color: cardStyle.avatarText }}>
            {appt.Name?.slice(0, 2).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="font-bold text-slate-900">{appt.Name}</Text>

          <View className="flex-row items-center gap-1 mt-1">
            <Phone size={12} color="#64748b" />
            <Text className="text-xs text-slate-500">{appt.RegMob1} {appt.RegMob2 && ` / ${appt.RegMob2}`}</Text>
          </View>
        </View>

        <View className="bg-slate-100 rounded-lg px-2 py-1">
          <Text className="text-xs font-bold">{getMonthDate(appt.NextAppDate)}</Text>
          <Text className="text-[10px] text-slate-500">
            {appt.NextAppTime}
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View className="flex-row items-center gap-2 mb-3">
        {appt.GenderDesc ? <View className="bg-slate-100 px-2 py-1 rounded">
          <Text className="text-xs">{appt.GenderDesc}</Text>
        </View> : null}
        {appt.Age ? <View className="bg-slate-100 px-2 py-1 rounded flex-row items-center gap-1">
          <MapPin size={10} color="#475569" />
          <Text className="text-xs">{appt.Age}</Text>
        </View> : null}
        {appt.City ? <View className="bg-slate-100 px-2 py-1 rounded flex-row items-center gap-1">
          <MapPin size={10} color="#475569" />
          <Text className="text-xs">{appt.City}</Text>
        </View> : null}

        <View className={`ml-auto px-2 py-1 rounded border ${sc.bg} ${sc.border}`}>
          <Text className={`text-xs font-semibold ${sc.text}`}>
            {sc.label}
          </Text>
        </View>
      </View>

      {/* Remarks */}
      <View className={`rounded-lg p-3 mb-3 border`} style={{ borderColor: cardStyle.remarksBorder, backgroundColor: cardStyle.remarksBg, }}>
        <Text className="text-[10px] text-slate-900 font-medium uppercase mb-1">
          Remarks
        </Text>
        <Text className="text-sm text-slate-600">{appt.Remarks2}</Text>
      </View>

      {/* Schedule */}
      <View className="flex-row items-center gap-2 mb-3">
        <Calendar size={14} color="#6366f1" />
        <Text className="text-[0.8rem]">
          Date :{" "}
          <Text className="text-indigo-600 font-semibold text-[0.8rem]">
            {getMonthDate(appt.NextFollowupDate)}  {appt.NextFollowupTime}
          </Text>
        </Text>
      </View>

      {/* Bottom */}
      <View className="flex-row items-center gap-2">
        <View className="flex-1 bg-slate-100 rounded-lg px-3 py-2 flex-row items-center gap-3">
          <Text className="font-bold">{appt.DoctName[0]}</Text>
          <Text className="text-sm font-semibold text-slate-600">
            {appt.DoctName}
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
}