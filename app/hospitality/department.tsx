import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { ArrowLeft, Bell, Calendar, Phone, MapPin, Pencil, ChevronLeft, ChevronRight, Search, Minus, Plus, CreditCard, Check, ArrowLeftRight, Shield, Gift, MessageCircle, FileText, Funnel, X, Layers, ChevronDown, Sparkles, MessageSquare, } from "lucide-react-native";
import colors from "tailwindcss/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import ButtonPrimary, { mmDDyyyyDate, MyModal, sortByCount, SvgLoader } from "@/src/components";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL, myColors } from "@/src/constants";
import { FieldLabel, getFrom, getMonthDate, getRandomColor, GridLoader, groupBy, NoContent } from "@/src/components/utils";
import DateTimePicker from '@react-native-community/datetimepicker';

import React from "react";
import { SafeAreaView } from "react-native";
import { CalendarDays, Clock, User, CheckCircle2, CalendarClock, StickyNote, LayoutGrid, Table2 } from "lucide-react-native";
import UpdateStage from "./stageUpdate";
import dayjs from "@/src/components/utils/dayjs";
import axios from "axios";


const cardColor = { '1': 'rose', '2': 'yellow', '3': 'green' };

export default function MarketingSalesPage() {

  const user = useSelector((i: RootState) => i.user);
  const { selected: selectedCompany, list: companiesList } = useSelector((i: RootState) => i.companies);
  const { current: selectedDepartment, stage: currentStage} = useSelector((i: RootState) => i.appData.department);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState({});
  const [appointments, setAppointments] = useState({ loading: false, data: { PartyMasterList: [] }, err: { status: false, msg: "" } });
  const [fromDate, setFromDate] = useState(new Date());             // '2026-02-14T18:30:00.000Z'
  const [fromDateActive, setFromDateActive] = useState(false);
  const [toDate, setToDate] = useState(new Date(fromDate));
  const [toDateActive, setToDateActive] = useState(false);
  let range = { Day: 1, Week: 7, Month: 30 }
  const [duration, setDuration] = useState('Day');
  const [firstClick, setFirstClick] = useState(false);
  const [forceRerender, setForceRerender] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilterUserId, setSelectedFilterUserId] = useState(0);
  const [reportType, setReportType] = useState("CURRENTSTATUS");            // set reportType === 'SEARCH' and selectedFilterUserId === 0 when searching in input box.
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [refresh, setRefresh] = useState(1);

  const makeForcedRerender = async () => {
    setForceRerender(true);
    setTimeout(() => {
      setForceRerender(false);
    }, 1000);
  }

  useEffect(() => {
    if (!selectedDepartment.DeptCategory) return;
    let controller = new AbortController();
    getAppointments(selectedDepartment, user.UserId, selectedCompany, fromDate, toDate, selectedFilterUserId, reportType, query, controller.signal);
    return () => controller.abort();
  }, [user.UserId, selectedCompany.CompanyId, selectedDepartment.DeptCategory, fromDate, toDate, selectedFilterUserId, reportType, query, refresh]);

  const getAppointments = async (dept, userId, company, from, to, filterUserId, currReportType, serchString, signal) => {
    console.log(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${dept.DeptCategory}&ProcedureId=${dept.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date(from).toLocaleDateString('en-TT')}&ToDateStr=${new Date(to).toLocaleDateString('en-TT')}&UserId=${userId}&RootId=0&LevelNo=0&SearchString=${serchString}&ReportType=${currReportType}&SrcUserId=${filterUserId}`);    
    if (user.UserId > 1) {
      const res = await getFrom(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${dept.DeptCategory}&ProcedureId=${dept.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date(from).toLocaleDateString('en-TT')}&ToDateStr=${new Date(to).toLocaleDateString('en-TT')}&UserId=${userId}&RootId=0&LevelNo=0&SearchString=${serchString}&ReportType=${currReportType}&SrcUserId=${filterUserId}`, {}, setAppointments, signal);
      if (res) {
        let deptStages = selectedDepartment?.LinkStageList;
        let arr: any = []
        deptStages.forEach((item: any) => {
          const stageItems = res.data.PartyMasterList?.filter((i: any) => i.OpportunityId === item.AutoId);
          arr.push({ ...item, OpportunityCnt: stageItems.length });
        });
        let sortedStages = sortByCount(arr, 'OpportunityCnt');
        setStages(sortedStages); 
        if (currentStage.LinkDescription) {
          setSelectedStage(currentStage);
        } else {
          setSelectedStage(sortedStages[0]);
        }      
        setAppointments(res);
      }
    }
  };

  let stageItems = appointments.data.PartyMasterList.filter(((i: any) => i.OpportunityId === selectedStage.AutoId)); 

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

  const getFormattedDate = (date: any) => date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const renderAppointments = () => {    
    if (appointments.loading || forceRerender) {
        return <GridLoader containerClass='gap-3 m-3 flex-col' classes='h-[14rem]' count={3} />;
    } else {
      return (
        <FlatList
          data={stageItems}
          keyExtractor={(item, index) => index + "_patient"}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-3 py-3 gap-3"
          renderItem={({item}: any) => (<AppointmentCard appt={item} setRefresh={setRefresh} />)}
          ListEmptyComponent={<NoContent imgClass='h-[200] mt-8 mb-4' />}
        />
      )
    }
  }

  const renderStages = () => {
    if (appointments.loading) {
      return <GridLoader containerClass='gap-3 p-3 flex-row bg-white' count={3} classes='h-[47px] flex-1' />;
    } else {
      return (
        <ScrollView horizontal contentContainerClassName="flex-row gap-3 p-3 bg-white">
          {stages?.map((item, index) => {          
            const stageColor = cardColor[String(item.LevelId)];
            const btnStyle = { border: colors[stageColor][200], bg: colors[stageColor][100], text: colors[stageColor][600], };
            return (
              <TouchableOpacity className={`flex flex-row items-center border rounded-xl relative`} key={index} onPress={() => {setSelectedStage(item); makeForcedRerender()}} style={{backgroundColor: btnStyle.bg, borderColor: btnStyle.border}}>
                <Text className="text-xl font-bold p-3 text-white rounded-tl-xl rounded-bl-xl" style={{backgroundColor: btnStyle.text}}>{item.OpportunityCnt}</Text>
                <Text className="text-gray-800 text-xs px-3 max-w-[10rem]" numberOfLines={2}>{item.LinkDescription}</Text>
                {selectedStage.AutoId === item.AutoId ? <View className="w-2 h-2 rounded-full absolute top-1 right-1 bg-blue-500" /> : null}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )
    }
  }

  const [filterUsers, setFilterUsers] = useState({ loading: false, data: [], err: { status: false, msg: "" } });

  useEffect(() => {
    if (!selectedDepartment.DeptId) return;
    const getFilterUsers = async (companyId, deptCategory, signal) => {
      if (!companyId) return;
      console.log(`${BASE_URL}/api/UserReg/GetAllUserOfDept?CompId=${companyId}&DeptId=${deptCategory}`);    
      const res = await getFrom(`${BASE_URL}/api/UserReg/GetAllUserOfDept?CompId=${companyId}&DeptId=${deptCategory}`, {}, setFilterUsers, signal);
      if (res) {
        setFilterUsers(res);
      }
    };

    let controller = new AbortController();
    getFilterUsers(selectedCompany.EncCompanyId, selectedDepartment.DeptId, controller.signal);
    return () => controller.abort();
  }, [selectedCompany.EncCompanyId, selectedDepartment.DeptId]);

  const handleSearch = (text: string) => {
    if (text.trim().length < 2) return;
    if (reportType !== 'SEARCH' || selectedFilterUserId ) {
      setReportType('SEARCH'); 
      setSelectedFilterUserId(0)
    }
    setQuery(text); 
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(debounceQuery)   
      console.log(debounceQuery);                                                 
    }, 800);
    return () => clearTimeout(timer)
  }, [debounceQuery])

  return (
    <View className="flex-1 bg-slate-200">
      {false ? null : <><View className="bg-sky-900 px-5 pt-6 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Pressable className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center">
              <ArrowLeft size={18} color="white" />
            </Pressable>
            <View>
              <Text className="text-white/60 text-[11px] tracking-widest">GBOOKS INFOTECH</Text>
              <Text className="text-white text-lg font-bold">{selectedDepartment.Department}</Text>
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
        <View className="">
          <View className="flex-row gap-3 items-center mb-4">
            <View className="flex-1 flex-row items-center bg-white/10 rounded-xl px-3 py-1 h-full">
              <TextInput onChangeText={(text) => setDebounceQuery(text)} value={debounceQuery} placeholder="Search Appointments..." className="flex-1 text-sm text-white" placeholderTextColor={colors.gray[300]} />
            </View>
            <Pressable className="w-[3.3rem] h-[3.2rem] rounded-xl bg-orange-500/90 items-center justify-center">
              <Plus size={22} color={'#fff'} />
            </Pressable>
          </View>

          {/* Day Week Month */}
          <View className="flex-row gap-3 items-center mb-4">
            <View className="flex-row gap-2 flex-1">
              {Object.keys(range).map((v: string) => (
                <Pressable key={v} onPress={() => setDuration(v)} className={`flex-1 py-2 rounded-lg items-center border ${ duration === v ? "bg-sky-600 border-sky-600" : "border-slate-400" }`}>
                  <Text className={`text-sm font-semibold ${duration === v ? "text-white" : "text-slate-400"}`}>
                    {v}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TouchableOpacity onPress={() => setOpenFilters(true)} className={`py-2 rounded-lg items-center bg-gray-300 border border-white w-[3.3rem]`}>
              <Funnel size={18} color={'black'} />
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => handleDate('prev')} className="p-1 rounded-lg bg-sky-500/30">
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
            <Pressable onPress={() => handleDate('next')} className="p-1 rounded-lg bg-sky-500/30">
              <ChevronRight size={20} color="#fff" />
            </Pressable>
          </View>
          {fromDateActive ? <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e: any, d: any) => {setFromDateActive(false); setFromDate(d); setFirstClick(true);}} /> : null}
          {toDateActive ? <DateTimePicker value={toDate} mode="date" display="default" onChange={(e: any, d: any) => {setToDateActive(false); setToDate(d); setFirstClick(true);}} /> : null}
        </View>
      </View></>}
      <View>
        {renderStages()}
      </View>
      {renderAppointments()}
      <MyModal modalActive={openFilters} onClose={() => setOpenFilters(false)} child={<SettingsScreen filterStages={stages} selectedStageId={selectedStage.AutoId} selectStage={setSelectedStage} filterUsers={filterUsers} selectedFilterUserId={selectedFilterUserId} selectUser={setSelectedFilterUserId} />} />
    </View>
  );
}

const AppointmentCard = ({ appt, setRefresh }: any) => {
  const stageColor = cardColor[String(appt.LevelId)];
  const cardStyle = {
    borderTop: colors[stageColor][500],
    avatarBg: colors[stageColor][100],
    avatarText: colors[stageColor][600],
    remarksBorder: colors[stageColor][100],
    remarksBg: colors[stageColor][50],
  };

  const [openDetails, setOpenDetails] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  
  const checkSalesItems = (item: any) => {
    if (item.TranRefType === "ENQ") {
      return item.EnqList
    }
    else if (item.TranRefType === "ORDER") {
      return item.OrderList
    }
    return []
  }

  const salesItems = checkSalesItems(appt);

  return (
    <View className={`bg-white rounded-2xl border-t-[3px] p-4 shadow-sm`} style={{ borderColor: cardStyle.borderTop }} >
      <View className="flex-row items-center mb-3">
        <View className={`w-11 h-11 rounded-xl items-center justify-center`} style={{ backgroundColor: cardStyle.avatarBg }}>
          <Text className={`font-bold`} style={{ color: cardStyle.avatarText }}>{appt.Name?.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View className="flex-1 ml-3 mr-1.5">
          <Text className="font-bold text-slate-900" numberOfLines={1}>{appt.Name}</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Phone size={12} color="#64748b" />
            <Text className="text-xs text-slate-500">{appt.RegMob1} {appt.RegMob2 && ` / ${appt.RegMob2}`}</Text>
          </View>
        </View>
        <View className="bg-slate-100 rounded-lg px-2 py-1">
          <Text className="text-xs font-bold">{getMonthDate(appt.NextAppDate)}</Text>
          <Text className="text-[10px] text-slate-500">{appt.NextAppTime}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        {appt.GenderDesc ? <View className="mb-3 bg-slate-100 px-2 py-1 rounded">
          <Text className="text-xs">{appt.GenderDesc}</Text>
        </View> : null}
        {appt.Age ? <View className="mb-3 bg-slate-100 px-2 py-1 rounded flex-row items-center gap-1">
          <MapPin size={10} color="#475569" />
          <Text className="text-xs">{appt.Age}</Text>
        </View> : null}
        {appt.City ? <View className="mb-3 bg-slate-100 px-2 py-1 rounded flex-row items-center gap-1">
          <MapPin size={10} color="#475569" />
          <Text className="text-xs">{appt.City}</Text>
        </View> : null}
        {/* <View className={`mb-3 ml-auto px-2 py-1 rounded border ${sc.bg} ${sc.border}`}>
          <Text className={`text-xs font-semibold ${sc.text}`}>
            {sc.label}
          </Text>
        </View> */}
      </View>

      {salesItems.map((item: any, index: number) => (
        <View key={index + "key001"} className="bg-gray-50 px-4 py-3 border-t border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              {Boolean(item.ItemDesc) && (
                <Text className="text-gray-700 text-sm font-medium">{item.ItemDesc}</Text>
              )}
              {Boolean(appt.PBankDesc) && (
                <Text className="text-gray-500 text-xs mt-0.5">{appt.PBankDesc}</Text>
              )}
            </View>
            {Boolean(item.Amount) && (
              <Text className="text-green-700 font-bold text-sm">₹{item.Amount}</Text>
            )}
          </View>
        </View>
      ))}

      {appt.Remarks2 ? <View className={`rounded-lg p-3 mb-3 border`} style={{ borderColor: cardStyle.remarksBorder, backgroundColor: cardStyle.remarksBg, }}>
        <Text className="text-[10px] text-slate-900 font-medium uppercase mb-1">Remarks</Text>
        <Text className="text-sm text-slate-600">{appt.Remarks2}</Text>
      </View> : null}
      <View className="flex-row items-center gap-2 mb-3">
        <Calendar size={14} color="#6366f1" />
        <Text className="text-[0.8rem]">
          Date :{" "}
          <Text className="text-indigo-600 font-semibold text-[0.8rem]">{getMonthDate(appt.NextFollowupDate)}  {appt.NextFollowupTime}</Text>
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="flex-1 bg-slate-100 rounded-lg px-3 py-[0.42rem] flex-row items-center gap-3">
          <Text className="font-bold text-sm">{appt.DoctName[0]}</Text>
          <Text className="text-[0.83rem] font-semibold text-slate-600">{appt.DoctName}</Text>
        </View>
        {appt.IsCanceled === 'Y' ? 
          <Pressable className="px-4 py-2 rounded-lg" style={{backgroundColor: cardStyle.borderTop}}>
            <Text className="text-white text-xs font-semibold">Cancelled</Text>
          </Pressable>
        : 
          <>
            {appt.OpportunityDesc ? 
            <Pressable onPress={() => setOpenDetails(true)} className="px-4 py-2 rounded-lg" style={{backgroundColor: cardStyle.borderTop}}>
              <Text className="text-white text-xs font-semibold">{appt.OpportunityDesc}</Text>
            </Pressable> : null}
          </>
        }
        {/* getStages(selectedCompany.EncCompanyId, user, appt) */}
        <Pressable onPress={() => setUpdateModal(true)} className="w-9 h-9 rounded-lg bg-slate-100 items-center justify-center">
          <Pencil size={14} color="#64748b" />
        </Pressable>
      </View>
      <MyModal modalActive={openDetails} containerClass='mt-auto' onClose={() => setOpenDetails(false)} child={<AppointmentActivity apptn={appt} />} />
      <MyModal modalActive={updateModal} onClose={() => setUpdateModal(false)} child={<UpdateStage appt={appt} setRefresh={setRefresh} />} />
    </View>
  );
}

const DateTab = ({ tab, active, onPress }: any) => {
  if (tab.date === "All") {
    return (
      <TouchableOpacity onPress={onPress} className={`px-5 rounded-2xl mr-2 border ${ active ? "bg-violet-600 border-violet-600" : "bg-gray-100 border-gray-200" }`} >
        <Text className={`text-sm font-bold my-auto ${ active ? "text-white" : "text-gray-500" }`} >All</Text>
      </TouchableOpacity> );
  }

  let splitDate = new Date(tab.date).toDateString()

  const btnColor = cardColor[String(tab.level)];
  const btnStyle = {
    borderClr: colors[btnColor][200],
    bg: active ? colors[btnColor][500] : colors[btnColor][50],
    textClr: active ? '#ffffff' : colors[btnColor][600]
  };

  return (
    <TouchableOpacity onPress={onPress} className={`px-4 py-2 rounded-2xl mr-2 border items-center min-w-[72px]`} style={{borderColor: btnStyle.borderClr, backgroundColor: btnStyle.bg}}>
      <Text className={`text-sm font-bold leading-tight`} style={{color: btnStyle.textClr}}>
        {splitDate.split(' ')[2]} {splitDate.split(' ')[1]}
      </Text>
      <Text className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
        {splitDate.split(' ')[0]}
      </Text>
    </TouchableOpacity>
  );
};

const COL = { appt: 19, purpose: 27, remarks: 19, next: 22, action: 13 };     // purpose: 27

const TH = ({ label, width }: { label: string; width: number }) => (
  <View style={{ width: `${width}%` }} className="py-3 px-2.5 justify-center">
    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </Text>
  </View>
);

const TD = ({ width, children }: { width: number; children: React.ReactNode }) => (
  <View style={{ width: `${width}%` }} className="py-3 px-2.5 justify-center border-e border-gray-100">
    {children}
  </View>
);

const TableView = ({ data, onEdit, setRefreshDetails }: any) => {
  const [editOpen, setEditOpen] = useState({ status: false, selectedRow: {} });
  
  return ( 
    <View className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerClassName='min-w-full'>
        <View className="w-full min-w-[34rem]">
          <View className="flex-row bg-gray-100 border-b border-gray-100">
            <TH label="Appt" width={COL.appt} />
            <TH label="Purpose" width={COL.purpose} />
            {/* <TH label="Staff" width={COL.staff} /> */}
            <TH label="Remarks" width={COL.remarks} />
            <TH label="Next Appt" width={COL.next} />
            <TH label="Action" width={COL.action} />
          </View>

          <React.Fragment >
            {data.toReversed().map((row, n) => {                
              const nextAppDate = (new Date(row.NextAppDate).toDateString()).split(' ');       
              const nextFollowupDate = (new Date(row.NextFollowupDate).toDateString()).split(' ');
              const rowColor = cardColor[String(row.LevelId)];
              const rowStyle = {
                borderClr: colors[rowColor][200],
                bgClr: colors[rowColor][50],
                textBg: colors[rowColor][100],
                clr: colors[rowColor][500],
                textClr: colors[rowColor][600]
              };  

              return (
                // <View key={index} className={`flex-row ${ index < data?.items?.length - 1 ? "border-b border-gray-50" : "" }`} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa" }} >
                <View key={n} className={`flex-row ${ n < data?.length - 1 ? "border-b border-gray-100" : "" }`} 
                  style={{ 
                    // backgroundColor: rowStyle.bgClr, 
                    // borderColor: rowStyle.borderClr 
                  }} 
                >
                  <TD width={COL.appt}>
                    <View style={{ borderLeftColor: rowStyle.textClr, borderLeftWidth: 3 }} className="pl-2 rounded-sm" >
                      <Text className="text-xs font-semibold text-gray-800">
                        {nextAppDate[2]} {nextAppDate[1]} {nextAppDate[3].slice(2)}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">{row.NextAppTime}</Text>
                    </View>
                  </TD>

                  <TD width={COL.purpose}>
                    <View style={{ backgroundColor: rowStyle.textBg }} className="self-start rounded-lg px-2 py-1 mb-1.5" >
                      <Text style={{ color: rowStyle.textClr }} className="text-xs font-semibold">
                        {row.OpportunityDesc || '------'}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-500 flex-1 mt-1" numberOfLines={2}>
                      {row.UserFullName}
                    </Text>
                  </TD>

                  {/* <TD width={COL.staff}>
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center shrink-0">
                        <User size={11} color="#9CA3AF" />
                      </View>
                      <Text className="text-xs text-gray-600 flex-1" numberOfLines={2}>
                        {row.staff}
                      </Text>
                    </View>
                  </TD> */}

                  <TD width={COL.remarks}>
                    <Text className="text-xs text-gray-600 text-center">{row.Remarks2 || '------'}</Text>
                  </TD>

                  <TD width={COL.next}>
                    {row.NextFollowupDate ? (
                      <View className="flex-row items-center gap-1 px-2 py-1 rounded-lg self-center" style={{ backgroundColor: rowStyle.clr }}>
                        {/* <CalendarClock size={10} color="#7C3AED" /> */}
                        <Text className="text-xs font-semibold" style={{ color: 'white' }}>
                          {/* {row.NextFollowupDate || '------'} */}
                          {nextFollowupDate[2]} {nextFollowupDate[1]} {nextFollowupDate[3].slice(2)}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-xs text-gray-600 text-center">------</Text>
                    )}
                    {row.NextFollowupTime ? <Text className="text-xs text-gray-500 mt-1 text-center">{row.NextFollowupTime}</Text> : null}
                  </TD>

                  <TD width={COL.action}>
                    <TouchableOpacity onPress={() => setEditOpen({status: true, selectedRow: row})} className="p-2 rounded-xl bg-gray-100 active:bg-gray-100 self-center" >
                      <Pencil size={14} color="#6B7280" /> 
                    </TouchableOpacity>
                  </TD>
                </View>
              ) 
              })}  
          </React.Fragment>
        </View>
      </ScrollView>
      <MyModal modalActive={editOpen.status} onClose={() => setEditOpen({status: false, selectedRow: {}})} containerClass='mt-auto' child={<RowUpdate data={{row: editOpen.selectedRow}} setRefreshDetails={setRefreshDetails} />} />
    </View>
  );
}

// ─── View Toggle ─────────────────────────────────────────────────────────────

const ViewToggle = ({ view, onChange }: any) => (
  <View className="flex-row bg-gray-100 rounded-xl p-2 gap-1">
    <TouchableOpacity onPress={() => onChange("stage")} className={`flex-1 justify-center flex-row items-center gap-1.5 px-3 py-2.5 rounded-lg ${ view === "stage" ? "bg-white shadow-sm" : "shadow-none" }`} >
      <LayoutGrid size={14} color={view === "stage" ? "#7C3AED" : "#9CA3AF"} />
      <Text className={`text-sm font-semibold ${ view === "stage" ? "text-violet-600" : "text-gray-400" }`} >
        Stages
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onChange("user")} className={`flex-1 justify-center flex-row items-center gap-1.5 px-3 py-2.5 rounded-lg ${ view === "user" ? "bg-white shadow-sm" : "shadow-none" }`} >
      <Table2 size={14} color={view === "user" ? "#7C3AED" : "#9CA3AF"} />
      <Text className={`text-sm font-semibold ${ view === "user" ? "text-violet-600" : "text-gray-400" }`} >
        Users
      </Text>
    </TouchableOpacity>
  </View>
);

// ─── Root Screen ─────────────────────────────────────────────────────────────

export function AppointmentActivity({ apptn }: any) {
  const handleEdit = (id: number) => console.log("Edit", id);
  const [loading, setLoading] = useState(false);

  const makeForcedRerender = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }

  // NEW WORK ==================================================================================================================

  const { selected: selectedCompany } = useSelector((i: RootState) => i.companies);
  const { current: selectedDepartment } = useSelector((i: RootState) => i.appData.department);
  const user = useSelector((i: RootState) => i.user);
  const [details, setDetails] = useState({ loading: false, data: { PartyMasterList: [] }, err: { status: false, msg: "" } });
  const [formattedData, setFormattedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState({ date: 'All', items: [], level: 0 });
  const [refreshDetails, setRefreshDetails] = useState(1);  

  useEffect(() => {
    if (!selectedDepartment.DeptId) return;
    const getDetails = async (department, company, userId, signal) => {
      if (!department) return;
      console.log(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${department.DeptCategory}&ProcedureId=${department.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date().toLocaleDateString('en-TT')}&ToDateStr=${new Date().toLocaleDateString('en-TT')}&UserId=${userId}&RootId=${apptn.ChainRootId}&LevelNo=${apptn.LevelNo}&SearchString=&ReportType=TASKHISTORY&SrcUserId=0`);    
      const res = await getFrom(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${department.DeptCategory}&ProcedureId=${department.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date().toLocaleDateString('en-TT')}&ToDateStr=${new Date().toLocaleDateString('en-TT')}&UserId=${userId}&RootId=${apptn.ChainRootId}&LevelNo=${apptn.LevelNo}&SearchString=&ReportType=TASKHISTORY&SrcUserId=0`, {}, setDetails, signal);
      if (res) {
        const sorted = res.data?.PartyMasterList.sort((a: any, b: any) => a.AutoId - b.AutoId);
        setDetails({ ...res, data: { PartyMasterList: sorted } });
      }
    };

    let controller = new AbortController();
    getDetails(selectedDepartment, selectedCompany, user.UserId, controller.signal);
    return () => controller.abort();
  }, [selectedDepartment.DeptId, selectedCompany.CompanyId, selectedCompany.LocationId, user.UserId, refreshDetails]);

    
  useEffect(() => {
    const groupByDate = groupBy(details.data.PartyMasterList, 'NextAppDate');    
    // const sortedDateKeys = Object.keys(groupByDate).sort((a, b) => new Date(b) - new Date(a));
    // console.log(sortedDateKeys);
    
    const sortedEntries = Object.fromEntries(Object.entries(groupByDate).sort((a, b) => new Date(b[0]) - new Date(a[0])));
    
    const formatted = Object.keys(sortedEntries).map((date: any) => {
      const maxLevel = sortedEntries[date].map((i: any) => i.LevelId || 1);
      return {
        date: date,
        // items: sortedEntries[date],
        level: Math.max(...maxLevel)
      }
    })
    setFormattedData(formatted)  
    // setSelectedDate(formatted[0])
  }, [details.loading])

  const tableData = selectedDate.date === 'All' ? details.data.PartyMasterList : details.data.PartyMasterList.filter((i: any) => i.NextAppDate === selectedDate.date);

  return (
    <ScrollView contentContainerClassName="p-4 min-h-[30rem] bg-white" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center mb-5 gap-4">
          <View>
          <Text className="text-lg font-bold text-gray-900">Activity Details</Text>
        </View>
        {/* <ViewToggle view={view} onChange={setView} /> */}
            <Text className="text-sm text-gray-500">
              ( {tableData.length} {tableData.length !== 1 ? "Entries" : "Entry"} )
            </Text>
        </View>
        {/* {TABS.map((i: any) => (<Pressable onPress={() => {makeForcedRerender(); setActiveTab(i.value)}}><Text>{i.value}</Text></Pressable>))} */}
      <View>
      {details.loading ? 
        <GridLoader containerClass='gap-3 py-3 flex-row bg-white' count={3} classes='h-[53px] flex-1' /> 
        :
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mb-5">
          <DateTab tab={{ date: 'All' }} active={selectedDate.date === 'All'} onPress={() => {makeForcedRerender(); setSelectedDate({ date: 'All', items: [], level: 0 })}} />
          {formattedData.map((item) => (
            <DateTab
              key={item.date}
              tab={item}
              active={selectedDate.date === item.date}
              onPress={() => {makeForcedRerender(); setSelectedDate(item)}}
            />
          ))}
        </ScrollView>
      }
      </View>
        {loading ? null : <TableView onEdit={handleEdit} data={tableData} setRefreshDetails={setRefreshDetails} />}
      </ScrollView>
  );
}

export function SettingsScreen({ onClose, filterStages, selectedStageId, filterUsers, selectedFilterUserId, selectStage, selectUser }: any) {
  const [view, setView] = useState('stage');

  const onStageSelect = (i: any) => {
    selectStage(i)
    onClose(false);
  }

  const onUserSelect = (i: any) => {
    selectUser(i.UserId)
    onClose(false);
  }

  return (    
      <View className="p-4 flex-1">
        <View className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-blue-100 pb-4">
          <View className="px-6 pt-6 pb-4 border-b border-gray-100">
            <ViewToggle view={view} onChange={setView} />
          </View>
          {/* {view === 'stage' ? 
            filterStages.map((item: any, index: number) => <FilterBtn key={index} index={index} view={view} data={item} active={selectedStageId === item.AutoId } onPress={onStageSelect} />)
            : 
            filterUsers.data.map((item: any, index: number) => <FilterBtn key={index} index={index} view={view} data={item} active={selectedFilterUserId === item.UserId} onPress={onUserSelect} />)
          } */}

          {view === 'stage' ? 
            <FlatList
              data={filterStages}
              keyExtractor={(item, index) => index + "_stages"}
              // showsVerticalScrollIndicator={false}
              // contentContainerClassName="px-3 py-3 gap-3"
              renderItem={({item, index}: any) => (<FilterBtn index={index} view={view} data={item} active={selectedStageId === item.AutoId } onPress={onStageSelect} />)}
              ListEmptyComponent={<NoContent imgClass='h-[200] mt-8 mb-4' />}
            />
            :
            <FlatList
              data={filterUsers.data}
              keyExtractor={(item, index) => index + "_users"}
              // showsVerticalScrollIndicator={false}
              contentContainerClassName="flex-1"
              renderItem={({item, index}: any) => (<FilterBtn index={index} view={view} data={item} active={selectedFilterUserId === item.UserId} onPress={onUserSelect} />)}
              ListEmptyComponent={<NoContent imgClass='h-[200] mt-8 mb-4' />}
            />        
          }
        </View>
      </View>
  );
}

const FilterBtn = ({ data, onPress, index, view, active }: any) => {
  let bgColor = getRandomColor(index)['100'];
  return (
    <>
      <TouchableOpacity onPress={() => onPress(data)} activeOpacity={0.65} className={`flex-row items-center px-4 py-2.5 ${active ? 'bg-purple-50 border-y border-purple-200/80' : ''}`}>
        <View className={`w-9 h-9 rounded-xl items-center justify-center mr-3`} style={{backgroundColor: bgColor}}>
          {view === 'stage' ? <Text className="font-semibold text-sm">{data.OpportunityCnt}</Text> : <FontAwesome5 name="user-tie" size={14} color="gray" />}
        </View>
        <Text className="flex-1 text-sm text-slate-700" style={{ fontFamily: "System", letterSpacing: 0.1 }}>
          {view === 'stage' ? data.LinkDescription : data.UserFullName}
        </Text>
        {active ?
          <FontAwesome5 name="check" size={16} color={colors.orange[500]} />
          :
          <ChevronRight size={18} color="#94a3b8" strokeWidth={2} />
        }
      </TouchableOpacity>
      <View className="h-[1px] bg-slate-100 mx-4" />
    </>
  )
}



const RowUpdate = ({ data, onClose, setRefreshDetails }: any) => {

  const { row } = data;
  const ac = "#6366f1"; // primary accent
  const initials = row.UserFullName?.split(" ")?.slice(0, 2)?.map((n: any) => n[0])?.join("").toUpperCase();
  const user = useSelector((i: RootState) => i.user);
  const [loading, setLoading] = useState(false);

  const [dateOepn, setDateOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)

  const handleDateSelect = (e, date) => {
    if (e.type === "set" && date) {
      setRegisterData((pre) => ({ ...pre, NextAppDateStr: dayjs(date).format("DD/MM/YYYY") }));
    }
    setDateOpen(false);
  } 
  const handleTimeSelect = (e, time) => {
    if (e.type === "set" && time) {
      setRegisterData((pre) => ({ ...pre, NextAppTime: dayjs(time).format('HH:mm') }));
    }
    setTimeOpen(false);
  }

  const [registerData, setRegisterData] = useState({
    FollowUpId: row.LastAutoId,
    Remarks: row.Remarks2,
    NextAppDateStr: dayjs(row.NextAppDate).format('DD/MM/YYYY'),
    NextAppTime: row.NextAppTime,
    UserId: user?.UserId
  }) 

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log(`${BASE_URL}/api/Appointment/UpdateStage`, registerData);
      const res = await axios.post(`${BASE_URL}/api/Appointment/UpdateSpecificStage`, registerData);
      if (res.data[0] === 'Y') {
        Alert.alert("Info", "Stage updated Successfully");
      } else {
        Alert.alert("Error !", "Somenthing went wrong");
      }
      setLoading(false);
      onClose();
      setRefreshDetails(Math.random());
    }
    catch (err) {
      console.log(err);
      setLoading(false)
      Alert.alert("Error !", "Somenthing went wrong");
    }
  }

  return (
    <ScrollView contentContainerClassName="min-h-[30rem]" showsVerticalScrollIndicator={false}>      
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-3xl">
          <View className="w-10 h-1 rounded-full bg-gray-200 self-center mt-3 mb-1" />

          <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
            <View style={{ backgroundColor: ac + "18", borderColor: ac + "40" }} className="w-12 h-12 rounded-2xl items-center justify-center border-2 mr-3">
              <Text style={{ color: ac }} className="text-base font-bold tracking-wider">
                {initials}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-gray-900 text-[15px] font-bold">{row.Name}</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Phone size={11} color="#9ca3af" strokeWidth={2} />
                <Text className="text-gray-400 text-xs font-medium">{row.RegMob1} {row.RegMob2 && ` / ${row.RegMob2}`}</Text>
              </View>
            </View>

            {/* <View style={{ backgroundColor: ac + "18", borderColor: ac + "40" }} className="px-2.5 py-1 rounded-full border mr-2">
              <Text style={{ color: ac }} className="text-[10px] font-extrabold tracking-widest uppercase">
                Registration
              </Text>
            </View> */}

            <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="w-8 h-8 rounded-xl bg-gray-100 items-center justify-center">
              <X size={15} color="#6b7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="px-4 pt-6 pb-5 bg-slate-100">
        <View>
          <View className="flex-row items-center gap-1.5 mb-2">
            <Layers size={13} color={ac} strokeWidth={2} />
            <Text className="text-gray-500 text-[10px] font-extrabold tracking-widest uppercase">Purpose</Text>
            <View className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1" />
          </View>

          <TouchableOpacity onPress={() => {}} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-4 py-3.5">
            <View className="flex-row items-center gap-2.5">
              <View style={{ backgroundColor: ac }} className="w-2.5 h-2.5 rounded-full" />
              <Text className="text-gray-800 text-sm font-semibold">{row.OpportunityDesc || 'General Follow-up'}</Text>
            </View>
            <ChevronDown size={17} color="#9ca3af" strokeWidth={2.5} />
          </TouchableOpacity>
          <View className="flex-row gap-3 my-4">
            <View className="flex-1">
              <FieldLabel label="Date" required />
              <TouchableOpacity onPress={() => setDateOpen(!dateOepn)} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
                <Text className={`text-sm font-semibold ${registerData.NextAppDateStr ? "text-gray-800" : "text-gray-400"}`}>{registerData.NextAppDateStr}</Text>
                <Calendar size={16} color={ac} strokeWidth={2} />
              </TouchableOpacity>
              {/* {rowObjArr[index].err.date && <Text className='text-red-600 text-xs'>This field is required</Text>} */}
              {/* {dateOepn ? <DateTimePicker value={dayjs.utc(registerData.NextAppDateStr, "DD/MM/YYYY").toDate()} mode="date" display="default" onChange={(e, date) => handleDateSelect(e, date)} minimumDate={new Date()} /> : null} */}
            </View>

            <View className="flex-1">
              <FieldLabel label="Time" />
              <TouchableOpacity onPress={() => setTimeOpen(!timeOpen)} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
                <Text className={`text-sm font-semibold ${registerData.NextAppTime ? "text-gray-800" : "text-gray-400"}`}>{registerData.NextAppTime}</Text>
                <Clock size={16} color={ac} strokeWidth={2} />
              </TouchableOpacity>
              {/* {timeOpen ? <DateTimePicker value={dayjs(registerData.NextAppTime, 'hh:mm A').toDate()} mode="time" display="default" onChange={(e, time) => handleTimeSelect(e, time)} /> : null} */}
            </View>
          </View>

          <View className="">
            <FieldLabel label="Enter Remarks" required />
            <TextInput
              value={registerData.Remarks}
              onChangeText={(text) => setRegisterData((prev) => ({ ...prev, Remarks: text }))}
              placeholder="Enter remarks..."
              placeholderTextColor="#d1d5db"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                borderColor: registerData.Remarks ? ac + "80" : "#e5e7eb",
                height: 80,
                lineHeight: 22,
              }}
              className="bg-white border-2 rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
            />
            {/* {rowObjArr[index].err.remarks && <Text className='text-red-600 text-xs'>This field is required</Text>} */}
          </View>
        </View>

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="flex-1 py-4 rounded-2xl items-center justify-center bg-gray-200 shadow-sm">
            <Text className="text-gray-500 text-sm font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
            style={{
              backgroundColor: false ? ac + "50" : ac,
            }}
            className="flex-[2] py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
          >
            {loading ? <SvgLoader height={15} /> : <>
              <Sparkles size={14} color="#fff" strokeWidth={2.5} />
              <Text className="text-white text-sm font-bold tracking-wide">Save Changes</Text>
            </>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}