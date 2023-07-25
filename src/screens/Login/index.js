import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {PROD_API_URL} from '@env';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import colors from '../../constants/colors';
import LocalImages from '../../helper/LocalImages';
import {closeApp, emptyValidate} from '../../helper/genericFunctions';
import {Language} from '../../locales';
import _storeData from '../../sharedPreferences/_storeData';
import sharedPreferencesKeys from '../../sharedPreferences/sharedPreferencesKeys';
import OtpVerification from '../OtpVerification';
import {styles} from './styles';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // inputEmail Start
      // abdurrahman.313205048@uhd.edu.iq PDF Crash Check
      // test11 Login OTP Verifcation
      inputEmail: __DEV__ ? 'test11' : '',
      // inputEmail: 'test.2020@uhd.edu.iq',
      inputEmailError: false,
      // inputEmail End

      // inputPassword Start
      // uhd20 PDF Crash Check
      // 111 Login OTP Verifcation
      inputPassword: __DEV__ ? '111' : '',
      // inputPassword: 'uhd123',
      inputPasswordError: false,
      // inputPassword End

      loginLoading: false,

      forgetLoading: false,

      keyboardVisible: false,

      isTwoFactorEnabled: false,
      twoFactorParams: null,
    };
  }

  backAction = () => {
    closeApp();
    return true;
  };

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  loginFunctionality = async () => {
    if (this.state.loginLoading) return;
    if (
      emptyValidate(this.state.inputEmail) &&
      !this.state.inputEmailError &&
      emptyValidate(this.state.inputPassword) &&
      !this.state.inputPasswordError
    ) {
      this.setState({
        loginLoading: true,
      });

      try {
        console.info(
          'FILTERING LOGGER ----- URL------  ',
          PROD_API_URL + 'web/check/2f',
        );
        const check_2f = await fetch(PROD_API_URL + 'web/check/2f', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              db: 'uhd',
              login: this.state.inputEmail,
              password: this.state.inputPassword,
            },
          }),
        });

        let is2faRequired = false;
        const check_2fData = await check_2f.json();
        console.info(
          'FILTERING LOGGER ----- check_2fData  ------  ',
          check_2fData,
        );
        // console.log('totpData................:', check_2f);
        if ('result' in check_2fData) {
          if ('is_2FA' in check_2fData.result) {
            console.log('2f required proceed with /web/check/totp');
            is2faRequired = true;
          } else if (
            'is_login' in check_2fData.result &&
            check_2fData.result.is_login
          ) {
            is2faRequired = false;
            console.log(
              '2f not required proceed with /web/session/authenticate',
            );
          } else {
            console.log('2F error');
            alert('Something went wrong, please try later!');
            this.setState({loginLoading: false});
            return;
          }
        }

        const authenticateParams = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: 'uhd',
            login: this.state.inputEmail,
            password: this.state.inputPassword,
          },
        };
        const response = await fetch(
          PROD_API_URL + 'web/session/authenticate',
          {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(authenticateParams),
          },
        );
        console.log('session................:', response);

        if (!response.ok) {
          // Handle error response
          console.log('Error:', response.status);
          alert('Something went wrong, please try later!');
          this.setState({loginLoading: false});
          return;
        }
        const headers = response.headers.map;
        const setCookieHeader = headers['set-cookie'];
        const sessionID = setCookieHeader.split('=')[1].split(';')[0];

        // Get the session_id from the response and use it in the /web/login/totp API.

        // Set session id and two factor authentication flag

        this.setState({loginLoading: false});
        if (is2faRequired) {
          this.setState({
            isTwoFactorEnabled: true,
            twoFactorParams: {
              data: authenticateParams,
              setIsLoggedIn: val => this.props.setIsLoggedIn(val),
              result: response.json(),
              sessionID,
            },
          });
          // this.props.navigation.replace("OtpVerification",);
        } else {
          await _storeData(sharedPreferencesKeys.loginData, authenticateParams);
          await _storeData(sharedPreferencesKeys.userData, response.json());

          this.props.setIsLoggedIn(true);
        }

        console.log('session................:', sessionID);
      } catch (error) {
        console.log('Error:', error);
        alert('Something went wrong, please try later!');
        this.setState({loginLoading: false});
      }
    } else {
      if (!emptyValidate(this.state.inputEmail) || this.state.inputEmailError) {
        this.setState({
          inputEmailError: true,
        });
      }
      if (
        !emptyValidate(this.state.inputPassword) ||
        this.state.inputPasswordError
      ) {
        this.setState({
          inputPasswordError: true,
        });
      }
    }
  };
  loginPress = async () => {
    Keyboard.dismiss();

    this.loginFunctionality();
  };

  render() {
    if (this.state.isTwoFactorEnabled) {
      return (
        <OtpVerification
          params={this.state.twoFactorParams}
          onBack={() => {
            this.setState({isTwoFactorEnabled: false});
          }}
        />
      );
    }
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <StatusBar
          backgroundColor={colors.background}
          barStyle={'dark-content'}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            {/* ******************** BODY Start ******************** */}

            <View style={styles.logoContainer}>
              <Image source={LocalImages.logo} style={styles.logo} />
            </View>

            <CustomTextInput
              textInputStyle={styles.textInput}
              placeholder={Language['1']}
              value={this.state.inputEmail}
              autoFocus
              onChangeText={text => {
                this.setState({
                  inputEmail: text,
                  inputEmailError: false,
                });
              }}
              errorText={Language['4']}
              error={this.state.inputEmailError}
              autoCapitalize="none"
            />
            <CustomTextInput
              textInputStyle={styles.textInput}
              placeholder={Language['2']}
              secureTextEntry
              value={this.state.inputPassword}
              onChangeText={text => {
                this.setState({
                  inputPassword: text,
                  inputPasswordError: false,
                });
              }}
              errorText={Language['5']}
              error={this.state.inputPasswordError}
              autoCapitalize="none"
            />

            <CustomButton
              loading={this.state.loginLoading}
              styleButton={styles.button}
              title={Language['3']}
              onPress={this.loginPress}
            />

            <CustomButton
              mode="text"
              title={Language['6']}
              onPress={this.forgetPress}
            />

            {/* ******************** BODY End ******************** */}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  } //end of RENDER

  forgetPress = () => {
    this.props.navigation.navigate('ForgetPassword');
  };
}
