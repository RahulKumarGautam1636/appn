import { useEffect, useState } from "react";
import axios from "axios";
import { storage, uType, validRegType } from "./utils";
// import { InactiveWarningCard } from "./cards";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../constants";
import { setLogin, setModal, setUser } from "../store/slices/slices";
import { RootState } from "../store/store";
import { FullScreenLoading } from ".";


const Auth = () => {

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const compCode = useSelector((i: RootState) => i.compCode)
  const vType = useSelector((i: RootState) => i.company.vType)
    
  useEffect(() => {
    autoLogin(compCode);
  }, [compCode])

//   const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true, decode: false });

  async function autoLogin(companyCode: string) {
    let user = '';

    // if (queryString.slugKey) {
    //   let slug = decrypt(queryString.slugKey);
    //   if (!slug) return alert('Something went wrong, unable to log you in.');
    //   localStorage.setItem('userLoginData', queryString.slugKey);
    //   user = slug
    // } else {

    //   user = decrypt(localStorage.getItem('userLoginData'));
    const userString = await storage.get('user');
    user = JSON.parse(userString);
    
    // }

    if (companyCode !== '') {
      if (user) {
        compareCompCodes(companyCode, user); 
      } else {
        console.log('Prepare Fresh Login');
        handleNewUser()
      }
    } else {
      console.log('No root compcode found');
      saveAndLoginUser(user);
    }
  }
  function compareCompCodes(currCompCode: string, user: any) {              
    if (currCompCode === user.EncCompanyId) {
      saveAndLoginUser(user);
      return;
    }
    console.log('Company code Mismatch.');
    handleNewUser();
  }

  const saveAndLoginUser = (savedData: any) => {
    if (savedData && savedData.UserName) {
      console.log('Logging you in! Please wait.');   
      makeLoginRequest(savedData);   
    } else {
      handleNewUser();    
    }
  }

  const makeLoginRequest = async (params: any) => {
    // console.log(params);
    let res;
    try {        
        setLoading(true);
        res = await axios.post(`${BASE_URL}/api/UserAuth/CheckCompLogin`, params);
        setLoading(false);
    } catch (error) {
        setLoading(false)
        alert("Can't log you in, some error occured.");
        return;
    }
    
    const data = res.data[0];
    // let appBusinessType = globalData.businessType.CodeValue;     
    // if (res.data.BusinessType !== appBusinessType) return alert('You are not Allowed to log in.');       // BLOCK LOGIN IF MISMATCH FOUND  

    if (!validRegType(data.UserRegTypeId, false)) return;      // don't check in OPD module.

    if (data.Remarks === 'INVALID') {
      console.log('The username or password is incorrect.');
      handleNewUser();
    } else if (!validRegType(data.UserRegTypeId)) {
      return;
    } else if (data.Remarks === 'NOTINCOMPANY') {
      console.log('Not Registered in this company.')
      handleNewUser();
    } else if (data.Remarks === 'INACTIVE') {
        alert('User Not Activated.')
    //   toast(<InactiveWarningCard />, { position: "top-center", autoClose: false, closeButton: false, className: 'product-toast' });
    } else if (data.UserId) {
      let userData = { ...data, UserCompList: data?.UserCompList[0] };
      dispatch(setUser(userData));
      dispatch(setModal({name: "LOGIN", state: false, data: { type: uType.PATIENT }}))
      dispatch(setLogin(true));
    }
  }

  const handleNewUser = () => {
    dispatch(setLogin(false));
    // if (vType === 'RESTAURANT') { 
    //   history.push('/login');
    // }
  }

  if (!vType) return null;
  if (loading) {
    return <FullScreenLoading classes='absolute inset-0 z-[999999]' styles={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}} />
  }
  return null;
}
  
export default Auth;
