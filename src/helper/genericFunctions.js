import { Platform, NativeModules, BackHandler } from "react-native";

export const emptyValidate = (text) => {
  if (
    text === "" ||
    text === " " ||
    text === "null" ||
    text === null ||
    text === "undefined" ||
    text === undefined ||
    text === false ||
    text === "false"
  ) {
    return false;
  } else {
    return true;
  }
};

export function hexToRgbA(hex, opacity) {
  var c;
  var op = opacity ? opacity : 100;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    if (op > 100 || op < 0) {
      throw new Error("Bad Opacity");
    }
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      op / 100 +
      ")"
    );
  }
  throw new Error("Bad Hex");
}

export function RandomID(length, format) {
  const leng = length ? length : 5;
  const chars = format
    ? format
    : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = leng; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function closeApp(params) {
  if (Platform.OS === "ios") {
    NativeModules.ExitApp.exitApp();
  } else {
    BackHandler.exitApp();
  }
}

export function getDownloadDirectoryPath() {
  return new Promise(async (resolve) => {
    if (Platform.OS === "ios") {
      var path = await NativeModules.GetDownloadPath.getPath();
      console.warn("PATH==>\t", path);
    }
    resolve(true);
  }); //end of PROMISE
}

export function getAllPaths() {
  return new Promise(async (resolve) => {
    if (Platform.OS === "ios") {
      var path = await NativeModules.GetDownloadPath.getPaths();
      console.warn("PATH==>\t", path);
    }
    resolve(true);
  }); //end of PROMISE
}

export function getSwiftPaths() {
  return new Promise(async (resolve) => {
    if (Platform.OS === "ios") {
      NativeModules.DownloadFile.swiftFilePath();
    }
    resolve(true);
  }); //end of PROMISE
}

export const stringToBoolean = (stringValue) => {
  switch (`${stringValue}`?.toLowerCase()?.trim()) {
    case "true":
    case "yes":
    case "1":
      return true;

    case "false":
    case "no":
    case "0":
    case null:
    case undefined:
      return false;

    default:
      return JSON.parse(stringValue);
  }
};
