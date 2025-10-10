import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import ButtonPrimary from "@/src/components";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { getFrom, GridLoader, NoContent } from "@/src/components/utils";
import { BASE_URL, SRC_URL } from "@/src/constants";

export default function InvoicePreview({ id, type }: any) {

    const [pdfUri, setPdfUri] = useState<string | null>(null);
    // const LOCID = useSelector((i: RootState) => i.appData.location.LocationId)
    const compCode = useSelector((i: RootState) => i.compCode)
  
    const [data, setData] = useState({loading: true, data: { SalesObj: {CompanyMaster: {}, SalesDetailsList: [], VoucherList: []} }, err: {status: false, msg: ''}}); 

    useEffect(() => {
        getData(id, type)
    }, [id, type])

    const getData = async (query: string, reportType: string) => {
        if (query) {
            const res = await getFrom(`${BASE_URL}/api/Appointment/GetBill?BilId=${query}&CID=${compCode}&type=${reportType}`, {}, setData);
            if (res) {
                setTimeout(() => {
                    setData(res);            
                }, 400)
            }
        }
    }

    const renderData = (data: any) => {
        if (data.loading) {
            return <GridLoader />
        } else if (data.err.status) {
            return <Text className="text-red-600">An error occured, please try again later. Error code: <Text className="text-gray-700">{data.err.msg}</Text></Text>;
        } else if (!data.data.SalesObj) {
            return <NoContent label="No Data found." />;
        } else {
            const page = prescriptionPage(data.data.SalesObj);
            return (
                <>
                    <WebView
                        source={{ html: page }}
                        style={{ flex: 1 }}
                        allowFileAccess={true}         
                        allowUniversalAccessFromFileURLs={true}
                    />
                    <ButtonPrimary title='SHARE' active={true} onPress={sharePDF} classes='mt-4 !bg-slate-700 !h-[45px]' />
                </>
            )
        }
    }

    const prescriptionPage = (item: any) => {
        const paidAmount = item.VoucherList.reduce((total, i) => (total + i.Amount), 0).toFixed(2);
        const dueAmount = paidAmount - item.Amount;
        const html = `
            <div class="card A4page">
                <div class="card-body pt-3" style="width: 100%; padding: 0px 1.25rem;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>
                                    <div class="" style="width: 100%; text-align: center;">
                                        <table style="width: 100%; font-size: 14px;">
                                            <tbody>
                                            <tr>
                                                <td style="width: 15%; padding: 5px;"> <img src="${SRC_URL}/Content/CompanyLogo/${item.CompanyMaster.LogoUrl}" style="height: 100px; width: 100px;"></td>
                                                <td style="width: 70%;">
                                                    <table style="width: 100%; font-size: 18px;">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center" style="font-weight: bold; color: var(--clr-12);">
                                                                <h4 class="text-uppercase mb-1"><b>${item.CompanyMaster.COMPNAME}</b></h4>
                                                                <span style="font-size: 18px; color: var(--clr-12);"> ${item.CompanyMaster.CATCHLINE} </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="font-weight: normal;">${item.CompanyMaster.ADDRESS}</td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="font-weight: normal;">PH: ${item.CompanyMaster.CONTACT1} / ${item.CompanyMaster.CONTACT2}</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td style="width: 15%;"><img src="${SRC_URL}/Content/CompanyLogo/${item.CompanyMaster.LogoUrl_R}" style="height: auto; max-width: 100%; max-height: 100%;"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" align="center" style="border-bottom: 1px solid rgb(0, 0, 0); font-size: 18px;"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" style="height: 2px; border-bottom: 2px solid;"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" style="text-align: center;"><span style="display: block; color: var(--clr-12); padding: 4px 0px;"> <b>BILL/RECEIPT ( ${item.Department} )</b> </span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div style="width: 100%;">
                                        <div class="px-2" style="width: 100%; border: 1px solid rgb(0, 0, 0);">
                                            <table style="width: 100%;">
                                            <tbody>
                                                <tr>
                                                    <td style="width: 60%; font-size: 13px; border-right: 1px solid rgb(0, 0, 0);">
                                                        <table cellpadding="3" style="width: 100%;">
                                                        <tbody>
                                                            <tr>
                                                                <td><b> Patient Name : &nbsp; <font style="font-size: 19px;"> ${item.PartyName} </font> </b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><b>Age : &nbsp;</b> <font style="font-size: 18px; font-weight: bold;"> ${item.Age} Yrs.  </font> &nbsp;&nbsp;&nbsp;&nbsp;  <b>Sex : &nbsp; ${item.Gender}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><b>Address :&nbsp;</b> ${item.BillingAddress} </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <table style="width: 100%;">
                                                                    <tbody>
                                                                        <tr>
                                                                            ${item.UnderDocSpecialization ? '<td style="width: 20%"><b>' + item.UnderDocSpecialization + ' :</b></td>' : null}
                                                                            ${item.UnderDoct ? '<td style="font-weight: bold"><font style="font-size: 19px">' + item.UnderDoct + '</font></td>' : null}
                                                                        </tr>
                                                                        ${item.UnderDoct ? '<tr><td></td><td colspan="2">[' + item.UnderDoctQualification + ']</td></tr>' : null}
                                                                        <tr>
                                                                            <td colspan="2">
                                                                                <span><b>Token Number :</b>&nbsp;&nbsp; ${item.VisitNo}</span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                        </table>
                                                    </td>
                                                    <td style="width: 40%; font-size: 13px; vertical-align: top; padding-left: 2%;">
                                                        <table cellpadding="3" align="right" style="width: 100%;">
                                                        <tbody>
                                                            <tr>
                                                                <td><b>MRD &nbsp;:&nbsp; ${item.CpartyCode}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><b>PH &nbsp;:&nbsp; ${item.PMobile}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><b>Inv No &nbsp;:&nbsp; ${item.VchNo}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><b>Inv Date &nbsp;:&nbsp;</b> <span> ${item.VchDate?.substr(0, 10).split('-').reverse().join('/')}</span></td>
                                                            </tr>
                                                        </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <div class="" style="margin-top: 5px; width: 100%;">
                                            <div style="width: 100%;">
                                            <table class="table custom-table" style="width: 100%;">
                                                <thead>
                                                    <tr>
                                                        <th style="width: 10px;">#</th>
                                                        <th align="left"><span>Particulars</span></th>
                                                        <th>${item.Department === 'INVESTIGATION' ? 'Department' : ''}</th>
                                                        <th>Rate</th>
                                                        <th>Qty</th>
                                                        <th>Dis Amt.</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${item.SalesDetailsList.map((i, n) => {
                                                        return `
                                                                <tr key=${i.Description}>
                                                                <td>${n + 1}</td>
                                                                <td align="left">${i.Description} </td>
                                                                <td align="left" style="white-space: nowrap">${item.Department === 'INVESTIGATION' ? i.Department : ''}</td>
                                                                <td align="right">${i.Rate}</td>
                                                                <td align="right">${i.BillQty}</td>
                                                                <td align="right">${i.DiscountText}</td>
                                                                <td align="right">${i.Amount}</td>
                                                            </tr>
                                                        `
                                                    })}
                                                    <tr>
                                                        <td colspan="2" align="right" style="padding-right: 0px;">
                                                        <br>
                                                        <div style="padding-right: 60px; font-size: 1.8em;">
                                                            <span>
                                                                ${dueAmount < 0 ? ('<b>Due Amount : ' + Math.abs(dueAmount) + '</b>') : ('<b>FULL PAID : ' + paidAmount + '</b>')}
                                                            </span>
                                                        </div>
                                                        <br>
                                                        <div align="left"><span></span></div>
                                                        </td>
                                                        <td colspan="5" align="right;">
                                                        <table style="width: 100%;">
                                                            <tbody>
                                                                ${item.ExpenseDetails.map(i => {
                                                                    return `                                                               
                                                                        <tr key=${i.AutoId}>
                                                                            <td>
                                                                                <b>${i.Description} </b>
                                                                            </td>
                                                                            <td align="right">
                                                                                <b>${i.AddLessDesc.includes('Cr.') ? '-' : ''} ${ i.Amount}</b>
                                                                            </td>
                                                                        </tr>
                                                                    `
                                                                })}
                                                                <tr>
                                                                    <td><b>Total Amount </b></td>
                                                                    <td align="right"><b>${item.Amount}</b></td>
                                                                </tr>
                                                                <tr>
                                                                    <td valign="top"><b>Paid Amount </b></td>
                                                                    <td align="right">
                                                                    <table style="width: 100%;">
                                                                        <tbody>
                                                                            ${item.VoucherList.map(i => {
                                                                                return `
                                                                                    <tr key=${i.AutoId}>
                                                                                        <td align="right">
                                                                                            <div className="d-flex justify-content-between">
                                                                                                <font style="font-style: italic; font-weight: bold;" > By ${i.PaymentMode}</font> 
                                                                                                <b>${i.VoucherAmount}</b>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                `
                                                                            })}
                                                                            ${item.VoucherList.length > 1 ? `<tr>
                                                                                <td align="right">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <font style="font-style: italic; font-weight: bold;" > Total Paid </font> 
                                                                                        <b>${paidAmount}</b>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>` : ''}
                                                                        </tbody>
                                                                    </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2"><span> Receive with thanks from ${item.PartyName} an amount of  <b> ${item.AmountText}</b> by ${item.Insname} </span></td>
                                                        <td colspan="5" style="height: 30px; text-align: right; padding-top: 35px;"><b> Bill By :</b> ${item.Insname}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                        <div class="" style="width: 100%;">
                                            <table style="width: 100%;">
                                            <tbody>
                                                <tr>
                                                    <td style="width: 33%;"></td>
                                                    <td style="width: 33%;"></td>
                                                    <td style="width: 33%;"></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
        return html;
    }

    const generatePDF = async () => {
        const { uri } = await Print.printToFileAsync({ html: prescriptionPage(data.data.SalesObj) });
        return uri;
    };

    const sharePDF = async () => {
        let file = await generatePDF()
        if (file && (await Sharing.isAvailableAsync())) {
            await Sharing.shareAsync(file);
        }
    };

    useEffect(() => {
        generatePDF()
    }, [])

    return (
        <View className="flex-1 p-4 bg-gray-200">
            {renderData(data)}
        </View>
    );
}




// Uses webview to load website invoice and can be used to print that invoice.

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// export default function InvoicePDF() {
//   return (
//     <View className="flex-1">
//       <WebView 
//         source={{ uri: "http://192.168.137.1:3000" }} 
//         style={{ flex: 1 }} 
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//       />
//     </View>
//   );
// }





