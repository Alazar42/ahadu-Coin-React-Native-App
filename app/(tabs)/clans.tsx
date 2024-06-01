import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert, Modal, TextInput, Button, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Clan {
  _id: string;
  name: string;
  leader: string;
  description: string;
  members: string[];
}

const Clans: React.FC = () => {
  const [expandedClan, setExpandedClan] = useState<string | null>(null);
  const [clansData, setClansData] = useState<Clan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newClanName, setNewClanName] = useState("");
  const [newClanDescription, setNewClanDescription] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // New state for member modal
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [membersList, setMembersList] = useState<string[]>([]);

  useEffect(() => {
    const fetchTokenAndCurrentUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          await fetchCurrentUser(storedToken);
        }
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchTokenAndCurrentUser();
  }, []);

  const fetchCurrentUser = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://tap-coin-backend.onrender.com/api/v1/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from fetchCurrentUser:', data);
      setCurrentUsername(data.username);
      fetchClans(token); 
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClans = async (token: string) => {
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

      const data: Clan[] = await response.json();
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClans(token);
    setRefreshing(false);
  };

  const toggleExpansion = (clanId: string) => {
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
        else if (response.status === 400) {
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
      await fetchClans(token); // Call fetchClans after successful clan creation
      await fetchCurrentUser(token);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveClan = async (clanId: string) => {
    try {
      const response = await fetch("https://tap-coin-backend.onrender.com/api/v1/clans/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clan_id: clanId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert("Success", "You have left the clan.");
      // You may want to refetch the clans after leaving to update the UI
      await fetchClans(token);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleJoinClan = async (clanId: string) => {
    try {
      const response = await fetch("https://tap-coin-backend.onrender.com/api/v1/clans/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clan_id: clanId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (response.status === 400) {
          throw new Error('User is already in a clan');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert("Success", "You have joined the clan!");
      // You may want to refetch the clans after joining to update the UI
      await fetchClans(token);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleDeleteClan = async (clanId: string) => {
    try {
      const response = await fetch(`https://tap-coin-backend.onrender.com/api/v1/clans/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "clan_id": clanId })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted clan from the state
      setClansData(clansData.filter(clan => clan._id !== clanId));
      Alert.alert("Success", "Clan deleted successfully!");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleShowMembers = (members: string[]) => {
    setMembersList(members);
    setMembersModalVisible(true);
  };

  const renderItem = ({ item }: { item: Clan }) => {
    const isMember = item.members.includes(currentUsername);

    return (
      <View style={styles.clanItem}>
        <Pressable onPress={() => toggleExpansion(item._id)} style={styles.clanHeader}>
          <Text style={styles.clanName}>{item.name}</Text>
          <Text style={styles.usersCount}>{item.members.length} Members</Text>
        </Pressable>
        {expandedClan === item._id && (
          <View style={styles.expandedContent}>
            <View style={styles.detailsContainer}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Leader:</Text>
                <Text style={styles.detailText}>{item.leader}</Text>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailText}>{item.description}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.membersButton}
                  onPress={() => handleShowMembers(item.members)}
                >
                  <Text style={styles.membersButtonText}>Members</Text>
                </Pressable>
                {item.leader === currentUsername ? (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDeleteClan(item._id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                ) : isMember ? (
                  <Pressable
                    style={styles.leaveButton}
                    onPress={() => handleLeaveClan(item._id)}
                  >
                    <Text style={styles.leaveButtonText}>Leave</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.joinButton}
                    onPress={() => handleJoinClan(item._id)}
                  >
                    <Text style={styles.joinButtonText}>Join</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

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
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl colors={['goldenrod']} refreshing={refreshing} onRefresh={onRefresh} />
          }
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
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Button title="Create" onPress={handleCreateClan} color="brown" />
            <Text>          </Text>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={membersModalVisible}
        onRequestClose={() => setMembersModalVisible(false)}
      >
        <View style={styles.membersModalView}>
          <Text style={styles.modalTitle}>Clan Members</Text>
          <ScrollView style={styles.membersList}>
            {membersList.map((member, index) => (
              <Text key={index} style={styles.memberName}>{`${index + 1}. ${member}`}</Text>
            ))}
          </ScrollView>
          <Button title="Close" onPress={() => setMembersModalVisible(false)} color="red" />
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  joinButton: {
    width:100,
    textAlign:'center',
    backgroundColor: 'goldenrod',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 135,
  },
  joinButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    width:100,
    textAlign:'center',
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 135,
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
    backgroundColor: 'goldenrod',
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white'
  },
  leaveButton: {
    width:100,
    textAlign:'center',
    backgroundColor: 'goldenrod',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 135,
  },
  leaveButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  membersButton: {
    backgroundColor: 'goldenrod',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  membersButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  membersModalView: {
    margin: 20,
    backgroundColor: 'goldenrod',
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
  membersList: {
    gap:5,
    marginVertical: 10,
    width: '100%',
  },
  memberName: {
    borderBottomWidth:1,
    borderBottomColor:'white',
    paddingBottom:10,
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
  },
});

export default Clans;
