import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { View, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import ButtonPrimary, { MyModal } from '.';
import colors from 'tailwindcss/colors';
import Constants from 'expo-constants';

export default function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      console.log('Checking for new update. inside checkforupdate function')
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          console.log('We received a new update. Please restart the app. this update contains bug fixes.')
          await Updates.fetchUpdateAsync();
          setUpdateAvailable(true);
        }
      } catch (e) {
        console.error('Error checking for updates:', e);
      }
    };

    console.log('Before local dev check.')
    console.log('__DEV__ : ' + __DEV__.toString())
    console.log('Constants.executionEnvironment : ' + Constants.executionEnvironment)

    if (__DEV__ || Constants.executionEnvironment !== "standalone") {
      console.log("Running in Expo Go - skipping update check");
      return;
    }
    
    checkForUpdates();
  }, []);

  if (!updateAvailable) return null;

    return (
      <View className='absolute justify-center items-center inset-0 z-50 bg-gray-800/50'>
      {/* <MyModal customClass='items-center' containerClass='mx-auto' modalActive={updateAvailable} name='UPDATES' child={ */}
          <View className='px-10 pt-10 pb-6 bg-white rounded-3xl max-w-[20rem] items-center w-full'>
              <View className='p-12 bg-fuchsia-100 rounded-full flex justify-center items-center'>
                  <Entypo name="download" size={60} color={colors.fuchsia[500]} />
              </View>
              <Text className="font-PoppinsSemibold text-gray-800 text-center text-lg mt-7 mb-3">We Recieved an Update.</Text>
              <Text className="font-PoppinsMedium text-gray-600 text-base mb-7">Please Restart the App.</Text>
              <ButtonPrimary title='RESTART' active={true} onPress={() => Updates.reloadAsync()} classes='w-full bg-slate-600 !h-[50px]' />
          </View>
      {/* } /> */}
      </View>
    )
}
