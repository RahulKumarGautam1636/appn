import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
};

const AppointmentButton: React.FC<Props> = ({ label, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient
        colors={['#00B4DB', '#0083B0']} // Blue gradient
        style={styles.gradient}>
        <View style={styles.content}>
          <Icon name="calendar" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.label}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
// USAGE
{/* <AppointmentButton label="Book Appointment" onPress={() => router.push("/nested/home")} /> */}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'center',
    marginVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  icon: {
    marginRight: 2,
  },
});


export default AppointmentButton;