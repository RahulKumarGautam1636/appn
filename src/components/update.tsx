import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import ButtonPrimary from ".";
import colors from "tailwindcss/colors";
import Constants from "expo-constants";

export default function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const FORCE_UPDATE_TEST = false;

  useEffect(() => {
    const checkForUpdates = async () => {
      console.log("👉 Inside checkForUpdates");

      try {
        if (FORCE_UPDATE_TEST) {
          console.log("⚡ Simulating update available (local test)");
          setUpdateAvailable(true);
          return;
        }

        console.log("🔍 Checking for new update from server...");
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          console.log("✅ Real update available. Fetching...");
          await Updates.fetchUpdateAsync();
          setUpdateAvailable(true);
        } else {
          console.log("ℹ️ No update available.");
        }
      } catch (e) {
        console.error("❌ Error checking for updates:", e);
      }
    };

    console.log("Before environment check.");
    console.log("__DEV__ :", __DEV__);
    console.log("Constants.executionEnvironment :", Constants.executionEnvironment);

    if (!FORCE_UPDATE_TEST && (__DEV__ || Constants.executionEnvironment === "storeClient")) {
      console.log("🚫 Running in Expo Go - skipping update check");
      return;
    }

    checkForUpdates();
  }, []);

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
          onPress={() => {
            console.log("♻️ Restarting app...");
            Updates.reloadAsync();
          }}
          classes="w-full bg-slate-600 !h-[50px]"
        />
      </View>
    </View>
  );
}
