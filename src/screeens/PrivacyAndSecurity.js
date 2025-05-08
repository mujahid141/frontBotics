import React, { useContext } from "react";
import { Text, View } from "react-native"; // Importing Text and View from react-native
import { AuthContext } from "../context/AuthContext";

const PrivacyAndSecurity = () => {
    const { user } = useContext(AuthContext); // Example use of AuthContext

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Notifictions</Text>
            {user && <Text>Welcome, {user.name}!</Text>}
        </View>
    );
};

export default PrivacyAndSecurity;
