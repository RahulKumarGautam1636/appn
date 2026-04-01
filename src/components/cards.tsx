import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons"
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, removeFromCart, setModal } from "../store/slices/slices";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { mmDDyyyyDate, MyModal } from ".";
import colors from "tailwindcss/colors";
import InvoicePreview from "@/app/appn/bill";
import LabReport from "../sreens/labReport";
import { TestItemDetails } from "@/app/appn/testDetail";
import Prescription from "@/app/appn/prescription";

export default function LabCard({ data, testDate, classes }: any) {

    const dispatch = useDispatch();
    // const lab = useSelector((i: RootState) => i.cart)
    // const labTests = Object.values(lab);
    // const isAdded = labTests.find((i: any) => i.LocationItemId === data.LocationItemId);
    const isAdded = useSelector((i: RootState) => Object.values(i.cart).some((x : any) => x.LocationItemId === data.LocationItemId));
    const handleAdd = () => {
        if (isAdded) {
            dispatch(removeFromCart(data.LocationItemId));
        } else {
            dispatch(addToCart({...data, testDate: testDate, type: 'LABTEST'}));
        }
    }   

    return (
        <TouchableOpacity key={data.ItemId} onPress={handleAdd} className={`flex-row items-start gap-4 bg-white rounded-2xl shadow-lg border-b-2 border-gray-300 p-3 ${classes}`}>
            <View className="mt-1 uppercase h-[40px] w-[40px] items-center justify-center rounded-xl bg-fuchsia-600">
                <Ionicons name={'flask'} size={19} color={'#fff'} />
            </View>
            <View className='mr-auto flex-1'>
                <Text className="font-PoppinsSemibold text-sky-800 leading-6 text-[12px]">{data.Description}</Text>
                <Text className="text-gray-500 mt-[4px] text-[11px] font-PoppinsMedium">{data.CategoryName}</Text>
                <View className='flex-row gap-3 items-end mt-[5px]'>
                    <Text className="mt-1.5 text-[12px] text-blue-600 font-PoppinsSemibold leading-4"><FontAwesome name="rupee" size={12} color="#2563eb" /> {data.SRate}</Text>
                    <Text className="text-red-700 opacity-65 mt-1.5 text-[12px] font-PoppinsMedium leading-4 line-through"><FontAwesome name="rupee" size={12} color="#b91c1c" /> {data.ItemMRP}</Text>
                </View>
            </View>
            {/* {isAdded ?
            <Ionicons name="cart" className='p-[9px] bg-sky-100 rounded-full my-auto' size={19} color={colors.sky[500]} /> :
            <Ionicons name="cart-outline" className='p-[9px] bg-sky-50 rounded-full my-auto' size={19} color={colors.sky[500]} />} */}
            
            {isAdded ?
            <View className='px-3 py-[7px] bg-sky-500 rounded-lg my-auto'>
                <Text className="text-white">Remove</Text>
            </View> :
            <View className='px-4 py-[7px] bg-sky-100 rounded-lg my-auto'>
                <Text className="text-sky-500">Add</Text>
            </View>}
            
        </TouchableOpacity>
    )
}

export const LabCartCard = ({ data }: any) => {
    const dispatch = useDispatch()
    // const [date, setDate] = useState({ active: false, value: new Date()});

    // const [day, month, year] = data.testDate.split('/').map(Number);
    // let parsedActiveDate = new Date(year, month - 1, day);
    // let formattedDate = new Date(parsedActiveDate);

    // useEffect(() => {
    //     setDate(pre => ({...pre, value: formattedDate}))
    // }, [])

    return (
        <View className='bg-white rounded-2xl shadow-lg border-b-2 border-gray-300' key={data.ItemId}>
            <View className='p-4'>
                <Text className="font-PoppinsSemibold text-sky-800">{data.Description}</Text>
                <View className='flex-row gap-4 items-end justify-between w-full mt-[6px]'>
                    <View>
                        <Text className="text-gray-500 text-sm font-PoppinsMedium">{data.CategoryName}</Text>
                        <View className='flex-row gap-4 items-center mt-1'>
                            <Text className="mt-2 text-[13px] text-blue-600 font-PoppinsSemibold leading-5"><FontAwesome name="rupee" size={13} color="#2563eb" /> {data.SRate}</Text>
                            <Text className="text-red-700 opacity-65 mt-2 text-sm font-PoppinsSemibold leading-5">X  {data.count}</Text>
                        </View>
                    </View>
                    <View className='flex-row gap-4 items-center'>
                        <View className='px-[10px] py-[6px] bg-gray-100 rounded-full justify-between gap-4 ml-auto flex-row shadow-sm shadow-gray-500'>
                            <TouchableOpacity onPress={() => {if (data.count !== 1) dispatch(addToCart({...data, count: data.count - 1}))}}>
                                <Feather name="minus" size={16} color="#6b7280" />
                            </TouchableOpacity>
                            <Text className='leading-6 font-PoppinsSemibold'>{data.count}</Text>
                            <TouchableOpacity onPress={() => dispatch(addToCart({...data, count: data.count + 1}))}>
                                <Feather name="plus" size={16} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => dispatch(removeFromCart(data.LocationItemId))}>
                            <Feather name="trash-2" size={19} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* <Pressable onPress={() => setDate(pre => ({...pre, active: true}))} className='flex-row w-full p-4 border-t border-gray-200 items-center'>
                <Text className="font-PoppinsMedium text-slate-700 text-[13px] leading-6 mr-auto">Test Date :</Text>
                <Text className="font-PoppinsMedium text-slate-500 text-[13px] leading-6 mr-2">{new Date(date.value).toLocaleDateString('en-TT')}</Text>
                <Feather name="chevron-down" size={22} color='gray' />
                {date.active ? <DateTimePicker value={date.value} mode="date" display="default" onChange={(e, d) => setDate({active: false, value: d})} /> : null}
            </Pressable>  */}
        </View>
    )
}

export const Card_3 = ({ data }: any) => {

  const dispatch = useDispatch();
  const [bill, setBill] = useState(false);
  const [presc, setPresc] = useState(false);

  const isConfirmed = data.Status === "Y";
  const billId = isConfirmed ? data.RefId : data.BillId;

  return (
    <>
      <View>
        <View className="bg-white rounded-xl shadow-md shadow-gray-400">
          <TouchableOpacity onPress={() => dispatch(setModal({name: 'APPN_DETAIL', state: true, data: data}))} className='flex-row gap-1 w-full p-3'>
            <Image className='shadow-md shadow-gray-400 rounded-full me-3' source={require('@/assets/images/doctor.jpg')} style={{ width: 60, height: 60 }} />
            <View className='flex-1'>
              <Text className="font-PoppinsSemibold text-sky-700 text-[13px] mb-2">{data.AppointmentTo}</Text>
              <View className='flex-row justify-between items-between'>
                <View className='flex-row gap-3 mb-[6px]'>
                    <Text className="font-medium text-gray-600 text-[11px]">Patient :  {data.PartyName}</Text>
                </View>
                <View className='flex-row gap-3 mb-[6px]'>
                    <Text className="font-medium text-gray-600 text-[11px]">MRD :  {data.UHID ? data.UHID : 'N/A'}</Text>
                </View>
              </View>
              <View className='flex-row justify-between items-between'>
                <View className='flex-row gap-3'>
                    <Text className="font-medium text-gray-600 text-[11px]">Date :  {new Date(data.NextAppDate).toLocaleDateString('en-TT')}</Text>
                </View>
                <View className='flex-row gap-3'>
                    <Text className="font-medium text-gray-600 text-[11px]">Time :  {data.NextAppTime}</Text>
                </View>
              </View>
              {/* <View className='flex-row px-4 py-2 rounded-full mt-4 bg-sky-400 self-start'>
                  <Text className="font-medium text-[12px] text-white">Clinic Consultation</Text>
              </View> */}


              <View className="flex-row items-center gap-2 mt-2">
                {data.IsCanceled === "Y" ? 
                  <>
                    <Text className={`font-medium text-gray-600 text-[11px]`}>Status : </Text>
                    <Text className={`font-medium text-[11px] text-rose-500`}>Cancelled</Text>
                  </>
                  :
                  <>
                    <Text className={`font-medium text-gray-600 text-[11px]`}>Status : </Text>
                    <Text className={`font-medium text-[11px] ${data.IsAppConfirmed === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Booked'}</Text>
                    <Text className="font-medium text-gray-600 text-[11px] ml-auto">Service : </Text>
                    <Text className={`font-medium text-[11px] ${data.Status === 'Y' ? 'text-green-600' : 'text-yellow-600'}`}>{data.Status === 'Y' ? 'Done' : 'Pending'}</Text>
                  </>}
              </View>


            </View>
            <Feather name="arrow-right" size={27} color='#ec4899' />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2 border-t border-gray-200 px-4 py-[10px]">
            <Text className={`font-medium text-gray-600 text-[11px] mr-auto`}>
              {data.TokenNo ? `Token : ${data.TokenNo}` : `REF : ${data.TranNo || 'N/A'}`}
            </Text>
            {/* <View className={`px-3 py-[4px] rounded-xl shadow-sm shadow-gray-600 mr-auto ${data.IsAppConfirmed === 'Y' ? 'bg-green-50' : 'bg-sky-50'}`}>
              <Text className={`font-medium text-[11px] ${data.IsAppConfirmed === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Booked'}</Text>
            </View> */}

            <TouchableOpacity onPress={() =>  setBill(true)} className={`px-4 py-1.5 rounded-lg shadow-sm shadow-gray-600 ${!billId ? 'bg-slate-200 pointer-events-none' : 'bg-green-500'}`}>
              <Text className={`font-medium text-[11px] ${!billId ? 'text-gray-500' : 'text-white'}`}>Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPresc(true)} className={`px-3 py-1.5 rounded-lg shadow-sm shadow-gray-600 ${!data.PrescriptionId ? 'bg-slate-200 pointer-events-none' : 'bg-blue-500'}`}>
              <Text className={`font-medium text-[11px] ${!data.PrescriptionId ? 'text-gray-500' : 'text-white'}`}>Prescription</Text>
            </TouchableOpacity>
            {/* {data.IsAppConfirmed !== 'Y' ? <TouchableOpacity onPress={() => {}} className={`px-3 py-1.5 rounded-lg shadow-sm shadow-gray-600 bg-red-500`}>
              <Text className={`font-medium text-[11px] text-white`}>Cancel</Text>
            </TouchableOpacity> : null} */}
          </View>
        </View>
      </View>
      <MyModal modalActive={bill} onClose={() => setBill(false)}  name='BILL' child={<InvoicePreview id={billId} type={'OPD'} />} />
      <MyModal modalActive={presc} onClose={() => setPresc(false)}  name='BILL' child={<Prescription id={data.PrescriptionId} />} />
    </>
  )
}

export const Card_4 = ({ data }: any) => {
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(false);
  const [bill, setBill] = useState(false);
  const [report, setReport] = useState(false)

  const isConfirmed = data.Status === "Y";
  const billId = isConfirmed ? data.RefId : data.BillId;

  return (
    <>
      <View className="bg-white rounded-xl shadow-md shadow-gray-400">
        <TouchableOpacity onPress={() => dispatch(setModal({name: 'TEST_DETAIL', state: true, data: data}))} className='p-3 flex-row gap-1 w-full'>
          <Image className='shadow-md shadow-gray-400 rounded-full me-3' source={require('@/assets/images/user.png')} style={{ width: 60, height: 60 }} />
          <View className='flex-1'>
            <Text className="font-PoppinsSemibold text-sky-700 text-[13px] mb-2">
              {data.PartyName}
            </Text>
            <View className='flex-row gap-3 mb-[6px]'>
                {/* <FontAwesome5 name="clock" size={15} color="#075985" /> */}
                {/* <Text className="font-PoppinsMedium text-gray-600 text-[12px]">{new Date(data.NextAppDate).toLocaleDateString('en-TT')},    {data.NextAppTime}</Text> */}
                <Text className="font-PoppinsMedium text-gray-600 text-[11px]">Date :  {data.NextAppDate.split('T')[0] + " "}</Text>
            </View>
            <View className='flex-row justify-between items-between'>
              <View className='flex-row gap-3'>
                  <Text className="font-PoppinsMedium text-gray-600 text-[11px]">MRD : {data.UHID ? data.UHID : 'N/A'}</Text>
              </View>
              <View className='flex-row gap-3'>
                  <Text className="font-PoppinsMedium text-gray-600 text-[11px]">REF : {data.TranNo}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 mt-2">
              <Text className={`font-PoppinsMedium text-gray-600 text-[11px]`}>Bill : </Text>
              {/* <View className={`px-3 py-[4px] rounded-xl shadow-gray-600 mr-auto ${data.IsAppConfirmed === 'Y' ? 'bg-green-50' : 'bg-sky-50'}`}> */}
                <Text className={`font-PoppinsMedium text-[11px] ${data.IsAppConfirmed === 'Y' ? 'text-green-600' : 'text-sky-600'}`}>{data.IsAppConfirmed === 'Y' ? 'Confirmed' : 'Processing'}</Text>
              {/* </View> */}

              <Text className="font-PoppinsMedium text-gray-600 text-[11px] ml-auto">Service : </Text>
              {/* <View className={`px-3 py-[4px] rounded-xl shadow-gray-600 ${data.Status === 'Y' ? 'bg-green-50' : 'bg-yellow-50'}`}> */}
                <Text className={`font-PoppinsMedium text-[11px] ${data.Status === 'Y' ? 'text-green-600' : 'text-yellow-600'}`}>{data.Status === 'Y' ? 'Done' : 'Pending'}</Text>
              {/* </View> */}
            </View>
          </View>
          <Feather name="arrow-right" size={30} color='#ec4899' />
        </TouchableOpacity>

        <View className="flex-row items-center gap-4 justify-end border-t border-gray-300 px-4 py-[10px]">
          {/* <Text className={`font-PoppinsMedium text-gray-600 text-[11px]`}>Bill : </Text> */}
          <TouchableOpacity onPress={() => setBill(true)} className={`px-6 py-[4px] rounded-lg shadow-sm shadow-gray-600 ${!billId ? 'bg-slate-200 pointer-events-none' : 'bg-green-500'}`}>
            <Text className={`font-PoppinsMedium text-[11px] ${!billId ? 'text-gray-500' : 'text-white'}`}>Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDetails(true)} className={`px-3 py-[4px] rounded-lg shadow-sm shadow-gray-600 bg-blue-500`}>
            <Text className={`font-PoppinsMedium text-[11px] text-white`}>Details</Text>
          </TouchableOpacity>
          {/* {data.IsAppConfirmed !== 'Y' ? <View className={`px-3 py-[4px] rounded-lg shadow-sm shadow-gray-600 bg-red-500`}>
            <Text className={`font-PoppinsMedium text-[11px] text-white`}>Cancel</Text>
          </View> : null} */}
          {billId ? <TouchableOpacity onPress={() => setReport(true)} className={`px-3 py-[4px] rounded-lg shadow-sm shadow-gray-600 bg-purple-500`}>
            <Text className={`font-PoppinsMedium text-[11px] text-white`}>Report</Text>
          </TouchableOpacity> : null}
          {/* <Text className="font-PoppinsMedium text-gray-600 text-[11px]">Service : </Text> */}
          {/* <View className={`px-3 py-[4px] rounded-lg shadow-sm shadow-gray-600 ${data.Status === 'Y' ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <Text className={`font-PoppinsMedium text-[11px] ${data.Status === 'Y' ? 'text-green-600' : 'text-yellow-600'}`}>{data.Status === 'Y' ? 'Done' : 'Pending'}</Text>
          </View> */}
        </View>
      </View>
      <MyModal modalActive={showDetails} name='TEST_DETAILS' onClose={() => setShowDetails(false)} child={<TestItemDetails RefId={data.RefId} handleClose={setShowDetails} />} />
      <MyModal modalActive={bill} onClose={() => setBill(false)}  name='BILL' child={<InvoicePreview id={billId} type={'INVESTIGATION'} />} />
      <MyModal modalActive={report} onClose={() => setReport(false)}  name='REPORT' child={<LabReport id={billId} type={'INVESTIGATION'} />} />
    </>
  )
}