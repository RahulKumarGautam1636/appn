import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useNavigation } from 'expo-router';
import { setModal, setRestaurant } from '@/src/store/slices/slices';
import { getFrom, GridLoader } from '@/src/components/utils';
import { BASE_URL } from '@/src/constants';

const tableData = {
  TERRACE: [
    { id: 'T001', number: 'T001', seats: 0, available: true },
    { id: 'T002', number: 'T002', seats: 0, available: true },
    { id: 'T003', number: 'T003', seats: 0, available: true },
    { id: 'T004', number: 'T004', seats: 0, available: true },
    { id: 'T005', number: 'T005', seats: 0, available: true },
    { id: 'T006', number: 'T006', seats: 0, available: true },
  ],
  HALL: [
    { id: 'H001', number: 'H001', seats: 0, available: true },
    { id: 'H002', number: 'H002', seats: 0, available: true },
    { id: 'H003', number: 'H002', seats: 0, available: true },
  ],
  LAWN: [
    { id: 'L001', number: 'L001', seats: 0, available: true },
  ],
};

export default function TableSelection() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    setModalVisible(true);
  };

  const confirmSelection = () => {
    setModalVisible(false);
    console.log('Selected table:', selectedTable);
  };

  const ActiveTable = ({ table }: any) => {
    const isActive = table.ProvInvBillid;
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => handleSelect(table)} className="bg-white rounded-2xl" style={{ shadowColor: "#1a3a2e", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}>
            <View className='px-4 pt-4 pb-2'>
                <View className="items-center mb-3">
                    <View className={`w-16 h-16 rounded-2xl items-center justify-center ${isActive ? 'border bg-rose-100/70 border-rose-200' : 'border-2 bg-[#f0e5c9] border-[#d4af374d]'}`} >
                        <Text className="text-4xl w-10 h-10">🪑</Text>
                    </View>
                </View>
                {/* <View className="items-center mb-3">
                    <View className="w-16 h-16 rounded-2xl items-center justify-center border bg-rose-100/70 border-rose-200">
                        <MaterialIcons name="table-restaurant" size={30} color={colors.yellow[600]} />
                    </View>
                </View> */}
                <Text className="text-center text-gray-800 font-bold text-sm tracking-wide">{table.BedDesc}</Text>
            </View>
            <View className={`${isActive ? 'bg-rose-500' : 'bg-[#D4AF37]'} px-2 py-1 rounded-bl-2xl rounded-br-2xl`}>
                <Text className={`text-white ${isActive ? `text-[12px]` : 'text-sm'} font-bold tracking-wide text-center`}>{isActive ? `₹ ${table.ProvVoucherAmount}` : 'AVAILABLE'}</Text>
            </View>
        </TouchableOpacity>
    )
  };

  const EmptyTable = ({ table, zone }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleTableSelect({ ...table })}
      className="bg-white rounded-2xl"
      style={{
        shadowColor: "#1a3a2e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View className='px-4 pt-4 pb-2'>
        <View className="items-center mb-3">
            <View className="w-16 h-16 rounded-2xl items-center justify-center border" style={{backgroundColor: "#f0e5c9",borderColor: "rgba(212, 175, 55, 0.3)"}} >
                <Text className="text-4xl w-10 h-10">🪑</Text>
            </View>
        </View>
        {/* <View className="items-center mb-3">
            <View className="w-16 h-16 rounded-2xl items-center justify-center bg-[#f1e8d0]" style={{borderColor: "rgba(212, 175, 55, 0.3)"}}>
                <MaterialIcons name="table-restaurant" size={30} color={colors.yellow[600]} />
            </View>
        </View> */}
        <Text className="text-center text-gray-800 font-bold text-sm tracking-wide">{table.number}</Text>
      </View>
      <View className="bg-[#D4AF37] px-2 py-1 rounded-bl-2xl rounded-br-2xl">
        <Text className="text-white text-xs font-bold tracking-wide text-center">AVAILABLE</Text>
      </View>
      {/* <View className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] rounded-b-2xl" /> */}
    </TouchableOpacity>
  );

  const ZoneSection = ({ title, tables, icon }: any) => (
    <View className="mb-6">
      {/* Zone Header */}
      <View className="mb-4">
        <LinearGradient
          colors={["#1a3a2e", "#2d5442"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-5 py-3 rounded-lg overflow-hidden flex-row items-center justify-between"
          style={{
            shadowColor: "#1a3a2e",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-2.5">
            <Text className="text-2xl">{icon}</Text>
            <Text className="text-white font-bold text-base tracking-widest">{title}</Text>
          </View>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">{tables.length} Tables</Text>
          </View>
        </LinearGradient>
      </View>
      <View className="flex-row flex-wrap gap-3">
        {tables.map((table) => (
          <View key={table.id} className="w-[31%]">
            <ActiveTable table={table} zone={title} />
          </View>
        ))}
      </View>
    </View>
  );

  // NEW WORK

    const queryString = {BedId: '', CID: ''};
    const bedId = queryString.BedId || '';
    const userInfo = useSelector((i: RootState) => i.user);
    const compCode = useSelector((i: RootState) => i.compCode);
    const appData = useSelector((i: RootState) => i.appData);
    let tableAutoSelect = appData.restaurant.table?.autoSelect;
    let locationId = appData.location.LocationId;
    const dispatch = useDispatch();

    const [data, setData] = useState({loading: true, data: { AccPartyMasterList: [], AccSubgroupObj: {}, PartyMasterObj: {} }, err: {status: false, msg: ''}});
    const navigate = useNavigation();

    useEffect(() => {
        if (tableAutoSelect) dispatch(setModal({ name: "TABLES", state: false }));
    }, [tableAutoSelect])

    useEffect(() => {
        getData(compCode, locationId)
    }, [compCode, locationId])

    const getData = async (companyId, LID) => {
        if (companyId) {
            const res = await getFrom(`${BASE_URL}/api/values/GetRBT?CID=${companyId}&LID=${LID}&Type=TableCategory`, {}, setData);
            if (res) {                     
            setData({loading: false, data: { AccPartyMasterList: res.data, AccSubgroupObj: {}, PartyMasterObj: {} }, err: {status: false, msg: ''}});                       
            }
        }
    }      

    // useEffect(() => {
    //     const onBackClick = (event) => {
    //         dispatch(setModal({ name: "TABLES", state: false }))
    //     }                                                                                                                  
    //     window.addEventListener("popstate", onBackClick);
    //     return () => window.removeEventListener("popstate", onBackClick);                               
    // }, [])

    const handleSelect = (item, autoSelectable=false) => {
        let requiredFields = {
            BedDesc: item.BedDesc,
            BedGroupDesc: item.BedGroupDesc,
            BedGroupId: item.BedGroupId,
            BedId: item.BedId,
            ChkInActive: item.ChkInActive,
            ChkoutActive: item.ChkoutActive,
            ProvInvBillid: item.ProvInvBillid,
            ProvBalAmt: item.ProvBalAmt,
            ProvVoucherAmount: item.ProvVoucherAmount
        }
        // globalDataAction({ restaurant: { table: { ...requiredFields, autoSelect: autoSelectable } }});
        dispatch(setRestaurant({ table: { ...requiredFields, autoSelect: autoSelectable }}))
        dispatch(setModal({ name: "TABLES", state: false }))
        // navigate('/checkout');
    }

    useEffect(() => {
        if (!data.data.AccPartyMasterList.length || !bedId) return;
        const table = data.data.AccPartyMasterList.find(i => i.BedId == bedId);
        if (!table) {
            dispatch(setModal({ name: "TABLES", state: false }))
            // globalDataAction({ restaurant: { table: { autoSelect: false } }});
            dispatch(setRestaurant({ table: { autoSelect: false }}))
            resetUrl()
            alert('Invalid table selection.')
        } else {
            if (table.ProvInvBillid) {
                dispatch(setModal({ name: "TABLES", state: false }))
                // globalDataAction({ restaurant: { table: { autoSelect: false } }});
                dispatch(setRestaurant({ table: { autoSelect: false }}))
                resetUrl()
                alert('This Table has already active orders.')
                return;
            }
            handleSelect(table, true);
        }
    }, [data.data.AccPartyMasterList, bedId])

    function resetUrl() {
        const hash = window.location.hash.split('#')[1] || '';
        const newUrl = `${window.location.origin}/?CID=${queryString.CID}#${hash}`;
        window.history.replaceState({}, '', newUrl);
    }

    const renderBedGroup = (groupId, groupName, data) => {
        const groupItems = data.filter((i: any) => i.BedGroupId === groupId);
        // return (
        //     <div className="bg-blue-50 rounded-lg p-4 mb-4" key={groupId}>
        //         <h2 className="text-xl font-bold text-gray-800 mb-4">{groupName}</h2>
        //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        //             {groupItems.map((table: any) => (
        //                 <TableCard key={table.BedId} table={table} handleSelect={handleSelect} />
        //             ))}
        //         </div>
        //     </div>
        // )

        return (
            <View className="mb-6" key={groupId}>
                <View className="mb-4">
                    <LinearGradient
                    colors={["#1a3a2e", "#2d5442"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="px-5 py-3 rounded-lg overflow-hidden flex-row items-center justify-between"
                    style={{
                        shadowColor: "#1a3a2e",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                    >
                    <View className="flex-row items-center gap-2.5">
                        <Text className="text-2xl">🌿</Text>
                        <Text className="text-white font-bold text-base tracking-widest">{groupName}</Text>
                    </View>
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-semibold">{groupItems.length} Tables</Text>
                    </View>
                    </LinearGradient>
                </View>
                <View className="flex-row flex-wrap gap-3">
                    {groupItems.map((table: any) => (
                        <View key={table.BedId} className="w-[31%]">
                            <ActiveTable table={table} />
                        </View>
                    ))}
                </View>
            </View>
        )
    }

    const renderData = (data) => {

        var bedGroupIdList = [...new Map(data.data.AccPartyMasterList.map(item => [item['BedGroupId'], item])).values()]; 

        if (data.loading) {
            return <GridLoader containerClass="flex-col gap-4" classes="min-h-[100px]" count={3} />;
        } else if (data.err.status) {
            return <Text className="text-danger mark">An error occured, please try again later. Error code: {data.err.msg}</Text>;
        } else if (data.data.AccPartyMasterList.length === 0) {
            return <Text className="text-danger py-2">No Data Received !</Text>;
        } else {
            return bedGroupIdList.map(i => renderBedGroup(i.BedGroupId, i.BedGroupDesc, data.data.AccPartyMasterList));
        }
    }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={["#ffffff", "#f9fafb"]}
        className="px-5 py-4 border-b border-gray-200"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[#D4AF37] text-sm font-semibold tracking-wide">Table Status</Text>
            <Text className="text-gray-800 font-bold text-2xl tracking-tight">Park Luxury Hotel</Text>
          </View>
          <TouchableOpacity className="bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl" onPress={() => dispatch(setModal({ name: "TABLES", state: false }))}>
            <Text className="text-red-600 font-bold text-xs tracking-wider">CLOSE</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={false}>
        {/* <ZoneSection title="TERRACE" tables={tableData.TERRACE} icon="🌿" />
        <ZoneSection title="HALL" tables={tableData.HALL} icon="🏛️" />
        <ZoneSection title="LAWN" tables={tableData.LAWN} icon="🌳" /> */}
        {renderData(data)}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
              <Text className="text-2xl font-bold text-gray-800 mb-1">Confirm Table Selection</Text>
              <Text className="text-gray-500 text-sm">Review your selection before confirming</Text>
            </View>

            {selectedTable && (
              <View
                className="rounded-2xl p-5 mb-6 border-2"
                style={{
                  backgroundColor: "#f0e5c9",
                  borderColor: "rgba(212, 175, 55, 0.3)",
                }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Table Number</Text>
                    <Text className="text-gray-900 text-3xl font-bold">{selectedTable.number}</Text>
                  </View>
                  <View className="bg-[#2d5442] w-16 h-16 rounded-2xl items-center justify-center">
                    <Text className="text-4xl">🪑</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4">
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Location</Text>
                    <Text className="text-gray-800 text-base font-semibold">{selectedTable.zone}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Seats</Text>
                    <Text className="text-gray-800 text-base font-semibold">{selectedTable.seats} Seats</Text>
                  </View>
                </View>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="flex-1 bg-gray-100 py-4 rounded-xl border border-gray-200" activeOpacity={0.7}>
                <Text className="text-center text-gray-700 font-bold text-sm tracking-wide">CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmSelection} activeOpacity={0.8} className="flex-1">
                <LinearGradient
                  colors={["#1a3a2e", "#2d5442"]}
                  className="py-4 rounded-xl items-center"
                  style={{
                    shadowColor: "#1a3a2e",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Text className="text-white font-bold text-sm tracking-wide">CONFIRM</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}