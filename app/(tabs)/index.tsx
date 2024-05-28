import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface UserData {
  username: string;
  coin_balance: number;
}

const Index: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<string>('0');
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await fetch('https://tap-coin-backend.onrender.com/api/v1/users/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data: UserData = await response.json();
          setUsername(data.username);

          // Set the current amount with coin_balance from the response
          if (typeof data.coin_balance !== 'undefined') {
            setCurrentAmount(data.coin_balance.toString());
          }
        } else {
          router.push('/'); // Redirect to login if no token is found
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();

    // Fetch user data every 10 seconds to update the balance
    const interval = setInterval(fetchUserData, 10000);

    return () => clearInterval(interval);
  }, []);

  const sendUpdatedAmount = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('User token not found');
      }

      const response = await fetch('https://tap-coin-backend.onrender.com/api/v1/users/increment-balance', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseInt(currentAmount) }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user balance');
      }

      console.log('User balance updated successfully');
    } catch (error) {
      console.error('Error updating user balance:', error);
      Alert.alert('Error', 'Failed to update user balance');
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('User token not found');
      }
  
      const response = await fetch('https://tap-coin-backend.onrender.com/api/v1/auth-logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
  
      await AsyncStorage.removeItem('userToken');
      router.push('/'); // Redirect to login after logout
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };
  

  const toggleDropdown = (): void => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleDarkMode = (): void => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleCoinPress = (): void => {
    setCurrentAmount((parseInt(currentAmount) + 1).toString());
    sendUpdatedAmount(); // Send the updated amount immediately after pressing the coin
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkModeContainer]}>
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, isDarkMode && styles.darkModeText]}>{currentAmount} $</Text>
        </View>
        <Pressable onPress={toggleDropdown} style={styles.accountContainer}>
          <MaterialIcons name="account-circle" size={30} color="black" />
          <Text style={[styles.username, isDarkMode && styles.darkModeText]}>{username}</Text>
        </Pressable>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
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
  darkModeContainer: {
    backgroundColor: '#222222',
  },
  darkModeText: {
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
    width:'100%',
    top: 100,
    textAlign:'center',
  },
  amount: {
    textAlign:'center',
    fontSize: 35,
    fontWeight: 'bold',
    color: 'goldenrod',
  },
  accountContainer: {
    position: 'absolute',
    top: 0,
    right: 20,
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
    right: 20,
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
    marginTop:100,
    width: 350,
    height: 350,
  },
});

export default Index;
