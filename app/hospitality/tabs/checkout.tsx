import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, MapPin, Search, SendHorizontal, X } from 'lucide-react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { BASE_URL, XYZ_ID } from '@/src/constants';
import { useRouter } from 'expo-router';
import { getFrom, GridLoader, num, ProductCard } from '@/src/components/utils';
import axios from 'axios';
import { addToCart, dumpCart, removeFromCart, setModal, setRestaurant } from '@/src/store/slices/slices';
import colors from 'tailwindcss/colors';
import { getRequiredFields } from '@/src/components/utils/shared';

// Note: Make sure to install and configure NativeWind in your project
// npm install nativewind
// npm install --save-dev tailwindcss
// Also install: expo-linear-gradient

export default function RestaurantBooking() {
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'CHICKEN HARIYALI', quantity: 1, rate: 350, checked: true },
    { id: 2, name: 'CHICKEN MALAI TIKKA', quantity: 1, rate: 350, checked: true },
    { id: 3, name: 'Chicken 65', quantity: 2, rate: 330, checked: true },
  ]);

  const [tableNumber, setTableNumber] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateQuantity = (id, increment) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) }
          : item
      )
    );
  };

  const toggleCheck = (id) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  };

  // NEW WORK

  const { vType, info: compInfo } = useSelector((i: RootState) => i.company);
  const cart = useSelector((i: RootState) => i.cart);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const userInfo = useSelector((i: RootState) => i.user);
  const compCode = useSelector((i: RootState) => i.compCode);
  const appData = useSelector((i: RootState) => i.appData);
  const selectedMember = useSelector((i: RootState) => i.members.selectedMember);
  const dispatch = useDispatch();
  const router = useRouter();                                                            // Delete one of them.
  const locationId = appData.location.LocationId;
  const isRestaurant = (vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT');
  let b2bMode = appData.userRegType.CodeValue === 'Retailer';
  
  useEffect(() => {
      if (compCode === XYZ_ID || isRestaurant) return;
      let cartArray = Object.values(cart);                                                               
      let stockQtyList = cartArray.map(item => item.StockQty);                      
      if (stockQtyList.includes(0)) {
          alert('Please Remove or move to wishlist, out of Stock Products in your cart to continue.');
          router.push('/cartPage');
      }
  }, [])

  // -------------- Prescription start ------------------------------------------------------------------------------------------------
  const prescription = appData.prescription;
      
  // -------------- Prescription ends ------------------------------------------------------------------------------------------------

  const cartArray = Object.values(cart);                                                                // Convert cart object into list.
  const cartItemsValueList = cartArray.map(item => item.count * item.SRate);                                     // Array of all item's price * quantity selected.
  const cartSubtotal = parseFloat(cartItemsValueList.reduce((total, num) => total + num, 0).toFixed(2));         // .toFixed converts it into string so using parsefloat.
  //   const [couponTab, setCouponTab] = useState(false);

  console.log(cartArray);
  
  // B2B SUMMARY START----------------------------------------------------------------------------------------------------

  // const cartArrayLength = cartArray.length;                   

  const b2bItemsValueList = cartArray.map(item => item.count * item.PTR);                      
  const b2bSubtotal = num(b2bItemsValueList.reduce((total, num) => total + num, 0));    
  
  // const cartItemsMRPValueList = cartArray.map(item => item.count * item.ItemMRP);                      
  // const cartMRPtotal = num(cartItemsMRPValueList.reduce((total, num) => total + num, 0)); 

  const cartItemsDiscount = cartArray.map(item => ((item.PTR * item.count) * (item.DiscountPer / 100 )));                      
  const cartDiscount = num(cartItemsDiscount.reduce((total, num) => total + num, 0)); 

  const cartItemsGSTValueList = cartArray.map(i => {
      let taxbleAmt = num((i.count * i.PTR)- ((i.count * i.PTR) * (i.DiscountPer / 100 )));
      let cgst = num(taxbleAmt * (i.CGSTRATE / 100));
      let sgst = num(taxbleAmt * (i.SGSTRATE / 100));
      return num(sgst + cgst);
  }); 
                  
  const cartGSTtotal = num(cartItemsGSTValueList.reduce((total, num) => total + num, 0));  
  const b2bGrandTotal = num(b2bSubtotal - cartDiscount + cartGSTtotal); 

  // B2B SUMMARY ENDS-----------------------------------------------------------------------------------------------------
  
  const [orderData, setOrderData] = useState({
      PartyCode: '',
      InsBy: '',              
      PaymentMethod: 'COD',
      Amount: '',
      EncCompanyId: '',
      SalesDetailsList: [],                               

      BillingState: userInfo.State,
      BillingAddress: userInfo.Address + ' ' + userInfo.Address2 + ' ' + userInfo.Pin,
      DeliveryParty: userInfo.PartyCode,
      DeliveryState: userInfo.State,
      DeliveryAddress : userInfo.Address + ' ' + userInfo.Address2 + ' ' + userInfo.Pin,

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
  
  const [locationModalActive, setLocationModalActive] = useState(false);
  const [isDeliverable, setDeliverable] = useState(false);
  const [selectedServiceLocation, setSelectedServiceLocation] = useState({ LocationName: '', Address: '', PIN: '' });
  
  let orderList = useMemo(() => {
      let cartList = Object.values(cart);
      let items = [];

      if (b2bMode) {
          items = cartList.map(i => {
              let taxbleAmt = num((i.count * i.PTR)- ((i.count * i.PTR) * (i.DiscountPer / 100 )));
              let cgst = num(taxbleAmt * (i.CGSTRATE / 100));
              let sgst = num(taxbleAmt * (i.SGSTRATE / 100));
              let amount = num(taxbleAmt + sgst + cgst);
              return {             
                  Description: i.Description,      
                  BillQty: i.count,                                                              
                  ItemId: i.ItemId,                                                              
                  AutoId: i.AutoId,
                  Unit: i.Unit,
                  MRP: i.ItemMRP,
                  PackSizeId: i.PackSizeId ? i.PackSizeId : 0,

                  Rate: i.PTR,
                  Discount: i.DiscountPer,
                  DiscountText: num((i.count * i.PTR) - taxbleAmt),
                  TaxableAmount: taxbleAmt,
                  Amount: amount,
                  SGST: sgst,
                  CGST: cgst,

                  CGSTRATE: i.CGSTRATE,
                  SGSTRATE: i.SGSTRATE,
                  IGSTRATE: i.IGSTRATE,
                  Specification: i.Specification,
                  LocationId: i.LocationId
              }
          })
      } else if (isRestaurant) {
          items = cartList.map(i => {
              let taxbleAmt = num((i.count * i.SRate)- ((i.count * i.SRate) * (i.DiscountPer / 100 )));
              let cgst = num(taxbleAmt * (i.CGSTRATE / 100));
              let sgst = num(taxbleAmt * (i.SGSTRATE / 100));
              let amount = num(taxbleAmt + sgst + cgst);
              return {             
                  Description: i.Description,      
                  BillQty: i.count,                                                              
                  ItemId: i.ItemId,                                                              
                  AutoId: i.AutoId,
                  Unit: i.Unit,
                  MRP: i.ItemMRP,
                  PackSizeId: i.PackSizeId ? i.PackSizeId : 0,

                  // Discount: i.DiscountPer,
                  // DiscountText: num((i.count * i.SRate) - taxbleAmt),
                  Rate: i.SRate,
                  TaxableAmount: taxbleAmt,
                  Amount: amount,
                  SGST: sgst,
                  CGST: cgst,

                  CGSTRATE: i.CGSTRATE,
                  SGSTRATE: i.SGSTRATE,
                  IGSTRATE: i.IGSTRATE,
                  Specification: i.Specification,
                  LocationId: i.LocationId
              }
          })
      } else {
          items = cartList.map(i => ({             
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
      }
      return items;
  } ,[cart])   

  const restaurantTable = appData.restaurant.table;
  
  useEffect(() => {
      async function init() {   
          if (isLoggedIn) {
              let cashPartyName;
              let cashPartyMobile; 
              let partyCode;
              let billingState;
              let deliveryState;

              if (isRestaurant) {
                  cashPartyName = '';
                  cashPartyMobile = '';
                  partyCode = compInfo.DefaultCashParty;
                  billingState = compInfo.StateId || userInfo.State;          // Remove userInfo.Satete when compInfo.StateId is available.
                  deliveryState = compInfo.StateId || userInfo.State;

              } else {
                  cashPartyName = prescription.patient.name || userInfo.Name;
                  cashPartyMobile = prescription.patient.phone || userInfo.RegMob1;  
                  partyCode = userInfo.PartyCode;
                  billingState = userInfo.State;
                  deliveryState = prescription.patient.state?.CodeId || userInfo.State;
              }

              setOrderData((preValues) => ({
                  ...preValues,
                  InsBy: userInfo.UserId,              
                  PaymentMethod: 'COD',
                  Amount: b2bMode ? b2bGrandTotal : cartSubtotal,
                  EncCompanyId: compCode,
                  SalesDetailsList: orderList, 

                  BillingState: billingState,
                  DeliveryState: deliveryState,

                  BillingAddress: userInfo.Address + ' ' + userInfo.Address2 + ' ' + userInfo.Pin,
                  DeliveryAddress : userInfo.Address + ' ' + userInfo.Address2 + ' ' + userInfo.Pin,
                  LocationId: locationId,
                  // filesToUpload: prescription,

                  PartyCode : partyCode,
                  DeliveryParty: selectedMember.PartyCode || userInfo.PartyCode,
                  ReferenceBy: prescription.patient.docName || '',
                  DoctorLocation: prescription.patient.docAddress || '',

                  CashPartyName: cashPartyName,
                  CashPartyMobile: cashPartyMobile,

                  // --------- NEW FIELDS FOR RESTAURANT STARTS ---------------------------------------

                  BillId: restaurantTable?.ProvInvBillid || 0,
                  BedCatId: restaurantTable?.BedGroupId || 0,
                  BedId: restaurantTable?.BedId || 0,
                  CollectedById: '',
                  
                  // --------- NEW FIELDS FOR RESTAURANT ENDS ---------------------------------------

                  UnderDoctId: userInfo.UnderDoctId,
                  ReferrerId: userInfo.ReferrerId,
                  ReferrerId1: userInfo.ProviderId,
                  MarketedId: userInfo.MarketedId,
                  DeptId: userInfo?.UserCompList?.PahrmaDeptId,

                  AccPartyMemberMaster: {
                      Salutation: '',
                      MemberName : prescription.patient.name || userInfo.Name,
                      EncCompanyId: compCode,    
                      RegMob1: userInfo.RegMob1,
                      Gender: prescription.patient.gender?.CodeId || userInfo.Gender,
                      GenderDesc: prescription.patient.gender?.GenderDesc || userInfo.GenderDesc,
                      Address: prescription.patient.address || userInfo.Address,
                      Age: prescription.patient.age || userInfo.Age,
                      AgeMonth: '0',
                      AgeDay: '0',           

                      State: prescription.patient.state?.CodeId || userInfo.State,
                      City: prescription.patient.city || userInfo.City,
                      Pin: prescription.patient.pinCode || userInfo.Pin,
                      Landmark: '',

                      ParentUserId: userInfo.UserId,
                      MemberId: prescription.patient.memberId || userInfo.MemberId,
                      MemberTypeId : 0,
                      UserType: userInfo.UserType,
                      UID: '',
                      UserId: prescription.patient.memberId ? prescription.patient.userId : userInfo.UserId,
                      
                      DOB: prescription.patient.age ? createDate(0, 0, prescription.patient.age) : new Date(userInfo.DOB).toLocaleDateString('en-TT'),
                      DOBstr: prescription.patient.age ? createDate(0, 0, prescription.patient.age) : new Date(userInfo.DOB).toLocaleDateString('en-TT'),
                      IsDOBCalculated: 'N',
                      Aadhaar: '',
                      ParentAadhaar1: '',
                      ParentAadhaar2: '',
                      RelationShipWithHolder: '',
                      Mobile: prescription.patient.phone || userInfo.RegMob1,
                      Country: 1
                  },

                  // EnclosedDocObj: {
                  //     EnclosedDocList: [
                  //         {
                  //             EnclosedId: '0',
                  //             AppId: '0',
                  //             EmpId: prescription.patient.memberId || userInfo.MemberId,              // memberid ||  || ||0
                  //             AppType: 'Order',
                  //             EncloserType: '',
                  //             EncloserTypeDesc: '',
                  //             FileName: '',
                  //             FilePath: '',
                  //             Description: 'Prescription',
                  //             EnclosedDate: '',
                  //             EnclosedTime: '',
                  //             EnclosedDocList: '',
                  //             EnclosedDeleteDocList: '',
                  //             Remarks: prescription.imgName || '',            // img nam || name
                  //             FileExtension: prescription.extn,
                  //             filesToUpload: ''
                  //         }
                  //     ]
                  // }
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
                  // filesToUpload: {},
                  ReferenceBy: '',
                  DoctorLocation: '',
              }))
          }
      }
      init();
  },[isLoggedIn, userInfo, cartSubtotal, compCode, orderList, locationId, prescription.src, restaurantTable?.ProvInvBillid, restaurantTable?.BedId])
  
  const placeOrder = async () => {
      
      if (!isLoggedIn) return alert('please login to place an order.');
      if (!orderData.LocationId) return alert('Please select a Service Location before making an order.');

      if (!isRestaurant) {
          if (!orderList.length) return alert('Add something to your cart before making an order.');
      }
      
      let body = { ...orderData };

      if (!restaurantTable?.BedId) return alert('Please select a Table to place an order.');

      return console.log(body);      

      try {
          // loaderAction(true);
          const res = await axios.post(`${BASE_URL}/api/Pharma/Post`, body); // { status: 200, data: "31725,KOT/000013" } 
          // loaderAction(false);
          if (res.data === 'N' || res.status !== 200) {return alert('Failed to Place Order.');};
          dispatch(dumpCart());
          if (isRestaurant) {
              router.push(`/hospitality/orderPrint?id=${res.data.split(',')[0]}`);
              dispatch(setRestaurant({ table: {} }))
              setPreviousOrder({loading: false, data: { SalesObj: { SalesDetails: [] } }, err: {status: false, msg: ''}});
              setCustomer({ customerName: '', customerPhone: '' });
              setSelectedWaiter({ Name: '', PartyCode: '' });
          } else {
              // modalAction('ORDER_SUCCESS_MODAL', true);
              // globalDataAction({ prescription: { required: prescription.required, patient: {docName: '', docAddress: '' }} });
          }
      } catch (err) {
          console.log(err);
          return false;
      }
  }


//   ---------------------------------------------------------------------------------------------------------------------------------------

  const [searchWaiter, setSearchWaiter] = useState({waiterName: '', filterTerm: 'All', filterId: 0});    
  const [searchList, setSearchList] = useState({loading: false, data: [], err: {status: false, msg: ''}});
  const [waiterSearchResultsActive, setWaiterSearchResultsActive] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState({ Name: '', PartyCode: '' });
  const [customer, setCustomer] = useState({ customerName: '', customerPhone: '' });

  const handleWaiterSearch = (name: string, value: string) => {
      setSearchWaiter(pre => ({...pre, [name]: value}));
      if (value === '') setSelectedWaiter({ Name: '', PartyCode: '' }); 
  }    

  useEffect(() => {
  if (!isRestaurant) return;
  const getSearchResult = async (companyCode, key) => {                      
      if (!companyCode) return alert('no companyCode received');                  
      const res = await getFrom(`${BASE_URL}/Api/Values/Get?CID=${companyCode}&type=CollectedBy&prefixText=${key}&Specialist=0`, {}, setSearchList);
      if (res) {                                                                    
          setSearchList(res);
      } else {
          console.log('No data received');
      }
  }  
  const timer = setTimeout(() => {
      if (searchWaiter.waiterName.length < 1) return;
      getSearchResult(compCode, searchWaiter.waiterName);  
  }, 500);
  return () => clearTimeout(timer);
  }, [searchWaiter.waiterName, compCode, locationId])

  const handleSelect = (i) => {
      setSelectedWaiter(i);
      setSearchWaiter(pre => ({ ...pre, waiterName: i.Name}));
      setWaiterSearchResultsActive(false);
  }

  // const selectMember = () => {
  //     if (!isLoggedIn) return dispatch(setModal({ name: "LOGIN", state: true }));
  //     modalAction('MEMBER_SELECT_MODAL', true);
  // }  

  const [previousOrder, setPreviousOrder] = useState({loading: true, data: { SalesObj: { SalesDetails: [] } }, err: {status: false, msg: ''}});
  const [viewItems, setViewItems] = useState(true);
  const [note, setNote] = useState({id: '', text: ''});

  let previousOrderItems = useMemo(() => previousOrder.data.SalesObj.SalesDetails.map(i => ({ 
      Description: i.Description,      
      BillQty: i.BillQty,                                                              
      ItemId: i.ItemId,                                                              
      Unit: i.Unit,
      AutoId: i.AutoId,
      MRP: i.ItemMRP,
      MRPOnDisPer: '',
      // Rate: num(((i.Amount) - (((i.Amount * i.IGSTRATE) / (i.IGSTRATE + 100))))/i.BillQty),
      Rate: i.Rate,
      PackSizeId: i.PackSizeId ? i.PackSizeId : 0,
      Amount: num(i.Amount),
      // SRate: num(i.Amount / i.BillQty),
      TaxableAmount: i.TaxableAmount,
      CGSTRATE: i.CGSTRATE,
      SGSTRATE: i.SGSTRATE,
      IGSTRATE: i.IGSTRATE,

      SGST: i.SGST,
      CGST: i.CGST,

      Specification: i.Specification,                                                    // rerender when note.id changes due edits in specification.
  })),[previousOrder.data.SalesObj.SalesDetails, restaurantTable?.BedId, note.id])       // previousOrder depends on table Id. 

  const previousValueList = previousOrderItems.map(item => parseFloat(item.Amount));
  const previousTotal = parseFloat(previousValueList.reduce((total, num) => total + num, 0).toFixed(2)); 
  const previousTaxableValueList = previousOrderItems.map(item => parseFloat(item.TaxableAmount));
  const previousTaxableTotal = parseFloat(previousTaxableValueList.reduce((total, num) => total + num, 0).toFixed(2)); 

  useEffect(() => {
      if (!isRestaurant) return;
      const getPreviousOrder = async (CID, LOCID, BillId, TableId) => {
          if (CID, LOCID, BillId, TableId) {
              const res = await getFrom(`${BASE_URL}/api/Pharma/GetKOTDetails?CID=${CID}&LOCID=${LOCID}&BillId=${BillId}&TableId=${TableId}`, {}, setPreviousOrder);
              if (res) {              
                  setPreviousOrder(res);                       
              }
          }
      }  
      getPreviousOrder(compCode, locationId, restaurantTable.ProvInvBillid, restaurantTable.BedId)
  }, [compCode, locationId, restaurantTable?.ProvInvBillid, restaurantTable?.BedId])

  useEffect(() => { 
      if (!isRestaurant) return;        
      setOrderData(pre => ({
          ...pre,
          PartyCode: compInfo.DefaultCashParty,
          CollectedById: selectedWaiter.PartyCode,
          CashPartyName: customer.customerName,
          CashPartyMobile: customer.customerPhone,
          VchNo: previousOrder.data.SalesObj.VchNo, 
          SalesDetailsList: [ ...orderList,  ...previousOrderItems ],
          Amount: cartSubtotal + previousTotal,
          VisitId: previousOrder.data.SalesObj.VisitId
      }))
  }, [selectedWaiter.PartyCode, customer.customerName, customer.customerPhone, previousOrderItems, previousTotal, orderList, cartSubtotal, restaurantTable?.BedId])      // depends on table Id.

  useEffect(() => {
      if (!isRestaurant) return;
      if (restaurantTable?.ProvInvBillid) {
          if (previousOrder.data.SalesObj.BillId === undefined) return;            // intially it is undefined.         
          setCustomer({ customerName: previousOrder.data.SalesObj.CashPartyName, customerPhone: previousOrder.data.SalesObj.CashPartyMobile });
          setSelectedWaiter({ PartyCode: previousOrder.data.SalesObj.CollectedById, Name: previousOrder.data.SalesObj.CollectedBy });
          setSearchWaiter(pre => ({ ...pre, waiterName: previousOrder.data.SalesObj.CollectedBy || '' }));
      } else {
          setCustomer({ customerName: '', customerPhone: '' });
          // if (compCode === ROYAL_INN_ID) {
          //     setSelectedWaiter({ PartyCode: userInfo.PartyCode, Name: userInfo.Name });    
          //     setSearchWaiter(pre => ({ ...pre, waiterName: userInfo.Name }));
          // } else {
              setSelectedWaiter({ PartyCode: '', Name: '' });
              setSearchWaiter(pre => ({ ...pre, waiterName: '' }));
          // }
      }
  }, [previousOrder.data.SalesObj.BillId, restaurantTable?.ProvInvBillid, restaurantTable?.BedId])

  const submitNote = (item, type, modifyIndex) => {
      if (type === 'previous order') {
          setPreviousOrder(pre => {
              let list = [ ...pre.data.SalesObj.SalesDetails ];   
              if (modifyIndex !== undefined) {
                  list[modifyIndex].Specification = '';               // Clear Specification. can't use note.id because state update is delayed which gives note.id = '' when this function is called.
              } else {
                  list[note.id].Specification = note.text;
              }
              let newState = {...pre, data: { SalesObj: { ...pre.data.SalesObj, SalesDetails: list } }};               
              return newState;
          });
      } else {
          // cartAction('ADD_ITEM', {...item, Specification: note.text}, 'pharmacy');
          dispatch(addToCart({...item, Specification: note.text}));
      }
      setNote({id: '', text: ''});
  }

  // SEARCH PRODUCTS WORK...

  const [searchTerm, setSearchTerm] = useState({query: '', filterTerm: 'All', filterId: ''});
  const [autoCompleteList, setAutoCompleteList] = useState({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}}); 
    // const [searchResultsActive_1, setSearchResultsActive_1] = useState(false);
  
  useEffect(() => {
    let controller = new AbortController();
    const getSearchResult = async (companyCode, term, signal) => {                      
        if (!companyCode) return alert('no companyCode received');                  
        const res = await getFrom(`${BASE_URL}/api/item/Get?CID=${companyCode}&SearchStr=${term.query}&LOCID=${appData.location.LocationId}`, {}, setAutoCompleteList, signal);
        // const res = await getFrom(`${baseUrl}/api/Item/GetItemFilter?CID=${companyCode}&LOCID=${appData.location.LocationId}&SearchStr=${term.query}&CategoryIdList=${term.filterId}&SubCategoryIdList&MFGList&SortBy&ExcludeOutOfStock`, {}, setAutoCompleteList, signal);
        if (res) {                                                                    
            let requiredFields = getRequiredFields(res.data.itemMasterCollection);
            setAutoCompleteList(pre => ({ ...pre, loading: false, data: {itemMasterCollection: requiredFields }}));
        } else {
            console.log('No data received');
        }
    }  

    const timer = setTimeout(() => {
        if (searchTerm.query.length === 0) return setAutoCompleteList({loading: false, data: {itemMasterCollection: []}, err: {status: false, msg: ''}});
        getSearchResult(compCode, searchTerm, controller.signal);  
    }, 1000);

    return () => {
        clearTimeout(timer);
        controller.abort();
    };
  }, [searchTerm, compCode, appData.location.LocationId])

  
  const handleSearchInput = (text: string) => {
      setSearchTerm(pre => ({...pre, query: text}));
      // setListActive(true); 
  }
  

  return (
    <SafeAreaView className="flex-1 bg-[#faf8f3]">
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1">
        <LinearGradient colors={["#1a3a2e", "#2d5442"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 py-4 rounded-b-2xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-10 h-10 bg-[#D4AF37] rounded-lg items-center justify-center shadow-lg">
                <Text className="text-white text-xl font-bold">P</Text>
              </View>
              <Text className="text-[#faf8f3] font-semibold tracking-wide">{compInfo.COMPNAME.length > 27 ? compInfo.COMPNAME.substr(0, 27) + '..' : compInfo.COMPNAME}</Text>
            </View>

            <View className="flex flex-row items-center">
              {/* <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" /> */}
              <Image className='shadow-lg rounded-full mr-3' source={require('@/assets/images/user.png')} style={{ width: 35, height: 35 }} />
              <View>
                <Text className="text-sm font-semibold mb-1 text-white">{userInfo.Name}</Text>
                <View className="flex flex-row items-center">
                  {/* <MapPin size={14} color="white" /> */}
                  <Text className="text-xs text-white">{(userInfo.UserType).toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}</Text>
                </View>
              </View>
              <ChevronDown size={16} color="#fff" className="ml-2" />
            </View>
            {/* <View className="flex flex-row items-center gap-4">
              <Image className='rounded-full' source={{ uri: `https://erp.gsterpsoft.com/Content/CompanyLogo/${compInfo.LogoUrl}` }} style={{ width: 35, height: 35 }} />
              <View>
                <Text className="text-sm font-semibold mb-1">{compInfo.COMPNAME.length > 27 ? compInfo.COMPNAME.substr(0, 27) + '..' : compInfo.COMPNAME}</Text>
                <View className="flex flex-row items-center">
                  <MapPin size={14} color="#EF4444" />
                  <Text className="text-xs text-gray-500 ml-1">{!compInfo.CATCHLINE.length ? 'Order food online.' : compInfo.CATCHLINE.length > 32 ? compInfo.CATCHLINE.substr(0, 32) + '..' : compInfo.CATCHLINE}</Text>
                  <ChevronDown size={16} color="#6B7280" className="ml-1" />
                </View>
              </View>
            </View> */}
          </View>
        </LinearGradient>

        <View className="bg-white px-4 py-3 shadow-md">
          {/* <View className="flex-row items-center bg-[#faf8f3] rounded-lg border-2 border-gray-200 px-3">
            <TextInput className="flex-1 py-2.5 text-sm text-gray-800" placeholder="Search products..." placeholderTextColor="#999" value={searchQuery} onChangeText={setSearchQuery} />
            <TouchableOpacity className="bg-[#2d5442] px-3 py-2 rounded-md ml-2">
              <Text className="text-white text-base">🔍</Text>
            </TouchableOpacity>
          </View> */}

          <View className="flex-row">
            <TextInput onChangeText={(text) => handleSearchInput(text)} value={searchTerm.query} placeholder="Search Food, Drink, etc." className="flex-1 bg-[#faf8f3] border-2 border-gray-200 rounded-tl-md rounded-bl-md px-4 py-3 text-sm" placeholderTextColor="#999" />
            <TouchableOpacity className="bg-[#2d5442] px-4 rounded-tr-md rounded-br-md items-center justify-center">
              {/* <Text className="text-white text-base font-semibold tracking-wide">Search</Text> */}
              <Search color={'#fff'} className='text-white' size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-slate-100">
          {(() => {
            if (autoCompleteList.loading) {
                return <GridLoader containerClass='gap-3 flex-col m-3' classes='h-24' count={4} />;
            } else if (searchTerm.query.length && !autoCompleteList.data.itemMasterCollection.length) {
                return (
                    <View className="text-center py-10">
                        <Search className="w-14 h-14 text-gray-300 mx-auto mb-2" />
                        <Text className="text-gray-600 font-semibold text-sm">No items found</Text>
                    </View>
                )
            } else if (autoCompleteList.data.itemMasterCollection.length) {
                return (
                    <View className="gap-2 m-3">
                        {autoCompleteList.data.itemMasterCollection.map((item) => <ProductCard data={item} key={item.LocationItemId} />)}    
                        {/* <SearchListCard data={item} handleActive={searchResultsActive_1} /> */}
                    </View>
                )
            }
          })()}
        </View>

        <View className="bg-white mx-3 mt-3 p-4 rounded-2xl shadow-xl">
          <View className="">
            <Text className="text-[#1a3a2e] text-xl font-bold mb-1.5 pb-2">Billing Details</Text>
            {/* border-b-2 border-[#D4AF37]/30 */}

            <LinearGradient colors={["#f0e5c9", "#faf8f3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-row items-center p-3 rounded-lg border-2 border-[#D4AF37]/20 mb-4">
              <Text className="text-[#1a3a2e] font-semibold text-sm tracking-wide mr-3">TABLE  : </Text>
              <TouchableOpacity className='flex-1 flex-row justify-end gap-4 items-center bg-white border-2 border-[#D4AF37]/30 rounded-md px-4 py-2' onPress={() => dispatch(setModal({ name: "TABLES", state: true }))}>
                <Text className='text-sm text-gray-800'>{restaurantTable?.BedId ? `${restaurantTable?.BedDesc}, ${restaurantTable?.BedGroupDesc}` : 'Select a Table'}</Text>
                <Ionicons name="caret-down-sharp" size={18} color="black" />
              </TouchableOpacity>
            </LinearGradient>

            <View className="gap-3">
              <View>
                {/* <Text className="text-[#2d5442] text-[10px] font-semibold tracking-wide uppercase mb-1.5">Select Waiter</Text> */}
                <View className="flex-row bg-[#faf8f3] border-2 border-gray-200 rounded-md">
                  <Pressable className='flex-1' onPress={() => setWaiterSearchResultsActive(true)}>
                    <TextInput onChangeText={(text) => handleWaiterSearch('waiterName', text)} value={searchWaiter.waiterName} placeholder="Search Waiter" placeholderTextColor="#999" className="w-full px-3 py-2 text-sm" />
                  </Pressable>
                  {/* <TextInput placeholder="Search Waiter" placeholderTextColor="#999" value={waiterName} onChangeText={setWaiterName} className="flex-1 bg-[#faf8f3] border-2 border-gray-200 rounded-tl-md rounded-bl-md px-3 py-2 text-sm" /> */}
                  {waiterSearchResultsActive || searchWaiter.waiterName ? <TouchableOpacity onPress={() => {setWaiterSearchResultsActive(false); setSearchWaiter(pre => ({...pre, waiterName: ''})); setSelectedWaiter({ Name: '', PartyCode: '' });}}><X size={20} className='my-auto mr-4' /></TouchableOpacity> : null}
                  <TouchableOpacity className="bg-[#2d5442] px-4 rounded-tr-md rounded-br-md items-center justify-center">
                    <Text className="text-white text-xs font-semibold tracking-wide">Search</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className='flex-row gap-3'>
                <View className='flex-1'>
                  <TextInput onChangeText={(text) => setCustomer(pre => ({...pre, ['customerName']: text}))} value={customer.customerName} placeholder="Customer Name" placeholderTextColor="#999" keyboardType="phone-pad" className="bg-[#faf8f3] border-2 border-gray-200 rounded-md px-3 py-2 text-sm w-full" />
                </View>
                <View className='flex-1'>
                  <TextInput onChangeText={(text) => setCustomer(pre => ({...pre, ['customerPhone']: text}))} value={customer.customerPhone} maxLength={10} placeholder="Phone Number" placeholderTextColor="#999" className="bg-[#faf8f3] border-2 border-gray-200 rounded-md px-3 py-2 text-sm w-full" />
                </View>
              </View>
              {waiterSearchResultsActive ? <>
                {searchList.data.length ? <View className='my-3 border-t border-gray-200'>
                  {searchList.data.map((item, index) => (
                    <Pressable onPress={() => handleSelect(item)} key={index}>
                        <View className='flex-row gap-4 w-full bg-white px-[20px] py-[10px] border-b border-gray-200 items-center'>
                            <MaterialCommunityIcons name="chef-hat" size={22} color={colors.teal[500]} style={{width: 26}} />
                            <Text className="font-medium text-slate-700 text-[12px] mr-auto">{item.Name}</Text>
                        </View>
                    </Pressable> 
                  ))}
                </View> : null}
                {/* <Pressable onPress={() => router.push('/appn/profile')}>
                    <View className='flex-row gap-4 w-full bg-white px-[20px] py-[10px] border-b border-gray-200 items-center'>
                        <MaterialCommunityIcons name="chef-hat" size={22} color={colors.teal[500]} style={{width: 26}} />
                        <Text className="font-medium text-slate-700 text-[12px] mr-auto">Personal Information</Text>
                    </View>
                </Pressable> 
                <Pressable onPress={() => router.push('/appn/profile')}>
                    <View className='flex-row gap-4 w-full bg-white px-[20px] py-[10px] border-b border-gray-200 items-center'>
                        <MaterialCommunityIcons name="chef-hat" size={22} color={colors.teal[500]} style={{width: 26}} />
                        <Text className="font-medium text-slate-700 text-[12px] mr-auto">Personal Information</Text>
                    </View>
                </Pressable>  */}
              </> : null}
            </View>
          </View>

        </View>
        <View className='px-4 pt-6'>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#1a3a2e] text-xl font-bold">Current Order</Text>
            <TouchableOpacity>
              <LinearGradient colors={["#D4AF37", "#c9a030"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-3 py-2 rounded-md shadow-lg">
                <Text className="text-white font-bold text-[10px] tracking-widest uppercase">+ NEW ORDER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={["#1a3a2e", "#1a3a2e"]} className="flex-row px-3 py-3 rounded-t-lg">
            <Text className="flex-1 text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase">ITEM</Text>
            <Text className="w-[20%] text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase text-center">QTY</Text>
            <Text className="w-[15%] text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase text-center">RATE</Text>
            <Text className="w-[15%] text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase text-center">TOTAL</Text>
            <View className="w-[6%]" />
          </LinearGradient>

          {cartArray.map((item, index) => <CurrentItemsCard index={index} item={item} toggleNoteVisibility={() => {}} note={note} setNote={setNote} submitNote={submitNote} itemsLength={cartArray.length} />)}

          <LinearGradient colors={["#f0e5c9", "#faf8f3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-row items-center justify-between px-5 py-4 rounded-lg border-2 border-[#D4AF37]/30 mt-4 mb-2">
            <Text className="text-[#1a3a2e] text-lg font-bold tracking-wide">Current Total</Text>
            <Text className="text-[#2d5442] text-xl font-bold tracking-wide">₹ {cartSubtotal}</Text>
          </LinearGradient>
        </View>
        <View className='px-4 pt-4'>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#1a3a2e] text-xl font-bold">Previous Order</Text>
            <TouchableOpacity>
              <LinearGradient colors={["#D4AF37", "#c9a030"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-3 py-2 rounded-md shadow-lg">
                <Text className="text-white font-bold text-[10px] tracking-widest uppercase">+ NEW ORDER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={["#1a3a2e", "#1a3a2e"]} className="flex-row px-3 py-3 rounded-t-lg">
            <Text className="flex-1 text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase">ITEM</Text>
            <Text className="w-[20%] text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase text-center">QTY</Text>
            <Text className="w-[18%] text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase text-center">RATE</Text>
            <Text className="w-[18%] text-[#f0e5c9] text-[10px] font-semibold tracking-widest uppercase text-center">TOTAL</Text>
          </LinearGradient>

          {previousOrderItems.map((item, index) => <PreviousItemsCard index={index} item={item} toggleNoteVisibility={() => {}} note={note} setNote={setNote} submitNote={submitNote} itemsLength={cartArray.length} />)}

          <LinearGradient colors={["#f0e5c9", "#faf8f3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-row items-center justify-between px-5 py-4 rounded-lg border-2 border-[#D4AF37]/30 mt-4 mb-2">
            <Text className="text-[#1a3a2e] text-lg font-bold tracking-wide">Previous Total</Text>
            <Text className="text-[#2d5442] text-xl font-bold tracking-wide">₹ {previousTaxableTotal}</Text>
          </LinearGradient>
        </View>
        <View className='flex-row gap-[4rem] justify-between p-4'>
          <TouchableOpacity activeOpacity={0.8} className='flex-1' onPress={placeOrder}>
            <LinearGradient colors={["#1a3a2e", "#2d5442"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="py-3.5 rounded-lg items-center shadow-2xl flex-row gap-3 justify-center">
              <SendHorizontal color={'white'} size={18}/>
              <Text className="text-white text-sm font-bold tracking-widest uppercase">Place Order</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View className='items-end pr-5'>
            <Text className="text-xs font-semibold text-[#2d5442]">Grand Total</Text>
            <Text className="text-[#2d5442] text-xl font-bold tracking-wide">₹ {cartSubtotal + previousTaxableTotal}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



const CurrentItemsCard = ({ index, item, toggleNoteVisibility, note, setNote, submitNote, itemsLength }: any) => {
    const dispatch = useDispatch();
    return (
      <View key={item.LocationItemId} className={`flex-row items-center px-2 py-3 border-b border-gray-200 ${index === itemsLength - 1 ? "border-b-0" : ""}`}>
        <View className="flex-1 flex-row items-center gap-2">
          {/* <TouchableOpacity onPress={() => toggleCheck(item.id)} className={`w-4 h-4 rounded border-2 items-center justify-center ${item.checked ? "bg-[#D4AF37] border-[#D4AF37]" : "border-[#D4AF37]"}`}>
            {item.checked && <Text className="text-white text-[10px] font-bold">✓</Text>}
          </TouchableOpacity> */}
          <Text className="text-gray-800 font-medium text-xs flex-1">{item.Description}</Text>
        </View>

        <View className="w-[20%] flex-row items-center justify-center">
          <TouchableOpacity onPress={() => {
              if (item.count !== 1) {
                  dispatch(addToCart({...item, count: item.count - 1}))
              } else {
                  dispatch(removeFromCart(item.LocationItemId))
              }
            }} className="w-6 h-6 rounded-full border-2 border-[#2d5442] items-center justify-center"
          >
            <Text className="text-[#2d5442] font-bold text-base leading-none">−</Text>
          </TouchableOpacity>
          <Text className="w-6 text-center font-semibold text-xs text-gray-800">{item.count}</Text>
          <TouchableOpacity onPress={() => dispatch(addToCart({...item, count: item.count + 1}))} className="w-6 h-6 rounded-full border-2 border-[#2d5442] items-center justify-center">
            <Text className="text-[#2d5442] font-bold text-base leading-none">+</Text>
          </TouchableOpacity>
        </View>

        <Text className="w-[15%] text-center text-xs font-semibold text-[#2d5442]">{item.SRate}</Text>

        <Text className="w-[15%] text-center text-xs font-bold text-[#1a3a2e]">{num(item.SRate * item.count)}</Text>

        <TouchableOpacity onPress={() => dispatch(removeFromCart(item.LocationItemId))} className="items-center w-[7%]">
          <View className="w-6 h-6 rounded-full bg-red-100 items-center justify-center">
            <Text className="text-red-600 text-base font-bold">×</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
}


const PreviousItemsCard = ({ index, item, toggleNoteVisibility, note, setNote, submitNote, itemsLength }: any) => {
    const dispatch = useDispatch();
    return (
      <View key={item.LocationItemId} className={`flex-row items-center px-2 py-3 border-b border-gray-200 ${index === itemsLength - 1 ? "border-b-0" : ""}`}>
        <View className="flex-1 flex-row items-center gap-2">
          {/* <TouchableOpacity onPress={() => toggleCheck(item.id)} className={`w-4 h-4 rounded border-2 items-center justify-center ${item.checked ? "bg-[#D4AF37] border-[#D4AF37]" : "border-[#D4AF37]"}`}>
            {item.checked && <Text className="text-white text-[10px] font-bold">✓</Text>}
          </TouchableOpacity> */}
          <Text className="text-gray-800 font-medium text-xs flex-1">{item.Description}</Text>
        </View>

        <View className="w-[20%] flex-row items-center justify-center">
          {/* <TouchableOpacity onPress={() => {
              if (item.count !== 1) {
                  dispatch(addToCart({...item, count: item.count - 1}))
              } else {
                  dispatch(removeFromCart(item.LocationItemId))
              }
            }} className="w-6 h-6 rounded-full border-2 border-[#2d5442] items-center justify-center"
          >
            <Text className="text-[#2d5442] font-bold text-base leading-none">−</Text>
          </TouchableOpacity> */}
          <Text className="w-6 text-center font-semibold text-xs text-gray-800">{item.BillQty}</Text>
          {/* <TouchableOpacity onPress={() => dispatch(addToCart({...item, count: item.count + 1}))} className="w-6 h-6 rounded-full border-2 border-[#2d5442] items-center justify-center">
            <Text className="text-[#2d5442] font-bold text-base leading-none">+</Text>
          </TouchableOpacity> */}
        </View>

        <Text className="w-[18%] text-center text-xs font-semibold text-[#2d5442]">{item.Rate}</Text>

        <Text className="w-[18%] text-center text-xs font-bold text-[#1a3a2e]">{num(item.BillQty * item.Rate)}</Text>

        {/* <TouchableOpacity onPress={() => dispatch(removeFromCart(item.LocationItemId))} className="items-center w-[7%]">
          <View className="w-6 h-6 rounded-full bg-red-100 items-center justify-center">
            <Text className="text-red-600 text-base font-bold">×</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    )
}