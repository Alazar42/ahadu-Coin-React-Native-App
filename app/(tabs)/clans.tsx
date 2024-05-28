import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Clan {
  id: string;
  name: string;
  leader: string;
  description: string;
  members: string[]; // Assuming users is an array of strings (usernames)
}

const Clans: React.FC = () => {
  const [expandedClan, setExpandedClan] = useState<string | null>(null); // Updated to handle string IDs
  const [clansData, setClansData] = useState<Clan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newClanName, setNewClanName] = useState("");
  const [newClanDescription, setNewClanDescription] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
    };

    fetchToken().then(fetchClans);
  }, [token]);

  useEffect(() => {
    // Fetch current user's username here and set it
    const fetchCurrentUser = async () => {
      // Replace this with your actual logic to fetch the current user's username
      const username = "current_username"; // Replace with actual username
      setCurrentUsername(username);
    };

    fetchCurrentUser();
  }, []);

  const fetchClans = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://tap-coin-backend.onrender.com/api/v1/clans/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Clan[] = await response.json(); // Assuming the response is an array of Clan objects
      if (data.length === 0) {
        setError("No clans available at the moment.");
      } else {
        setClansData(data);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpansion = (clanId: string) => { // Updated to handle string IDs
    setExpandedClan(expandedClan === clanId ? null : clanId);
  };

  const handleCreateClan = async () => {
    if (!newClanName || !newClanDescription) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://tap-coin-backend.onrender.com/api/v1/clans/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newClanName, description: newClanDescription }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        else if(response.status === 400){
          throw new Error("User already belongs to a clan");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newClan: Clan = await response.json();
      setClansData([...clansData, newClan]);
      setModalVisible(false);
      setNewClanName("");
      setNewClanDescription("");
      Alert.alert("Success", "Clan created successfully!");
      fetchClans(); // Call fetchClans after successful clan creation
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Clan }) => (
    <View style={styles.clanItem}>
      <Pressable onPress={() => toggleExpansion(item.id)} style={styles.clanHeader}>
        <Text style={styles.clanName}>{item.name}</Text>
        <Text style={styles.usersCount}>{item.members.length} Members</Text>
      </Pressable>
      {expandedClan === item.id && (
        <View style={styles.expandedContent}>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Leader:</Text>
              <Text style={styles.detailText}>{item.leader}</Text>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailText}>{item.description}</Text>
            </View>
            {item.leader === currentUsername ? ( // Check if the current user is the leader
              <Pressable style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clans</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="goldenrod" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={clansData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={50} color="goldenrod" />
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Create a New Clan</Text>
          <TextInput
            style={styles.input}
            placeholder="Clan Name"
            value={newClanName}
            onChangeText={setNewClanName}
          />
          <TextInput
            style={styles.input}
            placeholder="Clan Description"
            value={newClanDescription}
            onChangeText={setNewClanDescription}
          />
          <Button title="Create" onPress={handleCreateClan} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>
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
  clanItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  clanName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  usersCount: {
    fontSize: 16,
    color: 'gray',
  },
  expandedContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: 'black',
  },
  detailText: {
    fontSize: 16,
    color: 'black',
  },
  joinButton: {
    backgroundColor: 'goldenrod',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  joinButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default Clans;
