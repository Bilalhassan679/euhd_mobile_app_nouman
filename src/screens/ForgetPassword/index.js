import React, {Component} from 'react';
import {Dimensions, SafeAreaView, StatusBar, View} from 'react-native';
import {FORGET_URL, LOGIN_URL, LOGIN_URL_SECURE} from '@env';
import * as Progress from 'react-native-progress';
import {WebView} from 'react-native-webview';
import CustomLoader from '../../components/CustomLoader';
import colors from '../../constants/colors';
import {styles} from './styles';

let timer = null;
const WIDTH = Dimensions.get('screen').width;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      progress: 0,
    };
  }

  back = () => {
    this.props.navigation.goBack(null);
  };

  handleWebViewNavigationStateChange = async newNavState => {
    const {url} = newNavState;
    if (url.includes(LOGIN_URL) || url.includes(LOGIN_URL_SECURE)) {
      this.back();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle={'dark-content'}
        />
        <SafeAreaView />
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
            source={{uri: FORGET_URL}}
            style={styles.webView}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
            originWhitelist={['*']}
          />
        </View>
      </View>
    );
  } //end of RENDER

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
