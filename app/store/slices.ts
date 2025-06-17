import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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





export default compCodeReducer;
export {
  loginReducer,
  userReducer
}
