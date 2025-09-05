import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getFrom, GridLoader, NoContent } from "@/src/components/utils";
import { BASE_URL } from "@/src/constants";
import { Card_1, DayBtn, getDatesArray, MapComponent, MyModal } from "@/src/components";
import Depts from "@/app/appn/depts";


const Clinic = () => {

    // const depts = useSelector((i: RootState) => i.depts).list;
    const { list: companiesList } = useSelector((i: RootState) => i.companies);
    const { compId } = useLocalSearchParams();

    const [clinicData, setClinicData] = useState({loading: true, data: [], err: {status: false, msg: ''}})
    const [departmentList, setDepartmentList] = useState({loading: true, data: [], err: {status: false, msg: ''}});
    const [selectedDept, setSelectedDept] = useState({ Description: "All", SubCode: '0' });
    const [doctors, setDoctors] = useState({loading: true, data: {PartyMasterList: []}, err: {status: false, msg: ''}}) 
    const [filterdates, setFilterDates] = useState({dates: getDatesArray(new Date(), 30), activeDate: new Date().toLocaleDateString('en-TT')});

    const company = companiesList.find((i: any) => String(i.CompanyId) === String(compId))
    const companyId = company?.EncCompanyId;

    const clinic = clinicData.data;

    const [deptsActive, setDeptsActive] = useState(false);

    useEffect(() => {
        let controller = new AbortController();
        const getCompanyDetails = async (companyCode: any) => {
            if (!companyCode) return;
            const res = await getFrom(`${BASE_URL}/api/CompMast/GetCompDetails?CID=${companyCode}&LOCID=${0}`, {}, setClinicData, controller.signal);                                                        
            if (res) {
                setClinicData(res)
            }                                                                                                   
        } 
        getCompanyDetails(companyId); 
        return () => controller.abort();
    }, [companyId])

    useEffect(() => {
        let controller = new AbortController();
        const getDoctors = async (companyCode: string, subCode: string, activeDate: string) => {
            if (!companyCode || subCode === ''  || !activeDate) return;
            const res = await getFrom(`${BASE_URL}/api/Values/Get?CID=${companyCode}&type=INTDOCT&prefixText=&Specialist=${subCode}&Sdate=${activeDate}&Area=&Pin=&LowerFeesRange=&UpperFeesRange=`, {}, setDoctors, controller.signal);                                                        
            if (res) {
                setTimeout(() => {
                    setDoctors(pre => ({loading: false, data: {...pre.data, PartyMasterList: res.data}, err: {status: false, msg: ''}}));
                }, 500)
            }                                                                                                   
        } 
        getDoctors(companyId, selectedDept.SubCode, filterdates.activeDate);  
        return () => controller.abort();
    }, [companyId, selectedDept.SubCode, filterdates.activeDate])

    useEffect(() => {
        const getDepartmentsList = async (companyCode: string, signal='') => {
            if (!companyCode) return console.log('no companyCode received');
            const res = await getFrom(`${BASE_URL}/api/Values/Get?CID=${companyCode}&P1=0`, {}, setDepartmentList);
            if (res) {
                let departmentsList = res.data.map(i => {
                    return {Description: i.Description, SubCode: i.SubCode};
                });
                setDepartmentList({loading: false, data: departmentsList, err: {status: false, msg: ''}});
            }
        }
        getDepartmentsList(companyId)
    }, [companyId])

    const onDeptSelect = (i: any) => {
        setSelectedDept({ Description: i.Description, SubCode: i.SubCode });
        setDeptsActive(false)
    }

    return (
        <>
            <ScrollView contentContainerClassName='bg-slate-200 min-h-full'>
                {/* <Image source={require('../assets/images/bg.jpg')} className="absolute w-full h-full z-0" resizeMode="cover" /> */}
                <View className="h-1/2 z-0 justify-center items-center max-h-[395px]">
                    <Image source={require('../../../assets/images/clinic.jpeg')} className="w-full" resizeMode="contain" />  
                    {/* max-h-full for web */}
                </View>
                <View className='bg-slate-50 rounded-tl-[2.7rem] rounded-tr-[2.7rem] p-6 pt-7' style={{ marginTop: -45}}>
                    <Text className="font-PoppinsSemibold text-sky-800 text-[22px]">{clinic.COMPNAME}</Text>
                    <View className="gap-[0.9rem] mt-3">
                        <View className='flex-row gap-3'>
                            <FontAwesome5 name="clock" size={17} color="#075985" />   
                            <Text className="font-PoppinsMedium text-blue-700 text-[13px]">08:00 AM  -  06:00 PM</Text>
                        </View>
                        <View className='flex-row gap-3'>
                            <Feather name="map-pin" size={17} color="#075985" />
                            <Text className="font-PoppinsMedium text-gray-600 text-[13px]">{clinic.ADDRESS}</Text>
                        </View>
                        <View className='flex-row gap-3'>
                            <Feather name="phone-call" size={17} color="#075983" />   
                            <Text className="font-PoppinsMedium text-gray-600 text-[13px]">{clinic.CONTACT1} {clinic.CONTACT2 && '/ ' + clinic.CONTACT2}</Text>
                        </View>
                        <Text className="font-PoppinsMedium text-gray-800 text-[13px]"><FontAwesome name="star" size={18} color="orange" />   4.9 
                            &nbsp;<Text className='text-gray-500'>(2435 Reviews)</Text>
                        </Text>
                    </View>
                    
                    <Text className="font-PoppinsSemibold text-sky-800 text-[18px] mt-5">Services</Text>
                    <View className="gap-3 flex-row flex-wrap mt-3">
                        {departmentList.data.map((i: any) => (
                            <View className={`flex-row px-4 py-2 rounded-2xl self-start border border-slate-300 bg-blue-50`} key={i.SubCode}>
                                <Text className={`font-PoppinsMedium text-[12px] text-slate-700`}>{i.Description}</Text>
                            </View>
                        ))}
                    </View>
                    <Text className="font-PoppinsSemibold text-sky-800 text-[18px] mt-6 mb-4">Location</Text>
                    {/* <View className="h-[150px] bg-gray-300 mt-3 rounded-xl"></View> */}

                    {/* <View className="mt-3 h-[170px] border border-gray-300">
                        <MapComponent coords={{lat: parseFloat(company.latitude), lng: parseFloat(company.longitude)}} />
                    </View> */}
                    <MapComponent />

                    
                </View>
                    <Text className="font-PoppinsSemibold text-sky-800 text-[18px] bg-slate-50 p-4 border-t border-gray-200">Book Appointment</Text>
                    <TouchableOpacity onPress={() => setDeptsActive(true)} className="flex-wrap gap-4 flex-row bg-primary-500 p-4 items-center justify-between">
                        <Text className="font-PoppinsSemibold text-white text-[14px]">Department</Text>   
                        <View className="py-3 min-w-[50%] bg-primary-400 px-2 flex-row items-center justify-evenly rounded-xl">
                            <Text className="font-PoppinsMedium text-white text-[13px]" numberOfLines={1}>{selectedDept.Description} </Text>
                            <Feather name="chevron-down" size={18} color='#fff' />
                        </View> 
                    </TouchableOpacity>
                <View className='bg-slate-50 p-4'>
                    <View className='justify-between flex-row pt-2 items-center mt-1'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[15px] items-center leading-5">Select Date</Text>
                        </View>
                        <View className="gap-3 flex-row items-center ml-auto">
                            <Feather name="chevron-left" size={24} color='#6b7280' />
                            <Feather name="chevron-right" size={24} color='#6b7280' />
                        </View>
                    </View>
                    <View className='flex-row justify-around'>
                        <ScrollView horizontal={true} contentContainerClassName='items-start flex-row gap-4 pb-1' showsHorizontalScrollIndicator={false}>
                            {filterdates.dates.map((i: any) => <DayBtn data={i} key={i.date} activeDate={filterdates.activeDate} handleActive={setFilterDates} />)}
                        </ScrollView>
                    </View>
                    <View className='justify-between flex-row mt-2'>
                        <Text className="font-PoppinsSemibold text-gray-800 text-[15px] leading-[23px] mt-3">Available Doctors</Text>
                        <Text className="font-PoppinsMedium text-primary-600 text-[14px] leading-[23px] mt-3">View All</Text>
                    </View> 
                    <View className='mt-4 gap-4'>
                        {(() => {
                            if (doctors.loading) {
                                return <GridLoader />
                            } else if (doctors.err.status) {
                                return <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">{doctors.err.msg}</Text>
                            } else if (!doctors.data.PartyMasterList.length) {
                                return <NoContent label='No Doctors Found' containerClass='py-7' />;
                            } else {
                                return doctors.data.PartyMasterList.map((doctor: any) => <Card_1 data={doctor} key={doctor.PartyCode} selectedDate={filterdates.activeDate} docCompId={companyId} />)
                            }
                        })()}
                    </View>
                </View>
            </ScrollView>
             <MyModal modalActive={deptsActive} onClose={() => setDeptsActive(false)} name='DEPTS' child={<Depts deptsList={departmentList.data} onSelect={onDeptSelect} handleBack={() => setDeptsActive(false)} />} />
        </>
    )
}

export default Clinic;