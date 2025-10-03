import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import ButtonPrimary from "@/src/components";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { getFrom } from "@/src/components/utils";
import { BASE_URL } from "@/src/constants";

export default function InvoicePreview() {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  // const id = '188796';
  // const [data, setData] = useState({loading: true, data: { PrescriptionObj: {CompanyMaster: {}, PrescriptionHospDocsAnnexList: [], PrescriptionDetailsList: []} }, err: {status: false, msg: ''}});
  // const LOCID = useSelector((i: RootState) => i.appData.location.LocationId)
  // const compCode = useSelector((i: RootState) => i.compCode)
  // const prescPage = data.data.PrescriptionObj
  // const pharmacy = prescPage?.PrescriptionDetailsList?.filter(i => i.Category === "PHARMACY");
  // const investigations = prescPage?.PrescriptionDetailsList?.filter(i => i.Category === "INVESTIGATION");

  // useEffect(() => {
  //   getData(id)
  // }, [id])

  // const getData = async (query: string) => {
  //   if (query) {
  //     const res = await getFrom(`${BASE_URL}/api/Appointment/GetPrescription?PId=${query}&CID=${compCode}&LOCID=${LOCID}`, {}, setData);
  //     if (res) {
  //       setTimeout(() => {
  //           setData(res); 
  //           console.log(res.data);                       
  //       }, 400)
  //     }
  //   }
  // }

  const html = `
    <html>
        <head></head>
        <body>
            <div class="print-page prescription invoice-print" id="printContent" style="width: 100%">
                <div class="" id="printContent" style="width: 100%">
                    <div class="col-md-12" style="width: 100%">
                        <div class="card A4page">
                            <div class="card-body pt-3" style="width: 100%">
                                <table style="width: 100%">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div class="" style="width: 100%; text-align: center">
                                                    <table style="width: 100%; font-size: 14px">
                                                        <tbody>
                                                            <tr>
                                                                <td style="width: 15%; padding: 5px">
                                                                    <img src="https://erp.gsterpsoft.com/Content/CompanyLogo/612.png" style="height: 100px; width: 100px" />
                                                                </td>
                                                                <td style="width: 70%">
                                                                    <table style="width: 100%; font-size: 18px">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" style="font-weight: bold;color: var(--clr-12);">
                                                                                    <h4 class="text-uppercase mb-1">
                                                                                        <b>XYZ Multispeciality Hospital</b>
                                                                                    </h4>
                                                                                    <span style="
                                                                                            font-size: 18px;
                                                                                            color: var(--clr-12);
                                                                                            ">
                                                                                        Your Health, Our Mission
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="center" style="font-weight: normal">
                                                                                    HAZRA ROAD
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="center" style="font-weight: normal">
                                                                                    PH: 9123884846 / 8584057149
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td style="width: 15%">
                                                                    <img src="https://erp.gsterpsoft.com/Content/CompanyLogo/R_LOGO612.png"
                                                                        style="height: auto; max-width: 100%; max-height: 100%;" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="3" align="center" style="border-bottom: 1px solid rgb(0, 0, 0); font-size: 18px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="3" style="height: 2px; border-bottom: 2px solid"></td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="3" style="text-align: center">
                                                                    <span style="display: block; color: var(--clr-12); padding: 4px 0px;">
                                                                        <b>BILL/RECEIPT ( OPD - CONSULTATION )</b>
                                                                    </span>
                                                                </td>
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
                                                <div style="width: 100%">
                                                    <div class="px-2" style="width: 100%; border: 1px solid rgb(0, 0, 0)">
                                                        <table style="width: 100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="width: 60%; font-size: 13px; border-right: 1px solid rgb(0, 0, 0);">
                                                                        <table cellpadding="3" style="width: 100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>
                                                                                        <b>
                                                                                            Patient Name : &nbsp;
                                                                                            <font style="font-size: 19px">
                                                                                                Dr k Gautam
                                                                                            </font>
                                                                                        </b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <b>Age : &nbsp;</b>
                                                                                        <font style="font-size: 18px;font-weight: bold;">
                                                                                            31 Yrs.
                                                                                        </font>
                                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                        <b>Sex : &nbsp; Male</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <b>Address :&nbsp;</b> exaple user
                                                                                        addres, West Bengal 743165
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <table style="width: 100%">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="width: 20%">
                                                                                                        <b>DENTIST :</b>
                                                                                                    </td>
                                                                                                    <td
                                                                                                        style="font-weight: bold">
                                                                                                        <font style="font-size: 19px">dr. lucky</font> 
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td></td>
                                                                                                    <td colspan="2">[mbbs]</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td colspan="2">
                                                                                                        <span><b>Token Number:</b>&nbsp;&nbsp; 250722-001</span>
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
                                                                        <table cellpadding="3" align="right" style="width: 100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td><b>MRD &nbsp;:&nbsp; 100651</b></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <b>PH &nbsp;:&nbsp; 6000000012</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <b>Inv No &nbsp;:&nbsp; SB000000590</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <b>Inv Date &nbsp;:&nbsp;</b>
                                                                                        <span> 22/07/2025</span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div class="" style="margin-top: 5px; width: 100%">
                                                        <div style="width: 100%">
                                                            <table class="table custom-table" style="width: 100%">
                                                                <thead>
                                                                    <tr>
                                                                        <th style="width: 10px">#</th>
                                                                        <th align="left"><span>Particulars</span></th>
                                                                        <th></th>
                                                                        <th>Rate</th>
                                                                        <th>Qty</th>
                                                                        <th>Dis Amt.</th>
                                                                        <th>Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>1</td>
                                                                        <td align="left">CONSULTANT CHARGE</td>
                                                                        <td align="left" style="white-space: nowrap"></td>
                                                                        <td align="right">1000</td>
                                                                        <td align="right">1</td>
                                                                        <td align="right">0</td>
                                                                        <td align="right">1000</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" align="right"
                                                                            style="padding-right: 0px">
                                                                            <br />
                                                                            <div style="padding-right: 60px; font-size: 1.8em;">
                                                                                <span><b>FULL PAID : 1000.00</b></span>
                                                                            </div>
                                                                            <br />
                                                                            <div align="left"><span></span></div>
                                                                        </td>
                                                                        <td colspan="5" align="right;">
                                                                            <table style="width: 100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td><b>Total Amount </b></td>
                                                                                        <td align="right"><b>1000</b></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td valign="top">
                                                                                            <b>Paid Amount </b>
                                                                                        </td>
                                                                                        <td align="right">
                                                                                            <table style="width: 100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="right">
                                                                                                            <div
                                                                                                                class="d-flex justify-content-between">
                                                                                                                <font style="font-style: italic; font-weight: bold;">By Cash</font>
                                                                                                                <b>1000</b>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2">
                                                                            <span>
                                                                                Receive with thanks from Dr k Gautam an amount of
                                                                                <b> Rupees One Thousand Only</b> by Hospital demo
                                                                            </span>
                                                                        </td>
                                                                        <td colspan="5" style="height: 30px; text-align: right; padding-top: 35px; ">
                                                                            <b> Bill By :</b> Hospital demo
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div class="" style="width: 100%">
                                                        <table style="width: 100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="width: 33%"></td>
                                                                    <td style="width: 33%"></td>
                                                                    <td style="width: 33%"></td>
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
                    </div>
                </div>
            </div>
        </body>
    </html>
  `;

  const generatePDF = async () => {
    const { uri } = await Print.printToFileAsync({ html });
    setPdfUri(uri); 
  };

  const sharePDF = async () => {
    if (pdfUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(pdfUri);
    }
  };

  useEffect(() => {
    generatePDF()
  }, [])

  return (
    <View className="flex-1 p-4 bg-gray-200">
      {pdfUri && (
        <>
          <WebView
            // source={{ uri: html }}
            source={{ html: html }}
            style={{ flex: 1 }}
            allowFileAccess={true}         
            allowUniversalAccessFromFileURLs={true}
          />
          <ButtonPrimary title='SHARE' active={true} onPress={sharePDF} classes='mt-4 !bg-slate-700 !h-[45px]' />
        </>
      )}
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





