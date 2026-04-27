import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@chitti:';

export const Storage = {
  async set(key: string, value: string) {
    await AsyncStorage.setItem(PREFIX + key, value);
  },
  async get(key: string) {
    return await AsyncStorage.getItem(PREFIX + key);
  },
  async remove(key: string) {
    await AsyncStorage.removeItem(PREFIX + key);
  },
};

export default Storage;
