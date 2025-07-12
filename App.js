import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { initBaseUrl } from "./src/utils/sharesUtils";
const Stack = createStackNavigator();


import  { useEffect, useState } from 'react';

export default function App() {
    const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initBaseUrl(); // ✅ Load base URL from AsyncStorage
      setReady(true);
    };
    init();
  }, []);



  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
    
  );
}