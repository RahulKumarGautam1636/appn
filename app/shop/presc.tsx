import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
  Button,
} from 'react-native';
import { X, Plus, User, MapPin, Upload, FileText } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { setModal } from '@/src/store/slices/slices';
import { useDispatch } from 'react-redux';
import { FileUploader } from '@/src/components/utils';
import colors from 'tailwindcss/colors';

const PrescriptionForm = () => {
  const [patientData, setPatientData] = useState({
    name: 'Sameer',
    phone: '9330241456',
    age: '42',
    gender: 'Male',
    bedNumber: 'B-1/312',
    area: 'Kalyani',
    state: 'West Bengal',
    pincode: '741235',
  });

  const dispatch = useDispatch();

  const [doctorData, setDoctorData] = useState({
    name: '',
    address: '',
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleClearAll = () => {
    setPatientData({
      name: '',
      phone: '',
      age: '',
      gender: '',
      bedNumber: '',
      area: '',
      state: '',
      pincode: '',
    });
  };

  const handleSelectAnotherPatient = () => {
    Alert.alert('Select Patient', 'Patient selection functionality');
  };

  const handleUploadFile = () => {
    Alert.alert('Upload File', 'File upload functionality');
    setUploadedFile('prescription.jpg');
  };

  return (
    <ScrollView className="flex-1 bg-purple-100">
      <View className="p-4">
        <View className='justify-between flex-row py-4 items-center'>
            <Pressable onPress={() => dispatch(setModal({name: 'PRESC', state: false}))} className='flex-row items-center gap-3'>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text className="font-PoppinsSemibold text-gray-700 text-[15px] items-center leading-5">ADD PRESCRIPTION</Text>
            </Pressable>
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
                  value={patientData.name}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, name: text })
                  }
                  placeholder="Patient Name"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patientData.phone}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, phone: text })
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
                  value={patientData.age}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, age: text })
                  }
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patientData.gender}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, gender: text })
                  }
                  placeholder="Gender"
                />
              </View>
            </View>

            <TextInput
              className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
              value={patientData.bedNumber}
              onChangeText={(text) =>
                setPatientData({ ...patientData, bedNumber: text })
              }
              placeholder="Bed Number"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patientData.area}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, area: text })
                  }
                  placeholder="Area"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patientData.state}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, state: text })
                  }
                  placeholder="State"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border border-gray-300 rounded-md px-3 py-3 text-gray-700 bg-gray-50"
                  value={patientData.pincode}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, pincode: text })
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
                value={doctorData.name}
                onChangeText={(text) =>
                  setDoctorData({ ...doctorData, name: text })
                }
                placeholder="Doctor name"
              />
            </View>

            <View className="flex-row gap-2 items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <MapPin size={20} color="#666" />
              <TextInput
                className="flex-1 text-gray-700"
                value={doctorData.address}
                onChangeText={(text) =>
                  setDoctorData({ ...doctorData, address: text })
                }
                placeholder="Doctor Address"
              />
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-base text-gray-600 mb-4">
            Please select clean and valid prescription.
          </Text>
          <FileUploader />
          <View className="mt-6">
            <Text className="text-base font-semibold text-gray-700 mb-1">
              Ensure Clear Doctor signature & stamp
            </Text>
            <Text className="text-sm text-gray-500">
              The prescription with a signature and/or stamp of the doctor is
              considered as valid.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PrescriptionForm;