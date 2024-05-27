import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

const Index: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Add state for dark mode
  const [currentAmount, setCurrentAmount] = useState(0);
  const navigation = useNavigation();

  const handleCoinPress = (): void => {
    setCurrentAmount(currentAmount + 1);
  };

  const handleLogout = (): void => {
    console.log('User logged out');
  };

  const toggleDropdown = (): void => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleDarkMode = (): void => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkModeContainer]}> 
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, isDarkMode && styles.darkModeText]}>{currentAmount} $</Text> 
        </View>
        <Pressable onPress={toggleDropdown} style={styles.accountContainer}>
          <MaterialIcons name="account-circle" size={30} color="black" />
          <Text style={[styles.username, isDarkMode && styles.darkModeText]}>Username</Text> 
        </Pressable>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <Link href='/'>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
            </Link>
          </View>
        )}
      </View>

      <Pressable style={styles.coinContainer} onPress={handleCoinPress}>
        <Image
          source={require('@/assets/images/ahadu-coin.png')}
          style={styles.coinImage}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  darkModeContainer: { // Dark mode container styles
    backgroundColor: '#222222',
  },
  darkModeText: { // Dark mode text styles
    color: 'white',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    position: 'absolute',
    top: 100,
    left: '55%', // Center the amount above the coin container
    transform: [{ translateX: -50 }], // Center the amount horizontally
  },
  amount: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'goldenrod',
  },
  accountContainer: {
    position: 'absolute',
    top: 0,
    right: 20, // Position the account container at the top right
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  username: {
    fontSize: 16,
    marginLeft: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 20, // Position the dropdown at the top right
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    padding: 0,
    zIndex: 1,
  },
  logoutButton: {
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: 'brown',
  },
  coinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  coinImage: {
    width: 350,
    height: 350,
  },
});

export default Index;
