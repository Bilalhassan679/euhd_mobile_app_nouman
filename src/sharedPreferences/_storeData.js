import AsyncStorage from '@react-native-community/async-storage';
import _deleteData from './_deleteData';

export default _storeData=(STORAGE_KEY,value)=>{
    return new Promise(async(resolve) => {
        try {
            const del=await _deleteData(STORAGE_KEY);
            if(del){
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
                resolve(true);
            }
            else{
                resolve(false);
            }
          } catch (e) {
            resolve(false);
          }
    })
    
}