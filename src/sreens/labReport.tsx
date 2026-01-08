import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Clock, Eye } from 'lucide-react-native';
import { BASE_URL, HEXAGON_ID, SRC_URL } from '../constants';
import { useSelector } from 'react-redux';
import { getFrom, GridLoader, invalidDate } from '../components/utils';
import { RootState } from '../store/store';
import ButtonPrimary, { MyModal } from '../components';

import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Ionicons } from '@expo/vector-icons';

export default function LabReport({ id, type, onClose }: any ) {
  const tests = [
    { name: 'T3 T4 TSH test', reportDate: '', status: 'Pending' },
    { name: 'LIPID PROFILE', reportDate: '01/08/2025', status: 'Done' },
    { name: 'LIVER FUNCTION TEST', reportDate: '', status: 'Pending' }
  ];

  const compCode = useSelector((i: RootState) => i.compCode);
  const isLoggedIn = useSelector((i: RootState) => i.isLoggedIn);
  const [isVerified, setVerified] = useState(isLoggedIn ? false : true);       // open close state of verification modal.
  const [openReport, setOpenReport] = useState({ state: false, billId: '', autoId: '' });

  // Copied from invoices/default ----------------------------------------------------------------------------------------------------------------------------

  const [data, setData] = useState({loading: true, data: { SalesObj: {CompanyMaster: {}, SalesDetailsList: [], VoucherList: []} }, err: {status: false, msg: ''}});
  
  useEffect(() => {
      getData(id)
  }, [id])

  const getData = async (query: string) => {
      if (query) {
          const res = await getFrom(`${BASE_URL}/api/Appointment/GetBill?BilId=${query}&CID=${compCode}&type=${type}`, {}, setData);
          if (res) {
          setTimeout(() => {
              setData(res);            
          }, 400)
          }
      }
  }

  const closeReportPad = () => {
    setOpenReport({ state: false, billId: '', autoId: '' })
  }

  return (
    <>
      <ScrollView className="flex-1 bg-gray-50 p-3">
        <View className='justify-between flex-row p-4 items-center bg-white'>
            <Pressable onPress={() => onClose(false)} className='flex-row items-center gap-3'>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">Go Back</Text>
            </Pressable>
        </View>
        {(() => {
          if (data.loading) {
            return <GridLoader />;
          } else if (data.err.status) {
            return <Text className="text-rose-600">An error occured, please try again later. Error code: <Text className="text-gray-700">{data.err.msg}</Text></Text>;
          } else if (!data.data.SalesObj) {
            return <Text className="text-rose-600 py-2">No Data Received !</Text>;
          } else {
            const pageData = data.data.SalesObj;
            return (
              <View className="bg-white shadow-lg overflow-hidden">
                <View className="flex-row items-center p-4 border-b border-gray-200">
                  <Image className='rounded-lg mr-4 w-[6rem] h-[6rem] border border-gray-300' source={{ uri: `${SRC_URL}/Content/CompanyLogo/${pageData.CompanyMaster?.LogoUrl}` }}/>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">{pageData.CompanyMaster.COMPNAME}</Text>
                    <Text className="text-cyan-500 font-semibold">{pageData.CompanyMaster.CATCHLINE}</Text>
                    <Text className="text-gray-600 text-sm mt-1">{pageData.CompanyMaster.ADDRESS}</Text>
                    <Text className="text-gray-600 text-sm">PH: {pageData.CompanyMaster.CONTACT1} {pageData.CompanyMaster.CONTACT2 ? ` / ` + pageData.CompanyMaster.CONTACT2 : null}</Text>
                  </View>
                </View>
                <View className="p-4">
                  <View className="flex-row border-b border-gray-200 py-3">
                    <Text className="w-1/3 text-gray-600 font-semibold">UHID / MRD / Reg. Nos.</Text>
                    <Text className="flex-1 text-gray-800">{pageData.CpartyCode}</Text>
                  </View>

                  <View className="flex-row border-b border-gray-200 py-3">
                    <Text className="w-1/3 text-gray-600 font-semibold">Patient</Text>
                    <Text className="flex-1 text-gray-800">{pageData.PartyName}</Text>
                  </View>

                  <View className="flex-row border-b border-gray-200 py-3">
                    <Text className="w-1/3 text-gray-600 font-semibold">Age</Text>
                    <Text className="flex-1 text-gray-800">{pageData.Age} Years, Sex: {pageData.Gender}</Text>
                  </View>

                  <View className="flex-row border-b border-gray-200 py-3">
                    <Text className="w-1/3 text-gray-600 font-semibold">Ref. Doctor</Text>
                    <Text className="flex-1 text-gray-800">{pageData.ReferenceBy1}</Text>
                  </View>

                  <View className="flex-row border-b border-gray-200 py-3">
                    <Text className="w-1/3 text-gray-600 font-semibold">Invoice#</Text>
                    <Text className="flex-1 text-gray-800">{pageData.VchNo}    {pageData.VchDate === invalidDate || <Text className="ml-8">Date: {new Date(pageData.VchDate).toLocaleDateString('en-TT')}</Text>}</Text>
                  </View>
                </View>

                <View className="bg-cyan-500 flex-row py-3 px-4">
                  <Text className="flex-1 text-white font-bold">Test Name</Text>
                  <Text className="w-28 text-white font-bold text-center">Report Date</Text>
                  <Text className="w-24 text-white font-bold text-center">Status</Text>
                </View>

                {pageData.IsProvisionalInv === '1' ? 
                  <Text className="!p-10 mb-0 bg-rose-50 text-rose-600 text-center !text-lg uppercase">This is a provisional bill and shall not be treated as the final invoice.</Text>    
                  :
                  <>
                    {pageData.SalesDetailsList.map((test, index) => {
                      if (pageData.Department === "IPD- In Patient Services" && test.ReportGenerated !== 'Y') return;
                      else return (
                        <View key={index} className={`flex-row items-center py-4 px-4 ${ index !== tests.length - 1 ? 'border-b border-gray-200' : '' }`}>
                          <Text className="flex-1 text-gray-800">{test.Description}</Text>
                          <Text className="w-28 text-gray-800 text-center">{test.ReportDate === invalidDate || new Date(test.ReportDate).toLocaleDateString('en-TT')}</Text>
                          <View className="w-24 flex-row items-center justify-center">
                            {test.ReportGenerated === 'Y' ? (
                              <Pressable className='flex-row items-center gap-2' onPress={() => setOpenReport({ state: true, billId: test.BillId, autoId: test.LabRecId })}>
                                <Eye size={16} color="#3b82f6" />
                                <Text className="text-blue-500 ml-1">View</Text>
                              </Pressable>
                            ) : (
                              <>
                                <Clock size={16} color="#6B7280" className="mr-1" />
                                <Text className="text-gray-600 ml-1">Pending</Text>
                              </>
                            )}
                          </View>
                        </View>
                      )
                    })} 
                  </>
                }
              </View>
            )
          }
        })()}
      </ScrollView>
      <MyModal modalActive={openReport.state} onClose={closeReportPad}  name='REPORT' child={<ReportPad compInfo={data.data.SalesObj.CompanyMaster} handleClose={closeReportPad} billId={openReport.billId} autoId={openReport.autoId} />} />
    </>
  );
}


const ReportPad = ({ compInfo, handleClose, billId, autoId }: any) => {

    const [data, setData] = useState({loading: true, data: { Journal: {} }, err: {status: false, msg: ''}});
    const compCode = useSelector((i: RootState) => i.compCode);
    
    useEffect(() => {
        getData(compCode, billId, autoId)
    }, [compCode, billId, autoId])

    const getData = async (companyCode: string, bill: string, id: string) => {
        if (companyCode) {
            const res = await getFrom(`${BASE_URL}/api/TestReportGen/Get?CID=${companyCode}&BillId=${bill}&TestId=${id}`, {}, setData);
            if (res) {
                setTimeout(() => {
                    setData(res);            
                }, 400)
            }
        }
    }

    const renderData = (data: any) => {
        if (data.loading) {
            return <GridLoader containerClass='m-4 gap-4' />;
        } else if (data.err.status) {
            return <Text className="text-danger mark">An error occured, please try again later. Error code: <Text className="text-dark d-inline">{data.err.msg}</Text></Text>;
        } else if (!data.data.Journal.Sales.BillId) {
            return <Text className="text-danger py-2">No Data Received !</Text>;
        } else {
            const page = prescriptionPage(data.data.Journal?.Sales);          
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

    let hasBG = compCode === HEXAGON_ID;

    const prescriptionPage = (i: any) => {

        let itemOne = i?.SalesDetails[0];
        let sigRight = i.TravellerList.find(x => x.Sigposition === 'Right') || '';
        let sigLeft = i.TravellerList.find(x => x.Sigposition === 'Left') || '';
        let sigCenterRight = i.TravellerList.find(x => x.Sigposition === 'CenterRight') || '';
        let sigCenterLeft = i.TravellerList.find(x => x.Sigposition === 'CenterLeft') || '';
        // return `<h2 className='text-2xl'>HELLO WORLD</h2>`;
        
        return `
          <style>
            .w-100 {
              width: 100%;
            }
          </style>
          <div class="mTable card A4page p-3" style="background: ${hasBG ? 'transparent' : 'white'}">
              <table class="table-1" id="invoice" style="color:black; width: 100%">
                  <thead>
                      <tr style="background-color:#fff">
                          <td>
                              ${(() => {
                                  if (compCode === HEXAGON_ID) {
                                      return `
                                              <img src="${SRC_URL}/Content/images/Header861.png" class="w-100" alt="header">
                                              <img src="${SRC_URL}/Content/images/WaterMark861.png" style="width: 80%; height: auto; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: -1; opacity: 0.5" class="img-fluid" alt="header">
                                      `;
                                  } else {
                                      return `
                                          <div style="text-align: center; border-bottom: 1px solid">
                                              <div style="padding-right: 3px; position: relative; background-color:#fff; line-height: 0.6rem">
                                                  <div style="position: absolute; left: 0; bottom: 0; top: 0; display: flex; align-items: center">
                                                      <img style="max-width: 100%; padding: 0px 11px; height: 100%" src="${SRC_URL}/Content/CompanyLogo/${compInfo.LogoUrl}" alt="logo">
                                                  </div>
                                                  <h2 style="font-size: 20px; font-weight:bold">${compInfo.COMPNAME}</h2>
                                                  <h3 style="font-size: 20px; font-weight:400">${compInfo.CATCHLINE}</h3>
                                                  <p style="font-size: 16px">${compInfo.ADDRESS}</p>
                                                  <h4>Phone: <span>${compInfo.CONTACT1} ${compInfo.CONTACT2 ? ` / ${compInfo.CONTACT2}` : ''}</span></h4>
                                                  <h4>Email: <span>${compInfo.MAILID}</span></h4>
                                              </div>
                                          </div>
                                      `;
                                  }
                              })()}
                          </td>
                      </tr>
                      <tr>
                          <td colspan="4" class="py-2" style="border-bottom: 1px solid #000">
                              <!-- <table style="width: 100%">
                                  <tbody>
                                      <tr>
                                          <th style="text-align: right; line-height: 0">
                                              <img src="" alt="" style="height: auto; width: 100px; margin-top: -90px; transform: translateY(100px)">
                                          </th>
                                      </tr>
                                  </tbody>
                              </table> -->
                              <table style="width: 85%; font-size: 15px; line-height:1.15" cellspacing="1" cellpadding="0" class="table-2">
                                  <tbody>
                                      <tr>
                                          <td style="width: 60%">
                                              <table style="width: 100%">
                                                  <tbody>
                                                      <tr>
                                                          <td style="width: 30%"><b>VID</b></td>
                                                          <td style="width: 70%">: ${itemOne.VisitNo}</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>MRD</b></td>
                                                          <td>: ${i.MpartyCode}</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>Patient Name</b></td>
                                                          <td>: ${i.PartyName}</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>Age / Sex</b></td>
                                                          <td>
                                                              : ${i.Age} Yrs. &nbsp;&nbsp; ${i.Gender}
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>Referred By</b></td>
                                                          <td><span>: ${i.ReferenceBy}</span></td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                          <td valign="top" style="width: 40%">
                                              <table style="width: 100%">
                                                  <tbody>
                                                      <tr>
                                                          <td><b>Bill Date</b></td>
                                                          <td>: ${new Date(i.Billtime).toLocaleDateString('en-TT')} &nbsp;&nbsp; ${new Date(i.Billtime).toTimeString().substring(0, 5)}</td>
                                                      </tr>
                                                      ${compCode === HEXAGON_ID ? '<tr><td></td></tr>' : `
                                                          <tr>
                                                              <td><b>Collection Date</b></td>
                                                              <td>: ${itemOne.SampleDate === invalidDate || new Date(itemOne.SampleDate).toLocaleDateString('en-TT')}</td>
                                                          </tr>
                                                          <tr>
                                                              <td><b>Lab Received Date</b></td>
                                                              <td>: ${itemOne.LabReceivedDate === invalidDate || new Date(itemOne.LabReceivedDate).toLocaleDateString('en-TT')}</td>
                                                          </tr>
                                                      `}
                                                      <tr>
                                                          <td><b>Report Date</b></td>
                                                          <td>
                                                              : ${new Date(itemOne.ReportDate).toLocaleDateString('en-TT')} 
                                                              &nbsp;&nbsp; ${new Date(itemOne.ReportDate).toTimeString().substring(0, 5)}
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>Sample Source</b></td>
                                                          <td>
                                                              : ${itemOne.SampleSource || 'LAB'}
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
                  </thead>
                  <tbody>
                      <tr>
                          <td>
                              <div>
                                  <table class="report-content" style="width: 100%">
                                      <tbody> 
                                          ${i.SalesDetails[0]?.ItemQCList?.length === 0 ? `
                                                  <tr>
                                                      <td class="pt-3">${i.SalesDetails[0]?.QC_NB}</td>
                                                  </tr>
                                                  <tr>
                                                      <td>${i.SalesDetails[0]?.QC_Remarks}</td>
                                                  </tr>
                                                  <tr>
                                                      <td>${i.SalesDetails[0]?.NB}</td>
                                                  </tr>
                                              ` : `
                                                  ${i.SalesDetails.map(sale => `
                                                      <tr key="${sale.AutoId}">
                                                          <td colspan="4">
                                                              <div style="width: 100%">
                                                                  <div style="width: 100%; text-align: center; font-weight: bold">
                                                                      <table align="center" style="width: 100%">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td align="center"><u>DEPARTMENT OF ${sale.ItemGroup1}</u></td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td align="center" style="font-family: Times New Roman">
                                                                                      <u>${sale.ItemGroup}</u>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td align="center" style="border: 1px solid #060505">
                                                                                      <table style="width: 70%" align="center" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                              <tr>
                                                                                                  <td style="font-size: 14px; font-family: Times New Roman; text-align: center">
                                                                                                      <b>${sale.Description}</b>
                                                                                                  </td>
                                                                                              </tr>
                                                                                          </tbody>
                                                                                      </table>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </div>
                                                                  <table id="ResultTable1" class="ResultTbl mb-3 w-100" style="font-size: 15px" cellpadding="0" cellspacing="0">
                                                                      <tbody>
                                                                          <tr valign="top" height="32px">
                                                                              <th width="34%"><u>Test Name</u></th>
                                                                              <th class="Result1" width="15%"><u>Result</u></th>
                                                                              <th class="TestUnit1 text-center" width="15%"><u>UNIT</u></th>
                                                                              <th class="Normalrange1 text-center" width="36%"><u>Reference Range</u></th>
                                                                          </tr>
                                                                          ${sale.ItemQCList.map(test => {

                                                                              let lRange, uRange, fontWt;

                                                                              if (!i.Gender) return '';

                                                                              if (i.Age > 10) {
                                                                                  if (i.Gender.toUpperCase() === 'MALE') {
                                                                                      lRange = test.Male_LwrPange;
                                                                                      uRange = test.Male_UprRange;
                                                                                  } else if (i.Gender.toUpperCase() === 'FEMALE') {
                                                                                      lRange = test.Female_LwrRange;
                                                                                      uRange = test.Female_UprRange;
                                                                                  }
                                                                              } else {
                                                                                  lRange = test.Child_LwrRange;
                                                                                  uRange = test.Child_UprRange;
                                                                              }

                                                                              if (isNaN(test.Result)) {
                                                                                  fontWt = 'normal';
                                                                              } else {
                                                                                  let result = test.Result || 0;
                                                                                  if (result >= lRange && result <= uRange) {
                                                                                      fontWt = 'normal';
                                                                                  } else if (lRange === 0 && uRange === 0) {
                                                                                      fontWt = 'normal';
                                                                                  } else if (!(test.TestStandard.trim())) {
                                                                                      fontWt = 'normal';
                                                                                  } else {
                                                                                      fontWt = 900;
                                                                                  }
                                                                              }

                                                                              return (
                                                                                  (test.Result.trim() || test.Comments.trim()) ? `<tr key="${test.AutoId}" valign="top">
                                                                                      <td class="${test.QCRoot ? 'fw-semibold text-decoration-underline' : 'ps-3'}" valign="top">
                                                                                          ${test.TestDesc}
                                                                                          ${(test.Result.trim() && test.Method.trim()) ? `<font class="fs-6 d-block"> Method: ${test.Method}</font>` : ''}
                                                                                      </td>
                                                                                          <td valign="top" style="font-weight: ${fontWt}">
                                                                                              ${test.Result}
                                                                                              ${test.Comments.trim() ? `<span class="d-block">${test.Comments}</span>` : ''}
                                                                                          </td>
                                                                                          <td valign="top" class="TestUnit1 text-center">${test.UnitDesc}</td>
                                                                                          <td valign="top" class="Normalrange1 text-center">${test.TestStandard}</td>
                                                                                  </tr>` : ''
                                                                              );
                                                                          }).join('')}
                                                                      </tbody>
                                                                  </table>
                                                                  <table class="ResultTbl" style="width: 100%; font-size: 13px; padding: 15px 20px" align="left">
                                                                      <tbody>
                                                                          ${sale.InstrmntUsed?.trim() ? `<tr>
                                                                              <th class="text-nowrap" width="15%">Instrument Used : </th>
                                                                              <td width="85%">${sale.InstrmntUsed}</td>
                                                                          </tr>` : ''}  
                                                                          ${sale.Method?.trim() ? `<tr>
                                                                              <th class="text-nowrap">Method : </th>
                                                                              <td class="ps-2">${sale.Method}</td>
                                                                          </tr>` : ''}
                                                                          ${sale.QC_Remarks?.trim() ? `<tr>
                                                                              <th class="text-nowrap" valign="top">Special Remarks : </th>
                                                                              <td class="ps-2">${sale.QC_Remarks}</td>
                                                                          </tr>` : ''}
                                                                          ${sale.NB?.trim() ? `<tr>
                                                                              <th class="text-nowrap" valign="top">NB : </th>
                                                                              <td class="ps-2">${sale.NB}</td>
                                                                          </tr>` : ''}
                                                                          ${sale.Remarks?.trim() ? `<tr>
                                                                              <th class="text-nowrap" valign="top">Remarks : </th>
                                                                              <td class="ps-2">${sale.Remarks}</td>
                                                                          </tr>` : ''}
                                                                      </tbody>
                                                                  </table>
                                                                  <table class="w-100">
                                                                      <tbody>
                                                                          <tr>
                                                                              <td class="pt-3" align="center" valign="middle">***** End Of Report ***** </td>
                                                                          </tr>
                                                                      </tbody>
                                                                  </table>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  `).join('')}
                                          `}
                                      </tbody>
                                      <tfoot>
                                          <tr>
                                              <td style="height: 180px">&nbsp;</td>
                                          </tr>
                                      </tfoot>
                                      <tfoot class="w-full table fixed bottom-0 left-0 right-0">
                                          <tr>
                                              <td colspan="4">
                                                  <div style="width: 100%" class="div-1">
                                                      <table align="center" style="width: 100%; text-align: center; font-family: verdana, arial; font-size: 13px; border-collapse: collapse; padding-left: 88px; padding-right: 25px">
                                                          <tbody>
                                                              <tr>
                                                                  <td width="25%" id="S1" valign="bottom">
                                                                      ${sigLeft ? `<img src="${SRC_URL}/Content/images/${sigLeft.PartyCode}.png" style="width: 80px; height: 40px" alt="Doctor Signature">` : ''}
                                                                  </td>
                                                                  <td width="25%" valign="bottom">
                                                                      ${sigCenterLeft ? `<img src="${SRC_URL}/Content/images/${sigCenterLeft.PartyCode}.png" style="width: 80px; height: 40px" alt="Doctor Signature">` : ''}
                                                                  </td>
                                                                  <td width="25%" valign="bottom">
                                                                      ${sigCenterRight ? `<img src="${SRC_URL}/Content/images/${sigCenterRight.PartyCode}.png" style="width: 80px; height: 40px" alt="Doctor Signature">` : ''}
                                                                  </td>
                                                                  <td width="25%" id="S2" valign="bottom" align="left">
                                                                      ${sigRight ? `<img src="${SRC_URL}/Content/images/${sigRight.PartyCode}.png" style="width: 80px; height: 40px" alt="Doctor Signature">` : ''}
                                                                  </td>
                                                              </tr>
                                                              <tr>
                                                                  <td width="25%" style="padding-left: 1%">${sigLeft.Name}</td>
                                                                  <td width="25%">${sigCenterLeft.Name}</td>
                                                                  <td width="25%">${sigCenterRight.Name}</td>
                                                                  <td width="25%" class="font-semibold" align="left">${sigRight.Name}</td>
                                                              </tr>
                                                              <tr style="font-size: 0.9em">
                                                                  <td width="25%" style="padding-left: 1%">
                                                                      ${sigLeft.Qualification}
                                                                      <br><span>${sigLeft ? 'Reg. No:- ' + sigLeft.LicenceNo : ''}</span>
                                                                      <br><span>${sigLeft.SpecialistDesc}</span>
                                                                      <br><span>${sigLeft.AttachedWith}</span>
                                                                  </td>
                                                                  <td width="25%">
                                                                        ${sigCenterLeft.Qualification}
                                                                      <br><span>${sigCenterLeft ? 'Reg. No:- ' + sigCenterLeft.LicenceNo : ''}</span>
                                                                      <br><span>${sigCenterLeft.SpecialistDesc}</span>
                                                                      <br><span>${sigCenterLeft.AttachedWith}</span>
                                                                  </td>
                                                                  <td width="25%">
                                                                        ${sigCenterRight.Qualification}
                                                                      <br><span>${sigCenterRight ? 'Reg. No:- ' + sigCenterRight.LicenceNo : ''}</span>
                                                                      <br><span>${sigCenterRight.SpecialistDesc}</span>
                                                                      <br><span>${sigCenterRight.AttachedWith}</span>
                                                                  </td>
                                                                  <td width="25%" align="left">
                                                                      ${sigRight.Qualification}
                                                                      <br><span>${sigRight ? 'Reg. No:- ' + sigRight.LicenceNo : ''}</span>
                                                                      <br><span>${sigRight.SpecialistDesc}</span>
                                                                      <br><span>${sigRight.AttachedWith}</span>
                                                                  </td>
                                                              </tr>
                                                              <tr>
                                                                  <!-- <td width="25%" class="text-decoration-underline" style="font-size: 11px">
                                                                      Print By:
                                                                  </td> -->
                                                                  <td colspan="4" style="font-size: smaller">
                                                                      Comments: Please correlate with clinical condition
                                                                  </td>
                                                                  <!-- <td width="25%" class="text-decoration-underline" style="font-size: 11px">
                                                                      Checked By:
                                                                  </td> -->
                                                              </tr>
                                                              <tr>
                                                                  <td colspan="4">
                                                                      ${(() => {
                                                                          if (compCode === HEXAGON_ID) {
                                                                              return `<img src="${SRC_URL}/Content/images/Footer861.png" class="w-100" alt="foot-bg">`;
                                                                          } else {
                                                                              return '';
                                                                          }
                                                                      })()}
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </div>
                                              </td>
                                          </tr>
                                      </tfoot>
                                  </table>
                              </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
        `
    }

    const generatePDF = async () => {
        const { uri } = await Print.printToFileAsync({ html: prescriptionPage(data.data.Journal?.Sales) });
        return uri;
    };

    const sharePDF = async () => {
        let file = await generatePDF()
        if (file && (await Sharing.isAvailableAsync())) {
            await Sharing.shareAsync(file);
        }
    };

    // useEffect(() => {
    //     generatePDF()
    // }, [])

    return (
      <View className="flex-1 p-4 bg-gray-200">
        {renderData(data)}
      </View>
    )

}