import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, Platform, Alert, FlatList } from "react-native";
import { X, ChevronDown, Phone, Layers, MessageSquare, Check, Sparkles, Calendar, Clock, IndianRupee, Send, ArrowLeft } from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { BASE_URL, gender, states } from "@/src/constants";
import { CustomDropdown, FieldLabel, getFrom, MyList, NoContent, useFetch, wait } from "@/src/components/utils";
import dayjs from "@/src/components/utils/dayjs";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { SvgLoader } from "@/src/components";
import { useRouter } from "expo-router";

function SectionDivider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 mb-4 mt-1">
      <View className="flex-1 h-px bg-indigo-200" />
      <Text className="text-indigo-500 text-sm font-extrabold tracking-widest uppercase px-1">
        {label}
      </Text>
      <View className="flex-1 h-px bg-indigo-200" />
    </View>
  );
}

const ac = "#6366f1"; // primary accent

export default function ParticularsForm({ appt, onClose, setRefresh }: any) {

  const dropdownOpen = false;
  const loading = false;
  const router = useRouter()

  const dropdownOptions = [
    { name: 'Option 1', value: 1 },
    { name: 'Option 2', value: 2 },
    { name: 'Option 3', value: 3 },
  ]

  // NEW WORK ====================================================================================================

  const user = useSelector((i: RootState) => i.user);
  const selectedCompany = useSelector((i: RootState) => i.companies.selected);
  const { current: selectedDepartment } = useSelector((i: RootState) => i.appData.department);
  const deptId = selectedDepartment.DeptId;
  const deptName = selectedDepartment.Department;
  const [cardType, isLoading, error] = useFetch(`${BASE_URL}/api/Values/GetMaster?CID=${selectedCompany.CompanyId}&Type=IDCardType`, selectedCompany.CompanyId);
  const [stageArr, setStageArr] = useState([]);
  const [statusArr, setStatusArr] = useState([]);
  const [bankArr, setBankArr] = useState([]);
  const [idcardArr, setIdCardArr] = useState([]);
  const [IDCardCodeObj, setIDCardCodeObj] = useState(null);
  const [numberList, setNumberlist] = useState([]);
  const [shownumberList, setShowNumberlist] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [age, setAge] = useState({ years: '', months: '', days: '' });
  const [partyList, setPartylist] = useState([]);
  const [showpartyList, setShowPartylist] = useState(false);

  const [registerData, setRegisterData] = useState({
    Name: "",
    UserRoleId: user?.UserRoleId,
    UserRoleLevelName: user?.UserRoleLevelName,
    UserRoleLevelCode: user?.UserRoleLevelCode,
    UserLevelSeq: user?.UserLevelSeq,
    ParentUserId: user?.UserId,
    EncCompanyId: selectedCompany.EncCompanyId,
    PartyCode: 0,
    PartyId: 0,
    UserId: 0,
    RegMob1: "",
    Email: "",
    Address: "",
    UserPassword: "",
    UserType: "PATIENT",
    Address2: "",
    City: "",
    State: 3,
    StateName: "West Bengal",
    Pin: "",
    DOB: "",
    DOBstr: "",
    Age: 0,
    AgeMonth: 0,
    AgeDay: 0,
    IsDOBCalculated: "N",
    GenderDesc: "Male",
    Gender: 104,
    Country: 1,
    MemberId: "",
    Aadhaar: "",
    Salutation: "",
    Qualification: "",
    SpecialistId: 0,
    AnniversaryDate: "",
    AnniversaryDatestr: "",
    compName: "",
    compAddress: "",
    compState: "3",
    compPin: "",
    compPhone1: "",
    compPhone2: "",
    compMail: "",
    BusinessType: "B2C",
    ContactPerson: "",
    RegMob2: "",
    GstIn: "",
    LicenceNo: "",
    DL_Number2: "",
    TradeLicense: "",
    UserRegTypeId: 43198,
    IDCardTypeId: "",
    IDCardTypeDesc: "",
    IDCardTypeNo: "",
    DeptId: deptId,
    OpportunityId: 0,
    IsCanceled: "N",
    ItemId: 0,
    Description: "",
    Amount: "",
    PBankId: "",
    UnderDoctId: 0,
    ReferrerId: 0,
    ProviderId: 0,
    MarketedId: 0,
    NextAppDateStr: dayjs().format("DD/MM/YYYY"),
    Remarks: "",
    EnqStatusId: 0,
    EnqStatusValue: "",
    RootId: 0,
    ParentId: 0,
    image: ""
  })

  const getCardTypes = async (companyId: number) => {
    try {
      console.log(`${BASE_URL}/api/Values/GetMaster?CID=${selectedCompany.CompanyId}&Type=IDCardType`);    
      const res = await axios.get(`${BASE_URL}/api/Values/GetMaster?CID=${selectedCompany.CompanyId}&Type=IDCardType`);
      if (res.status === 200) {
        const cardObj = res.data.find((el: any) => (el.CodeValue === "PANCard"));
        setIDCardCodeObj(cardObj);
        setIdCardArr(res.data);
        if (cardObj) {
            setRegisterData((prev) => ({ ...prev, IDCardTypeDesc: cardObj.Description, IDCardTypeId: cardObj.CodeId }))
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStages = async (currDeptId: number) => {
    try {
      console.log(`${BASE_URL}/api/VALUES/GetStage?CompId=${selectedCompany.EncCompanyId}&RoleId=${user.UserRoleLevelCode}&LevelId=1&DeptId=0&VerticleTypeId=0&LocationId=0&ProcedureId=${currDeptId}&BusinessType=`);    
      const res = await axios.get(`${BASE_URL}/api/VALUES/GetStage?CompId=${selectedCompany.EncCompanyId}&RoleId=${user.UserRoleLevelCode}&LevelId=1&DeptId=0&VerticleTypeId=0&LocationId=0&ProcedureId=${currDeptId}&BusinessType=`);
      if (res.status === 200) {
        if (Array.isArray(res.data) && res.data.length > 0) {
            const arr = res.data.sort((a, b) => a.SeqId - b.SeqId);
            setStageArr(arr);
            setRegisterData((prev) => ({ ...prev, OpportunityId: arr[0].AutoId }))
        }
      }      
    } catch (error) {
      console.log(error);
    }
  };

  const getStatus = async (companyID: number) => {
    try {
      console.log(`${BASE_URL}/api/Values/GetMaster?CID=${companyID}&Type=ENQSTATUS`);    
      const res = await axios.get(`${BASE_URL}/api/Values/GetMaster?CID=${companyID}&Type=ENQSTATUS`);
      if (res.status === 200) {
        if (Array.isArray(res.data) && res.data.length > 0) {
            const arr = res.data.sort((a, b) => a.CodeId - b.CodeId);
            setStatusArr(arr);
            setRegisterData((prev) => ({ ...prev, EnqStatusId: arr[0].CodeId, EnqStatusValue: arr[0].CodeValue }))
        }
      }   
    } catch (error) {
      console.log(error);
    }
  };

  const getBankArr = async (company: any, user: any) => {
    try {
      console.log(`${BASE_URL}/api/Values/GetBank?CID=${company.CompanyId}&LID=${company.LocationId}&Type=B&CashLedgerId=${user.CashLedgerId}&BankLedgerId=${user.BankLedgerId}`);    
      const res = await axios.get(`${BASE_URL}/api/Values/GetBank?CID=${company.CompanyId}&LID=${company.LocationId}&Type=B&CashLedgerId=${user.CashLedgerId}&BankLedgerId=${user.BankLedgerId}`);
      if (res.status === 200) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBankArr(res.data);
        }
      } 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCardTypes(selectedCompany);
    getStages(deptId);
    getStatus(selectedCompany.CompanyId);
    getBankArr(selectedCompany, user);
  }, [])

  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
      const controller = new AbortController();
      const getLabData = async (companyId: string, query: string, signal: AbortSignal) => {
          if (!companyId) return console.log('no DeptId received');
          if (!query.length) return;
          try {
            const res = await axios.get(`${BASE_URL}/api/Values/Get?CID=${companyId}&type=MOB&Specialist=0&prefixText=${query}`, { signal: signal });
            if (res.status === 200) {
              if (res.data?.length > 0) {
                setNumberlist(res.data);
                setShowNumberlist(true);
              } else {
                setShowNumberlist(false);
                setNumberlist([]);
              }
            }            
          } catch (err) {
            if (err.code === 'ERR_CANCELED') return;           // return early if request aborted to prevent loading: false.
            console.log(err)
            alert(err.message);
          }
      }
      getLabData(selectedCompany.EncCompanyId, registerData.RegMob1, controller.signal);
      return () => controller.abort();
  }, [selectedCompany.EncCompanyId, registerData.RegMob1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cleaned = searchItem.replace(/\D/g, "");
      const normalized = cleaned.startsWith("91") && cleaned.length > 10 ? cleaned.slice(-10) : cleaned;    // Remove country code if present (like +91 or 91)
      if (normalized.length >= 3) {
        setRegisterData((prev) => ({...prev, RegMob1: normalized}));
      } else {
        setShowNumberlist(false);
        setNumberlist([]);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchItem]);

  const handleSelectNumber = (data: any) => {
    if (data) {
        setRegisterData((prev) => ({
            ...prev,
            PartyId: data.PartyId,
            PartyCode: data.PartyCode,
            MemberId: data.MemberId,
            RegMob1: `${data.Mobile}`,
            RegMob2: `${data.RegMob2}`,
            IDCardTypeId: data.IDCardTypeId ? data.IDCardTypeId : prev.IDCardTypeId,
            IDCardTypeDesc: data.IDCardTypeDesc ? data.IDCardTypeDesc : prev.IDCardTypeDesc,
            IDCardTypeNo: data.IDCardTypeNo,
            Salutation: data.Salutation,
            Name: data.Name,
            GenderDesc: data.GenderDesc,
            Gender: data.Gender,
            DOB: (!data.DOB || data.DOB === "0001-01-01T00:00:00" || data.DOB === "1900-01-01T00:00:00") ? "" : dayjs(data.DOB).format("DD/MM/YYYY"),
            DOBstr: (!data.DOB || data.DOB === "0001-01-01T00:00:00" || data.DOB === "1900-01-01T00:00:00") ? "" : dayjs(data.DOB).format("DD/MM/YYYY"),
            // Age: data.Age,
            // AgeMonth: data.AgeMonth,
            // AgeDay: data.AgeDay,
            Address: data.Address,
            City: data.City,
            State: data.State,
            StateName: data.StateDesc,
            Pin: data.Pin,
        }))
        if (data.DOB && data.DOB !== "0001-01-01T00:00:00" && data.DOB !== "1900-01-01T00:00:00") {
            setTheDate(dayjs(data.DOB).toDate());
        }
        setSearchItem(data.RegMob1)
        const obj = idcardArr.find((el) => el.CodeId === data.IDCardTypeId);
        if (obj) {
            setIDCardCodeObj(obj);
        }
        if (shownumberList) {
            setShowNumberlist(false);
        }
        if (showpartyList) {
            setShowPartylist(false);
        }
    }
  }

  const setTheDate = (selected?: Date | undefined) => {
    const dob = dayjs(selected);
    setSelectedDate(dob);
    setDate(dob);
    setShowDatePicker(false);

    // Calculate age
    const now = dayjs();
    const years = now.diff(dob, "year");
    const months = now.diff(dob.add(years, "year"), "month");
    const days = now.diff(dob.add(years, "year").add(months, "month"), "day");

    setRegisterData((prev) => ({ ...prev, DOB: dob.format("DD/MM/YYYY"), DOBstr: dob.format("DD/MM/YYYY"), Age: years, AgeMonth: months, AgeDay: days, IsDOBCalculated: "N" }));

    setAge({ years: years.toString(), months: months.toString(), days: days.toString() });

  };

  console.log(shownumberList); 

  return (
    <ScrollView contentContainerClassName="min-h-[30rem] bg-slate-100 pb-4" showsVerticalScrollIndicator={false}>   
      <View className="flex-row items-center justify-between bg-sky-900 p-4">
        <View className="flex-row items-center gap-3">
          <Pressable className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center" onPress={() => router.back()}>
            <ArrowLeft size={18} color="white" />
          </Pressable>
          <View>
            <Text className="text-white/60 text-[11px] tracking-widest">Registration</Text>
            <Text className="text-white text-lg font-bold">{deptName}</Text>
          </View>
        </View>
      </View>   
      <View className="px-4 pt-5">
        <View className=''>
          <SectionDivider label="Personal Information" />

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Mobile Number" required />
              <TextInput
                value={searchItem}
                onChangeText={(text) => setSearchItem(text)}
                // onFocus={() => setShowNumberlist(!shownumberList)}
                placeholder="Type 4 digits to search.."
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm text-gray-600"
              />
              {shownumberList ? <MyList float={false} options={numberList} labelKey="Name" selectValue={''} selectKey={'RegMob1'} onSelect={(opt) => handleSelectNumber(opt)} placeholder="Mobile" accentColor={ac} /> : null}
            </View>
            <View className="flex-1">
              <FieldLabel label="Alternative Mobile" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Alternative Mobile No."
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Card Type" />
              <CustomDropdown float={false} options={idcardArr} labelKey="Description" selectValue={registerData.IDCardTypeId} selectKey={'CodeId'} onSelect={(opt) => {
                setRegisterData((prev) => ({ ...prev, IDCardTypeId: opt.CodeId, IDCardTypeDesc: opt.Description, IDCardTypeNo: "" }));
                setIDCardCodeObj(opt);
              }} placeholder="Card Type" accentColor={ac} />
            </View>
            <View className="flex-1">
              <FieldLabel label="Card Number" />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Enter Card Number."
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-2 z-50">
            <View className="flex-1">
              <FieldLabel label="Party Name" />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Party Name"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
            <View className="flex-1">
              <FieldLabel label="Gender" />
              <CustomDropdown options={gender} labelKey="Description" selectValue={registerData.Gender} selectKey={'CodeId'} onSelect={(opt) => setRegisterData(pre => ({...pre, Gender: opt.CodeId, GenderDesc: opt.Description}))} placeholder="Gender" accentColor={ac} />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <FieldLabel label="Date" required />
              <TouchableOpacity onPress={() => {}} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
                <Text className={`text-sm font-semibold ${false ? "text-gray-800" : "text-gray-400"}`}>Date</Text>
                <Calendar size={16} color={ac} strokeWidth={2} />
              </TouchableOpacity>
              {/* {rowObjArr[index].err.date && <Text className='text-red-600 text-xs'>This field is required</Text>} */}
              {/* {rowObjArr[index].showDateTime.showDate ? <DateTimePicker value={row.NextAppDateStr ? dayjs.utc(row.NextAppDateStr, "DD/MM/YYYY").toDate() : new Date()} mode="date" display="default" onChange={(e, date) => handleDateSelect(e, index + 1, date)} minimumDate={new Date()} /> : null} */}
            </View>

            
            <View className="flex-1 flex-row">
              <View className="flex-1">
                <FieldLabel label="Years" />
                <TextInput
                  value={''}
                  onChangeText={(text) => {}}
                  placeholder=""
                  placeholderTextColor="#d1d5db"
                  style={{
                    borderColor: false ? ac + "80" : "#e5e7eb",
                  }}
                  className="flex-row items-center justify-between bg-white border-2 rounded-tl-2xl rounded-bl-2xl px-3.5 py-3 text-sm"
                />
              </View>
              <View className="flex-1">
                <FieldLabel label="Months" />
                <TextInput
                  value={''}
                  onChangeText={(text) => {}}
                  placeholder=""
                  placeholderTextColor="#d1d5db"
                  style={{
                    borderColor: false ? ac + "80" : "#e5e7eb",
                  }}
                  className="flex-row items-center justify-between bg-white border-y-2 px-3.5 py-3 text-sm"
                />
              </View>
              <View className="flex-1">
                <FieldLabel label="Days" />
                <TextInput
                  value={''}
                  onChangeText={(text) => {}}
                  placeholder=""
                  placeholderTextColor="#d1d5db"
                  style={{
                    borderColor: false ? ac + "80" : "#e5e7eb",
                  }}
                  className="flex-row items-center justify-between bg-white border-2 rounded-tr-2xl rounded-br-2xl px-3.5 py-3 text-sm"
                />
              </View>
            </View>
          </View>

          <SectionDivider label="Address Details" />

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Address" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Address"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm text-gray-600"
              />
            </View>
            <View className="flex-1">
              <FieldLabel label="City" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="City"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <FieldLabel label="State" />
              <CustomDropdown float={false} options={states} labelKey="Description" selectValue={registerData.State} selectKey={'CodeId'} onSelect={(opt) => setRegisterData(pre => ({...pre, State: opt.CodeId, StateName: opt.Description}))} placeholder="State" accentColor={ac} />
            </View>
            <View className="flex-1">
              <FieldLabel label="Pincode" />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Enter Pincode"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <SectionDivider label="Payment Details" />

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Particular" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Particular"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm text-gray-600"
              />
            </View>
            <View className="flex-1">
              <FieldLabel label="Amount" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Amount"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <FieldLabel label="Bank / NBFC" />
              <CustomDropdown float={false} options={bankArr} labelKey="Text" selectValue={registerData.PBankId} selectKey={'Value'} onSelect={(opt) => setRegisterData((pre) => ({ ...pre, PBankId: opt.Value }))} placeholder="Select Bank" accentColor={ac} />
            </View>
          </View>

          <SectionDivider label="Appointment Details" />

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Appointment Date" required />
              <TouchableOpacity onPress={() => {}} activeOpacity={0.75} style={{ borderColor: "#e5e7eb" }} className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3">
                <Text className={`text-sm font-semibold ${false ? "text-gray-800" : "text-gray-400"}`}>Date</Text>
                <Calendar size={16} color={ac} strokeWidth={2} />
              </TouchableOpacity>
              {/* {rowObjArr[index].err.date && <Text className='text-red-600 text-xs'>This field is required</Text>} */}
              {/* {rowObjArr[index].showDateTime.showDate ? <DateTimePicker value={row.NextAppDateStr ? dayjs.utc(row.NextAppDateStr, "DD/MM/YYYY").toDate() : new Date()} mode="date" display="default" onChange={(e, date) => handleDateSelect(e, index + 1, date)} minimumDate={new Date()} /> : null} */}
            </View>
            <View className="flex-1">
              <FieldLabel label="Stage" />
              <CustomDropdown float={false} options={stageArr} labelKey="LinkDescription" selectValue={registerData.OpportunityId} selectKey={'AutoId'} onSelect={(opt) => setRegisterData((pre) => ({ ...pre, OpportunityId: opt.AutoId }))} placeholder="Stage" accentColor={ac} />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <FieldLabel label="Status" />
              <CustomDropdown float={false} options={statusArr} labelKey="Description" selectValue={registerData.EnqStatusId} selectKey={'CodeId'} onSelect={(opt) => setRegisterData((pre) => ({ ...pre, EnqStatusId: opt.CodeId, EnqStatusValue: opt.CodeValue }))} placeholder="Status" accentColor={ac} />
            </View>
            <View className="flex-1">
              <FieldLabel label="Remarks" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Remarks"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <SectionDivider label="Team & Referrals" />

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Executive" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Search"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm text-gray-600"
              />
            </View>
            <View className="flex-1">
              <FieldLabel label="Partner" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Search"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1">
              <FieldLabel label="Referrer" required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Search"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm text-gray-600"
              />
            </View>
            <View className="flex-1">
              <FieldLabel label="Bussiness Executive"  required />
              <TextInput
                value={''}
                onChangeText={(text) => {}}
                placeholder="Search"
                placeholderTextColor="#d1d5db"
                style={{
                  borderColor: false ? ac + "80" : "#e5e7eb",
                }}
                className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3 text-sm"
              />
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="flex-1 py-4 rounded-2xl items-center justify-center bg-gray-200 shadow-sm">
            <Text className="text-gray-500 text-sm font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={handleSave}
            // disabled={!selectedStage2.LinkDescription}
            activeOpacity={0.8}
            style={{ backgroundColor: false ? ac + "50" : ac }}
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
  );
}