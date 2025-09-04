import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { getFrom, getStatusIcon, GridLoader, num, OrderItemCard, wait } from "../utils";
import ButtonPrimary from "..";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import axios from "axios";

const OrderReturn = ({ order, setOrderReturn }: any) => {

    const compCode = useSelector((i: RootState) => i.compCode);
    const locationId = useSelector((i: RootState) => i.appData.location.LocationId);
    const userId = useSelector((i: RootState) => i.user.UserId);
    const [loading, setLoading] = useState(false);

    const [returnOrder, setReturnOrder] = useState({ loading: false, data: { Journal: {}, PackSizeList: [], UnitList: [] }, err: { status: false, msg: '' } });

    const getReturnOrder = async (OrderId, InvoiceId, CID, LOCID) => {            
        const res = await getFrom(`${BASE_URL}/api/SalesInvoice/Get?OrderId=${order.type === 'order' ? OrderId : 0}&BillId=${order.type === 'order' ? 0 : InvoiceId }&CID=${CID}&LOCID=${LOCID}`, {}, setReturnOrder);            
        if (res) {
            await wait(1000);
            setReturnOrder(res);
        }
    } 

    const submitReturnRequest = async () => {
        if (returnOrder.loading) return;
        let body = order.orderData;
        const returnData = { 
            PartyCode: body.PartyCode,              
            CashPartyName: body.CashPartyName,      
            CashPartyMobile: body.CashPartyMobile,  
            VchNo: body.VchNo,      
            VchDate: body.VchDate,  
            VisitId: body.BillId,  
            VisitRefType: body.VisitRefType,   
            Amount: body.Amount,        
            InstrumentAmt: body.InstrumentAmt,      
            BillingState: body.BillingState,    
            DeptId: body.DeptId,        
            BillId: body.InvoiceList[0].BillId,        // body.BillId
            MODCOUNTER: body.MODCOUNTER,        
            Remarks: body.Remarks,      
            EncCompanyId: compCode,    // null
            LocationId: locationId,        
            InsBy: userId,      
            SalesReturnDetailsList: returnOrder.data.Journal.Sales.SalesReturnDetailsList.map(i => ({
                ItemId: i.ItemId,
                Description: i.Description,
                Unit: i.Unit,
                TrackingNo: i.TrackingNo,
                TrackingNo2: i.TrackingNo2,
                TrackingNo3: i.TrackingNo3,
                EXPDate: i.EXPDate,
                TransDate: i.TransDate,
                BillQty: i.BillQty,
                MRP: i.MRP,
                NetRateS: i.NetRateS,
                MRPOnDisPer: i.MRPOnDisPer,
                MRPOnDisAmt: i.MRPOnDisAmt,
                Rate: i.Rate,
                Discount: i.Discount,
                DiscountText: i.DiscountText,
                TaxableAmount: i.TaxableAmount,
                CRate: i.CRate,
                CFACTOR: i.CFACTOR,
                CGSTRATE: i.CGSTRATE,
                SGSTRATE: i.SGSTRATE,
                IGSTRATE: i.IGSTRATE,
                CGST: i.CGST,
                SGST: i.SGST,
                IGST: i.IGST,
                StockTypeCode: i.StockTypeCode,
                ACCODE: i.ACCODE,
                Amount: i.Amount,
                Delstatus: i.Delstatus,
                DrCrType: i.DrCrType,
                CFACTOR_MRP: i.CFACTOR_MRP,
                PackSizeId: i.PackSizeId,
                SBillId: i.SBillId,
                SBillDetailsId: i.SBillDetailsId
            }))
        }

        const status = await makeReturnRequest(returnData);        // ['Y', 4564] 
        if (status) {
            try {             
                if (status.split(',')[0] === 'Y') {
                    // Swal.fire({ title: 'Request Submitted Successfully !', customClass: {container: 'stack-on-top'}, icon: 'success'});
                    alert('Cancellation Request is submitted succefully.')
                    setOrderReturn((pre: any) => ({ ...pre, active: false}));
                }
            } catch (error) {
                alert('Something went wrong !');
            }
        }
    }    

    const makeReturnRequest = async (params: any) => {
        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/api/SalesInvoice/Post`, params);
            await wait(1000);
            setLoading(false);
            if (res.status === 200) return res.data;
            else return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    useEffect(() => {
        // if (!isLoggedIn) return setActive(false);
        getReturnOrder(order.orderData.BillId, order.orderData.InvoiceList.BillId, compCode, locationId);
    }, [order.orderData.BillId, order.orderData.InvoiceList.BillId, compCode, locationId])


    let isAlreadySubmitted = returnOrder.data.Journal?.Sales?.AlreadyReturnDetailsList.length;
    let pickupProgress = returnOrder.data.Journal?.Sales?.AlreadyReturnDetailsList[0]?.EnqFollowUpList;
    let isRequestApproved = pickupProgress?.length;

    let productItems;

    if (isAlreadySubmitted) {
        productItems = returnOrder.data.Journal?.Sales?.AlreadyReturnDetailsList || [];  
    } else {
        productItems = returnOrder.data.Journal?.Sales?.SalesReturnDetailsList || [];  
    }

    let total = productItems.reduce((total, i) => total + (parseFloat(i.NetRateS * parseFloat(i.BillQty))), 0).toFixed(2);

    let orderS = pickupProgress?.map((i: any) => (
        { title: i.Tag + ' ' + i.Remarks, date: new Date(i.NextAppDate).toDateString() + '    ' + i.NextAppTime, icon: getStatusIcon(i.Tag), completed: true }
    ))
    
    return (
        <ScrollView contentContainerClassName="bg-purple-50 min-h-full p-4">
            
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => setOrderReturn((pre: any) => ({ ...pre, active: false}))} className="flex-row items-center">
                <Ionicons name="chevron-back" size={22} color="#000" className="mr-2" />
                <Text className="text-lg font-semibold text-black">Return Order</Text>
                </TouchableOpacity>
            </View>

            {returnOrder.loading ? <GridLoader /> : <>
                <View className='bg-white rounded-3xl shadow-sm border-b border-gray-200'>
                    <View className='justify-between flex-row p-4 items-center border-b border-gray-200'>
                        <View className='flex-row items-center gap-3'>
                            <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">Order ID</Text>
                        </View>
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px] items-center leading-5">{order.orderData?.VchNo}</Text>
                    </View>
        
                    <View className='flex-row gap-3 p-4'>
                        <Text className="font-PoppinsSemibold text-slate-700 text-[14px] mr-auto">Order Total</Text>
                        <Text className={`font-PoppinsSemibold text-sky-600 text-[14px]`}>₹ {total}</Text>
                    </View>
                </View>
                <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Products List</Text>
                <View className='gap-3'>
                    {productItems.map((item, index) => <OrderItemCard data={item} key={index} />)}
                </View>
                <Text className='text-[1.05rem] mt-4 mb-3 font-PoppinsSemibold'>Return Details</Text>
                <View className='bg-white rounded-3xl px-4 py-2 mb-3 shadow-sm border-b border-gray-200'>
                    <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                        <Text className="text-slate-600 font-bold text-[13px] mr-auto">Name :</Text>
                        <Text className="text-[13px] text-slate-700 font-medium">{order.orderData?.CashPartyName}</Text>
                    </View>
                    <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                        <Text className="text-slate-600 font-bold text-[13px] mr-auto">Address :</Text>
                        <Text className="text-[13px] text-slate-700 font-medium">{order.orderData?.PartyAddress}</Text>
                    </View>
        
                    <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                        <Text className="text-slate-600 font-bold text-[13px] mr-auto">Order Total :</Text>
                        <Text className="text-[13px] text-slate-700 font-medium">₹ {total}</Text>
                    </View>
                    <View className='flex-row gap-3 px-1 py-[0.9rem] border-b border-gray-100'>
                        <Text className="text-slate-600 font-bold text-[13px] mr-auto">Total Paid :</Text>
                        <Text className="text-[13px] text-orange-600 font-semibold">₹ {total}</Text>
                    </View>
                    <View className='flex-row gap-3 px-1 py-[0.9rem]'>
                    <Text className="text-slate-600 font-bold text-[13px] mr-auto">Total Refund :</Text>
                    <Text className="text-[13px] text-green-600 font-semibold">₹ {total}</Text>
                    </View>
                </View>
                {isAlreadySubmitted ? <>
                    <Text className='text-[1.05rem] mb-3 mt-1 font-PoppinsSemibold'>Return Status</Text>
                    <TouchableOpacity className={`${isRequestApproved ? 'bg-green-500' : 'bg-orange-500'} rounded-2xl p-5 flex-row items-center justify-between mb-4`}>
                        <View className="flex-row items-center flex-1">
                            <View className={`${isRequestApproved ? 'bg-green-400' : 'bg-orange-400'} w-12 h-12 rounded-full items-center justify-center mr-4`}> 
                                <Feather name="check" size={24} color="#ffffff" />
                            </View>
                            <View className="flex-1">
                            <Text className="font-semibold text-white leading-7">Your Return Request is {"\n"}{isRequestApproved ? 'APPROVED' : 'WAITING FOR APPROVAL'}</Text>
                            {/* <Text className="text-sm text-gray-100">In order to place your order.</Text> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </> : ''}
                {orderS?.length ? <>
                    <View className="bg-white shadow-sm border-b border-gray-200 rounded-3xl py-6 pl-5 pr-6 mb-3">           
                        <View className="relative gap-5">
                            {orderS?.map((step, index) => (
                            <View key={index} className="flex-row items-start">
                                {index < orderS?.length - 1 && (<View className={`absolute left-4 top-8 w-0.5 h-12 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}/>)}
                                <View className={`w-8 h-8 rounded-full items-center justify-center z-10 ${step.completed ? 'bg-amber-600' : 'bg-gray-200'}`}>
                                    <Feather name={step.icon} size={16} color={step.completed ? 'white' : '#9CA3AF'} />
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text className={`font-semibold text-base mb-[0.4rem] ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.title}
                                    </Text>
                                    <Text className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                                        {step.date}
                                    </Text>
                                </View>
                                <View className="my-auto">
                                    <FontAwesome5 name="check" size={18} color={step.completed ? '#D97706' : '#9ca3af'} />
                                </View>
                            </View>
                        ))}
                        </View>
                    </View>
                </> : null}
                <View className="flex-row gap-4 mt-1">
                    {isAlreadySubmitted ? <ButtonPrimary title='CLOSE' onClick={() => setOrderReturn((pre: any) => ({ ...pre, active: false}))} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-gray-700' /> :
                        <>
                            <ButtonPrimary title='CANCEL' onClick={() => setOrderReturn((pre: any) => ({ ...pre, active: false}))} isLoading={false} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-rose-600' />
                            <ButtonPrimary title='SUBMIT REQUEST' onClick={submitReturnRequest} isLoading={false} active={true} classes='flex-1 !rounded-2xl !h-[50px] !bg-gray-700' />
                        </>
                    }
                </View>
            </>}
        </ScrollView>
      )
}

export default OrderReturn;
