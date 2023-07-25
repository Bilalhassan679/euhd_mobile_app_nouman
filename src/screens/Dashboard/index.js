import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import {
  DEV_API_URL,
  ENVIRONMENT,
  LOGIN_URL,
  LOGIN_URL_SECURE,
  PROD_API_URL,
} from '@env';
import * as Progress from 'react-native-progress';
import {WebView} from 'react-native-webview';
import CustomLoader from '../../components/CustomLoader';
import colors from '../../constants/colors';
import Download from '../../helper/Download';
import {
  closeApp,
  emptyValidate,
  getDownloadDirectoryPath,
  getAllPaths,
  getSwiftPaths,
} from '../../helper/genericFunctions';
import sharedPreferencesKeys from '../../sharedPreferences/sharedPreferencesKeys';
import _deleteData from '../../sharedPreferences/_deleteData';
import {styles} from './styles';
import RNFS from 'react-native-fs';
import DownloadModal from '../../components/DownloadModal';
import {Language} from '../../locales';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

import CustomHeader from '../CustomHeader';

let timer = null;
const WIDTH = Dimensions.get('screen').width;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      loading: true,
      progress: 0,
      backClickCount: 0,

      downloadVisible: false,
      downloadProgress: 0,
      jobID: null,
      path: null,

      downloadIconVisible: false,
    };
  }

  exit = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => closeApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  backAction = () => {
    // console.warn('THIS.WEBREF', this.webref.props.source);
    this.setState({
      backClickCount: this.state.backClickCount + 1,
    });
    if (this.state.backClickCount > 2) {
      this.exit();
    }
    if (this.webref) {
      this.webref.goBack();
    }

    return true;
  };

  checkDownloadIcon = async () => {
    let isDownload = await Download.isAnyDownloaded();
    this.setState({
      downloadIconVisible: isDownload,
    });
  }; //end of checkDownloadIcon

  componentDidMount = () => {
    // this.shareToFiles("")

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.load();
  };

  load = async () => {
    let url = null;
    let classes = 'web';

    if (ENVIRONMENT == 'production') {
      // console.warn('PROD_API_URL', PROD_API_URL);
      url = PROD_API_URL + classes;
    } else {
      // console.warn('DEV_API_URL', DEV_API_URL);
      url = DEV_API_URL + classes;
    }
    this.setState({
      url,
    });
  };

  handleWebViewNavigationStateChange = async newNavState => {
    const {url} = newNavState;
    console.info('FILTERING LOGGER ----- urlurlurl  ------  ', url);
    this.setState({
      backClickCount: 0,
    });
    if (url.includes(LOGIN_URL) || url.includes(LOGIN_URL_SECURE)) {
      await _deleteData(sharedPreferencesKeys.loginData);
      await _deleteData(sharedPreferencesKeys.userData);
      this.props.setIsLoggedIn(false);
    }
  };

  stopDownload = () => {
    if (this.state.jobID !== null) {
      RNFS.stopDownload(this.state.jobID);
      this.setState({
        downloadProgress: 0,
        downloadVisible: false,
        jobID: null,
        path: null,
      });
    }
  }; //end of stopDownload

  downloadBegin = (begin, path) => {
    this.setState({
      jobID: begin.jobId,
      path: path,
    });
  }; //end of downloadBegin

  downloadProgress = progress => {
    this.setState({downloadProgress: progress});
  }; //end of downloadProgress

  onFileDownload = async ({nativeEvent}) => {
    console.info(
      'FILTERING LOGGER ----- onFileDownload  ------  ',
      nativeEvent,
    );
    // alert("File download detected", nativeEvent.downloadUrl);
    if (Platform.OS === 'ios') {
      let downloadURL = nativeEvent.downloadUrl;
      console.warn(downloadURL);
      this.webref.stopLoading();
      this.webref.goBack();
      this.hideSpinner();
      this._showDownloadModal();
      let res = await Download.DOWNLOADIOS(
        downloadURL,
        this.downloadBegin,
        this.downloadProgress,
      );
      this._hideDownloadModal();

      if (res) {
        console.warn(res);
      }
    }
  };

  shareToFiles = async path => {
    console.warn(path);
    const shareOptions = {
      title: 'Save file',
      failOnCancel: false,
      saveToFiles: true,

      urls: [path], // base64 with mimeType or path to local file
    };

    // If you want, you can use a try catch, to parse
    // the share response. If the user cancels, etc.
    try {
      const shareResponse = await Share.open(shareOptions);
      console.warn(shareResponse);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  _showDownloadModal = () => {
    this.setState({downloadProgress: 0, downloadVisible: true});
  };
  _hideDownloadModal = () => {
    this.setState({downloadVisible: false});
  };

  _showDownloadIconVisible = () => {
    this.setState({downloadIconVisible: true});
  };
  _hideDownloadIconVisible = () => {
    this.setState({downloadIconVisible: false});
  };

  downloadPress = () => {
    this.props.navigation.navigate('Downloads');
  }; //end of downloadPress

  _renderHeader = () => {
    return (
      <>
        {Platform.OS === 'ios' ? (
          !this.state.loading ? (
            <>
              <SafeAreaView style={{backgroundColor: colors.header}} />
              <StatusBar
                backgroundColor={colors.header}
                barStyle={'dark-content'}
              />
              <CustomHeader
                downloadVisible
                downloadPress={this.downloadPress}
              />
            </>
          ) : (
            <>
              <SafeAreaView />
              <StatusBar
                backgroundColor={colors.statusbar}
                barStyle={'dark-content'}
              />
            </>
          )
        ) : (
          <>
            <SafeAreaView />
            <StatusBar
              backgroundColor={colors.statusbar}
              barStyle={'dark-content'}
            />
          </>
        )}
      </>
    );
  }; //end of _renderHeader

  render = () => {
    return (
      <View style={styles.container}>
        {this._renderHeader()}

        {this.state.loading && (
          <View style={{width: WIDTH}}>
            <Progress.Bar
              progress={this.state.progress / 100}
              width={WIDTH}
              borderColor={'transparent'}
              color={colors.button}
            />
          </View>
        )}

        <View
          style={this.state.loading ? styles.showLoader : styles.hideLoader}>
          {this.state.loading && (
            <CustomLoader style={styles.loaderContainer} />
          )}

          <WebView
            ref={r => (this.webref = r)}
            onLoadStart={() => this.showSpinner()}
            onLoad={() => this.hideSpinner()}
            onNavigationStateChange={this.handleWebViewNavigationStateChange}
            allowsBackForwardNavigationGestures
            allowsFullscreenVideo
            scrollEnabled
            allowFileAccess
            javaScriptEnabled
            domStorageEnabled
            allowsLinkPreview
            cacheEnabled
            geolocationEnabled
            sharedCookiesEnabled
            source={{
              uri:
                // "https://abc.uhd.edu.iq/web/content/83152?download=true"
                // "https://abc.uhd.edu.iq/web#id=4833&model=ums.course.content&view_type=form&menu_id=498"
                emptyValidate(this.state.url) ? this.state.url : PROD_API_URL,
            }}
            style={styles.webView}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
            originWhitelist={['*']}
            onFileDownload={this.onFileDownload}
            onError={error => {
              console.info(
                'FILTERING LOGGER ----- ERROR ON WEBVIEW  ------  ',
                error,
              );
            }}
            onHttpError={error => {
              console.info(
                'FILTERING LOGGER ----- ERROR ON HTTP WEBVIEW  ------  ',
                error,
              );
            }}

            // {...platformProps}
          />
        </View>

        {/* ******************** MODEL's Start ******************** */}
        <DownloadModal
          visible={this.state.downloadVisible}
          title={Language['7']}
          onPress={() => {
            this.stopDownload();
          }}
          progressVisible={true}
          buttonVisible
          buttonTitle={Language['8']}
          progress={this.state.downloadProgress}
        />

        {/* ******************** MODEL's End ******************** */}
      </View>
    );
  }; //end of RENDER

  updateProgress = () => {
    if (this.state.progress > 90) {
      this.setState({
        progress: 0,
      });
    } else {
      this.setState({
        progress: this.state.progress + 5,
      });
    }
  };

  hideSpinner = () => {
    clearInterval(timer);
    this.setState({
      loading: false,
    });
  };

  showSpinner = () => {
    timer = setInterval(() => {
      this.updateProgress();
    }, 250);
    this.setState({
      loading: true,
    });
  };
}
