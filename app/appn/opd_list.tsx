// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import Feather from '@expo/vector-icons/Feather';
// import { Link, useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { Card_3, CompCard, MyModal } from '../../src/components';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/src/store/store';
// import { BASE_URL, defaultId, myColors } from '@/src/constants';
// import { getFrom, ListLoader, NoContent } from '../../src/components/utils';
// import { setModal } from '@/src/store/slices/slices';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';


// const AppnList = ({ memberId }: any) => {

//     const router = useRouter();
//     const user = useSelector((i: RootState) => i.user);
//     const compCode = useSelector((i: RootState) => i.compCode);
//     const [active, setActive] = useState('ENQ');
//     const { selected, list } = useSelector((i: RootState) => i.companies);
//     const [appData, setAppnData] = useState({loading: false, data: {PartyFollowupList: []}, err: {status: false, msg: ''}}); 
//     const [report, setReport] = useState('');
//     const dispatch = useDispatch();

//     // NEW WORK
//     const [fromDate, setFromDate] = useState(new Date());
//     const [fromDateActive, setFromDateActive] = useState(false);
//     const [toDate, setToDate] = useState(new Date(fromDate));
//     const [toDateActive, setToDateActive] = useState(false);
//     let range = { Day: 1, Week: 7, Month: 30 }
//     const [duration, setDuration] = useState('Day');
//     const [firstClick, setFirstClick] = useState(false);


//     const [selectedDepartment, setSelectedDepartment] = useState({});
//     const [stages, setStages] = useState([]);
//     const [selectedStage, setSelectedStage] = useState({});
//     const [appointments, setAppointments] = useState({ loading: false, data: { PartyMasterList: [] }, err: { status: false, msg: "" } });
//     const [forceRerender, setForceRerender] = useState(false);
//     const [durationDropdown, setDurationDropdown] = useState(false);


//     // const makeForcedRerender = async () => {
//     //     setForceRerender(true);
//     //     setTimeout(() => {
//     //     setForceRerender(false);
//     //     }, 1000);
//     // }

//      useEffect(() => {
//         if (!selected.EncCompanyId) return;
//         let controller = new AbortController();
//         getDepartments(controller.signal, user, selected);
//         return () => controller.abort();
//     }, [user.UserId, selected.EncCompanyId]);

//     const getDepartments = async (signal, user, company) => {
//         if (user.UserId > 1) {
//             const res = await axios.get(`${BASE_URL}/api/DashBoard/Get?UserId=${user.UserId}&CID=${company.CompanyId}&Location=${company.LocationId}&RoleId=${user.UserRoleLevelCode}&dtfrStr=01/03/2026&dttoStr=05/03/2026`);
//             if (res) {
//                 let onlyOPD = res.data.PatientRegList.find((i: any) => i.DeptCategory === 'OPD');
//                 if (!onlyOPD) {
//                     alert('Something went wrong.')
//                     return;
//                 }
//                 setStages(onlyOPD.LinkStageList)
//                 setSelectedStage(onlyOPD.LinkStageList[0])
//                 setSelectedDepartment(onlyOPD)
//             }
//         }
//     };

//     useEffect(() => {
//         if (!selectedDepartment.DeptCategory) return;
//         let controller = new AbortController();
//         getAppointments(selectedDepartment, user.UserId, selected, fromDate, toDate, controller.signal);
//         return () => controller.abort();
//     }, [user.UserId, selected.CompanyId, selectedDepartment.DeptCategory, fromDate, toDate]);

//     const getAppointments = async (dept, userId, company, from, to, signal) => {
//         console.log(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${dept.DeptCategory}&ProcedureId=${dept.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date(from).toLocaleDateString('en-TT')}&ToDateStr=${new Date(to).toLocaleDateString('en-TT')}&UserId=${userId}&RootId=0&LevelNo=0&SearchString=${''}&ReportType=${'CURRENTSTATUS'}&SrcUserId=0`);    
//         if (user.UserId > 1) {
//         const res = await getFrom(`${BASE_URL}/api/Appointment/GetFollowUpDetails?Category=${dept.DeptCategory}&ProcedureId=${dept.DeptId}&CID=${company.CompanyId}&LOCID=${company.LocationId}&FromDateStr=${new Date(from).toLocaleDateString('en-TT')}&ToDateStr=${new Date(to).toLocaleDateString('en-TT')}&UserId=${userId}&RootId=0&LevelNo=0&SearchString=${''}&ReportType=${'CURRENTSTATUS'}&SrcUserId=0`, {}, setAppointments, signal);
//         if (res) {  
//             let deptStages = selectedDepartment?.LinkStageList;
//             let arr: any = []
//             deptStages.forEach((item: any) => {
//                 const stageItems = res.data.PartyMasterList?.filter((i: any) => i.OpportunityId === item.AutoId);
//                 arr.push({ ...item, OpportunityCnt: stageItems.length });
//             });
//             setStages(arr); 
//             setSelectedStage(arr[0])
//             setAppointments(res);
//         }
//         }
//     };

//     let stageItems = appointments.data.PartyMasterList.filter(((i: any) => i.OpportunityId === selectedStage.AutoId));

//     const renderAppointments = (data: any) => {

//         if (data.loading) {
//             return <ListLoader classes='h-[120px]'/>
//         } else if (data.err.status) {
//             return;
//         } else if (!stageItems.length) {
//             return <NoContent imgClass='h-[200] mt-5' label='No Appointments Found'/>
//         } else {
//             return stageItems.map((item: any) => <Card_3 data={item} key={item.AutoId} />)
//         }
//     }

//     const handleDate = (type) => {
//       let from = fromDate;
//       let to2 = toDate;
//       let preDate = from // mmDDyyyyDate(from, '/', '/');
//       let d = new Date(preDate);
//       let a;

//       if (firstClick) {
//         if (type === 'next') {
//           let to = new Date(from);
//           setToDate(new Date(to.setDate(to.getDate() + range[duration])));
//         } else {
//           let to = new Date(to2);
//           setFromDate(new Date(to.setDate(to.getDate() - range[duration])));
//         }
//         setFirstClick(false);
//         return;
//       }

//       if (type === 'next') {
//         a = new Date(d.setDate(d.getDate() + range[duration]));  
//       } else {
//         a = new Date(d.setDate(d.getDate() - range[duration]));
//       }

//       let to = new Date(a);

//       if (range[duration] === 1) {
//         setFromDate(a);
//         setToDate(a);
//         return;
//       }

//       setFromDate(a)
//       setToDate(new Date(to.setDate(to.getDate() + range[duration])));
//     }

//     const DurationDropdown = () => {
//       return (
//         <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
//           {Object.keys(range).map((i: any, n: number) => (
//               <TouchableOpacity key={i} className={`flex-row gap-3 p-4 ${n === (Object.keys(range).length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setDuration(i); setDurationDropdown(false)}}>
//                   <MaterialCommunityIcons name={i === duration ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={23} color={myColors.primary[500]} />
//                   <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i}</Text>
//               </TouchableOpacity>
//           ))}
//         </View>
//       )
//     }

//     return (
//         <>
//           {memberId ? null : <View className='justify-between flex-row p-4 items-center bg-slate-100'>
//               <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
//                   <Ionicons name="arrow-back-outline" size={24} color="black" />
//                   <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Appointments</Text>
//               </Pressable>
//               <View className="gap-3 flex-row items-center ml-auto">
//                   <Feather name="heart" size={20} color='black' />
//                   <Feather name="share-2" size={20} color='black' />
//               </View>
//           </View>}
//           <ScrollView contentContainerClassName='bg-slate-100'>                
//             {compCode === defaultId ? <>
//               <View className='px-4'>
//                   {/* {memberId ? null : <View className=''>
//                       <View className='bg-primary-500 mb-4 rounded-2xl shadow-sm shadow-gray-400'>
//                           <View className='justify-between flex-row p-[13px] items-center border-b border-primary-300'>
//                               <View className='flex-row items-center gap-3'>
//                                   <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">Appointments</Text>
//                               </View>
//                               <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">{appData.data.PartyFollowupList.length} Items</Text>
//                           </View>

//                           <View className='flex-row gap-3 p-[13px]'>
//                               <Text className="font-PoppinsSemibold text-white text-[13px] mr-auto">Next Appointment</Text>
//                               <FontAwesome5 name="calendar-alt" size={17} color={`#fff`} />
//                               <Text className="font-PoppinsSemibold text-white text-[13px]">Not Found</Text>
//                           </View>
//                       </View> 
//                   </View>} */}
//                   {list.length > 1 ? <View>
//                       <View className='justify-between flex-row pt-1 items-center'>
//                           <View className='flex-row items-center gap-2'>
//                               <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-4">Select Clinic</Text>
//                           </View>
//                           <View className="gap-2 flex-row items-center ml-auto">
//                               {/* <Feather name="chevron-left" size={24} color='#6b7280' />
//                               <Feather name="chevron-right" size={24} color='#6b7280' /> */}
//                               <Pressable onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))}>
//                                   <Text className="font-PoppinsMedium text-primary-600 text-[13px] leading-[20px]">View All</Text>
//                               </Pressable>
//                           </View>
//                       </View>
//                       <ScrollView horizontal={true} contentContainerClassName='py-2 px-[2] gap-3 mb-2' showsHorizontalScrollIndicator={false}>
//                           {list.map((i: any) => <CompCard data={i} key={i.EncCompanyId} active={selected?.EncCompanyId === i.EncCompanyId}/>)}
//                       </ScrollView>
//                   </View> : null}
//               </View>
//             </> : null}

//             <View className='w-full p-4 bg-blue-500'>
//               <Text className='text-base text-white mb-4 font-semibold'>Filter By Date</Text>
//               <View className='flex-row justify-between items-center flex-wrap gap-y-3'>

//                 <Pressable onPress={() => {setFirstClick(true); setDurationDropdown(true)}} className='flex-row items-center bg-white p-2 rounded-lg'>
//                   <View>
//                       <Text className="font-medium text-gray-600 text-[13px] mr-2">{duration}</Text>
//                   </View>
//                   <Feather name="chevron-down" size={20} color='gray' />
//                   <MyModal modalActive={durationDropdown} onClose={() => setDurationDropdown(false)} child={<DurationDropdown />} />
//                 </Pressable>
//                 <View className='flex-row items-center gap-1 ml-auto'>
//                   <TouchableOpacity onPress={() => handleDate('prev')}>
//                     <Feather name="chevron-left" size={23} color='white' />
//                   </TouchableOpacity>
//                   <View className='flex-row items-center bg-gray-100 p-2 rounded-lg'>
//                     <Pressable onPress={() => setFromDateActive(true)}>
//                         <Text className="font-medium text-gray-600 text-[13px] leading-5 px-1">{new Date(fromDate).toLocaleDateString('en-TT')}</Text>
//                     </Pressable>
//                     {fromDateActive ? <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e: any, d: any) => {setFromDateActive(false); setFromDate(d); setFirstClick(true);}} /> : null}
//                   </View>
//                   <Text className='text-white font-semibold'> To </Text>
//                   <View className='flex-row items-center bg-gray-100 p-2 rounded-lg'>
//                     <Pressable onPress={() => setToDateActive(true)}>
//                         <Text className="font-medium text-gray-600 text-[13px] leading-5 px-1">{new Date(toDate).toLocaleDateString('en-TT')}</Text>
//                     </Pressable>
//                     {toDateActive ? <DateTimePicker value={toDate} mode="date" display="default" onChange={(e: any, d: any) => {setToDateActive(false); setToDate(d); setFirstClick(true);}} /> : null}
//                   </View>
//                   <TouchableOpacity onPress={() => handleDate('next')}>
//                     <Feather name="chevron-right" size={23} color='white' />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//             <View className='bg-white'>
//                 {/* <View className='flex-row justify-between border-y border-gray-200 border-solid p-4 bg-white gap-3'>
//                     <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'PENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('PENQ')}>
//                         <Text className={`font-PoppinsMedium text-[13px] ${active === 'PENQ' ? 'text-white' : ''}`}>Previous</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'ENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('ENQ')}>
//                         <Text className={`font-PoppinsMedium text-[13px] ${active === 'ENQ' ? 'text-white' : ''}`}>Today</Text>                        
//                     </TouchableOpacity>
//                     <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'UENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('UENQ')}>
//                         <Text className={`font-PoppinsMedium text-[13px] ${active === 'UENQ' ? 'text-white' : ''}`}>Upcoming</Text>
//                     </TouchableOpacity>
//                 </View> */}
//                 <ScrollView horizontal contentContainerClassName='border-y border-gray-200 border-solid p-4 bg-white gap-2'>
//                     {stages.map((i => (
//                         <TouchableOpacity key={i.AutoId} className={`items-center py-[10px] flex-row px-2 rounded-lg gap-2 ${i.AutoId === selectedStage.AutoId ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setSelectedStage(i)}>
//                             <Text className={`font-medium text-[13px] whitespace-nowrap ${i.AutoId === selectedStage.AutoId ? 'text-white' : ''}`}>{i.LinkDescription}</Text>
//                             {i.OpportunityCnt ? <View className="px-2 py-1 rounded-full bg-orange-500"><Text className='text-xs text-white'>{i.OpportunityCnt}</Text></View> : null}                        
//                         </TouchableOpacity>
//                     )))}
//                 </ScrollView>
//             </View>
//             <View className='p-3 gap-4'>
//                 {/* {renderAppnData(appData)} */}
//                 {renderAppointments(appointments)}
//             </View>
//           </ScrollView>
//         </>
//     )
// }

// export default AppnList;




// OLD DASHBOARD ========================================================================================

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CompCard } from '../../src/components';
import { Card_3 } from '@/src/components/cards';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, defaultId } from '@/src/constants';
import { getFrom, ListLoader, NoContent } from '../../src/components/utils';
import { setModal } from '@/src/store/slices/slices';
import { ChevronDown, Stethoscope, Users } from 'lucide-react-native';


const AppnList = ({ memberId }: any) => {

    const router = useRouter();
    const user = useSelector((i: RootState) => i.user);
    const compCode = useSelector((i: RootState) => i.compCode);
    const [active, setActive] = useState('ENQ');
    const { selected, list } = useSelector((i: RootState) => i.companies);
    const [appData, setAppnData] = useState({loading: false, data: {PartyFollowupList: []}, err: {status: false, msg: ''}}); 
    const [report, setReport] = useState('');

    useEffect(() => {
        const getAppnData = async (query: string, userId: string, companyId: string) => {
            if (user.UserId > 1) {
              const res = await getFrom(`${BASE_URL}/api/Appointment/Get?id=${userId}&CID=${companyId}&Type=${query}&CatType=OPD&MemberId=${memberId || '0'}`, {}, setAppnData);
              if (res) {
                setTimeout(() => {
                  setAppnData(res);            
                }, 400)
              }
            }
        }
        getAppnData(active, user.UserId, selected.EncCompanyId);
    }, [active, user.UserId, selected.EncCompanyId])

    const renderAppnData = (data: any) => {

        if (data.loading) {
            return <ListLoader classes='h-[120px]'/>
        } else if (data.err.status) {
            return;
        } else if (data.data.PartyFollowupList.length === 0) {
            return <NoContent imgClass='h-[200] mt-5' label='No Appointments Found'/>
        } else {
            return data.data.PartyFollowupList.map((item: any) => <Card_3 data={item} key={item.AutoId} />)
        }
    }

    const dispatch = useDispatch();
    // const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);

    return (
        <>
          {memberId ? null : <View className='justify-between flex-row p-4 items-center bg-slate-100'>
              <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
                  <Ionicons name="arrow-back-outline" size={24} color="black" />
                  <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Your Appointments</Text>
              </Pressable>
              <View className="gap-3 flex-row items-center ml-auto">
                  <Feather name="heart" size={20} color='black' />
                  <Feather name="share-2" size={20} color='black' />
              </View>
          </View>}
          <ScrollView contentContainerClassName='bg-slate-100'>                
            {compCode === defaultId ? <>
              <View className='px-4'>
                  {/* {memberId ? null : <View className=''>
                      <View className='bg-primary-500 mb-4 rounded-2xl shadow-sm shadow-gray-400'>
                          <View className='justify-between flex-row p-[13px] items-center border-b border-primary-300'>
                              <View className='flex-row items-center gap-3'>
                                  <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">Appointments</Text>
                              </View>
                              <Text className="font-PoppinsSemibold text-white text-[13px] items-center leading-5">{appData.data.PartyFollowupList.length} Items</Text>
                          </View>

                          <View className='flex-row gap-3 p-[13px]'>
                              <Text className="font-PoppinsSemibold text-white text-[13px] mr-auto">Next Appointment</Text>
                              <FontAwesome5 name="calendar-alt" size={17} color={`#fff`} />
                              <Text className="font-PoppinsSemibold text-white text-[13px]">Not Found</Text>
                          </View>
                      </View> 
                  </View>} */}
                  {list.length > 1 ? <View>
                      <View className='justify-between flex-row pt-1 items-center'>
                          <View className='flex-row items-center gap-2'>
                              <Text className="font-PoppinsSemibold text-gray-700 text-[13px] items-center leading-4">Select Clinic</Text>
                          </View>
                          <View className="gap-2 flex-row items-center ml-auto">
                              {/* <Feather name="chevron-left" size={24} color='#6b7280' />
                              <Feather name="chevron-right" size={24} color='#6b7280' /> */}
                              <Pressable onPress={() => dispatch(setModal({name: 'COMPANIES', state: true}))}>
                                  <Text className="font-PoppinsMedium text-primary-600 text-[13px] leading-[20px]">View All</Text>
                              </Pressable>
                          </View>
                      </View>
                      <ScrollView horizontal={true} contentContainerClassName='py-2 px-[2] gap-3 mb-2' showsHorizontalScrollIndicator={false}>
                          {list.map((i: any) => <CompCard data={i} key={i.EncCompanyId} active={selected?.EncCompanyId === i.EncCompanyId}/>)}
                      </ScrollView>
                  </View> : null}
              </View>
            </> : null}
            <View className='bg-white'>
                <View className='flex-row justify-between border-y border-gray-200 border-solid p-4 bg-white gap-3'>
                    <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'PENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('PENQ')}>
                        <Text className={`font-PoppinsMedium text-[13px] ${active === 'PENQ' ? 'text-white' : ''}`}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'ENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('ENQ')}>
                        <Text className={`font-PoppinsMedium text-[13px] ${active === 'ENQ' ? 'text-white' : ''}`}>Today</Text>                        
                    </TouchableOpacity>
                    <TouchableOpacity className={`items-center flex-1 py-[10px] rounded-lg ${active === 'UENQ' ? 'bg-primary-500' : 'bg-slate-200'}`} onPress={() => setActive('UENQ')}>
                        <Text className={`font-PoppinsMedium text-[13px] ${active === 'UENQ' ? 'text-white' : ''}`}>Upcoming</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className='p-3 gap-4'>
                {renderAppnData(appData)}
            </View>
          </ScrollView>
        </>
    )
}

export default AppnList;


