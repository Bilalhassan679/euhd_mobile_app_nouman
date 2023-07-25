import React, {Component} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {PROD_API_URL} from '@env';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import colors from '../../constants/colors';
import {fontSizes, marginSizesHeight} from '../../constants/sizes';
import LocalImages from '../../helper/LocalImages';
import {Language} from '../../locales';
import _deleteData from '../../sharedPreferences/_deleteData';
import _storeData from '../../sharedPreferences/_storeData';
import sharedPreferencesKeys from '../../sharedPreferences/sharedPreferencesKeys';
import {styles} from './styles';
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // inputCode Start
      loading: false,
      inputCode: '',
      inputCodeError: false,
      // inputEmail End

      buttonLoading: false,
    };
  }

  navigateToHome = async () => {
    const {data, result, setIsLoggedIn} = this.props.params;
    await _storeData(sharedPreferencesKeys.loginData, data);
    await _storeData(sharedPreferencesKeys.userData, result);

    setIsLoggedIn(true);
  };

  onVerifyPress = async () => {
    if (this.state.inputCodeError) return;
    if (!this.state.inputCode || this.state.inputCode.length < 6) {
      this.setState({
        inputCodeError: true,
      });
      return;
    }

    this.setState({
      buttonLoading: true,
      inputCodeError: false,
    });

    const {login: email, password} = this.props.params.data.params;
    const totpParams = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: 'uhd',
        login: email,
        password: password,
        totp_token: this.state.inputCode,
      },
    };
    console.info('FILTERING LOGGER ----- totpParams  ------  ', totpParams);
    const totpResponse = await fetch(PROD_API_URL + 'web/check/totp', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(totpParams),
    });
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('session................:' + this.props.params.sessionID);

    const totpData = await totpResponse.json();
    console.log('totpData................:', totpData);
    if ('result' in totpData) {
      if ('uid' in totpData.result) {
        this.navigateToHome();
        console.log('Session............:', totpData.result);
      } else {
        console.log('result ............:', totpData.result);
        this.setState({
          inputCode: '',
          inputCodeError: false,
        });
        Alert.alert('Invalid code, please try again.');
      }
    }
    if ('error' in totpData) {
      this.setState({
        inputCode: '',
        inputCodeError: false,
      });
      Alert.alert('Something went wrong. Please try again!');
    }

    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

    this.setState({
      buttonLoading: false,
    });
  };

  onLearnMorePress = () => {
    const LEARN_MORE_URL = `https://www.odoo.com/documentation/15.0/applications/general/auth/2fa.html`;
    Linking.canOpenURL(LEARN_MORE_URL).then(supported => {
      if (supported) {
        Linking.openURL(LEARN_MORE_URL);
      } else {
        Alert.alert(
          'Oops! Something went wrong while opening link, please try again later.',
        );
      }
    });
  };

  render() {
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

            {/* ****************************** Start of TEXT DETAILS  ****************************** */}
            <CustomText
              style={{
                marginVertical: marginSizesHeight._16,
                fontWeight: 'bold',
                fontSize: fontSizes._20,
              }}>
              {Language['14']}
            </CustomText>
            <CustomText
              style={{
                color: 'grey',
                maxWidth: '65%',
              }}>
              {Language['15']}
            </CustomText>
            <TouchableOpacity
              style={{
                marginVertical: marginSizesHeight._16,
              }}
              onPress={this.onLearnMorePress}>
              <CustomText
                style={{
                  fontSize: fontSizes._18,
                }}>
                {Language['16']}
              </CustomText>
            </TouchableOpacity>

            {/* ****************************** End of TEXT DETAILS  ****************************** */}

            <CustomText
              style={{
                marginTop: marginSizesHeight._8,
                fontWeight: 'bold',
                fontSize: fontSizes._20,
              }}>
              {Language['13']}
            </CustomText>
            <CustomTextInput
              textInputStyle={styles.textInput}
              placeholder={Language['12']}
              value={this.state.inputCode}
              autoFocus
              onChangeText={text => {
                this.setState({
                  inputCode: text,
                  inputCodeError: false,
                });
              }}
              errorText={Language['17']}
              error={this.state.inputCodeError}
              keyboardType="number-pad"
              autoCapitalize="none"
            />

            <CustomButton
              loading={this.state.buttonLoading}
              styleButton={styles.button}
              title={Language['10']}
              onPress={this.onVerifyPress}
            />

            <CustomButton
              mode="text"
              title={Language['11']}
              onPress={this.backToLoginPress}
            />

            {/* ******************** BODY End ******************** */}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  } //end of RENDER

  backToLoginPress = async () => {
    await _deleteData(sharedPreferencesKeys.loginData);
    this.props.onBack();
  };
}
