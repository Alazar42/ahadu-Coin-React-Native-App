import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable, TextInput, Switch, Alert, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Directly call the token check function when the component mounts
  const checkToken = async () => {
    const savedToken = await AsyncStorage.getItem("userToken");
    if (savedToken) {
      setToken(savedToken);
      router.replace("/(tabs)");
    }
  };

  checkToken(); // Call the function here

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://tap-coin-backend.onrender.com/api/v1/auth-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setToken(data.access_token);
      setError("");
      await AsyncStorage.setItem("userToken", data.access_token);
      router.replace("/(tabs)");
      Alert.alert("Login Successful", "You have successfully logged in!");
    } catch (error) {
      console.error("Error:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkModeContainer]}>
      

      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
        placeholder="Enter Your Username..."
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        placeholder="Enter Your Password..."
        placeholderTextColor="gray"
        secureTextEntry={true}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="goldenrod" />
      ) : (
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      )}

      <Link href="/register" asChild>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
  },
  darkModeContainer: {
    backgroundColor: "#222222",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
    alignItems: "center",
  },
  switchText: {
    marginRight: 10,
    fontSize: 16,
    color: "black",
  },
  switchTextDark: {
    color: "white",
  },
  title: {
    fontSize: 40,
    fontFamily: "monospace",
    color: "goldenrod",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "goldenrod",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: "brown",
    textAlign: "center",
  },
});

export default Register;
