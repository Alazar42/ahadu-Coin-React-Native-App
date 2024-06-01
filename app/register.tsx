import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!firstName) newErrors.push('First Name is required.');
    if (!lastName) newErrors.push('Last Name is required.');
    if (!email) newErrors.push('Email is required.');
    if (!username) newErrors.push('Username is required.');
    if (!password) newErrors.push('Password is required.');
    if (!confirmPassword) newErrors.push('Confirm Password is required.');
    if (password !== confirmPassword) newErrors.push('Passwords do not match.');
    if (password && password.length < 6) newErrors.push('Password must be at least 6 characters long.');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('https://tap-coin-backend.onrender.com/api/v1/auth-register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert('Registration Successful', 'You have successfully registered!');
      router.replace('/');
    } catch (error) {
      console.error('Error:', error);
      setErrors([(error as Error).message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTER</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="gray"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="gray"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="gray"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}

      <Pressable style={styles.button} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.buttonText}>REGISTER</Text>
        )}
      </Pressable>

      <Link href="/" asChild>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </Link>
    </View>
  );
};

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
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    textAlign: 'center',
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: 'brown',
    textAlign: 'center',
  },
});

export default Register;
