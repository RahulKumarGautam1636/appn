import Constants from "expo-constants";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestStatusHandlers } from './statusHandler';
import axios from 'axios';
import { BASE_URL, BC_ROY, defaultId, dummyUser, initLocation, rent, TAKEHOME_AGRO, TAKEHOME_PHARMA } from '@/src/constants';
import { getCategoryRequiredFieldsOnly, getRequiredFields } from '@/src/components/utils';
export const { compId, baseUrl, srcUrl } = Constants.expoConfig.extra || {};


const compCodeSlice = createSlice({
  name: 'compCode',
  initialState: compId ? compId : defaultId, // 'ji4C/%2BQbn%2BBofLeoFG9clw==', //  'yFObpUjTIGhK9%2B4bFmadRg==', //  '5KR8RKKh%2BtHG4iszAzAjJQ==', // 
  reducers: {
    setCompCode: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      
      return action.payload;
    },
  },
});

export const { setCompCode } = compCodeSlice.actions;
const compCodeReducer = compCodeSlice.reducer;

const loginSlice = createSlice({
  name: 'login',
  initialState: true,
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
  initialState: dummyUser,
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
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

export const getCompanyDetails = createAsyncThunk(
  'auth/getCompanyDetails',
  async (params: any, { dispatch, rejectWithValue, getState }) => {
    try {              
      const res = await axios.get(`${BASE_URL}/api/CompMast/GetCompDetails?CID=${params.compCode}&LOCID=${params.locationId}`, {});
      if (res.data.COMPNAME && res.data.EncCompanyId) {  
        let vertical = ''
        if (rent) {
          dispatch(setLocation({ required: false, LocationId: 1293 }))
          return { info: res.data, vType: 'rent' }
        } else if (res.data.VerticleType === 'RESTAURANT' || res.data.VerticleType === 'HOTEL' || res.data.VerticleType === 'RESORT') {
          dispatch(setLocation({ required: false, LocationId: res.data.LocationId }))
        } else if (res.data.VerticleType === 'ErpPharma' || res.data.VerticleType === 'ErpManufacturing') {
          if (params.compCode === TAKEHOME_AGRO) {
            vertical = 'agro'                    
          } else {  
            vertical = res.data.VerticleType      
          }

          if (res.data.EncCompanyId === TAKEHOME_PHARMA || res.data.EncCompanyId === 'KHLqDFK8CUUxe1p1EotU3g==') dispatch(setPrescription({ required: true }));
          return { info: res.data, vType: vertical };
        } 
        vertical = res.data.VerticleType          
        if (!params.locationId) {                                     
          dispatch(setLocation({ required: false, LocationId: res.data.LocationId }))
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
    requestStatusHandlers(builder, getCompanyDetails, {
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
    ADD_MEMBER: { state: false, data: '' },
    LOGIN: { state: false, data: '' },
    APPN_DETAIL: { state: false, data: '' },
    TEST_DETAIL: { state: false, data: '' },
    DEPTS: { state: false, data: '' },
    PRESC: { state: false, data: '' },
    LOCATIONS: { state: false, data: '' },
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
  initialState: {},
  reducers: {
    addToCart: (state, action: any) => {
      const item = action.payload;
      return {...state, [item.LocationItemId]: item }
    },
    removeFromCart: (state, action: any) => {
      const id = action.payload;
      delete state[id]
    },
    dumpCart: (action: any) => {
      return {}
    }
  }
});

export const { addToCart, removeFromCart, dumpCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;

let LID = 0;

const getUserLocation = () => {
  if (LID) return { LocationId: LID };
  return { 
    ...initLocation

    // required: true, 
    // LocationId: 1293, // 1293, // 1559, // 1298, // 1293, 
    // LocationName: 'Healthbuddy Kalyani Pharmacy', 
    // Address: 'B-07/08(S), B-7, Ward No-10, Ground Floor Central Park, Kalyani-Nadia 741235', 
    // StateDesc: 'West Bengal', 
    // StateCode: '19', 
    // PIN: '741235', 
    // Area: 'Kalyani' 
  };
}

const appDataSlice = createSlice({
  name: 'APP_DATA',
  initialState: { 
    focusArea: '0',
    location: getUserLocation(),
    prescription: { required: false, patient: { docName: '', docAddress: '' }, file: { name: '', uri: '', type: '', fileType: '', extn: '' } },
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
      state.location = action.payload;
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
      state.userRegType = action.payload;
      return state;
    },    
  }
});

export const { setLocation, setPrescription, setRestaurant, setBusinessType, setUserRegType } = appDataSlice.actions;
const appDataReducer = appDataSlice.reducer;

let categoriesController: AbortController | null = null;

export const getCategories = createAsyncThunk(
  'auth/getCategories',
  async (params: any, { rejectWithValue }) => {
    try {     
      const getCategories = async () => {         
        if (categoriesController) categoriesController.abort();       
        categoriesController = new AbortController();         
        const res = await axios.get(`${BASE_URL}/api/Pharma/GetCatSubCat?CID=${params.compCode}&LOCID=${params.locationId}`, { signal: categoriesController.signal });
        if (res.status === 200) {
          const categories = getCategoryRequiredFieldsOnly(res.data.LinkCategoryList);
          return { loading: false, LinkCategoryList: categories, LinkSubCategoryList: res.data.LinkSubCategoryList }
        }
        return rejectWithValue('Unexpected response');
      }
      const categories = await getCategories();
      return categories
    } catch (err: any) {
      if (axios.isCancel(err)) return rejectWithValue('Request cancelled');
      if (err.name === 'CanceledError') return rejectWithValue('Request cancelled');
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

let productsController: AbortController | null = null;

export const getProducts = createAsyncThunk(
  'auth/getProducts',
  async (params: any, { rejectWithValue }) => {
    try {
      if (productsController) productsController.abort();       // cancel previous request if still running
      productsController = new AbortController();
      const res = await axios.get(`${BASE_URL}/api/Pharma/GetCatItemsWithBrand?CID=${params.compCode}&LOCID=${params.locationId}`, { signal: productsController.signal });
      if (res.status === 200) {
        const products = getRequiredFields(res.data.itemMasterCollection);
        return { loading: false, itemMasterCollection: products, ItemBrandList: res.data.ItemBrandList }
      }
      return rejectWithValue('Unexpected response');
    } catch (err: any) {
      if (axios.isCancel(err)) return rejectWithValue('Request cancelled');
      if (err.name === 'CanceledError') return rejectWithValue('Request cancelled');
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);


const siteDataSlice = createSlice({
  name: 'siteData',
  initialState: { 
    categories: {loading: true, error: '', LinkCategoryList: [], LinkSubCategoryList: []},
    products: {loading: true, error: '', itemMasterCollection: [], ItemBrandList: []}
  },
  reducers: {
    setSiteCategories: (state, action: any) => {
      state = Object.assign(state, action.payload);
    },
    setSiteProducts: (state, action: any) => {
      state = Object.assign(state, action.payload);
    },
    resetSiteProducts: () => {
      return { 
        categories: {loading: true, error: '', LinkCategoryList: [], LinkSubCategoryList: []},
        products: {loading: true, error: '', itemMasterCollection: [], ItemBrandList: []}
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = '';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = {
          loading: false,
          error: '',
          ...action.payload
        };
      })
      .addCase(getCategories.rejected, (state, action) => {
        if (action.payload === 'Request cancelled') return;
        state.categories.loading = false;
        state.categories.error = action.payload || action.error.message;
      });

    builder
      .addCase(getProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = '';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = {
          loading: false,
          error: '',
          ...action.payload
        };
      })
      .addCase(getProducts.rejected, (state, action) => {
        if (action.payload === 'Request cancelled') return;
        state.products.loading = false;
        state.products.error = action.payload || action.error.message;
      });
  },
});

export const { setSiteProducts, resetSiteProducts } = siteDataSlice.actions;
const siteDataReducer = siteDataSlice.reducer;



// export const fetchUserAndPosts = () => async (dispatch, getState) => {     // ⭐⭐⭐ dispatch action and use it's result to do anything immedeately.
//   const userResult = await dispatch(fetchUser());

//   if (fetchUser.fulfilled.match(userResult)) {
//     const userId = userResult.payload.id;
//     await dispatch(fetchUserPosts(userId));
//   } else {
//     return thunkAPI.rejectWithValue('Failed to fetch user');
//   }
// };


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
  companyReducer,
  siteDataReducer
}
