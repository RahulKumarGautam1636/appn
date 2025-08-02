import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestStatusHandlers } from './statusHandler';
import axios from 'axios';
import { BASE_URL, dummyUser, rent, TAKEHOME_AGRO } from '@/constants';
import { getCategoryRequiredFieldsOnly } from '@/src/components/utils';

const compCodeSlice = createSlice({
  name: 'compCode',
  initialState: 'FFCeIi27FQMTNGpatwiktw==',
  reducers: {
    setCompCode: (state, action: PayloadAction<string>) => {
      state = action.payload;
    },
  },
});

export const { setCompCode } = compCodeSlice.actions;
const compCodeReducer = compCodeSlice.reducer;


const loginSlice = createSlice({
  name: 'login',
  initialState: false,
  reducers: {
    setLogin: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setLogin } = loginSlice.actions;
const loginReducer = loginSlice.reducer;


const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      console.log(action)
      // state = action.payload;
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
const userReducer = userSlice.reducer;

export const getCompanies = createAsyncThunk(
  'auth/getCompanies',
  async (params: any, { dispatch, rejectWithValue, getState }) => {
    // const compCode = getState().compCode;
    try {              
      const res = await axios.get(`${BASE_URL}/api/CompMast/Get?CID=${params.companyCode}&UID=${params.userId}`);
        // console.log(res);
        if (res.status === 200) {  
          let parentCompany = res.data.find((i: any) => i.EncCompanyId === params.companyCode);                                                                                                          
          // dispatch(setCompanies({ list: res.data, selected: parentCompany }));     
          return { list: res.data, selected: parentCompany };        
        } else {
          throw new Error('Login failed');
      }
      
      // // 2. Preferences API
      // const prefRes = await fetch(`https://api.example.com/users/${data.user.id}/preferences`);
      // if (!prefRes.ok) throw new Error('Failed to fetch preferences');
      // const preferences = await prefRes.json();
      // dispatch(setPreferences(preferences));
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState: { list: [], selected: {}, status: 'loading', error: null
},
  reducers: {
    setCompanies: (state, action: any) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    requestStatusHandlers(builder, getCompanies, {
      onSuccess: (state: any, action: any) => {
        Object.assign(state, action.payload);            // Additional logic after successful fetch
      },
    });
  },
});

export const { setCompanies } = companiesSlice.actions;
const companiesReducer = companiesSlice.reducer;

export const getCompanyInfo = createAsyncThunk(
  'auth/getCompanyInfo',
  async (params: any, { dispatch, rejectWithValue, getState }) => {
    const compCode = getState().compCode;
    const locationId = getState().location.LocationId;
    try {              
      const res = await axios.get(`${BASE_URL}/api/CompMast/GetCompDetails?CID=${params.companyCode}&LOCID=${params.locationId}`, {});

      if (res.data.COMPNAME && res.data.EncCompanyId) {  
        // return { info: res.data, vType: '' };
        let vertical = ''
        if (rent) {
          dispatch(setLocation({ required: false, LocationId: 1293 }))
          return { info: res.data, vType: 'rent' }
        } else if (res.data.VerticleType === 'RESTAURANT' || res.data.VerticleType === 'HOTEL' || res.data.VerticleType === 'RESORT') {
          dispatch(setLocation({ required: false, LocationId: res.data.LocationId }))
        } else if (res.data.VerticleType === 'ErpPharma' || res.data.VerticleType === 'ErpManufacturing') {
          if (compCode === TAKEHOME_AGRO) {
            vertical = 'agro'                    
          } else {  
            vertical = res.data.VerticleType      
          }
          return { info: res.data, vType: vertical };
        } 
        vertical = res.data.VerticleType          
        if (!locationId) {                                     
          dispatch(setLocation({ LocationId: res.data.LocationId }))
        } 
        return { info: res.data, vType: vertical }              
      } else {
        throw new Error('Invalid Company ! Please try later.');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong please Refresh or try after some time.');
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: { 
    info: {}, vType: '', status: 'loading', error: null
  },
  reducers: {
    setCompany: (state, action: any) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    requestStatusHandlers(builder, getCompanyInfo, {
      onSuccess: (state: any, action: any) => {
        Object.assign(state, action.payload);
      },
    });
  },
});

export const { setCompany } = companySlice.actions;
const companyReducer = companySlice.reducer;


export const getDepartments = createAsyncThunk(
  'auth/getDepartments',
  async (params: any, { dispatch, rejectWithValue }) => {
    try {              
      const res = await axios.get(`${BASE_URL}/api/Values/Get?CID=${params.companyCode}&P1=0`);
        if (res.status === 200) {                                                                                                             
          return { list: res.data, selected: res.data[0] };        
        } else {
          throw new Error('Fetching Departments failed');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

const deptsSlice = createSlice({
  name: 'departments',
  initialState: { list: [], selected: {}, status: 'loading', error: null },
  reducers: {
    setDepts: (state, action: any) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    requestStatusHandlers(builder, getDepartments, {
      onSuccess: (state: any, action: any) => {
        Object.assign(state, action.payload);
      },
    });
  },
});

export const { setDepts } = deptsSlice.actions;
const deptsReducer = deptsSlice.reducer;

const appnDataSlice = createSlice({
  name: 'appnData',
  initialState: {     
    docCompId: "", 
    selectedAppnDate: "",                                                     // used to detect active item of date button slider in bookingForm.                                               
    doctor: { Name: "", SpecialistDesc: "", Qualification: "", RegMob1: "" },
    // UnderDoctId: "", AppointDate: "", AppTime: "", TimeSlotId: "",
  },
  reducers: {
    setAppnData: (state, action: any) => {
      state = Object.assign(state, action.payload);
    },
  }
});

export const { setAppnData } = appnDataSlice.actions;
const appnReducer = appnDataSlice.reducer;

export const getMembers = createAsyncThunk(
  'auth/getMembers',
  async (params: any, { dispatch, rejectWithValue, getState }) => {
    const user = getState().user;
    const compCode = getState().compCode;
    if (!user.UserId) return;
    try {              
      const res = await axios.get(`${BASE_URL}/api/member/Get?UserId=${user.UserId}&CID=${compCode}`, {});
      if (res.data) {
          const parentMember = res.data.AccPartyMemberMasterList.find((i: any) => i.MemberId === user.MemberId);
          if (parentMember) {
            return {membersList: res.data.AccPartyMemberMasterList, selectedMember: parentMember};
          } else {
            console.log('No parent member found');
            return {membersList: res.data.AccPartyMemberMasterList};
          }
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

const membersSlice = createSlice({
  name: 'appnData',
  initialState: { membersList: [], selectedMember: {}, status: 'loading', error: null },
  reducers: {
    setMembers: (state, action: any) => {
      state = Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    requestStatusHandlers(builder, getMembers, {
      onSuccess: (state: any, action: any) => {
        Object.assign(state, action.payload);
      },
    });
  },
});

export const { setMembers } = membersSlice.actions;
const membersReducer = membersSlice.reducer;


const modalsSlice = createSlice({
  name: 'modals',
  initialState: {     
    APPN_PREVIEW: { state: false, data: "" },
    APPN_SUCCESS: { state: false, data: "" },
    COMPANIES: { state: false, data: '' },
    MEMBERS: { state: false, data: '' },
    LOGIN: { state: false, data: '' },
    APPN_DETAIL: { state: false, data: '' },
    TEST_DETAIL: { state: false, data: '' },
    DEPTS: { state: false, data: '' },
  },
  reducers: {
    setModal: (state, action: any) => {
      let data = action.payload.data || '';
      return {...state, [action.payload.name]: {state: action.payload.state, data: data}}
    },
  }
});

export const { setModal } = modalsSlice.actions;
const modalsReducer = modalsSlice.reducer;

const cartSlice = createSlice({
  name: 'modals',
  initialState: { pharmacy: {}, lab: {} },
  reducers: {
    addToCart: (state, action: any) => {
      const { item, type } = action.payload;
      return {...state, [type]: {...state[type], [item.LocationItemId]: item }};
    },
    removeFromCart: (state, action: any) => {
      const { item, type } = action.payload;
      delete state[type][item.LocationItemId]
    },
    dumpCart: (state, action: any) => {
      const { type } = action.payload;
      state[type] = {}
    }
  }
});

export const { addToCart, removeFromCart, dumpCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;

let LID = 0;

const getUserLocation = () => {
  if (LID) return { LocationId: LID };
  return { required: true, LocationId: 0 };
}

const appDataSlice = createSlice({
  name: 'APP_DATA',
  initialState: { 
    focusArea: '0',
    location: getUserLocation(),
    prescription: { required: true, patient: { docName: '', docAddress: '' } },
    restaurant: { table: {  } },
    businessType: { Description: '', CodeValue: '', CodeId: '' },
    userRegType:
                  { CodeId: 43198, Description: 'Customer', CodeValue: 'Customer', for: 'B2C / Patient' }
                  // { CodeId: 43194, Description: 'Retailer', CodeValue: 'Retailer', for: 'B2B / Retailer' }
                  // { CodeId: 43195, Description: 'Strategic Partner', CodeValue: 'SP', for: 'Doctor' }
                  // { CodeId: 43196, Description: 'Master Partner', CodeValue: 'MP', for: 'Referrer' }
                  // { CodeId: 43197, Description: 'Associate Partner', CodeValue: 'AP', for: 'Provider' }
  },
  reducers: {
    setLocation: (state, action: any) => {
      state.location = { ...state.location, ...action.payload};
      return state;
    },
    setPrescription: (state, action: any) => {
      state.prescription = { ...state.prescription, ...action.payload };
      return state;
    },
    setRestaurant: (state, action: any) => {
      state.restaurant = { ...state.restaurant, ...action.payload };
      return state;
    },
    setBusinessType: (state, action: any) => {
      state.businessType = { ...state.businessType, ...action.payload };
      return state;
    },
    setUserRegType: (state, action: any) => {
      state.userRegType = { ...state.userRegType, ...action.payload };
      return state;
    },    
  }
});

export const { setLocation, setPrescription, setRestaurant, setBusinessType, setUserRegType } = appDataSlice.actions;
const appDataReducer = appDataSlice.reducer;

// export const getSiteData = createAsyncThunk(
//   'auth/getMembers',
//   async (params: any, { dispatch, rejectWithValue, getState }) => {

//     const compCode = getState().compCode;

//     // if (vType === 'ErpPharma' || vType === 'agro' || vType === 'ErpManufacturing') {
//         const getCategories = async () => {         
//             // siteDataAction({ catLoading: true, productLoading: true });
//             const res = await axios.get(`${BASE_URL}/api/Pharma/GetCatSubCat?CID=${compCode}&LOCID=${locationId}`);
//             if (res.status === 200) {
//                 const categories = getCategoryRequiredFieldsOnly(res.data.LinkCategoryList);
//                 // siteDataAction({ LinkCategoryList: categories, catLoading: false, LinkSubCategoryList: res.data.LinkSubCategoryList });   
//             }
//         }
//         getCategories(controller.signal)
//     // } else if (vType === 'rent') {
//     //     siteDataAction({isLoading: false, itemMasterCollection: rentSaleProducts, LinkCategoryList: rentCategories, LinkSubCategoryList: [], ItemBrandList: []}); 
//     //     return;
//     // } 

//     try {              
//       const res = await axios.get(`${BASE_URL}/api/member/Get?UserId=${user.UserId}&CID=${compCode}`, {});
//       if (res.data) {
//           const parentMember = res.data.AccPartyMemberMasterList.find((i: any) => i.MemberId === user.MemberId);
//           if (parentMember) {
//             return {membersList: res.data.AccPartyMemberMasterList, selectedMember: parentMember};
//           } else {
//             console.log('No parent member found');
//             return {membersList: res.data.AccPartyMemberMasterList};
//           }
//       }
//     } catch (err: any) {
//       return rejectWithValue(err.message || 'Something went wrong');
//     }
//   }
// );

// const siteDataSlice = createSlice({
//   name: 'appnData',
//   initialState: {isLoading: true, catLoading: true, productLoading: true, itemMasterCollection: [], ItemBrandList: [], LinkCategoryList: [], LinkSubCategoryList: []},
//   reducers: {
//     setMembers: (state, action: any) => {
//       state = Object.assign(state, action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     requestStatusHandlers(builder, getSiteData, {
//       onSuccess: (state: any, action: any) => {
//         Object.assign(state, action.payload);
//       },
//     });
//   },
// });

// export const { setMembers } = dataSlice.actions;
// const membersReducer = dataSlice.reducer;


export default compCodeReducer;
export { 
  loginReducer, 
  userReducer, 
  companiesReducer, 
  deptsReducer, 
  appnReducer, 
  membersReducer, 
  modalsReducer,
  cartReducer,
  appDataReducer,
  companyReducer
}
