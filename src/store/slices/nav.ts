import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  history: string[];
}

const initialState: NavigationState = {
  history: [],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    pushRoute: (state, action: PayloadAction<string>) => {
      const route = action.payload;
      const last = state.history[state.history.length - 1];
      if (last !== route) {
        state.history.push(route);
      }
    },
    popRoute: (state) => {
      state.history.pop();
    },
    resetHistory: (state, action: PayloadAction<string | undefined>) => {
      state.history = action.payload ? [action.payload] : [];
    },
  },
});

export const { pushRoute, popRoute, resetHistory } = navigationSlice.actions;
const navReducer = navigationSlice.reducer;
export default navReducer;
