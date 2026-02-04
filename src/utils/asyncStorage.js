import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('setItem:', error);
  }
};

export const getItem = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('GetItem:', error);
  }
};

export const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('removeItem:', error);
  }
};
