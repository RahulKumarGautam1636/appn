import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import ButtonPrimary from ".";
import colors from "tailwindcss/colors";
import Constants from "expo-constants";
import axios from "axios";
import { Linking } from "react-native";
import { versions } from "../constants";
import { RadioTower } from "lucide-react-native";

const openPlayStore = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Error Unable to open Play Store link");
    }
  } catch (err) {
    console.error("Failed to open Play Store:", err);
  }
}

export default function UpdateBanner() {
   
  const [update, setUpdate] = useState({active: false, type: '', url: ''})

  useEffect(() => {

    async function checkForStoreUpdate() {
      try {
        const pakage = Constants.expoConfig?.android?.package;       
        const [ major, minor, patch ] = (versions[Constants.expoConfig?.scheme]).split(".").map(Number)                                     // Constants.expoConfig?.version?.split(".").map(Number);        
        const res = await axios.get(`https://myapps.gsterpsoft.com/api/AppVersion/GetLatestVersion?Type=app&AppWebName=${pakage}`);   
        // const res = await axios.get(`http://10.0.2.2:3000/versions/${pakage?.split('.')[2]}`);                                           // Emulator      
        // const res = await axios.get(`http://http://192.168.0.127:3000/versions/${pakage}`);                                              // Ipconfig 2
        const { Major, Minor, Patch, AppWebName } = res.data.VersionObj
        const playStoreUrl = `https://play.google.com/store/apps/details?id=${AppWebName}`;
        console.log(Major, Minor, Patch, playStoreUrl, major, minor, patch);
        if (Minor > minor) {
          setUpdate({ active: true, type: 'force', url: playStoreUrl })
        } 
        // else if (Patch > patch) {
        //   setUpdate({ active: true, type: 'optional', url: playStoreUrl })
        // }
      } catch (e) {
        console.log("Error checking version:", e); 
      }
    }

    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdate({ active: true, type: 'optional', url: '' })
        } else {
          console.log("ℹ️ No update available.");
          checkForStoreUpdate();
        }
      } catch (e) {
        console.error("❌ Error checking for updates:", e);
      }
    };

    if (__DEV__ || Constants.executionEnvironment === "storeClient") {
      console.log("🚫 Running in Expo Go - skipping update check");
      return;
    }
    checkForUpdates();
  }, []);

  if (!update.active) return null;

  return (
    <View className="absolute justify-center items-center inset-0 z-50 bg-gray-800/50">
      <View className="px-10 pt-10 pb-6 bg-white rounded-3xl max-w-[20rem] items-center w-full">
        <View className="p-12 bg-fuchsia-100 rounded-full flex justify-center items-center">
          <Entypo name="download" size={60} color={colors.fuchsia[500]} />
        </View>
        <Text className="font-PoppinsSemibold text-gray-800 text-center text-lg mt-7 mb-3">We Received an Update.</Text>
        <Text className="font-PoppinsMedium text-gray-600 text-base mb-7 text-center">
          {update.type === 'force' ? 'Please Update the App on Play Store.' : 'Please Restart the App'}
        </Text>
        {update.type === 'force' ? 
          <ButtonPrimary title="UPDATE" active={true} onPress={async () => openPlayStore(update.url)} classes="w-full bg-slate-600 !h-[50px]" />
          :
          <ButtonPrimary title="RESTART" active={true} onPress={async () => {await Updates.reloadAsync()}} classes="w-full bg-slate-600 !h-[50px]" />
        }
      </View>
    </View>
  );
}


// npx json-server --host 0.0.0.0 --port 3000 db.json

export const AppError = () => {
  return (
    <View className="absolute justify-center items-center inset-0 z-50 bg-gray-800/50">
      <View className="px-10 pt-10 pb-6 bg-white rounded-3xl max-w-[20rem] items-center w-full">
          {/* <Entypo name="download" size={60} color={colors.rose[500]} /> */}
          <RadioTower size={100} color={colors.rose[500]} />
        <Text className="font-PoppinsSemibold text-gray-800 text-center text-xl mt-8 mb-4">An Error Occured.</Text>
        <Text className="font-PoppinsMedium text-gray-600 text-base mb-7 text-center">Please check internet connection and restart the app.</Text>
        <ButtonPrimary title="RESTART" active={true} onPress={async () => {await Updates.reloadAsync()}} classes="w-full bg-slate-600 !h-[50px]" />
      </View>
    </View>
  )
}