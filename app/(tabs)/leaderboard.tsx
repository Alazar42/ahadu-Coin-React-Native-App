import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
  coin_balance: number;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await fetch('https://tap-coin-backend.onrender.com/api/v1/users/list', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data: User[] = await response.json();
        setUsers(data);
      } else {
        Alert.alert('Error', 'User token not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  // Render item for each user
  const renderUserItem = ({ item, index }: { item: User; index: number }) => {
    let backgroundColor = '#fff';
    if (index === 0) backgroundColor = '#FFD700'; // Gold for 1st place
    if (index === 1) backgroundColor = '#C0C0C0'; // Silver for 2nd place
    if (index === 2) backgroundColor = '#CD7F32'; // Bronze for 3rd place

    return (
      <View style={[styles.userItem, { backgroundColor }]}>
        <Text style={styles.userIndex}>{index + 1}.</Text>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userBalance}>{item.coin_balance} ፩</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.userList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'goldenrod',
    textAlign: 'center',
  },
  userList: {
    paddingTop: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  userIndex: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    color: 'black',
    flex: 1,
  },
  userBalance: {
    fontSize: 18,
    color: 'black',
  },
});

export default Leaderboard;
