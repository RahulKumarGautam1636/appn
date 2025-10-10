import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BASE_URL, myColors } from '@/src/constants';
import { setModal } from '@/src/store/slices/slices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Link } from 'expo-router';
import { getFrom, GridLoader, NoContent, num, uType } from '@/src/components/utils';
import ButtonPrimary, { MyModal } from '@/src/components';
import { useEffect, useState } from 'react';
import colors from 'tailwindcss/colors';
import InvoicePreview from './bill';
import LabReport from '@/src/sreens/labReport';


const TestDetail = ({ data }: any) => {

    const members = useSelector((i: RootState) => i.members.membersList);
    const userLevel = useSelector((i : RootState) => i.user.UserLevelSeq);

    const user = members.find(i => i.MemberName === data.PartyName);

    // const data = { IsAppConfirmed: 'Y', BillId: '46546', PrescriptionId:  '4547745', DeptName: '', TranNo: '', Status: '', NextAppTime: '09:30 AM', NextAppDate: '02/03/2025', CompanyName: 'XYZ Hospitality Solutions' }

    const dispatch = useDispatch();
    const { list: companyList, selected: selectedCompany } = useSelector((state: RootState) => state.companies);
    const [showDetails, setShowDetails] = useState(false);
    const [bill, setBill] = useState(false);
    const [report, setReport] = useState(false)

    return (
        <>
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className='bg-white'>
                <View className='justify-between flex-row p-4 items-center'>
                    <Pressable onPress={() => dispatch(setModal({name: 'TEST_DETAIL', state: false}))} className='flex-row items-center gap-3'>
                        <Ionicons name="arrow-back-outline" size={24} color="black" />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Appointment Details</Text>
                    </Pressable>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <Feather name="heart" size={20} color='black' />
                        <Feather name="share-2" size={20} color='black' />
                    </View>
                </View>
                <View className='flex-row gap-4 p-[13px] items-center mb-2 border-t border-gray-200'>
                    <Image className='shadow-md shadow-gray-300 rounded-full me-3' source={require('../../assets/images/user.png')} style={{ width: 80, height: 80 }} />
                    <View>
                        <Text className="font-PoppinsSemibold text-slate-800 text-[15px] mb-2">{user ? user?.MemberName : data.PartyName}</Text>
                        {user ? <>
                            <View className='flex-row gap-3'>
                                <FontAwesome name="clock-o" size={16} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{user?.Age} Year,   {user?.GenderDesc}</Text>
                            </View>
                            <View className='flex-row gap-3'>
                                <Ionicons name="medical" size={16} color="#075985" />
                                <Text className="font-PoppinsMedium text-gray-600 text-[12px] mb-[6px]">{userLevel === uType.MARKETBY.level ? 'PATIENT' : user?.RelationShipWithHolder}</Text>
                            </View>
                        </> : null}
                        {/* <View className='flex-row gap-2'>
                            <FontAwesome5 name="stethoscope" size={15} color="#075985" />
                            <Text className="font-PoppinsMedium text-gray-800 text-[12px]">{user.Qualification}</Text>
                        </View> */}
                    </View>
                </View>
                {/* <View className='flex-row justify-between border-y border-gray-300 border-solid'>
                    <View className='items-center flex-1 border-r border-gray-300 p-4'>
                        <Text className="font-PoppinsBold text-sky-600 text-[18px] mb-0">7</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Lab Tests</Text>
                    </View>
                    <View className='items-center flex-1 p-4'>
                        <Text className="font-PoppinsBold text-sky-600 text-[18px] mb-0">15</Text>
                        <Text className="font-PoppinsMedium text-gray-500 text-[12px]">Appointments</Text>
                    </View>
                </View> */}
            </View>
            {/* <View className='justify-between flex-row px-4 pt-4 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Time & Date</Text>
                </View>
            </View> */}
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
                <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Appoitment Date</Text>
                    </View>
                    <View className="gap-3 flex-row items-center ml-auto">
                        <FontAwesome name="pencil" size={18} color="#6b7280" />
                    </View>
                </View>

                <View className='flex-row gap-3 p-4'>
                {/* <FontAwesome5 name="clock" size={17} color={myColors.primary[500]} /> */}
                <FontAwesome5 name="calendar-alt" size={17} color={myColors.primary[500]} />
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">{new Date(data.NextAppDate).toLocaleDateString('en-TT')}</Text>
                <Text className="font-PoppinsSemibold text-slate-500 text-[14px]">{new Date(data.NextAppDate).toDateString()}</Text>
                </View>
            </View>
            <View className='justify-between flex-row px-4 pb-4 mt-1 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Other Details</Text>
                </View>
            </View>
            <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
                {/* <View className='justify-between flex-row p-4 items-center border-b border-gray-300'>
                    <View className='flex-row items-center gap-3'>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Reference No.</Text>
                    </View>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] ml-auto leading-5">{data.TranNo}</Text>
                </View> */}
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Department</Text>
                    <Text className="font-PoppinsSemibold text-[14px] text-slate-600">{data.DeptName}</Text>
                </View>
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">MRD No.</Text>
                    <Text className="font-PoppinsSemibold text-[14px] text-slate-600">{data.UHID}</Text>
                </View>
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Reference No.</Text>
                    <Text className="font-PoppinsSemibold text-[14px] text-slate-600">{data.TranNo}</Text>
                </View>
                <View className='flex-row gap-3 p-4 border-b border-gray-300'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Status</Text>
                    <FontAwesome name="check" size={17} color={data.IsAppConfirmed === 'Y' ? '#00ad44' : '#009efb'} />
                    <Text className="font-PoppinsSemibold text-[14px]" style={{color: data.IsAppConfirmed === 'Y' ? '#00ad44' : '#009efb'}}>{ data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Booked' }</Text>
                </View>
                <View className='flex-row gap-3 p-4'>
                    <Text className="font-PoppinsSemibold text-slate-500 text-[14px] mr-auto">Service Status</Text>
                    <FontAwesome name="check" size={17} color={data.Status === 'Y' ? '#00ad44' : '#f29101'} />
                    <Text className="font-PoppinsSemibold text-[14px]" style={{color: data.Status === 'Y' ? '#00ad44' : '#f29101'}}>{ data.Status === 'Y' ? 'Done' : 'Pending' }</Text>
                </View>
            </View>
            <View className='justify-between flex-row px-4 pt-5 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Clinic Details</Text>
                </View>
            </View>
            <View className='bg-primary-500 mb-[1.15rem] rounded-3xl shadow-md shadow-primary-700 overflow-hidden m-4'>
                <View className='flex-row items-center gap-4 pl-5 pr-4 pb-5 pt-4 bg-primary-500 '>
                    <View className='flex-1'>
                        <Text className="font-PoppinsSemibold text-[15px] text-white" numberOfLines={1}>{selectedCompany.COMPNAME}</Text>
                        <View className='mt-[10px]'>
                            <View className='flex gap-3 flex-row items-center'>
                                <FontAwesome5 name="clock" size={14} color="#fff" />
                                <Text className="font-PoppinsMedium text-gray-100 text-[11px] leading-5">08:30 AM - 12:00 PM</Text>
                            </View>
                            <View className='flex gap-3 flex-row items-center mt-2'>
                                <FontAwesome5 name="map-marker-alt" size={14} color="#fff" />
                                <Text className="font-Poppins text-gray-100 text-[11px] leading-5" numberOfLines={1}>{selectedCompany.ADDRESS}</Text>
                            </View>
                        </View>
                    </View>
                    <Link href={`/appn/clinic/${selectedCompany.CompanyId}`}>
                        <View>
                            <Feather name="chevron-right" size={24} color="#fff" className='px-[9px] py-[9px] bg-primary-400 rounded-full'  />
                        </View>
                    </Link>
                </View>
            </View>
            <View className='justify-between flex-row px-4 mt-1 items-center'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Payment Details</Text>
                </View>
            </View>
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
            <View className='justify-between flex-row p-4 pl-5 items-center border-b border-gray-300'>
                <View className='flex-row items-center gap-3'>
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Bill Details</Text>
                </View>
            </View>

            <View className='gap-3 px-5 py-4'>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Booking Fee</Text>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 200</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Platform Fee</Text>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">₹ 10</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Total Amount</Text>
                    <Text className="font-PoppinsSemibold text-blue-600 text-[13px]">₹ 210</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsMedium text-gray-500 text-[13px]">Payment Status</Text>
                    <Text className="font-PoppinsSemibold text-green-600 text-[13px]">
                        <FontAwesome name="check" size={17} color="#16a34a" />  Paid
                    </Text>
                </View>
                {/* <View className="flex-row justify-between items-center">
                    <Text className="font-PoppinsSemibold text-gray-500 text-[12px]">Payment Method</Text>
                    <Text className="font-PoppinsSemibold text-slate-700 text-[13px]">ONLINE / UPI</Text>
                </View> */}
            </View>
            <View className='justify-between flex-row p-4 items-center border-t border-gray-300'>
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px]">Payment Method</Text>
                <Text className="font-PoppinsSemibold text-purple-600 text-[14px]">ONLINE / UPI</Text>
            </View>
            </View>
            {/* <View className='flex-row gap-2 p-4 bg-white'>
                <ButtonPrimary title='Reschedule' active={false} onPress={() => {}} classes='flex-1 py-3' textClasses='text-gray-800' />
                <ButtonPrimary title='Cancel' active={true} onPress={() => {}} classes='flex-1 py-3' />
            </View> */}
            <View className='flex-row justify-between border-y border-gray-300 border-solid p-4 bg-white gap-2'>
                <TouchableOpacity onPress={() => setBill(true)} className={`items-center flex-1 py-3 rounded-lg ${!data.BillId ? 'bg-slate-200 pointer-events-none' : 'bg-green-500'}`}>
                    <Text className={`font-PoppinsMedium ${!data.BillId ? 'text-gray-500' : 'text-white'}`}>Bill</Text>                        
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDetails(true)} className={`items-center flex-1 py-3 rounded-lg bg-blue-500`}>
                    <Text className={`font-PoppinsMedium text-white`}>Details</Text>
                </TouchableOpacity>
                {data.IsAppConfirmed !== 'Y' ? <TouchableOpacity className={`items-center flex-1 py-3 rounded-lg bg-red-500`}>
                    <Text className={`font-PoppinsMedium text-white`}>Cancel</Text>
                </TouchableOpacity> : null}
                {data.BillId ? <TouchableOpacity onPress={() => setReport(true)} className={`items-center flex-1 py-3 rounded-lg bg-purple-500`}>
                    <Text className={`font-PoppinsMedium text-white`}>Report</Text>
                </TouchableOpacity> : null}
            </View>
        </ScrollView>
        <MyModal modalActive={showDetails} name='TEST_DETAILS' onClose={() => setShowDetails(false)} child={<TestItemDetails RefId={data.RefId} handleClose={setShowDetails} />} />
        <MyModal modalActive={bill} onClose={() => setBill(false)}  name='BILL' child={<InvoicePreview id={data.BillId} type={'INVESTIGATION'} />} />
        <MyModal modalActive={report} onClose={() => setReport(false)}  name='REPORT' child={<LabReport id={data.BillId} type={'INVESTIGATION'} />} />
        </>
    )
}

export default TestDetail;


const TestItemDetails = ({ handleClose, RefId }: any) => {

    const data = [
        { Description: 'Included Tests One', Amount: 4545, BillQty: 3 },
        { Description: 'Included Tests One', Amount: 2343, BillQty: 3 },
        { Description: 'Included Tests One', Amount: 5454, BillQty: 3 },
        { Description: 'Included Tests One', Amount: 2553, BillQty: 3 }
    ]

    const compCode = useSelector((i: RootState) => i.compCode);
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
    const [tests, setTests] = useState({loading: true, data: {enqObj: []}, err: {status: false, msg: ''}});
  
    const getLabData = async (query: any, companyId: any, locId: any) => {
        const res = await getFrom(`${BASE_URL}/api/Appointment/Get?EnqId=${query}&CID=${companyId}&LOCID=${locId}`, {}, setTests);
        if (res) {
            setTimeout(() => {
              setTests(res);            
            }, 400)
        }
    }

    useEffect(() => {
      getLabData(RefId, compCode, locationId);
    },[RefId, compCode, locationId])

    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full p-4'>
            <View className='justify-between flex-row pt-4 pb-6 items-center'>
                <Pressable onPress={() => handleClose(false)} className='flex-row items-center gap-3'>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Included Tests</Text>
                </Pressable>
            </View>
            {(() => {
                if (tests.loading) {
                    return <GridLoader />
                } else if (!tests.data.enqObj?.EnquiryDetailsList?.length) {
                    return <NoContent imgClass='h-[200] mt-[8rem]' label='No Tests Found.' />
                } else {
                    return (
                        <View className='gap-4 mb-4'>
                            {tests.data.enqObj?.EnquiryDetailsList?.map((i: any, n: number) => <OrderItemCard key={n} data={i} />)}
                        </View>
                    )
                }
            })()}
            <View className="flex-row mt-auto">
                <ButtonPrimary title='CLOSE' onClick={() => handleClose(false)} active={true} classes='flex-1 !rounded-3xl !h-[50px] !bg-gray-700' />
            </View>
        </ScrollView>
    )
}


export const OrderItemCard = ({ data }: any) => {
  return (
    <View key={data.LocationItemId} className="flex-row items-center bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200">
      <View className="flex-1">
          <View className='justify-between flex-row mb-3'>
              <Text className="text-lg font-medium text-sky-600 flex-1">{data.ItemDesc}</Text>
              <TouchableOpacity className="">
                  <Ionicons name="trash-outline" size={20} color={colors.rose[500]} />
              </TouchableOpacity>
          </View>
        
        <View className="flex-row items-center mb-3">
          {/* <ColorIndicator color={data.color} /> */}
          <Text className="text-base text-gray-600 mr-3">Qty : {data.BillQty}</Text>
          {/* {data.size && (
            <> */}
              <View className="w-1 h-1 bg-gray-400 rounded-full mr-3" />
              <Text className="text-base text-gray-600">Date : {new Date(data.TranDate).toLocaleDateString('en-TT')}</Text>
            {/* </>
          )} */}
        </View>
        
        <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-600">₹ {(data.BillQty * data.Rate).toFixed(2)}</Text>
            
            <View className='flex-row items-center'>
                <Text className="mx-2 text-base text-black">Status :</Text>
                <View className={`flex-row items-center bg-gray-100 rounded-2xl py-1 px-2 ${data.Status === 'Y' ? 'bg-green-600' : 'bg-sky-500'}`}>
                    <Text className={`mx-2 text-base font-medium text-white`}>{ data.Status === 'Y' ? 'Done' : 'Pending' }</Text>
                </View>
            </View>
        </View>
      </View>
    </View>
  )
}