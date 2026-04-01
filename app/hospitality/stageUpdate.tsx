import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, Platform, Alert, FlatList } from "react-native";
import { X, ChevronDown, Phone, Layers, MessageSquare, Check, Sparkles, Calendar, Clock, IndianRupee, Send } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { BASE_URL } from "@/src/constants";
import { CustomDropdown, getFrom, NoContent, useFetch, wait } from "@/src/components/utils";
import dayjs from "@/src/components/utils/dayjs";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { setModal } from "@/src/store/slices/slices";

function SectionDivider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 mb-5 mt-1">
      <View className="flex-1 h-px bg-indigo-200" />
      <Text className="text-indigo-500 text-sm font-extrabold tracking-widest uppercase px-1">
        {label}
      </Text>
      <View className="flex-1 h-px bg-indigo-200" />
    </View>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <View className="flex-row items-center mb-1.5">
      <Text className="text-gray-500 text-xs font-bold tracking-wide">{label}</Text>
      {required && <Text className="text-red-400 ml-0.5 text-xs font-bold">*</Text>}
    </View>
  );
}

export default function ParticularsForm({ appt, onClose, setRefresh }: any) {

  const ac = "#6366f1"; // primary accent

  // MERGE START --------------------------------------------------------------------------------------

  const [remarks, setRemarks]           = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const initials = appt.Name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  // NEW WORK --------------------------------------------------------------------------------------
  const user = useSelector((i: RootState) => i.user);
  const { selected: selectedCompany } = useSelector((i: RootState) => i.companies);
  const [stages, setStages] = useState({ loading: false, data: [], err: { status: false, msg: "" } })
  const [rowObjArr, setRowObjArr] = useState([]);
  const [remarksError, setRemarksError] = useState(false);
  const dispatch = useDispatch();

  const checkSalesItems: (patient: any) => any[] = (patient) => {
    if (patient.TranRefType === "ENQ") {
      return Array.isArray(patient.EnqList) ? patient.EnqList.map((el: any) => ({ ItemId: el.ItemId, Description: el.ItemDesc, SRate: el.Amount, DeptId: patient.DeptId, BillQty: 1, Delstatus: "N" })) : []
    }
    else if (patient.TranRefType === "ORDER") {
      return Array.isArray(patient.OrderList) ? patient.OrderList.map((el: any) => ({ ItemId: el.ItemId, Description: el.ItemDesc, SRate: el.Amount, DeptId: patient.DeptId, BillQty: 1, Delstatus: "N" })) : []
    }
    return []
  }

  const [regData, setRegData] = useState({
    EncCompanyId: selectedCompany.EncCompanyId,
    PBankId: appt.PBankId,
    UnderDoctId: appt.DoctId,
    ReferrerId: 0,
    ProviderId: 0,
    MarketedId: appt.MarketById,
    DeptId: appt.DeptId,
    UserId: user?.UserId,
    OpportunityId: appt.OpportunityId,
    EnqStatusValue: "",
    EnqStatusId: 0,
    Remarks: appt.Remarks,
    NextAppDate: appt.NextAppDate,
    BillId: appt.EnqId,
    PartyCode: appt.PartyCode,
    AppointmentTo: appt.AppointmentTo,
    AppointmentToId: appt.AppointmentToId,
    ParentId: appt.LastAutoId,
    RootId: appt.RootId === 0 ? appt.LastAutoId : appt.RootId,
    // DirectSalesDetailsList: Array.isArray(appt.EnqList)?appt.EnqList.map((el:any)=>({ItemId:el.ItemId,Description:el.ItemDesc,SRate:el.Amount,DeptId:appt.DeptId,BillQty:1,Delstatus:"N"})): []
    DirectSalesDetailsList: checkSalesItems(appt),
    NextAppDateStr: "",
    PBankDesc: appt.PBankDesc,
    NextOpportunityId: 0,
    PrevOpportunityId: appt.OpportunityId,
    PrevRefType: appt.TranRefType,
    LinkURL: "",
    EnqFollowUpList: [{
      RefToId: appt.DoctId,
      RefById: 0,
      ProviderId: 0,
      MarketById: appt.MarketById,
      DeptId: appt.DeptId,
      CallerId: user?.UserId,
      OpportunityId: appt.OpportunityId, //pending
      AppointmentToId: appt.AppointmentToId,
      AppointmentTo: appt.AppointmentTo,
      EnqStatusValue: "",
      EnqStatus: 0,
      Remarks2: "",
      NextAppDateStr: dayjs().format("DD/MM/YYYY"),
      NextAppTime: dayjs().format('hh:mm A'),
      NextFollowupDateStr: "",
      NextFollowupTime: dayjs().format('hh:mm A'),
      RefId: appt.EnqId,
      PartyCode: appt.PartyCode,
      InsBy: user?.UserId,
      ParentId: appt.LastAutoId,
      RootId: appt.RootId === 0 ? appt.LastAutoId : appt.RootId,
      LinkURL: ""
    }]
  }) 

  useEffect(() => {
    const getStages = async (companyId, user, apptUser, signal) => {
      if (!companyId) return;
      console.log(`${BASE_URL}/api/VALUES/GetNextStageByStageId?CompId=${companyId}&RoleId=${user.UserRoleLevelCode}&StageId=${apptUser.OpportunityId}&DeptId=0&VerticleTypeId=0&LocationId=0&ProcedureId=${apptUser.DeptId ? apptUser.DeptId : 0}&BusinessType=`);    
      const res = await getFrom(`${BASE_URL}/api/VALUES/GetNextStageByStageId?CompId=${companyId}&RoleId=${user.UserRoleLevelCode}&StageId=${apptUser.OpportunityId}&DeptId=0&VerticleTypeId=0&LocationId=0&ProcedureId=${apptUser.DeptId ? apptUser.DeptId : 0}&BusinessType=`, {}, setStages, signal);
      if (res) {
        let sorted = res.data.sort((a: any, b: any) => b.SeqId - a.SeqId);    
        setStages({ ...res, data: sorted });
      }
    };

    let controller = new AbortController();
    getStages(selectedCompany.EncCompanyId, user, appt, controller.signal)
    return () => controller.abort();
  }, [selectedCompany.EncCompanyId, user.OpportunityId, appt.DeptId]);

  const selectedStage2 = stages.data.find((i: any) => i.AutoId === regData.EnqFollowUpList[0]?.EnqStatus) || {};

  const handleChangeForArrayStage = (index: number, item: any) => {
    if (index === 0) {
      setRegData((prev) => ({
        ...prev,
        LinkURL: item.LinkURL,
        OpportunityId: item.AutoId,
        EnqStatusValue: item.CodeValue,
        EnqStatusId: item.AutoId,
      }));
    }
    setRegData((prev) => {
      const arr = [...prev.EnqFollowUpList];
      arr[index].EnqStatus = item.AutoId;
      arr[index].EnqStatusValue = item.CodeValue;
      arr[index].OpportunityId = item.AutoId;
      arr[index].LinkURL = item.LinkURL;
      return { ...prev, EnqFollowUpList: arr };
    });
  };

  const createFieldFirst = () => {
    const obj = {
      RefToId: appt.DoctId,
      RefById: 0,
      ProviderId: 0,
      MarketById: appt.MarketById,
      DeptId: appt.DeptId,
      CallerId: user?.UserId,
      OpportunityId: 0, //appt.OpportunityId,
      AppointmentToId: appt.AppointmentToId,
      AppointmentTo: appt.AppointmentTo,
      EnqStatusValue: "",
      EnqStatus: 0,
      Remarks2: "",
      NextAppDateStr: "",
      NextAppTime: dayjs().format("hh:mm A"),
      NextFollowupDateStr: "",
      NextFollowupTime: dayjs().format("hh:mm A"),
      RefId: appt.EnqId,
      PartyCode: appt.PartyCode,
      InsBy: user?.UserId,
      ParentId: appt.LastAutoId,
      RootId: appt.RootId === 0 ? appt.LastAutoId : appt.RootId,
      LinkURL: "",
    };
    setRegData((prev) => {
      const arr = [...prev.EnqFollowUpList];
      arr.push(obj);
      return {
        ...prev,
        EnqFollowUpList: arr,
      };
    });
    setRowObjArr((prev) => [...prev, { showDateTime: { showDate: false, showTime: false }, err: { date: false, dept: false, stage: false, remarks: false }, stageArr: [], refToIdArr: [], isStageArrLoaded: false, isRefToIdArrLoaded: false }]);
  };
  
  const handleDateSelect = (event: any, index: number, selected?: Date | undefined) => {

    if (event.type === "set") {
      const dob = dayjs(selected);
      setRegData((prev) => {
        const arr = [...prev.EnqFollowUpList];
        if (index === 1) {
          arr[0].NextFollowupDateStr = dob.format("DD/MM/YYYY");
        }
        arr[index].NextAppDateStr = dob.format("DD/MM/YYYY");
        return { ...prev, EnqFollowUpList: arr };
      });
    }
    setShowDateTimeArr(index - 1, false, "showDate");
  };

  const setShowDateTimeArr = (index: number, bool: boolean, key: any) => {
    setRowObjArr((prev) => {
      const arr = [...prev];
      arr[index]["showDateTime"][key] = bool
      return arr;
    })
  }
  
  const handleTimeSelect = (event: any, index: number, selected?: Date | undefined) => {
    if (event.type === "set" && selected) {
      const timeString = dayjs(selected).format('hh:mm A');

      setRegData((prev) => {
        const arr = [...prev.EnqFollowUpList];
        if (index === 1) {
          arr[0].NextFollowupTime = timeString;
        }
        arr[index].NextAppTime = timeString;
        return ({ ...prev, EnqFollowUpList: arr });
      });
    }
    setShowDateTimeArr(index - 1, false, "showTime")
  };

  const handleChangeForArrayElement = (index: number, key: any, value: any) => {
    setRegData((prev) => {
      const arr = [...prev.EnqFollowUpList];
      arr[index][key] = value;
      return { ...prev, EnqFollowUpList: arr };
    });
  };

  const deptsArr = useFetch(`${BASE_URL}/api/Values/GetAllDepartment?CID=${selectedCompany.CompanyId}`, selectedCompany.CompanyId)[0];

  const getFollowUpStage = async (currDeptId: number, index: number) => {
    try {
      console.log(`${BASE_URL}/api/VALUES/GetStage?CompId=${selectedCompany.EncCompanyId}&RoleId=${user.UserRoleLevelCode}&LevelId=1&DeptId=0&VerticleTypeId=0&LocationId=0&ProcedureId=${currDeptId}&BusinessType=`);    
      const res = await axios.get(`${BASE_URL}/api/VALUES/GetStage?CompId=${selectedCompany.EncCompanyId}&RoleId=${user.UserRoleLevelCode}&LevelId=1&DeptId=0&VerticleTypeId=0&LocationId=0&ProcedureId=${currDeptId}&BusinessType=`);
      if (res.status === 200) {
        if (Array.isArray(res.data) && res.data.length) {
          setRowObjArr((prev) => {
            const arr = [...prev];
            arr[index].stageArr = res.data;
            arr[index].isStageArrLoaded = true;
            return arr;
          });
  
          const stgArr = res.data.sort((a, b) => (b.AutoId - a.AutoId))
          handleChangeForArrayStage(index + 1, stgArr[stgArr.length - 1]);
        }
      } else {
        setRowObjArr((prev) => {
          const arr = [...prev];
          arr[index].stageArr = [];
          return arr;
        });
      }      
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByDept = async (currDeptId: number, index: number) => {
    try {
      console.log(`${BASE_URL}/api/UserReg/GetAllUserOfDept?CompId=${selectedCompany.EncCompanyId}&DeptId=${currDeptId}`);    
      const res = await axios.get(`${BASE_URL}/api/UserReg/GetAllUserOfDept?CompId=${selectedCompany.EncCompanyId}&DeptId=${currDeptId}`);
      if (res.status === 200) {
        if (Array.isArray(res.data) && res.data.length) {
          setRowObjArr((prev) => {
            const arr = [...prev];
            arr[index].refToIdArr = res.data.filter((el: any) => el.PartyCode !== 0);
            arr[index].isRefToIdArrLoaded = true;
            return arr;
          });
        }
      } else {
        setRowObjArr((prev) => {
          const arr = [...prev];
          arr[index].refToIdArr = [];
          return arr;
        });
      }      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (rowObjArr.length > 0 && !rowObjArr[rowObjArr.length - 1].isStageArrLoaded) {
      getFollowUpStage(appt.DeptId, rowObjArr.length - 1);
    }
    if (rowObjArr.length > 0 && !rowObjArr[rowObjArr.length - 1].isRefToIdArrLoaded) {
      getUserByDept(appt.DeptId, rowObjArr.length - 1);
    }
  }, [regData.EnqFollowUpList]);

  const validate = (): { flag: boolean, label: string } => {
    let flag = { flag: false, label: "" };

    setRowObjArr((prev) => {
      const arr = [...prev];
      for (const el of arr) {
        el.err.date = false
        el.err.dept = false
        el.err.stage = false
        el.err.remarks = false
      }
      return arr;
    })
    setRemarksError(false);
    if (!regData.EnqFollowUpList[0].Remarks2) {
      setRemarksError(true);
      if (!flag.flag && !regData.EnqFollowUpList[0].Remarks2) {
        flag = { flag: true, label: "Please fill required fields" };
      }
    }
    const tempError = [...rowObjArr];
    regData.EnqFollowUpList.slice(1).forEach((el, index) => {
      if (!el.NextFollowupDateStr) {
        el.NextFollowupDateStr = el.NextAppDateStr;
        el.NextFollowupTime = el.NextAppTime;

      }
      if (!flag.flag && el.RefToId === 0) {
        if (el.DeptId === patient.DeptId) {
          el.RefToId = patient.DoctId;
        }
        else {
          flag = { flag: true, label: "Please choose the refer to" };
        }
      }
      tempError[index].err.date = !Boolean(el.NextAppDateStr);
      tempError[index].err.dept = !Boolean(el.DeptId);
      tempError[index].err.stage = !Boolean(el.EnqStatus);
      tempError[index].err.remarks = !Boolean(el.Remarks2);
      if (!flag.flag && (!Boolean(el.NextAppDateStr) || !Boolean(el.DeptId) || !Boolean(el.EnqStatus) || !Boolean(el.Remarks2))) {
        flag = { flag: true, label: "Please fill required fields" };
      }
    });
    setRowObjArr(tempError);
    return flag
  }

  const hasSimilarRow = (): boolean => {
    const mySet = new Set();
    for (const i of regData.EnqFollowUpList.slice(1)) {
      const str = JSON.stringify({
        EnqStatus: i.EnqStatus,
        OpportunityId: i.OpportunityId,
        DeptId: i.DeptId,
        CallerId: i.CallerId,
      });
      if (mySet.has(str)) {
        return true;
      } else {
        mySet.add(str);
      }
    }
    return false;
  };

  const handleSave = async () => {
    const validateObj = validate();
    if (!regData.EnqFollowUpList[0].EnqStatus) {
      Alert.alert("Info !", "Please Change the Stage");
    } else if (validateObj.flag) {
      Alert.alert("info!", validateObj.label);
    } else if (hasSimilarRow()) {
      Alert.alert("info", "All followup must be unique");
    } else {
      console.log(`${BASE_URL}/api/Appointment/UpdateStage`, JSON.stringify(regData, null, 2));
      console.log(rowObjArr);  
      dispatch(setModal({ name: 'LOADING', state: true }));
      try {
        const res = { data: ["Y"] }  // await axios.post(`${BASE_URL}/api/Appointment/UpdateStage`, regData);
        await wait(3000);
        console.log(res.data);
        if (res.data[0] === "Y") {
          Alert.alert("Info", "Stage Change Successfully");
          // setPatient((prev) => ({ ...prev, isLoading: true }));
          // mutate();
          setRefresh(Math.random())
        } else {
          Alert.alert("Error !", "Somenthing went wrong");
        }
        dispatch(setModal({ name: 'LOADING', state: false }));
        // setVisible(false);
      } catch (err) {
        console.log(err);
        dispatch(setModal({ name: 'LOADING', state: false }));
        Alert.alert("Error !", "Somenthing went wrong");
      }
    }
  };

  return (
    <ScrollView contentContainerClassName="min-h-[30rem] bg-slate-100 pb-4" showsVerticalScrollIndicator={false}>      
      <View className="flex-1 bg-black/40 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View style={{ paddingBottom: 20 }} className="bg-white rounded-t-3xl">
          <View className="w-10 h-1 rounded-full bg-gray-200 self-center mt-3 mb-1" />

          <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
            <View style={{ backgroundColor: ac + "18", borderColor: ac + "40" }} className="w-12 h-12 rounded-2xl items-center justify-center border-2 mr-3">
              <Text style={{ color: ac }} className="text-base font-bold tracking-wider">
                {initials}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-gray-900 text-[15px] font-bold">{appt.Name}</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Phone size={11} color="#9ca3af" strokeWidth={2} />
                <Text className="text-gray-400 text-xs font-medium">{appt.RegMob1} {appt.RegMob2 && ` / ${appt.RegMob2}`}</Text>
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

          <View className="px-5 pt-5">
            <View className="flex-row items-center gap-1.5 mb-2">
              <Layers size={13} color={ac} strokeWidth={2} />
              <Text className="text-gray-500 text-[10px] font-extrabold tracking-widest uppercase">Update Stage</Text>
              <View className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1" />
            </View>

            <TouchableOpacity onPress={() => setDropdownOpen(!dropdownOpen)} activeOpacity={0.75} style={{ borderColor: dropdownOpen ? ac : "#e5e7eb" }} className="flex-row items-center justify-between bg-gray-50 border-2 rounded-2xl px-4 py-3.5">
              <View className="flex-row items-center gap-2.5">
                <View style={{ backgroundColor: ac }} className="w-2.5 h-2.5 rounded-full" />
                <Text className="text-gray-800 text-sm font-semibold">{selectedStage2.LinkDescription || 'Please select'}</Text>
              </View>
              <ChevronDown size={17} color="#9ca3af" strokeWidth={2.5} style={{ transform: [{ rotate: dropdownOpen ? "180deg" : "0deg" }] }} />
            </TouchableOpacity>

            {dropdownOpen && (
              <View className="border border-gray-100 rounded-2xl mt-1.5 bg-white overflow-hidden shadow-sm shadow-gray-200">
                {stages.data.map((stage: any, idx: number) => (
                  <TouchableOpacity
                    key={stage.AutoId}
                    onPress={() => {
                      if (regData.EnqFollowUpList.length > 1) {
                        setRegData((prev) => ({ ...prev, EnqFollowUpList: [prev.EnqFollowUpList[0]] }));
                        setRowObjArr([]);
                      }
                      if (stage.CodeValue === "Service Done") {
                        createFieldFirst();
                      } else if (stage.CodeValue === "ReSchedule") {
                        createFieldFirst();
                      }
                      handleChangeForArrayStage(0, stage);
                      setDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: selectedStage2.AutoId === stage.AutoId ? stage.color + "12" : "transparent",
                      borderBottomWidth: idx < stages.length - 1 ? 1 : 0,
                      borderBottomColor: "#f3f4f6",
                    }}
                    className="flex-row items-center justify-between px-4 py-3.5"
                  >
                    <View className="flex-row items-center gap-3">
                      <View style={{ backgroundColor: stage.color }} className="w-2.5 h-2.5 rounded-full" />
                      <Text
                        style={{
                          color: selectedStage2.AutoId === stage.AutoId ? stage.color : "#6b7280",
                        }}
                        className={`text-sm ${selectedStage2.AutoId === stage.AutoId ? "font-semibold" : "font-normal"}`}
                      >
                        {stage.LinkDescription}
                      </Text>
                    </View>
                    {selectedStage2.AutoId === stage.AutoId && <Check size={14} color={stage.color} strokeWidth={2.5} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {regData.DirectSalesDetailsList.length > 0 ? <View className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-2 mt-4 shadow-sm">
              <View className="px-5 pt-4 pb-3 border-b border-indigo-200/75">
                <Text className="text-gray-900 text-base font-extrabold tracking-tight">Particulars</Text>
              </View>

              {regData.DirectSalesDetailsList.map((item, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: index < regData.DirectSalesDetailsList.length - 1 ? 1 : 0,
                    borderBottomColor: "#f3f4f6",
                  }}
                  className="flex-row items-center px-5 py-3.5"
                >
                  <Text className="flex-1 text-gray-700 text-sm font-semibold">{item.Description}</Text>

                  <View style={{ borderColor: "#e5e7eb" }} className="flex-row items-center border-2 rounded-xl overflow-hidden bg-indigo-50/60">
                    <View className="px-2.5 py-2 bg-indigo-50 border-r border-indigo-100">
                      <IndianRupee size={13} color={ac} strokeWidth={2.5} />
                    </View>
                    <TextInput 
                      value={item.SRate} 
                      onChangeText={(text) => {
                        setRegData((prev) => {
                          const temp = [...prev.DirectSalesDetailsList];
                          temp[index].SRate = text;
                          return ({ ...prev, DirectSalesDetailsList: temp })
                        })
                      }}
                      editable={regData.EnqFollowUpList[0].EnqStatusValue === "Registration"}
                      keyboardType="numeric" 
                      className="px-3 py-2 text-gray-800 text-sm font-bold text-right w-[72px]" 
                    />
                  </View>
                </View>
              ))}

              <View className="flex-row items-center justify-between px-5 py-3.5 border-t border-indigo-200/75">
                <Text className="text-indigo-600 text-xs font-extrabold tracking-widest uppercase">Total</Text>
                <View className="flex-row items-center gap-1">
                  <IndianRupee size={13} color={ac} strokeWidth={2.5} />
                  <Text style={{ color: ac }} className="text-base font-extrabold">
                    589.00
                  </Text>
                </View>
              </View>
            </View> : null}

            <View className="flex-row items-center gap-1.5 mt-5 mb-2">
              <MessageSquare size={13} color={ac} strokeWidth={2} />
              <Text className="text-gray-500 text-[10px] font-extrabold tracking-widest uppercase">Today's Remarks</Text>
              <View className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1" />
            </View>

            <TextInput
              value={regData.EnqFollowUpList[0].Remarks2}
              onChangeText={(text) => handleChangeForArrayElement(0, "Remarks2", text)}
              placeholder="Write your notes here..."
              placeholderTextColor="#d1d5db"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                borderColor: regData.EnqFollowUpList[0].Remarks2 ? ac + "80" : "#e5e7eb",
                minHeight: 100,
                lineHeight: 22,
              }}
              className="bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
            />
            {regData.EnqFollowUpList[0].Remarks2.length > 0 && <Text className="text-gray-300 text-xs text-right mt-1.5 font-medium">{regData.EnqFollowUpList[0].Remarks2.length} chars</Text>}
            {remarksError && <Text className='text-red-600'>This field is required</Text>}
          </View>
        </View>
      </View>

      {/* Merger End ========================================================================================================== */}

      <View className="px-4 pt-5">
        {regData.EnqFollowUpList.slice(1).map((row: any, index) => (
          <View key={index} className={`${index === 0 ? '' : 'mt-4'}`}>
            <SectionDivider label="Next Followup Details" />
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FieldLabel label="Date" required />
                <TouchableOpacity onPress={() => setShowDateTimeArr(index, true, "showDate")} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
                  <Text className={`text-sm font-semibold ${row.NextAppDateStr ? "text-gray-800" : "text-gray-400"}`}>{row.NextAppDateStr ? row.NextAppDateStr : "Date"}</Text>
                  <Calendar size={16} color={ac} strokeWidth={2} />
                </TouchableOpacity>
                {rowObjArr[index].err.date && <Text className='text-red-600 text-xs'>This field is required</Text>}
                {rowObjArr[index].showDateTime.showDate ? <DateTimePicker value={row.NextAppDateStr ? dayjs.utc(row.NextAppDateStr, "DD/MM/YYYY").toDate() : new Date()} mode="date" display="default" onChange={(e, date) => handleDateSelect(e, index + 1, date)} minimumDate={new Date()} /> : null}
              </View>

              <View className="flex-1">
                <FieldLabel label="Time" />
                <TouchableOpacity onPress={() => setShowDateTimeArr(index, true, "showTime")} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
                  <Text className={`text-sm font-semibold ${row.NextAppTime ? "text-gray-800" : "text-gray-400"}`}>{row.NextAppTime ? row.NextAppTime : "Time"}</Text>
                  <Clock size={16} color={ac} strokeWidth={2} />
                </TouchableOpacity>
                {rowObjArr[index].showDateTime.showTime ? <DateTimePicker value={row.NextAppTime ? dayjs(row.NextAppTime, 'hh:mm A').toDate() : new Date()} mode="time" display="default" onChange={(e, time) => handleTimeSelect(e, index + 1, time)} /> : null}
              </View>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FieldLabel label="Dept." required />
                <CustomDropdown options={deptsArr} labelKey="Description" selectValue={row.DeptId} selectKey={'SubCode'} 
                  onSelect={async (opt) => {
                    handleChangeForArrayElement(index + 1, "DeptId", opt.SubCode);
                    handleChangeForArrayElement(index + 1, "EnqStatus", 0);
                    handleChangeForArrayElement(index + 1, "OpportunityId", 0);
                    getFollowUpStage(opt.SubCode, index);
                    handleChangeForArrayElement(index + 1, "RefToId", 0);
                    getUserByDept(opt.SubCode, index);
                  }} 
                placeholder="Select Department" accentColor={ac} />
                {rowObjArr[index].err.dept && <Text className='text-red-600 text-xs'>This field is required</Text>}
              </View>
              <View className="flex-1">
                <FieldLabel label="Stage" required />
                <CustomDropdown options={rowObjArr[index].stageArr} labelKey="LinkDescription" selectValue={row.OpportunityId} selectKey={'AutoId'} onSelect={(opt) => handleChangeForArrayStage(index + 1, opt)} placeholder="Select Stage" accentColor={ac} />
                {rowObjArr[index].err.stage && <Text className='text-red-600 text-xs'>This field is required</Text>}
              </View>
            </View>

            <View className="mb-4">
              <FieldLabel label="Refer To" />
              <CustomDropdown float={false} options={rowObjArr[index].refToIdArr} labelKey="UserFullName" selectValue={row.RefToId} selectKey={'PartyCode'} onSelect={(opt) => handleChangeForArrayElement(index + 1, "RefToId", opt.PartyCode)} placeholder="Refer To" accentColor={ac} />
            </View>

            <View className="">
              <FieldLabel label="Enter Remarks" required />
              <TextInput
                value={row.Remarks2}
                onChangeText={(text) => handleChangeForArrayElement(index + 1, "Remarks2", text)}
                placeholder="Enter remarks..."
                placeholderTextColor="#d1d5db"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  borderColor: remarks ? ac + "80" : "#e5e7eb",
                  height: 80,
                  lineHeight: 22,
                }}
                className="bg-white border-2 rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
              />
              {rowObjArr[index].err.remarks && <Text className='text-red-600 text-xs'>This field is required</Text>}
            </View>
          </View>
        ))}

        {regData.EnqFollowUpList.length > 1 && regData.EnqFollowUpList[0].EnqStatusValue !== "ReSchedule" ? 
        <TouchableOpacity onPress={createFieldFirst} activeOpacity={0.7} className="px-6 py-2.5 bg-rose-50 border-dashed border border-rose-500 ml-auto mt-2 !rounded-lg">
          <Text className="text-xs text-rose-500 font-bold">+  ADD MORE</Text>
        </TouchableOpacity> : null}

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="flex-1 py-4 rounded-2xl items-center justify-center bg-gray-200 shadow-sm">
            <Text className="text-gray-500 text-sm font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!selectedStage2.LinkDescription}
            activeOpacity={0.8}
            style={{
              backgroundColor: !selectedStage2.LinkDescription ? ac + "50" : ac,
              // shadowColor: ac,
              // shadowOffset: { width: 0, height: 4 },
              // shadowOpacity: selectedStage2.LinkDescription ? 0.35 : 0,
              // shadowRadius: 10,
              // elevation: selectedStage2.LinkDescription ? 6 : 0,
            }}
            className="flex-[2] py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
          >
            <Sparkles size={14} color="#fff" strokeWidth={2.5} />
            <Text className="text-white text-sm font-bold tracking-wide">Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          style={{
            backgroundColor: ac,
            shadowColor: ac,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          }}
          className="py-4 rounded-2xl items-center justify-center flex-row gap-2 mt-6"
        >
          <Send size={15} color="#fff" strokeWidth={2.5} />
          <Text className="text-white text-sm font-bold tracking-wide">Submit Details</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}