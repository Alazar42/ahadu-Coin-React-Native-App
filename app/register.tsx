import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { Link } from "expo-router";
import React from 'react'

const Register = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTER</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
        secureTextEntry={true}
      />

      <Link href="/(tabs)" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </Pressable>
      </Link>

      <Link href="/" asChild>
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'monospace',
    color: 'goldenrod',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: 'goldenrod',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: 'brown',
    textAlign: 'center',
  },
});

export default Register;
