import { useRouter } from "expo-router";
import { Image, Modal, ScrollView, Text, TextInput, View } from "react-native";
import ButtonPrimary from "./components";
import { BASE_URL, initReg } from "@/constants";
import { useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { setLogin, setUser, getCompanies } from "./store/slices/slices";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface loginType {
    phone: string,
    password: string,
    EncCompanyId: string
}

const Login = () => {

    const dispatch = useDispatch();
    const compCode = useSelector((state: RootState) => state.compCode);
    const router = useRouter();
    const [loginError, setLoginError] = useState({status: false, message: ''});
    const [loginData, setLoginData] = useState({ phone: '', password: '', EncCompanyId: compCode });
    const [registerData, setRegisterData] = useState({ ...initReg, BusinessType: 'B2C' });

    const { list, selected, status, error} = useSelector((state: RootState) => state.companies);

    const handleLoginFormSubmit = () => {
      if (!loginData.phone || !loginData.password) return;
      makeLoginRequest(loginData);
    //   dispatch(getCompanies({ companyCode: compCode, userId: '14701' }));
    }
    
    const makeLoginRequest = async (params: loginType) => {
        // loaderAction(true);
        const res = await axios.get(`${BASE_URL}/api/UserAuth/Get?UN=${params.phone}&UP=${params.password}&CID=${params.EncCompanyId}`);
        // loaderAction(false);
        console.log(res.data);
        // let appBusinessType = globalData.businessType.CodeValue;     
        // if (res.data.BusinessType !== appBusinessType) return alert('You are not Allowed to log in.');       // BLOCK LOGIN IF MISMATCH FOUND     which is the best place to make api call and update the redux store
    
        if (res.data.Remarks === 'INVALID') {
            setLoginError({status: true, message: 'The username or password is incorrect.'});
        } else if (res.data.Remarks === 'NOTINCOMPANY') {
            alert('Not In Company.')
        // setRegisterData((pre => ({             
        //     ...pre,
        //     Salutation: res.data.Salutation,
        //     Name: res.data.Name,
        //     EncCompanyId: res.data.EncCompanyId,
        //     PartyCode: '',
        //     RegMob1: res.data.RegMob1,
        //     Gender: res.data.Gender,
        //     GenderDesc: res.data.GenderDesc,
        //     Address: res.data.Address,
        //     Age: res.data.Age,
        //     AgeMonth: res.data.AgeMonth,
        //     AgeDay: res.data.AgeDay,
        //     UserPassword: res.data.UserPassword,               // force to re-enter.
        //     // UserType: res.data.UserType,                       // set by modalMode
        //     Qualification: res.data.Qualification,
        //     SpecialistId: res.data.SpecialistId,
        //     UserId: res.data.UserId,
        //     PartyId: res.data.PartyId,
        //     MemberId: res.data.MemberId,
        
        //     State: res.data.State,
        //     StateName: res.data.StateName,
        //     City: res.data.City,
        //     Pin: res.data.Pin,
        //     Address2: res.data.Address2,
        
        //     DOB: new Date(res.data.DOB).toLocaleDateString('en-TT'),
        //     DOBstr: new Date(res.data.DOB).toLocaleDateString('en-TT'),
        //     AnniversaryDate: new Date(res.data.AnniversaryDate).toLocaleDateString('en-TT'),
        //     AnniversaryDatestr: new Date(res.data.AnniversaryDate).toLocaleDateString('en-TT'),
        //     Aadhaar: '',                                        // Not required.
        //     IsDOBCalculated: 'N',

        //     UHID: res.data.UHID,
        
        //     compName: res.data.compName ? res.data.compName : '',
        //     compAddress: res.data.compAddress ? res.data.compAddress : '',
        //     compState: res.data.compState ? res.data.compState : '',
        //     compPin: res.data.compPin ? res.data.compPin : '',
        //     compPhone1: res.data.compPhone1 ? res.data.compPhone1 : '',
        //     compPhone2: res.data.compPhone2 ? res.data.compPhone2 : '',
        //     compMail: res.data.compMail ? res.data.compMail : '',

        //     RegMob2: res.data.RegMob2,            // for Business type.
        //     GstIn: res.data.GstIn,
        //     LicenceNo: res.data.LicenceNo ? res.data.LicenceNo : '',
        //     ContactPerson: res.data.ContactPerson,
        //     BusinessType: 'B2C',
        // })))
        // setShowPersonalFields(true);
        // setShowNumberSubmitBtn(false);
        // setGeneratedOTP('verified');                                              // hide NEXT button of OTP verification.
        // setEnteredOTP('verified');                                                // pass OTP check at makeLoginReuest.
        // setTabActive('register');
        // setLoginError({status: false, message: ''});
        } else if (!res.data.UserId || !res.data.UserType) {
            return alert("Something Went wrong, We can't log you in.");
        } else {
            let userLoginData = {
                Name: res.data.UserFullName,
                RegMob1: params.phone,
                UserId: res.data.UserId,
                UserType: res.data.UserType,
                PartyCode: res.data.PartyCode,
                EncCompanyId: params.EncCompanyId,
                Age: res.data.Age,
                AgeDay: res.data.AgeDay,
                AgeMonth: res.data.AgeMonth,
                Gender: res.data.Gender,
                GenderDesc: res.data.GenderDesc,
                MPartyCode: res.data.MPartyCode,
                Address: res.data.Address,
                Qualification: res.data.Qualification,
                SpecialistDesc: res.data.SpecialistDesc,
                State: res.data.State, 
                StateName: res.data.StateName,                         
                City: res.data.City,
                Pin: res.data.Pin,
                Address2: res.data.Address2,
                UHID: res.data.UHID,
                MemberId: res.data.MemberId,
                PartyId: res.data.PartyId,
                Salutation: res.data.Salutation,
        
                DOB: res.data.DOB,
                DOBstr: res.data.DOB,
                AnniversaryDate: res.data.AnniversaryDate,
                AnniversaryDatestr: res.data.AnniversaryDate,
                Aadhaar: res.data.Aadhaar,
                IsDOBCalculated: res.data.IsDOBCalculated,
        
                compName: res.data.compName ? res.data.compName: '',
                compAddress: res.data.compAddress ? res.data.compAddress: '',
                compState: res.data.compState ? res.data.compState: '',
                compPin: res.data.compPin ? res.data.compPin: '',
                compPhone1: res.data.compPhone1 ? res.data.compPhone1: '',
                compPhone2: res.data.compPhone2 ? res.data.compPhone2: '',
                compMail: res.data.compMail ? res.data.compMail: '',

                RegMob2: res.data.RegMob2,            // for Business type.
                GstIn: res.data.GstIn,
                LicenceNo: res.data.LicenceNo ? res.data.LicenceNo : '',
                ContactPerson: res.data.ContactPerson,
                BusinessType: 'B2C',
            };
        
            // localStorage.setItem("userLoginData", encrypt({ phone: params.phone, password: res.data.UserPassword, compCode: params.companyCode }));
            dispatch(setUser(userLoginData));
            dispatch(setLogin(true));
            router.push('/appn');
            
            // modalAction('LOGIN_MODAL', false, { mode: res.data.UserType });
            // stringToast("Wellcome, You successfully logged in.", { type: 'success', autoClose: 5000 });
            // handleRedirect(res.data.UserType);
        }
    }

    return (
        // <Modal
        //     transparent={true}
        //     visible={true}
        //     animationType="none"
        //     onRequestClose={() => {}}
        //     presentationStyle='fullScreen'
        //     className="absolute inset-0"
        // >
            <ScrollView contentContainerClassName='bg-slate-200 min-h-full' style={{minHeight: '100%'}}>
                {/* <Image source={require('../assets/images/bg.jpg')} className="absolute w-full h-full z-0" resizeMode="cover" /> */}
                <View className="w-full h-1/2 z-0 justify-center items-center relative">
                    <Image source={require('../assets/images/bg.jpg')} className="h-full w-full" resizeMode="cover" />
                    {/* <Image source={require('../assets/images/logo.png')} className="h-[150px] w-[150px] absolute top-[35%] left-1/2" style={{transform: 'translate(-50%, -50%)'}} resizeMode="cover" /> */}
                </View>
                <View className='bg-white mt-auto rounded-tl-[2.7rem] rounded-tr-[2.7rem] px-4 pt-6 pb-36 absolute bottom-0 w-full'>
                    <Text className="font-PoppinsSemibold text-gray-800 text-[24px] text-center py-4">Welcome Back</Text>
                    <View className="p-4 gap-6">
                        <View className='z-10'>
                            <Text className="text-pink-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Phone Number</Text>
                            <TextInput placeholder='Phone Number' maxLength={10} value={loginData.phone} onChangeText={(text) => setLoginData(pre => ({...pre, phone: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                        </View>
                        <View className='z-10'>
                            <Text className="text-pink-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Password</Text>
                            <TextInput placeholder='Your Password' value={loginData.password} onChangeText={(text) => setLoginData(pre => ({...pre, password: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                        </View>
                        {/* {status === 'loading' &&
                            <Text className="text-blue-500 text-[13px] font-PoppinsSemibold ml-auto">Loading...</Text>
                        } */}
                        <Text className="text-pink-500 text-[13px] font-PoppinsSemibold ml-auto">Forgot Password ?</Text>
                        <ButtonPrimary onClick={handleLoginFormSubmit} title='LOGIN' active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                        <Text className="text-gray-500 text-[13px] font-PoppinsMedium mx-auto">Don't have Account ? 
                            <Text className="text-pink-500"> Register Now</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        // </Modal>
    )
}

export default Login;