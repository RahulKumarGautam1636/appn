import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card_3, Card_4, CompCard, MyModal } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, BC_ROY, defaultId, hasAccess, myColors } from '@/src/constants';
import { getFrom, ListLoader, NoContent } from '@/src/components/utils';
import { setModal } from '@/src/store/slices/slices';
import { CalendarDays, ChevronRight, FlaskConical, Stethoscope, Users, ChevronDown } from 'lucide-react-native';


const Reports = ({ memberId }: any) => {

    const router = useRouter();
    // const user = useSelector((i: RootState) => i.user);
    const compCode = useSelector((i: RootState) => i.compCode);
    // const [active, setActive] = useState('ENQ');
    // const { selected, list } = useSelector((i: RootState) => i.companies);
    // const [labData, setLabData] = useState({loading: false, data: {PartyFollowupList: []}, err: {status: false, msg: ''}});
    // const dispatch = useDispatch();
    const [report, setReport] = useState('');
    
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className='justify-between flex-row p-4 items-center'>
                <Pressable onPress={() => router.back()} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">View Reports</Text>
                </Pressable>
            </View>

            <View className='px-4 pt-1'>
              <View className="flex flex-col gap-4 mb-4">
                  <TouchableOpacity onPress={() => setReport(report === 'patients' ? '' : 'patients')} className="bg-white flex-row rounded-3xl p-5 shadow-sm border border-white border-opacity-40 cursor-pointer justify-between items-center">
                      <View className="flex-row items-start gap-5">
                          <View className="bg-cyan-400 rounded-2xl p-3 shadow-md">
                              <Users color="white" size={27} />
                          </View>
                          <View>
                              <Text className="text-gray-500 text-[1rem] font-medium tracking-wider mb-1.5">Number of Patients</Text>
                              <Text className="text-gray-800 text-[1.3rem] font-bold">1408</Text>
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
                              <Text className="text-gray-800 text-[1.3rem] font-bold">690</Text>
                          </View>
                      </View>
                      <ChevronDown color={'#6b7280'} size={27} />
                  </TouchableOpacity>
              </View>
            </View>

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
            <MyModal modalActive={report ? true : false} name='REPORT' child={<Cases handleClose={() => setReport('')} />} />
        </ScrollView>
    )
}

export default Reports;



const Cases = ({ handleClose }: any) => {

    const [active, setActive] = useState('');

    const departments = [
        { name: 'USG', patients: 456, cases: 507, avgAmount: 8998, dbc: 6564, netAmount: 10555, total: 11000 },
        { name: 'Pathology', patients: 236, cases: 507, avgAmount: 1565, dbc: 1005, netAmount: 10555, total: 11000 },
        { name: 'Non-Pathology', patients: 116, cases: 507, avgAmount: 7887, dbc: 5655, netAmount: 10555, total: 11000 },
        { name: 'OPD', patients: 471, cases: 507, avgAmount: 4577, dbc: 455, netAmount: 4000, total: 11000 },
        { name: 'IPD', patients: 450, cases: 507, avgAmount: 3555, dbc: 455, netAmount: 3500, total: 11000 },
        { name: 'OT', patients: 109, cases: 507, avgAmount: 9861, dbc: 455, netAmount: 9200, total: 11000 },
    ];

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>                
            <View className='justify-between flex-row p-4 items-center'>
                <Pressable onPress={handleClose} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">View by Cases</Text>
                </Pressable>
            </View>

            <View className='gap-3 px-4 pb-4'>
                {departments.map((i: any, index: Number) => <NewCard key={i.name} data={i} index={index} active={active} setActive={setActive}/>)}
            </View>
            
        </ScrollView>
    )
}

const patients = [
    { name: 'Asim Munir', patients: 456, cases: 5, avgAmount: 2360, dbc: 1623, netAmount: 10555, total: 11000 },
    { name: 'Ajeet Bharti', patients: 557, cases: 1, avgAmount: 8236, dbc: 4682, netAmount: 10555, total: 11000 },
    { name: 'Abhijit Iyer Mitra', patients: 122, cases: 10, avgAmount: 4236, dbc: 2642, netAmount: 10555, total: 11000 },
    { name: 'Anand Ranganathan', patients: 89, cases: 7, avgAmount: 8777, dbc: 5787, netAmount: 10555, total: 11000 },
]; 



const NewCard = ({ data, classes, index, active, setActive }: any) => {

    return (
      <>
        <TouchableOpacity onPress={() => setActive(active === index ? "" : index)} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-3 ${classes}`}>
          <View className="mr-auto flex-1">
            <Text className="font-PoppinsSemibold text-sky-800 leading-6 text-[13px]">{data.name}</Text>
            <Text className="text-gray-600 mt-[6px] text-[11px] font-PoppinsMedium">No. of Patients : {data.patients}</Text>
            <View className="flex-row gap-6 items-end mt-[5px]">
              <Text className="mt-1.5 text-[12px] text-blue-600 font-PoppinsMedium leading-4">
                IP Amount : <FontAwesome name="rupee" size={12} color="#2563eb" /> {data.cases}
              </Text>
              <Text className="text-green-600 mt-1.5 text-[12px] font-PoppinsMedium leading-4">
                Paid : <FontAwesome name="rupee" size={12} color="#16a34a" /> {data.avgAmount}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" className={`p-[9px] rounded-full my-auto ${active === index ? 'rotate-180 bg-sky-500' : 'bg-sky-100'}`} size={19} color={active === index ? 'white' : `#2563eb`} />
        </TouchableOpacity>

        {active === index && (
          <View className="gap-3">
            <View className="bg-white rounded-lg shadow-sm w-full max-w-2xl">
              <View className="flex flex-row border border-gray-200 bg-orange-50 rounded-t-lg">
                <View className="flex-1 py-4 px-4">
                  <Text className="text-sm font-medium text-gray-800">Patients</Text>
                </View>
                <View className="py-4 px-4">
                  <Text className="text-sm font-medium text-gray-800 text-right">IP Amount</Text>
                </View>
                <View className="py-4 px-4">
                  <Text className="text-sm font-medium text-gray-800 text-right">Paid</Text>
                </View>
              </View>

              {patients.map((patient, index) => (
                <View key={patient.name} className={`flex flex-row border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === patients.length - 1 ? "rounded-b-lg" : ""}`}>
                  <View className="flex-1 py-4 px-4">
                    <View className="flex flex-row items-center gap-3">
                      <Text className="text-sm text-gray-900 font-medium">{patient.name}</Text>
                    </View>
                  </View>
                  <View className="py-4 px-4">
                    <Text className="text-sm text-gray-900 text-right">{patient.avgAmount}</Text>
                  </View>
                  <View className="py-4 px-4">
                    <Text className="text-sm text-gray-900 font-medium text-right">{patient.dbc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* <div className="bg-white rounded-lg shadow-sm w-full">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-orange-50">
                      <th className="text-left py-4 px-6 text-xs font-medium text-gray-800">Patients</th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-800 text-right">IP Amount</th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-800 text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-900 font-medium">{patient.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-900 text-right">{patient.avgAmount}</td>
                        <td className="py-4 px-6 text-xs text-gray-900 font-medium text-right">{patient.dbc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}
          </View>
        )}
      </>
    );
}