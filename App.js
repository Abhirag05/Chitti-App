import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { auth, db } from './src/firebase/config';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Chitti App is ready with Expo + Firebase.</Text>
      <Text style={styles.subText}>Auth ready: {auth ? 'yes' : 'no'}</Text>
      <Text style={styles.subText}>Firestore ready: {db ? 'yes' : 'no'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: {
    marginTop: 8,
    color: '#4b5563',
  },
});
