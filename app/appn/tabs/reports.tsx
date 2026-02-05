import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
    const user = useSelector((i: RootState) => i.user);
    const [reportData, isLoading, error] = useFetch(`${BASE_URL}/api/SalesInvoice/GetBusinessCount?CID=${compCode}&UserId=${user.UserId}&PartyCode=${user.PartyCode}`, compCode);
    
    const patients = reportData?.Journal?.Sales?.SalesDetailsList;
    const cases = sumByKey(patients || [], 'NosOfCase')
    
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
                              <Text className="text-gray-800 text-[1.3rem] font-bold">{patients?.length || 0}</Text>
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
                              <Text className="text-gray-800 text-[1.3rem] font-bold">{cases}</Text>
                          </View>
                      </View>
                      <ChevronDown color={'#6b7280'} size={27} />
                  </TouchableOpacity>
              </View>
            </View>}

            <View className="flex flex-col gap-4 mb-4 px-4">
                <TouchableOpacity onPress={() => router.push('/appn/appnList')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                    <View className="flex-row items-start gap-5">
                        <View className="bg-purple-400 rounded-2xl p-3 shadow-md">
                            <CalendarDays color="white" size={27} />
                        </View>
                        <View>
                            {/* <Text className="text-gray-500 text-[1.1rem] font-medium tracking-wider mb-2">Total Appointments</Text> */}
                            <Text className="text-gray-800 text-xl font-bold mt-2">Appointments</Text>
                        </View>
                    </View>
                    <ChevronRight color={'#6b7280'} size={27} />
                </TouchableOpacity>
                {hasAccess("labtest", compCode) || compCode === BC_ROY ? <TouchableOpacity onPress={() => router.push('/appn/testList')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                    <View className="flex-row items-start gap-5">
                        <View className="bg-pink-400 rounded-2xl p-3 shadow-md">
                            <FlaskConical color="white" size={27} />
                        </View>
                        <View>
                            {/* <Text className="text-gray-500 text-[1.1rem] font-medium tracking-wider mb-2">Total Lab Tests</Text> */}
                            <Text className="text-gray-800 text-xl font-bold mt-2">Lab Tests</Text>
                        </View>
                    </View>
                    <ChevronRight color={'#6b7280'} size={27} />
                </TouchableOpacity> : null}
            </View>
            <MyModal modalActive={report ? true : false} name='REPORT' child={report === 'cases' ? <Cases handleClose={() => setReport('')} /> : <Patients handleClose={() => setReport('')} />} />
        </ScrollView>
    )
}

export default Reports;

export const Patients = ({ handleClose }: any) => {

    const [active, setActive] = useState(null);
    const [fromDate, setFromDate] = useState(new Date());
    const [fromDateActive, setFromDateActive] = useState(false);
    const [toDate, setToDate] = useState(new Date(fromDate));
    const [toDateActive, setToDateActive] = useState(false);
    let range = { Day: 1, Week: 7, Month: 30 }
    const [duration, setDuration] = useState('Day');
    const [firstClick, setFirstClick] = useState(false);
    const user = useSelector((i: RootState) => i.user);
    const isProvider = user.UserLevelSeq === uType.PROVIDER.level;

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

    const compCode = useSelector((i: RootState) => i.compCode);
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
    const [reportData, isLoading, error] = useFetch(`${BASE_URL}/api/SalesInvoice/GetCommissionManage?EncCompanyId=${compCode}&LocationId=${locationId}&FromDateStr=${fromDate.toLocaleDateString('en-TT')}&ToDateStr=${toDate.toLocaleDateString('en-TT')}&RefType=${'B2C'}&RefDateType=${'COMDATE'}&TransType=${'All'}&Category=${'0'}&PartyID=${'0'}&ProfId=${user.PartyCode}&BillStatus=${'All'}`, compCode);

    let tests = {};

    if (isProvider) {
      tests = groupBy(reportData?.DirectSalesCollection, 'PartyName');
    } else {
      tests = groupBy(reportData?.DirectSalesCollection, 'ReferenceBy');    // for market by
    }
    const testList = Object.values(tests);

    return (
        <View className='bg-slate-100 flex-1'>       
            <View className='justify-between flex-row p-4 items-center bg-slate-100'>
                <Pressable onPress={handleClose} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">View by Patients</Text>
                </Pressable>
            </View>
            <View className='w-full p-4 bg-blue-500'>
              <Text className='text-base text-white mb-4 font-semibold'>Filter By Date</Text>
              <View className='flex-row justify-between items-center flex-wrap gap-y-3'>

                <Pressable onPress={() => {setFirstClick(true); setDurationDropdown(true)}} className='flex-row items-center bg-white p-2 rounded-lg'>
                  <View>
                      <Text className="font-medium text-gray-600 text-[13px] mr-2">{duration}</Text>
                  </View>
                  <Feather name="chevron-down" size={20} color='gray' />
                  <MyModal modalActive={durationDropdown} onClose={() => setDurationDropdown(false)} child={<DurationDropdown />} />
                </Pressable>
                <View className='flex-row items-center gap-1 ml-auto'>
                  <TouchableOpacity onPress={() => handleDate('prev')}>
                    <Feather name="chevron-left" size={23} color='white' />
                  </TouchableOpacity>
                  <View className='flex-row items-center bg-gray-100 p-2 rounded-lg'>
                    <Pressable onPress={() => setFromDateActive(true)}>
                        <Text className="font-medium text-gray-600 text-[13px] leading-5 px-1">{new Date(fromDate).toLocaleDateString('en-TT')}</Text>
                    </Pressable>
                    {fromDateActive ? <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e: any, d: any) => {setFromDateActive(false); setFromDate(d); setFirstClick(true);}} /> : null}
                  </View>
                  <Text className='text-white font-semibold'> To </Text>
                  <View className='flex-row items-center bg-gray-100 p-2 rounded-lg'>
                    <Pressable onPress={() => setToDateActive(true)}>
                        <Text className="font-medium text-gray-600 text-[13px] leading-5 px-1">{new Date(toDate).toLocaleDateString('en-TT')}</Text>
                    </Pressable>
                    {toDateActive ? <DateTimePicker value={toDate} mode="date" display="default" onChange={(e: any, d: any) => {setToDateActive(false); setToDate(d); setFirstClick(true);}} /> : null}
                  </View>
                  <TouchableOpacity onPress={() => handleDate('next')}>
                    <Feather name="chevron-right" size={23} color='white' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView contentContainerClassName=''> 
              {(() => {
                if (isLoading) {
                  return <GridLoader classes='h-[70px]' count={4} containerClass='gap-3 p-4' />
                } else if (!testList.length) {
                  return <NoContent imgClass='h-[190] mt-24' textClass='text-gray-500 text-xl mt-8'/>
                } else if (error) {
                  alert('Some Error Occured!')
                } else {
                  if (isProvider) {
                    return (
                      <View className={`gap-2 p-4`}>
                        {testList?.map((dept: any, index: Number) => <PatientCard key={index} data={dept} index={index} active={active} setActive={setActive}/>)}
                      </View>
                    )
                  } else {
                    return (
                      <View className='gap-3 p-2'>
                        {testList?.map((dept: any, index: Number) => <ProviderGroupByPatients key={index} data={dept} userRefId={user.PartyCode} />)}
                      </View>
                    )
                  }
                }
              })()}
            </ScrollView>
        </View>
    )
}

const ProviderGroupByPatients = ({ data, userRefId }: any) => {
  const providerName = data[0].ReferenceBy;
  // const providerRefId = data[0].ReferrerId;
  // const isCurrentUser = providerRefId === userRefId;
  const tests = groupBy(data, 'PartyName');
  const testList = Object.values(tests);
  const totalIp = sumByKey(testList.flat(), 'TaxableAmount');  
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // useEffect(() => {
  //   if (isCurrentUser) setOpen(true);
  // },[isCurrentUser])

  return (
    <View className={`rounded-3xl ${open ? 'bg-blue-100' : ''}`}>
      {/* {isCurrentUser ? null :  */}
      <TouchableOpacity onPress={() => setOpen(!open)} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
        <View className="flex-row items-start gap-4">
            <View className="bg-cyan-400 rounded-2xl p-3 shadow-md">
                <Users color="white" size={20} />
            </View>
            <View>
                <Text className="text-gray-950 text-[1rem] font-semibold mb-1.5">{providerName}</Text>
                <Text className="text-gray-500 text-[0.85rem] font-medium">Patients : {testList.length}     Total IP : {totalIp}</Text>
            </View>
        </View>
        {open ? <ChevronUp color={'#0ea5e9'} size={27} /> : <ChevronDown color={'#6b7280'} size={27} />}
      </TouchableOpacity>
      {/* } */}
      {open ?
        <View className={`gap-2 px-2 pt-3 pb-4`}>
          {testList?.map((dept: any, index: Number) => <PatientCard key={index} data={dept} index={index} active={active} setActive={setActive}/>)}
        </View> 
      : null}
    </View>
  )
}

const PatientCard = ({ data, classes, index, active, setActive }: any) => { 
    
    const testName = data[0].PartyName;
    const patients = groupBy(data, 'Description');
    const patientsList = Object.values(patients).flat();
    const patientCount = patientsList.length;
    
    const ipAmount = sumByKey(data, 'TaxableAmount');
    const paidAmount = sumByKey(data, 'AllocatedAmount'); 
    
    const invoices = groupBy(patientsList, 'invoiceno'); 
    const invoiceList = Object.values(invoices);  
    const uniqueInvoiceList = filterUnique(invoiceList.flat(), 'invoiceno');
    const balance = sumByKey(uniqueInvoiceList, 'Balance');

    return (
      <View className={`gap-3`}>
        <TouchableOpacity onPress={() => setActive(active === index ? "" : index)} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-sm border p-3 relative ${classes} ${active === index ? 'border-orange-500' : 'border-gray-200'}`}>
          <View className="mr-auto flex-1">
            <Text className="font-PoppinsSemibold text-sky-800 leading-6 text-[13px]">{testName}</Text>
            <Text className="text-gray-700 mt-[6px] text-[12px] font-medium">No. of Cases : {patientCount}</Text>
            <View className="flex-row justify-between items-end mt-[5px]">
              {/* <Text className="mt-1.5 text-[12px] text-gray-700 font-medium leading-4">
                Cases : {patientCount}
              </Text> */}
              <Text className="mt-1.5 text-[12px] text-blue-600 font-medium leading-4">
                IP Amount : {ipAmount}
              </Text>
              <Text className="mt-1.5 text-[12px] text-green-600 font-medium leading-4">
                Paid : {paidAmount}
              </Text>
              <Text className="text-orange-600 mt-1.5 text-[12px] font-medium leading-4">
                Balance : {balance}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" className={`absolute top-2 right-2 rounded-md px-1 ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100'}`} size={19} color={active === index ? 'white' : `#2563eb`} />
        </TouchableOpacity>

        {active === index ? (
          <View className="gap-3">
            <View className="bg-white rounded-lg shadow-sm w-full max-w-2xl">
              <View className="flex flex-row border border-gray-200 bg-orange-50 rounded-t-lg">
                <View className="w-[40%] p-3">
                  <Text className="text-[0.8rem] font-medium text-gray-800">Cases</Text>
                </View>
                <View className="py-3 pr-3 w-[23%]">
                  <Text className="text-[0.8rem] font-medium text-gray-800 text-right">IP Amount</Text>
                </View>
                <View className="py-3 pr-3 w-[17%]">
                  <Text className="text-[0.8rem] font-medium text-gray-800 text-right">Paid</Text>
                </View>
                <View className="py-3 pr-3 w-[20%]">
                  <Text className="text-[0.8rem] font-medium text-gray-800 text-right">Balance</Text>
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
                      <View className="w-[40%] p-3">
                        <Text className="text-sm font-medium text-gray-800">{invoiceNo}</Text>
                      </View>
                      <View className="p-3 w-[23%]">
                        <Text className="text-sm font-medium text-gray-800 text-right">{ipAmount}</Text>
                      </View>
                      <View className="p-3 w-[17%]">
                        <Text className="text-sm font-medium text-gray-800 text-right">{paidAmount}</Text>
                      </View>
                      <View className="p-3 w-[20%]">
                        <Text className="text-sm font-medium text-gray-800 text-right">{balance}</Text>
                      </View>
                    </View>
                    {i.map((item: any, itemIndex: number) => (
                      <View key={itemIndex} className={`flex flex-row w-full border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === patients.length - 1 ? "rounded-b-lg" : ""}`}>
                        <View className="w-[40%] p-3">
                          <View className="flex flex-row items-center gap-3">
                            <Text className="text-sm text-gray-900 font-medium">{item.Description}</Text>
                          </View>
                        </View>
                        <View className="p-3 w-[23%]">
                          <Text className="text-sm text-gray-900 text-right">{item.TaxableAmount}</Text>
                        </View>
                        <View className="p-3 w-[17%]">
                          <Text className="text-sm text-gray-900 font-medium text-right">-</Text>
                        </View>                        
                        <View className="p-3 w-[20%]">
                          <Text className="text-sm text-gray-900 font-medium text-right">-</Text>
                        </View>
                      </View>
                    ))}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    );
}

export const Cases = ({ handleClose }: any) => {

    const [active, setActive] = useState(null);
    const [fromDate, setFromDate] = useState(new Date());
    const [fromDateActive, setFromDateActive] = useState(false);
    const [toDate, setToDate] = useState(new Date(fromDate));
    const [toDateActive, setToDateActive] = useState(false);
    let range = { Day: 1, Week: 7, Month: 30 }
    const [duration, setDuration] = useState('Day');
    const [firstClick, setFirstClick] = useState(false);
    const user = useSelector((i: RootState) => i.user);
    const isProvider = user.UserLevelSeq === uType.PROVIDER.level;

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
      setFromDate(a)
      setToDate(new Date(to.setDate(to.getDate() + range[duration])));
    }

    const [durationDropdown, setDurationDropdown] = useState(false);

    const DurationDropdown = () => {
      return (
        <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
          {Object.keys(range).map((i: any, n: number) => (
              <TouchableOpacity key={n} className={`flex-row gap-3 p-4 ${n === (Object.keys(range).length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setDuration(i); setDurationDropdown(false)}}>
                  <MaterialCommunityIcons name={i === duration ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={23} color={myColors.primary[500]} />
                  <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i}</Text>
              </TouchableOpacity>
          ))}
        </View>
      )
    }

    // -------------------------------------------------------------------------------------------------

    const compCode = useSelector((i: RootState) => i.compCode);
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
    const [reportData, isLoading, error] = useFetch(`${BASE_URL}/api/SalesInvoice/GetCommissionManage?EncCompanyId=${compCode}&LocationId=${locationId}&FromDateStr=${fromDate.toLocaleDateString('en-TT')}&ToDateStr=${toDate.toLocaleDateString('en-TT')}&RefType=${'B2C'}&RefDateType=${'COMDATE'}&TransType=${'All'}&Category=${'0'}&PartyID=${'0'}&ProfId=${user.PartyCode}&BillStatus=${'All'}`, compCode);

    let tests = {};

    if (isProvider) {
      tests = groupBy(reportData?.DirectSalesCollection, 'Description');
    } else {
      tests = groupBy(reportData?.DirectSalesCollection, 'ReferenceBy');    // for market by
    }
    const testList = Object.values(tests);

    return (
        <View className='bg-slate-100 flex-1'>       
            <View className='justify-between flex-row p-4 items-center'>
                <Pressable onPress={handleClose} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">View by Cases</Text>
                </Pressable>
            </View>

            <View className='w-full p-4 bg-blue-500'>
              <Text className='text-base text-white mb-4 font-semibold'>Filter By Date</Text>
              <View className='flex-row justify-between items-center flex-wrap gap-y-3'>

                <Pressable onPress={() => {setFirstClick(true); setDurationDropdown(true)}} className='flex-row items-center bg-white p-2 rounded-lg'>
                  <View>
                      <Text className="font-medium text-gray-600 text-[13px] mr-2">{duration}</Text>
                  </View>
                  <Feather name="chevron-down" size={20} color='gray' />
                  <MyModal modalActive={durationDropdown} onClose={() => setDurationDropdown(false)} child={<DurationDropdown />} />
                </Pressable>
                <View className='flex-row items-center gap-1'>
                  <TouchableOpacity onPress={() => handleDate('prev')}>
                    <Feather name="chevron-left" size={23} color='white' />
                  </TouchableOpacity>
                  <View className='flex-row items-center bg-gray-100 p-2 rounded-lg'>
                    <Pressable onPress={() => setFromDateActive(true)}>
                        <Text className="font-medium text-gray-600 text-[13px] leading-5 px-1">{new Date(fromDate).toLocaleDateString('en-TT')}</Text>
                    </Pressable>
                    {fromDateActive ? <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e: any, d: any) => {setFromDateActive(false); setFromDate(d); setFirstClick(true);}} /> : null}
                  </View>
                  <Text className='text-white font-semibold'> To </Text>
                  <View className='flex-row items-center bg-gray-100 p-2 rounded-lg'>
                    <Pressable onPress={() => setToDateActive(true)}>
                        <Text className="font-medium text-gray-600 text-[13px] leading-5 px-1">{new Date(toDate).toLocaleDateString('en-TT')}</Text>
                    </Pressable>
                    {toDateActive ? <DateTimePicker value={toDate} mode="date" display="default" onChange={(e: any, d: any) => {setToDateActive(false); setToDate(d); setFirstClick(true);}} /> : null}
                  </View>
                  <TouchableOpacity onPress={() => handleDate('next')}>
                    <Feather name="chevron-right" size={23} color='white' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView contentContainerClassName='bg-slate-100'> 
              {(() => {
                if (isLoading) {
                  return <GridLoader classes='h-[70px]' count={4} containerClass='gap-3 p-4' />
                } else if (!testList.length) {
                  return <NoContent imgClass='h-[190] mt-24' textClass='text-gray-500 text-xl mt-8'/>
                } else if (error) {
                  alert('Some Error Occured!')
                } else {
                  if (isProvider) {
                    return (
                      <View className={`gap-2 p-4`}>
                        {testList?.map((dept: any, index: Number) => <CaseCard key={index} data={dept} index={index} active={active} setActive={setActive}/>)}
                      </View>
                    )
                  } else {
                    return (
                      <View className='gap-3 p-2'>
                        {testList?.map((dept: any, index: Number) => <ProviderGroupByCases key={index} data={dept} userRefId={user.PartyCode} />)}
                      </View>
                    )
                  }
                }
              })()}
            </ScrollView>
        </View>
    )
}

const ProviderGroupByCases = ({ data, userRefId }: any) => {
  const providerName = data[0].ReferenceBy;
  // const providerRefId = data[0].ReferrerId;
  // const isCurrentUser = providerRefId === userRefId;
  const tests = groupBy(data, 'Description');
  const testList = Object.values(tests);
  const totalIp = sumByKey(testList.flat(), 'TaxableAmount');  
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // useEffect(() => {
  //   if (isCurrentUser) setOpen(true);
  // },[isCurrentUser])

  return (
    <View className={`rounded-3xl ${open ? 'bg-blue-100' : ''}`}>
      {/* {isCurrentUser ? null :  */}
      <TouchableOpacity onPress={() => setOpen(!open)} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
        <View className="flex-row items-start gap-4">
            <View className="bg-cyan-400 rounded-2xl p-3 shadow-md">
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
      {/* } */}
      {open ?
        <View className={`gap-2 px-2 pt-3 pb-4`}>
          {testList?.map((dept: any, index: Number) => <CaseCard key={index} data={dept} index={index} active={active} setActive={setActive}/>)}
        </View> 
      : null}
    </View>
  )
}

const CaseCard = ({ data, classes, index, active, setActive }: any) => {

    // const testName = data[0].Description;
    // const patients = groupBy(data, 'PartyName');
    // const patientsList = Object.values(patients).flat();
    // const patientCount = patientsList.length;
    // const ipAmount = sumByKey(data, 'TaxableAmount');
    // const paidAmount = sumByKey(data, 'Rate');


    const testName = data[0].Description;
    const patients = groupBy(data, 'PartyName');
    const patientsList = Object.values(patients).flat();
    const patientCount = patientsList.length;
    const ipAmount = sumByKey(data, 'TaxableAmount');
    // const paidAmount = sumByKey(data, 'AllocatedAmount');  
    // const balance = sumByKey(patientsList, 'Balance'); 

    return (
      <View className='gap-3'>
        <TouchableOpacity onPress={() => setActive(active === index ? "" : index)} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-sm border p-3 relative ${classes} ${active === index ? 'border-orange-500' : 'border-gray-200'}`}>
          <View className="mr-auto flex-1">
            <Text className="font-PoppinsSemibold text-sky-800 leading-6 text-[13px]">{testName}</Text>
            {/* <Text className="text-gray-600 mt-[6px] text-[11px] font-PoppinsMedium">No. of Patients : {patientCount}</Text> */}
            <View className="flex-row items-end mt-[5px] gap-16">
              <Text className="mt-1.5 text-[12px] text-orange-600 font-PoppinsMedium leading-4">
                Patients : {patientCount}
              </Text>
              <Text className="mt-1.5 text-[12px] text-blue-600 font-PoppinsMedium leading-4">
                IP Amount : {ipAmount}
              </Text>
              {/* <Text className="text-green-600 mt-1.5 text-[12px] font-PoppinsMedium leading-4">
                Paid : {paidAmount}
              </Text> */}
            </View>
          </View>
          {/* <Ionicons name="chevron-down" className={`p-[9px] rounded-full my-auto ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100'}`} size={19} color={active === index ? 'white' : `#2563eb`} /> */}
          <Ionicons name="chevron-down" className={`absolute px-1 top-2 right-2 rounded-md ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100'}`} size={19} color={active === index ? 'white' : `#2563eb`} />
        </TouchableOpacity>

        {active === index && (
          <View className="gap-3">
            <View className="bg-white rounded-lg shadow-sm w-full max-w-2xl">
              <View className="flex flex-row border border-gray-200 bg-orange-50 rounded-t-lg">
                <View className="flex-1 p-3">
                  <Text className="text-sm font-medium text-gray-800">Patients</Text>
                </View>
                <View className="p-3">
                  <Text className="text-sm font-medium text-gray-800 text-right">IP Amount</Text>
                </View>
                {/* <View className="p-3">
                  <Text className="text-sm font-medium text-gray-800 text-right">Paid</Text>
                </View> */}
              </View>

              {patientsList.map((patient: any, index) => (
                <View key={index} className={`flex flex-row border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === patients.length - 1 ? "rounded-b-lg" : ""}`}>
                  <View className="flex-1 p-3">
                    <View className="flex flex-row items-center gap-3">
                      <Text className="text-sm text-gray-900 font-medium">{patient.PartyName}</Text>
                    </View>
                  </View>
                  <View className="p-3">
                    <Text className="text-sm text-gray-900 text-right">{patient.TaxableAmount}</Text>
                  </View>
                  {/* <View className="p-3">
                    <Text className="text-sm text-gray-900 font-medium text-right">{patient.Rate}</Text>
                  </View> */}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
}
