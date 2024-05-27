import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable, TextInput, Switch } from "react-native";
import { Link } from "expo-router";

export default function Register() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkModeContainer]}>
      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, isDarkMode && styles.switchTextDark]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Username..."
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Your Password..."
        placeholderTextColor="gray"
        secureTextEntry={true}
      />

      <Link href="/(tabs)" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </Link>

      <Link href="/register" asChild>
        <Text style={styles.registerText}>
          Don't have an account? Register
        </Text>
      </Link>
    </View>
  );
}

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
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: "brown",
    textAlign: "center",
  },
});
