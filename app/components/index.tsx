import { Text, TouchableOpacity } from "react-native"

export default function ButtonPrimary({ title, onPress, active, classes }: any) {
  return (
    <TouchableOpacity className={`p-4 items-center rounded-full shadow-sm shadow-gray-700 ${classes} ${active ? 'bg-pink-500' : 'bg-gray-300'}`} onPress={onPress}>
        <Text className={`font-PoppinsSemibold ${active ? 'text-white' : 'text-slate-500'}`}>{title}</Text>
    </TouchableOpacity>
  )
}