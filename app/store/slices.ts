import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const compCodeSlice = createSlice({
  name: 'compCode',
  initialState: '',
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
    toggleLogin: (state, action: PayloadAction<boolean>) => {
      state = action.payload;
    },
  },
});

export const { toggleLogin } = loginSlice.actions;
const loginReducer = loginSlice.reducer;

export  {
    compCodeReducer,
    loginReducer
}
