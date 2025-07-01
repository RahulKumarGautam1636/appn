import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestStatusHandlers } from './statusHandler';
import axios from 'axios';
import { BASE_URL, dummyUser } from '@/constants';

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
        // Additional logic after successful fetch
        Object.assign(state, action.payload);
      },
    });
  },
});

export const { setCompanies } = companiesSlice.actions;
const companiesReducer = companiesSlice.reducer;


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
    selectedAppnDate: "",                                                         // used to detect active item of date button slider in bookingForm.
    docCompId: "", 
    // UnderDoctId: "", AppointDate: "", AppTime: "", TimeSlotId: "",
    doctor: { Name: "", SpecialistDesc: "", Qualification: "", RegMob1: "" }
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
  initialState: {     
    membersList: [],
    selectedMember: {},
    status: 'loading', error: null
  },
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
      return {...state, [type]: {...state[type], [item._id]: item }};
    },
    removeFromCart: (state, action: any) => {
      const { item, type } = action.payload;
      delete state[type][item._id]
    }
  }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;




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
}
