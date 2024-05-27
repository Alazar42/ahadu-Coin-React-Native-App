import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Earn() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Add state for dark mode
  const navigation = useNavigation();
  const [currentAmount, setCurrentAmount] = useState(0);

  const handleCoinPress = (): void => {
    setCurrentAmount(currentAmount + 1);
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
        <View style={styles.darkModeSwitchContainer}>
          <Text style={[styles.darkModeText, { marginRight: 5 }]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>
      </View>

      <View style={styles.earnOptionsContainer}>
        <Text style={styles.earnOptionsTitle}>Earn Money:</Text>
        <Text style={styles.offerings}>1. Watch Ads</Text>
        <Text style={styles.offerings}>2. Complete Surveys</Text>
        <Text style={styles.offerings}>3. Play Games</Text>
        {/* Add more offering items here */}
      </View>
    </View>
  );
}

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
    left: '55%', // Center the amount above the earn options
    transform: [{ translateX: -50 }], // Center the amount horizontally
  },
  amount: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'goldenrod',
  },
  darkModeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnOptionsContainer: {
    marginTop: 150, // Adjust as needed
  },
  earnOptionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  offerings: {
    fontSize: 16,
    marginBottom: 5,
  },
});
