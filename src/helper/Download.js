import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { emptyValidate, RandomID } from './genericFunctions';

//  export const LOCAL_DOWNLOAD_PATH = RNFS.DocumentDirectoryPath.replace("Documents", "Downloads/");

export const LOCAL_DOWNLOAD_PATH = RNFS.CachesDirectoryPath + "/EUHD/";


export default {

    isAnyDownloaded() {
        return new Promise(async (resolve) => {
            RNFS.readDir(LOCAL_DOWNLOAD_PATH)
                .then((result) => {
                    if (emptyValidate(result) && result.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                    // stat the first file

                }).catch((err) => {
                    console.log(err.message, err.code);
                    resolve(false);
                });
        })//end of PROMISE
    },//end of isAnyDownloadded

    DOWNLOADIOS(FILE_TO_DOWNLOAD, callBackBegin, callBackProgress, EXTENSIONParam = "mp4",) {
        return new Promise(async (resolve) => {


            let path = LOCAL_DOWNLOAD_PATH;

            let EXTENSION = EXTENSIONParam;
            const createFolderResult = await createFolder(path);
            if (createFolderResult) {
                path = path + `${RandomID(20)}.${EXTENSION}`;
            }
            else {
                path = LOCAL_DOWNLOAD_PATH + `${RandomID(20)}.${EXTENSION}`;
            }



            path = await createPath(FILE_TO_DOWNLOAD, path);

            RNFS.downloadFile({
                fromUrl: FILE_TO_DOWNLOAD,
                toFile: path,
                background: true,
                discretionary: true,
                cacheable: true,

                begin: (res) => {
                    let cd = res.headers["Content-Disposition"]
                    let regexString = /filename[^;\n=]*=((['"]).*?\2|[^;\n]*)/
                    let fileName = cd.match(regexString)[1]
                    path = LOCAL_DOWNLOAD_PATH + fileName;
                    callBackBegin(res, path);
                },
                progress: (res) => {
                    // stopDownload
                    let progressPercent = (res.bytesWritten / res.contentLength) * 100;
                    callBackProgress(progressPercent.toFixed(0))
                }
            })
                .promise.then(async res => {

                    let ret = {};
                    ret["url"] = path;
                    resolve(ret);
                }).catch(err => {
                    console.warn('ERROR ONLINE FILE DOWNLOAD', err);
                    resolve(false);
                })



        })//end of  PROMISE
    },//end of PDF

    DOWNLOAD(FILE_TO_DOWNLOAD, FILENAME) {
        return new Promise(async (resolve) => {

            let path = LOCAL_DOWNLOAD_PATH;
            const createFolderResult = await createFolder(path);
            if (createFolderResult) {
                path = path + `${FILENAME}.pdf`;
            }
            else {
                path = LOCAL_DOWNLOAD_PATH + `${FILENAME}.pdf`;
            }

            RNFetchBlob.config({
                addAndroidDownloads: {
                    useDownloadManager: true, // <-- this is the only thing required
                    // Optional, override notification setting (default to true)
                    notification: true,
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    mime: 'pdf',
                    description: Language["1"],
                    path: path
                }
            })
                .fetch('GET', FILE_TO_DOWNLOAD)
                .then((resp) => {
                    // the path of downloaded file
                    let ret = {};
                    ret["url"] = path;
                    resolve(ret);

                }).catch(err => {
                    resolve(false);
                })
        })//end of PROMISE
    },//end of DOWNLOAD

    DeleteFile(path) {
        return new Promise((resolve) => {
            RNFS.unlink(path)
                .then(() => {
                    resolve(true);
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    resolve(false);
                });
        })
    },//end of DELETE_FILE


}


const createPath = (FILE_TO_DOWNLOAD, oldPath) => {
    return new Promise((resolve) => {
        let path = "";
        RNFS.downloadFile({
            fromUrl: FILE_TO_DOWNLOAD,
            toFile: oldPath,
            background: true,
            discretionary: true,
            cacheable: true,

            begin: (res) => {
                let cd = res.headers["Content-Disposition"]
                let regexString = /filename[^;\n=]*=((['"]).*?\2|[^;\n]*)/
                let fileName = cd.match(regexString)[1]
                path = LOCAL_DOWNLOAD_PATH + fileName;
                RNFS.stopDownload(res.jobId)
                resolve(path);
            },
        })
    })//end of PROMISE
}//end of createPATH

export const createFolder = (PATH) => {
    return new Promise(async (resolve) => {

        let exist = await RNFS.exists(PATH);
        if (!exist) {
            RNFS.mkdir(PATH).then(res => {
                resolve(true);
            }).catch(err => {
                resolve(false);
            });
        }
        resolve(true);
    })//end of promise
}//end of CREATE_FOLDER

