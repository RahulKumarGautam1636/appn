import { useRouter } from "expo-router";
import { Pressable, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import ButtonPrimary, { MyModal } from "@/src/components";
import { BASE_URL, gender, initMember, myColors, salutations, states } from "@/src/constants";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setModal, getMembers } from "@/src/store/slices/slices";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import MyDropdown, { createDate, getDuration, getFrom, Required, uType } from "@/src/components/utils";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { FlatList } from 'react-native-gesture-handler';

const AddMember = ({ isModal }: any) => {

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
        setMemberData(pre => ({...pre, DOB: calculatedDOB, DOBstr: calculatedDOB, IsDOBCalculated: 'Y'}));
    }
    
    const handleNumberInputsWithDate = (i: {name: string, value: string}) => {
        const {name, value} = i;
        const re = /^[0-9\b]+$/;
        if (value === '' || re.test(value)) {
            setMemberData(pre => ({...pre, [name]: value}));
            let currValues = { Age: memberData.Age, AgeMonth: memberData.AgeMonth, AgeDay: memberData.AgeDay, currField: name, currValue: value };
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
        setMemberData(pre => ({...pre, ...x}));
    }

    const GenderDropdown = ({ handleSelect }: any) => {
        return (
          <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
            {gender.map((i: any, n: number) => (
                <TouchableOpacity key={i.CodeId} className={`flex-row gap-3 p-4 ${n === (states.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {handleSelect(i); setGenderDropdown(false)}}>
                    <MaterialCommunityIcons name={i.icon} size={20} color={myColors.primary[500]} />
                    <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.Description}</Text>
                </TouchableOpacity>
            ))}
          </View>
        )
    }

    const SalutationDropdown = ({ handleSelect, keyName }: any) => {
        return (
          <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400 flex-row gap-4 flex-wrap p-6'>
            {salutations.map((i: any) => (
                <TouchableOpacity key={i.value} className='flex-row gap-3 px-6 py-3 bg-purple-50 rounded-xl border border-purple-200' onPress={() => {handleSelect(i.value); setSalutationDropdown(false)}}>
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
                        <TouchableOpacity key={i.CodeId} className={`flex-row gap-3 p-4 ${n === (states.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => {setMemberData(pre => ({...pre, State: i.CodeId})); setStateDropdown(false)}}>
                            <FontAwesome6 name="location-dot" size={20} color={myColors.primary[500]} />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.Description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        )
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------

    const { selectedMember, membersList } = useSelector((i: RootState) => i.members)
    const editId = useSelector((i: RootState) => i.modals.ADD_MEMBER.data?.editId);
    const [memberData, setMemberData] = useState({
      ...initMember,
      EncCompanyId: user.EncCompanyId,    
      RegMob1: user.RegMob1,
      ParentUserId: user.UserId,
      UserType: 'CUSTOMER',
      PartyId: user.PartyId,
      UnderDoctId: 0,  // sales
      ReferrerId: 0,   // refBy
      ProviderId: 0,   // provider
      MarketedId: 0,   // marketing
    })
    
    const [day, month, year] = memberData.DOB.split('/').map(Number);
    let parsedDOB = new Date(year, month - 1, day);

    // ---------------------------------------------------------------------------------------------------------------
  
      useEffect(() => {
        if (editId) {
            const item = membersList.find(i => i.MemberId === editId);
            let newItem = {
                Salutation: item.Salutation ? item.Salutation : '',
                MemberName : item.MemberName ? item.MemberName : '',
                EncCompanyId: item.EncCompanyId ? item.EncCompanyId : user.EncCompanyId,
                RegMob1: user.RegMob1,
                Gender: item.Gender ? item.Gender : '',
                GenderDesc: item.GenderDesc ? item.GenderDesc : '',
                Address: item.Address ? item.Address : '',
                Age: item.Age ? item.Age : 0,
                AgeMonth: item.AgeMonth ? item.AgeMonth : 0,
                AgeDay: item.AgeDay ? item.AgeDay : 0,

                State: item.State ? item.State : '',
                City: item.City ? item.City : '',
                Pin: item.Pin ? item.Pin : '',
                Landmark: item.Landmark ? item.Landmark : '',

                IsDefault: item.IsDefault,
                
                ParentUserId: item.ParentUserId,
                MemberId: item.MemberId,
                MemberTypeId : item.MemberTypeId ? item.MemberTypeId : '',
                UserType: item.UserType ? item.UserType : uType.CUSTOMER.title,
                UID: item.UID ? item.UID : '',
                UserId: item.UserId,
                
                DOB: new Date(item.DOB).toLocaleDateString('en-TT'),
                DOBstr: new Date(item.DOB).toLocaleDateString('en-TT'),
                IsDOBCalculated: item.IsDOBCalculated ? item.IsDOBCalculated : '',
                Aadhaar: item.Aadhaar ? item.Aadhaar : '',
                ParentAadhaar1: item.ParentAadhaar1 ? item.ParentAadhaar1 : '',
                ParentAadhaar2: item.ParentAadhaar2 ? item.ParentAadhaar2 : '',
                RelationShipWithHolder: item.RelationShipWithHolder ? item.RelationShipWithHolder : '',
                Mobile: item.Mobile ? item.Mobile : '',
                Country: 1,

                Mobile2: item.Mobile2 ? item.Mobile2 : '',
                GstIn: item.GstIn || '',
                LicenceNo: item.LicenceNo || '',
                ContactPerson: item.ContactPerson || '',
                BusinessType: item.BusinessType || '',

                // UserRegTypeId: item.UserRegTypeId
                PartyId: user.PartyId,
                LinkAutoId: item.LinkAutoId,                               // When doctor add the member.

                UnderDoctId: item.UnderDoctId,
                ReferrerId: item.ReferrerId,
                ProviderId: item.ProviderId,
                MarketedId: item.MarketedId,
            }
            setMemberData(newItem);

            setFields({
                marketing: {label: item.MarketedDesc, active: user.UserLevelSeq <= 55, roleLevel: 55},
                sales: {label: item.UnderDoctDesc, active: user.UserLevelSeq <= 56, roleLevel: 56},
                refBy: {label: item.ReferrerDesc, active: user.UserLevelSeq <= 57, roleLevel: 57},
                provider: {label: item.ProviderDesc, active: user.UserLevelSeq <= 58, roleLevel: 58},
            })

        }
    }, [editId])

    const [fields, setFields] = useState({
        marketing: { label: '', active: false, roleLevel: 55 },          // market
        sales: { label: '', active: false, roleLevel: 56 },              // sales
        refBy: { label: '', active: false, roleLevel: 57 },              // reffered
        provider: { label: '', active: false, roleLevel: 58 },           // provider
    });

    const [salesOpen, setSalesOpen, selesList, setSalesList] = useListFetch(`${BASE_URL}/api/Values/Get?CID=${compCode}&type=INTDOCT&Specialist=0&prefixText=${fields.sales.label}`, compCode, fields.sales.label);
    const [refOpen, setRefOpen, refList, setRefList] = useListFetch(`${BASE_URL}/api/Values/Get?CID=${compCode}&type=DOCT&Specialist=0&prefixText=${fields.refBy.label}`, compCode, fields.refBy.label);
    const [providerOpen, setProviderOpen, providerList, setProviderList] = useListFetch(`${BASE_URL}/api/Values/Get?CID=${compCode}&type=Referer&Specialist=0&prefixText=${fields.provider.label}`, compCode, fields.provider.label);
    const [marketOpen, setMarketOpen, marketList, setMarketList] = useListFetch(`${BASE_URL}/api/Values/Get?CID=${compCode}&type=Market&prefixText&Specialist=0&prefixText=${fields.marketing.label}`, compCode, fields.marketing.label);

    const selectItem = (i, type) => {
        if (type === 'sales') {
            setMemberData(pre => ({...pre, UnderDoctId: i.PartyCode}));
            setSalesOpen(false);
        } else if (type === 'refBy') {
            setMemberData(pre => ({...pre, ReferrerId: i.PartyCode}));
            setRefOpen(false);
        } else if (type === 'provider') {
            setMemberData(pre => ({...pre, ProviderId: i.PartyCode}));
            setProviderOpen(false);
        } else if (type === 'marketing') {
            setMemberData(pre => ({...pre, MarketedId: i.PartyCode}));
            setMarketOpen(false);
        }
        setFields(pre => ({...pre, [type]: { ...pre[type], label: i.Name }}))
    }

    const handleInput = (name: string, value: string) => {
        setFields(pre => ({...pre, [name]: { ...pre[name], label: value, active: true }}));
    }    

    const compDetail = user.UserCompList || {};
    const compUserDetail = user.UserCompList.UserDetails;

    useEffect(() => {
        if (editId) return;
        let role = {};
        if (user.UserLevelSeq === fields.marketing.roleLevel) {             // 55
            role = { 
                MarketedId: compUserDetail.SubCode, 
            }
            setFields(pre => ({
                ...pre, 
                marketing: { ...pre.marketing, label: user.UserFullName, active: true },
                sales: { ...pre.sales, label: '', active: true }, 
                refBy: { ...pre.refBy, label: '', active: true }, 
                provider: { ...pre.provider, label: '', active: true }, 
            }))

        } else if (user.UserLevelSeq === fields.sales.roleLevel) {          // 56
            role = {
                UnderDoctId: compUserDetail.SubCode,
                MarketedId: compUserDetail.MarketById,
            }
            setFields(pre => ({
                ...pre, 
                sales: { ...pre.sales, label: user.UserFullName, active: true }, 
                marketing: { ...pre.marketing, label: compUserDetail.MarketByDesc },
                refBy: { ...pre.refBy, label: '', active: true }, 
                provider: { ...pre.provider, label: '', active: true }, 
            }))
        
        } else if (user.UserLevelSeq === fields.refBy.roleLevel) {          // 57
            role = {
                ReferrerId: compUserDetail.SubCode,
                MarketedId: compUserDetail.MarketById,
            }
            setFields(pre => ({
                ...pre, 
                refBy: { ...pre.refBy, label: user.UserFullName, active: true }, 
                marketing: { ...pre.marketing, label: compUserDetail.MarketByDesc }, 
                provider: { ...pre.provider, label: '', active: true }
            }))

        } else if (user.UserLevelSeq === fields.provider.roleLevel) {       // 58
            role = {
                ProviderId: compUserDetail.SubCode,
                MarketedId: compUserDetail.MarketById,
            }
            setFields(pre => ({...pre, 
                provider: { ...pre.provider, label: user.UserFullName, active: true },
                marketing: { ...pre.marketing, label: compUserDetail.MarketByDesc },
            }))
        }
        if (Object.keys(role).length) setMemberData(pre => ({ ...pre, ...role }));
    }, [user, compUserDetail])

    const handleMemberFormSubmit = (e) => {
        e.preventDefault();        
        if (memberData.RegMob1.length < 10) return alert('Phone number is invalid, please try again.');
        if (!memberData.MemberName.length) return alert('Please enter the Name.');
        if (!(memberData.GenderDesc.length)) return alert('Please select your gender.');
        if (Number(memberData.Age) <= 0) return alert('Please enter your Age or select Date of Birth.');
        if (!(memberData.State.toString()).length) return alert('Please select your state.');
        if (!memberData.UserType.length) return alert('Error Occured. Please restart the app and try again. Err - 005');
        makeAddMemberRequest(memberData);      
    }

    const makeAddMemberRequest = async (params: any) => {  
        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/api/member/Post`, params);
            setLoading(false);
            if (res.data[0] !== 'N') {
                alert('Successfully Updated the member.')
                dispatch(getMembers(compCode, user.UserId, user.MemberId));
                if (isModal) dispatch(setModal({ name: 'ADD_MEMBER', state: false }))
            } else {
                alert('Something went wrong, try again later.');
            }
        } catch (error) {
            setLoading(false);
            alert('An Error occured. Please try later.')        
            console.log(error);            
        }
    }
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    const marketingInputRef = useRef(null);
    const salesInputRef = useRef(null);
    const refByInputRef = useRef(null);
    const providerInputRef = useRef(null);    
    
    const Card_6 = ({ onPress, data }: any) => {        
        return (
            <Pressable onPress={onPress} className='py-3 px-4 border-b border-gray-300'>
                <Text className='text-[13px] text-white'>{data.Name}</Text>
            </Pressable>
        )
    }

    return (
        <>
            <ScrollView contentContainerClassName='bg-slate-100 min-h-full'>
                <View className={`bg-white p-4 w-full`}> 
                    <Pressable onPress={() => {if (isModal) dispatch(setModal({ name: 'ADD_MEMBER', state: false })); else router.back()}} className='justify-between flex-row pb-4 items-center'>
                        <View className='flex-row items-center gap-3'>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                            <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Add New Member</Text>
                        </View>
                        {/* <View className="gap-3 flex-row items-center ml-auto">
                            <Feather name="heart" size={20} color='black' />
                            <Feather name="share-2" size={20} color='black' />
                        </View> */}
                    </Pressable> 
                    <View className="gap-6 mt-4 min-h-[60%]">
                    <View className="flex-row gap-3">
                        <View className='z-10 flex-1'>
                            <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1"><Required /> Phone Number</Text>
                            <TextInput placeholder='Phone Number' maxLength={10} value={memberData.RegMob1} readOnly className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                        </View>
                        <View className='z-10 flex-1'>
                            <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Member Phone Number</Text>
                            <TextInput placeholder='Member Phone' maxLength={10} value={memberData.Mobile} onChangeText={(text) => setMemberData(pre => ({...pre, Mobile: text }))} className='bg-white p-4 rounded-2xl text-[13px] border-2 border-stone-200' />
                        </View>
                    </View>
                        {/* {!personalFields ? <>
                            <Text className="text-sky-600 text-[13px] font-PoppinsSemibold ml-auto mb-10">We'll send you an OTP !</Text>
                            <ButtonPrimary onClick={handleNext} isLoading={loading} title='SUBMIT' active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                        </> : null} */}

                        <View className="gap-6">
                            <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Personal Information</Text>
                            <View className="flex-row gap-3">
                                <Pressable className='z-10 flex-1' onPress={() => setSalutationDropdown(true)}>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Salutation</Text>
                                    <TextInput placeholder='-Select-' readOnly value={memberData.Salutation} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                    <MyModal modalActive={salutationDropdown} onClose={() => setSalutationDropdown(false)} child={<SalutationDropdown handleSelect={(salutationValue: any) => setMemberData(pre => ({...pre, Salutation: salutationValue}))} />} />
                                </Pressable>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1"><Required /> Member Name</Text>
                                    <TextInput placeholder='Member Name' value={memberData.MemberName} onChangeText={(text) => setMemberData(pre => ({...pre, MemberName: text }))} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                {user.UserLevelSeq === uType.PATIENT.level && <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Relation</Text>
                                    <TextInput placeholder='Relation' value={memberData.RelationShipWithHolder} onChangeText={(text) => setMemberData(pre => ({...pre, RelationShipWithHolder: text }))} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>}


                                <Pressable onPress={() => setGenderDropdown(true)} className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1"><Required /> Gender</Text>
                                    <TextInput readOnly placeholder='Gender' value={memberData.GenderDesc} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                    <MyModal modalActive={genderDropdown} onClose={() => setGenderDropdown(false)} child={<GenderDropdown handleSelect={(genderValue: any) => setMemberData(pre => ({...pre, Gender: genderValue.CodeId, GenderDesc: genderValue.Description}))} />} />
                                </Pressable>


                                <Pressable className='z-10 flex-1' onPress={() => setDobDate(true)}>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">DOB</Text>
                                    <TextInput placeholder='DD/MM/YYYY' readOnly value={memberData.DOB} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                    {dobDate ? <DateTimePicker value={parsedDOB} mode="date" display="default" onChange={(e: any, d: any) => {calculateDuration(new Date(d).toLocaleDateString('en-TT')); setDobDate(false)}} /> : null}
                                </Pressable>
                            </View>

                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1"><Required /> Years</Text>
                                    <TextInput placeholder='00' maxLength={2} value={String(memberData.Age)} onChangeText={(text) => handleNumberInputsWithDate({name: 'Age', value: text})} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Months</Text>
                                    <TextInput placeholder='00' value={String(memberData.AgeMonth)} onChangeText={(text) => handleNumberInputsWithDate({name: 'AgeMonth', value: text})} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Days</Text>
                                    <TextInput placeholder='00' value={String(memberData.AgeDay)} onChangeText={(text) => handleNumberInputsWithDate({name: 'AgeDay', value: text})} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Address</Text>
                                    <TextInput placeholder='Address' value={memberData.Address} onChangeText={(text) => setMemberData(pre => ({...pre, Address: text }))} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">City</Text>
                                    <TextInput placeholder='City' value={memberData.City} onChangeText={(text) => setMemberData(pre => ({...pre, City: text }))} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <Pressable className='z-10 flex-1' onPress={() => setStateDropdown(true)}>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1"><Required /> State</Text>
                                    <TextInput placeholder='State' readOnly value={states.find((opt) => opt.CodeId == memberData.State)?.Description} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                    <MyModal modalActive={stateDropdown} onClose={() => setStateDropdown(false)} child={<StateDropdown />} />
                                </Pressable>
                                <View className='z-10 flex-1'> 
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">Pin Code</Text>
                                    <TextInput placeholder='Pin Code' maxLength={6} value={memberData.Pin} onChangeText={(text) => setMemberData(pre => ({...pre, Pin: text}))} className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' />
                                </View>
                            </View>


                            
                            {user.UserLevelSeq !== uType.PATIENT.level ? <>
                            <Text className="font-PoppinsSemibold text-gray-800 text-[16px]">Other Details</Text>
                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">{compDetail.UnderDoctCaption || 'Executive'}</Text>
                                    <TextInput 
                                        readOnly={!fields.sales.active} 
                                        value={fields.sales.label} 
                                        className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' 
                                        onChangeText={(text) => handleInput('sales', text)} 
                                        ref={salesInputRef}
                                        onPress={() => setSalesOpen(true)}
                                        onBlur={() => setSalesOpen(false)} 
                                    />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">{compDetail.ReferenceByCaption || 'Partner'}</Text>
                                    <TextInput 
                                        readOnly={!fields.refBy.active} 
                                        value={fields.refBy.label} 
                                        onChangeText={(text) => handleInput('refBy', text)} 
                                        className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' 
                                        ref={refByInputRef}
                                        onPress={() => setRefOpen(true)}
                                        onBlur={() => setRefOpen(false)} 
                                    />
                                </View>
                            </View>

                            <View className="flex-row gap-3">
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">{fields.provider.active ? <Required /> : null} Provider</Text>
                                    <TextInput 
                                        readOnly={!fields.provider.active} 
                                        value={fields.provider.label} 
                                        onChangeText={(text) => handleInput('provider', text)} 
                                        className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' 
                                        ref={providerInputRef}
                                        onPress={() => setProviderOpen(true)}
                                        onBlur={() => setProviderOpen(false)} 
                                    />
                                </View>
                                <View className='z-10 flex-1'>
                                    <Text className="text-primary-500 text-[10px] font-PoppinsSemibold absolute z-10 left-5 -top-[8px] bg-white px-1">{fields.marketing.active ? <Required /> : null} {compDetail.MarketedByCaption || 'Business Executive'}</Text>
                                    <TextInput 
                                        ref={marketingInputRef}
                                        onPress={() => setMarketOpen(true)} 
                                        onBlur={() => setMarketOpen(false)} 
                                        readOnly={!fields.marketing.active} 
                                        value={fields.marketing.label} 
                                        onChangeText={(text) => handleInput('marketing', text)} 
                                        className='bg-white p-[12px] rounded-2xl text-[13px] border-2 border-stone-200' 
                                    />

                                </View>
                            </View>
                            </> : ''}
                        </View>
                        {/* <Text className="text-sky-600 text-[13px] font-PoppinsSemibold ml-auto">Please use a strong password</Text> */}
                        <ButtonPrimary onClick={handleMemberFormSubmit} isLoading={loading} title={editId ? 'UPDATE MEMBER' : 'ADD NEW MEMBER'} active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                    </View>
                </View>
            </ScrollView>

            {salesOpen ? 
                <MyDropdown isOpen={salesOpen} setOpen={setSalesOpen} anchorRef={salesInputRef} maxHeight={230} stickTo='top' offsetY={-40} dataList={selesList.data}>
                    {({ data }: any) => <Card_6 data={data} onPress={() => selectItem(data, 'sales')} />}
                </MyDropdown>       
            : null} 

            {refOpen ? 
                <MyDropdown isOpen={refOpen} setOpen={setRefOpen} anchorRef={refByInputRef} maxHeight={230} stickTo='top' offsetY={-40} dataList={refList.data}>
                    {({ data }: any) => <Card_6 data={data} onPress={() => selectItem(data, 'refBy')} />}
                </MyDropdown>       
            : null} 

            {providerOpen ? 
                <MyDropdown isOpen={providerOpen} setOpen={setProviderOpen} anchorRef={providerInputRef} maxHeight={230} stickTo='top' offsetY={-40} dataList={providerList.data}>
                    {({ data }: any) => <Card_6 data={data} onPress={() => selectItem(data, 'provider')} />}
                </MyDropdown>       
            : null} 

            {marketOpen ? 
                <MyDropdown isOpen={marketOpen} setOpen={setMarketOpen} anchorRef={marketingInputRef} maxHeight={230} stickTo='top' offsetY={-40} dataList={marketList.data}>
                    {({ data }: any) => <Card_6 data={data} onPress={() => selectItem(data, 'marketing')} />}
                </MyDropdown>       
            : null}
            

            {/* {salesOpen ? 
                <MyDropdown isOpen={salesOpen} setOpen={setSalesOpen} anchorRef={salesInputRef} maxHeight={230} stickTo='top' offsetY={-40}>
                    {() => (
                        <FlatList
                            data={selesList.data}
                            keyExtractor={(_, i) => i.toString()}
                            showsVerticalScrollIndicator
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => <Card_6 data={item} onPress={() => selectItem(item, 'sales')} />}
                        />
                    )}
                </MyDropdown>       
            : null}  */}

            {/* {refOpen ? 
                <MyDropdown isOpen={refOpen} setOpen={setRefOpen} anchorRef={refByInputRef} maxHeight={230} stickTo='top' offsetY={-40}>
                    {() => (
                        <FlatList
                            data={refList.data}
                            keyExtractor={(_, i) => i.toString()}
                            showsVerticalScrollIndicator
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => <Card_6 data={item} onPress={() => selectItem(item, 'refBy')} />}
                        />
                    )}
                </MyDropdown>       
            : null} 

            {providerOpen ? 
                <MyDropdown isOpen={providerOpen} setOpen={setProviderOpen} anchorRef={providerInputRef} maxHeight={230} stickTo='top' offsetY={-40}>
                    {() => (
                        <FlatList
                            data={providerList.data}
                            keyExtractor={(_, i) => i.toString()}
                            showsVerticalScrollIndicator
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => <Card_6 data={item} onPress={() => selectItem(item, 'provider')} />}
                        />
                    )}
                </MyDropdown>       
            : null} 

            {marketOpen ? 
                <MyDropdown isOpen={marketOpen} setOpen={setMarketOpen} anchorRef={marketingInputRef} maxHeight={230} stickTo='top' offsetY={-40}>
                    {() => (
                        <FlatList
                            data={marketList.data}
                            keyExtractor={(_, i) => i.toString()}
                            showsVerticalScrollIndicator
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => <Card_6 data={item} onPress={() => selectItem(item, 'marketing')} />}
                        />
                    )}
                </MyDropdown>       
            : null} */}
        </>
    )
}

export default AddMember;

const useListFetch = (url: string, compCode: string, searchQuery: string) => {
  const [isOpen, setOpen] = useState(false); 
  const [list, setList] = useState({loading: false, data: [], err: {status: false, msg: ''}});
  
  useEffect(() => {
      const getList = async (compId: string, query: string) => {                      
          if (!compId) return alert('no companyCode received');     
          if (query.length < 2) return;     
        //   setOpen(true);                    
          const res = await getFrom(url, {}, setList);
          if (res) {                                                                   
              setList(res);
          } else {
              console.log('No data received');
          }
      }  
      const timer = setTimeout(() => {
          getList(compCode, searchQuery);                                              
      }, 500);
      return () => clearTimeout(timer);
  }, [searchQuery, compCode])   

  return [isOpen, setOpen, list, setList];
}