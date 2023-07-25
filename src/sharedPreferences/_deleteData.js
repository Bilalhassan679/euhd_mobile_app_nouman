import AsyncStorage from '@react-native-community/async-storage';

export default _deleteData=(STORAGE_KEY)=>{
    return new Promise(async(resolve) => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            resolve(true);
          } catch (e) {
            resolve(false);
          }
    })
    
}