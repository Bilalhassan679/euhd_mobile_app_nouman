import AsyncStorage from "@react-native-community/async-storage";

export default _retrieveData = STORAGE_KEY => {
  return new Promise(async resolve => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);

      if (value !== null) {
        console.warn(
          "Value retrieve from " +
            STORAGE_KEY +
            " is: \n" +
            JSON.parse(JSON.stringify(value))
        );

        resolve(JSON.parse(value));
        return;
      }
      resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
};
