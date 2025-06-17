import { configureStore } from '@reduxjs/toolkit';
import compCodeReducer, { loginReducer, userReducer } from './slices';
// import { devToolsEnhancer } from '@redux-devtools/extension';
// import { compose } from 'redux';

// const composeEnhancers = composeWithDevTools({
//   // Specify here name, actionsDenylist, actionsCreators and other options
// });
const store = configureStore({
  reducer: {
    compCode: compCodeReducer,
    isLoggedIn: loginReducer,
    user: userReducer
  },
  // enhancers: (existingEnhancers) =>
  //   process.env.NODE_ENV === 'development'
  //     ? [compose(...existingEnhancers, devToolsEnhancer({ trace: true }))]
  //     : existingEnhancers,

  // devTools: true // process.env.NODE_ENV === 'development'
});

export default store;
// Inferred types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
