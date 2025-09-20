import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import ButtonPrimary from ".";
import colors from "tailwindcss/colors";
import Constants from "expo-constants";

import * as Application from "expo-application";
import { Linking } from "react-native";
import axios from "axios";

export default function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(true);

  const FORCE_UPDATE_TEST = false;

  // useEffect(() => {
  //   const checkForUpdates = async () => {

  //     try {
  //       if (FORCE_UPDATE_TEST) {
  //         setUpdateAvailable(true);
  //         return;
  //       }

  //       const update = await Updates.checkForUpdateAsync();

  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         setUpdateAvailable(true);
  //       } else {
  //         console.log("ℹ️ No update available.");
  //       }
  //     } catch (e) {
  //       console.error("❌ Error checking for updates:", e);
  //     }
  //   };

  //   if (!FORCE_UPDATE_TEST && (__DEV__ || Constants.executionEnvironment === "storeClient")) {
  //     console.log("🚫 Running in Expo Go - skipping update check");
  //     return;
  //   }

  //   checkForUpdates();
  // }, []);

  function compareVersions(v1, v2) {
    const v1Parts = v1.split(".").map(Number);
    const v2Parts = v2.split(".").map(Number);
  
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const a = v1Parts[i] || 0;
      const b = v2Parts[i] || 0;
      if (a > b) return 1;
      if (a < b) return -1;
    }
    return 0;
  }
  
  async function checkForStoreUpdate() {
    try {
      alert('Checking for Updates.')
      const res = await axios.get("http://10.0.2.2:3000/versions/com.gbooks.bcroy");
      
      // const { latestVersion, minVersion, playStoreUrl } = res.data[0];
      
      // const currentVersion = Application.nativeApplicationVersion;
      console.log(
        res.data,
        Constants.expoConfig?.version
        // latestVersion, minVersion, playStoreUrl
      );
  
      // if (compareVersions(currentVersion, minVersion) < 0) {
      //   Linking.openURL(playStoreUrl);
      //   return { type: "force" };
      // }
  
      // if (compareVersions(currentVersion, latestVersion) < 0) {
      //   return { type: "optional", url: playStoreUrl };
      // }
  
      return { type: "none" }; // up to date
    } catch (e) {
      console.log("Error checking version:", e);
      return { type: "error" };
    }
  }

  if (!updateAvailable) return null;

  return (
    <View className="absolute justify-center items-center inset-0 z-50 bg-gray-800/50">
      <View className="px-10 pt-10 pb-6 bg-white rounded-3xl max-w-[20rem] items-center w-full">
        <View className="p-12 bg-fuchsia-100 rounded-full flex justify-center items-center">
          <Entypo name="download" size={60} color={colors.fuchsia[500]} />
        </View>
        <Text className="font-PoppinsSemibold text-gray-800 text-center text-lg mt-7 mb-3">
          We Received an Update.
        </Text>
        <Text className="font-PoppinsMedium text-gray-600 text-base mb-7">
          Please Restart the App.
        </Text>
        <ButtonPrimary
          title="RESTART"
          active={true}
          onPress={async () => {
            // console.log("♻️ Restarting app...");
            // await Updates.reloadAsync();
            await checkForStoreUpdate()
          }}
          classes="w-full bg-slate-600 !h-[50px]"
        />
      </View>
    </View>
  );
}



// {
//   "versions": {
//     "com.gbooks.bcroy": {
//       "AppWebName": "com.gbooks.bcroy",
//       "Major": 1,
//       "Minor": 0,
//       "Patch": 0,
//       "playStoreUrl": "https://play.google.com/store/apps/details?id=com.gbooks.bcroy"
//     },
//     "com.gbooks.gbooks": {
//       "AppWebName": "com.gbooks.gbooks",
//       "Major": 1,
//       "Minor": 0,
//       "Patch": 0,
//       "playStoreUrl": "https://play.google.com/store/apps/details?id=com.gbooks.gbooks"
//     }
//   }
// }

// npx json-server --host 0.0.0.0 --port 3000 db.json