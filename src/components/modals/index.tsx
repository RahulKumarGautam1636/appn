import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CompCard, FullScreenLoading, MyModal } from "../index";
import { setModal } from "@/src/store/slices/slices";
import Members from "@/app/members";
import Login from "../../../app/login";
import AppnDetail from "@/app/appn/appnDetail";
import { DeptsModal } from "@/app/appn/depts";
import TestDetail from "@/app/appn/testDetail";
import PrescriptionForm from "@/app/shop/presc";
import Locations from "@/app/shop/locations";
import AddMember from "@/app/appn/addMember";


const Modals = () => {

    const modals = useSelector((i: RootState) => i.modals);
    return (
        <>
            <MyModal modalActive={modals.COMPANIES.state} name='COMPANIES' child={<CompanySelection />} />
            <MyModal modalActive={modals.MEMBERS.state} name='MEMBERS' child={<Members />} />
            <MyModal modalActive={modals.LOGIN.state} name='LOGIN' child={<Login modalMode />} />
            <MyModal modalActive={modals.APPN_DETAIL.state} name='APPN_DETAIL' child={<AppnDetail data={modals.APPN_DETAIL.data} />} />
            <MyModal modalActive={modals.TEST_DETAIL.state} name='TEST_DETAIL' child={<TestDetail data={modals.TEST_DETAIL.data} />} />
            <MyModal modalActive={modals.DEPTS.state} name='DEPTS' child={<DeptsModal />} />
            <MyModal modalActive={modals.PRESC.state} name='PRESC' child={<PrescriptionForm />} />
            <MyModal modalActive={modals.LOCATIONS.state} name='LOCATIONS' child={<Locations />} />
            <MyModal modalActive={modals.ADD_MEMBER.state} name='LOCATIONS' child={<AddMember isModal={true} />} />
            <MyModal modalActive={modals.LOADING.state} name='LOADING' child={<FullScreenLoading />} />
        </>
    )
}

export default Modals;


const CompanySelection = ({ name }: any) => {
    const { list, selected } = useSelector((i: RootState) => i.companies)
    const dispatch = useDispatch();
    
    return (
        <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
            <View className='p-4'>
                <Pressable onPress={() => dispatch(setModal({ name: name, state: false }))}>
                    <View className='justify-between flex-row pb-1 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Select Clinic</Text>
                        </View>
                    </View>
                </Pressable>
                <View className="py-3 px-[2] gap-4">
                    {list.map((i: any) => <CompCard data={i} key={i.EncCompanyId} details={true} active={selected?.EncCompanyId === i.EncCompanyId}/>)}
                </View>
            </View>
        </ScrollView>
    )
}