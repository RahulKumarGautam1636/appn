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
        dispatch(getCompanies({ companyCode: compCode, userId: user.UserId ? user.UserId : 14701 }));
        dispatch(getMembers(compCode, user.UserId, user.MemberId));
    }, [user.UserId, compCode])

    useEffect(() => {
        if (!selected.EncCompanyId) return;
        dispatch(getDepartments({ companyCode: selected.EncCompanyId }));
    }, [selected.EncCompanyId])

    return null;
}

export default Init;