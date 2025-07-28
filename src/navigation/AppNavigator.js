import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import LoginScreen from "../screeens/LoginScreen";
import HomeScreen from "../screeens/HomeScreen";
import RegistrationScreen from "../screeens/RegistrationScreen";
import ProfileScreen from "../screeens/ProfileScreen";
import SettingsScreen from "../screeens/SettingScreen";
import Notifictions from "../screeens/Notifications";
import SoilAnalysis from "../screeens/SoilAnalysis";
import ForgotPassword from "../screeens/ForgotPassword";
import ResetPassword from "../screeens/ResetPassword";
import PrivacyAndSecurity from "../screeens/PrivacyAndSecurity";
import HelpAndSupport from "../screeens/HelpAndSupport";
import FarmIdentification from "../screeens/FarmIdentification";
import PestAnalysis from "../screeens/PestAnalysis";
import CummunityAndChat from "../screeens/CummunityAndChat";
import ChatBox from "../screeens/ChatBox";
import DetailsWeather from "../screeens/DetailsWeather";
import Botanic from "../screeens/Botanic";
import Report from "../screeens/Report";
import IpInputScreen from "../screeens/IpInputScreen";
import IpInputScreenLoggedIn from "../screeens/IpInputScreenLoggedIn";
import PaymentScreen from "../screeens/PaymentScreen";
import PaymentConfirm from "../screeens/PaymentConfirm";
import PasswordConfirm from "../screeens/PasswordConfirm";
import { initBaseUrl } from '../utils/sharesUtils';
import { useState,useEffect } from "react";
const Stack = createStackNavigator();

const AppNavigator = () => {
  
  const { user, userToken } = useContext(AuthContext); // Check if user is authenticated

  const [ipSet, setIpSet] = useState(false); 
  useEffect(() => {
    console.log("AppNavigator mounted");
    const checkIp = async () => {
      const ip = await AsyncStorage.getItem('user_ip');
      if (ip) {
        await initBaseUrl();
        setIpSet(true);
      } else {
        setIpSet(false);
      }
    };
    checkIp();
  }, []);

   // Or show splash


  return (
    <Stack.Navigator>
      {!userToken ?   (
        <>
        
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
           <Stack.Screen 
            name="IpInputLoggedIn" 
            component={IpInputScreenLoggedIn} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ headerShown: true, title: 'Profile' }} 
          />
          <Stack.Screen 
            name="Report" 
            component={Report} 
            options={{ headerShown: true, title: 'Report' }} 
          />
           <Stack.Screen 
            name="DetailWeather" 
            component={DetailsWeather} 
            options={{ headerShown: true, title: 'Weather' }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ headerShown: true, title: 'Settings' }} 
          />
          <Stack.Screen 
            name="Notification" 
            component={Notifictions} 
            options={{ headerShown: true, title: 'Notifications' }} 
          />
          <Stack.Screen 
            name="SoilAnalysis" 
            component={SoilAnalysis} 
            options={{ headerShown: true, title: 'Soil Analysis' }} 
          />
          <Stack.Screen 
            name="privacyAndSecurity" 
            component={PrivacyAndSecurity} 
            options={{ headerShown: true, title: 'Privacy and Security' }} 
          />
          <Stack.Screen 
            name="HelpAndSupport" 
            component={HelpAndSupport} 
            options={{ headerShown: true, title: 'Help and Support' }} 
          />
          <Stack.Screen 
            name="FarmIdentification" 
            component={FarmIdentification} 
            options={{ headerShown: true, title: 'Farm Identification' }} 
          />
          <Stack.Screen 
            name="PestAnalysis" 
            component={PestAnalysis} 
            options={{ headerShown: true, title: 'Pest Analysis' }} 
          />
          <Stack.Screen 
            name="CummunityChat" 
            component={CummunityAndChat} 
            options={{ headerShown: true, title: 'Cummunity Chat' }} 
          />
           <Stack.Screen 
            name="ChatBox" 
            component={ChatBox} 
            options={{ headerShown: true, title: 'Chat' }} 
          />
          <Stack.Screen 
            name="Botanic" 
            component={Botanic} 
            options={{ headerShown: true, title: 'Botanic' }} 
          />
           <Stack.Screen 
            name="Payment" 
            component={PaymentScreen} 
            options={{ headerShown: true, title: 'Payment' }} 
          />
          <Stack.Screen 
            name="PaymentConfirm" 
            component={PaymentConfirm} 
            options={{ headerShown: true, title: 'Payment Confirm' }} 
          />
        </>
      ) : (
        // Show unauthenticated screens
        <>
        
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Registration" 
            component={RegistrationScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPassword} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ResetPassword" 
            component={ResetPassword} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="PasswordConfirm" 
            component={PasswordConfirm} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="IpInput" 
            component={IpInputScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
