import { configureStore } from '@reduxjs/toolkit';
import compCodeReducer, { appDataReducer, appnReducer, cartReducer, companiesReducer, companyReducer, deptsReducer, loginReducer, membersReducer, modalsReducer, siteDataReducer, userReducer } from './slices/slices';
// import { devToolsEnhancer } from '@redux-devtools/extension';
// import { compose } from 'redux';

// const composeEnhancers = composeWithDevTools({
//   // Specify here name, actionsDenylist, actionsCreators and other options
// });
const store = configureStore({
  reducer: {
    compCode: compCodeReducer,
    isLoggedIn: loginReducer,
    user: userReducer,
    companies: companiesReducer,
    depts: deptsReducer,
    appnData: appnReducer,
    members: membersReducer,
    modals: modalsReducer,
    cart: cartReducer,
    appData: appDataReducer,
    company: companyReducer,
    siteData: siteDataReducer
  },
  // enhancers: (existingEnhancers) =>
  //   process.env.NODE_ENV === 'development'
  //     ? [compose(...existingEnhancers, devToolsEnhancer({ trace: true }))]
  //     : existingEnhancers,

  // devTools: true // process.env.NODE_ENV === 'development' about the best place to make api call when using redux toolkit in my react native project
});

export default store;
// Inferred types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
