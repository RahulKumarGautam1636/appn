import { View, Text, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native';
import { Entypo, Feather, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import ButtonPrimary, { LinkBtn, MyModal } from '@/src/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { CartCard, createDate, num, sliceBaseStr, wait } from '@/src/components/utils';
import { dumpCart, setModal, setPrescription } from '@/src/store/slices/slices';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import CheckDelivery from '@/app/shop/checkDelivery';
import { BASE_URL } from '@/src/constants';
import axios from 'axios';

const B2CCheckout = () => {

  const location = useSelector((i: RootState) => i.appData.location);
  const user = useSelector((i: RootState) => i.user);
  // const compInfo = useSelector((i: RootState) => i.company.info);
  const compCode = useSelector((i: RootState) => i.compCode);
  const selectedMember = useSelector((i: RootState) => i.members.selectedMember);
  const cart = useSelector((i: RootState) => i.cart);
  const cartItems = Object.values(cart);   
  const dispatch = useDispatch();  
  const router = useRouter()     

  const cartItemsValueList = cartItems.map(item => item.count * item.SRate);                    
  const cartSubtotal = num(cartItemsValueList.reduce((total, num) => total + num, 0));           

  const cartItemsMRPList = cartItems.map(item => item.count * item.ItemMRP);                    
  const grossTotal = num(cartItemsMRPList.reduce((total, num) => total + num, 0));  
  
  const cartItemsDiscountList = cartItems.map(item => ((item.ItemMRP * item.DiscountPer) / 100) * item.count);                  
  const discountTotal = num(cartItemsDiscountList.reduce((total, num) => total + num, 0)); 
  const [loading, setLoading] = useState(false);
  const [onlyOTC, setOnlyOTC] = useState(false);
  
  // NEW WORK ===================================================================================================================================

  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  // const vType = useSelector((i: RootState) => i.company.vType);
  const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
  const prescription = useSelector((i: RootState) => i.appData.prescription);
  const [orderData, setOrderData] = useState({
    PartyCode: '',
    InsBy: '',              
    PaymentMethod: 'COD',
    Amount: '',
    EncCompanyId: '',
    SalesDetailsList: [],                               

    BillingState: user.State,
    BillingAddress: user.Address + ' ' + user.Address2 + ' ' + user.Pin,
    DeliveryParty: user.PartyCode,
    DeliveryState: user.State,
    DeliveryAddress : user.Address + ' ' + user.Address2 + ' ' + user.Pin,
    LocationId: '',

    UnderDoctId: 0,
    ReferrerId: 0,
    ReferrerId1: 0,
    MarketedId: 0,
    DeptId: 0,
    BedCatId: 0,
    CollectedById: 0,  
    CashPartyMobile: '', 
    VisitId: 0,
  });

  const [isDeliverable, setDeliverable] = useState(false);
  const [locationModalActive, setLocationModalActive] = useState(false);
  const closeModal = () => setLocationModalActive(false);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setModal({name: 'LOGIN', state: true}))
      return;
    } else {
      setLocationModalActive(true);
    }
  }, [user.Pin, isLoggedIn, locationId])

  useEffect(() => {
    const noOTCitem = cartItems.find((i: any) => i.Category !== 23485);
    if (!noOTCitem) setOnlyOTC(true);
  }, [cartItems])

  let orderList = useMemo(() => {
      let items = cartItems.map(i => ({             
        Description: i.Description,      
        BillQty: i.count,                                                              
        ItemId: i.ItemId,                                                              
        AutoId: i.AutoId,
        Unit: i.Unit,
        MRP: i.ItemMRP,
        PackSizeId: i.PackSizeId ? i.PackSizeId : 0,
        MRPOnDisPer: i.DiscountPer,
        Rate: num(((i.count * i.SRate) - (((i.count * i.SRate * i.IGSTRATE) / (i.IGSTRATE + 100))))/i.count),
        TaxableAmount: num((i.count * i.SRate) - ((i.count * i.SRate * i.IGSTRATE) / (i.IGSTRATE + 100))),
        Amount: i.count * i.SRate,
        CGSTRATE: i.CGSTRATE,
        SGSTRATE: i.SGSTRATE,
        IGSTRATE: i.IGSTRATE,
        Specification: i.Specification,
        LocationId: i.LocationId
    }))
    return items;
  } ,[cart])   
  
  useEffect(() => {
      async function init() {   
          if (isLoggedIn) {
              let cashPartyName;
              let cashPartyMobile; 
              let partyCode;
              let billingState;
              let deliveryState;

              cashPartyName = prescription.patient.name || user.Name;
              cashPartyMobile = prescription.patient.phone || user.RegMob1;  
              partyCode = user.PartyCode;
              billingState = user.State;
              deliveryState = prescription.patient.state?.CodeId || user.State;  

              setOrderData((preValues) => ({
                  ...preValues,
                  InsBy: user.UserId,              
                  PaymentMethod: 'COD',
                  Amount: cartSubtotal,
                  EncCompanyId: compCode,
                  SalesDetailsList: orderList, 

                  BillingState: billingState,
                  DeliveryState: deliveryState,

                  BillingAddress: user.Address + ' ' + user.Address2 + ' ' + user.Pin,
                  DeliveryAddress : user.Address + ' ' + user.Address2 + ' ' + user.Pin,
                  LocationId: locationId,

                  PartyCode : partyCode,
                  DeliveryParty: selectedMember.PartyCode || user.PartyCode,
                  ReferenceBy: prescription.patient.docName || '',
                  DoctorLocation: prescription.patient.docAddress || '',

                  CashPartyName: cashPartyName,
                  CashPartyMobile: cashPartyMobile,

                  // --------- NEW FIELDS FOR RESTAURANT STARTS ---------------------------------------

                  BillId: 0,
                  BedCatId: 0,
                  BedId: 0,
                  CollectedById: 0,
                  
                  // --------- NEW FIELDS FOR RESTAURANT ENDS ---------------------------------------

                  UnderDoctId: user.UnderDoctId,
                  ReferrerId: user.ReferrerId,
                  ReferrerId1: user.ProviderId,
                  MarketedId: user.MarketedId,
                  DeptId: user?.UserCompList?.PahrmaDeptId,

                  AccPartyMemberMaster: {
                    Salutation: '',
                    MemberName : prescription.patient.name || user.Name,
                    EncCompanyId: compCode,    
                    RegMob1: user.RegMob1,
                    Gender: prescription.patient.gender?.CodeId || user.Gender,
                    GenderDesc: prescription.patient.gender?.GenderDesc || user.GenderDesc,
                    Address: prescription.patient.address || user.Address,
                    Age: prescription.patient.age || user.Age,
                    AgeMonth: '0',
                    AgeDay: '0',           

                    State: prescription.patient.state?.CodeId || user.State,
                    City: prescription.patient.city || user.City,
                    Pin: prescription.patient.pinCode || user.Pin,
                    Landmark: '',

                    ParentUserId: user.UserId,
                    MemberId: prescription.patient.memberId || user.MemberId,
                    MemberTypeId : 0,
                    UserType: user.UserType,
                    UID: '',
                    UserId: prescription.patient.name ? prescription.patient.userId : user.UserId,      // if prescription patient is set the use it's userId. if its not set then current user must be parent user.,
                    
                    DOB: prescription.patient.age ? createDate(0, 0, prescription.patient.age) : new Date(user.DOB).toLocaleDateString('en-TT'),
                    DOBstr: prescription.patient.age ? createDate(0, 0, prescription.patient.age) : new Date(user.DOB).toLocaleDateString('en-TT'),
                    IsDOBCalculated: 'N',
                    Aadhaar: '',
                    ParentAadhaar1: '',
                    ParentAadhaar2: '',
                    RelationShipWithHolder: '',
                    Mobile: prescription.patient.phone || user.RegMob1,
                    Country: 1
                  },

                  EnclosedDocObj: {
                    EnclosedDocList: [
                      {
                        EnclosedId: '0',
                        AppId: '0',
                        EmpId: prescription.patient.memberId || user.MemberId,              
                        AppType: 'Order',
                        EncloserType: '',
                        EncloserTypeDesc: '',
                        FileName: '',
                        FilePath: '',
                        Description: 'Prescription',
                        EnclosedDate: '',
                        EnclosedTime: '',
                        EnclosedDocList: '',
                        EnclosedDeleteDocList: '',
                        Remarks: prescription.file.name || '',           
                        FileExtension: prescription.file.extn,
                        filesToUpload: ''          // avoid using large base64 url. will set in placeOrder.
                      }
                    ]
                  }
              }))

          } else {
              setOrderData((preValues) => ({
                  ...preValues,
                  PartyCode: '0',
                  InsBy: '0',
                  BillingState: '',
                  BillingAddress: '',
                  DeliveryParty: '',
                  DeliveryState: '',
                  DeliveryAddress : '',
                  ReferenceBy: '',
                  DoctorLocation: '',
              }))
          }
      }
      init();
  },[isLoggedIn, user, cartSubtotal, compCode, orderList, locationId, prescription.file.uri])
  
  const placeOrder = async () => {
    if (!cartItems.length) return alert('Please add some products to place an order.');
    if (!isLoggedIn) return alert('Please login to place an order.');
    if (!orderData.LocationId) return alert('Please select a Service Location before making an order.');

    let body = { ...orderData };  
    
    if (prescription.file.extn) {
      const fileString = await sliceBaseStr(prescription.file.uri);             
      body.EnclosedDocObj.EnclosedDocList[0].filesToUpload = fileString;        
    }

    try {     
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/Pharma/Post`, body);    // { data : 'Y', status: 200 }
      await wait(3000);
      setLoading(false);
      if (res.data === 'N' || res.status !== 200) {return alert('Failed to Place Order.');};
      dispatch(dumpCart());
      dispatch(setPrescription({ patient: { docName: '', docAddress: '' }, file: { name: '', uri: '', type: '', fileType: '', extn: '' } }))
      alert('Order Booked Successfully.')
      router.push('/shop/tabs/orders')
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  

  return (
    <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
          <Text className="text-lg font-semibold text-black">Checkout</Text>
        </TouchableOpacity>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Bill To</Text>
      <View className="bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200 flex-row items-center gap-4">
        <View className='w-[4rem] h-[4rem] bg-purple-50 shadow-sm rounded-2xl items-center justify-center'>
          {/* <FontAwesome6 name="location-arrow" size={34} color={colors.purple[600]} /> */}
          <Ionicons name="person" size={31} color={colors.purple[600]} />
        </View>
        <View className="flex-1">
          <View className='justify-between flex-row mb-2'>
              <Text className="text-base font-medium text-black">{user.Name}</Text>
              {/* <TouchableOpacity onPress={() => {}} className="">
                <FontAwesome name="pencil" size={20} color={colors.blue[500]} />
              </TouchableOpacity> */}
          </View>
          <View className="flex-row items-center gap-3  mb-1">
            <FontAwesome6 name="phone-volume" size={12} color={colors.orange[500]} />
            <Text className="text-gray-600">{user.RegMob1}</Text>
          </View>
        </View>
      </View>
      {prescription.required ? <>
        <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Patient Details</Text>
        <View className='bg-white rounded-2xl p-5 shadow-md shadow-gray-400'>
            <View className='flex-row items-center'>
                <Image className='shadow-lg rounded-full me-3' source={require('@/assets/images/user.png')} style={{ width: 40, height: 40 }} />
                <View>
                    <Text className="font-PoppinsBold text-[14px]">{selectedMember.MemberName}</Text>
                    <Text className="font-Poppins text-gray-500 text-[11px]">{selectedMember.RelationShipWithHolder}</Text>
                </View>
                <Pressable onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} className="ms-auto">
                    <FontAwesome name="pencil" size={24} color="#2563eb"/>
                </Pressable>
            </View>
            <View className='py-3 px-4 bg-gray-100 mt-4 rounded-xl flex gap-3 flex-row'>
                <MaterialIcons name="av-timer" size={17} color="#000" />
                <Text className="font-Poppins text-gray-500 text-[13px] me-auto leading-5">{selectedMember.Age} Years</Text>
                <Ionicons name="male-female" size={17} color="#000" />
                <Text className="font-Poppins text-gray-500 text-[13px] leading-5">{selectedMember.GenderDesc}</Text>
            </View>
            <Text className="text-sm py-3 text-gray-500">
            <Text className="text-primary-500 font-Poppins">Address : </Text>{selectedMember.Address}</Text>
            <ButtonPrimary title='Change Patient' onPress={() => dispatch(setModal({ name: 'MEMBERS', state: true }))} classes='!h-[43px] bg-sky-50 border-dashed border border-blue-500 mt-1' textClasses='text-sm' />
        </View>
        {onlyOTC ? null : <>
          <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Your Prescription</Text>
          {prescription.file.name ? 
          <TouchableOpacity onPress={() => dispatch(setModal({name: 'PRESC', state: true}))} className="bg-white rounded-2xl border-b border-gray-200 p-5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 gap-4">
              {prescription.file.fileType === 'image' ? <Image source={{ uri: prescription.file.uri }} className="w-14 h-14 rounded-xl border border-gray-100" resizeMode="cover" /> : null}
              <View className="flex-1">
                <Text className="font-semibold text-indigo-500 mb-2">{prescription.file.name}</Text>
                <Text className="text-sm text-gray-500">{prescription.file.fileType}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="chevron-right" size={23} color="gray" />
            </TouchableOpacity>
          </TouchableOpacity> :
          <TouchableOpacity onPress={() => dispatch(setModal({name: 'PRESC', state: true}))} className="bg-indigo-500 rounded-2xl p-5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-indigo-400 rounded-full items-center justify-center mr-4"> 
                <Feather name="plus" size={28} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-white mb-2">Please Attach your prescription.</Text>
                <Text className="text-sm text-gray-100">In order to place your order.</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="chevron-right" size={23} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>}
        </>}
      </> : null}
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Address Details</Text>
      <View className='bg-white rounded-3xl px-4 py-2 shadow-sm border-b border-gray-200'>
          <View className='justify-between flex-row px-1 py-[0.9rem] items-start gap-4'>
              <View className='flex-row items-center gap-3'>
                  <Text className="text-slate-600 font-bold text-[12px] items-center leading-5">Address :</Text>
              </View>
              <Text className="text-slate-700 text-[12px] ml-auto leading-5 flex-1 text-right">{user.Address2}, {user.Address}, {user.City}, {user.StateName}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">Pin Code :</Text>
              <Text className="text-[12px] text-slate-700">{user.Pin}</Text>
          </View>
          <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">Phone Number</Text>
              <Text className="text-[12px] text-slate-700">{user.RegMob1}</Text>
          </View>
          {user.Email ? <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
              <Text className="text-slate-600 font-bold text-[12px] mr-auto">E-mail :</Text>
              <Text className="text-[12px] text-slate-700">{user.Email}</Text>
          </View> : null}
          <ButtonPrimary onClick={() => {}} title='Edit Address' active={true} classes='!rounded-2xl !h-[43px] mt-4 mb-2 w-fit px-10 ml-auto' textClasses='tracking-widest' />
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Service Location</Text>
      <View className='bg-white rounded-3xl p-4 shadow-sm border-b border-gray-200'>
        <View className="flex-row items-center gap-4">
          <View className='w-[4rem] h-[4rem] bg-pink-50 shadow-sm rounded-2xl items-center justify-center'>
            {/* <FontAwesome6 name="location-arrow" size={34} color={colors.purple[600]} /> */}
            <Entypo name="location" size={31} color={colors.pink[600]} />
          </View>
          <View className="flex-1">
            <View className='justify-between flex-row mb-2'>
                <Text className="text-base font-medium text-black">{location.LocationName}</Text>
            </View>
            <View className="flex-row items-center gap-3  mb-1">
              <Text numberOfLines={1} className="text-gray-600 text-sm">{location.Address}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Your Order List</Text>
      <View className='gap-3'>
        {cartItems.map((item) => (<CartCard data={item} key={item.LocationItemId} />))}
      </View>
      <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Billing Details</Text>
      <View className='bg-white rounded-3xl shadow-sm mb-4 border-b border-gray-200'>
          <View className='justify-between flex-row px-5 py-4 items-center'>
              <View className='flex-row items-center gap-3'>
                  <Text className="font-PoppinsSemibold text-gray-500 text-[13px] items-center leading-5">Gross Amount</Text>
              </View>
              <Text className="font-PoppinsSemibold text-slate-700 text-[13px] ml-auto leading-5">{grossTotal}</Text>
          </View>
          <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
              <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Less Discount</Text>
              <Text className="font-PoppinsSemibold text-[13px] text-slate-700">- {discountTotal}</Text>
          </View>
          <View className='flex-row gap-3 px-5 py-4 border-y border-gray-200'>
              <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Service Charge</Text>
              <Text className="font-PoppinsSemibold text-[13px] text-slate-700">+ 58.88</Text>
          </View>
          <View className='flex-row gap-3 px-5 py-4'>
              <Text className="font-PoppinsSemibold text-slate-500 text-[13px] mr-auto">Payable Amount</Text>
              <Text className="font-PoppinsSemibold text-[13px] text-slate-700">₹ {cartSubtotal}</Text>
          </View>
      </View>
      <View className="">
          <View className="flex-row justify-between items-center mt-2 mb-4">
              <Text className="text-md text-gray-600 font-semibold">Grand Total</Text>
              <Text className="text-2xl font-bold text-sky-800">₹ {cartSubtotal}</Text>
          </View>

        {(!onlyOTC && prescription.required) ? <>
          {!prescription.file.name && <Text className='text-rose-500 text-sm mb-3'>Please Attach your prescription to place an order.</Text>}
        </> : ''}
        {isDeliverable ? null : <Pressable onPress={() => setLocationModalActive(true)}><Text className='text-blue-600 text-sm mb-3 font-medium'>Now we have no service at your PIN code. Click to know more.</Text></Pressable>}
        <ButtonPrimary onClick={placeOrder} title='PLACE ORDER' isLoading={loading} active={true} classes={`${(onlyOTC || (isLoggedIn && isDeliverable && prescription.file.name) || !prescription.required) ? 'flex-1 !rounded-2xl !bg-gray-700' : 'pointer-events-none !bg-gray-400'}`} />
        {/* <LinkBtn href={'/shop/tabs/orders'} title='VIEW ORDERS' isLoading={false} active={true} classes='flex-1 !rounded-2xl !bg-gray-700' /> */}

        <MyModal modalActive={locationModalActive} name='CHECK_DELIVERY' child={<CheckDelivery LOCID={locationId} setDeliverable={setDeliverable} closeModal={closeModal} />} />
      </View>
      
    </ScrollView>
  );
};

export default B2CCheckout;