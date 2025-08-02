import { useDispatch, useSelector } from "react-redux";
import { getCompanies, getDepartments, getMembers } from "../store/slices/slices";
import { useEffect } from "react";
import { RootState } from "../store/store";

const Init = () => {
    
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const compCode = useSelector((state: RootState) => state.compCode);
    const { selected } = useSelector((state: RootState) => state.companies);

    useEffect(() => {
        dispatch(getCompanies({ companyCode: compCode, userId: user.UserId || 0 }));
        dispatch(getMembers(compCode, user.UserId, user.MemberId));
    }, [user.UserId, compCode])

    useEffect(() => {
        if (!selected.EncCompanyId) return;
        dispatch(getDepartments({ companyCode: selected.EncCompanyId }));
    }, [selected.EncCompanyId])

    // useEffect(() => {
    //     if ((vType === 'RESTAURANT' || vType === 'HOTEL' || vType === 'RESORT') || globalData.userRegType.CodeValue === 'Retailer' || vType === 'rent' || vType === 'agro' || vType === 'garments') {
    //         globalDataAction({prescription: { required: false, patient: { docName: '', docAddress: '' }}});
    //     } else {
    //         globalDataAction({prescription: { required: true, patient: { docName: '', docAddress: '' }}});
    //     }
    // },[vType, globalData.userRegType.CodeValue, globalDataAction])

    return null;
}

export default Init;