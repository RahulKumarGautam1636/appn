import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card_3, Card_4, CompCard, mmDDyyyyDate, MyModal } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, BC_ROY, defaultId, hasAccess, myColors } from '@/src/constants';
import { filterUnique, getFrom, GridLoader, groupBy, ListLoader, NoContent, sumByKey, useFetch, uType } from '@/src/components/utils';
import { setModal } from '@/src/store/slices/slices';
import { CalendarDays, ChevronRight, FlaskConical, Stethoscope, Users, ChevronDown, ChevronUp } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const Reports = ({ memberId }: any) => {

    const router = useRouter();
    const [report, setReport] = useState('');
    const compCode = useSelector((i: RootState) => i.compCode);
    const selectedCompany = useSelector((i: RootState) => i.companies.selected);
    const user = useSelector((i: RootState) => i.user);
    const [reportData, isLoading, error] = useFetch(`${BASE_URL}/api/SalesInvoice/GetBusinessCount?CID=${compCode}&UserId=${user.UserId}&PartyCode=${user.PartyCode}`, compCode);
    
    const patients = reportData?.Journal?.Sales?.SalesDetailsList;
    const cases = sumByKey(patients || [], 'NosOfCase')

    // NEW DYNAMIC TABS WORK
    const [department, setDepartment] = useState({ loading: false, data: { PatientRegList: [], tabs: [] }, err: { status: false, msg: "" } });

    useEffect(() => {
      if (!selectedCompany.EncCompanyId) return;
      let controller = new AbortController();
      getDepartments(controller.signal, user, selectedCompany);
      return () => controller.abort();
    }, [user.UserId, selectedCompany.EncCompanyId]);

    const getDepartments = async (signal, user, company) => {
      console.log(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=01/03/2026&dttoStr=05/03/2026`);      
      if (user.UserId > 1) {
        const res = await getFrom(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=01/03/2026&dttoStr=05/03/2026`, {}, setDepartment, signal);
        if (res) {
          let uniqueItems = groupBy(res.data.PatientRegList, 'Department');
          setDepartment({...res, data: {PatientRegList: res.data.PatientRegList, tabs: uniqueItems}});
        }
      }
    };

    //---------------------------------------------------------------------------------------------------------------------
    const departments = useSelector((i: RootState) => i.menu.departments);

    const stats = { patientCount: patients?.length || 0, cases: cases }   
    
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className='justify-between flex-row p-4 items-center'>
                <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Booking History</Text>
                </Pressable>
            </View>

            {user.UserLevelSeq === uType.PATIENT.level ? null : <View className='px-4 pt-1'>
              <View className="flex flex-col gap-4 mb-4">
                  <TouchableOpacity onPress={() => setReport(report === 'patients' ? '' : 'patients')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                      <View className="flex-row items-start gap-5">
                          <View className="bg-cyan-400 rounded-2xl p-3 shadow-md">
                              <Users color="white" size={27} />
                          </View>
                          <View>
                              <Text className="text-gray-500 text-[1rem] font-medium tracking-wider mb-1.5">Number of Patients</Text>
                              <Text className="text-gray-800 text-[1.3rem] font-bold">{stats.patientCount}</Text>
                          </View>
                      </View>
                      <ChevronDown color={'#6b7280'} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setReport(report === 'cases' ? '' : 'cases')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                      <View className="flex-row items-start gap-5">
                          <View className="bg-emerald-400 rounded-2xl p-3 shadow-md">
                              <Stethoscope color="white" size={27} />
                          </View>
                          <View>
                              <Text className="text-gray-500 text-[1rem] font-medium tracking-wider mb-1.5">Number of Cases</Text>
                              <Text className="text-gray-800 text-[1.3rem] font-bold">{stats.cases}</Text>
                          </View>
                      </View>
                      <ChevronDown color={'#6b7280'} size={27} />
                  </TouchableOpacity>
              </View>
            </View>}

            <View className="flex flex-col gap-4 mb-4 px-4">
              {departments.map((i: any) => (
                <TouchableOpacity key={i.DeptId} onPress={() => router.push(`/appn/${i.DeptCategory.toLowerCase()}_list`)} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                    <View className="flex-row items-start gap-5">
                        <View className="bg-purple-400 rounded-2xl p-3 shadow-md">
                            <CalendarDays color="white" size={27} />
                        </View>
                        <View>
                            {/* <Text className="text-gray-500 text-[1.1rem] font-medium tracking-wider mb-2">Total Appointments</Text> */}
                            <Text className="text-gray-800 text-xl font-bold mt-2">{i.Department}</Text>
                        </View>
                    </View>
                    <ChevronRight color={'#6b7280'} size={27} />
                </TouchableOpacity>
              ))}

              {/* <TouchableOpacity onPress={() => router.push('/appn/opd_list')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                  <View className="flex-row items-start gap-5">
                      <View className="bg-purple-400 rounded-2xl p-3 shadow-md">
                          <CalendarDays color="white" size={27} />
                      </View>
                      <View>
                          <Text className="text-gray-800 text-xl font-bold mt-2">Appointments</Text>
                      </View>
                  </View>
                  <ChevronRight color={'#6b7280'} size={27} />
              </TouchableOpacity>
              {hasAccess("labtest", compCode) || compCode === BC_ROY ? <TouchableOpacity onPress={() => router.push('/appn/investigation_list')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                  <View className="flex-row items-start gap-5">
                      <View className="bg-pink-400 rounded-2xl p-3 shadow-md">
                          <FlaskConical color="white" size={27} />
                      </View>
                      <View>
                          <Text className="text-gray-800 text-xl font-bold mt-2">Lab Tests</Text>
                      </View>
                  </View>
                  <ChevronRight color={'#6b7280'} size={27} />
              </TouchableOpacity> : null} */}
            </View>
            {/* <MyModal modalActive={report ? true : false} name='REPORT' child={report === 'cases' ? <Cases handleClose={() => setReport('')} /> : <Patients handleClose={() => setReport('')} />} /> */}
            <MyModal modalActive={report ? true : false} name='REPORT' child={<CommonParent stats={stats} report={report} setReport={setReport} handleClose={() => setReport('')} />} />
        </ScrollView>
    )
}

export default Reports;

const CommonParent = ({ stats, report, setReport, handleClose }: any) => {

  const [fromDate, setFromDate] = useState(new Date());
  const [fromDateActive, setFromDateActive] = useState(false);
  const [toDate, setToDate] = useState(new Date(fromDate));
  const [toDateActive, setToDateActive] = useState(false);
  let range = { Day: 1, Week: 7, Month: 30 }
  const [duration, setDuration] = useState('Day');
  const [firstClick, setFirstClick] = useState(false);
  const [detailed, setDetailed] = useState(true);

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

  return (
    <View className='bg-slate-200 flex-1'>       
      <View className='justify-between flex-row p-4 items-center bg-slate-100'>
          <Pressable onPress={handleClose} className='flex-row items-center gap-3'>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
              <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">View by {report === 'patients' ? 'Patients' : 'Cases'}</Text>
          </Pressable>
      </View>

      <View className='w-full px-2 py-4 bg-blue-700'>

        <View className="flex flex-row gap-2.5 mb-4">
          <TouchableOpacity onPress={() => setReport(report === 'patients' ? '' : 'patients')} className={`${report === 'patients' ? 'bg-blue-200' : 'bg-white'} flex-row rounded-2xl flex-1 p-3 border border-white cursor-pointer justify-between items-center`}>
              <View className="flex-row items-center gap-3">
                  <View className="bg-cyan-400 rounded-2xl py-1.5 px-3.5">
                       <Text className="text-gray-800 text-[1.1rem] font-bold">{stats.patientCount}</Text>
                  </View>
                  <View>
                      <Text className="text-gray-800 text-sm font-medium tracking-wider">Total Patients</Text>
                  </View>
              </View>
              {/* <ChevronDown color={'#6b7280'} size={20} /> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReport(report === 'cases' ? '' : 'cases')} className={`${report === 'cases' ? 'bg-blue-200' : 'bg-white'} flex-row rounded-2xl flex-1 p-3 border border-white cursor-pointer justify-between items-center`}>
              <View className="flex-row items-center gap-3">
                  <View className="bg-emerald-400 rounded-2xl py-1.5 px-3.5">
                      <Text className="text-gray-800 text-[1.1rem] font-bold">{stats.cases}</Text>
                  </View>
                  <View>
                      <Text className="text-gray-800 text-sm font-medium tracking-wider">Total Cases</Text>
                      
                  </View>
              </View>
              {/* <ChevronDown color={'#6b7280'} size={20} /> */}
          </TouchableOpacity>
      </View>

        {/* <Text className='text-base text-white mb-4 font-semibold'>Filter By Date</Text> */}
        <View className='flex-row justify-between flex-wrap gap-y-1'>

          <Pressable onPress={() => setDetailed(!detailed)} className='flex-row items-center bg-white p-2 rounded-lg'>
            {detailed ? <FontAwesome5 name="check-circle" size={17} color="red" /> : <FontAwesome5 name="circle" size={17} color="#484848" />}
            <View>
                <Text className="font-medium text-gray-600 text-[12px] ml-1">Details</Text>
            </View>
          </Pressable>

          <View className='flex-row ml-auto gap-1'>
            <Pressable onPress={() => {setFirstClick(true); setDurationDropdown(true)}} className='flex-row items-center bg-white p-2 rounded-lg'>
              <View>
                  <Text className="font-medium text-gray-600 text-[12px] mr-1">{duration}</Text>
              </View>
              <Feather name="chevron-down" size={18} color='#484848' className='w-4' />
              <MyModal modalActive={durationDropdown} onClose={() => setDurationDropdown(false)} child={<DurationDropdown />} />
            </Pressable>
            <View className='flex-row bg-white rounded-lg'>
              <TouchableOpacity onPress={() => handleDate('prev')} className='bg-blue-200 justify-center rounded-tl-lg rounded-bl-lg'>
                <Feather name="chevron-left" size={20} color='#484848' />
              </TouchableOpacity>
              <View className='flex-row items-center py-2'>
                <Pressable onPress={() => setFromDateActive(true)}>
                    <Text className="font-medium text-gray-600 text-[12px] leading-5 px-1">{new Date(fromDate).toLocaleDateString('en-TT')}</Text>
                </Pressable>
                {fromDateActive ? <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e: any, d: any) => {setFromDateActive(false); setFromDate(d); setFirstClick(true);}} /> : null}
              </View>
              <Text className='font-semibold my-auto'>-</Text>
              <View className='flex-row items-center py-2'>
                <Pressable onPress={() => setToDateActive(true)}>
                    <Text className="font-medium text-gray-600 text-[12px] leading-5 px-1">{new Date(toDate).toLocaleDateString('en-TT')}</Text>
                </Pressable>
                {toDateActive ? <DateTimePicker value={toDate} mode="date" display="default" onChange={(e: any, d: any) => {setToDateActive(false); setToDate(d); setFirstClick(true);}} /> : null}
              </View>
              <TouchableOpacity onPress={() => handleDate('next')} className='bg-blue-200 justify-center rounded-tr-lg rounded-br-lg'>
                <Feather name="chevron-right" size={20} color='#484848' />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
      {report === 'patients' ? 
        <Patients fromDate={fromDate} toDate={toDate} detailed={detailed} /> :
        <Cases fromDate={fromDate} toDate={toDate} detailed={detailed} />
      }
    </View>
  )
}

const professionalNameAlias = { Market: 'Market By', INTDOCT: 'Doctors', DOCT: 'Referrers', Referer: 'Providers', CollectedBy: 'Collected By' }

export const Patients = ({ fromDate, toDate, detailed }: any) => {

    const user = useSelector((i: RootState) => i.user);
    const isProvider = user.UserLevelSeq === uType.PROVIDER.level;

    const [active, setActive] = useState(null);
    const compCode = useSelector((i: RootState) => i.compCode);
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
    const [reportData, isLoading, error] = useFetch(`${BASE_URL}/api/SalesInvoice/GetCommissionManage?EncCompanyId=${compCode}&LocationId=${locationId}&FromDateStr=${fromDate.toLocaleDateString('en-TT')}&ToDateStr=${toDate.toLocaleDateString('en-TT')}&RefType=${'B2C'}&RefDateType=${'COMDATE'}&TransType=${'All'}&Category=${'0'}&PartyID=${'0'}&ProfId=${user.PartyCode}&BillStatus=${'All'}`, compCode);

    // let tests = {};

    // if (isProvider) {
    //   tests = groupBy(reportData?.DirectSalesCollection, 'PartyName');
    // } else {
    //   tests = groupBy(reportData?.DirectSalesCollection, 'ReferenceBy');    // for market by
    // }
    // const testList = Object.values(tests);

    let tests = {};
    let testList = [];
    let professionalsTestList = [];
    let currentUsersItems = [];

    if (isProvider) {
      tests = groupBy(reportData?.DirectSalesCollection, 'PartyName');
      testList = Object.values(tests);
    } else {
      currentUsersItems = reportData.DirectSalesCollection?.filter((i: any) => i.ReferrerId === user.PartyCode) || [];
      const otherUsersItems = reportData.DirectSalesCollection?.filter((i: any) => i.ReferrerId !== user.PartyCode) || []; 
      const groupByprofessionals = groupBy(otherUsersItems, 'CommFor');
      professionalsTestList = Object.values(groupByprofessionals);    
    }

    return (
      <ScrollView contentContainerClassName=''> 
        {(() => {
          if (isLoading) {
            return <GridLoader classes='h-[70px]' count={4} containerClass='gap-3 p-4' />
          } else if (!testList.length && !professionalsTestList.length && !currentUsersItems.length) {
            return <NoContent imgClass='h-[190] mt-24' textClass='text-gray-500 text-xl mt-8'/>
          } else if (error) {
            alert('Some Error Occured!')
          } else {
            if (isProvider) {
              return (
                <View className={`gap-2 p-4`}>
                  {testList?.map((dept: any, index: Number) => <PatientCard key={index} data={dept} index={index} active={active} setActive={setActive} detailed={detailed}/>)}
                </View>
              )
            } else {
              return (
                <View className='gap-3 px-2 pt-1 pb-4'>
                  {currentUsersItems.length ? <View>
                    <Text className='mt-2 mb-3 font-bold text-gray-900'>Current User</Text>
                    <ProviderGroupByPatients data={currentUsersItems} userRefId={user.PartyCode} detailed={detailed}/>
                  </View> : null}
                  {professionalsTestList?.map((prof, n) => { 
                    const groupedProfTestItems = groupBy(prof, 'ReferenceBy'); 
                    return (
                      <View className='gap-3' key={n}>
                        <Text className='mt-1 font-bold text-gray-900'>{professionalNameAlias[prof[0]?.CommFor]}</Text>
                        {(Object.values(groupedProfTestItems)).map((item, index) => <ProviderGroupByPatients key={index} data={item} userRefId={user.PartyCode} detailed={detailed}/>)}
                      </View>
                    )
                  })}
                </View>
              )
              // return (
              //   <View className='gap-3 p-2'>
              //     {testList?.map((dept: any, index: Number) => <ProviderGroupByPatients key={index} data={dept} userRefId={user.PartyCode} />)}
              //   </View>
              // )
            }
          }
        })()}
      </ScrollView>
    )
}

const ProviderGroupByPatients = ({ data, userRefId, detailed }: any) => {
  const providerName = data[0].ReferenceBy;
  // const providerRefId = data[0].ReferrerId;
  // const isCurrentUser = providerRefId === userRefId;
  const tests = groupBy(data, 'PartyName');
  const testList = Object.values(tests);
  const totalIp = sumByKey(testList.flat(), 'TaxableAmount');  
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  return (
    <View className={`rounded-3xl ${open ? 'bg-blue-200/80' : ''}`}>
      <TouchableOpacity onPress={() => setOpen(!open)} className="bg-white flex-row rounded-2xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
        <View className="flex-row items-start gap-4">
            <View className="bg-cyan-500 rounded-2xl p-3">
                <Users color="white" size={20} />
            </View>
            <View>
                <Text className="text-gray-950 text-[1rem] font-semibold mb-1.5">{providerName}</Text>
                <Text className="text-gray-500 text-[0.85rem] font-medium">Patients : {testList.length}     Total IP : {totalIp}</Text>
            </View>
        </View>
        {open ? <ChevronUp color={'#0ea5e9'} size={27} /> : <ChevronDown color={'#6b7280'} size={27} />}
      </TouchableOpacity>
      {open ?
        <View className={`gap-2 px-2 pt-3 pb-4`}>
          {testList?.map((dept: any, index: Number) => <PatientCard key={index} data={dept} index={index} active={active} setActive={setActive} detailed={detailed} />)}
        </View> 
      : null}
    </View>
  )
}

const PatientCard = ({ data, classes, index, active, setActive, detailed }: any) => { 
    
    const testName = data[0].PartyName;
    const patients = groupBy(data, 'Description');
    const patientsList = Object.values(patients).flat();
    const patientCount = patientsList.length;
    
    const ipAmount = sumByKey(data, 'TaxableAmount');
    const paidAmount = sumByKey(data, 'AllocatedAmount'); 

    const totalRate = sumByKey(data, 'Rate');
    const invAmount = data[0]?.invoiceAmt;  
    const invDiscount = totalRate - invAmount;     // data[0].InvDiscount;
    
    const invoices = groupBy(patientsList, 'invoiceno'); 
    const invoiceList = Object.values(invoices);  
    const uniqueInvoiceList = filterUnique(invoiceList.flat(), 'invoiceno');
    const balance = sumByKey(uniqueInvoiceList, 'Balance');

    return (
      <View className={`gap-3`}>
        <TouchableOpacity onPress={() => setActive(active === index ? "" : index)} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-sm border p-3 relative ${classes} ${active === index ? 'border-orange-500' : 'border-gray-200'}`}>
          <View className="mr-auto flex-1">
            <View className='flex-row items-center gap-4'>
              <Text className="font-bold text-sky-800 text-[12px]">{testName}</Text>
              <Text className="text-orange-600 text-[11px] font-medium">No. of Cases : {patientCount}</Text>
            </View>
            {detailed ? <View className="flex-row justify-between items-end mt-2.5">
              <Text className="mt-1.5 text-[12px] text-gray-900 font-medium leading-4 flex-1">
                Rate : <Text className='text-gray-500'>{ipAmount}</Text>
              </Text>
              <Text className="mt-1.5 text-[12px] text-gray-900 font-medium leading-4 flex-1">
                Discount : <Text className='text-gray-500'>{paidAmount}</Text>
              </Text>
              <Text className="text-gray-900 mt-1.5 text-[12px] font-medium leading-4 flex-1">
                INV Amt : <Text className='text-gray-500'>{balance}</Text>
              </Text>
            </View> : null}
            <View className="flex-row justify-between items-end mt-[5px]">
              <Text className="mt-1.5 text-[12px] text-gray-900 font-medium leading-4 flex-1">
                IP Amt : <Text className='text-gray-500'>{ipAmount}</Text>
              </Text>
              <Text className="mt-1.5 text-[12px] text-gray-900 font-medium leading-4 flex-1">
                Paid : <Text className='text-gray-500'>{paidAmount}</Text>
              </Text>
              <Text className="text-gray-900 mt-1.5 text-[12px] font-medium leading-4 flex-1">
                Balance : <Text className='text-gray-500'>{balance}</Text>
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" className={`absolute top-2 right-2 rounded-md px-1 ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100 rotate-0'}`} size={19} color={active === index ? 'white' : `#2563eb`} />
        </TouchableOpacity>

        {active === index ? (
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerClassName='min-w-full'>
            <View className="bg-white rounded-lg shadow-sm w-full">
              <View className="flex flex-row border border-gray-200 bg-orange-50 rounded-t-lg">
                <View className="flex-1 p-3 w-[7rem]">
                  <Text className="text-xs font-medium text-gray-800">Cases</Text>
                </View>

                {detailed ? <><View className="py-3 pr-3 border-l border-white w-[4rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">Rate</Text>
                </View>
                <View className="py-3 pr-3 flex-1 border-l border-white w-[4rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">Disc</Text>
                </View>
                <View className="py-3 pr-3 flex-1 border-l border-white w-[4rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">INV Amt</Text>
                </View></> : null}

                <View className="py-3 pr-3 flex-1 border-l border-white w-[4rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">IP Amt</Text>
                </View>
                <View className="py-3 pr-3 flex-1 border-l border-white w-[4rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">Paid</Text>
                </View>
                <View className="py-3 pr-3 flex-1 border-l border-white w-[4rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">Balance</Text>
                </View>
              </View>
              {invoiceList.map((i: any, n: number) => {
                const invoiceNo = i[0].invoiceno;
                const ipAmount = sumByKey(i, "TaxableAmount");
                const paidAmount = sumByKey(i, "AllocatedAmount");
                const balance = i[0].Balance;
                return (
                  <React.Fragment key={n}>
                    <View className="flex flex-row bg-purple-50 border-x border-purple-100">
                      <View className="flex-1 p-3 w-[7rem]">
                        <Text className="text-xs font-medium text-gray-800">{invoiceNo}</Text>
                      </View>

                      {detailed ? <><View className="p-3 flex-1 border-l border-white w-[4rem]">
                        <Text className="text-xs font-medium text-gray-800 text-right">{totalRate}</Text>
                      </View>
                      <View className="p-3 flex-1 border-l border-white w-[4rem]">
                        <Text className="text-xs font-medium text-gray-800 text-right">{invDiscount}</Text>
                      </View>
                      <View className="p-3 flex-1 border-l border-white w-[4rem]">
                        <Text className="text-xs font-medium text-gray-800 text-right">{invAmount}</Text>
                      </View></> : null}


                      <View className="p-3 flex-1 border-l border-white w-[4rem]">
                        <Text className="text-xs font-medium text-gray-800 text-right">{ipAmount}</Text>
                      </View>
                      <View className="p-3 flex-1 border-l border-white w-[4rem]">
                        <Text className="text-xs font-medium text-gray-800 text-right">{paidAmount}</Text>
                      </View>
                      <View className="p-3 flex-1 border-l border-white w-[4rem]">
                        <Text className="text-xs font-medium text-gray-800 text-right">{balance}</Text>
                      </View>
                    </View>
                    {i.map((item: any, itemIndex: number) => (
                      <View key={itemIndex} className={`flex flex-row w-full border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === patients.length - 1 ? "rounded-b-lg" : ""}`}>
                        <View className="flex-1 p-3 w-[7rem]">
                          <View className="flex flex-row items-center gap-3">
                            <Text className="text-xs text-gray-900 font-medium">{item.Description}</Text>
                          </View>
                        </View>

                        {detailed ? <><View className="p-3 flex-1 border-l border-gray-100 w-[4rem]">
                          <Text className="text-xs text-gray-900 text-right">{item.Rate}</Text>
                        </View>
                        <View className="p-3 flex-1 border-l border-gray-100 w-[4rem]">
                          <Text className="text-xs text-gray-900 text-right">{item.Discount}</Text>
                        </View>
                        <View className="p-3 flex-1 border-l border-gray-100 w-[4rem]">
                          <Text className="text-xs text-gray-900 text-right">-</Text>
                        </View></> : null}

                        <View className="p-3 flex-1 border-l border-gray-100 w-[4rem]">
                          <Text className="text-xs text-gray-900 text-right">{item.TaxableAmount}</Text>
                        </View>
                        <View className="p-3 flex-1 border-l border-gray-100 w-[4rem]">
                          <Text className="text-xs text-gray-900 font-medium text-right">-</Text>
                        </View>                        
                        <View className="p-3 flex-1 border-l border-gray-100 w-[4rem]">
                          <Text className="text-xs text-gray-900 font-medium text-right">-</Text>
                        </View>
                      </View>
                    ))}
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
        ) : null}
      </View>
    );
}

export const Cases = ({ fromDate, toDate, detailed }: any) => {

  const user = useSelector((i: RootState) => i.user);
  const isProvider = user.UserLevelSeq === uType.PROVIDER.level;

  // -------------------------------------------------------------------------------------------------
  const [active, setActive] = useState(null);
  const compCode = useSelector((i: RootState) => i.compCode);
  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  const [reportData, isLoading, error] = useFetch(`${BASE_URL}/api/SalesInvoice/GetCommissionManage?EncCompanyId=${compCode}&LocationId=${locationId}&FromDateStr=${fromDate.toLocaleDateString('en-TT')}&ToDateStr=${toDate.toLocaleDateString('en-TT')}&RefType=${'B2C'}&RefDateType=${'COMDATE'}&TransType=${'All'}&Category=${'0'}&PartyID=${'0'}&ProfId=${user.PartyCode}&BillStatus=${'All'}`, compCode);

  let tests = {};
  let testList = [];
  let professionalsTestList = [];
  let currentUsersItems = [];

  if (isProvider) {
    tests = groupBy(reportData?.DirectSalesCollection, 'Description');
    testList = Object.values(tests);
  } else {
    currentUsersItems = reportData.DirectSalesCollection?.filter((i: any) => i.ReferrerId === user.PartyCode) || [];
    const otherUsersItems = reportData.DirectSalesCollection?.filter((i: any) => i.ReferrerId !== user.PartyCode) || []; 
    const groupByprofessionals = groupBy(otherUsersItems, 'CommFor');
    professionalsTestList = Object.values(groupByprofessionals);    
  } 


  return (
    <ScrollView contentContainerClassName=''> 
      {(() => {
        if (isLoading) {
          return <GridLoader classes='h-[70px]' count={4} containerClass='gap-3 p-4' />
        } else if (!testList.length && !professionalsTestList.length && !currentUsersItems.length) {
          return <NoContent imgClass='h-[190] mt-24' textClass='text-gray-500 text-xl mt-8'/>
        } else if (error) {
          alert('Some Error Occured!')
        } else {
          if (isProvider) {
            return (
              <View className={`gap-2 p-4`}>
                {testList?.map((dept: any, index: Number) => <CaseCard key={index} data={dept} index={index} active={active} setActive={setActive} detailed={detailed}/>)}
              </View>
            )
          } else {
            // return (
            //   <>
            //     {currentUsersItems.length ? <div>
            //       <h5 className='my-3 font-bold text-gray-900'>Current User</h5>
            //       <ProviderGroupByCases data={currentUsersItems} userRefId={user.PartyCode} detailed={detailed}/>
            //     </div> : null}
            //     {professionalsTestList?.map((prof) => { 
            //       const groupedProfTestItems = groupBy(prof, 'ReferenceBy'); 
            //       return (
            //         <div>
            //           <h5 className='my-3 font-bold text-gray-900'>{professionalNameAlias[prof[0]?.CommFor]}</h5>
            //           {(Object.values(groupedProfTestItems)).map((item, index) => <ProviderGroupByCases key={index} data={item} userRefId={user.PartyCode} detailed={detailed}/>)}
            //         </div>
            //       )
            //     })}
            //   </>
            // )

             return (
              <View className='gap-3 px-2 pt-1 pb-4'>
                {currentUsersItems.length ? <View>
                  <Text className='mt-2 mb-3 font-bold text-gray-900'>Current User</Text>
                  <ProviderGroupByCases data={currentUsersItems} userRefId={user.PartyCode} detailed={detailed}/>
                </View> : null}
                {professionalsTestList?.map((prof, n) => { 
                  const groupedProfTestItems = groupBy(prof, 'ReferenceBy'); 
                  return (
                    <View className='gap-3' key={n}>
                      <Text className='mt-1 font-bold text-gray-900'>{professionalNameAlias[prof[0]?.CommFor]}</Text>
                      {(Object.values(groupedProfTestItems)).map((item, index) => <ProviderGroupByCases key={index} data={item} userRefId={user.PartyCode} detailed={detailed}/>)}
                    </View>
                  )
                })}
              </View>
            )

            // return (
            //   <View className='gap-3 p-2'>
            //     {testList?.map((dept: any, index: Number) => <ProviderGroupByCases key={index} data={dept} userRefId={user.PartyCode} />)}
            //   </View>
            // )
          }
        }
      })()}
    </ScrollView>
  )
}

const ProviderGroupByCases = ({ data, userRefId, detailed }: any) => {
  const providerName = data[0].ReferenceBy;
  // const providerRefId = data[0].ReferrerId;
  // const isCurrentUser = providerRefId === userRefId;
  const tests = groupBy(data, 'Description');
  const testList = Object.values(tests);
  const totalIp = sumByKey(testList.flat(), 'TaxableAmount');  
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  return (
    <View className={`rounded-3xl ${open ? 'bg-blue-200/80' : ''}`}>
      <TouchableOpacity onPress={() => setOpen(!open)} className="bg-white flex-row rounded-2xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
        <View className="flex-row items-start gap-4">
            <View className="bg-emerald-500 rounded-2xl p-3">
                <Users color="white" size={20} />
            </View>
            <View>
                <Text className="text-gray-800 text-[1rem] font-bold mb-1.5">{providerName}</Text>
                {/* <Text className="text-gray-500 text-[0.9rem] font-medium tracking-wider">Number of Cases : {testList.length}</Text> */}
                <Text className="text-gray-500 text-[0.85rem] font-medium">Cases : {testList.length}     Total IP : {totalIp}</Text>
            </View>
        </View>
        {open ? <ChevronUp color={'#0ea5e9'} size={27} /> : <ChevronDown color={'#6b7280'} size={27} />}
      </TouchableOpacity>
      {open ?
        <View className={`gap-2 px-2 pt-3 pb-4`}>
          {testList?.map((dept: any, index: Number) => <CaseCard key={index} data={dept} index={index} active={active} setActive={setActive} detailed={detailed}/>)}
        </View> 
      : null}
    </View>
  )
}

const CaseCard = ({ data, classes, index, active, setActive, detailed }: any) => {

    const testName = data[0].Description;
    const patients = groupBy(data, 'PartyName');
    const patientsList = Object.values(patients).flat();
    const patientCount = patientsList.length;
    const ipAmount = sumByKey(data, 'TaxableAmount');
    // const paidAmount = sumByKey(data, 'AllocatedAmount');  
    // const balance = sumByKey(patientsList, 'Balance');
    
    const totalDiscount = sumByKey(patientsList, 'Discount'); 
    const totalAmount = sumByKey(patientsList, 'Rate');  

    return (
      <View className='gap-3'>
        <TouchableOpacity onPress={() => setActive(active === index ? "" : index)} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-sm border p-3 relative ${classes} ${active === index ? 'border-orange-500' : 'border-gray-200'}`}>
          <View className="mr-auto flex-1">
            <Text className="font-PoppinsSemibold text-sky-800 leading-6 text-[12px]">{testName}</Text>
            <Text className="text-gray-600 mt-[6px] text-[11px] font-medium">No. of Patients : {patientCount}</Text>
            <View className="flex-row items-end mt-[5px] justify-between">
              {detailed ? <><Text className="mt-1.5 text-[11px] text-orange-600 font-medium leading-4">
                Total Disc : {totalDiscount}
              </Text>
              <Text className="mt-1.5 text-[11px] text-blue-600 font-medium leading-4">
                Total Amt : {totalAmount}
              </Text></> : null}
              <Text className="text-green-600 mt-1.5 text-[11px] font-medium leading-4">
                IP Amt : {ipAmount}
              </Text>
            </View>
          </View>
          {/* <Ionicons name="chevron-down" className={`p-[9px] rounded-full my-auto ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100 rotate-0'}`} size={19} color={active === index ? 'white' : `#2563eb`} /> */}
          <Ionicons name="chevron-down" className={`absolute px-1 top-2 right-2 rounded-md ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100 rotate-0'}`} size={19} color={active === index ? 'white' : `#2563eb`} />
        </TouchableOpacity>

        {active === index && (
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerClassName='min-w-full'>
            <View className="bg-white rounded-lg shadow-sm w-full">
              <View className="flex flex-row border border-gray-200 bg-orange-50 rounded-t-lg">
                <View className="flex-1 p-3 w-[8rem]">
                  <Text className="text-xs font-medium text-gray-800">Patients</Text>
                </View>

                {detailed ? <><View className="p-3 flex-1 border-l border-white w-[5rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">Total Disc</Text>
                </View>
                <View className="p-3 flex-1 border-l border-white w-[5rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">Total Amt</Text>
                </View></> : null}

                <View className="p-3 flex-1 border-l border-white w-[5rem]">
                  <Text className="text-xs font-medium text-gray-800 text-right">IP Amt</Text>
                </View>
              </View>

              {patientsList.map((patient: any, index) => (
                <View key={index} className={`flex flex-row border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === patients.length - 1 ? "rounded-b-lg" : ""}`}>
                  <View className="flex-1 p-3 w-[8rem]">
                    <Text className="text-xs text-gray-900 font-medium">{patient.PartyName}</Text>
                  </View>
                  
                  {detailed ? <><View className="p-3 flex-1 border-l border-gray-100 w-[5rem]">
                    <Text className="text-xs text-gray-900 font-medium text-right">{patient.Discount}</Text>
                  </View>
                  <View className="p-3 flex-1 border-l border-gray-100 w-[5rem]">
                    <Text className="text-xs text-gray-900 font-medium text-right">{patient.Rate}</Text>
                  </View></> : null}

                  <View className="p-3 flex-1 border-l border-gray-100 w-[5rem]">
                    <Text className="text-xs text-gray-900 text-right">{patient.TaxableAmount}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
}
