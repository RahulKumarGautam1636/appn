import { useDispatch, useSelector } from "react-redux";
import { getCompanies, setCompany, getDepartments, getMembers, getCompanyDetails, getProducts, getCategories, setLocation, setBusinessType } from "../store/slices/slices";
import { useEffect } from "react";
import { RootState } from "../store/store";
import { BASE_URL } from "../constants";
import { useFetch } from "./utils";

const Init = () => {
    
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const compCode = useSelector((state: RootState) => state.compCode);
    const { selected } = useSelector((state: RootState) => state.companies);
    const { location } = useSelector((state: RootState) => state.appData);
    const locationId = location.LocationId;
    const { vType, info: compInfo} = useSelector((state: RootState) => state.company);
    const userRegType = useSelector((state: RootState) => state.appData.userRegType.CodeValue);
    const compBusinessTypes = useFetch(`${BASE_URL}/api/Values/GetMstAllMaster?CID=${compInfo.CompanyId}&type=BUSINESSTYPE&P1=0`, compInfo.CompanyId)[0];


    // useEffect(() => {
    //     dispatch(getCompanyDetails({ compCode: compCode, locationId: locationId }))
    // }, [compCode, locationId])

    useEffect(() => {
        dispatch(getCompanies({ companyCode: compCode, userId: user.UserId || 0 }));
        dispatch(getMembers(compCode, user.UserId, user.MemberId));
    }, [user.UserId, compCode])

    useEffect(() => {
        if (!selected.EncCompanyId) return;
        dispatch(getDepartments({ companyCode: selected.EncCompanyId }));
    }, [selected.EncCompanyId])

    useEffect(() => {
        dispatch(getCategories({ compCode: compCode, locationId: locationId }));
    }, [compCode, locationId])

    useEffect(() => {
        dispatch(getProducts({ compCode: compCode, locationId: locationId }));
    }, [compCode, locationId])

    useEffect(() => {
        if (vType === 'ErpPharma' || vType === 'agro' || vType === 'ErpManufacturing') {        
            let userBusinessType;
            if (userRegType === 'Retailer') {
                userBusinessType = compBusinessTypes.find((i: any) => i.CodeValue === 'B2B');
            } else {
                userBusinessType = compBusinessTypes.find((i: any) => i.CodeValue === 'B2C');
            }
            if (!userBusinessType) return;
            dispatch(setBusinessType({ Description: userBusinessType.Description, CodeId: userBusinessType.CodeId, CodeValue: userBusinessType.CodeValue }));
            dispatch(setLocation({ LocationId: 0 }));
        }
    },[compBusinessTypes, userRegType, vType])

    // useEffect(() => {
    //     if ((vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT') || userRegType === 'Retailer' || vType === 'rent' || vType === 'agro' || vType === 'garments') {
    //         globalDataAction({prescription: { required: false, patient: { docName: '', docAddress: '' }}});
    //     } else {
    //         globalDataAction({prescription: { required: true, patient: { docName: '', docAddress: '' }}});
    //     }
    // },[vType, userRegType, globalDataAction])

    return null;
}

export default Init;