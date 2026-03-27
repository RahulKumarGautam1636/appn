import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, Platform } from "react-native";
import { X, ChevronDown, Phone, Layers, MessageSquare, Check, Sparkles, Calendar, Clock, IndianRupee, Send } from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { BASE_URL } from "@/src/constants";
import { getFrom } from "@/src/components/utils";


const STAGES = [
  { label: "Registration", color: "#6366f1" },
  { label: "Verification", color: "#8b5cf6" },
  { label: "Onboarding",   color: "#a78bfa" },
  { label: "Active",       color: "#10b981" },
  { label: "Follow-up",    color: "#f59e0b" },
  { label: "Closed",       color: "#ef4444" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (stage: string, remarks: string) => void;
  name?: string;
  phone?: string;
  appt: any
}

export function UpdateStage({
  visible,
  onClose,
  onSave,
  name = "Minakshi Singh",
  phone = "8563290982",
  appt,
}: Props) {
  const [selectedStage, setSelectedStage] = useState(STAGES[0]);
  const [remarks, setRemarks]           = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saved, setSaved]               = useState(false);

  const ac = selectedStage.color;

  const handleSave = () => {
    if (!remarks.trim()) return;
    setSaved(true);
    setTimeout(() => {
      onSave(selectedStage.label, remarks);
      onClose();
      setRemarks("");
      setSaved(false);
    }, 600);
  };

  const initials = appt.Name.split(" ").map((n) => n[0]).join("").toUpperCase();

  // NEW WORK --------------------------------------------------------------------------------------
  const user = useSelector((i: RootState) => i.user);
  const { selected: selectedCompany } = useSelector((i: RootState) => i.companies);
  const [stages, setStages] = useState({ loading: false, data: [], err: { status: false, msg: "" } })
  const [rowObjArr, setRowObjArr] = useState([]);

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
    DirectSalesDetailsList: [],// checkerFunc(patient),
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
      NextAppDateStr: new Date().toLocaleDateString('en-TT'),
      NextAppTime: new Date().toLocaleDateString('en-TT'),  // dayjs().format('hh:mm A'),
      NextFollowupDateStr: "",
      NextFollowupTime: new Date().toLocaleDateString('en-TT'), // dayjs().format('hh:mm A'),
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
        console.log(res.data);  
        let sorted = res.data.sort((a: any, b: any) => b.SeqId - a.SeqId);    
        setStages({ ...res, data: sorted });
      }
    };

    let controller = new AbortController();
    getStages(selectedCompany.EncCompanyId, user, appt, controller.signal)
    return () => controller.abort();
  }, [selectedCompany.EncCompanyId, user.OpportunityId, appt.DeptId]);

  console.log(stages); 

  const selectedStage2 = regData.EnqFollowUpList[0]?.EnqStatus;

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
      NextAppTime: '', // dayjs().format("hh:mm A"),
      NextFollowupDateStr: "",
      NextFollowupTime: '', // dayjs().format("hh:mm A"),
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

  console.log(regData);  

  return (
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
              <Text className="text-gray-800 text-sm font-semibold">{selectedStage2 || 'Please select'}</Text>
            </View>
            <ChevronDown size={17} color="#9ca3af" strokeWidth={2.5} style={{ transform: [{ rotate: dropdownOpen ? "180deg" : "0deg" }] }} />
          </TouchableOpacity>

          {dropdownOpen && (
            <View className="border border-gray-100 rounded-2xl mt-1.5 bg-white overflow-hidden shadow-sm shadow-gray-200">
              {stages.data.map((stage: any, idx: number) => (
                <TouchableOpacity
                  key={stage.label}
                  onPress={() => {
                    if (regData.EnqFollowUpList.length > 1) {
                      setRegData((prev) => ({ ...prev, EnqFollowUpList: [prev.EnqFollowUpList[0]] }));
                      // setRowObjArr([]);
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
                    backgroundColor: selectedStage2 === stage.label ? stage.color + "12" : "transparent",
                    borderBottomWidth: idx < STAGES.length - 1 ? 1 : 0,
                    borderBottomColor: "#f3f4f6",
                  }}
                  className="flex-row items-center justify-between px-4 py-3.5"
                >
                  <View className="flex-row items-center gap-3">
                    <View style={{ backgroundColor: stage.color }} className="w-2.5 h-2.5 rounded-full" />
                    <Text
                      style={{
                        color: selectedStage2 === stage.label ? stage.color : "#6b7280",
                      }}
                      className={`text-sm ${selectedStage2 === stage.label ? "font-semibold" : "font-normal"}`}
                    >
                      {stage.LinkDescription}
                    </Text>
                  </View>
                  {selectedStage2 === stage.label && <Check size={14} color={stage.color} strokeWidth={2.5} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="flex-row items-center gap-1.5 mt-5 mb-2">
            <MessageSquare size={13} color={ac} strokeWidth={2} />
            <Text className="text-gray-500 text-[10px] font-extrabold tracking-widest uppercase">Today's Remarks</Text>
            <View className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1" />
          </View>

          <TextInput
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Write your notes here..."
            placeholderTextColor="#d1d5db"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              borderColor: remarks ? ac + "80" : "#e5e7eb",
              minHeight: 100,
              lineHeight: 22,
            }}
            className="bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
          />

          {remarks.length > 0 && <Text className="text-gray-300 text-xs text-right mt-1.5 font-medium">{remarks.length} chars</Text>}

          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="flex-1 py-4 rounded-2xl items-center justify-center bg-gray-100">
              <Text className="text-gray-500 text-sm font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!remarks.trim() || saved}
              activeOpacity={0.8}
              style={{
                backgroundColor: !remarks.trim() ? ac + "50" : ac,
                shadowColor: ac,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: remarks.trim() ? 0.35 : 0,
                shadowRadius: 10,
                elevation: remarks.trim() ? 6 : 0,
              }}
              className="flex-[2] py-4 rounded-2xl items-center justify-center flex-row gap-2"
            >
              {saved ? (
                <Check size={18} color="#fff" strokeWidth={3} />
              ) : (
                <>
                  <Sparkles size={14} color="#fff" strokeWidth={2.5} />
                  <Text className="text-white text-sm font-bold tracking-wide">Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Types ──────────────────────────────────────────────
interface Particular {
  id: string;
  label: string;
  amount: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

// ── Static data ────────────────────────────────────────
const INITIAL_PARTICULARS: Particular[] = [
  { id: "1", label: "HIV I & II",  amount: "400" },
  { id: "2", label: "USG chest",   amount: "500" },
  { id: "3", label: "USG WALL",    amount: "600" },
];

const DEPT_OPTIONS: DropdownOption[] = [
  { label: "INVESTIGATION", value: "investigation" },
  { label: "CONSULTATION",  value: "consultation"  },
  { label: "RADIOLOGY",     value: "radiology"     },
  { label: "PATHOLOGY",     value: "pathology"     },
];

const STAGE_OPTIONS: DropdownOption[] = [
  { label: "Lab Test Booking", value: "lab_test"    },
  { label: "Registration",     value: "registration"},
  { label: "Verification",     value: "verification"},
  { label: "Active",           value: "active"      },
  { label: "Follow-up",        value: "followup"    },
  { label: "Closed",           value: "closed"      },
];

const REFER_OPTIONS: DropdownOption[] = [
  { label: "Select User",  value: ""         },
  { label: "Dr. Sharma",   value: "sharma"   },
  { label: "Dr. Mehta",    value: "mehta"    },
  { label: "Dr. Verma",    value: "verma"    },
];

// ── Reusable Dropdown ──────────────────────────────────
function Dropdown({
  options,
  selected,
  onSelect,
  placeholder = "Select",
  accentColor = "#6366f1",
}: {
  options: DropdownOption[];
  selected: DropdownOption | null;
  onSelect: (opt: DropdownOption) => void;
  placeholder?: string;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = selected?.label ?? placeholder;

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.75}
        style={{ borderColor: open ? accentColor : "#e5e7eb" }}
        className="flex-row items-center justify-between bg-gray-50 border-2 rounded-2xl px-3.5 py-3"
      >
        <Text
          style={{ color: selected ? "#1f2937" : "#9ca3af" }}
          className="text-sm font-semibold flex-1 mr-1"
          numberOfLines={1}
        >
          {label}
        </Text>
        <ChevronDown
          size={15}
          color={open ? accentColor : "#9ca3af"}
          strokeWidth={2.5}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {open && (
        <View
          className="absolute left-0 right-0 bg-white border border-gray-100 rounded-2xl overflow-hidden z-50"
          style={{ top: "105%", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 }}
        >
          {options.map((opt, idx) => {
            const isSelected = selected?.value === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => { onSelect(opt); setOpen(false); }}
                activeOpacity={0.7}
                style={{
                  backgroundColor: isSelected ? accentColor + "12" : "transparent",
                  borderBottomWidth: idx < options.length - 1 ? 1 : 0,
                  borderBottomColor: "#f3f4f6",
                }}
                className="flex-row items-center justify-between px-4 py-3"
              >
                <Text
                  style={{ color: isSelected ? accentColor : "#6b7280" }}
                  className={`text-sm ${isSelected ? "font-semibold" : "font-normal"}`}
                >
                  {opt.label}
                </Text>
                {isSelected && <Check size={13} color={accentColor} strokeWidth={2.5} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── Section Divider ────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 my-7">
      <View className="flex-1 h-px bg-indigo-200" />
      <Text className="text-indigo-500 text-sm font-extrabold tracking-widest uppercase px-1">
        {label}
      </Text>
      <View className="flex-1 h-px bg-indigo-200" />
    </View>
  );
}

// ── Field label ────────────────────────────────────────
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <View className="flex-row items-center mb-1.5">
      <Text className="text-gray-500 text-xs font-bold tracking-wide">{label}</Text>
      {required && <Text className="text-red-400 ml-0.5 text-xs font-bold">*</Text>}
    </View>
  );
}

// ── Main Component ─────────────────────────────────────
interface Props {
  onSubmit?: (data: object) => void;
}

export default function ParticularsForm({ appt, onSubmit, onClose }: any) {
  const [particulars, setParticulars]     = useState<Particular[]>(INITIAL_PARTICULARS);
  const [remarks, setRemarks]             = useState("");
  const [date, setDate]                   = useState("");
  const [time, setTime]                   = useState("12:25 PM");
  const [dept, setDept]                   = useState<DropdownOption>(DEPT_OPTIONS[0]);
  const [stage, setStage]                 = useState<DropdownOption>(STAGE_OPTIONS[0]);
  const [referTo, setReferTo]             = useState<DropdownOption | null>(null);

  const updateAmount = (id: string, value: string) => {
    setParticulars((prev) =>
      prev.map((p) => (p.id === id ? { ...p, amount: value } : p))
    );
  };

  const total = particulars.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const handleSubmit = () => {
    onSubmit?.({ particulars, remarks, date, time, dept, stage, referTo });
  };

  const ac = "#6366f1"; // primary accent

  return (
    <ScrollView className="flex-1 bg-slate-100" contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 48 : 32 }} keyboardShouldPersistTaps="handled">
      <UpdateStage onClose={onClose} appt={appt} />

      <View className="px-4 pt-5">
        <View className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-1 shadow-sm"
          // style={{
          //   shadowColor: "#6366f1",
          //   shadowOpacity: 1,
          //   shadowRadius: 16,
          //   elevation: 2,
          // }}
        >
          <View className="px-5 pt-4 pb-3 border-b border-indigo-200/75">
            <Text className="text-gray-900 text-base font-extrabold tracking-tight">Particulars</Text>
          </View>

          {particulars.map((item, idx) => (
            <View
              key={item.id}
              style={{
                borderBottomWidth: idx < particulars.length - 1 ? 1 : 0,
                borderBottomColor: "#f3f4f6",
              }}
              className="flex-row items-center px-5 py-3.5"
            >
              <Text className="flex-1 text-gray-700 text-sm font-semibold">{item.label}</Text>

              <View style={{ borderColor: "#e5e7eb" }} className="flex-row items-center border-2 rounded-xl overflow-hidden bg-indigo-50/60">
                <View className="px-2.5 py-2 bg-indigo-50 border-r border-indigo-100">
                  <IndianRupee size={13} color={ac} strokeWidth={2.5} />
                </View>
                <TextInput value={item.amount} onChangeText={(v) => updateAmount(item.id, v.replace(/[^0-9.]/g, ""))} keyboardType="numeric" style={{ width: 72, textAlign: "right" }} className="px-3 py-2 text-gray-800 text-sm font-bold" />
              </View>
            </View>
          ))}

          <View className="flex-row items-center justify-between px-5 py-3.5 border-t border-indigo-200/75">
            <Text className="text-indigo-600 text-xs font-extrabold tracking-widest uppercase">Total</Text>
            <View className="flex-row items-center gap-1">
              <IndianRupee size={13} color={ac} strokeWidth={2.5} />
              <Text style={{ color: ac }} className="text-base font-extrabold">
                {total.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5">
          <FieldLabel label="Todays Remarks" required />
          <TextInput
            value={remarks}
            onChangeText={setRemarks}
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
        </View>

        <SectionDivider label="Next Followup Details" />

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <FieldLabel label="Date" required />
            <TouchableOpacity activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
              <Text className={`text-sm font-semibold ${date ? "text-gray-800" : "text-gray-300"}`}>{date || "Date"}</Text>
              <Calendar size={16} color={ac} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            <FieldLabel label="Time" />
            <TouchableOpacity activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
              <Text className="text-gray-800 text-sm font-semibold">{time}</Text>
              <Clock size={16} color={ac} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <FieldLabel label="Dept." required />
            <Dropdown options={DEPT_OPTIONS} selected={dept} onSelect={setDept} accentColor={ac} />
          </View>
          <View className="flex-1">
            <FieldLabel label="Stage" required />
            <Dropdown options={STAGE_OPTIONS} selected={stage} onSelect={setStage} accentColor={ac} />
          </View>
        </View>

        <View className="mb-6">
          <FieldLabel label="Refer To" />
          <Dropdown options={REFER_OPTIONS} selected={referTo} onSelect={(opt) => setReferTo(opt.value ? opt : null)} placeholder="Select User" accentColor={ac} />
        </View>

        <TouchableOpacity
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
          className="py-4 rounded-2xl items-center justify-center flex-row gap-2"
        >
          <Send size={15} color="#fff" strokeWidth={2.5} />
          <Text className="text-white text-sm font-bold tracking-wide">Submit Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}