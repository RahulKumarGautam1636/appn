import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestStatusHandlers } from './statusHandler';
import axios from 'axios';
import { BASE_URL } from '@/constants';

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
        console.log(res);
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
  initialState: { list: [], selected: {}, status: 'idle', error: null
},
  reducers: {
    setCompanies: (state, action: any) => {
      if (action.payload.list) state.list = action.payload.list
      if (action.payload.selected) state.list = action.payload.selected
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
  initialState: { list: [], selected: {}, status: 'idle', error: null
},
  reducers: {
    setDepts: (state, action: any) => {
      if (action.payload.list) state.list = action.payload.list
      if (action.payload.selected) state.list = action.payload.selected
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





export default compCodeReducer;
export { loginReducer, userReducer, companiesReducer, deptsReducer }
