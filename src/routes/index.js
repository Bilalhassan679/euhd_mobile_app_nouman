import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import { View } from "react-native";
import _retrieveData from "../sharedPreferences/_retrieveData";
// screens Import
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import ForgetPassword from "../screens/ForgetPassword";
import OtpVerification from "../screens/OtpVerification";
import Downloads from "../screens/Downloads";
import sharedPreferencesKeys from "../sharedPreferences/sharedPreferencesKeys";
// screens Import End

const Stack = createStackNavigator();
const initialRouteName = "Login";

console.disableYellowBox = true;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLoggedIn: false,
    };
  }

  componentDidMount = async () => {
    const loginId = await _retrieveData(sharedPreferencesKeys.loginData);
    if (loginId) {
      this.setState({
        isLoggedIn: true,
        loading: false,
      });
    } else {
      this.setState({
        isLoggedIn: false,
        loading: false,
      });
    }
  };

  setIsLoggedIn = (isLoggedIn) => {
    this.setState({ isLoggedIn });
  };

  beforeLogin = () => {
    const LoginScreens = (props) => (
      <Login {...props} setIsLoggedIn={this.setIsLoggedIn} />
    );
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreens} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
      </Stack.Navigator>
    );
  };

  render() {
    if (this.state.loading) {
      return <View />;
    }
    return (
      <NavigationContainer independent={true}>
        {this.state.isLoggedIn ? this.afterLogin() : this.beforeLogin()}
      </NavigationContainer>
    );
  } //end oF RENDER

  afterLogin = () => {
    const DashboardScreens = (props) => (
      <Dashboard {...props} setIsLoggedIn={this.setIsLoggedIn} />
    );
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreens} />
        <Stack.Screen name="Downloads" component={Downloads} />
      </Stack.Navigator>
    );
  }; //end of AFTER LOGIN
} //end of Class
