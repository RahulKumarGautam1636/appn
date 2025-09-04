import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Pressable, Button } from 'react-native';
import { X, Plus, User, MapPin, Upload, FileText } from 'lucide-react-native';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { setModal, setPrescription } from '@/src/store/slices/slices';
import { useDispatch, useSelector } from 'react-redux';
import { FileUploader, useFetch } from '@/src/components/utils';
import colors from 'tailwindcss/colors';
import { RootState } from '@/src/store/store';
import { BASE_URL, gender, myColors, states } from '@/constants';
import { MyModal } from '@/src/components';


const StateDropdown = ({ handler }: any) => {
    return (
        <ScrollView className="">
            <View className='bg-white m-4 rounded-3xl shadow-md shadow-gray-400'>
                {states.map((i: any, n: number) => (
                    <TouchableOpacity key={i.CodeId} className={`flex-row gap-3 p-4 ${n === (states.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => handler({ CodeId: i.CodeId, Description: i.Description })}>
                        <FontAwesome6 name="location-dot" size={20} color={myColors.primary[500]} />
                        <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.Description}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const GenderDropdown = ({ handler }: any) => {
    return (
      <View className='bg-white mx-4 rounded-3xl shadow-md shadow-gray-400'>
        {gender.map((i: any, n: number) => (
            <TouchableOpacity key={i.CodeId} className={`flex-row gap-3 p-4 ${n === (states.length -1) ? '' : 'border-b border-gray-300'}`} onPress={() => handler({ Gender: i.CodeId, GenderDesc: i.Description })}>
                <MaterialCommunityIcons name={i.icon} size={20} color={myColors.primary[500]} />
                <Text className="font-PoppinsSemibold text-gray-700 text-[14px]" numberOfLines={1}>{i.Description}</Text>
            </TouchableOpacity>
        ))}
      </View>
    )
}

const initFile = { name: '', uri: '', type: '', fileType: '', extn: '' };

const PrescriptionForm = () => {

  const dispatch = useDispatch();
  const compCode = useSelector((i: RootState) => i.compCode);
  const prescription = useSelector((i: RootState) => i.appData.prescription);
  const selectedMember = useSelector((i: RootState) => i.members.selectedMember);
  const genderData = useFetch(`${BASE_URL}/api/Values/Get`, compCode)[0];
  const statesList = useFetch(`${BASE_URL}/api/Values/Get?id=1`, compCode)[0];

  const [genderDropdown, setGenderDropdown] = useState(false);
  const [stateDropdown, setStateDropdown] = useState(false);

  const [file, setFile] = useState(initFile);

  const checkMember = () => {
    const selectedMemberStr = JSON.stringify({
      name: selectedMember.MemberName, 
      phone: selectedMember.Mobile, 
      gender: { CodeId: selectedMember.Gender, GenderDesc: selectedMember.GenderDesc }, 
      age: selectedMember.Age,
      memberId: selectedMember.MemberId,
      address: selectedMember.Address,
      city: selectedMember.City,
      pinCode: selectedMember.Pin,
      state: { CodeId: selectedMember.State, Description: selectedMember.StateDesc },
      docName: '',
      docAddress: '',
    })
    const currPatientStr = JSON.stringify({
        ...patient,
        docName: '',
        docAddress: '',
    })      
    return selectedMemberStr === currPatientStr;
  }
  
  const initMember = { 
    name: '', 
    phone: '', 
    gender: { CodeId: '', GenderDesc: '' }, 
    age: '', 
    memberId: 0,
    address: '',
    city: '',
    pinCode: '',
    state: {Description: 'West Bengal', CodeId: 3},
    docName: '', 
    docAddress: '', 
  }

  const [patient, setPatient] = useState(initMember);
  const [defaultMember, setDefaultMember] = useState(true);

  useEffect(() => {
    if (!prescription.required && !prescription.file.uri) return;
    else setFile(prescription.file)
  }, [prescription.file.uri])

  useEffect(() => {
    if (!prescription.required && !prescription.file.uri) return;
    else setFile(prescription.file)
  }, [prescription.file.uri])

  useEffect(() => {
    if (prescription.patient.name) {
        setPatient(pre => ({ 
            ...pre,
            name: prescription.patient.name, 
            phone: prescription.patient.phone, 
            gender: { CodeId: prescription.patient.gender.CodeId, GenderDesc: prescription.patient.gender.GenderDesc }, 
            age: prescription.patient.age,
            memberId: prescription.patient.memberId,
            address: prescription.patient.address,
            city: prescription.patient.city,
            pinCode: prescription.patient.pinCode,
            state: { CodeId: prescription.patient.state.CodeId, Description: prescription.patient.state.Description },
            docName: prescription.patient.docName,
            docAddress: prescription.patient.docAddress,
        }))
    } else {
        if (!defaultMember) return;
        if (!selectedMember.MemberId) return;
        // setDefaultMember(false);                            // control when to set by default. there are some case where we don't want it.
        setPatient(pre => ({ 
            ...pre,
            name: selectedMember.MemberName, 
            phone: selectedMember.Mobile, 
            gender: { CodeId: selectedMember.Gender, GenderDesc: selectedMember.GenderDesc }, 
            age: selectedMember.Age,
            memberId: selectedMember.MemberId,
            address: selectedMember.Address,
            city: selectedMember.City,
            pinCode: selectedMember.Pin,
            state: { CodeId: selectedMember.State, Description: selectedMember.StateDesc },
            docName: prescription.patient.docName,
            docAddress: prescription.patient.docAddress,
        }))
    }					

  },[selectedMember, prescription.patient])

  const handlePatient = (e) => {
    const  { name, value } = e.target;
    if (name === 'gender') {
        let currGender = genderData.find(i => i.CodeId == value);
        return setPatient(pre => ({ ...pre, gender: { CodeId: currGender.CodeId, GenderDesc: currGender.Description }}));
    } else if (name === 'state') {
        let currState = statesList.find(i => i.CodeId == value);
        return setPatient(pre => ({ ...pre, state: { CodeId: currState.CodeId, Description: currState.Description }}));
    }
    setPatient(pre => ({ ...pre, [name]: value}));           
  }

  function handleSubmit() {    
    if (!file.uri) return alert('Please select a file.');
    // let sizeInKB = file.size / 1024;
    // if (sizeInKB > 5000) {
    //   alert('Please select a file less than 5mb in size.');
    //   setFile({}); 
    //   setImgURL('');
    //   return; 
    // }

    const verifiedMemberId = checkMember() ? patient.memberId : 0;
    dispatch(setPrescription({ file: file, patient: { ...patient, memberId: verifiedMemberId }})); 
    dispatch(setModal({name: 'PRESC', state: false}))       
    // setFile({});
    // setImgURL('');
  } 



  const handleClearAll = () => {
    setPatient(initMember)
  };

  const handleSelectAnotherPatient = () => {
    Alert.alert('Select Patient', 'Patient selection functionality');
  };

  const removeFile = () => {
    setFile(initFile);
    dispatch(setPrescription({ file: initFile }));
  };

  return (
    <ScrollView className="flex-1 bg-purple-100">
      <View className="p-4">
        <View className='justify-between flex-row py-4 items-center'>
            <Pressable onPress={() => dispatch(setModal({name: 'PRESC', state: false}))} className='flex-row items-center gap-3'>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">ADD PRESCRIPTION</Text>
            </Pressable>
            {/* <Pressable onPress={() => console.log(patient)} className='flex-row items-center gap-3'>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">ADD PRESCRIPTION</Text>
            </Pressable> */}
        </View>
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="border-b-2 border-blue-400 pb-2 mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Patient Details.
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patient.name}
                  onChangeText={(text) =>
                    setPatient({ ...patient, name: text })
                  }
                  placeholder="Patient Name"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patient.phone}
                  onChangeText={(text) =>
                    setPatient({ ...patient, phone: text })
                  }
                  placeholder="Phone Number"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patient.age}
                  onChangeText={(text) =>
                    setPatient({ ...patient, age: text })
                  }
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Pressable className='' onPress={() => setGenderDropdown(true)}>
                  <TextInput
                    readOnly
                    className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                    value={patient.gender.GenderDesc}
                    placeholder="Gender"
                  />
                </Pressable>
                <MyModal modalActive={genderDropdown} onClose={() => setGenderDropdown(false)} child={<GenderDropdown handler={(item) => {setPatient({...patient, gender: item}); setGenderDropdown(false)}} />} />
              </View>
            </View>

            <TextInput
              className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
              value={patient.address}
              onChangeText={(text) =>
                setPatient({ ...patient, address: text })
              }
              placeholder="Address"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patient.city}
                  onChangeText={(text) =>
                    setPatient({ ...patient, city: text })
                  }
                  placeholder="Area"
                />
              </View>
              <View className="flex-1">
                <Pressable className='' onPress={() => setStateDropdown(true)}>
                  <TextInput
                    readOnly
                    className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                    value={patient.state.Description}
                    placeholder="State"
                  />
                </Pressable>
                <MyModal modalActive={stateDropdown} onClose={() => setStateDropdown(false)} child={<StateDropdown handler={(item) => {setPatient({...patient, state: item}); setStateDropdown(false)}} />} />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patient.pinCode}
                  onChangeText={(text) =>
                    setPatient({ ...patient, pinCode: text })
                  }
                  placeholder="Pincode"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mt-6 mb-2">
            <Button title="Clear All" color={colors.rose[500]} onPress={handleClearAll} />
            <Button color={colors.slate[700]} title="Select Another Patient" onPress={handleSelectAnotherPatient} />
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="border-b-2 border-blue-400 pb-2 mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Doctor Details.
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row gap-2 items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <User size={20} color="#666" />
              <TextInput
                className="flex-1 text-gray-700"
                value={patient.docName}
                onChangeText={(text) =>
                  setPatient({ ...patient, docName: text })
                }
                placeholder="Doctor name"
              />
            </View>

            <View className="flex-row gap-2 items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <MapPin size={20} color="#666" />
              <TextInput
                className="flex-1 text-gray-700"
                value={patient.docAddress}
                onChangeText={(text) =>
                  setPatient({ ...patient, docAddress: text })
                }
                placeholder="Doctor Address"
              />
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-base text-gray-600 mb-4">Please select clean and valid prescription.</Text>
          <FileUploader file={file} setFile={setFile} removeFile={removeFile} />

          <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 rounded-lg py-3 items-center">
            <Text className="text-white font-semibold text-base">
              Upload File
            </Text>
          </TouchableOpacity>

          <View className="mt-6">
            <Text className="text-base font-semibold text-gray-700 mb-1">Ensure Clear Doctor signature & stamp</Text>
            <Text className="text-sm text-gray-500">The prescription with a signature and/or stamp of the doctor is considered as valid.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PrescriptionForm;