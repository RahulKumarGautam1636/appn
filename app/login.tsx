import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import ButtonPrimary from "./components";

const Login = () => {
    const router = useRouter();
    return (
        <ScrollView contentContainerClassName='bg-slate-200 min-h-full'>
            <Image source={require('../assets/images/bg.jpg')} className="absolute w-full z-0" resizeMode="cover" />
            <View className='bg-white mt-auto rounded-tl-[2.7rem] rounded-tr-[2.7rem] px-4 pt-6 pb-36'>
                <Text className="font-PoppinsSemibold text-gray-800 text-[24px] text-center py-4">Welcome Back</Text>
                <View className="p-4 gap-6">
                    <View className='z-10'>
                        <Text className="text-pink-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Phone Number</Text>
                        <TextInput placeholder='Phone Number' className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                    </View>
                    <View className='z-10'>
                        <Text className="text-pink-500 text-[11px] font-PoppinsSemibold absolute z-10 left-5 -top-[9px] bg-white px-1">Password</Text>
                        <TextInput placeholder='Your Password' className='bg-white p-5 rounded-2xl text-[13px] border-2 border-stone-200' />
                    </View>
                    <Text className="text-pink-500 text-[13px] font-PoppinsSemibold ml-auto">Forgot Password ?</Text>
                    <ButtonPrimary onClick={() => router.navigate('/appn')} title='LOGIN' active={true} classes='rounded-2xl' textClasses='tracking-widest' />
                    <Text className="text-gray-500 text-[13px] font-PoppinsMedium mx-auto">Don't have Account ? 
                        <Text className="text-pink-500"> Register Now</Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default Login;