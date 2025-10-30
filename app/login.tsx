import { useRouter } from "expo-router";
import { Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ButtonPrimary, { FullScreenLoading, mmDDyyyyDate, MyModal } from "../src/components";
import { BASE_URL, BC_ROY, hasCommonLogin, defaultId, gender, initReg, myColors, salutations, states } from "@/src/constants";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setLogin, setUser, getCompanies, setModal } from "../src/store/slices/slices";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createDate, getDuration, minDate, Required, swapMinDate, useRegType } from "@/src/components/utils";
import colors from "tailwindcss/colors";

interface loginType {
    phone: string,
    password: string,
    EncCompanyId: string
}

const Login = ({ modalMode }: any) => {

    const dispatch = useDispatch();
    const compCode = useSelector((state: RootState) => state.compCode);
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const user = useSelector((state: RootState) => state.user);
    const { info: compInfo, vType } = useSelector((state: RootState) => state.company);
    const router = useRouter();
    const [loginError, setLoginError] = useState({status: false, message: ''});
    const [loginData, setLoginData] = useState({ phone: '', password: '', EncCompanyId: compCode });        // 9330241456 // 8583814626
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('login');
    const [existingUser, setExistingUser] = useState({});
    

    const handleLoginFormSubmit = () => {
      if (!loginData.phone || !loginData.password) return;
      makeLoginRequest(loginData);
    }
    
    const makeLoginRequest = async (params: loginType) => {
        setLoading(true)
        // const res = await axios.get(`${BASE_URL}/api/UserAuth/Get?UN=${params.phone}&UP=${params.password}&CID=${params.EncCompanyId}`);
        const body = { UserName: params.phone, UserPassword: encodeURIComponent(params.password), EncCompanyId: params.EncCompanyId };
        const res = await axios.post(`${BASE_URL}/api/UserAuth/CheckCompLogin`, body);
        setLoading(false)
        // let appBusinessType = globalData.businessType.CodeValue;     
        // if (res.data.BusinessType !== appBusinessType) return alert('You are not Allowed to log in.');       // BLOCK LOGIN IF MISMATCH FOUND     which is the best place to make api call and update the redux store
        const data = res.data[0];
        if (data.Remarks === 'INVALID') {
            setLoginError({status: true, message: 'The username or password is incorrect.'});
        } else if (data.Remarks === 'NOTINCOMPANY') {
            if (hasCommonLogin(compCode)) {
                setExistingUser({             
                    Salutation: data.Salutation,
                    Name: data.Name,
                    EncCompanyId: data.EncCompanyId,
                    PartyCode: '',
                    RegMob1: data.RegMob1,
                    Gender: data.Gender,
                    GenderDesc: data.GenderDesc,
                    Address: data.Address,
                    Age: data.Age,
                    AgeMonth: data.AgeMonth,
                    AgeDay: data.AgeDay,
                    UserPassword: data.UserPassword,               
                    UserType: data.UserType,                       
                    Qualification: data.Qualification,
                    SpecialistId: data.SpecialistId,
                    UserId: data.UserId,
                    PartyId: data.PartyId,
                    MemberId: data.MemberId,
                
                    State: data.State,
                    StateName: data.StateName,
                    City: data.City,
                    Pin: data.Pin,
                    Address2: data.Address2,
                
                    DOB: swapMinDate(data.DOB),
                    DOBstr: swapMinDate(data.DOB),
                    AnniversaryDate: swapMinDate(data.AnniversaryDate),
                    AnniversaryDatestr: swapMinDate(data.AnniversaryDate),
                    Aadhaar: '',                                       
                    IsDOBCalculated: data.IsDOBCalculated,

                    UHID: data.UHID,
                
                    compName: data.compName ? data.compName : '',
                    compAddress: data.compAddress ? data.compAddress : '',
                    compState: data.compState ? data.compState : '',
                    compPin: data.compPin ? data.compPin : '',
                    compPhone1: data.compPhone1 ? data.compPhone1 : '',
                    compPhone2: data.compPhone2 ? data.compPhone2 : '',
                    compMail: data.compMail ? data.compMail : '',

                    RegMob2: data.RegMob2,            
                    GstIn: data.GstIn,
                    LicenceNo: data.LicenceNo ? data.LicenceNo : '',
                    ContactPerson: data.ContactPerson,
                    BusinessType: 'B2C',

                    UserRegTypeId: data.UserRegTypeId,
                    UserLevelSeq: data.UserLevelSeq
                })
            }
            setTab('register');
            // setShowPersonalFields(true);
            // setShowNumberSubmitBtn(false);
            // setGeneratedOTP('verified');                                              // hide NEXT button of OTP verification.
            // setEnteredOTP('verified');                                                // pass OTP check at makeLoginReuest.
            // setTabActive('register');
            // setLoginError({status: false, message: ''});

        } else if (!data.UserId || !data.UserType) {
            return alert("Something Went wrong, We can't log you in.");
        } else {
            let userLoginData = {
                Name: data.UserFullName,
                RegMob1: params.phone,
                Email: data.Email,
                UserId: data.UserId,
                UserType: data.UserType,
                PartyCode: data.PartyCode,
                EncCompanyId: params.EncCompanyId,
                Age: data.Age,
                AgeDay: data.AgeDay,
                AgeMonth: data.AgeMonth,
                Gender: data.Gender,
                GenderDesc: data.GenderDesc,
                MPartyCode: data.MPartyCode,
                Address: data.Address,
                Qualification: data.Qualification,
                SpecialistDesc: data.SpecialistDesc,
                State: data.State, 
                StateName: data.StateName,                         
                City: data.City,
                Pin: data.Pin, // '741235'
                Address2: data.Address2,
                UHID: data.UHID,
                MemberId: data.MemberId,
                PartyId: data.PartyId,
                Salutation: data.Salutation,
                UserFullName: data.UserFullName,
                UserPassword: data.UserPassword,
        
                DOB: data.DOB,
                DOBstr: data.DOB,
                AnniversaryDate: data.AnniversaryDate,
                AnniversaryDatestr: data.AnniversaryDate,
                Aadhaar: data.Aadhaar,
                IsDOBCalculated: data.IsDOBCalculated,
        
                compName: data.compName ? data.compName: '',
                compAddress: data.compAddress ? data.compAddress: '',
                compState: data.compState ? data.compState: '',
                compPin: data.compPin ? data.compPin: '',
                compPhone1: data.compPhone1 ? data.compPhone1: '',
                compPhone2: data.compPhone2 ? data.compPhone2: '',
                compMail: data.compMail ? data.compMail: '',

                RegMob2: data.RegMob2,            // for Business type.
                GstIn: data.GstIn,
                LicenceNo: data.LicenceNo ? data.LicenceNo : '',
                ContactPerson: data.ContactPerson,
                BusinessType: 'B2C',

                UnderDoctId: data.UnderDoctId,
                ReferrerId: data.ReferrerId,
                ProviderId: data.ProviderId,
                MarketedId: data.MarketedId,

                UserRegTypeId: data.UserRegTypeId,
                UserLevelSeq: data.UserLevelSeq,
                UserCompList: data.UserCompList[0],
            };
            // localStorage.setItem("userLoginData", encrypt({ phone: params.phone, password: data.UserPassword, compCode: params.companyCode }));
            dispatch(setUser(userLoginData));
            dispatch(setLogin(true));
            if (modalMode) {
                dispatch(setModal({ name: 'LOGIN', state: false }))
            } else {
                router.back();
            }
            
            // modalAction('LOGIN_MODAL', false, { mode: res.data.UserType });
            // stringToast("Wellcome, You successfully logged in.", { type: 'success', autoClose: 5000 });
            // handleRedirect(res.data.UserType);
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {                        
            setLoginData(pre => ({...pre, EncCompanyId: compCode}));                                              
        } else {
            setLoginData(pre => ({ ...pre, phone: user.RegMob1, password: user.UserPassword, EncCompanyId: user.EncCompanyId }));
        }
    }, [isLoggedIn, user]);

    useEffect(() => {
        if (vType === 'ErpHospital') {
            setTab('register')
        }
    }, [vType])

    const backToLogin = () => {
        setTab('login');
        setLoginError({status: false, message: ''});
    }
    
    return (
        <ScrollView contentContainerClassName='min-h-full bg-white' style={{minHeight: '100%'}}>
            {/* <Image source={require('@/assets/images/bg.jpg')} className="absolute w-full h-full z-0" resizeMode="cover" /> */}
            {/* <View className="w-full h-1/2 z-0 justify-center items-center relative">
            </View> */}
            <View className="relative gap-4 flex-row items-center justify-center mb-4 flex-1 pt-14 pb-12">
                <Image source={require('@/assets/images/login-bg.png')} className="absolute inset-0 w-full" resizeMode="cover" />
                <Image className='rounded-lg' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${compInfo.LogoUrl}` }} resizeMode="contain" style={{ width: 160, height: 150 }} />
                {/* <Image className='' source={require('@/assets/images/logo.png')} style={{ width: 160, height: 150 }} /> */}
                {/* <View>
                    <Text className="font-PoppinsSemibold text-blue-800 text-[38px] leading-none mb-2 pt-3">{comp.name}</Text>
                    <Text className="font-Poppins text-gray-600 text-[13px]">{comp.tag}</Text>
                </View> */}
            </View>
            {(() => {
                if (tab === 'login') {
                    return (
                        <View className='bg-white shadow-lg mt-auto rounded-tl-[2.7rem] rounded-tr-[2.7rem] px-4 pt-6 pb-28 w-full'>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[24px] text-center py-4">Welcome Back</Text>
                            <View className="p-4 gap-8 min-h-[60%]">
                                <View className='z-10'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Phone Number</Text>
                                    <TextInput placeholderTextColor={colors.gray[400]} placeholder='Phone Number' maxLength={10} value={loginData.phone} onChangeText={(text) => setLoginData(pre => ({...pre, phone: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Password</Text>
                                    <TextInput placeholderTextColor={colors.gray[400]} placeholder='Your Password' value={loginData.password} onChangeText={(text) => setLoginData(pre => ({...pre, password: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                {loginError.status ?
                                    <Text className="text-rose-500 text-[13px] font-PoppinsSemibold mr-auto">{loginError.message}</Text>
                                : null}
                                <Pressable onPress={() => setTab('forgotPassword')}>
                                    <Text className="text-sky-600 text-[13px] font-PoppinsSemibold ml-auto">Forgot Password ?</Text>
                                </Pressable>
                                <ButtonPrimary onClick={handleLoginFormSubmit} isLoading={loading} title='LOGIN' active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                                <Pressable onPress={() => setTab('register')}>
                                    <Text className="text-gray-500 text-[13px] font-PoppinsMedium mx-auto">Don't have Account  ? 
                                        <Text className="text-primary-500">  Register Now</Text>
                                    </Text>
                                </Pressable>
                            </View>
                        </View> 
                    )
                } else if (tab === 'register') {
                    return <Registeration existUser={existingUser} modalMode={modalMode} setTab={setTab} setLoginData={setLoginData} setLoginError={setLoginError} />
                } else if (tab === 'forgotPassword') {
                    return <ForgotPassword backToLogin ={backToLogin} />
                }
            })()}
        </ScrollView>
    )
}

export default Login;

const allRegTypes = [
    {title: 'PATIENT', level: 60},
    {title: 'DOCTOR', level: 57},
    {title: 'PROVIDER', level: 58},
    {title: 'MARKETBY', level: 55, description: 'Marketing Executive'}
];

export const Registeration = ({ existUser={}, setTab=()=>{}, setLoginData=()=>{}, setLoginError=()=>{}, isModal=false, closeEdit, modalMode=false }: any) => {

    const dispatch = useDispatch();
    const compCode = useSelector((state: RootState) => state.compCode);
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const user = useSelector((state: RootState) => state.user);
    const vType = useSelector((state: RootState) => state.company.vType);
    const router = useRouter();
    const [dobDate, setDobDate] = useState(false);
    const [otp, setOTP] = useState({isOpen: false, recievedValue: 'null', enteredValue: '', sent: false, verified: false, read_only: false});    
    const [personalFields, setPersonalFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [regData, setRegData] = useState({ ...initReg, DOB: '', DOBstr: '', BusinessType: 'B2C' });
    const isOPD = vType === 'ErpHospital';
    // const regType = useSelector((state: RootState) => state.modals.LOGIN.data?.mode) || {};
    const userRegTypeId = useSelector((state: RootState) => state.appData.userRegType.CodeId);
    const [regTypeDropdown, setRegTypeDropdown] = useState(false);
    const [regType, setRegType] = useState({title: 'PATIENT', level: 60});    
    const regTypes = { 60: 'Customer', 57: 'SP', 58: 'AP', REFERRER: 'MP', 55: 'MarketBy' }; 
    useRegType(regTypes[regType?.level]); 

    useEffect(() => {
        if (isLoggedIn || compCode === BC_ROY || vType !== 'ErpHospital' || existUser.UserId) return;
        setRegTypeDropdown(true);
    }, [])  

    useEffect(() => {
        if (existUser.UserId) return;
        if (!isLoggedIn) {                                                            
            setRegData(pre => ({...pre, 
                EncCompanyId: compCode, 
                UserRegTypeId: isOPD ? userRegTypeId : 43198, 
                UserLevelSeq: isOPD ? regType?.level : 60,
                UserType: isOPD ? regType?.title : 'CUSTOMER', 
            }));          
        } else {
            setRegData((pre => ({             
                ...pre,
                Name: user.Name,
                RegMob1: user.RegMob1,
                UserId: user.UserId,
                UserType: user.UserType,
                PartyCode: user.PartyCode,
                Email: user.Email,
                EncCompanyId: user.EncCompanyId,
                Age: user.Age,
                AgeDay: user.AgeDay,
                AgeMonth: user.AgeMonth,
                Gender: user.Gender,
                GenderDesc: user.GenderDesc,
                MPartyCode: user.MPartyCode,
                Address: user.Address,
                Qualification: user.Qualification,
                SpecialistDesc: user.SpecialistDesc,
                State: user.State, 
                StateName: user.StateName,                         
                City: user.City,
                Pin: user.Pin,
                Address2: user.Address2,
                UHID: user.UHID,
                MemberId: user.MemberId,
                PartyId: user.PartyId,
                Salutation: user.Salutation,
        
                DOB: new Date(user.DOB).toLocaleDateString('en-TT'),
                DOBstr: new Date(user.DOB).toLocaleDateString('en-TT'),
                AnniversaryDate: new Date(user.AnniversaryDate).toLocaleDateString('en-TT'),        
                AnniversaryDatestr: new Date(user.AnniversaryDate).toLocaleDateString('en-TT'),
                Aadhaar: user.Aadhaar,
                IsDOBCalculated: user.IsDOBCalculated,
        
                compName: user.compName ? user.compName : '',
                compAddress: user.compAddress ? user.compAddress : '',
                compState: user.compState ? user.compState : '',
                compPin: user.compPin ? user.compPin : '',
                compPhone1: user.compPhone1 ? user.compPhone1 : '',
                compPhone2: user.compPhone2 ? user.compPhone2 : '',
                compMail: user.compMail ? user.compMail : '',

                RegMob2: user.RegMob2,            // for Business type.can we do anything to ensure an useEffect runs last when multiple useEffects are on page
                GstIn: user.GstIn,
                LicenceNo: user.LicenceNo,
                ContactPerson: user.ContactPerson,
                BusinessType: user.BusinessType,
                UserRegTypeId: user.UserRegTypeId,
                UserLevelSeq: user.UserLevelSeq
            })))
            setOTP({isOpen: false, recievedValue: 'null', enteredValue: '', sent: false, verified: true, read_only: false})
            setPersonalFields(true);
        }
    }, [isLoggedIn, user, userRegTypeId]);

    useEffect(() => {                                                                               // make sure this effect runs at last.
        if (!existUser.UserId) return;
        const autoLogin = async () => {
            dispatch(setModal({ name: 'LOADING', state: true }))
            let status = await makeRegisterationRequest({ ...regData, ...existUser });
            if (status) {
                let loginStatus = await refreshUserInfo({ ...regData, ...existUser });
                if (loginStatus) {
                    dispatch(setLogin(true));
                    if (modalMode) {
                        dispatch(setModal({ name: 'LOGIN', state: false }))
                    } else if (isModal) {
                        closeEdit()
                    } else {
                        router.back();
                    }
                }
            }
            dispatch(setModal({ name: 'LOADING', state: false })) 
        }
        if (vType === 'ErpHopital') {
            setRegData(pre => ({...pre, ...existUser }));
        } else {
            autoLogin()  
        }
    }, [existUser, userRegTypeId])


    const makeRegisterationRequest = async (params: any) => { 
        console.log("makeRegisterationRequest : ", params) 
        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/api/UserReg/Post`, params);     //  { data: ['Y', 456446]}
            setLoading(false);
            if (String(res.data[1]).length > 3) { 
                return true;
            } else {
                alert('Something Went wrong, Please try again later.');
                return false;
            }      
        } catch (err) {
            console.log(err);
            return false;
        }
    } 

    const handleRegFormSubmit = async () => {
        if (otp.verified) {
            if (regData.RegMob1.length < 10) return alert('Please enter a valid Phone number.');
            if (!regData.Name.length) return alert('Please enter a valid name.');
            if (regData.UserPassword.length < 4) return alert('Minimum length for password is 4.');
            if (regData.DOBstr.length < 4) return alert('Please enter your Age or select your Date of Birth.');

            if (vType === 'ErpPharma') {   
                if (regData.Pin.length < 6) return alert('Please enter a valid Pin Code.');
                if (regData.Address.length < 4) return alert('Please enter your valid address.');
            }

            if (regData.UserRegTypeId.length < 2) return alert('Error Occured. Please restart the app and try again. Err - 003');
            if (regData.UserRegTypeId.length < 2) return alert('Error Occured. Please restart the app and try again. Err - 003');
            if (!regData.UserLevelSeq) return alert('Error Occured. Please restart the app and try again. Err - 004');
            if (regData.UserType.length < 2) return alert('Error Occured. Please restart the app and try again. Err - 005');
            let status = await makeRegisterationRequest({ ...regData });
            if (status) {
                let loginStatus = await refreshUserInfo(regData);
                if (loginStatus) {
                    dispatch(setLogin(true));
                    if (modalMode) {
                        dispatch(setModal({ name: 'LOGIN', state: false }))
                    } else if (isModal) {
                        closeEdit()
                    } else {
                        router.back();
                    }
                }
            } 
        }
    } 

    const refreshUserInfo = async (params: any) => {
        try {
            setLoading(true);
            const body = { UserName: params.RegMob1, UserPassword: params.UserPassword, EncCompanyId: compCode };
            const res = await axios.post(`${BASE_URL}/api/UserAuth/CheckCompLogin`, body);
            setLoading(false)
            const data = res.data[0];
            
            if (data.Remarks === 'INACTIVE') {
                alert('THIS USER ID IS INACTIVE')
                return false;
            } else if (data.UserId) {
                dispatch(setUser({ ...data, UserCompList: data.UserCompList[0] }));
                // localStorage.setItem("userLoginData", encrypt({ phone: params.RegMob1, password: params.UserPassword, compCode: compCode }));
                return true;
            } else {
                alert('We could not log you in, Please log in again manually.');
                return false;
            }
        } catch (err) {
            alert(err)
        }
    }
    
    const handleNext = async () => {
        if (!isLoggedIn && !otp.sent) {
            if (regData.RegMob1.length < 10) return alert('please enter a valid phone number.');
            const userExist = await checkExistingUser();
            if (userExist) return;
            const receivedOtp = await makeOtpRequest();
            setOTP({...otp, isOpen: true, sent: true, recievedValue: receivedOtp});
        } else if (otp.sent) {
            if (compCode !== defaultId) {
                if (otp.recievedValue !== otp.enteredValue) return alert('Wrong OTP.');
            }
            setOTP({...otp, isOpen: false, verified: true, read_only: true});
            setPersonalFields(true);
        }
    }

    const checkExistingUser = async () => {
        if (regData.RegMob1.length > 9) {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/UserReg/Get?UN=${regData.RegMob1}`);
            setLoading(false);
            if (res.data === 'Y') {
                setLoginError({status: true, message: 'This number is already registered.'});
                setLoginData(pre => ({ ...pre, phone: regData.RegMob1 }))
                setRegData(pre => ({ ...pre, RegMob1: '' }))
                setTab('login');
                return true;
            } else {
                setLoginError({status: false, message: ''});
                return false;
            }
        }
    }

    const makeOtpRequest = async () => {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/UserReg/Get?Id=0&name=Subscriber&mob=${regData.RegMob1}`);
        console.log(`${BASE_URL}/api/UserReg/Get?Id=0&name=Subscriber&mob=${regData.RegMob1}`);
        
        setLoading(false);
        if (res.status === 200) {
            console.log(res.data);            
            return res.data;
        }
        alert('An Error Occured, Try again later.');
        return 'asdfasdasdf';
    }

    const [genderDropdown, setGenderDropdown] = useState(false);
    const [salutationDropdown, setSalutationDropdown] = useState(false);
    const [stateDropdown, setStateDropdown] = useState(false);

    const handleDate = (props: any) => {
        const { Age, AgeMonth, AgeDay, currField, currValue }  = props;
        let calculatedDOB: undefined;
        if (currField === 'Age') {
            calculatedDOB = createDate(AgeDay || 0, AgeMonth || 0, currValue);
        } else if (currField === 'AgeDay') {
            calculatedDOB = createDate(currValue, AgeMonth || 0, Age || 0);
        } else if (currField === 'AgeMonth') {
            calculatedDOB = createDate(AgeDay || 0, currValue, Age || 0);
        }
        setRegData(pre => ({...pre, DOB: calculatedDOB, DOBstr: calculatedDOB, IsDOBCalculated: 'Y'}));
    }
    
    const handleNumberInputsWithDate = (i: {name: string, value: string}) => {
        const {name, value} = i;
        const re = /^[0-9\b]+$/;
        if (value === '' || re.test(value)) {
            setRegData(pre => ({...pre, [name]: value}));
            let currValues = { Age: regData.Age, AgeMonth: regData.AgeMonth, AgeDay: regData.AgeDay, currField: name, currValue: value };
            handleDate(currValues);
        }
    }
    
    const calculateDuration = (date: any) => {
        let x = { 
            IsDOBCalculated: 'N', 
            Age: getDuration(date).years, 
            AgeMonth: getDuration(date).months, 
            AgeDay: getDuration(date).days, 
            DOB: date,
            DOBstr: date
        }       
        setRegData(pre => ({...pre, ...x}));
    }

    const GenderDropdown = () => {
        return (
          <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
            {gender.map((i: any, n: number) => (
                <TouchableOpacity key={i.CodeId} className={`flex-row gap-3 p-4 ${n === (states.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setRegData(pre => ({...pre, Gender: i.CodeId, GenderDesc: i.Description})); setGenderDropdown(false)}}>
                    <MaterialCommunityIcons name={i.icon} size={20} color={myColors.primary[500]} />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.Description}</Text>
                </TouchableOpacity>
            ))}
          </View>
        )
    }

    const SalutationDropdown = () => {
        return (
          <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400 flex-row gap-4 flex-wrap p-6'>
            {salutations.map((i: any) => (
                <TouchableOpacity key={i.value} className='flex-row gap-3 px-6 py-3 bg-purple-50 rounded-xl border border-purple-200' onPress={() => {setRegData(pre => ({...pre, Salutation: i.value})); setSalutationDropdown(false)}}>
                    <Text className="font-PoppinsSemibold text-purple-800 text-[14px]" numberOfLines={1}>{i.title}</Text>
                </TouchableOpacity>
            ))}
          </View>
        )
    }

    const StateDropdown = () => {
        return (
            <ScrollView className="">
                <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
                    {states.map((i: any, n: number) => (
                        <TouchableOpacity key={i.CodeId} className={`flex-row gap-3 p-4 ${n === (states.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setRegData(pre => ({...pre, State: i.CodeId, StateName: i.Description})); setStateDropdown(false)}}>
                            <FontAwesome6 name="location-dot" size={20} color={myColors.primary[500]} />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.Description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        )
    }

    const RegTypesDropdown = () => {
        return (
            <ScrollView className="">
                <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
                    {allRegTypes.map((i: any, n: number) => (
                        <TouchableOpacity key={i.level} className={`flex-row gap-3 p-4 ${n === (allRegTypes.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setRegType(i); setRegTypeDropdown(false)}}>
                            <FontAwesome6 name="circle-right" size={20} color={colors.fuchsia[500]} />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[14px] mr-auto" numberOfLines={1}>{i.Description || i.title}</Text>
                            {i.level === regType.level ? 
                                <>
                                    <FontAwesome6 name="check" size={20} color={myColors.primary[500]} />
                                    <Text className="font-PoppinsSemibold text-primary-500 text-[14px]" numberOfLines={1}>Selected</Text>
                                </>
                            : null}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        )
    }

    const [day, month, year] = regData.DOB.split('/').map(Number);
    let parsedDOB = new Date(year, month - 1, day);
    return (
        <>
            <View className={`bg-white shadow-lg px-4 pt-6 pb-6 w-full ${isModal ? 'h-full' : 'mt-auto rounded-tl-[2.7rem] rounded-tr-[2.7rem]'}`}> 
                <Text className={`font-PoppinsSemibold text-gray-800 text-[24px] text-center ${isModal ? 'py-3' : 'py-4'}`}>{isModal ? 'Personal Details' : 'Please Register'}</Text>
                <View className="gap-6 mt-4 min-h-[60%]">
                    <View className='z-10'>
                        <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Phone Number</Text>
                        <TextInput readOnly={otp.verified} placeholderTextColor={colors.gray[400]} placeholder='Phone Number' maxLength={10} value={regData.RegMob1} onChangeText={(text) => setRegData(pre => ({...pre, RegMob1: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                    </View>
                    {otp.isOpen ? <View className='z-10'>
                        <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Enter OTP</Text>
                        <TextInput placeholderTextColor={colors.gray[400]} placeholder='Enter your OTP..' value={otp.enteredValue} onChangeText={(text) => setOTP(pre => ({...pre, enteredValue: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                    </View> : null}
                    {!personalFields ? <>
                        <Text className="text-sky-600 text-[13px] font-PoppinsSemibold ml-auto mb-10">We'll send you an OTP !</Text>
                        <ButtonPrimary onClick={handleNext} isLoading={loading} title='SUBMIT' active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                    </> : null}
                    {personalFields ? <>
                        <View className="gap-6">
                            <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Personal Information</Text>
                            <View className="flex-row gap-3">
                                <Pressable className='z-10 flex-1' onPress={() => setSalutationDropdown(true)}>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Salutation</Text>
                                    <TextInput placeholder='-Select-' readOnly value={regData.Salutation} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                    <MyModal modalActive={salutationDropdown} onClose={() => setSalutationDropdown(false)} child={<SalutationDropdown />} />
                                </Pressable>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Name</Text>
                                    <TextInput placeholder='Name' value={regData.Name} onChangeText={(text) => setRegData(pre => ({...pre, Name: text }))} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <Pressable onPress={() => setGenderDropdown(true)} className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Gender</Text>
                                    <TextInput readOnly placeholder='Gender' value={regData.GenderDesc} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                    <MyModal modalActive={genderDropdown} onClose={() => setGenderDropdown(false)} child={<GenderDropdown />} />
                                </Pressable>
                                <Pressable className='z-10 flex-1' onPress={() => setDobDate(true)}>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">DOB</Text>
                                    <TextInput placeholder='DD/MM/YYYY' readOnly value={regData.DOB} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                    {dobDate ? <DateTimePicker value={parsedDOB} mode="date" display="default" onChange={(e: any, d: any) => {calculateDuration(new Date(d).toLocaleDateString('en-TT')); setDobDate(false)}} /> : null}
                                </Pressable>
                            </View>
                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Years</Text>
                                    <TextInput placeholder='00' maxLength={2} value={String(regData.Age)} onChangeText={(text) => handleNumberInputsWithDate({name: 'Age', value: text})} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Months</Text>
                                    <TextInput placeholder='00' value={String(regData.AgeMonth)} onChangeText={(text) => handleNumberInputsWithDate({name: 'AgeMonth', value: text})} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Days</Text>
                                    <TextInput placeholder='00' value={String(regData.AgeDay)} onChangeText={(text) => handleNumberInputsWithDate({name: 'AgeDay', value: text})} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Address</Text>
                                    <TextInput placeholder='Address' value={regData.Address} onChangeText={(text) => setRegData(pre => ({...pre, Address: text }))} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">City</Text>
                                    <TextInput placeholder='City' value={regData.City} onChangeText={(text) => setRegData(pre => ({...pre, City: text }))} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <Pressable className='z-10 flex-1' onPress={() => setStateDropdown(true)}>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> State</Text>
                                    <TextInput placeholder='State' readOnly value={regData.StateName} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                    <MyModal modalActive={stateDropdown} onClose={() => setStateDropdown(false)} child={<StateDropdown />} />
                                </Pressable>
                            </View>
                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'> 
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Pin Code</Text>
                                    <TextInput placeholder='Pin Code' maxLength={6} value={regData.Pin} onChangeText={(text) => setRegData(pre => ({...pre, Pin: text }))} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Password</Text>
                                    <TextInput placeholder='Password' maxLength={10} value={regData.UserPassword} onChangeText={(text) => setRegData(pre => ({...pre, UserPassword: text }))} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                        </View>
                        <Text className="text-orange-600 text-[13px] font-medium ml-auto">Please keep your password for future logins.</Text>
                        <ButtonPrimary onClick={handleRegFormSubmit} isLoading={loading} title={isModal ? 'UPDATE DETAILS' : 'REGISTER'} active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                    </> : null}
                    {isModal ? null: <Pressable onPress={() => setTab('login')} className="mt-4">
                        <Text className="text-gray-500 text-[13px] font-PoppinsMedium mx-auto">Already have Account  ? 
                            <Text className="text-primary-500">  Please Login</Text>
                        </Text>
                    </Pressable>}
                </View>
            </View>
            <MyModal modalActive={regTypeDropdown} onClose={() => setRegTypeDropdown(false)} child={<RegTypesDropdown />} />
        </>
    )
}


const ForgotPassword = ({ backToLogin }: any) => {

  const [forgotPassword, setForgotPassword] = useState({recoveryNumber: '', msg: "You'll Recieve a Message."});
  const [isPasswordSent, setPasswordSent] = useState(false);
  const compCode = useSelector((i: RootState) => i.compCode);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendPassword();
  }

  const goToLogin = () => {
    backToLogin();
    setForgotPassword({recoveryNumber: '', msg: ''});
    // setPasswordSent(false);
  }

  const sendPassword = async () => {
    if (forgotPassword.recoveryNumber.length < 9) return alert('Please enter a valid number.')
    setLoading(true)
    const res = await axios.get(`${BASE_URL}/api/UserAuth/Get?id=0&UN=${forgotPassword.recoveryNumber}&CID=${compCode}&Type=FP`, {});
    setLoading(false)
    if (res.data === 'Y') {
      setForgotPassword(pre => ({...pre, recoveryNumber: '', msg: 'Your Password has been sent to your registered mobile number. please check !'}))
    //   setPasswordSent(true);
    } else {
      setForgotPassword(pre => ({...pre, recoveryNumber: '', msg: 'This number is not Registered.'}))
    }
  }

  return (
    <View className='bg-white shadow-lg mt-auto rounded-tl-[2.7rem] rounded-tr-[2.7rem] px-4 pt-6 pb-28 w-full'>
        <Text className="font-PoppinsSemibold text-gray-800 text-[24px] text-center pt-4 pb-8">Forgot Password ?</Text>
        <View className="p-4 gap-8 min-h-[55%]">
            <View className='z-10'>
                <Text className="text-primary-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1"><Required /> Phone Number</Text>
                <TextInput placeholderTextColor={colors.gray[400]} placeholder='Phone Number' maxLength={10} value={forgotPassword.recoveryNumber} onChangeText={(text) => setForgotPassword(pre => ({...pre, recoveryNumber: text }))} className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
            </View>
            
            <Text className="text-orange-500 text-[13px] font-PoppinsSemibold mr-auto">{forgotPassword.msg}</Text>
            <Pressable onPress={goToLogin}>
                <Text className="text-sky-600 text-[13px] font-PoppinsSemibold ml-auto">Go Back To Login.</Text>
            </Pressable>
            <ButtonPrimary onClick={handleSubmit} isLoading={loading} title='SUBMIT' active={true} classes='rounded-2xl' textClasses='tracking-widest' />
            <Pressable onPress={goToLogin}>
                <Text className="text-gray-500 text-[13px] font-PoppinsMedium mx-auto">Already have an Account ? 
                    <Text className="text-primary-500">  Back To Login</Text>
                </Text>
            </Pressable>
        </View>
    </View> 
  )
}